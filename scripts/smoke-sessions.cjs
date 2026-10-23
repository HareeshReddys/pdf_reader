const { mkdtemp, readFile, rm } = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { app } = require('electron');

app.whenReady().then(async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'interview-copilot-sessions-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = temporaryDirectory;

  try {
    const {
      deleteSession,
      formatAllSessionsMarkdown,
      formatSessionMarkdown,
      listSessions,
      saveSession,
    } = require('../dist/main/services/sessionService.js');

    const saved = await saveSession({
      question: 'Explain cherry-pick',
      answer: '## Cherry Pick\n\n- Applies one commit.',
      snippets: [{
        fileName: 'Reference · git.md',
        content: '## Cherry Pick\n\n- Applies one commit.',
        score: 20,
        source: 'reference',
        sourceLabel: 'Built-in interview reference',
      }],
      generationMode: 'reference',
    });

    const listed = await listSessions();
    if (listed.length !== 1 || listed[0].id !== saved.id) throw new Error('Saved session was not persisted.');

    const markdown = formatSessionMarkdown(saved);
    if (!markdown.includes('# Explain cherry-pick') || !markdown.includes('## Sources')) {
      throw new Error('Markdown export content is incomplete.');
    }
    const completeExport = formatAllSessionsMarkdown(listed);
    if (!completeExport.includes('Practice History') || !completeExport.includes('# Explain cherry-pick')) {
      throw new Error('Complete history Markdown export is incomplete.');
    }

    const remaining = await deleteSession(saved.id);
    const stored = JSON.parse(await readFile(path.join(temporaryDirectory, 'sessions.json'), 'utf8'));
    if (remaining.length !== 0 || stored.length !== 0) {
      throw new Error('Deleted session remained in persistent history.');
    }

    const concurrent = await Promise.all(Array.from({length: 8}, (_, index) => saveSession({question: 'Concurrent ' + index, answer: 'Answer', snippets: []})));
    const concurrentStored = await listSessions();
    if (concurrentStored.length !== 8 || new Set(concurrentStored.map(item => item.id)).size !== 8) throw new Error('Concurrent writes lost session history.');
    await Promise.all(concurrent.map(item => deleteSession(item.id)));
    if ((await listSessions()).length !== 0) throw new Error('Concurrent deletes lost changes.');
    console.log(JSON.stringify({ result: 'passed', saved: true, markdown: true, exportAll: true, deleted: true }, null, 2));
    await rm(temporaryDirectory, { recursive: true });
    app.quit();
  } catch (error) {
    console.error(error);
    await rm(temporaryDirectory, { recursive: true, force: true });
    app.exit(1);
  }
});
