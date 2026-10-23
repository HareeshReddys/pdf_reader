import path from 'node:path';
import { normalizeInterviewTerms } from './interviewVocabulary';
import type { AudioRecordingPayload } from '../../shared/types';

const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const DEFAULT_LOCAL_MODEL = 'onnx-community/whisper-base.en';

type TranscriberOutput = { text?: string } | Array<{ text?: string }>;
type LocalTranscriber = (audio: Float32Array, options?: Record<string, unknown>) => Promise<TranscriberOutput>;
let transcriberPromise: Promise<LocalTranscriber> | undefined;

function validateRecording(recording: AudioRecordingPayload): void {
  if (!Array.isArray(recording?.bytes) || recording.bytes.length === 0) throw new Error('The recording is empty. Please try again.');
  if (recording.bytes.length > MAX_AUDIO_BYTES) throw new Error('The audio chunk is too large to transcribe locally.');
  if (recording.mimeType !== 'audio/wav') throw new Error(`Local transcription requires WAV audio, but received ${recording.mimeType || 'an unknown format'}.`);
}

function decodePcm16Wav(bytes: number[]): Float32Array {
  const buffer = Uint8Array.from(bytes);
  if (buffer.length < 44) throw new Error('The recorded WAV audio is incomplete.');
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const ascii = (offset: number, length: number) => String.fromCharCode(...buffer.slice(offset, offset + length));
  if (ascii(0, 4) !== 'RIFF' || ascii(8, 4) !== 'WAVE') throw new Error('The recorded audio is not a valid WAV file.');
  const channels = view.getUint16(22, true);
  const sampleRate = view.getUint32(24, true);
  const bitsPerSample = view.getUint16(34, true);
  if (channels !== 1 || sampleRate !== 16_000 || bitsPerSample !== 16) throw new Error('Local transcription expects mono 16 kHz PCM audio.');
  let dataOffset = 12;
  let dataLength = 0;
  while (dataOffset + 8 <= buffer.length) {
    const chunkId = ascii(dataOffset, 4);
    const chunkLength = view.getUint32(dataOffset + 4, true);
    if (chunkId === 'data') { dataOffset += 8; dataLength = Math.min(chunkLength, buffer.length - dataOffset); break; }
    dataOffset += 8 + chunkLength + (chunkLength % 2);
  }
  if (!dataLength) throw new Error('The recorded WAV file contains no audio samples.');
  const samples = new Float32Array(Math.floor(dataLength / 2));
  for (let index = 0; index < samples.length; index += 1) samples[index] = view.getInt16(dataOffset + index * 2, true) / 32768;
  return samples;
}

async function getTranscriber(): Promise<LocalTranscriber> {
  if (!transcriberPromise) {
    transcriberPromise = Promise.resolve().then(async () => {
      const transformers = require('@huggingface/transformers') as {
        env: { cacheDir: string; allowRemoteModels: boolean; allowLocalModels: boolean };
        pipeline: (task: string, model: string, options: Record<string, unknown>) => Promise<LocalTranscriber>;
      };
      const dataDirectory = process.env.INTERVIEW_COPILOT_DATA_DIR;
      if (!dataDirectory) throw new Error('Transcription worker data directory is missing.');
      transformers.env.cacheDir = path.join(dataDirectory, 'models', 'transformers');
      transformers.env.allowRemoteModels = true;
      transformers.env.allowLocalModels = true;
      return transformers.pipeline(
        'automatic-speech-recognition',
        process.env.LOCAL_TRANSCRIPTION_MODEL?.trim() || DEFAULT_LOCAL_MODEL,
        { device: 'cpu', dtype: 'q8', session_options: { intraOpNumThreads: 2, interOpNumThreads: 1 } },
      );
    }).catch((error: unknown) => {
      transcriberPromise = undefined;
      throw error;
    });
  }
  return transcriberPromise;
}

export async function warmLocalTranscription(): Promise<void> {
  const transcriber = await getTranscriber();
  await transcriber(new Float32Array(1600));
}

export async function transcribeAudio(recording: AudioRecordingPayload): Promise<string> {
  validateRecording(recording);
  const samples = decodePcm16Wav(recording.bytes);
  if (samples.length < 1_600) throw new Error('The audio chunk is too short to transcribe.');
  try {
    const transcriber = await getTranscriber();
    const output = await transcriber(samples);
    const first = Array.isArray(output) ? output[0] : output;
    const text = first?.text?.trim() ?? '';
    if (!text) throw new Error('No speech was detected in the latest audio chunk.');
    return normalizeInterviewTerms(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/No speech was detected/.test(message)) throw error;
    throw new Error(`Local speech-to-text failed: ${message}`);
  }
}

export function getLocalTranscriptionModel(): string {
  return process.env.LOCAL_TRANSCRIPTION_MODEL?.trim() || DEFAULT_LOCAL_MODEL;
}
