import type { BrowserWindow } from 'electron';
import { logDiagnostic } from './diagnosticsService';

export function attachWindowRecovery(window: BrowserWindow, onCrash?: () => void): void {
  let recoveries = 0;
  let lastRecovery = 0;
  window.webContents.on('render-process-gone', (_event, details) => {
    logDiagnostic('renderer-exit', { windowId: window.id, reason: details.reason, exitCode: details.exitCode });
    if (details.reason === 'clean-exit' || window.isDestroyed()) return;
    onCrash?.();
    if (Date.now() - lastRecovery > 60000) recoveries = 0;
    // Recover a failed renderer without creating new windows or showing dialogs.
    // Bound retries so an unrecoverable page cannot spin in a reload loop.
    if (recoveries++ >= 2) return;
    lastRecovery = Date.now();
    const retry = setTimeout(() => {
      if (!window.isDestroyed() && !window.webContents.isDestroyed()) window.webContents.reload();
    }, 1000);
    window.once('closed', () => clearTimeout(retry));
  });
  window.on('unresponsive', () => logDiagnostic('window-unresponsive', { windowId: window.id }));
}
