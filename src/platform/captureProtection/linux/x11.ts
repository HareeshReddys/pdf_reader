import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { BrowserWindow } from 'electron';
const exec = promisify(execFile);
export async function identifyX11Window(window: BrowserWindow): Promise<string | undefined> {
  if (!process.env.DISPLAY) return undefined;
  const handle = window.getNativeWindowHandle();
  if (handle.length < 4) return undefined;
  const xid = '0x' + handle.readUInt32LE(0).toString(16);
  try {
    const { stdout } = await exec('xprop', ['-id', xid, '_NET_WM_PID'], { timeout: 3000 });
    return Number(stdout.match(/=\s*(\d+)/)?.[1]) === process.pid ? xid : undefined;
  } catch { return undefined; }
}
