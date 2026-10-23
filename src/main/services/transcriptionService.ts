import path from 'node:path';
import { utilityProcess, type UtilityProcess } from 'electron';
import type { AudioRecordingPayload } from '../../shared/types';
import { getDataDirectory } from './paths';
import { logDiagnostic } from './diagnosticsService';
export { getLocalTranscriptionModel } from './localTranscriptionEngine';

let worker: UtilityProcess | undefined;
let sequence = 0;
let pending: { id: number; resolve: (text: string) => void; reject: (error: Error) => void; timer: NodeJS.Timeout } | undefined;

function rejectPending(message: string): void {
  if (!pending) return;
  clearTimeout(pending.timer);
  pending.reject(new Error(message)); pending = undefined;
}

function getWorker(): UtilityProcess {
  if (worker) return worker;
  const current = utilityProcess.fork(path.join(__dirname, 'transcriptionWorker.js'), [], {
    serviceName: 'Local speech transcription',
    env: { ...process.env, INTERVIEW_COPILOT_DATA_DIR: getDataDirectory() },
    stdio: 'pipe',
  });
  worker = current;
  current.stdout?.resume(); current.stderr?.resume();
  current.on('message', (message: { id: number; text?: string; error?: string }) => {
    if (worker !== current || message.id !== pending?.id) return;
    const request = pending!; pending = undefined; clearTimeout(request.timer);
    if (message.error) request.reject(new Error(message.error));
    else request.resolve(message.text ?? '');
  });
  current.on('exit', code => {
    if (worker !== current) return;
    worker = undefined;
    logDiagnostic('transcription-worker-exit', { code });
    rejectPending('Local speech engine stopped. The app is still running; the next audio chunk will restart it.');
  });
  return current;
}

export function warmTranscription(): void {
  try { getWorker().postMessage({ id: 0, type: 'warmup' }); }
  catch { logDiagnostic('transcription-warmup-failed'); }
}

export async function transcribeAudio(recording: AudioRecordingPayload): Promise<string> {
  if (!Array.isArray(recording?.bytes) || !recording.bytes.length) throw new Error('The recording is empty. Please try again.');
  if (recording.mimeType !== 'audio/wav') throw new Error(`Local transcription requires WAV audio, but received ${recording.mimeType || 'an unknown format'}.`);
  if (recording.bytes.length > 25 * 1024 * 1024) throw new Error('The audio chunk is too large to transcribe locally.');
  if (pending) throw new Error('Speech transcription is busy. Wait for the current audio chunk to finish.');
  const cold = !worker;
  const started = performance.now();
  const current = getWorker();
  logDiagnostic('transcription-start', { cold: cold ? 1 : 0, durationMs: recording.durationMs ?? 0 });
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {
      logDiagnostic('transcription-timeout');
      disposeTranscriptionWorker();
    }, 120000);
    pending = { id, resolve: text => { logDiagnostic('transcription-completed', { milliseconds: Math.round(performance.now() - started) }); resolve(text); }, reject, timer };
    try { current.postMessage({ id, recording }); }
    catch { disposeTranscriptionWorker(); }
  });
}

export function disposeTranscriptionWorker(): void {
  const current = worker; worker = undefined;
  rejectPending('Local speech engine was restarted. Please retry.');
  current?.kill();
}
