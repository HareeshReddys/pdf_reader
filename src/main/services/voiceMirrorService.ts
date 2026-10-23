import { spawn, type ChildProcess } from 'node:child_process';
import { createInterface } from 'node:readline';
import { app } from 'electron';
import { getChatGptDesktopHelper } from './chatgptDesktopService';
import { parseVoiceQuestion, parseVoiceReply } from './voiceReplyParser';
import { beginOverlayWork, cancelOverlayWork, setVoiceMirrorActive, updateOverlayActivity, updateOverlayPartial, updateOverlaySuggestion } from './overlayService';
import { getAssistTurnState } from './assistTurnService';
import { logDiagnostic } from './diagnosticsService';

let child: ChildProcess | undefined;
let epoch = 0;
let starting = false;
let suspended = false;
let requireNewQuestion = false;
export function suspendVoiceMirrorUpdates(value: boolean): void { suspended = value; if (value) requireNewQuestion = true; }
let lastReply: { question: string; answer: string; work: number } | undefined;
app.once('before-quit', () => stopVoiceMirror());

export function stopVoiceMirror(): void {
  ++epoch;
  const current = child; child = undefined;
  current?.kill();
  if (lastReply) updateOverlaySuggestion({ ...lastReply, snippets: [], generationMode: 'chatgpt', followUpQuestion: '', confidence: 'low' }, lastReply.work);
  lastReply = undefined;
  setVoiceMirrorActive(false);
  cancelOverlayWork();
}

/** Mirrors accessible text without moving ChatGPT or changing audio routing. */
export async function startVoiceMirror(): Promise<void> {
  if (child || starting) throw new Error('Voice text mirroring is already active or starting.');
  if (getAssistTurnState().active) throw new Error('Stop local assistant mode before starting Voice text mirroring.');
  starting = true;
  lastReply = undefined;
  const version = ++epoch;
  try {
    const binary = await getChatGptDesktopHelper();
    if (version !== epoch) return;
    const current = spawn(binary, ['--watch-voice'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    child = current;
    let previous = '', initialized = false, work = 0, question = '', stderr = '';
    const lines = createInterface({ input: current.stdout! });
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => { stopVoiceMirror(); reject(new Error('ChatGPT text reader did not become ready.')); }, 15000);
      let ready = false;
      lines.on('line', raw => {
        if (version !== epoch) return;
        try {
          const snapshot = JSON.parse(raw) as { text?: string; observedAtMs?: number };
          if (typeof snapshot.text !== 'string') return;
          if (suspended) return;
          if (!ready) { ready = true; clearTimeout(timeout); setVoiceMirrorActive(true); resolve(); }
          const reply = parseVoiceReply(snapshot.text);
          const incomingQuestion = parseVoiceQuestion(snapshot.text);
          const key = JSON.stringify({ question: incomingQuestion, answer: reply?.answer });
          if (incomingQuestion?.startsWith('Use this screenshot as context for my next spoken question.') && incomingQuestion.includes('Capture reference:')) {
            previous = key; question = incomingQuestion; work = 0; initialized = true; return;
          }
          // Seed from existing content without importing old answers.
          if (!initialized) { previous = key; question = incomingQuestion ?? ''; initialized = true; return; }
          if (requireNewQuestion) {
            if (!incomingQuestion || incomingQuestion === question) return;
            requireNewQuestion = false;
          }
          if (key === previous) return;
          previous = key;
          if (incomingQuestion && incomingQuestion !== question) {
            question = incomingQuestion; work = beginOverlayWork(question, 'chatgpt'); lastReply = undefined;
          }
          if (!reply || !work || reply.question !== question) return;
          updateOverlayPartial(reply.answer, work);
          lastReply = { ...reply, work };
          logDiagnostic('voice-mirror-update', { accessibleToMainMs: Math.max(0, Date.now() - (snapshot.observedAtMs ?? Date.now())) });
        } catch { /* Ignore incomplete accessibility snapshots. */ }
      });
      current.stderr!.on('data', bytes => { stderr = (stderr + String(bytes)).slice(-8192); });
      const failed = (error: Error) => {
        clearTimeout(timeout); lines.close();
        if (!ready) reject(error);
        if (version !== epoch) return;
        child = undefined; setVoiceMirrorActive(false);
        updateOverlayActivity('error', error.message);
      };
      current.once('error', failed);
      current.once('close', code => failed(new Error(stderr.trim() || `ChatGPT text reader stopped (${code}).`)));
    });
    // Keep the Voice surface available to accessibility and attachment controls.
    // Moving it to the bottom of the window stack can freeze its accessible tree.
  } finally { starting = false; }
}
