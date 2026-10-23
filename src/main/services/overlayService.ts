import path from 'node:path';
import { enableCaptureProtection } from '../../platform/captureProtection';
import { BrowserWindow, screen } from 'electron';
import type { AssistTurnState, ContextAnswer, OverlayState, OverlayActivity, VoiceActivity, ScreenMonitorState } from '../../shared/types';
import { IPC_CHANNELS } from '../../shared/channels';
import { attachWindowRecovery } from './windowRecoveryService';
import { APP_DISPLAY_NAME } from '../../shared/branding';

let overlayWindow: BrowserWindow | null = null;
let pointerInteractive = false;
let state: OverlayState = {
  visible: false,
  answer: '',
  generationMode: 'local',
  activity: 'idle',
  panelOpacity: 0.91,
};

function publish(): void {
  for (const window of BrowserWindow.getAllWindows()) {
    try {
      if (!window.webContents.isDestroyed()) window.webContents.send(IPC_CHANNELS.overlayUpdated, state);
    } catch { /* A reloading renderer fetches the current state on mount. */ }
  }
}

export function updateOverlayAssistTurn(assistTurn: AssistTurnState): void {
  state = { ...state, assistTurn: { ...assistTurn }, ...(assistTurn.held && state.answerQuestion && !state.realtimeVoiceActive ? { question: state.answerQuestion } : {}) }; publish();
}
export function getOverlayState(): OverlayState {
  return { ...state };
}
export function isOverlayRenderer(id: number): boolean { return Boolean(overlayWindow && !overlayWindow.isDestroyed() && overlayWindow.webContents.id === id); }
export function setRealtimeVoiceActive(active: boolean): void { state = { ...state, realtimeVoiceActive: active }; publish(); }
export function markPendingVoiceAnswer(pending: boolean): void { state = { ...state, pendingVoiceAnswer: pending }; publish(); }
export function resetVoiceReading(): void { state = { ...state, previousVoiceAnswers: [], pendingVoiceAnswer: false }; publish(); }
export function rememberVoiceAnswer(): void {
  if (!state.answer || !state.answerQuestion) return;
  state = { ...state, previousVoiceAnswers: [{ question: state.answerQuestion, answer: state.answer }, ...(state.previousVoiceAnswers ?? []).filter(item => item.question !== state.answerQuestion || item.answer !== state.answer)].slice(0, 3) };
}
export function setRealtimeVoiceNotice(notice: string): void { state = { ...state, realtimeVoiceNotice: notice }; publish(); }

export function setVoiceMirrorActive(active: boolean): void {
  state = { ...state, voiceMirrorActive: active }; publish();
}

let workVersion = 0;
export function beginOverlayWork(question: string, activity: OverlayActivity = 'searching'): number {
  const version = ++workVersion;
  state = { ...state, question, activity, streamingAnswer: undefined, activityDetail: undefined };
  publish();
  return version;
}
export function updateOverlayActivity(activity: OverlayActivity, detail?: string, version?: number): void {
  if (version !== undefined && version !== workVersion) return;
  if (version === undefined && ['listening', 'ready', 'transcribing'].includes(activity) && ['searching', 'codex', 'chatgpt', 'screen'].includes(state.activity ?? '')) return;
  state = { ...state, activity, activityDetail: detail, ...(activity === 'error' ? { streamingAnswer: undefined } : {}) };
  publish();
}
export function updateOverlayPartial(text: string, version: number): void {
  if (version !== workVersion) return;
  state = { ...state, streamingAnswer: text };
  publish();
}
export function cancelOverlayWork(): void {
  ++workVersion;
  state = { ...state, activity: state.voiceActive ? 'listening' : state.answer ? 'ready' : 'idle', activityDetail: undefined, streamingAnswer: undefined };
  publish();
}
export function updateVoiceActivity(voice: VoiceActivity): void {
  const busy = ['transcribing', 'searching', 'codex', 'chatgpt', 'screen'].includes(state.activity ?? 'idle');
  state = { ...state, voiceActive: voice.active, speaking: voice.speaking };
  if (voice.error && !busy) { state.activity = 'error'; state.activityDetail = voice.error; }
  else if (!busy && state.activity !== 'error') {
    state.activity = voice.active ? voice.speaking ? 'hearing' : 'listening' : state.answer ? 'ready' : 'idle';
  }
  publish();
}
export function updateOverlayMonitor(monitor: ScreenMonitorState): void {
  state = { ...state, monitor };
  publish();
}
export function setOverlayOpacity(opacity: number): OverlayState {
  if (!Number.isFinite(opacity)) throw new Error('Choose a valid transparency.');
  state = { ...state, panelOpacity: Math.max(0.20, Math.min(0.95, opacity)) };
  publish();
  return getOverlayState();
}
export function setOverlayClickThrough(enabled: boolean): OverlayState {
  overlayWindow?.setIgnoreMouseEvents(enabled && !pointerInteractive, { forward: true });
  state = { ...state, clickThrough: enabled }; publish();
  return getOverlayState();
}
export function setOverlayPointerInteractive(interactive: boolean, senderId: number): void {
  if (!overlayWindow || overlayWindow.isDestroyed() || overlayWindow.webContents.id !== senderId) return;
  pointerInteractive = interactive;
  overlayWindow.setIgnoreMouseEvents(Boolean(state.clickThrough) && !interactive, { forward: true });
}
export function isAnswerWorkPending(): boolean {
  return ['transcribing', 'searching', 'codex', 'chatgpt', 'screen'].includes(state.activity ?? 'idle');
}
export function updateOverlaySuggestion(answer: ContextAnswer, version?: number): void {
  if (version !== undefined && version !== workVersion) return;
  if (version === undefined) ++workVersion;
  state = {
    ...state,
    answer: answer.answer,
    streamingAnswer: undefined,
    question: answer.question,
    answerQuestion: answer.question,
    activity: state.voiceActive ? 'listening' : 'ready',
    activityDetail: undefined,
    relatedAnswers: answer.relatedAnswers,
    generationMode: answer.generationMode,
  };
  publish();
}

export function createOverlayWindow(): BrowserWindow {
  if (overlayWindow && !overlayWindow.isDestroyed()) return overlayWindow;
  overlayWindow = new BrowserWindow({
    width: 600,
    height: 720,
    minWidth: 420,
    minHeight: 360,
    resizable: false,
    // Show without activation, but allow deliberate clicks and keyboard controls.
    focusable: true,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    transparent: true,
    hasShadow: false,
    title: APP_DISPLAY_NAME,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  });
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  attachWindowRecovery(overlayWindow);
  if (process.platform === 'darwin') {
    overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    overlayWindow.setFullScreenable(false);
  }
  const target = overlayWindow;
  target.setIgnoreMouseEvents(Boolean(state.clickThrough), { forward: true });
  void enableCaptureProtection(target).then(captureProtection => {
    if (!target.isDestroyed()) { state = { ...state, captureProtection }; publish(); }
  });
  overlayWindow.on('close', (event) => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      event.preventDefault();
      overlayWindow.hide();
      state = { ...state, visible: false };
      publish();
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    void overlayWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}?view=overlay`);
  } else {
    void overlayWindow.loadFile(path.join(__dirname, '../../renderer/index.html'), { query: { view: 'overlay' } });
  }
  return overlayWindow;
}

export function showOverlay(): OverlayState {
  const window = createOverlayWindow();
  const area = screen.getPrimaryDisplay().workArea;
  const current = window.getBounds();
  const width = Math.min(current.width, area.width);
  const height = Math.min(current.height, area.height);
  window.setBounds({ x: area.x + Math.max(0, area.width - width - 24), y: area.y + Math.min(24, Math.max(0, area.height - height)), width, height });
  if (window.isMinimized()) window.restore();
  window.setAlwaysOnTop(true, 'screen-saver');
  window.showInactive();
  state = { ...state, visible: true };
  publish();
  return getOverlayState();
}

export function resizeOverlay(width: number, height: number, senderId: number): void {
  if (!Number.isFinite(width) || !Number.isFinite(height)) throw new Error('Invalid overlay dimensions.');
  if (!overlayWindow || overlayWindow.isDestroyed() || overlayWindow.webContents.id !== senderId) throw new Error('Only the overlay can resize itself.');
  const bounds = overlayWindow.getBounds();
  const area = screen.getDisplayMatching(bounds).workArea;
  const nextWidth = Math.min(Math.max(420, Math.round(width)), area.width);
  const nextHeight = Math.min(Math.max(360, Math.round(height)), area.height);
  overlayWindow.setBounds({ width: nextWidth, height: nextHeight,
    x: Math.max(area.x, Math.min(bounds.x, area.x + area.width - nextWidth)),
    y: Math.max(area.y, Math.min(bounds.y, area.y + area.height - nextHeight)) });
}

export function toggleOverlay(): OverlayState {
  const window = createOverlayWindow();
  if (window.isVisible()) {
    window.hide();
    state = { ...state, visible: false };
  } else {
    return showOverlay();
  }
  publish();
  return getOverlayState();
}

export function destroyOverlayWindow(): void {
  if (!overlayWindow || overlayWindow.isDestroyed()) return;
  overlayWindow.removeAllListeners('close');
  overlayWindow.destroy();
  overlayWindow = null;
}

let hiddenWindows: number[] = [];
export function toggleAppVisibility(): boolean {
  if (hiddenWindows.length) {
    for (const id of hiddenWindows) BrowserWindow.fromId(id)?.showInactive();
    hiddenWindows = [];
    state = { ...state, visible: Boolean(overlayWindow?.isVisible()) };
    publish();
    return true;
  }
  hiddenWindows = BrowserWindow.getAllWindows().filter((window) => window.isVisible()).map((window) => window.id);
  for (const id of hiddenWindows) BrowserWindow.fromId(id)?.hide();
  state = { ...state, visible: false };
  publish();
  return false;
}
