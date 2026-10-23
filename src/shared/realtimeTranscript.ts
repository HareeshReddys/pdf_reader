import type { RealtimeVoiceTurn } from './types';

type Event = { type?: string; item_id?: string; response_id?: string; transcript?: string; delta?: string; response?: { id?: string; status?: string; output?: { content?: { transcript?: string; text?: string }[] }[] } };
/** Input transcription can arrive after output. Associate it by item ID, never by text order. */
export class RealtimeTranscript {
  private inputId = '';
  private questions = new Map<string, string>();
  private responses = new Map<string, { inputId: string; answer: string; done: boolean; interrupted: boolean }>();
  private latestResponse = '';
  accept(event: Event): RealtimeVoiceTurn | undefined {
    if (!['input_audio_buffer.speech_started', 'conversation.item.input_audio_transcription.completed', 'response.created', 'response.output_audio_transcript.delta', 'response.output_text.delta', 'response.output_audio_transcript.done', 'response.done'].includes(event.type || '')) return;
    if (event.type === 'input_audio_buffer.speech_started' && event.item_id) { this.inputId = event.item_id; return; }
    if (event.type === 'conversation.item.input_audio_transcription.completed' && event.item_id && typeof event.transcript === 'string') {
      this.questions.set(event.item_id, event.transcript.trim());
      if (this.questions.size > 100) this.questions.delete(this.questions.keys().next().value!);
    }
    if (event.type === 'response.created' && event.response?.id) {
      this.latestResponse = event.response.id;
      this.responses.set(this.latestResponse, { inputId: this.inputId, answer: '', done: false, interrupted: false });
      if (this.responses.size > 100) this.responses.delete(this.responses.keys().next().value!);
    }
    const id = event.response_id || event.response?.id || this.latestResponse;
    const response = this.responses.get(id);
    if (!response) return;
    if ((event.type === 'response.output_audio_transcript.delta' || event.type === 'response.output_text.delta') && typeof event.delta === 'string') response.answer += event.delta;
    if (event.type === 'response.output_audio_transcript.done' && typeof event.transcript === 'string') response.answer = event.transcript;
    if (event.type === 'response.done') {
      response.done = true;
      response.interrupted = event.response?.status !== 'completed';
      const completeText = event.response?.output?.flatMap(item => item.content ?? []).map(part => part.transcript || part.text || '').join('\n');
      if (completeText) response.answer = completeText;
    }
    // Old responses must never overwrite the turn spoken after an interruption.
    if (id !== this.latestResponse || response.inputId !== this.inputId) return;
    const question = this.questions.get(response.inputId);
    return { responseId: id, question: question || 'Spoken turn (transcription pending)', answer: response.answer, complete: response.done && Boolean(question), interrupted: response.interrupted };
  }
}
