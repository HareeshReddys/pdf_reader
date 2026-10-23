export type NoteSnippet = {
  fileName: string;
  content: string;
  score: number;
  source: 'personal' | 'reference';
  sourceLabel: string;
  relatedContent?: string[];
};

export type StoredNote = {
  fileName: string;
  size: number;
  importedAt: string;
  source: 'personal' | 'reference';
  sourceLabel: string;
};

export type UploadNotesResult = {
  canceled: boolean;
  imported: StoredNote[];
  errors: string[];
};

export type AnswerRequest = {
  question: string;
};

export type AnswerResponse = {
  answer: string;
  snippets: NoteSnippet[];
  relatedAnswers?: NoteSnippet[];
  generationMode: 'reference' | 'source' | 'local' | 'openai' | 'codex' | 'chatgpt';
  question?: string;
  followUpQuestion?: string;
  confidence?: 'high' | 'medium' | 'low';
};

export type SessionItem = {
  practiceSessionId?: string;
  id: string;
  question: string;
  answer: string;
  snippets: NoteSnippet[];
  relatedAnswers?: NoteSnippet[];
  createdAt: string;
  generationMode?: 'reference' | 'source' | 'local' | 'openai' | 'codex' | 'chatgpt';
  transcript?: string;
  ocrText?: string;
  followUpQuestion?: string;
  confidence?: 'high' | 'medium' | 'low';
};

export type ExportSessionResult = {
  canceled: boolean;
  filePath?: string;
};
export type SessionExportFormat = 'markdown' | 'json';

export type RuntimeStatus = {
  answerProvider?: 'codex' | 'chatgpt-desktop';
  captureProtection?: CaptureProtectionStatus;
  openAIConfigured: boolean;
  codexEnabled: boolean;
  codexModel: string;
  codexFast: boolean;
  openAIModel: string;
  transcriptionModel: string;
  transcriptionMode: 'local';
};

export type CallAudioSource = { id: string; name: string };
export type AssistTurnState = { active: boolean; held: boolean; revision?: number; pendingQuestion?: string; detail?: string };
export type AssistTurnUpdate = { state: AssistTurnState; suggestion?: ContextAnswer; acceptedQuestion?: string };

export type AudioRecordingPayload = {
  bytes: number[];
  mimeType: string;
  durationMs: number;
  assistMode?: boolean;
  audioSource?: 'microphone' | 'system';
  deviceLabel?: string;
  answerContext?: string;
  capturedAt?: number;
  utteranceComplete?: boolean;
};

export type AssistSessionPayload = {
  transcript: string;
  questions: string[];
};

export type ContextAnswer = AnswerResponse & {
  question: string;
  followUpQuestion: string;
  confidence: 'high' | 'medium' | 'low';
};

export type TranscriptionResult = {
  transcript: string;
  detectedQuestions: string[];
  suggestions: ContextAnswer[];
  speakerLabel: string;
  audioSource: 'microphone' | 'system';
  suppressedAsCandidateAnswer: boolean;
  ignoredAsAcknowledgement: boolean;
};

export type OverlayActivity = 'idle' | 'listening' | 'hearing' | 'transcribing' | 'searching' | 'codex' | 'chatgpt' | 'screen' | 'ready' | 'error';
export type VoiceActivity = { active: boolean; speaking: boolean; error?: string };
export type ScreenMonitorState = { active: boolean; sourceId: string; sourceName: string; intervalMs: number; lastCheckedAt?: string; error?: string };

export interface CaptureProtectionStatus {
  supported: boolean;
  active: boolean;
  strategy: 'windows-native' | 'macos-native' | 'linux-x11' | 'linux-pipewire' | 'linux-virtual-monitor' | 'unsupported';
  reason?: string;
}
export type OverlayState = {
  pendingVoiceAnswer?: boolean;
  previousVoiceAnswers?: { question: string; answer: string }[];
  voiceMirrorActive?: boolean;
  realtimeVoiceActive?: boolean;
  realtimeVoiceNotice?: string;
  clickThrough?: boolean;
  assistTurn?: AssistTurnState;
  captureProtection?: CaptureProtectionStatus;
  streamingAnswer?: string;
  question?: string;
  answerQuestion?: string;
  activity?: OverlayActivity;
  activityDetail?: string;
  voiceActive?: boolean;
  speaking?: boolean;
  monitor?: ScreenMonitorState;
  panelOpacity?: number;
  model?: string;

  relatedAnswers?: NoteSnippet[];
  visible: boolean;
  answer: string;
  generationMode: AnswerResponse['generationMode'];
};

export type ScreenCaptureSource = {
  id: string;
  name: string;
  kind: 'screen' | 'window';
  thumbnailDataUrl: string;
};

export type ScreenOcrResult = {
  sourceId: string;
  sourceName: string;
  imageDataUrl: string;
  extractedText: string;
  detectedQuestions: string[];
  suggestions: ContextAnswer[];
};

export type EmbeddingIndexStatus = {
  exists: boolean;
  entryCount: number;
  model: string;
  createdAt?: string;
  sourceFingerprint?: string;
};

export type InterviewApi = {
  getRealtimeContextSummary: () => Promise<{ sourceNames: string[]; hasJobDescription: boolean; truncated: boolean }>;
  requestRealtimeVoiceAction: (action: 'start' | 'stop' | 'screenshot') => Promise<void>;
  onRealtimeVoiceAction: (callback: (action: 'start' | 'stop' | 'screenshot') => void) => () => void;
  reportRealtimeVoiceNotice: (id: string, notice: 'sending' | 'received' | 'unconfirmed' | 'renewing' | 'renewed' | 'renewal-delayed') => Promise<void>;
  connectRealtimeVoice: (sdp: string) => Promise<{ id: string; sdp: string }>;
  prepareRealtimeRenewal: (id: string, sdp: string) => Promise<{ token: string; sdp: string }>;
  commitRealtimeRenewal: (id: string, token: string) => Promise<void>;
  cancelRealtimeRenewal: (id: string) => Promise<void>;
  stopRealtimeVoice: () => Promise<void>;
  publishRealtimeVoice: (id: string, turn: RealtimeVoiceTurn) => Promise<void>;
  captureRealtimeImage: (id: string, sourceId: string, maxMessageBytes: number) => Promise<string>;
  setVoiceMirror: (enabled: boolean) => Promise<void>;
  listCallAudioSources: () => Promise<CallAudioSource[]>;
  startCallAudioCapture: (sourceId: string) => Promise<void>;
  stopCallAudioCapture: () => Promise<void>;
  onCallAudioChunk: (callback: (chunk: AudioRecordingPayload) => void) => () => void;
  onCallAudioError: (callback: (message: string) => void) => () => void;
  getAssistTurnState: () => Promise<AssistTurnState>;
  configureAssistTurn: (active: boolean) => Promise<AssistTurnState>;
  setAssistantMode: (enabled: boolean) => Promise<void>;
  onAssistantModeRequest: (callback: (enabled: boolean) => Promise<void>) => () => void;
  setAssistAnswerHold: (held: boolean) => Promise<AssistTurnState>;
  nextQuestion: () => Promise<void>;
  previousQuestion: () => Promise<void>;
  onQuestionNavigated: (callback: (session: SessionItem) => void) => () => void;
  confirmAssistQuestion: () => Promise<void>;
  dismissAssistQuestion: () => Promise<void>;
  onAssistTurnUpdate: (callback: (update: AssistTurnUpdate) => void) => () => void;
  listNotes: () => Promise<StoredNote[]>;
  getJobDescription: () => Promise<string>;
  saveJobDescription: (text: string) => Promise<string>;
  uploadNotes: () => Promise<UploadNotesResult>;
  searchNotes: (question: string) => Promise<NoteSnippet[]>;
  askQuestion: (request: AnswerRequest) => Promise<ContextAnswer>;
  getHistory: () => Promise<SessionItem[]>;
  deleteSession: (id: string) => Promise<SessionItem[]>;
  exportSession: (id: string) => Promise<ExportSessionResult>;
  exportAllSessions: () => Promise<ExportSessionResult>;
  exportSessions: (ids: string[], format: SessionExportFormat) => Promise<ExportSessionResult>;
  reviewSession: (id: string) => Promise<string>;
  getRuntimeStatus: () => Promise<RuntimeStatus>;
  transcribeAudio: (recording: AudioRecordingPayload) => Promise<TranscriptionResult>;
  saveAssistSession: (session: AssistSessionPayload) => Promise<SessionItem | null>;
  getOverlayState: () => Promise<OverlayState>;
  toggleOverlay: () => Promise<OverlayState>;
  setOverlayClickThrough: (enabled: boolean) => Promise<OverlayState>;
  setOverlayPointerInteractive: (interactive: boolean) => Promise<void>;
  setOverlayOpacity: (opacity: number) => Promise<OverlayState>;
  resizeOverlay: (width: number, height: number) => Promise<void>;
  reportVoiceActivity: (activity: VoiceActivity) => Promise<void>;
  toggleAppVisibility: () => Promise<boolean>;
  askScreenQuestion: () => Promise<void>;
  getScreenMonitorState: () => Promise<ScreenMonitorState>;
  selectScreenMonitorSource: (sourceId: string) => Promise<ScreenMonitorState>;
  startScreenMonitoring: () => Promise<ScreenMonitorState>;
  stopScreenMonitoring: () => Promise<ScreenMonitorState>;
  onScreenMonitorUpdate: (callback: (state: ScreenMonitorState) => void) => () => void;
  onScreenAnalysis: (callback: (result: ScreenOcrResult) => void) => () => void;
  onOverlayUpdate: (callback: (state: OverlayState) => void) => () => void;
  listScreenCaptureSources: (includePreviews?: boolean) => Promise<ScreenCaptureSource[]>;
  captureScreenAndExtractText: (sourceId: string) => Promise<ScreenOcrResult>;
  getEmbeddingIndexStatus: () => Promise<EmbeddingIndexStatus>;
  buildEmbeddingIndex: () => Promise<EmbeddingIndexStatus>;
  clearEmbeddingIndex: () => Promise<EmbeddingIndexStatus>;
};

export type RealtimeVoiceTurn = { responseId: string; question: string; answer: string; complete: boolean; interrupted: boolean };
