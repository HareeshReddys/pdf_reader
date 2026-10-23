const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { app } = require('electron');
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-incident-live-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.resolve('knowledge/reference');
  process.env.CODEX_TRANSPORT = 'app-server';
  process.env.CODEX_ENABLED = 'true';
  const codex = require('../dist/main/services/codexService');
  try {
    const question = 'What is the recent production issue that you found and how you fixed it?';
    const { prepareAnswer } = require('../dist/main/services/answerService');
    const { searchNotes } = require('../dist/main/services/knowledgeService');
    const response = await prepareAnswer(question, await searchNotes(question));
    assert.equal(response.generationMode, 'codex');
    assert.match(response.answer, /Eli Lilly/i);
    assert.match(response.answer, /hypothetical practice scenario/i);
    assert.match(response.answer, /I would/i);
    assert.doesNotMatch(response.answer, /(?:at|for) (?:GEICO|Cognizant|Bewino|SharesEye)/i);
    assert.ok(response.snippets.some(source => source.fileName === 'personal.md'));
    const output = path.resolve('data/logs/recent-incident-answer.md');
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, `# Live scenario verification\n\nQuestion: ${question}\n\nSource: personal.md (resume-derived role context).\n\n${response.answer}\n`);
    console.log(response.answer);
    console.log('PASS: real app answer pipeline, recent Eli Lilly context, explicitly hypothetical incident, conditional actions and personal source.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { codex.disposeCodexConnection(); await fs.rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }); app.exit(process.exitCode || 0); }
});
