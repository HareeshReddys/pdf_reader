import type { AudioRecordingPayload, ContextAnswer } from '../../shared/types';
import { getAssistTurnState } from './assistTurnService';
import { askChatGptDesktop } from './chatgptDesktopService';
import { beginOverlayWork, updateOverlayActivity, updateOverlayPartial, updateOverlaySuggestion } from './overlayService';
import { saveSession } from './sessionService';

let buffered = '';
let revision: number | undefined;
/** Forward completed output speech verbatim: no question classifier or acknowledgements filter. */
export async function forwardDesktopTranscript(transcript: string, recording: AudioRecordingPayload) {
  const state = getAssistTurnState();
  const response = { transcript, audioSource: 'system' as const, speakerLabel: 'Speaker output · direct ChatGPT', detectedQuestions: [] as string[], suggestions: [] as ContextAnswer[], suppressedAsCandidateAnswer: false, ignoredAsAcknowledgement: false };
  if (recording.audioSource !== 'system') throw new Error('Direct ChatGPT mode accepts speaker output only.');
  if (revision !== state.revision) { buffered = ''; revision = state.revision; }
  if (!state.active || state.held) return response;
  buffered = [buffered, transcript.trim()].filter(Boolean).join(' ');
  if (recording.utteranceComplete === false || !buffered) return response;
  const text = buffered; buffered = '';
  const valid = () => { const current = getAssistTurnState(); return current.active && !current.held && current.revision === state.revision; };
  const version = beginOverlayWork(text, 'chatgpt');
  try {
    const answer = await askChatGptDesktop(text, valid, partial => { if (valid()) updateOverlayPartial(partial, version); });
    if (!valid()) return response;
    const suggestion: ContextAnswer = { question: text, answer, snippets: [], generationMode: 'chatgpt', followUpQuestion: '', confidence: 'low' };
    updateOverlaySuggestion(suggestion, version);
    await saveSession({ ...suggestion, transcript: text });
    response.detectedQuestions = [text]; // Legacy renderer field; the text was not classified or rewritten.
    response.suggestions = [suggestion];
    return response;
  } catch (error) {
    if (valid()) updateOverlayActivity('error', error instanceof Error ? error.message : 'Desktop chat failed.', version);
    throw error;
  }
}
