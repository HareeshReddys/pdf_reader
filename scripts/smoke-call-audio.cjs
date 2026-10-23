const assert = require('node:assert/strict');
const { spawn, execFile } = require('node:child_process');
const execute = require('node:util').promisify(execFile);
const { startCallAudioCapture, stopCallAudioCapture, listCallAudioSources } = require('../dist/main/services/callAudioService');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function play(sink, seconds = 2) {
  const pcm = Buffer.alloc(16000 * 2 * (seconds + 2));
  for (let i = 0; i < seconds * 16000; i++) pcm.writeInt16LE(Math.round(Math.sin(i * 2 * Math.PI * 440 / 16000) * 6000), i * 2);
  const player = spawn('paplay', ['--raw', '--format=s16le', '--rate=16000', '--channels=1', `--device=${sink}`]);
  player.stdin.end(pcm);
  await new Promise((resolve, reject) => { player.once('error', reject); player.once('exit', code => code === 0 ? resolve() : reject(new Error(`paplay exited ${code}`))); });
}
(async () => {
  const modules = []; const suffix = process.pid; const first = `copilot_test_a_${suffix}`, other = `copilot_test_b_${suffix}`;
  const chunks = [], errors = [];
  try {
    for (const name of [first, other]) modules.push((await execute('pactl', ['load-module', 'module-null-sink', `sink_name=${name}`])).stdout.trim());
    const sources = await listCallAudioSources(); assert.ok(sources.some(source => source.id === `${first}.monitor`));
    await assert.rejects(startCallAudioCapture('alsa_input.pci-0000_00_1f.3.analog-stereo', () => {}, () => {}), /Microphone fallback is disabled/);
    await startCallAudioCapture(`${first}.monitor`, chunk => chunks.push(chunk), message => errors.push(message));
    await delay(300);
    await play(other); await delay(300); assert.equal(chunks.length, 0, 'Audio from another output must not enter the selected monitor');
    await play(first); await delay(500);
    assert.ok(chunks.length > 0, 'Selected call output must produce a speech segment');
    assert.ok(chunks.every(chunk => chunk.audioSource === 'system' && Buffer.from(chunk.bytes).subarray(0, 4).toString() === 'RIFF'));
    assert.deepEqual(errors, []);
    stopCallAudioCapture(); const count = chunks.length; await delay(300); assert.equal(chunks.length, count);
    console.log('PASS: real native PCM capture, selected-output isolation, physical microphone rejection, WAV segmentation and stop cleanup.');
  } finally {
    stopCallAudioCapture();
    for (const module of modules.reverse()) await execute('pactl', ['unload-module', module]);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
