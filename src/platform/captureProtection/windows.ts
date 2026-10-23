import type { BrowserWindow } from 'electron';
import type { CaptureProtectionStatus } from '../../shared/types';
export async function enableWindowsProtection(window: BrowserWindow): Promise<CaptureProtectionStatus> {
  window.setContentProtection(true);
  return { supported: true, active: false, strategy: 'windows-native', reason: 'Native protection requested; full-monitor remote capture has not been verified for this meeting application.' };
}
