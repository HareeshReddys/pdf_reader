import { randomUUID } from 'node:crypto';
import { app, nativeImage, webContents } from 'electron';
import { IPC_CHANNELS } from '../../shared/channels';
import path from 'node:path';
import dotenv from 'dotenv';
import type { RealtimeVoiceTurn } from '../../shared/types';
import { isOpenAIConfigured, MISSING_API_KEY_MESSAGE } from './openaiService';
import { beginOverlayWork, updateOverlayPartial, updateOverlaySuggestion, updateVoiceActivity, cancelOverlayWork, setRealtimeVoiceActive, setRealtimeVoiceNotice } from './overlayService';
import { saveSession } from './sessionService';
import { beginPracticeSession } from './practiceSessionService';
import { captureScreenAndExtractText } from './screenCaptureService';
import { buildRealtimeContext } from './realtimeContextService';
import type { NoteSnippet } from '../../shared/types';
import { isAcknowledgmentOnly } from '../../shared/realtimeTurnFilter';
import { getOverlayState, markPendingVoiceAnswer, rememberVoiceAnswer, resetVoiceReading } from './overlayService';
import { setAssistAnswerHold } from './assistTurnService';
import { logDiagnostic } from './diagnosticsService';

type ActiveVoice = { id: string; owner: number; controller: AbortController; instructions?: string; model?: string; responseId?: string; question?: string; version?: number; saved: Set<string>; snippets: NoteSnippet[] };
let active: ActiveVoice | undefined;
let renewal: { token: string; parent: ActiveVoice; controller: AbortController; ready: boolean } | undefined;
export function isRealtimeVoiceActive(): boolean { return Boolean(active); }
export function stopRealtimeVoice(owner?: number): void {
  if (!active || (owner !== undefined && active.owner !== owner)) return;
  renewal?.controller.abort(); renewal = undefined;
  active.controller.abort(); active = undefined;
  setRealtimeVoiceActive(false);
  setRealtimeVoiceNotice('');
  updateVoiceActivity({ active: false, speaking: false }); cancelOverlayWork();
}
export async function connectRealtimeVoice(owner: number, offer: unknown): Promise<{ id: string; sdp: string }> {
  if (active) throw new Error('Stop the current continuous voice session first.');
  if (typeof offer !== 'string' || offer.length > 100000 || !offer.startsWith('v=0')) throw new Error('Invalid voice connection offer.');
  // Reload locally so a key added after launching the app works on the next Start.
  dotenv.config({ path: path.join(app.getAppPath(), '.env'), override: true, quiet: true } as dotenv.DotenvConfigOptions);
  if (!isOpenAIConfigured()) throw new Error(MISSING_API_KEY_MESSAGE);
  const current: ActiveVoice = { id: randomUUID(), owner, controller: new AbortController(), saved: new Set<string>(), snippets: [] };
  active = current;
  const timer = setTimeout(() => current.controller.abort(), 30000);
  try {
    const context = await buildRealtimeContext();
    current.snippets = context.snippets;
    current.instructions = context.instructions;
    current.model = process.env.OPENAI_REALTIME_MODEL?.trim() || 'gpt-realtime';
    if (active !== current) throw new Error('Voice connection cancelled.');
    const form = new FormData();
    form.set('sdp', offer);
    form.set('session', JSON.stringify({
      type: 'realtime', model: current.model, output_modalities: ['text'],
      instructions: context.instructions,
      include: ['item.input_audio_transcription.logprobs'],
      audio: {
        input: { transcription: { model: 'gpt-4o-mini-transcribe' }, turn_detection: { type: 'semantic_vad', eagerness: 'low', create_response: false, interrupt_response: false } },
      },
    }));
    const result = await fetch('https://api.openai.com/v1/realtime/calls', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY!.trim()}` }, body: form, signal: current.controller.signal });
    if (!result.ok) {
      const reason = result.status === 401 ? 'API key rejected.' : result.status === 429 ? 'API quota or rate limit reached. Check credits and limits.' : `Voice connection failed (HTTP ${result.status}). Check model access and configuration.`;
      throw new Error(reason);
    }
    const sdp = await result.text();
    if (!sdp.startsWith('v=0') || sdp.length > 100000) throw new Error('The voice service returned an invalid connection answer.');
    if (active !== current) throw new Error('Voice connection cancelled.');
    beginPracticeSession();
    resetVoiceReading();
    setAssistAnswerHold(false);
    updateOverlaySuggestion({ question: '', answer: '', snippets: [], generationMode: 'openai', confidence: 'low', followUpQuestion: '' });
    updateVoiceActivity({ active: true, speaking: false });
    setRealtimeVoiceActive(true);
    setRealtimeVoiceNotice(`Speaker feed B1 · text only · ${context.sourceNames.length ? 'Context: ' + context.sourceNames.join(', ') : 'No resume context'} · JD ${context.hasJobDescription ? 'loaded' : 'not set'}${context.truncated ? ' · context shortened' : ''}`);
    return { id: current.id, sdp };
  } catch (error) {
    const wasAborted = current.controller.signal.aborted;
    if (active === current) stopRealtimeVoice(owner);
    if (wasAborted) throw new Error('Voice connection cancelled or timed out.');
    throw error;
  } finally { clearTimeout(timer); }
}
/** Prepare a replacement without changing the logical interview or retiring its connection. */
export async function prepareRealtimeRenewal(owner: number, id: unknown, offer: unknown): Promise<{ token: string; sdp: string }> {
  const parent = requireActive(owner, id);
  if (renewal) throw new Error('Voice renewal is already being prepared.');
  if (typeof offer !== 'string' || offer.length > 100000 || !offer.startsWith('v=0')) throw new Error('Invalid voice connection offer.');
  if (!isOpenAIConfigured()) throw new Error(MISSING_API_KEY_MESSAGE);
  const pending = { token: randomUUID(), parent, controller: new AbortController(), ready: false };
  renewal = pending;
  const timer = setTimeout(() => pending.controller.abort(), 30000);
  try {
    const form = new FormData();
    form.set('sdp', offer);
    form.set('session', JSON.stringify({ type: 'realtime', model: parent.model, output_modalities: ['text'], instructions: parent.instructions,
      include: ['item.input_audio_transcription.logprobs'],
      audio: { input: { transcription: { model: 'gpt-4o-mini-transcribe' }, turn_detection: { type: 'semantic_vad', eagerness: 'low', create_response: false, interrupt_response: false } } },
    }));
    const result = await fetch('https://api.openai.com/v1/realtime/calls', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY!.trim()}` }, body: form, signal: pending.controller.signal });
    if (!result.ok) throw new Error(result.status === 429 ? 'Voice renewal quota or rate limit reached.' : `Voice renewal failed (HTTP ${result.status}).`);
    const sdp = await result.text();
    if (!sdp.startsWith('v=0') || sdp.length > 100000) throw new Error('Invalid voice renewal answer.');
    if (active !== parent || renewal !== pending || pending.controller.signal.aborted) throw new Error('Voice renewal cancelled.');
    pending.ready = true;
    logDiagnostic('realtime-renewal-prepared');
    return { token: pending.token, sdp };
  } catch (error) {
    pending.controller.abort();
    if (renewal === pending) renewal = undefined;
    logDiagnostic('realtime-renewal-prepare-failed');
    throw error;
  } finally { clearTimeout(timer); }
}
export function commitRealtimeRenewal(owner: number, id: unknown, token: unknown): void {
  const parent = requireActive(owner, id);
  if (!renewal || renewal.parent !== parent || renewal.token !== token || !renewal.ready || renewal.controller.signal.aborted) throw new Error('No matching prepared voice renewal.');
  parent.controller.abort(); parent.controller = renewal.controller; renewal = undefined;
  parent.responseId = undefined; parent.question = undefined; parent.version = undefined;
  logDiagnostic('realtime-renewal-committed');
}
export function cancelRealtimeRenewal(owner: number, id: unknown): void {
  const parent = requireActive(owner, id);
  if (renewal?.parent === parent) { renewal.controller.abort(); renewal = undefined; }
}
export function requestRealtimeVoiceAction(action: 'stop' | 'screenshot'): void {
  if (!active) throw new Error('Start continuous voice in the main window first.');
  const owner = webContents.fromId(active.owner);
  if (!owner || owner.isDestroyed()) { stopRealtimeVoice(); throw new Error('Voice controller is unavailable.'); }
  owner.send(IPC_CHANNELS.realtimeVoiceAction, action);
  if (action === 'stop') stopRealtimeVoice();
}
function requireActive(owner: number, id: unknown) {
  if (!active || active.owner !== owner || active.id !== id) throw new Error('No matching continuous voice session.');
  return active;
}
export function reportRealtimeVoiceNotice(owner: number, id: unknown, notice: unknown): void {
  requireActive(owner, id);
  if (notice === 'renewing' || notice === 'renewed' || notice === 'renewal-delayed') {
    setRealtimeVoiceNotice(notice === 'renewing' ? 'Preparing automatic voice renewal · interview context retained' : notice === 'renewed' ? 'Voice session renewed · interview context retained' : 'Voice renewal delayed · current connection retained · retrying');
    return;
  }
  if (notice !== 'sending' && notice !== 'received' && notice !== 'unconfirmed') throw new Error('Invalid screenshot notice.');
  setRealtimeVoiceNotice(notice === 'sending' ? 'Sending screenshot…' : notice === 'received' ? 'Screenshot received. Answer requested in this session.' : 'Screenshot receipt not confirmed. No automatic resend.');
}
export async function publishRealtimeVoice(owner: number, id: unknown, value: unknown): Promise<void> {
  const current = requireActive(owner, id);
  const turn = value as RealtimeVoiceTurn;
  if (!turn || typeof turn.responseId !== 'string' || turn.responseId.length > 200 || typeof turn.question !== 'string' || turn.question.length > 30000 || typeof turn.answer !== 'string' || turn.answer.length > 100000 || typeof turn.complete !== 'boolean' || typeof turn.interrupted !== 'boolean') throw new Error('Invalid voice transcript update.');
  if (current.saved.has(turn.responseId)) return;
  if (isAcknowledgmentOnly(turn.question)) return;
  const held = Boolean(getOverlayState().assistTurn?.held);
  if (current.responseId !== turn.responseId || current.question !== turn.question) { current.responseId = turn.responseId; current.question = turn.question; current.version = held ? undefined : beginOverlayWork(turn.question, 'chatgpt'); }
  if (!held && turn.answer && current.version !== undefined) updateOverlayPartial(turn.answer, current.version);
  if (turn.complete && turn.answer) {
    current.saved.add(turn.responseId);
    const cited = current.snippets.filter(note => turn.answer.toLowerCase().includes(note.fileName.toLowerCase()));
    const answer = { question: turn.question, answer: turn.answer, snippets: cited, generationMode: 'openai' as const, confidence: 'low' as const, followUpQuestion: '' };
    if (!held) { rememberVoiceAnswer(); updateOverlaySuggestion(answer, current.version); }
    if (!turn.interrupted) {
      try {
        await saveSession({ ...answer, transcript: turn.question });
        if (active === current && held) markPendingVoiceAnswer(true);
      }
      catch (error) { current.saved.delete(turn.responseId); throw error; }
    }
  }
}
export async function captureRealtimeImage(owner: number, id: unknown, sourceId: unknown, limit: unknown): Promise<string> {
  requireActive(owner, id);
  if (typeof sourceId !== 'string' || !sourceId || sourceId.length > 200) throw new Error('Select a screen or window to share.');
  if (typeof limit !== 'number' || !Number.isFinite(limit) || limit < 4096) throw new Error('Invalid image transport limit.');
  const imageLimit = Math.min(240000, limit - 1024);
  const result = await captureScreenAndExtractText(sourceId, false);
  requireActive(owner, id);
  if (!result.imageDataUrl) throw new Error('The selected source returned no image.');
  const image = nativeImage.createFromDataURL(result.imageDataUrl);
  if (image.isEmpty()) throw new Error('The screenshot is empty.');
  // Keep a single message below conservative WebRTC data-channel limits.
  for (const width of [1920, 1600, 1280, 1024, 800, 640]) {
    const resized = image.resize({ width: Math.min(width, image.getSize().width) });
    const data = resized.toJPEG(80).toString('base64');
    if (data.length < imageLimit) return `data:image/jpeg;base64,${data}`;
  }
  throw new Error('This screenshot is too complex to send safely. Select a smaller window.');
}
