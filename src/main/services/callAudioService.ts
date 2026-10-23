import { execFile, spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { promisify } from 'node:util';
import type { AudioRecordingPayload, CallAudioSource } from '../../shared/types';
const execute = promisify(execFile);
let recorder: ChildProcessWithoutNullStreams | undefined;
let stopCurrent: (() => void) | undefined;

export async function listCallAudioSources(): Promise<CallAudioSource[]> {
  if (process.platform === 'win32') return [{ id: 'windows-loopback', name: 'Windows default speaker / headphone output' }];
  if (process.platform !== 'linux') return [];
  const { stdout } = await execute('pactl', ['--format=json', 'list', 'sources'], { timeout: 5000, maxBuffer: 1024 * 1024 });
  const sources = JSON.parse(stdout) as Array<{ name: string; description?: string; monitor_of_sink?: string | number }>;
  return sources.filter((source) => source.name.endsWith('.monitor'))
    .map((source) => ({ id: source.name, name: source.description || source.name }));
}

export function stopCallAudioCapture(): void { stopCurrent?.(); stopCurrent = undefined; }

function wav(pcm: Buffer): number[] {
  const header = Buffer.alloc(44);
  header.write('RIFF'); header.writeUInt32LE(pcm.length + 36, 4); header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(16000, 24); header.writeUInt32LE(32000, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
  return Array.from(Buffer.concat([header, pcm]));
}

/** Record the output monitor only: never open a microphone as a fallback. */
export async function startCallAudioCapture(sourceId: string, onChunk: (chunk: AudioRecordingPayload) => void, onError: (message: string) => void): Promise<void> {
  const source = (await listCallAudioSources()).find((item) => item.id === sourceId);
  if (!source) throw new Error('Choose an available call-output monitor. Microphone fallback is disabled.');
  stopCallAudioCapture();
  const child = spawn('parec', ['--raw', '--format=s16le', '--rate=16000', '--channels=1', '--latency-msec=100', `--device=${source.id}`], { stdio: ['pipe', 'pipe', 'pipe'] });
  recorder = child;
  let stopped = false, pending = Buffer.alloc(0), frames: Buffer[] = [], voiced = 0, silence = 0, total = 0;
  let noise = 0.002;
  const flush = (utteranceComplete: boolean) => {
    if (voiced >= 8) {
      const pcm = Buffer.concat(frames);
      onChunk({ bytes: wav(pcm), mimeType: 'audio/wav', durationMs: pcm.length / 32, audioSource: 'system', deviceLabel: source.name, utteranceComplete });
    }
    frames = []; voiced = 0; silence = 0; total = 0;
  };
  child.stdout.on('data', (chunk: Buffer) => {
    if (stopped) return;
    pending = Buffer.concat([pending, chunk]);
    while (pending.length >= 640) {
      const frame = Buffer.from(pending.subarray(0, 640)); pending = pending.subarray(640);
      let square = 0;
      for (let i = 0; i < frame.length; i += 2) square += (frame.readInt16LE(i) / 32768) ** 2;
      const rms = Math.sqrt(square / 320), speaking = rms > Math.max(0.005, noise * 2.5);
      if (speaking || voiced) { frames.push(frame); total++; }
      if (speaking) { voiced++; silence = 0; }
      else if (voiced) silence++;
      else noise = noise * 0.98 + rms * 0.02;
      if (silence >= 70) flush(true); else if (total >= 1200) flush(false); // 1.4s pause / 24s forced continuation.
    }
  });
  let stderr = '';
  child.stderr.on('data', (data: Buffer) => { stderr = `${stderr}${data.toString()}`.slice(-500); });
  child.on('error', (error) => { if (!stopped) onError(`Call audio capture failed: ${error.message}`); });
  child.on('exit', (code) => { if (recorder === child) recorder = undefined; if (!stopped) { stopped = true; onError(`Call audio stopped (${code ?? 'signal'}). ${stderr}`); } });
  stopCurrent = () => { stopped = true; child.kill('SIGTERM'); frames = []; pending = Buffer.alloc(0); if (recorder === child) recorder = undefined; };
  await new Promise<void>((resolve, reject) => { child.once('spawn', resolve); child.once('error', reject); });
}
