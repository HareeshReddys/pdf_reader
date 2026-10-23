import { transcribeAudio, warmLocalTranscription } from './localTranscriptionEngine';
import type { AudioRecordingPayload } from '../../shared/types';

process.parentPort?.on('message', async ({ data }: { data: { id: number; type?: 'warmup'; recording: AudioRecordingPayload } }) => {
  try {
    if (data.type === 'warmup') { await warmLocalTranscription(); return; }
    const text = await transcribeAudio(data.recording);
    process.parentPort?.postMessage({ id: data.id, text });
  } catch (error) {
    process.parentPort?.postMessage({ id: data.id, error: error instanceof Error ? error.message : 'Local transcription failed.' });
  }
});
