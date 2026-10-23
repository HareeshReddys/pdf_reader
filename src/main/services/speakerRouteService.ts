import { execFile, spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { app } from 'electron';
import { logDiagnostic } from './diagnosticsService';

const execute = promisify(execFile);
/** B1 endpoints remain installed even when their mixer is closed. Restore the installed mixer. */
export async function ensureSpeakerMixerRunning(): Promise<void> {
  if (process.platform !== 'win32') return;
  const mixer = path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'VB', 'Voicemeeter', 'voicemeeterpro.exe');
  const bridge = path.join(app.getAppPath(), 'data', 'runtime', 'VoiceMeeterBridge.exe');
  try {
    await access(mixer);
    try {
      await execute(bridge, ['get', 'Strip[3].B1'], { windowsHide: true, timeout: 3000 });
      return;
    } catch { /* Installed endpoint can exist while the engine is stopped. */ }
    const child = spawn(mixer, [], { detached: true, windowsHide: true, stdio: 'ignore' });
    child.on('error', () => logDiagnostic('speaker-mixer-start-failed', {}));
    child.unref();
    logDiagnostic('speaker-mixer-start-requested', {});
  } catch { /* Other supported speaker routes do not require Voicemeeter. */ }
}
