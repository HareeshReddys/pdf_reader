import type { BrowserWindow } from 'electron';
import type { CaptureProtectionStatus } from '../../shared/types';
import { enableLinuxProtection } from './linux';
import { enableWindowsProtection } from './windows';
import { enableMacosProtection } from './macos';
export type { CaptureProtectionStatus } from '../../shared/types';
const statuses = new Map<number, CaptureProtectionStatus>();
const unavailable: CaptureProtectionStatus = { supported: false, active: false, strategy: 'unsupported', reason: 'Capture exclusion has not been verified.' };
export function getCaptureProtectionStatus(): CaptureProtectionStatus {
  const values = [...statuses.values()];
  return values.find(value => !value.active) ?? values[0] ?? unavailable;
}
export async function enableCaptureProtection(window: BrowserWindow): Promise<CaptureProtectionStatus> {
  let status: CaptureProtectionStatus;
  try {
    status = process.platform === 'linux' ? await enableLinuxProtection(window)
      : process.platform === 'win32' ? await enableWindowsProtection(window)
      : process.platform === 'darwin' ? await enableMacosProtection(window) : unavailable;
  } catch { status = { ...unavailable, reason: 'Capture-protection capability detection failed; protection is inactive.' }; }
  if (!window.isDestroyed()) {
    statuses.set(window.id, status);
    window.once('closed', () => statuses.delete(window.id));
  }
  return status;
}
