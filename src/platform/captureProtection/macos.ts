import type { BrowserWindow } from 'electron';
import type { CaptureProtectionStatus } from '../../shared/types';
export async function enableMacosProtection(window: BrowserWindow): Promise<CaptureProtectionStatus> {
  window.setContentProtection(true);
  return { supported: true, active: false, strategy: 'macos-native', reason: 'macOS ScreenCaptureKit can include protected windows. Hide both app windows before sharing your entire screen (Command+Option+Z); monitoring continues while hidden.' };
}
