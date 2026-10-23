import { BrowserWindow } from 'electron';
import type { AssistTurnState, AssistTurnUpdate, AudioRecordingPayload, ContextAnswer } from '../../shared/types';
import { IPC_CHANNELS } from '../../shared/channels';
import { cleanQuestionText, detectInterviewQuestions, isConversationalAcknowledgement, isIncompleteInterviewQuestion } from './questionDetectionService';
import { resemblesDisplayedAnswer } from './responseGuardService';
import { runContextEngine } from './contextEngine';
import { cancelOverlayWork, getOverlayState, updateOverlayAssistTurn } from './overlayService';
import { saveSession } from './sessionService';
import { rememberSpokenQuestion, screenForQuestion } from './screenContextService';
import { questionIdentity, sameScreenQuestion } from '../../shared/screenQuestion';

let state: AssistTurnState = { active: false, held: false };
let pending = '', pendingTranscript = '', buffered = '', bufferedAt = 0;
let timer: NodeJS.Timeout | undefined;
let epoch = 0, heldAt = 0;
let lastQuestion = '', lastTurnQuestion = '', lastTurnAnswer = '';
// One inference at a time; transcription continues while it runs.
let inferenceQueue = Promise.resolve();
const SETTLE_MS = 1300;
function publish(suggestion?: ContextAnswer, acceptedQuestion?: string): void {
  updateOverlayAssistTurn(state);
  const update: AssistTurnUpdate = { state: { ...state }, suggestion, acceptedQuestion };
  for (const window of BrowserWindow.getAllWindows()) window.webContents.send(IPC_CHANNELS.assistTurnUpdated, update);
}
export function getAssistTurnState(): AssistTurnState { return { ...state }; }
export function configureAssistTurn(active: boolean): AssistTurnState {
  epoch++; heldAt = Date.now(); clearTimeout(timer); timer = undefined; pending = ''; pendingTranscript = ''; buffered = ''; bufferedAt = 0; lastQuestion = ''; lastTurnQuestion = ''; lastTurnAnswer = '';
  cancelOverlayWork(); state = { active, held: false, revision: epoch }; publish(); return getAssistTurnState();
}
export function setAssistAnswerHold(held: boolean): AssistTurnState {
  epoch++; heldAt = Date.now(); clearTimeout(timer); timer = undefined; buffered = ''; bufferedAt = 0; pending = ''; pendingTranscript = '';
  if (!getOverlayState().realtimeVoiceActive) cancelOverlayWork();
  state = { ...state, held, revision: epoch, pendingQuestion: undefined, detail: held ? 'Answer held · speech will not replace it' : 'Listening for the next interviewer question' }; publish(); return getAssistTurnState();
}
export function listenForNextQuestion(): AssistTurnState {
  // Resuming is not a request to repeat the previous answer or start recording.
  return setAssistAnswerHold(false);
}
export function dismissAssistQuestion(): void {
  clearTimeout(timer); timer = undefined;
  pending = ''; pendingTranscript = ''; state = { ...state, pendingQuestion: undefined, detail: 'Question dismissed · keeping current answer' }; publish();
}
function queueAnswer(question: string, transcript: string): void {
  const key = questionIdentity(question);
  if (key === lastQuestion || getOverlayState().answer && sameScreenQuestion(getOverlayState().answerQuestion ?? '', question)) { state = { ...state, pendingQuestion: undefined, detail: 'Same question · keeping current answer' }; publish(); return; }
  const priorQuestion = lastTurnQuestion, priorAnswer = lastTurnAnswer;
  lastQuestion = key; lastTurnQuestion = question; lastTurnAnswer = '';
  const version = ++epoch;
  const valid = () => version === epoch && state.active && !state.held;
  state = { ...state, pendingQuestion: undefined, detail: 'Preparing the detected question' }; publish(undefined, question);
  inferenceQueue = inferenceQueue.then(async () => {
    if (!valid()) return;
    rememberSpokenQuestion(question);
    try {
      const answer = await runContextEngine({ manualQuestion: question, isCurrent: valid,
        additionalContext: priorQuestion ? `Previous confirmed interviewer question: ${priorQuestion.slice(0, 1500)}\nPrevious answer: ${priorAnswer.slice(0, 2500)}\nUse this only to resolve a follow-up; the new question takes priority.` : undefined,
        screenshotDataUrl: screenForQuestion(question) });
      if (!valid()) return;
      const suggestion: ContextAnswer = { ...answer };
      await saveSession({ ...suggestion, transcript });
      if (!valid()) return;
      lastTurnAnswer = suggestion.answer;
      state = { ...state, detail: 'Answer ready · hold it while you respond' }; publish(suggestion);
    } catch (error) {
      if (valid()) { lastQuestion = ''; state = { ...state, detail: error instanceof Error ? error.message : 'Could not prepare the answer' }; publish(); }
    }
  });
}
export function confirmAssistQuestion(): void {
  if (!pending || !state.active || state.held) return;
  const question = pending, transcript = pendingTranscript;
  pending = ''; pendingTranscript = ''; queueAnswer(question, transcript);
}

/** Both input sources auto-answer after settling. A shared microphone cannot
 * identify speakers: retain answer-speech/noise guards and explicit Hold. */
export function ingestAssistTranscript(transcript: string, recording: AudioRecordingPayload): { speakerLabel: string; detectedQuestions: string[]; suppressedAsCandidateAnswer: boolean; ignoredAsAcknowledgement: boolean } {
  const microphone = recording.audioSource !== 'system';
  const acknowledgement = isConversationalAcknowledgement(transcript);
  const answerContext = [getOverlayState().answer, recording.answerContext ?? ''].join('\n');
  const candidate = microphone && resemblesDisplayedAnswer(transcript, answerContext) && detectInterviewQuestions(transcript, 'transcript').length === 0;
  const held = state.held || (recording.capturedAt !== undefined && recording.capturedAt <= heldAt);
  if (!state.active || held || acknowledgement || candidate) {
    return { speakerLabel: held ? 'Answer held · ignored' : candidate ? 'Likely candidate response · ignored' : acknowledgement ? 'Conversation · ignored' : 'Assistant stopped · ignored', detectedQuestions: [], suppressedAsCandidateAnswer: candidate || held, ignoredAsAcknowledgement: acknowledgement };
  }
  const now = Date.now();
  if (/\b(?:next question|new question|let.s pivot|move on to)\b/i.test(transcript)) {
    buffered = ''; bufferedAt = 0; pending = ''; pendingTranscript = ''; clearTimeout(timer); timer = undefined;
  }
  // Retain incomplete question fragments only briefly; never append unrelated
  // candidate explanations or an entire conversation to the next question.
  const combined = buffered && now - bufferedAt < 45_000 ? `${buffered} ${transcript}` : transcript;
  if (recording.utteranceComplete === false) {
    buffered = combined.slice(-8000); bufferedAt = now;
    return { speakerLabel: microphone ? 'Mixed microphone · question continuing' : 'Call audio · question continuing', detectedQuestions: [], suppressedAsCandidateAnswer: false, ignoredAsAcknowledgement: false };
  }
  const detected = detectInterviewQuestions(combined, 'transcript');
  const standalone = cleanQuestionText(combined);
  let question = detected.map((item) => item.question).join(' ');
  // Preserve a scenario stated before its question in the same audio turn.
  if (question && !/\b(?:suppose|imagine|say a)\b/i.test(question)) {
    const scenario = combined.match(/\b(?:suppose|imagine|say a)[^?]+?(?=\b(?:what|how|why|where|which)\s+(?:do|does|is|are|would|will|can)\b)/i)?.[0];
    if (scenario) question = `${scenario.trim()} ${question}`;
  }
  if (!question) {
    if (isIncompleteInterviewQuestion(standalone) && /\b(?:what|how|why|explain|suppose|imagine|tell me)\b/i.test(standalone) && !/^(?:i|we|so\s+(?:i|we))\b/i.test(standalone)) { buffered = combined; bufferedAt = now; }
    return { speakerLabel: microphone ? 'Mixed microphone · no confirmed question' : 'Call audio · statement/noise ignored', detectedQuestions: [], suppressedAsCandidateAnswer: false, ignoredAsAcknowledgement: false };
  }
  buffered = ''; bufferedAt = 0;
  // Combine questions that arrive within the settling window into one turn.
  pending = pending && timer ? questionIdentity(pending) === questionIdentity(question) ? pending : `${pending.replace(/\?$/, '')}. ${question}` : question;
  pendingTranscript = combined; clearTimeout(timer);
  state = { ...state, pendingQuestion: pending, detail: 'Finishing the detected question · answers automatically' }; publish();
  timer = setTimeout(() => { timer = undefined; const accepted = pending, captured = pendingTranscript; pending = ''; pendingTranscript = ''; if (state.active && !state.held && accepted) queueAnswer(accepted, captured); }, SETTLE_MS);
  return { speakerLabel: microphone ? 'Mixed microphone · detected question' : 'Call output · interviewer question', detectedQuestions: [], suppressedAsCandidateAnswer: false, ignoredAsAcknowledgement: false };
}

export async function waitForAssistAnswers(): Promise<void> { await inferenceQueue; }
