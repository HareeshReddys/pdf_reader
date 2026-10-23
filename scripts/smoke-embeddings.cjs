const assert = require('node:assert/strict');
const { app } = require('electron');

app.whenReady().then(async () => {
  try {
    const service = require('../dist/main/services/embeddingSearchService.js');

    assert.equal(service.cosineSimilarity([1, 0], [1, 0]), 1);
    assert.equal(service.cosineSimilarity([1, 0], [0, 1]), 0);
    assert.equal(service.cosineSimilarity([], []), -1);

    const ranked = service.rankEmbeddingEntries([
      {
        id: 'lower', fileName: 'one.md', source: 'personal', sourceLabel: 'Personal note',
        content: 'lower', embedding: [0, 1],
      },
      {
        id: 'higher', fileName: 'two.md', source: 'reference', sourceLabel: 'Built-in interview reference',
        content: 'higher', embedding: [1, 0],
      },
    ], [1, 0], 5);
    assert.equal(ranked[0].content, 'higher');
    assert.equal(ranked[0].fileName, 'Reference · two.md');

    delete process.env.OPENAI_API_KEY;
    const fallback = await service.searchNotesSemantically('Explain cherry pick in Git', 5);
    assert.equal(fallback.mode, 'keyword');
    assert.equal(fallback.fallbackReason, 'api-key-missing');
    assert.match(fallback.snippets[0]?.content ?? '', /cherry[ -]pick/i);

    await assert.rejects(
      service.buildEmbeddingIndex(),
      /OPENAI_API_KEY is required/,
    );

    console.log(JSON.stringify({
      result: 'passed',
      topVectorMatch: ranked[0].content,
      fallbackMode: fallback.mode,
      fallbackReason: fallback.fallbackReason,
      fallbackSource: fallback.snippets[0]?.fileName,
    }, null, 2));
    app.quit();
  } catch (error) {
    console.error(error);
    app.exit(1);
  }
});
