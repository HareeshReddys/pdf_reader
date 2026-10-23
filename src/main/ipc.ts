import { configureAssistTurn, getAssistTurnState, setAssistAnswerHold, confirmAssistQuestion, dismissAssistQuestion, ingestAssistTranscript } from './services/assistTurnService';
import { listCallAudioSources, startCallAudioCapture, stopCallAudioCapture } from './services/callAudioService';
import { isChatGptDesktopEnabled } from './services/chatgptDesktopService';
import { forwardDesktopTranscript } from './services/desktopTranscriptService';
import { startVoiceMirror, stopVoiceMirror } from './services/voiceMirrorService';
import { getCaptureProtectionStatus } from '../platform/captureProtection';
import { promises as fs } from 'node:fs';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { AnswerRequest, AssistSessionPayload, AudioRecordingPayload, VoiceActivity, ContextAnswer, SessionExportFormat, UploadNotesResult } from '../shared/types';
import { IPC_CHANNELS } from '../shared/channels';
import { importNote, listNotes, searchNotes } from './services/knowledgeService';
import {
  deleteSession,
  formatAllSessionsMarkdown,
  formatSessionMarkdown,
  listSessions,
  saveSession,
} from './services/sessionService';
import { captureAndAnalyzeScreen, getScreenMonitorState, selectScreenMonitorSource, startScreenMonitoring, stopScreenMonitoring } from './services/screenMonitorService';
import { rememberSpokenQuestion, screenForQuestion } from './services/screenContextService';
import { isCodexEnabled, getCodexModel, isCodexFast } from './services/codexService';
import { isOpenAIConfigured } from './services/openaiService';
import { runContextEngine } from './services/contextEngine';
import { detectInterviewQuestions, isConversationalAcknowledgement } from './services/questionDetectionService';
import { getLocalTranscriptionModel, transcribeAudio, warmTranscription } from './services/transcriptionService';
import { getOverlayState, toggleOverlay, updateOverlaySuggestion, setOverlayOpacity, updateVoiceActivity, updateOverlayActivity, toggleAppVisibility } from './services/overlayService';
import { askChatGptAboutScreen } from './services/screenChatService';
import { captureScreenAndExtractText, listScreenCaptureSources } from './services/screenCaptureService';
import { buildEmbeddingIndex, clearEmbeddingIndex, getEmbeddingIndexStatus } from './services/embeddingSearchService';
import { generateSessionReview } from './services/reviewService';
import { resemblesDisplayedAnswer } from './services/responseGuardService';
import { resizeOverlay, setOverlayClickThrough, setOverlayPointerInteractive } from './services/overlayService';
import { nextQuestion, previousQuestion } from './services/questionNavigationService';
import { getJobDescription, saveJobDescription } from './services/jobDescriptionService';
import { connectRealtimeVoice, stopRealtimeVoice, publishRealtimeVoice, captureRealtimeImage, isRealtimeVoiceActive, requestRealtimeVoiceAction, reportRealtimeVoiceNotice } from './services/realtimeVoiceService';
import { prepareRealtimeRenewal, commitRealtimeRenewal, cancelRealtimeRenewal } from './services/realtimeVoiceService';
import { isOverlayRenderer } from './services/overlayService';
import { getRealtimeContextSummary } from './services/realtimeContextService';

function requireQuestion(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Please enter a question.');
  return value.trim();
}

function requireId(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error('A valid session ID is required.');
  return value.trim();
}

const assistAnswerCache = new Map<string, ContextAnswer>();

export function registerIpcHandlers(getAssistantWindow: () => BrowserWindow | undefined = () => undefined): void {
  const voiceOwners = new WeakSet<Electron.WebContents>();
  ipcMain.handle(IPC_CHANNELS.getRealtimeContextSummary, () => getRealtimeContextSummary());
  ipcMain.handle(IPC_CHANNELS.requestRealtimeVoiceAction, (event, action: unknown) => {
    if (action !== 'start' && action !== 'stop' && action !== 'screenshot') throw new Error('Invalid voice action.');
    if (event.senderFrame !== event.sender.mainFrame || (!isOverlayRenderer(event.sender.id) && event.sender !== getAssistantWindow()?.webContents)) throw new Error('Untrusted voice controller.');
    if (action === 'start') {
      const controller = getAssistantWindow();
      if (!controller || controller.isDestroyed()) throw new Error('The voice controller is unavailable. Reopen the app.');
      controller.webContents.send(IPC_CHANNELS.realtimeVoiceAction, 'start');
    } else requestRealtimeVoiceAction(action);
  });
  const requireVoiceOwner = (event: Electron.IpcMainInvokeEvent) => {
    const window = getAssistantWindow();
    if (!window || window.isDestroyed() || event.sender !== window.webContents || event.senderFrame !== window.webContents.mainFrame) throw new Error('Only the main application can control continuous voice.');
    return window;
  };
  ipcMain.handle(IPC_CHANNELS.connectRealtimeVoice, (event, sdp: unknown) => {
    requireVoiceOwner(event);
    if (getAssistTurnState().active || getOverlayState().voiceMirrorActive) throw new Error('Stop local assistant mode and desktop voice mirroring before starting continuous voice.');
    if (!voiceOwners.has(event.sender)) {
      voiceOwners.add(event.sender);
      const owner = event.sender.id;
      event.sender.once('destroyed', () => stopRealtimeVoice(owner));
    }
    return connectRealtimeVoice(event.sender.id, sdp);
  });
  ipcMain.handle(IPC_CHANNELS.stopRealtimeVoice, event => { requireVoiceOwner(event); stopRealtimeVoice(event.sender.id); });
  ipcMain.handle(IPC_CHANNELS.prepareRealtimeRenewal, (event, id: unknown, sdp: unknown) => { requireVoiceOwner(event); return prepareRealtimeRenewal(event.sender.id, id, sdp); });
  ipcMain.handle(IPC_CHANNELS.commitRealtimeRenewal, (event, id: unknown, token: unknown) => { requireVoiceOwner(event); commitRealtimeRenewal(event.sender.id, id, token); });
  ipcMain.handle(IPC_CHANNELS.cancelRealtimeRenewal, (event, id: unknown) => { requireVoiceOwner(event); cancelRealtimeRenewal(event.sender.id, id); });
  ipcMain.handle(IPC_CHANNELS.reportRealtimeVoiceNotice, (event, id: unknown, notice: unknown) => { requireVoiceOwner(event); reportRealtimeVoiceNotice(event.sender.id, id, notice); });
  ipcMain.handle(IPC_CHANNELS.publishRealtimeVoice, (event, id: unknown, turn: unknown) => { requireVoiceOwner(event); return publishRealtimeVoice(event.sender.id, id, turn); });
  ipcMain.handle(IPC_CHANNELS.captureRealtimeImage, (event, id: unknown, sourceId: unknown, limit: unknown) => { requireVoiceOwner(event); return captureRealtimeImage(event.sender.id, id, sourceId, limit); });
  ipcMain.handle(IPC_CHANNELS.setVoiceMirror, (_event, enabled: unknown) => {
    if (enabled && isRealtimeVoiceActive()) throw new Error('Stop continuous API voice first.');
    if (typeof enabled !== 'boolean') throw new Error('Invalid Voice mirror state.');
    return enabled ? startVoiceMirror() : stopVoiceMirror();
  });
  let modeRequestId = 0;
  let modeRequestPending = false;
  ipcMain.handle(IPC_CHANNELS.setAssistantMode, async (_event, enabled: unknown) => {
    if (enabled && isRealtimeVoiceActive()) throw new Error('Stop continuous API voice first.');
    if (typeof enabled !== 'boolean') throw new Error('Invalid assistant state.');
    if (enabled && getOverlayState().voiceMirrorActive) throw new Error('Stop Voice text mirroring before starting local assistant mode.');
    const window = getAssistantWindow();
    if (!window || window.isDestroyed()) throw new Error('The main window is unavailable. Reopen the app.');
    if (modeRequestPending) throw new Error('Assistant mode is already changing.');
    const controller = window.webContents;
    const id = ++modeRequestId;
    modeRequestPending = true;
    try {
      await new Promise<void>((resolve, reject) => {
        const finish = (error?: string) => {
          clearTimeout(timer);
          ipcMain.removeListener(IPC_CHANNELS.assistantModeResult, result);
          controller.removeListener('destroyed', destroyed);
          error ? reject(new Error(error)) : resolve();
        };
        const result = (event: Electron.IpcMainEvent, responseId: unknown, error: unknown) => {
          if (event.sender !== controller || responseId !== id) return;
          finish(typeof error === 'string' ? error : undefined);
        };
        const destroyed = () => finish('The main window closed while changing assistant mode.');
        const timer = setTimeout(() => finish('Assistant mode did not respond. Check the main window and retry.'), 120000);
        ipcMain.on(IPC_CHANNELS.assistantModeResult, result);
        controller.once('destroyed', destroyed);
        controller.send(IPC_CHANNELS.assistantModeRequested, id, enabled);
      });
    } finally { modeRequestPending = false; }
  });
  ipcMain.handle(IPC_CHANNELS.listCallAudioSources, () => listCallAudioSources());
  ipcMain.handle(IPC_CHANNELS.startCallAudioCapture, async (event, id: unknown) => {
    await startCallAudioCapture(requireId(id), chunk => { if (!event.sender.isDestroyed()) event.sender.send(IPC_CHANNELS.callAudioChunk, { ...chunk, capturedAt: Date.now() }); }, message => { if (!event.sender.isDestroyed()) event.sender.send(IPC_CHANNELS.callAudioError, message); });
    event.sender.once('destroyed', stopCallAudioCapture);
  });
  ipcMain.handle(IPC_CHANNELS.stopCallAudioCapture, () => stopCallAudioCapture());
  ipcMain.handle(IPC_CHANNELS.getAssistTurnState, getAssistTurnState);
  ipcMain.handle(IPC_CHANNELS.setOverlayPointerInteractive, (event, interactive: unknown) => {
    if (typeof interactive !== 'boolean') throw new Error('Invalid pointer state.');
    setOverlayPointerInteractive(interactive, event.sender.id);
  });
  ipcMain.handle(IPC_CHANNELS.nextQuestion, nextQuestion);
  ipcMain.handle(IPC_CHANNELS.previousQuestion, previousQuestion);
  ipcMain.handle(IPC_CHANNELS.setOverlayClickThrough, (_event, enabled: unknown) => {
    if (typeof enabled !== 'boolean') throw new Error('Invalid click-through state.');
    return setOverlayClickThrough(enabled);
  });
  ipcMain.handle(IPC_CHANNELS.resizeOverlay, (event, width: unknown, height: unknown) => {
    if (typeof width !== 'number' || typeof height !== 'number') throw new Error('Invalid overlay dimensions.');
    resizeOverlay(width, height, event.sender.id);
  });
  ipcMain.handle(IPC_CHANNELS.configureAssistTurn, (_event, active: unknown) => { if (typeof active !== 'boolean') throw new Error('Invalid assistant state'); if (active && isRealtimeVoiceActive()) throw new Error('Stop continuous API voice first.'); if (active && getOverlayState().voiceMirrorActive) throw new Error('Stop Voice text mirroring before starting local assistant mode.'); if (!active) stopCallAudioCapture(); else warmTranscription(); return configureAssistTurn(active); });
  ipcMain.handle(IPC_CHANNELS.setAssistAnswerHold, (_event, held: unknown) => { if (typeof held !== 'boolean') throw new Error('Invalid answer hold'); return setAssistAnswerHold(held); });
  ipcMain.handle(IPC_CHANNELS.confirmAssistQuestion, () => confirmAssistQuestion());
  ipcMain.handle(IPC_CHANNELS.dismissAssistQuestion, () => dismissAssistQuestion());
  ipcMain.handle(IPC_CHANNELS.listNotes, () => listNotes());
  ipcMain.handle(IPC_CHANNELS.getJobDescription, () => getJobDescription());
  ipcMain.handle(IPC_CHANNELS.saveJobDescription, async (_event, text: unknown) => {
    const saved = await saveJobDescription(text);
    assistAnswerCache.clear();
    return saved;
  });

  ipcMain.handle(IPC_CHANNELS.uploadNotes, async (): Promise<UploadNotesResult> => {
    const selection = await dialog.showOpenDialog({
      title: 'Import interview notes',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Resume and notes', extensions: ['txt', 'md', 'docx', 'pdf'] }],
    });
    if (selection.canceled) return { canceled: true, imported: [], errors: [] };

    const imported = [];
    const errors: string[] = [];
    for (const filePath of selection.filePaths) {
      try {
        imported.push(await importNote(filePath));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown import error.';
        errors.push(`${path.basename(filePath)}: ${message}`);
      }
    }
    return { canceled: false, imported, errors };
  });

  ipcMain.handle(IPC_CHANNELS.searchNotes, (_event, question: unknown) => searchNotes(requireQuestion(question)));

  ipcMain.handle(IPC_CHANNELS.askQuestion, async (_event, request: AnswerRequest) => {
    const question = requireQuestion(request?.question);
    const context = await runContextEngine({
      manualQuestion: question,
      previousHistory: await listSessions(),
    });
    const response: ContextAnswer = {
      question: context.question,
      answer: context.answer,
      snippets: context.snippets,
      relatedAnswers: context.relatedAnswers,
      generationMode: context.generationMode,
      followUpQuestion: context.followUpQuestion,
      confidence: context.confidence,
    };
    await saveSession({
      question: context.question,
      answer: context.answer,
      snippets: context.snippets,
      relatedAnswers: context.relatedAnswers,
      generationMode: context.generationMode,
      followUpQuestion: context.followUpQuestion,
      confidence: context.confidence,
    });
    return response;
  });

  ipcMain.handle(IPC_CHANNELS.getHistory, () => listSessions());

  ipcMain.handle(IPC_CHANNELS.deleteSession, (_event, id: unknown) => deleteSession(requireId(id)));

  ipcMain.handle(IPC_CHANNELS.exportSession, async (_event, id: unknown) => {
    const sessionId = requireId(id);
    const session = (await listSessions()).find((item) => item.id === sessionId);
    if (!session) throw new Error('The selected history item was not found.');
    const safeName = session.question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'interview-answer';
    const result = await dialog.showSaveDialog({
      title: 'Export interview answer',
      defaultPath: `${safeName}.md`,
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    await fs.writeFile(result.filePath, formatSessionMarkdown(session), 'utf8');
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle(IPC_CHANNELS.exportAllSessions, async () => {
    const sessions = await listSessions();
    if (sessions.length === 0) throw new Error('There is no session history to export.');
    const result = await dialog.showSaveDialog({
      title: 'Export all interview history',
      defaultPath: 'interview-prep-history.md',
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    await fs.writeFile(result.filePath, formatAllSessionsMarkdown(sessions), 'utf8');
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle(IPC_CHANNELS.exportSessions, async (_event, ids: unknown, format: SessionExportFormat) => {
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) throw new Error('Choose valid sessions to export.');
    if (format !== 'markdown' && format !== 'json') throw new Error('Choose Markdown or JSON export format.');
    const idSet = new Set(ids);
    const sessions = (await listSessions()).filter((session) => idSet.has(session.id));
    if (sessions.length === 0) throw new Error('Choose at least one session to export.');
    const extension = format === 'json' ? 'json' : 'md';
    const result = await dialog.showSaveDialog({
      title: 'Export interview sessions',
      defaultPath: `interview-practice-sessions.${extension}`,
      filters: [{ name: format === 'json' ? 'JSON' : 'Markdown', extensions: [extension] }],
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    const content = format === 'json'
      ? `${JSON.stringify(sessions, null, 2)}\n`
      : formatAllSessionsMarkdown(sessions);
    await fs.writeFile(result.filePath, content, 'utf8');
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle(IPC_CHANNELS.reviewSession, async (_event, id: unknown) => {
    const sessionId = requireId(id);
    const session = (await listSessions()).find((item) => item.id === sessionId);
    if (!session) throw new Error('The selected history item was not found.');
    return generateSessionReview(session);
  });

  ipcMain.handle(IPC_CHANNELS.getRuntimeStatus, () => ({
    answerProvider: isChatGptDesktopEnabled() ? 'chatgpt-desktop' : 'codex',
    captureProtection: getCaptureProtectionStatus(),
    openAIConfigured: isOpenAIConfigured(),
    codexEnabled: isCodexEnabled(),
    codexModel: getCodexModel(),
    codexFast: isCodexFast(),
    openAIModel: process.env.OPENAI_MODEL?.trim() || 'gpt-6-luna',
    transcriptionModel: getLocalTranscriptionModel(),
    transcriptionMode: 'local' as const,
  }));

  ipcMain.handle(IPC_CHANNELS.getOverlayState, () => getOverlayState());
  ipcMain.handle(IPC_CHANNELS.toggleOverlay, () => toggleOverlay());
  ipcMain.handle(IPC_CHANNELS.listScreenCaptureSources, (_event, includePreviews: unknown) => {
    if (includePreviews !== undefined && typeof includePreviews !== 'boolean') throw new Error('Invalid screen-list option.');
    return listScreenCaptureSources(includePreviews === undefined ? true : includePreviews);
  });
  ipcMain.handle(IPC_CHANNELS.setOverlayOpacity, (_event, opacity: unknown) => {
    if (typeof opacity !== 'number') throw new Error('Choose a valid transparency.');
    return setOverlayOpacity(opacity);
  });
  ipcMain.handle(IPC_CHANNELS.reportVoiceActivity, (_event, activity: VoiceActivity) => {
    if (typeof activity?.active !== 'boolean' || typeof activity?.speaking !== 'boolean') throw new Error('Invalid voice state.');
    updateVoiceActivity({ active: activity.active, speaking: activity.speaking, error: typeof activity.error === 'string' ? activity.error.slice(0, 500) : undefined });
  });
  ipcMain.handle(IPC_CHANNELS.toggleAppVisibility, () => toggleAppVisibility());
  ipcMain.handle(IPC_CHANNELS.askScreenQuestion, () => askChatGptAboutScreen());
  ipcMain.handle(IPC_CHANNELS.getScreenMonitorState, () => getScreenMonitorState());
  ipcMain.handle(IPC_CHANNELS.selectScreenMonitorSource, (_event, sourceId: unknown) => selectScreenMonitorSource(requireId(sourceId)));
  ipcMain.handle(IPC_CHANNELS.startScreenMonitoring, () => startScreenMonitoring());
  ipcMain.handle(IPC_CHANNELS.stopScreenMonitoring, () => stopScreenMonitoring());
  ipcMain.handle(IPC_CHANNELS.captureScreenAndExtractText, (_event, sourceId: unknown) => captureAndAnalyzeScreen(requireId(sourceId)));
  ipcMain.handle(IPC_CHANNELS.getEmbeddingIndexStatus, () => getEmbeddingIndexStatus());
  ipcMain.handle(IPC_CHANNELS.buildEmbeddingIndex, () => buildEmbeddingIndex());
  ipcMain.handle(IPC_CHANNELS.clearEmbeddingIndex, async () => {
    await clearEmbeddingIndex();
    return getEmbeddingIndexStatus();
  });

  ipcMain.handle(IPC_CHANNELS.transcribeAudio, async (_event, recording: AudioRecordingPayload) => {
    updateOverlayActivity('transcribing', 'Converting speech to text locally');
    const transcript = await transcribeAudio(recording).catch((error: unknown) => {
      if (error instanceof Error && /No speech was detected/.test(error.message)) return '';
      updateOverlayActivity('error', error instanceof Error ? error.message : 'Transcription failed.');
      throw error;
    });
    const audioSource = recording.audioSource === 'system' ? 'system' : 'microphone';
    if (recording.assistMode && isChatGptDesktopEnabled()) return forwardDesktopTranscript(transcript, recording);
    if (recording.assistMode) {
      const decision = ingestAssistTranscript(transcript, recording);
      updateOverlayActivity('listening', getAssistTurnState().detail || 'Waiting for the next interviewer question');
      return { transcript, ...decision, audioSource, suggestions: [] };
    }
    const suppressedAsCandidateAnswer = audioSource === 'microphone'
      && resemblesDisplayedAnswer(transcript, recording.answerContext);
    const ignoredAsAcknowledgement = isConversationalAcknowledgement(transcript);
    const speakerLabel = suppressedAsCandidateAnswer
      ? 'Candidate response · ignored'
      : ignoredAsAcknowledgement ? 'Conversation · ignored'
      : audioSource === 'system' ? 'Interviewer / call audio' : 'Room microphone';
    const detectedQuestions = (suppressedAsCandidateAnswer || ignoredAsAcknowledgement ? [] : detectInterviewQuestions(transcript, 'transcript'))
      .map((candidate) => candidate.question)
      .filter((question, index, all) => all.indexOf(question) === index)
      .slice(0, 5);
    if (!detectedQuestions.length) updateOverlayActivity(recording.assistMode ? 'listening' : 'ready', 'Waiting for the next question');
    const previousHistory = await listSessions();
    const suggestions: ContextAnswer[] = [];

    for (const question of detectedQuestions) {
      const roleKey = createHash('sha256').update(await getJobDescription()).digest('hex');
      const cacheKey = roleKey + ':' + question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      const cached = recording.assistMode ? assistAnswerCache.get(cacheKey) : undefined;
      if (cached) {
        suggestions.push(cached);
        updateOverlaySuggestion(cached);
        continue;
      }
      rememberSpokenQuestion(question);
      const context = await runContextEngine({ manualQuestion: question, latestTranscript: transcript, previousHistory, screenshotDataUrl: screenForQuestion(question) });
      const suggestion: ContextAnswer = {
        question: context.question,
        answer: context.answer,
        snippets: context.snippets,
        relatedAnswers: context.relatedAnswers,
        generationMode: context.generationMode,
        followUpQuestion: context.followUpQuestion,
        confidence: context.confidence,
      };
      suggestions.push(suggestion);
      if (recording.assistMode) {
        assistAnswerCache.set(cacheKey, suggestion);
        if (assistAnswerCache.size > 100) assistAnswerCache.delete(assistAnswerCache.keys().next().value ?? '');
      }
      await saveSession({
        question: context.question,
        answer: context.answer,
        snippets: context.snippets,
        relatedAnswers: context.relatedAnswers,
        generationMode: context.generationMode,
        transcript: `${speakerLabel}: ${transcript}`,
        followUpQuestion: context.followUpQuestion,
        confidence: context.confidence,
      });
    }

    return {
      transcript,
      detectedQuestions,
      suggestions,
      speakerLabel,
      audioSource,
      suppressedAsCandidateAnswer,
      ignoredAsAcknowledgement,
    };
  });

  ipcMain.handle(IPC_CHANNELS.saveAssistSession, async (_event, payload: AssistSessionPayload) => {
    const transcript = typeof payload?.transcript === 'string' ? payload.transcript.trim() : '';
    if (!transcript) return null;
    const questions = Array.isArray(payload.questions)
      ? payload.questions.filter((question): question is string => typeof question === 'string' && Boolean(question.trim()))
      : [];
    assistAnswerCache.clear();
    return saveSession({
      question: 'Assist mode practice session',
      answer: questions.length ? questions.map((question) => `- ${question}`).join('\n') : 'No clear interview questions were detected.',
      snippets: [],
      generationMode: 'local',
      transcript,
      followUpQuestion: questions[0] ? `Can you improve your answer to: ${questions[0]}` : 'Which topic should you practice next?',
      confidence: questions.length ? 'medium' : 'low',
    });
  });
}
