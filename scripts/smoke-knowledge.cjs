const { app } = require('electron');

app.whenReady().then(async () => {
  try {
    const { searchNotes } = require('../dist/main/services/knowledgeService.js');
    const { decideAnswerRoute, prepareAnswer } = require('../dist/main/services/answerService.js');
    const snippets = await searchNotes('Explain cherry pick in Git');
    const first = snippets[0];
    if (!first || !/cherry[ -]pick/i.test(first.content)) {
      console.error(snippets.map((snippet) => ({
        fileName: snippet.fileName,
        score: snippet.score,
        preview: snippet.content.slice(0, 160),
      })));
      throw new Error('Cherry-pick reference was not the first search result.');
    }
    const result = await prepareAnswer('Explain cherry pick in Git', snippets);
    const answer = result.answer;
    if (!/applies one specific commit/i.test(answer)) {
      throw new Error('The generated answer did not explain cherry-pick.');
    }
    if (result.generationMode !== 'reference' || answer !== first.content) {
      throw new Error('Reference content was transformed instead of returned verbatim.');
    }

    const closureSnippets = await searchNotes('Explain JavaScript closure and lexical scope');
    const closure = await prepareAnswer('Explain JavaScript closure and lexical scope', closureSnippets);
    const expectedLines = [
      'A closure means an inner function remembers variables from its outer function.',
      'It works even after the outer function has finished running.',
      'We use closures to keep data private and reusable.',
      'Real example: a counter function can remember its own count value.',
      'Closures happen because functions remember their lexical scope.',
      'function createCounter() {',
    ];
    if (closure.generationMode !== 'reference' || expectedLines.some((line) => !closure.answer.includes(line))) {
      throw new Error('The closure answer does not preserve the expected reference section.');
    }

    const sqlSnippets = await searchNotes('Tell me about DDL and DML');
    const sql = await prepareAnswer('Tell me about DDL and DML', sqlSnippets);
    if (
      sql.generationMode !== 'reference'
      || !sql.answer.startsWith('## ')
      || /^# Sql Ddl And Dml Commands/m.test(sql.answer)
      || /^Source:/m.test(sql.answer)
    ) {
      throw new Error('DDL/DML selected page metadata instead of an interview section.');
    }

    const personalCases = [
      ['Tell me about yourself', 'Hi, I’m Ganesh.'],
      ['Tell me about your current project', 'Disease State Education'],
      ['Explain campaign automation', '13,000 engineering hours'],
      ['Tell me about AURA', 'human-in-the-loop'],
      ['Tell me about GEICO', 'third-party insurance providers'],
      ['Tell me about SharesEye', 'Bewino'],
      ['Tell me about your previous experience on share psi, what you did in share psi?', 'Bewino'],
      ['Tell me about your experience with GEICO, what you did and what are your responsibilities, roles and responsibilities in GEICO project?', 'Cognizant'],
      ['What is Ara?', 'Autonomous Unified Reliability Agent'],
      ['Explain your Shares PSI mobile APIs', 'Flutter'],
      ['Tell me about GEICO frontend development', 'form workflows'],
      ['What is your role', 'Technical Delivery Lead'],
      ['What Java version have you used', 'does not specify'],
    ];
    for (const [question, expected] of personalCases) {
      const matches = await searchNotes(question);
      const response = await prepareAnswer(question, matches);
      if (matches[0]?.fileName !== 'Reference · personal.md' || !response.answer.includes(expected) || response.answer !== matches[0].content) {
        throw new Error(`Personal profile retrieval failed for ${question}: ${response.answer.slice(0, 160)}`);
      }
      if (/Durga Prasad|KPMG|K-TRACE|Unisys/.test(response.answer)) throw new Error('Previous profile leaked into the answer.');
    }
    const unsupportedProject = await searchNotes('Explain GEICO Kafka partition architecture');
    if (unsupportedProject.some((match) => match.fileName === 'Reference · personal.md')) {
      throw new Error('An undocumented project implementation was presented as resume experience.');
    }
    const unknownSnippets = await searchNotes('zxqv orbital frobnicator protocol');
    if (unknownSnippets.length !== 0 || decideAnswerRoute(unknownSnippets, true, false) !== 'openai') {
      throw new Error('Unknown topics are not routed exclusively to the API fallback.');
    }
    console.log(JSON.stringify({
      result: 'passed',
      source: first.fileName,
      score: first.score,
      answerPreview: answer.split('\n').slice(0, 3).join(' '),
      closureMode: closure.generationMode,
      sqlHeading: sql.answer.split('\n')[0],
      unknownRouteWithApiKey: decideAnswerRoute(unknownSnippets, true, false),
    }, null, 2));
    app.quit();
  } catch (error) {
    console.error(error);
    app.exit(1);
  }
});
