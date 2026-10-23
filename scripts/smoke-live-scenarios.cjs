const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { app } = require('electron');
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-live-scenarios-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.resolve('knowledge/reference');
  process.env.CODEX_FAST_MODE = 'true';
  const codex = require('../dist/main/services/codexService');
  try {
    const { prepareAnswer } = require('../dist/main/services/answerService');
    const { searchNotes } = require('../dist/main/services/knowledgeService');
    const question = 'How would you safely update one million database records while customers are using the application? Explain crash recovery and how you would select batch size. Use a clearly hypothetical example; do not claim this happened in my projects.';
    const start = Date.now(); let firstText;
    const result = await prepareAnswer(question, await searchNotes(question), undefined, undefined, text => { if (text && !firstText) firstText = Date.now(); });
    assert.equal(result.generationMode, 'codex');
    assert.match(result.answer, /batch|chunk/i);
    assert.match(result.answer, /checkpoint|progress|idempoten/i);
    assert.match(result.answer, /hypothetical|I would|I'd/i);
    assert.doesNotMatch(result.answer, /KPMG|Durga Prasad/);
    assert.ok(result.snippets.some(snippet => snippet.fileName === 'personal.md'));
    console.log(JSON.stringify({ result: 'passed', model: codex.getCodexModel(), requestedMode: 'Fast', reasoning: 'low', firstTextSeconds: firstText ? (firstText-start)/1000 : null, totalSeconds: (Date.now()-start)/1000, words: result.answer.split(/\s+/).length }));
  } catch(error) { console.error(error); process.exitCode = 1; }
  finally { codex.disposeCodexConnection(); await fs.rm(directory,{recursive:true,force:true}); app.exit(process.exitCode || 0); }
});
