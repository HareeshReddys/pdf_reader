import { type ChildProcessWithoutNullStreams } from 'node:child_process';
import { spawnCodex } from './codexExecutable';
import { createInterface } from 'node:readline';

type Message = { id?: number; method?: string; params?: any; result?: any; error?: { code?: number; message?: string } };
type Waiter = { resolve: (value: any) => void; reject: (error: Error) => void; timer: NodeJS.Timeout };
type Turn = { text: string; items: Map<string, string>; partial?: (text: string) => void; resolve: (text: string) => void; reject: (error: Error) => void; timer: NodeJS.Timeout; turnId?: string };

/** A private stdio connection; no port, shell, or renderer access. */
export class CodexConnection {
  private child: ChildProcessWithoutNullStreams;
  private sequence = 0;
  private requests = new Map<number, Waiter>();
  private turns = new Map<string, Turn>();
  private closed = false;
  readonly ready: Promise<void>;

  constructor(command: string, fast: boolean) {
    this.child = spawnCodex(command, ['app-server', '-c', 'features.fast_mode=' + fast, '-c', 'web_search="disabled"', '-c', 'features.shell_tool=false']);
    this.child.stdin.on('error', () => undefined);
    this.child.stderr.resume(); // Never expose account/config diagnostics to the renderer.
    const lines = createInterface({ input: this.child.stdout });
    lines.on('line', (line) => {
      try { this.receive(JSON.parse(line) as Message); } catch { /* Non-protocol diagnostics. */ }
    });
    this.child.once('error', () => this.fail(new Error('Could not start Codex CLI. Check CODEX_CLI_PATH and run codex login.')));
    this.child.once('close', () => { lines.close(); this.fail(new Error('Codex connection closed. Check your connection and Codex login, then retry.')); });
    this.ready = this.call('initialize', { clientInfo: { name: 'interview_prep_copilot', title: 'Interview Prep Copilot', version: '0.1.0' } })
      .then(() => this.send({ method: 'initialized', params: {} }));
  }
  private send(message: Message): void {
    if (this.closed) throw new Error('Codex connection is closed.');
    this.child.stdin.write(JSON.stringify(message) + '\n');
  }
  private call(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      const timer = setTimeout(() => { this.requests.delete(id); reject(new Error('Codex connection timed out. Please retry.')); }, 30000);
      this.requests.set(id, { resolve, reject, timer });
      try { this.send({ id, method, params }); }
      catch (error) { clearTimeout(timer); this.requests.delete(id); reject(error); }
    });
  }
  private receive(message: Message): void {
    if (message.id !== undefined && !message.method) {
      const pending = this.requests.get(message.id);
      if (!pending) return;
      clearTimeout(pending.timer); this.requests.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message ?? 'Codex request failed.'));
      else pending.resolve(message.result);
      return;
    }
    // This application does not service agent tool/approval requests.
    if (message.id !== undefined && message.method) {
      this.send({ id: message.id, error: { code: -32601, message: 'Tools are unavailable in interview answer mode.' } });
      return;
    }
    const params = message.params;
    const turn = this.turns.get(params?.threadId);
    if (!turn) return;
    if (message.method === 'item/agentMessage/delta') {
      turn.items.set(params.itemId, (turn.items.get(params.itemId) ?? '') + params.delta);
      turn.text = [...turn.items.values()].join('\n\n');
      turn.partial?.(turn.text);
    } else if (message.method === 'item/completed' && params.item?.type === 'agentMessage') {
      turn.items.set(params.item.id, params.item.text);
      turn.text = [...turn.items.values()].join('\n\n');
      turn.partial?.(turn.text);
    } else if (message.method === 'turn/completed') {
      clearTimeout(turn.timer); this.turns.delete(params.threadId);
      if (params.turn.status !== 'completed') turn.reject(new Error(params.turn.error?.message ?? 'Codex could not finish the answer.'));
      else if (!turn.text.trim()) turn.reject(new Error('Codex returned an empty answer.'));
      else turn.resolve(turn.text.trim());
    }
  }
  async answer(prompt: string, cwd: string, model: string, fast: boolean, image?: string, partial?: (text: string) => void): Promise<string> {
    await this.ready;
    const response = await this.call('thread/start', {
      model, cwd, ephemeral: true, approvalPolicy: 'never', sandbox: 'read-only',
      baseInstructions: prompt, developerInstructions: 'Answer directly. Tools are unavailable. Never execute commands or access files.',
      serviceTier: fast ? 'fast' : 'default', config: { model_reasoning_effort: 'low', web_search: 'disabled', 'features.shell_tool': false },
    });
    const threadId = response.thread.id as string;
    try {
      return await new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => {
          const active = this.turns.get(threadId);
          this.turns.delete(threadId);
          const turnId = active?.turnId;
          if (turnId) void this.call('turn/interrupt', { threadId, turnId }).catch(() => undefined);
          reject(new Error('Codex timed out after 90 seconds. Try again or shorten the question.'));
        }, 90000);
        this.turns.set(threadId, { text: '', items: new Map(), partial, resolve, reject, timer });
        const input: any[] = [{ type: 'text', text: 'Answer the question in the provided instructions.', text_elements: [] }];
        if (image) input.push({ type: 'image', url: image });
        void this.call('turn/start', { threadId, input, effort: 'low' }).then((result) => {
          const active = this.turns.get(threadId); if (active) active.turnId = result.turn.id;
        }).catch((error) => {
          clearTimeout(timer); this.turns.delete(threadId); reject(error);
        });
      });
    } finally {
      void this.call('thread/unsubscribe', { threadId }).catch(() => undefined);
    }
  }
  private fail(error: Error): void {
    this.closed = true;
    for (const request of this.requests.values()) { clearTimeout(request.timer); request.reject(error); }
    this.requests.clear();
    for (const turn of this.turns.values()) { clearTimeout(turn.timer); turn.reject(error); }
    this.turns.clear();
  }
  dispose(): void { this.fail(new Error('Codex connection stopped.')); this.child.kill(); }
  get alive(): boolean { return !this.closed; }
}
