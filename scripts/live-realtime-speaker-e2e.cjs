// Live, billable test through the real IntelliAssist React panel and IPC.
// Generates test speech into the existing VAIO -> B1 route; never opens a physical mic.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const execute = require('node:util').promisify(require('node:child_process').execFile);
const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
app.on('window-all-closed', () => undefined);
require('dotenv').config({ path: path.resolve('.env'), override: true });
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'intelliassist-live-'));
  const contextMode = process.argv.includes('--context');
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  let window, fixture, overlayWindow, exitCode = 0;
  const proof = { at: new Date().toISOString(), transport: 'real WebRTC + OpenAI API', verificationSurface: 'overlay only', physicalMicrophoneOpened: false, output: 'text only', turns: [], passed: false };
  const voice = require('../dist/main/services/realtimeVoiceService');
  const overlay = require('../dist/main/services/overlayService');
  try {
    if (contextMode) {
      process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.join(directory, 'reference');
      await fs.mkdir(path.join(directory, 'notes'), { recursive: true });
      await fs.writeFile(path.join(directory, 'notes', 'resume.md'), 'Synthetic candidate test profile: I currently work at Example Labs as a backend engineer maintaining PostgreSQL billing APIs. No actual production outage or incident is documented. Kubernetes experience is not documented.');
      await require('../dist/main/services/jobDescriptionService').saveJobDescription('Synthetic target JD: senior backend engineer, PostgreSQL, API reliability, and Kubernetes. These are role requirements, not proof of the candidate\'s experience.');
    }
    window = new BrowserWindow({ show: false, width: 1440, height: 1000, webPreferences: { preload: path.resolve('dist/main/preload.js'), sandbox: true, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false } });
    require('../dist/main/ipc').registerIpcHandlers(() => window);
    await window.loadFile(path.resolve('dist/renderer/index.html'));
    overlayWindow = overlay.createOverlayWindow();
    if (overlayWindow.webContents.isLoading()) await new Promise(resolve => overlayWindow.webContents.once('did-finish-load', resolve));
    overlayWindow.showInactive();
    const devices = await window.webContents.executeJavaScript("navigator.mediaDevices.enumerateDevices().then(ds=>ds.map(d=>({kind:d.kind,label:d.label,id:d.deviceId})))");
    const input = devices.find(d => d.kind === 'audioinput' && /^Voicemeeter Out B1 \(/i.test(d.label));
    const output = devices.find(d => d.kind === 'audiooutput' && /^Voicemeeter Input \(/i.test(d.label));
    assert.ok(input && output, 'VAIO output / B1 input must be available; no microphone fallback is allowed.');
    proof.input = input.label; proof.testSpeechOutput = output.label;
    await overlayWindow.webContents.executeJavaScript("document.querySelector('[aria-label=\"Start continuous API voice\"]').click()");
    const connectDeadline = Date.now() + 45000;
    while (!overlay.getOverlayState().realtimeVoiceActive && Date.now() < connectDeadline) {
      const error = await overlayWindow.webContents.executeJavaScript("document.querySelector('[role=alert]')?.textContent");
      if (error) throw new Error(error); await wait(200);
    }
    assert.ok(overlay.getOverlayState().realtimeVoiceActive, 'Voice did not connect');
    await wait(2500);
    async function playSpeech(question) {
      const wav = path.join(directory, 'question.wav');
      await execute('powershell.exe', ['-NoProfile', '-Command', 'Add-Type -AssemblyName System.Speech; $tts=New-Object System.Speech.Synthesis.SpeechSynthesizer; $tts.SetOutputToWaveFile($env:TEST_SPEECH_FILE); $tts.Speak($env:TEST_SPEECH_TEXT); $tts.Dispose()'], { env: { ...process.env, TEST_SPEECH_FILE: wav, TEST_SPEECH_TEXT: question }, windowsHide: true });
      const data = 'data:audio/wav;base64,' + (await fs.readFile(wav)).toString('base64');
      await window.webContents.executeJavaScript(`(async()=>{window.__testSpeech=new Audio(${JSON.stringify(data)});await __testSpeech.setSinkId(${JSON.stringify(output.id)});await new Promise((resolve,reject)=>{__testSpeech.onended=resolve;__testSpeech.onerror=()=>reject(new Error('Test speech playback failed'));__testSpeech.play().catch(reject)});return true;})()`, true);
    }
    async function speakAndVerify(question, questionPattern, answerPattern) {
      await playSpeech(question);
      const deadline = Date.now() + 60000;
      let result;
      while (Date.now() < deadline) {
        const error = await overlayWindow.webContents.executeJavaScript("document.querySelector('[role=alert]')?.textContent");
        if (error) throw new Error(error);
        const state = overlay.getOverlayState();
        if (!state.streamingAnswer && state.question !== 'Analyze the submitted screenshot' && questionPattern.test(state.question || '') && state.answerQuestion === state.question && answerPattern.test(state.answer || '')) { result = { question: state.question, answer: state.answer }; break; }
        await wait(200);
      }
      assert.ok(result, 'Expected question and answer not received: ' + question + ' | observed: ' + JSON.stringify(overlay.getOverlayState()));
      const normalize = value => value.replace(/^```[^\n]*$/gm, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
      let overlayVisible = false;
      for (let attempt = 0; attempt < 30; attempt++) {
        const floating = normalize(await overlayWindow.webContents.executeJavaScript('document.body.textContent'));
        overlayVisible = floating.includes(normalize(result.question)) && floating.includes(normalize(result.answer));
        if (overlayVisible) break;
        await wait(100);
      }
      if (!overlayVisible) {
        proof.layoutFailure = { expectedQuestion: result.question, expectedAnswer: result.answer, overlayText: await overlayWindow.webContents.executeJavaScript('document.body.textContent'), state: overlay.getOverlayState() };
      }
      assert.ok(overlayVisible, 'Overlay must show matched question and answer');
      proof.turns.push({ spokenQuestion: question, transcript: result.question, answer: result.answer, overlayVerified: true });
      console.log('PASS spoken turn ' + proof.turns.length);
    }
    console.log('CONNECTED: real B1 audio input, text-only replies');
    if (contextMode) {
      await speakAndVerify('Based on my resume, where do I currently work and what do I maintain?', /resume|currently|maintain/i, /Example Labs/i);
      const first = proof.turns[0].answer;
      assert.match(first, /PostgreSQL|billing/i); assert.match(first, /resume\.md/i);
      await speakAndVerify('Tell me about a recent production outage that I fixed.', /outage|production/i, /hypothetical practice scenario/i);
      const incident = proof.turns[1].answer;
      assert.match(incident, /would/i); assert.match(incident, /resume\.md/i);
      await speakAndVerify('Did that outage really happen and does my resume document Kubernetes experience?', /outage|Kubernetes/i, /not|no|hypothetical|doesn.t/i);
      await overlayWindow.webContents.executeJavaScript("document.querySelector('[aria-label=\"Stop continuous API voice\"]').click()");
      for (let attempt = 0; attempt < 30 && voice.isRealtimeVoiceActive(); attempt++) await wait(100);
      assert.equal(voice.isRealtimeVoiceActive(), false, 'Overlay Stop must end the live session');
      await wait(100);
      proof.overlayStopVerified = true;
      proof.contextSnapshotVerified = true; proof.scenarioGroundingVerified = true; proof.passed = true;
      return;
    }
    await speakAndVerify('Please calculate fourteen plus nine.', /fourteen|14/i, /23|twenty.three/i);
    const preserved = overlay.getOverlayState().answer;
    await playSpeech('Hmm. Yeah, okay.');
    await wait(8000);
    proof.afterAcknowledgment = { question: overlay.getOverlayState().question, answer: overlay.getOverlayState().answer };
    assert.equal(overlay.getOverlayState().answer, preserved, 'Acknowledgments must preserve the displayed answer');
    assert.ok(!overlay.getOverlayState().streamingAnswer, 'Acknowledgments must not create another answer');
    proof.acknowledgmentsIgnored = true;
    await speakAndVerify('Please define a JavaScript closure.', /closure/i, /scope|environment|variable/i);
    fixture = new BrowserWindow({ show: true, width: 800, height: 550, title: 'IntelliAssist screenshot test', webPreferences: { sandbox: true } });
    await fixture.loadURL('data:text/html,' + encodeURIComponent('<title>IntelliAssist screenshot test</title><body style="background:white;color:#111;font:32px Arial;padding:40px"><h1>Warehouse inventory</h1><p>Blue crates: 7</p><p>Red crates: 5</p><p>Bolts per crate: 8</p></body>'));
    const screenService = require('../dist/main/services/screenCaptureService');
    fixture.setFullScreen(true); fixture.show(); await wait(800);
    const displaySources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 0, height: 0 } });
    const source = { id: displaySources[0]?.id, name: 'Primary display with warehouse fixture', kind: 'screen', thumbnailDataUrl: '' };
    // Keep the controlled fixture fullscreen so the actual display capture sends
    // only test content. Start, screenshot, stop, and all verdicts use the overlay.
    screenService.listScreenCaptureSources = async () => [source];
    assert.ok(source, 'Screenshot fixture window not found');
    await overlayWindow.webContents.executeJavaScript("document.querySelector('[aria-label=\"Send screenshot to ChatGPT\"]').click()");
    const imageDeadline = Date.now() + 20000;
    let received = false;
    while (Date.now() < imageDeadline) {
      const text = await overlayWindow.webContents.executeJavaScript('document.body.textContent');
      if (text.includes('Screenshot received')) { received = true; break; }
      const error = await overlayWindow.webContents.executeJavaScript("document.querySelector('[role=alert]')?.textContent");
      if (error) throw new Error(error); await wait(200);
    }
    assert.ok(received, 'Screenshot receipt not confirmed'); proof.screenshotReceived = true;
    let immediateImageAnswer = false;
    for (let attempt = 0; attempt < 300; attempt++) {
      const state = overlay.getOverlayState();
      if (state.question === 'Analyze the submitted screenshot' && !state.streamingAnswer && /7|seven/i.test(state.answer) && /5|five/i.test(state.answer)) { immediateImageAnswer = true; break; }
      await wait(200);
    }
    if (!immediateImageAnswer) proof.immediateImageObserved = overlay.getOverlayState();
    assert.ok(immediateImageAnswer, 'Screenshot must produce an overlay answer without a spoken question');
    proof.immediateScreenshotAnswerVerified = true;
    await speakAndVerify('How many bolts are in all the crates shown in the warehouse screenshot?', /warehouse|screenshot|bolts/i, /96|ninety.six/i);
    if (process.argv.includes('--renew')) {
      const scope = require('../dist/main/services/practiceSessionService').getPracticeSessionId();
      const retainedAnswer = overlay.getOverlayState().answer;
      await window.webContents.executeJavaScript("window.__renewalOriginalNow = Date.now.bind(Date); Date.now = () => window.__renewalOriginalNow() + 55 * 60 * 1000 + 2000; true;");
      const renewalDeadline = Date.now() + 90000;
      while (!overlay.getOverlayState().realtimeVoiceNotice?.includes('session renewed') && Date.now() < renewalDeadline) await wait(100);
      assert.ok(overlay.getOverlayState().realtimeVoiceNotice?.includes('session renewed'), 'Automatic live renewal must complete: ' + overlay.getOverlayState().realtimeVoiceNotice);
      assert.equal(require('../dist/main/services/practiceSessionService').getPracticeSessionId(), scope, 'Renewal must retain the interview history group');
      assert.equal(overlay.getOverlayState().answer, retainedAnswer, 'Renewal must retain the displayed answer');
      assert.equal(voice.isRealtimeVoiceActive(), true);
      proof.automaticRenewalVerified = true; proof.renewalTimerAccelerated = true;
      console.log('PASS: automatic live renewal with retained image, answer and interview scope');
    }
    await speakAndVerify('How many bolts would there be if we added three more of those crates?', /three|3/i, /120|hundred.and.twenty|hundred twenty/i);
    proof.followUpWithoutNewScreenshot = true;
    await overlayWindow.webContents.executeJavaScript("document.querySelector('[aria-label=\"Stop continuous API voice\"]').click()");
    for (let attempt = 0; attempt < 30 && voice.isRealtimeVoiceActive(); attempt++) await wait(100);
    assert.equal(voice.isRealtimeVoiceActive(), false, 'Overlay Stop must end the live session');
    await wait(100);
    proof.overlayStopVerified = true;
    await fs.mkdir(path.resolve('capture-tests'), { recursive: true });
    await fs.writeFile(path.resolve('capture-tests/realtime-overlay-live.png'), (await overlayWindow.webContents.capturePage()).toPNG());
    proof.passed = true;
  } catch (error) { proof.error = error.message; console.error('LIVE TEST FAILED: ' + error.message); exitCode = 1; }
  finally {
    try { if (overlayWindow && !overlayWindow.isDestroyed()) { await overlayWindow.webContents.executeJavaScript("document.querySelector('[aria-label=\"Stop continuous API voice\"]')?.click()"); await wait(200); } } catch {}
    voice.stopRealtimeVoice(); fixture?.destroy(); overlay.destroyOverlayWindow(); window?.destroy();
    await fs.mkdir(path.resolve('data/logs'), { recursive: true });
    await fs.writeFile(path.resolve(contextMode ? 'data/logs/realtime-context-e2e.json' : 'data/logs/realtime-speaker-e2e.json'), JSON.stringify(proof, null, 2));
    await fs.rm(directory, { recursive: true, force: true });
    console.log(JSON.stringify({ passed: proof.passed, turns: proof.turns.length, screenshotReceived: proof.screenshotReceived || false, followUpWithoutNewScreenshot: proof.followUpWithoutNewScreenshot || false }));
    app.exit(exitCode);
  }
});
