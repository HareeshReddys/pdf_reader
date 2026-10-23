const assert = require('node:assert/strict');
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
app.whenReady().then(async () => {
  let capture, player;
  try {
    assert.equal(process.platform, 'win32');
    const { configureWindowsLoopback } = require('../dist/main/services/windowsLoopbackService');
    let handler;
    const frame = {};
    configureWindowsLoopback({ isDestroyed: () => false, webContents: { mainFrame: frame, session: { setDisplayMediaRequestHandler(value) { handler = value; } } } });
    let grant;
    handler({ frame: {}, audioRequested: true }, value => { grant = value; });
    assert.deepEqual(grant, {}, 'Foreign frames must be denied');
    handler({ frame, audioRequested: false }, value => { grant = value; });
    assert.deepEqual(grant, {}, 'Unrelated display-only requests must be denied');
    handler({ frame, audioRequested: true }, value => { grant = value; });
    assert.equal(grant.audio, 'loopback'); assert.equal(grant.video, frame);
    capture = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } });
    configureWindowsLoopback(capture);
    await capture.loadFile(path.join(__dirname, 'fixtures/audio-output.html'));
    const tracks = await capture.webContents.executeJavaScript(`(async () => {
      window.micRequests = 0;
      navigator.mediaDevices.getUserMedia = async () => { window.micRequests++; throw new Error('Microphone forbidden'); };
      window.outputStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      outputStream.getVideoTracks().forEach(track => track.stop());
      window.audioContext = new AudioContext(); await audioContext.resume();
      window.analyser = audioContext.createAnalyser(); analyser.fftSize = 2048;
      audioContext.createMediaStreamSource(outputStream).connect(analyser);
      return { audio: outputStream.getAudioTracks().filter(track => track.readyState === 'live').length, video: outputStream.getVideoTracks().filter(track => track.readyState === 'live').length };
    })()`, true);
    assert.equal(tracks.audio, 1); assert.equal(tracks.video, 0);
    player = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
    await player.loadFile(path.join(__dirname, 'fixtures/audio-output.html'));
    await player.webContents.executeJavaScript(`window.toneContext = new AudioContext(); toneContext.resume(); window.tone = toneContext.createOscillator(); const gain = toneContext.createGain(); gain.gain.value = 0.08; tone.frequency.value = 660; tone.connect(gain); gain.connect(toneContext.destination); tone.start();`, true);
    const level = await capture.webContents.executeJavaScript(`(async () => {
      let peak = 0;
      for (let i = 0; i < 25; i++) { const samples = new Float32Array(analyser.fftSize); analyser.getFloatTimeDomainData(samples); peak = Math.max(peak, Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length)); await new Promise(resolve => setTimeout(resolve, 80)); }
      outputStream.getTracks().forEach(track => track.stop()); await audioContext.close();
      return { peak, micRequests, stopped: outputStream.getTracks().every(track => track.readyState === 'ended') };
    })()`);
    await player.webContents.executeJavaScript('tone.stop(); toneContext.close();');
    assert.ok(level.peak > 0.005, `Speaker tone must reach loopback; measured ${level.peak}`);
    assert.equal(level.micRequests, 0); assert.equal(level.stopped, true);
    console.log('PASS: real Windows output captured a controlled tone; microphone never requested; video stopped immediately; all tracks released.');
    console.log(JSON.stringify(level));
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { player?.destroy(); capture?.destroy(); app.exit(process.exitCode || 0); }
});
