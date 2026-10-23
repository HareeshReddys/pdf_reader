const assert = require('node:assert/strict');
const { app, utilityProcess } = require('electron');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const execute = require('node:util').promisify(require('node:child_process').execFile);
app.whenReady().then(async () => {
  process.env.INTERVIEW_COPILOT_DATA_DIR = path.resolve('data');
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-speech-test-'));
  let speech;
  try {
    let child;
    const originalFork = utilityProcess.fork;
    utilityProcess.fork = (...args) => { child = originalFork(...args); return child; };
    speech = require('../dist/main/services/transcriptionService');
    const invalid = { bytes: [1, 2, 3], mimeType: 'audio/wav', durationMs: 1000 };
    await assert.rejects(speech.transcribeAudio(invalid), /incomplete/);
    // Hold the next request so its response cannot race the intentional worker kill.
    child.postMessage = () => undefined;
    const interrupted = speech.transcribeAudio(invalid);
    await assert.rejects(speech.transcribeAudio(invalid), /busy/);
    const rejection = assert.rejects(interrupted, /engine stopped/);
    child.kill(); await rejection;
    await assert.rejects(speech.transcribeAudio(invalid), /incomplete/);
    console.log('PASS: real worker IPC, bounded concurrency, killed worker rejection and automatic restart.');
    if (process.platform === 'darwin') {
      const aiff = path.join(directory, 'speech.aiff'), wav = path.join(directory, 'speech.wav');
      await execute('/usr/bin/say', ['-o', aiff, 'What is CSS grid? Explain how rows and columns work.']);
      await execute('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1', aiff, wav]);
      const text = await speech.transcribeAudio({ bytes: Array.from(await fs.readFile(wav)), mimeType: 'audio/wav', durationMs: 5000 });
      assert.match(text, /grid|rows|columns/i);
      console.log('PASS: real local Whisper inference in isolated worker on synthesized test speech.');
    }
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { speech?.disposeTranscriptionWorker(); await fs.rm(directory, { recursive: true, force: true }); app.exit(process.exitCode || 0); }
});
