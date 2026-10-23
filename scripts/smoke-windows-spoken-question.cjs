const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const execute = require('node:util').promisify(require('node:child_process').execFile);
const { app, BrowserWindow } = require('electron');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check, timeout = 90000) { const end = Date.now() + timeout; while (!await check()) { if (Date.now() > end) throw new Error('Spoken-question test timed out'); await wait(150); } }
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-spoken-question-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.resolve('knowledge/reference');
  process.env.CODEX_ENABLED = 'false'; delete process.env.OPENAI_API_KEY;
  const desktopMode = process.argv.includes('--chatgpt-desktop');
  if (desktopMode) process.env.ANSWER_PROVIDER = 'chatgpt-desktop'; else delete process.env.ANSWER_PROVIDER;
  const question = process.env.COPILOT_BENCH_QUESTION || 'What is CSS Grid? Explain how rows and columns work.';
  const keyword = process.env.COPILOT_BENCH_KEYWORD || 'grid';
  const expected = new RegExp(keyword, 'i');
  let main, player, overlay;
  try {
    await fs.symlink(path.resolve('data/models'), path.join(directory, 'models'), 'junction');
    const speechPath = path.join(directory, 'speech.wav');
    await execute('powershell.exe', ['-NoProfile', '-Command', 'Add-Type -AssemblyName System.Speech; $speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speaker.SetOutputToWaveFile($env:COPILOT_TEST_SPEECH); $speaker.Speak($env:COPILOT_BENCH_QUESTION); $speaker.Dispose()'], { env: { ...process.env, COPILOT_TEST_SPEECH: speechPath, COPILOT_BENCH_QUESTION: question } });
    main = new BrowserWindow({ show: false, webPreferences: { preload: path.resolve('dist/main/preload.js'), sandbox: true, contextIsolation: true, nodeIntegration: false } });
    require('../dist/main/services/windowsLoopbackService').configureWindowsLoopback(main);
    await require('../dist/platform/captureProtection').enableCaptureProtection(main);
    require('../dist/main/ipc').registerIpcHandlers(() => main);
    await main.loadFile(path.resolve('dist/renderer/index.html'));
    main.show();
    if (desktopMode) {
      overlay = require('../dist/main/services/overlayService').createOverlayWindow();
      await new Promise(resolve => overlay.webContents.once('did-finish-load', resolve));
      overlay.show();
    }
    await until(() => main.webContents.executeJavaScript("document.querySelector('.audio-panel select')?.value === 'system:windows-loopback'"));
    await main.webContents.executeJavaScript("window.micRequests=0; navigator.mediaDevices.getUserMedia=async()=>{window.micRequests++;throw new Error('Microphone forbidden');}; [...document.querySelectorAll('.audio-panel button')].find(button=>button.textContent==='Start assistant mode').click();", true);
    await until(() => main.webContents.executeJavaScript("Boolean(document.querySelector('.audio-panel .is-stop'))"));
    player = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
    await player.loadFile(path.resolve('scripts/fixtures/audio-output.html'));
    const data = 'data:audio/wav;base64,' + (await fs.readFile(speechPath)).toString('base64');
    const playbackStarted = Date.now();
    await player.webContents.executeJavaScript(`window.spokenTestAudio=new Audio(${JSON.stringify(data)}); spokenTestAudio.onended=()=>window.spokenTestEndedAt=Date.now(); spokenTestAudio.play();`, true);
    let partialVisibleAt = 0;
    await until(async () => {
      if (desktopMode && !partialVisibleAt) {
        const state = require('../dist/main/services/overlayService').getOverlayState();
        if (state.streamingAnswer && !state.answer) {
          const visible = await overlay.webContents.executeJavaScript("document.querySelector('[aria-label=\"Answer arriving from ChatGPT\"]')?.textContent || ''");
          if (visible.trim() && visible.includes(state.streamingAnswer)) partialVisibleAt = Date.now();
        }
      }
      const error = await main.webContents.executeJavaScript("document.querySelector('.audio-panel__error')?.textContent || ''");
      if (error) throw new Error(error);
      return main.webContents.executeJavaScript(`new RegExp(${JSON.stringify(keyword)}, "i").test(document.querySelectorAll('.audio-panel__output p')[1]?.textContent || '')`);
    }, 150000);
    const text = await main.webContents.executeJavaScript("[...document.querySelectorAll('.audio-panel__output p')].map(node=>node.textContent)");
    assert.match(text[0], expected); assert.match(text[1], expected);
    for (const term of question.toLowerCase().replace(/[^a-z ]/g, '').split(/\s+/).filter(term => term.length > 3)) assert.ok(text[1].toLowerCase().includes(term), 'Full question must arrive before forwarding: missing ' + term);
    await until(() => Boolean(require('../dist/main/services/overlayService').getOverlayState().answer));
    const answer = require('../dist/main/services/overlayService').getOverlayState().answer;
    assert.match(answer, expected);
    if (desktopMode) {
      assert.ok(partialVisibleAt, 'Partial ChatGPT reply must appear in the actual overlay before the completed reply');
      assert.equal(require('../dist/main/services/overlayService').getOverlayState().generationMode, 'chatgpt');
      await until(() => overlay.webContents.executeJavaScript(`new RegExp(${JSON.stringify(keyword)}, "i").test(document.querySelector('.overlay-content')?.textContent || '')`));
      const displayed = await overlay.webContents.executeJavaScript("document.querySelector('.overlay-content').textContent");
      assert.match(displayed, expected);
      assert.equal(displayed.replace(/\s+/g, ' ').trim(), answer.replace(/\s+/g, ' ').trim(), 'Overlay must display the returned desktop reply');
      const diagnostics = (await fs.readFile(path.join(directory, 'logs/runtime.log'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
      const speechEndedAt = await player.webContents.executeJavaScript('window.spokenTestEndedAt || 0');
      const firstText = diagnostics.find(entry => entry.event === 'desktop-chat-first-text');
      const proof = { question, accessibleTextToOverlayMs: partialVisibleAt - firstText.bridgeObservedAtMs, speechEndToPartialMs: partialVisibleAt - speechEndedAt, transcriptionMs: diagnostics.filter(entry => entry.event === 'transcription-completed').at(-1)?.milliseconds, submissionMs: diagnostics.filter(entry => entry.event === 'desktop-chat-submitted').at(-1)?.milliseconds, verifiedAt: new Date().toISOString(), transcript: text[0], answer, overlayText: displayed, generationMode: 'chatgpt', microphoneRequests: 0, partialVisibleBeforeComplete: Boolean(partialVisibleAt), playbackToPartialMs: partialVisibleAt - playbackStarted, desktopFirstTextMs: diagnostics.filter(entry => entry.event === 'desktop-chat-first-text').at(-1)?.milliseconds, desktopMs: diagnostics.filter(entry => entry.event === 'desktop-chat-completed').at(-1)?.totalMs, playbackToOverlayMs: Date.now() - playbackStarted };
      await fs.writeFile(path.resolve('data/logs/chatgpt-desktop-e2e.json'), JSON.stringify(proof, null, 2));
      console.log(JSON.stringify({ desktopFirstTextMs: proof.desktopFirstTextMs, desktopMs: proof.desktopMs, playbackToOverlayMs: proof.playbackToOverlayMs }));
      console.log('Verified actual overlay renderer contains the ChatGPT desktop reply.');
    }
    assert.equal(await main.webContents.executeJavaScript('micRequests'), 0);
    await main.webContents.executeJavaScript("document.querySelector('.audio-panel .is-stop').click()");
    await until(() => !require('../dist/main/services/assistTurnService').getAssistTurnState().active);
    await until(async () => (await require('../dist/main/services/sessionService').listSessions()).some(session => session.question === 'Assist mode practice session'));
    console.log(JSON.stringify({ transcript: text[0], question: text[1], answerPreview: answer.slice(0, 200), microphoneRequests: 0 }, null, 2));
    console.log(desktopMode ? 'PASS: actual speaker playback -> assistant capture -> local Whisper -> ChatGPT desktop UI -> actual overlay renderer, with no question detection, no CLI and no microphone access.' : 'PASS: real Windows playback -> actual assistant output capture -> local Whisper -> question detection -> source answer, with no microphone access.');
  } catch (error) { console.error(error); if (main && !main.isDestroyed()) console.error(await main.webContents.executeJavaScript("document.querySelector('.audio-panel')?.innerText")); process.exitCode = 1; }
  finally {
    require('../dist/main/services/transcriptionService').disposeTranscriptionWorker();
    if (overlay) require('../dist/main/services/overlayService').destroyOverlayWindow();
    player?.destroy(); main?.destroy();
    // Remove the cache junction first; preserve the existing user model files.
    await fs.unlink(path.join(directory, 'models')).catch(() => undefined);
    await fs.rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    app.exit(process.exitCode || 0);
  }
});
