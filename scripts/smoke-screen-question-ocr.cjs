const assert = require('node:assert/strict');
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
app.whenReady().then(async () => {
  process.env.INTERVIEW_COPILOT_DATA_DIR = path.resolve('data');
  const capture = require('../dist/main/services/screenCaptureService');
  const { extractScreenQuestion, sameScreenQuestion } = require('../dist/shared/screenQuestion');
  let window;
  try {
    window = new BrowserWindow({ show: false, width: 1200, height: 700, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } });
    const html = '<body style="font:28px Arial;background:white;color:black;padding:30px"><h2>Question</h2><p>How would you update one million database records safely?</p><h2>Code editor</h2><pre id="code">const answer = 1;</pre></body>';
    await window.loadURL('data:text/html,' + encodeURIComponent(html));
    const read = async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
      return extractScreenQuestion(await capture.extractScreenText((await window.webContents.capturePage()).toDataURL()));
    };
    const original = await read();
    assert.match(original, /million database records/i);
    await window.webContents.executeJavaScript("document.querySelector('#code').textContent = 'const answer = 1000; // typing a longer solution';");
    assert.equal(sameScreenQuestion(original, await read()), true);
    await window.webContents.executeJavaScript("document.querySelector('p').textContent = 'How would you deploy a service without downtime?';");
    assert.equal(sameScreenQuestion(original, await read()), false);
    console.log('PASS: real local OCR keeps the same question while code changes and recognizes a changed question; no hosted AI requests.');
  } catch(error) { console.error(error); process.exitCode = 1; }
  finally { window?.destroy(); await capture.disposeScreenOcrWorker(); app.exit(process.exitCode || 0); }
});
