const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { app } = require('electron');
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'overlay-context-layout-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  const overlay = require('../dist/main/services/overlayService');
  try {
    require('../dist/main/ipc').registerIpcHandlers();
    const window = overlay.createOverlayWindow();
    if (window.webContents.isLoading()) await new Promise(resolve => window.webContents.once('did-finish-load', resolve));
    const run = code => window.webContents.executeJavaScript(code);
    for (let i = 0; i < 100 && !await run("!!document.querySelector('.overlay-context')"); i++) await new Promise(resolve => setTimeout(resolve, 50));
    for (const [width, height] of [[420, 360], [600, 720]]) {
      window.setContentSize(width, height);
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = await run(`(() => {
        const details = document.querySelector('.overlay-context'); details.open = true;
        const panel = document.querySelector('.overlay-context-panel');
        const rect = panel.getBoundingClientRect();
        const field = panel.querySelector('textarea');
        field.scrollIntoView({block: 'center'});
        const fieldRect = field.getBoundingClientRect();
        const save = [...panel.querySelectorAll('button')].find(b => b.textContent === 'Save JD');
        save.scrollIntoView({block: 'center'});
        const saveRect = save.getBoundingClientRect();
        const reachable = document.elementFromPoint(saveRect.x + saveRect.width / 2, saveRect.y + saveRect.height / 2) === save;
        panel.querySelector('[aria-label="Close interview context"]').click();
        return {inside: rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight,
          fieldInside: fieldRect.left >= rect.left && fieldRect.right <= rect.right, reachable, closed: !details.open};
      })()`);
      assert.deepEqual(result, {inside: true, fieldInside: true, reachable: true, closed: true}, `${width}x${height}`);
    }
    overlay.updateOverlaySuggestion({question: 'Opacity check', answer: '```js\nconst value = 1;\n```', snippets: [], generationMode: 'openai', confidence: 'low', followUpQuestion: ''});
    for (const opacity of [0.2, 0.8]) {
      overlay.setOverlayOpacity(opacity);
      await new Promise(resolve => setTimeout(resolve, 100));
      const style = await run("({min: document.querySelector('.overlay-opacity input').min, value: document.querySelector('.overlay-opacity input').value, code: getComputedStyle(document.querySelector('.answer-code')).backgroundColor, panel: getComputedStyle(document.querySelector('.overlay-content')).backgroundColor})");
      assert.equal(style.min, '20');
      assert.equal(Number(style.value), opacity * 100);
      assert.ok(style.panel.endsWith(`, ${opacity})`));
      const alpha = Number(style.code.match(/, ([0-9.]+)\)$/)[1]);
      assert.ok(alpha > 0 && Math.abs(alpha - opacity * 0.12) < 0.005, 'Code tint must fade with the slider: ' + JSON.stringify(style));
    }
    overlay.setRealtimeVoiceActive(true);
    overlay.setOverlayClickThrough(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    await run("document.querySelector('.overlay-context').open = true; document.querySelector('#overlay-job-description').focus()");
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(overlay.getOverlayState().clickThrough, false, 'Context editor must receive clicks');
    assert.equal(await run("[...document.querySelectorAll('.overlay-view, .overlay-view *')].every(e => getComputedStyle(e).webkitAppRegion !== 'drag')"), true, 'Native drag regions must not cover the editor');
    assert.equal(await run("document.activeElement.id"), 'overlay-job-description', 'JD must accept focus during voice');
    await window.webContents.insertText('Senior engineer: TypeScript and accessibility.');
    assert.equal(await run("document.querySelector('#overlay-job-description').value"), 'Senior engineer: TypeScript and accessibility.');
    assert.equal(await run("getComputedStyle(document.querySelector('#overlay-job-description')).userSelect"), 'text');
    await run("[...document.querySelectorAll('.overlay-context-panel button')].find(b => b.textContent === 'Save JD').click()");
    for (let i = 0; i < 100 && await run('window.interviewAPI.getJobDescription()') !== 'Senior engineer: TypeScript and accessibility.'; i++) await new Promise(resolve => setTimeout(resolve, 50));
    assert.equal(await run('window.interviewAPI.getJobDescription()'), 'Senior engineer: TypeScript and accessibility.');
    assert.equal(overlay.getOverlayState().realtimeVoiceActive, true, 'Saving context must not stop voice');
    console.log('PASS: context fits both sizes; JD accepts text and saves during voice without stopping it.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { overlay.destroyOverlayWindow(); await fs.rm(directory, {recursive: true, force: true}); app.exit(process.exitCode || 0); }
});
