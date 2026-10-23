const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { resolveCodexExecutable } = require('../dist/main/services/codexExecutable');

(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'codex discovery '));
  const originalPath = process.env.PATH;
  const originalOverride = process.env.CODEX_CLI_PATH;
  try {
    const name = process.platform === 'win32' ? 'codex.exe' : 'codex';
    const executable = path.join(directory, name);
    await fs.writeFile(executable, 'fixture');
    delete process.env.CODEX_CLI_PATH;
    process.env.PATH = directory;
    assert.equal(await resolveCodexExecutable(), executable, 'Find native executable in a PATH containing spaces');
    process.env.CODEX_CLI_PATH = '  /explicit/codex  ';
    assert.equal(await resolveCodexExecutable(), '/explicit/codex');
    delete process.env.CODEX_CLI_PATH;
    await fs.rm(executable);
    process.env.PATH = '';
    // Test the installed-editor fallback when available, without depending on a developer machine in CI.
    try {
      const fallback = await resolveCodexExecutable();
      assert.ok((await fs.stat(fallback)).isFile());
      assert.equal(path.basename(fallback), name);
    } catch (error) { assert.match(error.message, /Codex CLI was not found/); }
    console.log('PASS: native PATH discovery, spaces, explicit override, and editor fallback.');
  } finally {
    if (originalPath === undefined) delete process.env.PATH; else process.env.PATH = originalPath;
    if (originalOverride === undefined) delete process.env.CODEX_CLI_PATH; else process.env.CODEX_CLI_PATH = originalOverride;
    await fs.rm(directory, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
