import { askChatGptAboutScreen } from './services/screenChatService';
import { stopRealtimeVoice } from './services/realtimeVoiceService';
import { ensureSpeakerMixerRunning } from './services/speakerRouteService';
import { stopCallAudioCapture } from './services/callAudioService';
import { configureWindowsLoopback } from './services/windowsLoopbackService';
import { isChatGptDesktopEnabled } from './services/chatgptDesktopService';
import { startVoiceMirror } from './services/voiceMirrorService';
import { configureAssistTurn, setAssistAnswerHold, getAssistTurnState, confirmAssistQuestion } from './services/assistTurnService';
import path from 'node:path';
import { enableCaptureProtection } from '../platform/captureProtection';
import { app, BrowserWindow, globalShortcut, shell } from 'electron';
import dotenv from 'dotenv';
import { registerIpcHandlers } from './ipc';
import { createOverlayWindow, destroyOverlayWindow, showOverlay, toggleOverlay, toggleAppVisibility, updateOverlayActivity, updateVoiceActivity } from './services/overlayService';
import { startScreenMonitoring, stopScreenMonitoring } from './services/screenMonitorService';
import { warmCodexConnection, disposeCodexConnection } from './services/codexService';
import { disposeScreenOcrWorker } from './services/screenCaptureService';
import { disposeTranscriptionWorker } from './services/transcriptionService';
import { logDiagnostic } from './services/diagnosticsService';
import { attachWindowRecovery } from './services/windowRecoveryService';
import { APP_DISPLAY_NAME } from '../shared/branding';
import { getOverlayState, setOverlayClickThrough } from './services/overlayService';
import { nextQuestion, previousQuestion } from './services/questionNavigationService';

dotenv.config({ path: path.join(app.getAppPath(), '.env') });
app.once('before-quit', () => stopRealtimeVoice());
// Preserve the existing profile location when changing Electron's display label.
const existingUserDataPath = app.getPath('userData');
app.setName(APP_DISPLAY_NAME);
app.setPath('userData', existingUserDataPath);
const primaryInstance = app.requestSingleInstanceLock();
if (!primaryInstance) app.quit();
let mainWindow: BrowserWindow | undefined;

function revealMainWindow(): void {
  if (!mainWindow || mainWindow.isDestroyed()) { createWindow(); return; }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}
app.on('second-instance', (_event, args) => {
  if (args.includes('--voice-practice') || args.includes('--show-overlay') || args.includes('--overlay-only')) showOverlay();
  else revealMainWindow();
});

function registerShortcut(accelerator: string, action: () => void): void {
  const registered = globalShortcut.register(accelerator, action);
  logDiagnostic(registered ? 'shortcut-registered' : 'shortcut-unavailable', { accelerator });
}

function createWindow(): void {
  const window = new BrowserWindow({
    show: false,
    width: 1440,
    height: 900,
    minWidth: 1040,
    minHeight: 680,
    backgroundColor: '#0b1020',
    title: APP_DISPLAY_NAME,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  });
  mainWindow = window;
  configureWindowsLoopback(window);

  const protectionReady = enableCaptureProtection(window);
  attachWindowRecovery(window, () => {
    stopRealtimeVoice();
    stopCallAudioCapture(); configureAssistTurn(false);
    updateVoiceActivity({ active: false, speaking: false, error: 'Audio panel restarted. Start assistant mode to resume listening.' });
  });
  window.once('ready-to-show', () => {
    void protectionReady.then(() => { if (!window.isDestroyed() && !process.argv.includes('--voice-practice') && !process.argv.includes('--overlay-only')) window.show(); });
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url);
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, url) => {
    const developmentUrl = process.env.VITE_DEV_SERVER_URL;
    const allowedUrl = developmentUrl ?? `file://${path.join(__dirname, '../renderer/index.html')}`;
    if (!url.startsWith(allowedUrl)) event.preventDefault();
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    void window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    void window.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  void ensureSpeakerMixerRunning();
  if (!primaryInstance) return;
  // Keep macOS Dock visibility independent of the visible app windows.
  if (process.platform === 'darwin') app.dock?.hide();
  logDiagnostic('app-start', { electron: process.versions.electron, platform: process.platform });
  const memoryLog = setInterval(() => {
    void process.getProcessMemoryInfo().then(memory => logDiagnostic('main-memory', {
      privateKB: memory.private, heapMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    })).catch(() => undefined);
  }, 60000);
  memoryLog.unref();
  app.once('before-quit', () => clearInterval(memoryLog));
  app.on('child-process-gone', (_event, details) => logDiagnostic('child-exit', { type: details.type, reason: details.reason, exitCode: details.exitCode }));
  process.on('uncaughtExceptionMonitor', error => logDiagnostic('uncaught-exception', { name: error.name }));
  registerIpcHandlers(() => mainWindow);
  if (!isChatGptDesktopEnabled()) void warmCodexConnection().catch(() => undefined); // Retry on demand.
  createWindow();
  createOverlayWindow();
  if (process.argv.includes('--overlay-only')) showOverlay();
  if (process.argv.includes('--voice-practice')) {
    showOverlay();
    void startVoiceMirror().catch(error => updateOverlayActivity('error', error instanceof Error ? error.message : 'Could not start Voice text mirroring.'));
  }
  globalShortcut.register('CommandOrControl+Shift+O', () => toggleOverlay());
  const startMonitoring = () => { void startScreenMonitoring().catch(error => updateOverlayActivity('error', error instanceof Error ? error.message : 'Could not start monitoring.')); };
  registerShortcut('Control+Alt+X', startMonitoring);
  registerShortcut('Control+Alt+C', () => stopScreenMonitoring());
  globalShortcut.register('Control+Alt+Space', () => setAssistAnswerHold(!getAssistTurnState().held));
  globalShortcut.register('Control+Alt+Return', () => confirmAssistQuestion());
  registerShortcut('Control+Alt+Z', () => { void askChatGptAboutScreen(); });
  registerShortcut('Control+Alt+H', () => toggleAppVisibility());
  const navigateQuestion = (action: () => Promise<void>) => {
    void action().catch(error => logDiagnostic('question-navigation-error', { message: error instanceof Error ? error.message : String(error) }));
  };
  registerShortcut('Control+Alt+Right', () => navigateQuestion(nextQuestion));
  registerShortcut('Control+Alt+Left', () => navigateQuestion(previousQuestion));
  registerShortcut('Control+Alt+P', () => setOverlayClickThrough(!getOverlayState().clickThrough));
  // Keep existing Control+Option shortcuts on Mac and add the conventional
  // Command+Option variants; Windows continues to use Control+Alt.
  if (process.platform === 'darwin') {
    for (const [accelerator, action] of [
      ['Command+Alt+X', startMonitoring],
      ['Command+Alt+C', () => stopScreenMonitoring()],
      ['Command+Alt+Z', () => { void askChatGptAboutScreen(); }],
      ['Command+Alt+H', () => toggleAppVisibility()],
      ['Command+Alt+P', () => setOverlayClickThrough(!getOverlayState().clickThrough)],
    ] as const) {
      registerShortcut(accelerator, action);
    }
  }
  app.on('activate', () => {
    revealMainWindow();
  });
});

app.on('before-quit', () => {
  stopCallAudioCapture(); configureAssistTurn(false);
  stopScreenMonitoring();
  disposeTranscriptionWorker();
  disposeCodexConnection();
  globalShortcut.unregisterAll();
  destroyOverlayWindow();
  void disposeScreenOcrWorker();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

