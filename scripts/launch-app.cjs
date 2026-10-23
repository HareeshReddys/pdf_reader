const { spawn } = require('node:child_process');
const { openSync, closeSync, mkdirSync } = require('node:fs');
const path = require('node:path');

const directory = path.resolve(__dirname, '..');
const executable = path.join(directory, 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron');
const logs = path.join(directory, 'data/logs');
mkdirSync(logs, { recursive: true });
const output = openSync(path.join(logs, 'launcher.log'), 'a', 0o600);
const environment = { ...process.env };
delete environment.ELECTRON_RUN_AS_NODE;
delete environment.VITE_DEV_SERVER_URL;
delete environment.CODEX_THREAD_ID;
const child = spawn(executable, [directory], {
  cwd: directory, env: environment, detached: true, stdio: ['ignore', output, output],
});
child.once('error', error => { console.error(`Could not launch the application: ${error.message}`); process.exitCode = 1; });
child.once('spawn', () => {
  child.unref();
  console.log('Application opened. You can close this Terminal window and VS Code.');
});
closeSync(output);
