import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);
async function probe(command: string, args: string[]): Promise<string> {
  try { return (await exec(command, args, { timeout: 3000, maxBuffer: 64000 })).stdout.trim(); } catch { return ''; }
}
export type CaptureCapabilities = {
  platform: string; desktop: string; session: string; pipewire: boolean; portal: boolean;
  portalBackends: string[]; sourceTypes: { monitor: boolean; window: boolean; virtual: boolean };
  nativeWindowExclusion: boolean;
};
export async function detectCaptureCapabilities(): Promise<CaptureCapabilities> {
  const [pipewire, portalTypes, backends] = await Promise.all([
    probe('pgrep', ['-x', 'pipewire']),
    probe('gdbus', ['call', '--session', '--dest', 'org.freedesktop.portal.Desktop', '--object-path', '/org/freedesktop/portal/desktop', '--method', 'org.freedesktop.DBus.Properties.Get', 'org.freedesktop.portal.ScreenCast', 'AvailableSourceTypes']),
    probe('busctl', ['--user', '--no-pager', 'list']),
  ]);
  const match = portalTypes.match(/uint32\s+(\d+)/);
  const types = match ? Number(match[1]) : 0;
  return {
    platform: process.platform, desktop: process.env.XDG_CURRENT_DESKTOP ?? 'unknown',
    session: process.env.XDG_SESSION_TYPE ?? 'unknown', pipewire: Boolean(pipewire), portal: Boolean(match),
    portalBackends: backends.split('\n').filter(line => /org\.freedesktop\.impl\.portal\.desktop\./.test(line) && !/activatable/.test(line)).map(line => line.split(/\s+/)[0]),
    sourceTypes: { monitor: Boolean(types & 1), window: Boolean(types & 2), virtual: Boolean(types & 4) },
    nativeWindowExclusion: false,
  };
}
