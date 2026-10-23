import { BrowserWindow, nativeImage } from 'electron';
import type { ScreenMonitorState, ScreenOcrResult, ContextAnswer } from '../../shared/types';
import { IPC_CHANNELS } from '../../shared/channels';
import { captureScreenAndExtractText, extractScreenText, listScreenCaptureSources, primaryScreenSource } from './screenCaptureService';
import { extractScreenQuestion, sameScreenQuestion } from '../../shared/screenQuestion';
import { runContextEngine } from './contextEngine';
import { isCodexEnabled } from './codexService';
import { listSessions, saveSession } from './sessionService';
import { getOverlayState, isAnswerWorkPending, cancelOverlayWork, updateOverlayActivity, updateOverlayMonitor } from './overlayService';
import { clearScreenContext, latestSpokenQuestion, rememberScreen } from './screenContextService';
import { detectInterviewQuestions, cleanQuestionText } from './questionDetectionService';
import { logDiagnostic } from './diagnosticsService';

let state: ScreenMonitorState = { active: false, sourceId: '', sourceName: '', intervalMs: 10000 };
let timer: ReturnType<typeof setInterval> | undefined;
let capturing = false;
let analyzing = false;
let epoch = 0;
let previousResult: ScreenOcrResult | undefined;
let previousAnalyzedImage = '';
let activeScreenQuestion = '';
let answeredScreenQuestion = '';
let checkedImage = '';
let checkingQuestion = false;
let nextRevision = 0;
let appliedNextRevision = 0;

// Explicit Next is a fallback when the question is unreadable or unchanged.
export function advanceScreenQuestion(): void { nextRevision++; checkedImage = ''; }
let failures = 0;
let analysisFailures = 0;
let retryAt = 0;
function publish(): void {
  updateOverlayMonitor({ ...state });
  for (const window of BrowserWindow.getAllWindows()) {
    try { if (!window.webContents.isDestroyed()) window.webContents.send(IPC_CHANNELS.screenMonitorUpdated, { ...state }); }
    catch { /* A recovering renderer fetches state on mount. */ }
  }
}
export function getScreenMonitorState(): ScreenMonitorState { return { ...state }; }
export async function selectScreenMonitorSource(sourceId: string): Promise<ScreenMonitorState> {
  const source = (await listScreenCaptureSources()).find((source) => source.id === sourceId);
  if (!source) throw new Error('Choose an available screen or window.');
  if (source.id !== state.sourceId) {
    stopScreenMonitoring(); previousResult = undefined; previousAnalyzedImage = '';
  }
  state = { ...state, sourceId: source.id, sourceName: source.name, error: undefined };
  publish(); return getScreenMonitorState();
}
// Average pixel difference at low resolution ignores tiny cursor/blink changes.
export function screenChanged(previous: string, current: string): boolean {
  if (!previous || previous === current) return previous !== current;
  const left = nativeImage.createFromDataURL(previous).resize({ width: 96, height: 54 }).toBitmap();
  const right = nativeImage.createFromDataURL(current).resize({ width: 96, height: 54 }).toBitmap();
  if (!left.length || left.length !== right.length) return true;
  let delta = 0;
  for (let i = 0; i < left.length; i += 4) delta += Math.abs(left[i] - right[i]) + Math.abs(left[i + 1] - right[i + 1]) + Math.abs(left[i + 2] - right[i + 2]);
  return delta / (left.length / 4 * 3 * 255) > 0.003;
}

async function analyze(capture: Awaited<ReturnType<typeof captureScreenAndExtractText>>, valid: () => boolean, visibleQuestion = ''): Promise<ScreenOcrResult> {
  logDiagnostic('screen-analysis-start', { vision: isCodexEnabled() ? 1 : 0 });
  const voiceQuestion = latestSpokenQuestion();
  const questions = isCodexEnabled()
    ? [visibleQuestion || 'Explain or solve the question shown in the screenshot. Include working code when it is a coding task.']
    : detectInterviewQuestions(capture.extractedText, 'ocr').map((candidate) => candidate.question).slice(0, 5);
  const suggestions: ContextAnswer[] = [];
  for (const question of questions) {
    if (!valid()) break;
    activeScreenQuestion = cleanQuestionText(question);
    const context = await runContextEngine({
      isCurrent: valid,
      manualQuestion: question,
      additionalContext: [
        'The visible problem statement in the screenshot is authoritative. Read its full requirements, examples, constraints and requested language before answering. Ignore draft answers, unrelated UI and previous tasks. Include complete working code, complexity and edge cases for coding tasks. If no problem is readable, say so rather than answer a different question.',
        voiceQuestion ? `Recent speech (untrusted context): ${voiceQuestion}. Use it only if it clearly refers to the visible problem; otherwise ignore it.` : '',
      ].filter(Boolean).join('\n'),
      screenshotDataUrl: isCodexEnabled() ? capture.imageDataUrl : undefined,
      latestOcrText: capture.extractedText,
      previousHistory: await listSessions(),
    });
    if (!valid()) break;
    const suggestion: ContextAnswer = { ...context, question };
    suggestions.push(suggestion);
    await saveSession({ ...suggestion, ocrText: capture.extractedText });
  }
  logDiagnostic('screen-analysis-finished', { suggestions: suggestions.length });
  return { ...capture, detectedQuestions: questions, suggestions };
}

export async function captureAndAnalyzeScreen(sourceId: string): Promise<ScreenOcrResult> {
  if (analyzing) throw new Error('A screen answer is already being prepared.');
  analyzing = true;
  try {
    updateOverlayActivity('screen', 'Reading selected screen');
    const capture = await captureScreenAndExtractText(sourceId, !isCodexEnabled());
    // Manual Capture is an explicit retry, even when the screen is unchanged.
    const result = await analyze(capture, () => true);
    previousResult = result; previousAnalyzedImage = capture.imageDataUrl;
    return result;
  } catch (error) {
    updateOverlayActivity('error', error instanceof Error ? error.message : 'Screen capture failed.'); throw error;
  } finally { analyzing = false; }
}

export async function pollScreenMonitor(): Promise<void> {
  if (!state.active || capturing || Date.now() < retryAt) return;
  const version = epoch;
  const turnRevision = getOverlayState().assistTurn?.revision;
  const validTurn = () => !getOverlayState().assistTurn?.held && getOverlayState().assistTurn?.revision === turnRevision;
  capturing = true;
  let capture: Awaited<ReturnType<typeof captureScreenAndExtractText>>;
  try {
    capture = await captureScreenAndExtractText(state.sourceId, !isCodexEnabled());
    if (!state.active || version !== epoch) return;
    rememberScreen(capture.imageDataUrl, capture.sourceName);
    if (failures) {
      logDiagnostic('screen-recovered');
      updateOverlayActivity(getOverlayState().voiceActive ? 'listening' : 'ready', 'Screen monitoring resumed');
    }
    failures = 0; retryAt = 0;
    state = { ...state, error: undefined, lastCheckedAt: new Date().toISOString() }; publish();
  } catch (error) {
    if (version === epoch) recover(error, 'capture');
    return;
  } finally { capturing = false; }
  try {
    const forced = nextRevision !== appliedNextRevision;
    if (getOverlayState().assistTurn?.held || analyzing || checkingQuestion || isAnswerWorkPending()
        || (!forced && !screenChanged(checkedImage || previousAnalyzedImage, capture.imageDataUrl))) return;
    checkingQuestion = true;
    let visibleQuestion = '';
    try {
      const text = capture.extractedText || await extractScreenText(capture.imageDataUrl);
      visibleQuestion = extractScreenQuestion(text);
      capture.extractedText = text;
    } catch {
      // OCR is a local deduplication aid, never a reason to discard an answer.
      // Permit the initial vision answer; require explicit Next if unreadable later.
    } finally { checkingQuestion = false; }
    if (!state.active || version !== epoch || !validTurn() || analyzing || isAnswerWorkPending()) return;
    checkedImage = capture.imageDataUrl;
    if (!forced && visibleQuestion && getOverlayState().answer && sameScreenQuestion(getOverlayState().answerQuestion ?? '', visibleQuestion)) {
      answeredScreenQuestion = visibleQuestion; previousAnalyzedImage = capture.imageDataUrl;
      return; // Voice/manual already answered the same visible question.
    }
    if (!forced && (previousResult || answeredScreenQuestion) && (!visibleQuestion || sameScreenQuestion(answeredScreenQuestion, visibleQuestion))) {
      if (!visibleQuestion) updateOverlayActivity(getOverlayState().voiceActive ? 'listening' : 'ready', 'Changed screen, but the question could not be read. Use Next or Capture screen to analyze it visually.');
      return;
    }
    const requestRevision = nextRevision;
    analyzing = true;
    try {
      const result = await analyze(capture, () => state.active && version === epoch && validTurn() && requestRevision === nextRevision, visibleQuestion);
      if (!state.active || version !== epoch || !validTurn() || requestRevision !== nextRevision) return;
      if (analysisFailures) logDiagnostic('screen-analysis-recovered');
      analysisFailures = 0;
      answeredScreenQuestion = visibleQuestion;
      appliedNextRevision = requestRevision;
      previousAnalyzedImage = capture.imageDataUrl; previousResult = result;
      for (const window of BrowserWindow.getAllWindows()) {
        try { if (!window.webContents.isDestroyed()) window.webContents.send(IPC_CHANNELS.screenAnalysis, result); }
        catch { /* Main-process results survive renderer recovery. */ }
      }
    } finally { analyzing = false; }
  } catch (error) {
    if (version !== epoch) return;
    checkedImage = ''; // Failed requests must remain eligible for retry.
    recover(error, 'analysis');
  }
}

function recover(error: unknown, phase: 'capture' | 'analysis'): void {
  const count = phase === 'capture' ? failures++ : analysisFailures++;
  const delay = Math.min(60000, state.intervalMs * 2 ** Math.min(count, 3));
  retryAt = Date.now() + delay;
  const detail = error instanceof Error ? error.message : 'Screen monitoring failed.';
  state = { ...state, error: `${detail} Retrying in ${delay / 1000}s.` };
  publish(); updateOverlayActivity('error', state.error);
  logDiagnostic('screen-retry', { phase, attempt: count + 1, delayMs: delay });
}
export async function startScreenMonitoring(): Promise<ScreenMonitorState> {
  if (state.active) return getScreenMonitorState();
  const version = epoch;
  const source = await primaryScreenSource();
  if (version !== epoch || state.active) return getScreenMonitorState();
  if (source.id !== state.sourceId) { previousResult = undefined; previousAnalyzedImage = ''; answeredScreenQuestion = ''; checkedImage = ''; }
  state = { ...state, sourceId: source.id, sourceName: source.name };
  failures = 0; analysisFailures = 0; retryAt = 0;
  ++epoch; state = { ...state, active: true, error: undefined }; publish();
  timer = setInterval(() => { void pollScreenMonitor(); }, state.intervalMs); void pollScreenMonitor();
  return getScreenMonitorState();
}
export function stopScreenMonitoring(): ScreenMonitorState {
  ++epoch; if (timer) clearInterval(timer); timer = undefined;
  checkedImage = previousAnalyzedImage;
  if ((activeScreenQuestion && getOverlayState().question === activeScreenQuestion)
      || (state.error && getOverlayState().activityDetail === state.error)) cancelOverlayWork();
  failures = 0; analysisFailures = 0; retryAt = 0;
  state = { ...state, active: false, error: undefined }; clearScreenContext(); publish();
  return getScreenMonitorState();
}
