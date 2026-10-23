import { contextBridge, ipcRenderer } from 'electron';
import type { AssistTurnUpdate, AudioRecordingPayload as CallChunk, AnswerRequest, AssistSessionPayload, AudioRecordingPayload, InterviewApi, OverlayState, ScreenMonitorState, ScreenOcrResult, VoiceActivity, SessionItem, SessionExportFormat } from '../shared/types';

// Keep the preload self-contained so it can run in Electron's sandbox. Only these
// narrow, serializable operations are exposed to the renderer.
const IPC_CHANNELS = {
  getRealtimeContextSummary: 'realtime:context-summary',
  reportRealtimeVoiceNotice: 'realtime:notice',
  realtimeVoiceAction: 'realtime:action',
  requestRealtimeVoiceAction: 'realtime:action-request',
  connectRealtimeVoice: 'realtime:connect',
  prepareRealtimeRenewal: 'realtime:renew-prepare',
  commitRealtimeRenewal: 'realtime:renew-commit',
  cancelRealtimeRenewal: 'realtime:renew-cancel',
  stopRealtimeVoice: 'realtime:stop',
  publishRealtimeVoice: 'realtime:publish',
  captureRealtimeImage: 'realtime:capture-image',
  setVoiceMirror: 'voice:mirror-set',
  listCallAudioSources: 'audio:call-sources',
  startCallAudioCapture: 'audio:call-start',
  stopCallAudioCapture: 'audio:call-stop',
  callAudioChunk: 'audio:call-chunk',
  callAudioError: 'audio:call-error',
  getAssistTurnState: 'assist:state',
  configureAssistTurn: 'assist:configure',
  setAssistantMode: 'assist:mode-set',
  assistantModeRequested: 'assist:mode-requested',
  assistantModeResult: 'assist:mode-result',
  setAssistAnswerHold: 'assist:hold',
  nextQuestion: 'assist:next-question',
  previousQuestion: 'assist:previous-question',
  questionNavigated: 'sessions:navigated',
  confirmAssistQuestion: 'assist:confirm',
  dismissAssistQuestion: 'assist:dismiss',
  assistTurnUpdated: 'assist:updated',
  listNotes: 'notes:list',
  getJobDescription: 'job-description:get',
  saveJobDescription: 'job-description:save',
  uploadNotes: 'notes:upload',
  searchNotes: 'notes:search',
  askQuestion: 'answers:ask',
  getHistory: 'sessions:list',
  deleteSession: 'sessions:delete',
  exportSession: 'sessions:export',
  exportAllSessions: 'sessions:export-all',
  exportSessions: 'sessions:export-many',
  reviewSession: 'sessions:review',
  getRuntimeStatus: 'runtime:status',
  transcribeAudio: 'audio:transcribe',
  saveAssistSession: 'audio:save-assist-session',
  getOverlayState: 'overlay:state',
  toggleOverlay: 'overlay:toggle',
  setOverlayClickThrough: 'overlay:click-through',
  setOverlayPointerInteractive: 'overlay:pointer-interactive',
  overlayUpdated: 'overlay:updated',
  setOverlayOpacity: 'overlay:opacity',
  resizeOverlay: 'overlay:resize',
  reportVoiceActivity: 'overlay:voice-activity',
  toggleAppVisibility: 'app:toggle-visibility',
  askScreenQuestion: 'screen:ask-chatgpt',
  getScreenMonitorState: 'screen:monitor-state',
  selectScreenMonitorSource: 'screen:monitor-source',
  startScreenMonitoring: 'screen:monitor-start',
  stopScreenMonitoring: 'screen:monitor-stop',
  screenMonitorUpdated: 'screen:monitor-updated',
  screenAnalysis: 'screen:analysis',
  listScreenCaptureSources: 'screen:list-sources',
  captureScreenAndExtractText: 'screen:capture-ocr',
  getEmbeddingIndexStatus: 'search:index-status',
  buildEmbeddingIndex: 'search:index-build',
  clearEmbeddingIndex: 'search:index-clear',
} as const;

const interviewAPI: InterviewApi = {
  getRealtimeContextSummary: () => ipcRenderer.invoke(IPC_CHANNELS.getRealtimeContextSummary),
  reportRealtimeVoiceNotice: (id, notice) => ipcRenderer.invoke(IPC_CHANNELS.reportRealtimeVoiceNotice, id, notice),
  requestRealtimeVoiceAction: action => ipcRenderer.invoke(IPC_CHANNELS.requestRealtimeVoiceAction, action),
  onRealtimeVoiceAction: callback => { const listener = (_event: Electron.IpcRendererEvent, action: 'start' | 'stop' | 'screenshot') => callback(action); ipcRenderer.on(IPC_CHANNELS.realtimeVoiceAction, listener); return () => ipcRenderer.removeListener(IPC_CHANNELS.realtimeVoiceAction, listener); },
  connectRealtimeVoice: sdp => ipcRenderer.invoke(IPC_CHANNELS.connectRealtimeVoice, sdp),
  prepareRealtimeRenewal: (id, sdp) => ipcRenderer.invoke(IPC_CHANNELS.prepareRealtimeRenewal, id, sdp),
  commitRealtimeRenewal: (id, token) => ipcRenderer.invoke(IPC_CHANNELS.commitRealtimeRenewal, id, token),
  cancelRealtimeRenewal: id => ipcRenderer.invoke(IPC_CHANNELS.cancelRealtimeRenewal, id),
  stopRealtimeVoice: () => ipcRenderer.invoke(IPC_CHANNELS.stopRealtimeVoice),
  publishRealtimeVoice: (id, turn) => ipcRenderer.invoke(IPC_CHANNELS.publishRealtimeVoice, id, turn),
  captureRealtimeImage: (id, sourceId, maxMessageBytes) => ipcRenderer.invoke(IPC_CHANNELS.captureRealtimeImage, id, sourceId, maxMessageBytes),
  setVoiceMirror: (enabled: boolean) => ipcRenderer.invoke(IPC_CHANNELS.setVoiceMirror, enabled),
  listCallAudioSources: () => ipcRenderer.invoke(IPC_CHANNELS.listCallAudioSources),
  startCallAudioCapture: source => ipcRenderer.invoke(IPC_CHANNELS.startCallAudioCapture, source),
  stopCallAudioCapture: () => ipcRenderer.invoke(IPC_CHANNELS.stopCallAudioCapture),
  onCallAudioChunk: callback => { const listener = (_event: Electron.IpcRendererEvent, chunk: CallChunk) => callback(chunk); ipcRenderer.on(IPC_CHANNELS.callAudioChunk, listener); return () => { ipcRenderer.removeListener(IPC_CHANNELS.callAudioChunk, listener); }; },
  onCallAudioError: callback => { const listener = (_event: Electron.IpcRendererEvent, message: string) => callback(message); ipcRenderer.on(IPC_CHANNELS.callAudioError, listener); return () => { ipcRenderer.removeListener(IPC_CHANNELS.callAudioError, listener); }; },
  getAssistTurnState: () => ipcRenderer.invoke(IPC_CHANNELS.getAssistTurnState),
  setAssistantMode: enabled => ipcRenderer.invoke(IPC_CHANNELS.setAssistantMode, enabled),
  onAssistantModeRequest: callback => {
    const listener = (_event: Electron.IpcRendererEvent, id: number, enabled: boolean) => {
      void Promise.resolve().then(() => callback(enabled)).then(
        () => ipcRenderer.send(IPC_CHANNELS.assistantModeResult, id),
        (error: unknown) => ipcRenderer.send(IPC_CHANNELS.assistantModeResult, id, error instanceof Error ? error.message : 'Assistant action failed.'),
      );
    };
    ipcRenderer.on(IPC_CHANNELS.assistantModeRequested, listener);
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.assistantModeRequested, listener); };
  },
  configureAssistTurn: active => ipcRenderer.invoke(IPC_CHANNELS.configureAssistTurn, active),
  setAssistAnswerHold: held => ipcRenderer.invoke(IPC_CHANNELS.setAssistAnswerHold, held),
  nextQuestion: () => ipcRenderer.invoke(IPC_CHANNELS.nextQuestion),
  previousQuestion: () => ipcRenderer.invoke(IPC_CHANNELS.previousQuestion),
  onQuestionNavigated: callback => {
    const listener = (_event: Electron.IpcRendererEvent, session: SessionItem) => callback(session);
    ipcRenderer.on(IPC_CHANNELS.questionNavigated, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.questionNavigated, listener);
  },
  confirmAssistQuestion: () => ipcRenderer.invoke(IPC_CHANNELS.confirmAssistQuestion),
  dismissAssistQuestion: () => ipcRenderer.invoke(IPC_CHANNELS.dismissAssistQuestion),
  onAssistTurnUpdate: callback => { const listener = (_event: Electron.IpcRendererEvent, update: AssistTurnUpdate) => callback(update); ipcRenderer.on(IPC_CHANNELS.assistTurnUpdated, listener); return () => { ipcRenderer.removeListener(IPC_CHANNELS.assistTurnUpdated, listener); }; },
  listNotes: () => ipcRenderer.invoke(IPC_CHANNELS.listNotes),
  getJobDescription: () => ipcRenderer.invoke(IPC_CHANNELS.getJobDescription),
  saveJobDescription: text => ipcRenderer.invoke(IPC_CHANNELS.saveJobDescription, text),
  uploadNotes: () => ipcRenderer.invoke(IPC_CHANNELS.uploadNotes),
  searchNotes: (question: string) => ipcRenderer.invoke(IPC_CHANNELS.searchNotes, question),
  askQuestion: (request: AnswerRequest) => ipcRenderer.invoke(IPC_CHANNELS.askQuestion, request),
  getHistory: () => ipcRenderer.invoke(IPC_CHANNELS.getHistory),
  deleteSession: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.deleteSession, id),
  exportSession: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.exportSession, id),
  exportAllSessions: () => ipcRenderer.invoke(IPC_CHANNELS.exportAllSessions),
  exportSessions: (ids: string[], format: SessionExportFormat) => ipcRenderer.invoke(IPC_CHANNELS.exportSessions, ids, format),
  reviewSession: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.reviewSession, id),
  getRuntimeStatus: () => ipcRenderer.invoke(IPC_CHANNELS.getRuntimeStatus),
  transcribeAudio: (recording: AudioRecordingPayload) => ipcRenderer.invoke(IPC_CHANNELS.transcribeAudio, recording),
  saveAssistSession: (session: AssistSessionPayload) => ipcRenderer.invoke(IPC_CHANNELS.saveAssistSession, session),
  getOverlayState: () => ipcRenderer.invoke(IPC_CHANNELS.getOverlayState),
  toggleOverlay: () => ipcRenderer.invoke(IPC_CHANNELS.toggleOverlay),
  setOverlayClickThrough: enabled => ipcRenderer.invoke(IPC_CHANNELS.setOverlayClickThrough, enabled),
  setOverlayPointerInteractive: interactive => ipcRenderer.invoke(IPC_CHANNELS.setOverlayPointerInteractive, interactive),
  setOverlayOpacity: (opacity: number) => ipcRenderer.invoke(IPC_CHANNELS.setOverlayOpacity, opacity),
  resizeOverlay: (width, height) => ipcRenderer.invoke(IPC_CHANNELS.resizeOverlay, width, height),
  reportVoiceActivity: (activity: VoiceActivity) => ipcRenderer.invoke(IPC_CHANNELS.reportVoiceActivity, activity),
  toggleAppVisibility: () => ipcRenderer.invoke(IPC_CHANNELS.toggleAppVisibility),
  askScreenQuestion: () => ipcRenderer.invoke(IPC_CHANNELS.askScreenQuestion),
  getScreenMonitorState: () => ipcRenderer.invoke(IPC_CHANNELS.getScreenMonitorState),
  selectScreenMonitorSource: (sourceId: string) => ipcRenderer.invoke(IPC_CHANNELS.selectScreenMonitorSource, sourceId),
  startScreenMonitoring: () => ipcRenderer.invoke(IPC_CHANNELS.startScreenMonitoring),
  stopScreenMonitoring: () => ipcRenderer.invoke(IPC_CHANNELS.stopScreenMonitoring),
  onScreenMonitorUpdate: (callback: (state: ScreenMonitorState) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, state: ScreenMonitorState) => callback(state);
    ipcRenderer.on(IPC_CHANNELS.screenMonitorUpdated, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.screenMonitorUpdated, listener);
  },
  onScreenAnalysis: (callback: (result: ScreenOcrResult) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, result: ScreenOcrResult) => callback(result);
    ipcRenderer.on(IPC_CHANNELS.screenAnalysis, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.screenAnalysis, listener);
  },
  onOverlayUpdate: (callback: (state: OverlayState) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, state: OverlayState) => callback(state);
    ipcRenderer.on(IPC_CHANNELS.overlayUpdated, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.overlayUpdated, listener);
  },
  listScreenCaptureSources: includePreviews => ipcRenderer.invoke(IPC_CHANNELS.listScreenCaptureSources, includePreviews),
  captureScreenAndExtractText: (sourceId: string) => ipcRenderer.invoke(IPC_CHANNELS.captureScreenAndExtractText, sourceId),
  getEmbeddingIndexStatus: () => ipcRenderer.invoke(IPC_CHANNELS.getEmbeddingIndexStatus),
  buildEmbeddingIndex: () => ipcRenderer.invoke(IPC_CHANNELS.buildEmbeddingIndex),
  clearEmbeddingIndex: () => ipcRenderer.invoke(IPC_CHANNELS.clearEmbeddingIndex),
};

contextBridge.exposeInMainWorld('interviewAPI', interviewAPI);
