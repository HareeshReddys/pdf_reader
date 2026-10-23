// Explicit live test: primary screen -> PNG attachment -> ChatGPT -> real overlay.
const { app } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
require('dotenv').config({ path: path.resolve('.env') });
app.whenReady().then(async () => {
  const overlay = require('../dist/main/services/overlayService');
  let report;
  try {
    require('../dist/main/ipc').registerIpcHandlers(() => undefined);
    overlay.createOverlayWindow();
    overlay.showOverlay();
    console.log('READY: displaying Questions.js before capture in eight seconds.');
    await new Promise(resolve => setTimeout(resolve, 8000));
    await require('../dist/main/services/screenChatService').askChatGptAboutScreen();
    const state = overlay.getOverlayState();
    if (state.activity === 'error') throw new Error(state.activityDetail);
    const answer = state.answer;
    // Match the explicit output, permitting Markdown and separators between letters.
    const correct = /\bA\b[\s,`*→\->]*\bE\b[\s,`*→\->]*\bG\b[\s,`*→\->]*\bC\b[\s,`*→\->]*\bF\b[\s,`*→\->]*\bD\b[\s,`*→\->]*\bB\b/.test(answer);
    report = { passed: correct, expected: ['A','E','G','C','F','D','B'], answer, overlayVisible: state.visible, testedAt: new Date().toISOString() };
    console.log(JSON.stringify(report, null, 2));
    if (!correct) process.exitCode = 1;
  } catch (error) {
    report = { passed: false, error: error.message, testedAt: new Date().toISOString() };
    console.error(JSON.stringify(report)); process.exitCode = 1;
  } finally {
    await fs.mkdir(path.resolve('data/logs'), { recursive: true });
    await fs.writeFile(path.resolve('data/logs/screen-chat-live.json'), JSON.stringify(report, null, 2));
    // Leave the result visible briefly, then release the test app.
    await new Promise(resolve => setTimeout(resolve, 5000));
    app.exit(process.exitCode || 0);
  }
});
