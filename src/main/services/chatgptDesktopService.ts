import { execFile, spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { promisify } from 'node:util';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
import { logDiagnostic } from './diagnosticsService';

const execute = promisify(execFile);
let queue: Promise<unknown> = Promise.resolve();
export function isChatGptDesktopEnabled(): boolean { return process.env.ANSWER_PROVIDER === 'chatgpt-desktop'; }

export async function getChatGptVoiceStatus(): Promise<{ active: boolean; microphoneEnabled: boolean; speakersMuted: boolean }> {
  const helper = await getChatGptDesktopHelper();
  const result = await execute(helper, ['--voice-status'], { windowsHide: true, timeout: 10000 });
  const status = JSON.parse(result.stdout);
  if (typeof status.active !== 'boolean') throw new Error('ChatGPT Voice status is unavailable.');
  return status;
}

export function attachScreenshotToVoiceChat(image: string): Promise<string> {
  return askChatGptDesktop('Use this screenshot as context for my next spoken question. Wait for that question; do not solve it yet.\nCapture reference: ' + randomUUID(), () => true, undefined, image, true);
}

export async function getChatGptDesktopHelper(): Promise<string> {
  if (process.platform !== 'win32') throw new Error('The ChatGPT desktop bridge currently requires Windows.');
  const projectRoot = path.resolve(__dirname, '../../..');
  const source = path.join(projectRoot, 'scripts', 'ChatGptDesktopBridge.cs');
  const directory = path.join(projectRoot, 'data', 'runtime');
  // A running reader locks its executable on Windows. Compile changed sources separately.
  const revision = createHash('sha256').update(await readFile(source)).digest('hex').slice(0, 12);
  const binary = path.join(directory, `ChatGptDesktopBridge-${revision}.exe`);
  await mkdir(directory, { recursive: true });
  const sourceTime = (await stat(source)).mtimeMs;
  if ((await stat(binary).catch(() => undefined))?.mtimeMs! >= sourceTime) return binary;
  const framework = path.join(process.env.SystemRoot || 'C:\\Windows', 'Microsoft.NET');
  const gac = path.join(framework, 'assembly', 'GAC_MSIL');
  const refs = ['UIAutomationClient', 'UIAutomationTypes', 'WindowsBase'].map(name => `/reference:${path.join(gac, name, 'v4.0_4.0.0.0__31bf3856ad364e35', name + '.dll')}`);
  await execute(path.join(framework, 'Framework64', 'v4.0.30319', 'csc.exe'), ['/nologo', `/out:${binary}`, ...refs, '/reference:System.Drawing.dll', '/reference:System.Windows.Forms.dll', '/reference:System.Web.Extensions.dll', source], { windowsHide: true, timeout: 30000 });
  return binary;
}

/** One desktop turn at a time; never silently resend an uncertain submission. */
export function askChatGptDesktop(prompt: string, isCurrent: () => boolean = () => true, onPartial?: (text: string) => void, screenshotDataUrl?: string, voiceContext = false): Promise<string> {
  const operation = queue.then(async () => {
    if (!isCurrent()) throw new Error('Desktop chat request cancelled before submission.');
    const binary = await getChatGptDesktopHelper();
    const directory = await mkdtemp(path.join(os.tmpdir(), 'copilot-desktop-chat-'));
    const id = randomUUID();
    const started = performance.now();
    let partial = ''; 
    try {
      const request = path.join(directory, 'request.json'), response = path.join(directory, 'response.json');
      let imagePath: string | undefined;
      if (screenshotDataUrl !== undefined) {
        if (!/^data:image\/png;base64,[A-Za-z0-9+/=\r\n]+$/.test(screenshotDataUrl)) throw new Error('Screenshot must be a PNG image.');
        const png = Buffer.from(screenshotDataUrl.slice(screenshotDataUrl.indexOf(',') + 1), 'base64');
        if (png.length < 8 || !png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || png.length > 20 * 1024 * 1024) throw new Error('Screenshot is invalid or larger than 20 MB.');
        imagePath = path.join(directory, `screenshot-${id}.png`);
        await writeFile(imagePath, png, { mode: 0o600 });
      }
      await writeFile(request, JSON.stringify({ id, prompt, ...(voiceContext ? { mode: 'voice-context' } : {}), ...(imagePath ? { imagePath } : {}) }), { mode: 0o600 });
      logDiagnostic('desktop-chat-start');
      await new Promise<void>((resolve, reject) => {
        const child = spawn(binary, [request, response], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
        let stderr = '';
        const timeout = setTimeout(() => { child.kill(); reject(new Error('Desktop chat timed out; no automatic resend was attempted.')); }, imagePath ? 160000 : 110000);
        const lines = createInterface({ input: child.stdout });
        lines.on('line', raw => {
          try {
            const value = JSON.parse(raw) as { id?: string; answer?: string; observedMs?: number; observedAtMs?: number };
            if (value.id !== id || typeof value.answer !== 'string' || value.answer === partial || !isCurrent()) return;
            if (!partial) logDiagnostic('desktop-chat-first-text', { milliseconds: Math.round(performance.now() - started), bridgeObservedMs: value.observedMs ?? 0, bridgeObservedAtMs: value.observedAtMs ?? 0 });
            partial = value.answer; onPartial?.(partial);
          } catch { /* Ignore malformed accessibility snapshots. */ }
        });
        child.stderr.on('data', chunk => { stderr = (stderr + String(chunk)).slice(-8192); });
        child.once('error', error => { clearTimeout(timeout); lines.close(); reject(error); });
        child.once('close', code => { clearTimeout(timeout); lines.close(); code === 0 ? resolve() : reject(Object.assign(new Error(stderr || 'Desktop helper failed.'), { stderr })); });
      });
      const timing = JSON.parse(await readFile(response + '.timing', 'utf8')) as { submittedMs: number };
      logDiagnostic('desktop-chat-submitted', { milliseconds: timing.submittedMs });
      const result = JSON.parse(await readFile(response, 'utf8')) as { id?: string; answer?: string; attachmentSubmitted?: boolean; voiceActive?: boolean };
      if (voiceContext) {
        if (result.id !== id || !result.attachmentSubmitted || !result.voiceActive) throw new Error('Screenshot submission in the active Voice chat was not verified. Inspect ChatGPT before retrying.');
        return 'Screenshot sent. Ask your question aloud in the same Voice chat.';
      }
      if (result.id !== id || typeof result.answer !== 'string' || !result.answer.trim()) throw new Error('Desktop chat returned an invalid reply.');
      logDiagnostic('desktop-chat-completed', { totalMs: Math.round(performance.now() - started) });
      return result.answer.trim();
    } catch (error) {
      const detail = error as { stderr?: string; code?: string | number; signal?: string };
      throw new Error(detail.stderr?.trim() || `Desktop chat bridge failed (${detail.code ?? detail.signal ?? 'unknown'}). Check the open ChatGPT window; no automatic resend was attempted.`);
    } finally { await rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }); }
  });
  queue = operation.catch(() => undefined);
  return operation;
}
