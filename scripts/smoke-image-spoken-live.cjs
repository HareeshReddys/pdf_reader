// Live observation harness: prepare an image attachment in ChatGPT, dictate
// the question, then submit using the UI. No model response is mocked.
const { app } = require('electron');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'image-spoken-live-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  const overlay = require('../dist/main/services/overlayService');
  const mirror = require('../dist/main/services/voiceMirrorService');
  let report;
  try {
    require('../dist/main/ipc').registerIpcHandlers();
    const window = overlay.createOverlayWindow();
    if (window.webContents.isLoading()) await new Promise(r => window.webContents.once('did-finish-load', r));
    overlay.showOverlay();
    await mirror.startVoiceMirror();
    console.log('READY: observing actual ChatGPT text and overlay for 150 seconds.');
    const started = Date.now();
    const correct = /\bA\b[\s,`*→>\-]*\bE\b[\s,`*→>\-]*\bG\b[\s,`*→>\-]*\bC\b[\s,`*→>\-]*\bF\b[\s,`*→>\-]*\bD\b[\s,`*→>\-]*\bB\b/;
    while (Date.now() - started < 150000) {
      const state = overlay.getOverlayState();
      const answer = state.streamingAnswer || state.answer || '';
      if (correct.test(answer)) {
        const visibleText = await window.webContents.executeJavaScript("document.querySelector('.overlay-content')?.textContent || ''");
        if (correct.test(visibleText)) {
          report = { passed: true, scope: 'image answer displayed in actual overlay', method: 'UI image attachment; native text mirror', speechReceptionVerified: false, fullyAutomatedEndToEndVerified: false, question: state.question, answer, visibleText, testedAt: new Date().toISOString() };
          break;
        }
      }
      await new Promise(r => setTimeout(r, 150));
    }
    if (!report) throw new Error('No verified correct screenshot answer reached the actual overlay within 150 seconds.');
    console.log(JSON.stringify(report, null, 2));
    await new Promise(r => setTimeout(r, 10000));
  } catch (error) {
    report = { passed: false, error: String(error), overlay: overlay.getOverlayState(), testedAt: new Date().toISOString() };
    console.error(JSON.stringify(report));
    process.exitCode = 1;
  } finally {
    await fs.mkdir(path.resolve('data/logs'), { recursive: true });
    await fs.writeFile(path.resolve('data/logs/image-spoken-live.json'), JSON.stringify(report, null, 2));
    mirror.stopVoiceMirror(); overlay.destroyOverlayWindow();
    await fs.rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    app.exit(process.exitCode || 0);
  }
});
