const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { app, BrowserWindow, dialog } = require('electron');

// Exercise the production renderer, sandboxed preload, IPC and local services.
// Only native file dialogs are replaced with deterministic fixture selections.
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-core-e2e-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = path.join(directory, 'data');
  process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.join(directory, 'reference');
  process.env.CODEX_ENABLED = 'false';
  delete process.env.OPENAI_API_KEY;
  let window;
  const errors = [];
  const passed = [];
  const originalOpen = dialog.showOpenDialog;
  const originalSave = dialog.showSaveDialog;
  const watchdog = setTimeout(() => { console.error('Core E2E exceeded 90 seconds'); app.exit(1); }, 90000);
  try {
    await fs.mkdir(process.env.INTERVIEW_COPILOT_REFERENCE_DIR);
    const markdown = path.join(directory, 'quasar.md');
    const text = path.join(directory, 'heliotrope.txt');
    const invalid = path.join(directory, 'unsupported.csv');
    await fs.writeFile(markdown, '## Quasar cache\n\nQuasar cache uses amber tokens to expire stale entries.');
    await fs.writeFile(text, 'Heliotrope queues retry failed tasks with a bounded delay.');
    await fs.writeFile(invalid, 'unsupported');
    let selection = { canceled: false, filePaths: [markdown, text, invalid] };
    const exported = path.join(directory, 'export.md');
    dialog.showOpenDialog = async () => selection;
    dialog.showSaveDialog = async () => ({ canceled: false, filePath: exported });
    require('../dist/main/ipc').registerIpcHandlers();
    window = new BrowserWindow({ show: false, webPreferences: {
      preload: path.resolve('dist/main/preload.js'), sandbox: true,
      contextIsolation: true, nodeIntegration: false,
    } });
    window.webContents.on('console-message', details => {
      if (details.level === 'error') errors.push(details.message);
    });
    const run = code => window.webContents.executeJavaScript(code);
    const until = async (code, label) => {
      for (let attempt = 0; attempt < 150; attempt++) {
        if (await run(code)) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error(`Timed out: ${label}`);
    };
    const setQuestion = value => run(`(() => {
      const field = document.querySelector('#interview-question');
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(field, ${JSON.stringify(value)});
      field.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    const submit = () => run("document.querySelector('.question-card button[type=submit]').click()");
    await window.loadFile(path.resolve('dist/renderer/index.html'));
    await until("document.querySelector('.history-list')?.getAttribute('aria-busy') === 'false'", 'startup');
    assert.equal(await run("typeof require"), 'undefined');
    assert.equal(await run("Boolean(document.querySelector('.notes-panel') && document.querySelector('.question-card') && document.querySelector('.history-panel'))"), true);
    await submit();
    await until("document.querySelector('#question-error')?.textContent.includes('Enter a question')", 'empty question validation');
    passed.push('startup, sandbox and empty question validation');

    await run("document.querySelector('.upload-zone').click()");
    await until("document.querySelectorAll('.note-row').length === 2", 'TXT and Markdown import');
    assert.match(await run("document.querySelector('.notes-panel [role=alert]').textContent"), /Import .txt, .md, .docx or .pdf/);
    selection = { canceled: true, filePaths: [] };
    await run("document.querySelector('.upload-zone').click()");
    await until("document.querySelector('.upload-zone strong').textContent === 'Add notes'", 'canceled import');
    assert.equal((await run('window.interviewAPI.listNotes()')).length, 2);
    passed.push('TXT/Markdown import, unsupported file rejection and cancellation');

    await setQuestion('Explain Quasar cache');
    await submit();
    await until("document.querySelector('.answer-body')?.textContent.includes('amber tokens') && document.querySelectorAll('.history-item').length === 1", 'grounded answer');
    assert.match(await run("document.querySelector('.sources-section').textContent"), /quasar.md/);
    const saved = (await run('window.interviewAPI.getHistory()'))[0];
    assert.equal(saved.generationMode, 'source');
    assert.equal(saved.snippets[0].fileName, 'quasar.md');
    await run("document.querySelector('.history-actions button').click()");
    await until("Boolean(document.querySelector('.history-action-message.success-message'))", 'export');
    assert.match(await fs.readFile(exported, 'utf8'), /amber tokens/);
    assert.match(await fs.readFile(exported, 'utf8'), /quasar.md/);
    passed.push('question submission, sourced answer, automatic history and Markdown export');

    window.webContents.reload();
    await until("document.querySelectorAll('.history-item').length === 1 && document.querySelectorAll('.note-row').length === 2", 'reload persistence');
    await run("document.querySelector('.history-item').click()");
    await until("document.querySelector('.answer-body')?.textContent.includes('amber tokens')", 'history restoration');
    await run("window.confirm = () => true; document.querySelector('.history-actions .danger-action').click()");
    await until("document.querySelectorAll('.history-item').length === 0", 'history deletion');
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(directory, 'data', 'sessions.json'), 'utf8')), []);
    passed.push('reload persistence, history restoration and persistent deletion');

    await setQuestion('zxqv orbital frobnicator protocol');
    await submit();
    await until("document.querySelector('.grounded-badge')?.textContent.includes('No matching source')", 'unmatched question');
    assert.match(await run("document.querySelector('.answer-body').textContent"), /could not find relevant context/i);
    assert.equal((await run('window.interviewAPI.getHistory()'))[0].snippets.length, 0);
    await assert.rejects(run("window.interviewAPI.askQuestion({question: 42})"));
    passed.push('unmatched material disclosure and invalid IPC input rejection');
    // The intentional invalid IPC call logs an Electron error in the main process.
    assert.deepEqual(errors, [], 'Unexpected renderer errors');
    console.log(JSON.stringify({ result: 'passed', checks: passed }, null, 2));
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    clearTimeout(watchdog);
    dialog.showOpenDialog = originalOpen;
    dialog.showSaveDialog = originalSave;
    window?.destroy();
    await fs.rm(directory, { recursive: true, force: true });
    app.exit(process.exitCode || 0);
  }
});
