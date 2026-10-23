const assert = require('node:assert/strict');
const { app, BrowserWindow } = require('electron');
const { mkdtemp, rm } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await check()) return;
    await delay(100);
  }
  throw new Error('Overlay assistant control did not reach the expected state.');
}
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'overlay-assistant-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  process.env.CODEX_ENABLED = 'false';
  let main, floating;
  const overlay = require('../dist/main/services/overlayService');
  const turns = require('../dist/main/services/assistTurnService');
  try {
    require('../dist/main/services/callAudioService').listCallAudioSources = async () => [{ id: 'windows-loopback', name: 'Synthetic speaker output' }];
    require('../dist/main/ipc').registerIpcHandlers(() => main);
    const options = { show: false, webPreferences: { preload: path.resolve('dist/main/preload.js'), sandbox: true, contextIsolation: true, nodeIntegration: false } };
    main = new BrowserWindow(options);
    await main.loadFile(path.resolve('dist/renderer/index.html'));
    await until(() => main.webContents.executeJavaScript("Boolean(document.querySelector('.audio-panel button'))"));
    // A silent synthetic stream exercises the recorder lifecycle without opening a microphone.
    await until(() => main.webContents.executeJavaScript("document.querySelector('.audio-panel select').value === 'system:windows-loopback'"));
    await main.webContents.executeJavaScript(`window.audioTestContext = new AudioContext(); window.audioTestStarts = 0; window.micRequests = 0; navigator.mediaDevices.getUserMedia = async () => { window.micRequests++; throw new Error('Microphone must never open'); }; navigator.mediaDevices.getDisplayMedia = async () => { window.audioTestStarts++; window.audioTestStream = window.audioTestContext.createMediaStreamDestination().stream; return window.audioTestStream; }; void 0;`);
    floating = new BrowserWindow(options);
    await floating.loadFile(path.resolve('dist/renderer/index.html'), { query: { view: 'overlay' } });
    const run = code => floating.webContents.executeJavaScript(code);
    await until(() => run("Boolean(document.querySelector('[aria-label=\"Start assistant mode\"]'))"));
    await run("document.querySelector('[aria-label=\"Start assistant mode\"]').click()");
    await until(() => run("Boolean(document.querySelector('[aria-label=\"Stop assistant mode\"]:not(:disabled)'))"));
    assert.equal(turns.getAssistTurnState().active, true);
    assert.equal(await main.webContents.executeJavaScript('window.audioTestStarts'), 1);
    assert.equal(await main.webContents.executeJavaScript('window.micRequests'), 0);
    await run("document.querySelector('[aria-label=\"Hold answer\"]').click()");
    await until(() => turns.getAssistTurnState().held);
    assert.equal(overlay.getOverlayState().voiceActive, true, 'Holding an answer must leave audio active');
    await run("document.querySelector('[aria-label=\"Stop assistant mode\"]').click()");
    await until(() => run("Boolean(document.querySelector('[aria-label=\"Start assistant mode\"]:not(:disabled)'))"));
    assert.equal(turns.getAssistTurnState().active, false);
    assert.equal(await main.webContents.executeJavaScript('window.audioTestStream.getTracks().every(track => track.readyState === "ended")'), true);
    // Main-window start must update the same overlay control.
    await main.webContents.executeJavaScript("[...document.querySelectorAll('.audio-panel button')].find(button => button.textContent === 'Start assistant mode').click()");
    await until(() => run("Boolean(document.querySelector('[aria-label=\"Stop assistant mode\"]'))"));
    await run("document.querySelector('[aria-label=\"Stop assistant mode\"]').click()");
    await until(() => !turns.getAssistTurnState().active && !overlay.getOverlayState().voiceActive);
    // Permission failures must leave the control off and expose an error.
    await main.webContents.executeJavaScript("navigator.mediaDevices.getDisplayMedia = async () => { throw new Error('Test output denied'); }; void 0;");
    await run("document.querySelector('[aria-label=\"Start assistant mode\"]').click()");
    await until(() => run("Boolean(document.querySelector('.overlay-error-detail')) && Boolean(document.querySelector('[aria-label=\"Start assistant mode\"]:not(:disabled)'))"));
    assert.equal(turns.getAssistTurnState().active, false);
    assert.equal(await main.webContents.executeJavaScript('window.micRequests'), 0, 'Output failure must never fall back to microphone');
    console.log('PASS: overlay start/stop, actual track release, main-window synchronization, hold keeps audio on, and permission failure.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally {
    turns.configureAssistTurn(false);
    floating?.destroy(); main?.destroy();
    await rm(directory, { recursive: true, force: true });
    app.exit(process.exitCode || 0);
  }
});
