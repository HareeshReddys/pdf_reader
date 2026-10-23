const assert = require('node:assert/strict');
const path = require('node:path');
const { app } = require('electron');
require('dotenv').config({ path: path.resolve('.env'), quiet: true });
process.env.INTERVIEW_COPILOT_DATA_DIR = path.resolve('data');
process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.resolve('knowledge/reference');
app.whenReady().then(async () => {
  try {
    const { prepareAnswer } = require('../dist/main/services/answerService');
    const { searchNotes } = require('../dist/main/services/knowledgeService');
    const { disposeCodexConnection } = require('../dist/main/services/codexService');
    const question = 'Describe your last project and explain the end-to-end flow and business impact.';
    const answer = await prepareAnswer(question, await searchNotes(question));
    assert.equal(answer.generationMode, 'codex');
    assert.match(answer.answer, /\bI\s+(?:led|built|developed|worked|owned)/i);
    assert.match(answer.answer, /campaign|SharesEye|AURA|GEICO/i);
    assert.doesNotMatch(answer.answer, /KPMG|Durga Prasad/);
    assert.ok(answer.snippets.some(source => source.source === 'personal'));
    console.log('PASS: live CLI returned a first-person project answer using supplied resume evidence and source attribution.');
    disposeCodexConnection(); app.quit();
  } catch (error) { console.error(error); app.exit(1); }
});
