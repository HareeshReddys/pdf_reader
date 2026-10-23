import { useCallback, useEffect, useRef, useState } from 'react';
import { openWindowsOutput } from '../audioOutput';
export type AudioRecordingResult = {
  bytes: number[];
  mimeType: string;
  durationMs: number;
  audioSource: 'microphone' | 'system';
  deviceLabel: string;
  capturedAt?: number;
  utteranceComplete?: boolean;
};

type Options = {
  onChunk: (recording: AudioRecordingResult) => void | Promise<void>;
  deviceId?: string;
  deviceLabel?: string;
  audioSource?: 'microphone' | 'system';
  maximumUtteranceMs?: number;
  endpointPauseMs?: number;
};

function downsample(input: Float32Array, sourceRate: number, targetRate = 16_000): Float32Array {
  if (sourceRate === targetRate) return input;
  const ratio = sourceRate / targetRate;
  const output = new Float32Array(Math.round(input.length / ratio));
  for (let index = 0; index < output.length; index += 1) {
    const start = Math.floor(index * ratio);
    const end = Math.min(input.length, Math.floor((index + 1) * ratio));
    let total = 0;
    for (let sourceIndex = start; sourceIndex < end; sourceIndex += 1) total += input[sourceIndex];
    output[index] = total / Math.max(1, end - start);
  }
  return output;
}

function encodeWav(samples: Float32Array, sampleRate = 16_000): Uint8Array {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const text = (offset: number, value: string) => [...value].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true); text(8, 'WAVE');
  text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, 'data'); view.setUint32(40, samples.length * 2, true);
  samples.forEach((sample, index) => view.setInt16(44 + index * 2, Math.round(Math.max(-1, Math.min(1, sample)) * (sample < 0 ? 0x8000 : 0x7fff)), true));
  return new Uint8Array(buffer);
}

export function useAssistRecorder({
  onChunk,
  deviceId,
  deviceLabel = 'Default microphone',
  audioSource = 'microphone',
  maximumUtteranceMs = 24_000,
  endpointPauseMs = 1400,
}: Options) {
  const [active, setActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const activeRef = useRef(false);
  const nativeCleanupRef = useRef<(() => void) | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const buffersRef = useRef<Float32Array[]>([]);
  const samplesRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const utteranceStartedAtRef = useRef(0);
  const lastVoiceAtRef = useRef(0);
  const preRollRef = useRef<Float32Array[]>([]);
  const voiceDetectedRef = useRef(false);
  const noiseFloorRef = useRef(0.003);
  const queueRef = useRef(Promise.resolve());
  const queuedChunksRef = useRef(0);
  const onChunkRef = useRef(onChunk);
  const sessionEpochRef = useRef(0);

  useEffect(() => { onChunkRef.current = onChunk; }, [onChunk]);

  const flushChunk = useCallback((utteranceComplete = true) => {
    const context = contextRef.current;
    if (!context || samplesRef.current === 0) return;
    const combined = new Float32Array(samplesRef.current);
    let offset = 0;
    for (const part of buffersRef.current) { combined.set(part, offset); offset += part.length; }
    buffersRef.current = []; samplesRef.current = 0; utteranceStartedAtRef.current = 0; lastVoiceAtRef.current = 0;
    voiceDetectedRef.current = false; setVoiceDetected(false);
    const wav = encodeWav(downsample(combined, context.sampleRate));
    const durationMs = Math.round(combined.length / context.sampleRate * 1000);
    setProcessing(true);
    const epoch = sessionEpochRef.current;
    const capturedAt = Date.now();
    if (queuedChunksRef.current >= 3) {
      setError('Speech processing is falling behind. Skipped an audio chunk to keep the app responsive; shorter questions will help.');
      return;
    }
    queuedChunksRef.current++;
    queueRef.current = queueRef.current
      .then(() => epoch === sessionEpochRef.current && activeRef.current ? onChunkRef.current({ bytes: Array.from(wav), mimeType: 'audio/wav', durationMs, audioSource, deviceLabel, capturedAt, utteranceComplete }) : undefined)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Local transcription failed.'))
      .finally(() => { queuedChunksRef.current--; setProcessing(queuedChunksRef.current > 0); });
  }, [audioSource, deviceLabel]);

  const release = useCallback(() => {
    nativeCleanupRef.current?.(); nativeCleanupRef.current = null;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    processorRef.current?.disconnect(); sourceRef.current?.disconnect(); gainRef.current?.disconnect();
    processorRef.current = null; sourceRef.current = null; gainRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null;
    const context = contextRef.current; contextRef.current = null;
    if (context && context.state !== 'closed') void context.close();
  }, []);

  const start = useCallback(async () => {
    if (activeRef.current) return true;
    sessionEpochRef.current++;
    setError(null); setElapsedMs(0); buffersRef.current = []; samplesRef.current = 0; preRollRef.current = [];
    try {
      if (deviceId?.startsWith('pulse:')) {
        const removeChunk = window.interviewAPI.onCallAudioChunk((chunk) => {
          if (!activeRef.current) return;
          if (queuedChunksRef.current >= 3) {
            setError('Speech processing is falling behind. Skipped an audio chunk to keep the app responsive.');
            return;
          }
          queuedChunksRef.current++;
          setProcessing(true);
          const epoch = sessionEpochRef.current;
          queueRef.current = queueRef.current.then(() => activeRef.current && epoch === sessionEpochRef.current ? onChunkRef.current({ ...chunk, audioSource: 'system', deviceLabel: chunk.deviceLabel || deviceLabel }) : undefined)
            .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Call transcription failed.'))
            .finally(() => { queuedChunksRef.current--; setProcessing(queuedChunksRef.current > 0); });
        });
        const removeError = window.interviewAPI.onCallAudioError((message) => { setError(message); activeRef.current = false; setActive(false); release(); void window.interviewAPI.configureAssistTurn(false); });
        nativeCleanupRef.current = () => { removeChunk(); removeError(); void window.interviewAPI.stopCallAudioCapture(); };
        await window.interviewAPI.startCallAudioCapture(deviceId.slice(6));
        activeRef.current = true; setActive(true); startedAtRef.current = Date.now();
        timerRef.current = window.setInterval(() => setElapsedMs(Date.now() - startedAtRef.current), 500);
        return true;
      }
      if (deviceId !== 'system:windows-loopback') throw new Error('Choose speaker output. Microphone fallback is disabled.');
      const stream = await openWindowsOutput();
      streamRef.current = stream;
      for (const track of stream.getAudioTracks()) track.addEventListener('ended', () => {
        if (!activeRef.current) return;
        sessionEpochRef.current++; activeRef.current = false; setActive(false);
        setError('Speaker-output capture ended. Start assistant mode to reconnect. Microphone fallback is disabled.');
        release(); void window.interviewAPI.configureAssistTurn(false);
      }, { once: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);
      const silentGain = context.createGain(); silentGain.gain.value = 0;
      processor.onaudioprocess = (event) => {
        if (!activeRef.current) return;
        const copy = new Float32Array(event.inputBuffer.getChannelData(0));
        let squareTotal = 0;
        for (const sample of copy) squareTotal += sample * sample;
        const rms = Math.sqrt(squareTotal / copy.length);
        const speaking = rms >= Math.max(0.006, noiseFloorRef.current * 2.5);
        const now = Date.now();
        if (speaking) {
          if (!voiceDetectedRef.current) { voiceDetectedRef.current = true; setVoiceDetected(true); }
          if (!utteranceStartedAtRef.current) {
            utteranceStartedAtRef.current = now;
            for (const preRoll of preRollRef.current) { buffersRef.current.push(preRoll); samplesRef.current += preRoll.length; }
            preRollRef.current = [];
          }
          lastVoiceAtRef.current = now;
          buffersRef.current.push(copy); samplesRef.current += copy.length;
        } else if (utteranceStartedAtRef.current) {
          buffersRef.current.push(copy); samplesRef.current += copy.length;
          if (now - lastVoiceAtRef.current >= endpointPauseMs) flushChunk();
        } else {
          noiseFloorRef.current = noiseFloorRef.current * 0.95 + rms * 0.05;
          preRollRef.current.push(copy);
          if (preRollRef.current.length > 3) preRollRef.current.shift();
        }
        if (utteranceStartedAtRef.current && now - utteranceStartedAtRef.current >= maximumUtteranceMs) flushChunk(false);
      };
      source.connect(processor); processor.connect(silentGain); silentGain.connect(context.destination);
      streamRef.current = stream; contextRef.current = context; sourceRef.current = source; processorRef.current = processor; gainRef.current = silentGain;
      activeRef.current = true; setActive(true); startedAtRef.current = Date.now();
      timerRef.current = window.setInterval(() => setElapsedMs(Date.now() - startedAtRef.current), 500);
      return true;
    } catch (reason) {
      release();
      setError(reason instanceof Error ? reason.message : 'Speaker-output capture failed. Microphone fallback is disabled.');
      return false;
    }
  }, [audioSource, deviceId, endpointPauseMs, flushChunk, maximumUtteranceMs, release]);

  const stop = useCallback(async () => {
    sessionEpochRef.current++; activeRef.current = false; setActive(false); flushChunk(); release();
    await queueRef.current;
  }, [flushChunk, release]);

  useEffect(() => () => { activeRef.current = false; release(); }, [release]);
  return { active, processing, voiceDetected, elapsedMs, error, start, stop, dismissError: () => setError(null) };
}
