const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { app } = require('electron');
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-scenarios-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = path.join(directory, 'data');
  process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.resolve('knowledge/reference');
  process.env.CODEX_TRANSPORT = 'exec';
  process.env.CODEX_ENABLED = 'true';
  delete process.env.CODEX_MODEL;
  try {
    const promptFile = path.join(directory, 'prompt');
    const argsFile = path.join(directory, 'args');
    const fake = path.join(directory, 'codex.cjs');
    await fs.writeFile(fake, `#!/usr/bin/env node
const fs = require('node:fs'); const args = process.argv.slice(2); let prompt = '';
process.stdin.on('data', chunk => prompt += chunk);
process.stdin.on('end', () => { fs.writeFileSync(${JSON.stringify(promptFile)}, prompt); fs.writeFileSync(${JSON.stringify(argsFile)}, JSON.stringify(args)); fs.writeFileSync(args[args.indexOf('-o')+1], '## Proposed approach\\nI would use bounded batches and verify committed progress.'); });
`, { mode: 0o700 });
    process.env.CODEX_CLI_PATH = fake;
    const { prepareAnswer } = require('../dist/main/services/answerService');
    const { searchNotes } = require('../dist/main/services/knowledgeService');
    const { isScenarioQuestion } = require('../dist/shared/scenarioGuidance');
    const codex = require('../dist/main/services/codexService');
    assert.equal(codex.getCodexModel(), 'gpt-6-luna');
    for (const question of [
      'How would you update one million database records safely?',
      'Suppose a deployment fails. How would you roll back?',
      'Choose async, worker threads or processes for 500 API calls and resizing images.',
      'How do you choose React state management for a dashboard?',
      'Write an AI prompt for a FastAPI Redis rate limiter.',
      'What if a third-party API starts returning 429?',
      'Explain trade-offs when selecting a canary rollout percentage.',
      'Implement and test an array balance point function.',
    ]) {
      assert.equal(isScenarioQuestion(question), true, question);
      const answer = await prepareAnswer(question, await searchNotes(question));
      assert.equal(answer.generationMode, 'codex', 'A keyword reference hit must not bypass scenario synthesis');
      assert.ok(answer.snippets.some(snippet => snippet.fileName === 'personal.md'));
      const prompt = await fs.readFile(promptFile, 'utf8');
      assert.match(prompt, /Scenario-answer guidance/);
      assert.match(prompt, /SharesEye/);
      assert.match(prompt, /Relevant local sources/);
      assert.match(prompt, /rather than implementation code/);
      assert.match(prompt, /Do not import another candidate's persona/);
      const args = JSON.parse(await fs.readFile(argsFile, 'utf8'));
      assert.equal(args[args.indexOf('--model')+1], 'gpt-6-luna');
      assert.ok(args.includes('model_reasoning_effort="low"'));
    }
    assert.equal(isScenarioQuestion('What is React?'), false);
    const personal = require('../dist/main/services/personalContextService');
    for (const question of [
      'What is the recent production issue that you found and how you fixed it?',
      'Tell me about your latest production incident.',
      'Describe a recent outage you resolved at Eli Lilly.',
      'Recent production issue and fix?',
    ]) {
      assert.equal(isScenarioQuestion(question), true, question);
      assert.equal(personal.isPersonalExperienceQuestion(question), true, question);
      assert.equal(personal.needsPersonalSynthesis(question), true, question);
      const answer = await prepareAnswer(question, [{ source: 'reference', fileName: 'foreign.md', score: 10, content: 'I fixed an outage at FOREIGN_EMPLOYER.' }]);
      assert.equal(answer.generationMode, 'codex');
      assert.ok(answer.snippets.some(snippet => snippet.fileName === 'personal.md'));
      const prompt = await fs.readFile(promptFile, 'utf8');
      assert.match(prompt, /anchor the context in Eli Lilly/);
      assert.match(prompt, /Hypothetical practice scenario/);
      assert.match(prompt, /do not fabricate an actual outage/);
      assert.match(prompt, /do not reuse campaign-automation savings/i);
      assert.doesNotMatch(prompt, /FOREIGN_EMPLOYER/);
    }
    await prepareAnswer('What production issue did you fix at GEICO?', []);
    const historical = await fs.readFile(promptFile, 'utf8');
    assert.match(historical, /Respect any explicitly named employer/);
    assert.doesNotMatch(historical, /anchor the context in Eli Lilly/);
    assert.equal(personal.isPersonalExperienceQuestion('How would you handle a production issue?'), false);
    assert.equal((await prepareAnswer('What is React?', await searchNotes('What is React?'))).generationMode, 'reference');
    process.env.CODEX_ENABLED = 'false'; delete process.env.OPENAI_API_KEY;
    const offline = await prepareAnswer('How would you update one million database records safely?', await searchNotes('How would you update one million database records safely?'));
    assert.notEqual(offline.generationMode, 'codex');
    assert.ok(offline.answer);
    assert.doesNotMatch(offline.answer, /Name:|8\+ years|13,000 engineering hours/);
    console.log('PASS: eight scenario families, recent Eli Lilly incident routing, explicit older employer preserved, grounded hypothetical incident instructions, foreign-persona exclusion, source evidence, direct references and offline fallback.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { await fs.rm(directory, { recursive: true, force: true }); app.exit(process.exitCode || 0); }
});
