const assert = require('node:assert/strict');
const { app, BrowserWindow } = require('electron');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-jd-ui-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  let window;
  try {
    require('../dist/main/ipc').registerIpcHandlers();
    window = new BrowserWindow({ show: false, webPreferences: { preload: path.resolve('dist/main/preload.js'), sandbox: true, contextIsolation: true, nodeIntegration: false } });
    await window.loadFile(path.resolve('dist/renderer/index.html'));
    const run = code => window.webContents.executeJavaScript(code);
    const until = async code => { for (let i = 0; i < 100; i++) { if (await run(code)) return; await delay(100); } throw new Error('JD UI timed out'); };
    await until("Boolean(document.querySelector('#job-description') && !document.querySelector('#job-description').disabled)");
    assert.equal(await run('document.title'), 'Adobe Acrobat Reader');
    assert.equal(await run("document.querySelector('.brand h1').textContent"), 'Adobe Acrobat Reader');
    assert.equal(await run("document.querySelector('.job-description-panel').nextElementSibling.classList.contains('audio-panel')"), true);
    await run(`(() => { document.querySelector('.job-description-panel details').open = true; const field = document.querySelector('#job-description'); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(field, 'Senior engineer: TypeScript and accessibility.'); field.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await until("!document.querySelector('.job-description-actions button').disabled");
    await run("document.querySelector('.job-description-actions button').click()");
    await until("document.querySelector('.job-description-panel summary').textContent.includes('Role context active')");
    assert.equal(await run('window.interviewAPI.getJobDescription()'), 'Senior engineer: TypeScript and accessibility.');
    await window.webContents.reload();
    await until("document.querySelector('#job-description')?.value === 'Senior engineer: TypeScript and accessibility.'");
    await run("document.querySelectorAll('.job-description-actions button')[1].click()");
    await until("document.querySelector('.job-description-panel summary').textContent.includes('Optional') && !document.querySelector('#job-description').disabled");
    assert.equal(await run('window.interviewAPI.getJobDescription()'), '');
    await assert.rejects(run("window.interviewAPI.saveJobDescription(42)"));
    console.log('PASS: sandboxed JD IPC, optional input before assistant controls, save, reload persistence, clear and invalid input rejection.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { window?.destroy(); await fs.rm(directory, { recursive: true, force: true }); app.exit(process.exitCode || 0); }
});
