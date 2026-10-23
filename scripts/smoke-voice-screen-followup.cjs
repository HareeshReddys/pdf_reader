// Opt-in live acoustic E2E. All ChatGPT controls use the native accessibility
// bridge; questions are actual WAV playback through the named physical speaker.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const execute = require('node:util').promisify(require('node:child_process').execFile);
const { app, BrowserWindow } = require('electron');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  app.setAccessibilitySupportEnabled(true);
  const data = await fs.mkdtemp(path.join(os.tmpdir(), 'voice-screen-followup-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = data;
  process.env.ANSWER_PROVIDER = 'chatgpt-desktop';
  const overlay = require('../dist/main/services/overlayService');
  const mirror = require('../dist/main/services/voiceMirrorService');
  const desktop = require('../dist/main/services/chatgptDesktopService');
  let player, fixture, helper, initial, startedVoice = false;
  const attachmentOnly = process.argv.includes('--attachment-only');
  const report = { passed: false, stages: [], method: 'accessibility controls, actual speaker playback, real screenshot, actual overlay DOM', testedAt: new Date().toISOString() };
  const watchdog = setTimeout(() => { console.error('Live flow exceeded eight minutes'); app.exit(1); }, 480000);
  const control = (command, args = []) => execute(helper, [command, ...args], { windowsHide: true, timeout: 25000 });
  try {
    helper = await desktop.getChatGptDesktopHelper();
    initial = await desktop.getChatGptVoiceStatus();
    if (process.argv.includes('--fresh')) {
      if (initial.active) await control('--stop-voice');
      await control('--start-fresh-voice'); startedVoice = true;
    } else if (!initial.active) { await control('--start-voice'); startedVoice = true; }
    await control('--mute-speakers');
    await control('--enable-microphone');
    require('../dist/main/ipc').registerIpcHandlers();
    const floating = overlay.createOverlayWindow();
    if (floating.webContents.isLoading()) await new Promise(r => floating.webContents.once('did-finish-load', r));
    overlay.showOverlay(); await mirror.startVoiceMirror();
    player = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
    await player.loadFile(path.resolve('scripts/fixtures/audio-output.html'));
    let output = await player.webContents.executeJavaScript("navigator.mediaDevices.enumerateDevices().then(items=>{const d=items.find(d=>d.kind==='audiooutput' && /^Speaker \\(Realtek\\(R\\) Audio\\)$/.test(d.label));return d?{deviceId:d.deviceId,label:d.label}:null;})");
    assert.ok(output, 'Explicit Realtek speaker output is required; no guessed audio device');
    if (process.env.VOICE_TEST_ROUTING === 'voicemeeter') {
      const mixer = path.resolve('data/runtime/VoiceMeeterBridge.exe');
      const parameters = (await execute(mixer, ['get', 'Strip[3].A1;Strip[3].B1;Strip[3].Mute;Bus[0].Mute'], { timeout: 5000, windowsHide: true })).stdout.trim().split(/\r?\n/).map(line=>JSON.parse(line));
      const values = Object.fromEntries(parameters.map(p=>[p.name,p.value]));
      assert.equal(values['Strip[3].A1'],1); assert.equal(values['Strip[3].B1'],1); assert.equal(values['Strip[3].Mute'],0); assert.equal(values['Bus[0].Mute'],0);
      const physical = JSON.parse((await execute(mixer, ['get-string', 'Bus[0].device.name'], { timeout: 5000, windowsHide: true })).stdout).value;
      assert.equal(physical, output.label, 'The virtual route must also play through the actual Realtek speakers');
      output = await player.webContents.executeJavaScript("navigator.mediaDevices.enumerateDevices().then(items=>{const d=items.find(d=>d.kind==='audiooutput'&&d.label==='Voicemeeter Input (VB-Audio Voicemeeter VAIO)');return d?{deviceId:d.deviceId,label:d.label}:null;})");
      assert.ok(output); report.audibleHardwareOutput = physical; report.virtualInputRoute = 'Voicemeeter B1';
    }
    report.outputDevice = output.label;
    const speak = async phrase => {
      console.log('SPEAKING:', phrase);
      const wav = path.join(data, 'question.wav');
      await execute('powershell.exe', ['-NoProfile', '-Command', 'Add-Type -AssemblyName System.Speech; $voice = New-Object System.Speech.Synthesis.SpeechSynthesizer; $voice.Volume=100; $voice.SetOutputToWaveFile($env:LIVE_WAV); $voice.Speak($env:LIVE_PHRASE); $voice.Dispose()'], { windowsHide: true, timeout: 15000, env: { ...process.env, LIVE_WAV: wav, LIVE_PHRASE: phrase } });
      const audio = 'data:audio/wav;base64,' + (await fs.readFile(wav)).toString('base64');
      await player.webContents.executeJavaScript(`(async()=>{const audio=new Audio(${JSON.stringify(audio)});audio.volume=1;await audio.setSinkId(${JSON.stringify(output.deviceId)});await new Promise((resolve,reject)=>{audio.onended=resolve;audio.onerror=()=>reject(new Error('Speaker playback failed'));audio.play().catch(reject);});return true;})()`, true);
    };
    const waitFor = async (label, questionPattern, answerPattern, milliseconds = 90000, minimumLength = 20) => {
      const started = Date.now();
      let previousAnswer = '', stableSince = Date.now();
      while (Date.now() - started < milliseconds) {
        const state = overlay.getOverlayState();
        const answer = state.streamingAnswer || '';
        if (answer !== previousAnswer) { previousAnswer = answer; stableSince = Date.now(); }
        if (questionPattern.test(state.question || '') && answer.length >= minimumLength && answerPattern.test(answer) && Date.now() - stableSince >= 1500) {
          const text = await floating.webContents.executeJavaScript("document.querySelector('.overlay-content')?.textContent || ''");
          if (answerPattern.test(text)) {
            report.stages.push({ label, passed: true, question: state.question, answer, overlayText: text });
            console.log('PASS:', label); return;
          }
        }
        if (state.activity === 'error') throw new Error(state.activityDetail);
        await delay(200);
      }
      try { report.latestAccessibleTurn = JSON.parse((await control('--voice-snapshot')).stdout); } catch (error) { report.snapshotError = error.message; }
      throw new Error(label + ': no matching new question and answer in the actual overlay within 90 seconds');
    };
    if (!attachmentOnly) {
      await speak('What is a JavaScript promise?');
      await waitFor('initial spoken question', /promise/i, /promise|asynchron|async|future|eventual|await|then/i, 90000, 60);
      await speak('What is a JavaScript closure?');
      await waitFor('second spoken question', /closure/i, /scope|lexical|enclosing|outer|variable/i, 90000, 60);
    }
    fixture = new BrowserWindow({ fullscreen: true, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } });
    const code = await fs.readFile(path.resolve('Questions.js'), 'utf8');
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    await fixture.loadURL('data:text/html,' + encodeURIComponent('<title>Questions.js</title><body style="background:#111;color:#eee;font:24px monospace;padding:30px"><h2>Questions.js</h2><pre>' + escaped + '</pre></body>'));
    fixture.show(); fixture.focus(); await delay(750);
    const action = JSON.parse((await control('--trigger-overlay-screen', [String(process.pid)])).stdout);
    assert.equal(action.accessibility, true, 'Screenshot action must be invoked through UI Automation');
    const attachedDeadline = Date.now() + 120000;
    while (Date.now() < attachedDeadline) {
      const state = overlay.getOverlayState();
      if (state.activity === 'error') throw new Error(state.activityDetail);
      if (state.activityDetail?.startsWith('Screenshot sent.')) break;
      await delay(200);
    }
    assert.match(overlay.getOverlayState().activityDetail || '', /^Screenshot sent\./, 'Accessibility must verify screenshot submission before speaking');
    assert.equal((await desktop.getChatGptVoiceStatus()).active, true, 'The same Voice session must remain active');
    assert.ok(fixture.isFocused(), 'Screenshot submission must return focus to the original screen');
    report.stages.push({ label: 'whole-screen screenshot via actual overlay button and typed IPC', passed: true });
    if (attachmentOnly) { report.attachmentVerified = true; report.scope = 'attachment only; spoken flow not verified'; return; }
    await speak('What is the exact output of the code in the attached screenshot?');
    const correct = /\bA\b(?:[\s,`*→>\-]|\b(?:then|and|finally)\b)*\bE\b(?:[\s,`*→>\-]|\b(?:then|and|finally)\b)*\bG\b(?:[\s,`*→>\-]|\b(?:then|and|finally)\b)*\bC\b(?:[\s,`*→>\-]|\b(?:then|and|finally)\b)*\bF\b(?:[\s,`*→>\-]|\b(?:then|and|finally)\b)*\bD\b(?:[\s,`*→>\-]|\b(?:then|and|finally)\b)*(?:then\s+)?\bB\b/;
    await waitFor('spoken screenshot question', /output|screenshot/i, correct);
    await speak('Why does F print before D in that code?');
    await waitFor('spoken follow-up in the same Voice chat', /before|microtask/i, /(?:await|continuation)[\s\S]*(?:queue|microtask)|(?:queue|microtask)[\s\S]*(?:await|continuation)/i, 90000, 60);
    report.passed = true;
  } catch (error) {
    report.error = error?.message || String(error); report.overlay = overlay.getOverlayState();
    console.error(error); process.exitCode = 1;
  } finally {
    clearTimeout(watchdog); mirror.stopVoiceMirror();
    if (startedVoice && helper) await control('--stop-voice').catch(error => { report.cleanupError = String(error); });
    fixture?.destroy(); player?.destroy(); overlay.destroyOverlayWindow();
    await fs.mkdir(path.resolve('data/logs'), { recursive: true });
    await fs.writeFile(path.resolve(attachmentOnly ? 'data/logs/voice-screen-attachment.json' : 'data/logs/voice-screen-followup.json'), JSON.stringify(report, null, 2));
    await fs.rm(data, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    console.log(JSON.stringify(report, null, 2)); app.exit(process.exitCode || 0);
  }
});
