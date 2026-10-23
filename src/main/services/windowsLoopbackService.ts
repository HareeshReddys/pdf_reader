import type { BrowserWindow } from 'electron';

/** Output-only Windows loopback. Grants are restricted to this app's main frame. */
export function configureWindowsLoopback(window: BrowserWindow): void {
  if (process.platform !== 'win32') return;
  window.webContents.session.setDisplayMediaRequestHandler((request, callback) => {
    if (window.isDestroyed() || !request.audioRequested || !request.frame
        || request.frame !== window.webContents.mainFrame) {
      callback({}); return;
    }
    // getDisplayMedia requires video. Self-capture avoids acquiring another
    // application's screen; the renderer immediately stops that video track.
    callback({ video: request.frame, audio: 'loopback' });
  });
}
