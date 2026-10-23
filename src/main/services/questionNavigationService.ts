import { BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../../shared/channels';
import type { SessionItem } from '../../shared/types';
import { listenForNextQuestion, setAssistAnswerHold } from './assistTurnService';
import { getOverlayState, updateOverlaySuggestion, markPendingVoiceAnswer, rememberVoiceAnswer } from './overlayService';
import { listSessions } from './sessionService';
import { getPracticeSessionId } from './practiceSessionService';
import { advanceScreenQuestion, getScreenMonitorState, pollScreenMonitor } from './screenMonitorService';

let navigationQueue = Promise.resolve();
let selectedId: string | undefined;

function displaySession(session: SessionItem): void {
  setAssistAnswerHold(true);
  selectedId = session.id;
  updateOverlaySuggestion({
    ...session,
    generationMode: session.generationMode ?? 'local',
    confidence: session.confidence ?? 'low',
    followUpQuestion: session.followUpQuestion ?? '',
  });
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.webContents.isDestroyed()) window.webContents.send(IPC_CHANNELS.questionNavigated, session);
  }
}

function navigate(direction: 'previous' | 'next'): Promise<void> {
  const operation = navigationQueue.then(async () => {
    const scope = getPracticeSessionId();
    const sessions = (await listSessions()).filter(session => session.practiceSessionId === scope); // Newest first, current conversation only.
    if (scope !== getPracticeSessionId()) return;
    const current = getOverlayState();
    if (direction === 'next' && current.pendingVoiceAnswer && sessions[0]) {
      rememberVoiceAnswer();
      displaySession(sessions[0]);
      markPendingVoiceAnswer(false);
      return;
    }
    const matches = (session: SessionItem) => session.question === current.answerQuestion && session.answer === current.answer;
    let index = sessions.findIndex(session => session.id === selectedId && matches(session));
    if (index < 0) index = sessions.findIndex(matches);
    if (direction === 'previous') {
      const previous = sessions[index < 0 ? 0 : index + 1];
      if (previous) displaySession(previous);
      return;
    }
    if (index > 0) {
      displaySession(sessions[index - 1]);
      return;
    }
    listenForNextQuestion();
    advanceScreenQuestion();
    if (getScreenMonitorState().active) void pollScreenMonitor();
  });
  navigationQueue = operation.catch(() => undefined);
  return operation;
}

export function nextQuestion(): Promise<void> { return navigate('next'); }
export function previousQuestion(): Promise<void> { return navigate('previous'); }
