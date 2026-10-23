const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { app } = require('electron');
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'desktop-transcripts-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  const turns = require('../dist/main/services/assistTurnService');
  const desktop = require('../dist/main/services/chatgptDesktopService');
  const prompts = [];
  let finish;
  desktop.askChatGptDesktop = async text => { prompts.push(text); if (text === 'pending statement') return new Promise(resolve => { finish = resolve; }); return 'Desktop reply: ' + text; };
  const { forwardDesktopTranscript } = require('../dist/main/services/desktopTranscriptService');
  const overlay = require('../dist/main/services/overlayService');
  const recording = { audioSource: 'system', utteranceComplete: true };
  try {
    turns.configureAssistTurn(true);
    await forwardDesktopTranscript('yes', recording);
    await forwardDesktopTranscript('yes', recording);
    assert.deepEqual(prompts, ['yes', 'yes'], 'Acknowledgements and repeats must bypass filtering');
    await forwardDesktopTranscript('This is', { ...recording, utteranceComplete: false });
    assert.equal(prompts.length, 2);
    await forwardDesktopTranscript('a statement, not a question.', recording);
    assert.equal(prompts.at(-1), 'This is a statement, not a question.');
    assert.equal(overlay.getOverlayState().generationMode, 'chatgpt');
    await assert.rejects(forwardDesktopTranscript('mic', { ...recording, audioSource: 'microphone' }), /speaker output only/);
    turns.setAssistAnswerHold(true);
    await forwardDesktopTranscript('held speech', recording);
    assert.equal(prompts.length, 3);
    turns.setAssistAnswerHold(false);
    const pending = forwardDesktopTranscript('pending statement', recording);
    while (!finish) await new Promise(resolve => setTimeout(resolve, 5));
    const prior = overlay.getOverlayState().answer;
    turns.configureAssistTurn(false); finish('Stale reply'); await pending;
    assert.equal(overlay.getOverlayState().answer, prior, 'Stop must suppress stale replies');
    console.log('PASS: verbatim forwarding, statements, acknowledgements, repeats, continuation buffering, mic rejection, hold and stale-response suppression.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { turns.configureAssistTurn(false); await fs.rm(directory, { recursive: true, force: true }); app.exit(process.exitCode || 0); }
});
