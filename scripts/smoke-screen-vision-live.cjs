const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { app, BrowserWindow } = require('electron');
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-vision-live-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  process.env.CODEX_ENABLED = 'true';
  process.env.CODEX_TRANSPORT = 'app-server';
  const codex = require('../dist/main/services/codexService');
  let fixture;
  try {
    fixture = new BrowserWindow({ show: false, width: 1100, height: 700, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } });
    await fixture.loadURL('data:text/html,' + encodeURIComponent('<body style="background:white;color:black;font:26px Arial;padding:35px"><h1>Coding question</h1><p>Implement a JavaScript function sumEven(values) that returns the sum of all even integers in an array. Do not mutate the input.</p><p>Example: [1, 2, 4, -2, 5] returns 4. An empty array returns 0.</p><h2>Code editor</h2><pre>// Write your solution here</pre></body>'));
    fixture.show();
    await new Promise(resolve => setTimeout(resolve, 500));
    const { captureAndAnalyzeScreen } = require('../dist/main/services/screenMonitorService');
    const result = await captureAndAnalyzeScreen(fixture.getMediaSourceId());
    const answer = result.suggestions[0]?.answer || '';
    assert.equal(result.suggestions[0]?.generationMode, 'codex');
    assert.match(answer, /sumEven/);
    const code = answer.match(/```(?:javascript|js)?\s*\n([\s\S]*?)```/i)?.[1];
    assert.ok(code, 'Image-only coding task must produce JavaScript code');
    const context = vm.createContext({});
    vm.runInContext(code.replace(/\bexport\s+(?:default\s+)?/g, ''), context, { timeout: 1000 });
    for (const [values, expected] of [[[1, 2, 4, -2, 5], 4], [[], 0], [[-4, -2, 3], -6], [[1, 3, 5], 0]]) {
      context.testInput = values;
      assert.equal(vm.runInContext('sumEven(testInput)', context, { timeout: 1000 }), expected);
    }
    console.log('PASS: real window screenshot -> app analysis -> live Codex image input -> working code verified on four cases.');
    console.log(answer);
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { fixture?.destroy(); codex.disposeCodexConnection(); await fs.rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }); app.exit(process.exitCode || 0); }
});
