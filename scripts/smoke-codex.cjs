const assert = require('node:assert/strict');
const { mkdtemp, writeFile, chmod, rm, readFile } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { app } = require('electron');
app.whenReady().then(async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'copilot-cli-test-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = path.join(directory, 'data');
  try {
    const { searchNotes } = require('../dist/main/services/knowledgeService');
    const { prepareAnswer, decideAnswerRoute } = require('../dist/main/services/answerService');
    const { generateCodexAnswer } = require('../dist/main/services/codexService');
    const { updateOverlaySuggestion, getOverlayState } = require('../dist/main/services/overlayService');
    for (const question of ['What is object relation mapping?', 'How does object relational mapping work?', 'How do we use ORM?', 'How does Prisma work?', 'Tell me about Prisma']) {
      const snippets = await searchNotes(question);
      assert.ok(snippets.length, question);
      const answer = await prepareAnswer(question, snippets);
      assert.equal(answer.generationMode, 'reference');
      assert.match(answer.answer, question.includes('Prisma') ? /^## Prisma; Prisma ORM;/ : /^## ORM;/);
      assert.ok(answer.relatedAnswers?.[0]);
      updateOverlaySuggestion({ ...answer, question, followUpQuestion: '', confidence: 'high' });
      assert.deepEqual(getOverlayState().relatedAnswers, answer.relatedAnswers);
      assert.equal(getOverlayState().answer, answer.answer);
    }
    const code = await prepareAnswer('Explain JavaScript closures and lexical scope', await searchNotes('Explain JavaScript closures and lexical scope'));
    assert.match(code.answer, /function createCounter\(\)/);
    assert.match(code.relatedAnswers[0].content, /Uses Of Closures/);
    const countFile = path.join(directory, 'calls');
    const fake = path.join(directory, 'codex.cjs');
    await writeFile(fake, '#!/usr/bin/env node\nconst fs=require("node:fs");const args=process.argv.slice(2);fs.appendFileSync('+JSON.stringify(countFile)+', "call\\n"); if(!args.includes("--sandbox") || !args.includes("read-only")) process.exit(2);process.stdin.resume();process.stdin.on("end",()=>fs.writeFileSync(args[args.indexOf("-o")+1], "## Generated topic\\n\\n- Explanation.\\n\\n```js\\nconst answer = 42;\\n```"));\n');
    await chmod(fake, 0o700);
    process.env.CODEX_TRANSPORT = 'exec';
    process.env.CODEX_CLI_PATH = fake;
    assert.equal(decideAnswerRoute([]), 'codex');
    const answers = await Promise.all([generateCodexAnswer('unique missing question'), generateCodexAnswer('unique missing question')]);
    assert.equal(answers[0], answers[1]);
    await generateCodexAnswer('unique missing question');
    assert.equal((await readFile(countFile, 'utf8')).trim(), 'call');
    const image = 'data:image/png;base64,iVBORw0KGgo=';
    const vision = await prepareAnswer('coding task', [], image);
    assert.equal(vision.generationMode, 'codex');
    assert.match(vision.answer, /```js/);
    process.env.CODEX_CLI_PATH = '/missing/codex';
    await assert.rejects(generateCodexAnswer('failed launch different question'), /Could not start Codex/);
    console.log('PASS: ORM/Prisma variants, verbatim code, follow-up sections, overlay payload, CLI routing, coalescing/cache, vision routing and launch failure.');
    app.quit();
  } catch (error) { console.error(error); app.exit(1); }
  finally { await rm(directory, { recursive: true, force: true }); }
});
