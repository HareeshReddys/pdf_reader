import { spawn } from 'node:child_process';
import { access, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function resolveCodexExecutable(): Promise<string> {
  if (process.env.CODEX_CLI_PATH?.trim()) return process.env.CODEX_CLI_PATH.trim();
  const name = process.platform === 'win32' ? 'codex.exe' : 'codex';
  const candidates = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean)
    .map(directory => path.join(directory.replace(/^"|"$/g, ''), name));
  // Desktop launches may not inherit the editor's PATH.
  const extensions = path.join(os.homedir(), '.vscode', 'extensions');
  try {
    const platform = process.platform === 'win32' ? 'windows' : process.platform;
    const arch = process.arch === 'x64' ? 'x86_64' : process.arch === 'arm64' ? 'aarch64' : process.arch;
    for (const entry of (await readdir(extensions)).filter(value => value.startsWith('openai.chatgpt-')).sort().reverse()) {
      candidates.push(path.join(extensions, entry, 'bin', `${platform}-${arch}`, name));
    }
  } catch { /* No editor installation. */ }
  for (const candidate of candidates) {
    try { await access(candidate); if ((await stat(candidate)).isFile()) return candidate; } catch { /* Try next executable. */ }
  }
  throw new Error('Codex CLI was not found. Install it, run codex login, or set CODEX_CLI_PATH in .env.');
}

/** Execute directly, including JS CLI entry points, without a command shell. */
export function spawnCodex(command: string, args: string[]) {
  const javascript = /\.(?:cjs|mjs|js)$/i.test(command);
  return spawn(javascript ? process.execPath : command, javascript ? [command, ...args] : args, {
    shell: false, windowsHide: true, stdio: 'pipe',
    env: { ...process.env, CODEX_THREAD_ID: undefined, ...(javascript ? { ELECTRON_RUN_AS_NODE: '1' } : {}) },
  });
}
