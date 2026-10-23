const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const cases = [
  ['What is CSS Grid? Explain how rows and columns work.', 'grid'],
  ['What is a JavaScript closure? Give a small example.', 'closure'],
  ['How would you investigate a sudden increase in API latency in production?', 'latency']
];
const results = [];
for (const [question, keyword] of cases) {
  const env = {...process.env, COPILOT_BENCH_QUESTION: question, COPILOT_BENCH_KEYWORD: keyword};
  delete env.ELECTRON_RUN_AS_NODE;
  const run = spawnSync(require('electron'), ['scripts/smoke-windows-spoken-question.cjs', '--chatgpt-desktop'], {env, stdio:'inherit'});
  if (run.status !== 0) process.exit(run.status || 1);
  results.push(JSON.parse(fs.readFileSync('data/logs/chatgpt-desktop-e2e.json', 'utf8')));
  fs.writeFileSync('data/logs/chatgpt-speed-benchmark.json', JSON.stringify({verifiedAt:new Date().toISOString(), coldWorkerPerCase:true, results}, null, 2));
}
console.table(results.map(({question, transcriptionMs, submissionMs, desktopFirstTextMs, speechEndToPartialMs})=>({question, transcriptionMs, submissionMs, desktopFirstTextMs, speechEndToPartialMs})));
