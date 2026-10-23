import { useCallback, useEffect, useState } from 'react';
import type { AnswerResponse, RuntimeStatus, SessionItem, StoredNote } from '../shared/types';
import UploadNotes from './components/UploadNotes';
import QuestionInput from './components/QuestionInput';
import SuggestionPanel, { AnswerBody } from './components/SuggestionPanel';
import HistoryPanel from './components/HistoryPanel';
import AudioPanel from './components/AudioPanel';
import RealtimeVoicePanel from './components/RealtimeVoicePanel';
import { APP_DISPLAY_NAME } from '../shared/branding';
import JobDescriptionPanel from './components/JobDescriptionPanel';
import ScreenshotPanel from './components/ScreenshotPanel';
import type { ScreenOcrResult } from '../shared/types';
import KnowledgeSearchPanel from './components/KnowledgeSearchPanel';
import SessionReviewPanel from './components/SessionReviewPanel';
import type { SessionExportFormat } from '../shared/types';
import type { AudioRecordingResult } from './hooks/useAssistRecorder';

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function App() {
  const [notes, setNotes] = useState<StoredNote[]>([]);
  const [history, setHistory] = useState<SessionItem[]>([]);
  const [result, setResult] = useState<AnswerResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [notesNotice, setNotesNotice] = useState<string | null>(null);
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(null);
  const [historyActionBusy, setHistoryActionBusy] = useState(false);
  const [historyActionMessage, setHistoryActionMessage] = useState<string | null>(null);
  const [historyActionError, setHistoryActionError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [detectedQuestion, setDetectedQuestion] = useState('');
  const assistTranscriptRef = useState({ text: '', questions: new Set<string>(), detected: [] as string[] })[0];
  const [liveAnswer, setLiveAnswer] = useState<{ question?: string; answer: string } | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayClickThrough, setOverlayClickThrough] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const loadInitialData = useCallback(async () => {
    const [notesResult, historyResult, statusResult] = await Promise.allSettled([
      window.interviewAPI.listNotes(),
      window.interviewAPI.getHistory(),
      window.interviewAPI.getRuntimeStatus(),
    ]);
    if (notesResult.status === 'fulfilled') setNotes(notesResult.value);
    else setNotesError(errorMessage(notesResult.reason, 'Could not load local notes.'));
    if (historyResult.status === 'fulfilled') setHistory(historyResult.value);
    if (statusResult.status === 'fulfilled') setRuntimeStatus(statusResult.value);
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    if (!window.interviewAPI) {
      setHistoryLoading(false);
      setAnswerError('The desktop connection is unavailable. Restart the app and try again.');
      return;
    }
    void loadInitialData();
  }, [loadInitialData]);

  useEffect(() => window.interviewAPI?.onOverlayUpdate((state) => {
    setOverlayVisible(state.visible);
    setOverlayClickThrough(Boolean(state.clickThrough));
    setLiveAnswer(state.streamingAnswer ? { question: state.question, answer: state.streamingAnswer } : null);
  }), []);
  useEffect(() => { void window.interviewAPI?.getOverlayState().then(state => setOverlayClickThrough(Boolean(state.clickThrough))).catch(() => undefined); }, []);

  const toggleOverlay = async () => {
    try {
      const state = await window.interviewAPI.toggleOverlay();
      setOverlayVisible(state.visible);
    } catch (error) {
      setAnswerError(errorMessage(error, 'Could not toggle the suggestion overlay.'));
    }
  };

  const uploadNotes = async () => {
    setNotesLoading(true);
    setNotesError(null);
    setNotesNotice(null);
    try {
      const uploadResult = await window.interviewAPI.uploadNotes();
      if (uploadResult.errors.length) setNotesError(uploadResult.errors.join('\n'));
      if (!uploadResult.canceled) {
        setNotes(await window.interviewAPI.listNotes());
        if (uploadResult.imported.length) {
          setNotesNotice(`${uploadResult.imported.length} ${uploadResult.imported.length === 1 ? 'note' : 'notes'} added and ready to search.`);
        }
      }
    } catch (error) {
      setNotesError(errorMessage(error, 'The notes could not be added. Use .docx, .pdf, .txt or .md files and try again.'));
    } finally {
      setNotesLoading(false);
    }
  };

  const askQuestion = async (question: string) => {
    setAnswerLoading(true);
    setAnswerError(null);
    setSelectedId(null);
    try {
      const response = await window.interviewAPI.askQuestion({ question });
      setResult(response);
      const refreshedHistory = await window.interviewAPI.getHistory();
      setHistory(refreshedHistory);
      setSelectedId(refreshedHistory[0]?.id ?? null);
    } catch (error) {
      setResult(null);
      setAnswerError(errorMessage(error, 'Something went wrong while preparing the answer.'));
    } finally {
      setAnswerLoading(false);
    }
  };

  const selectHistory = (item: SessionItem) => {
    setSelectedId(item.id);
    setAnswerError(null);
    const referenceSource = item.snippets.find((snippet) => (
      (snippet.source === 'reference' || snippet.fileName.startsWith('Reference ·'))
      && /^##\s+/m.test(snippet.content)
    )) ?? null;
    setResult({
      answer: item.answer,
      relatedAnswers: item.relatedAnswers,
      snippets: item.snippets,
      generationMode: item.generationMode ?? (referenceSource ? 'reference' : 'local'),
      question: item.question,
      followUpQuestion: item.followUpQuestion,
      confidence: item.confidence,
    });
    setTranscript(item.transcript ?? '');
    setDetectedQuestion(item.transcript ? item.question : '');
    setHistoryActionMessage(null);
    setHistoryActionError(null);
  };

  useEffect(() => window.interviewAPI.onQuestionNavigated(selectHistory), []);

  useEffect(() => window.interviewAPI.onAssistTurnUpdate((update) => {
    if (update.acceptedQuestion) {
      setDetectedQuestion(update.acceptedQuestion);
      const key = update.acceptedQuestion.toLowerCase();
      if (!assistTranscriptRef.questions.has(key)) { assistTranscriptRef.questions.add(key); assistTranscriptRef.detected.push(update.acceptedQuestion); }
    }
    if (update.suggestion) { setResult(update.suggestion); void window.interviewAPI.getHistory().then(setHistory); }
  }), []);

  const processAssistChunk = async (recording: AudioRecordingResult) => {
    const response = await window.interviewAPI.transcribeAudio({
      ...recording,
      assistMode: true,
      answerContext: result ? [result.answer, ...(result.relatedAnswers?.map((related) => related.content) ?? [])].join('\n\n') : undefined,
    });
    if (!response.transcript.trim()) return;
    assistTranscriptRef.text = [assistTranscriptRef.text, `${response.speakerLabel}: ${response.transcript}`].filter(Boolean).join('\n');
    setTranscript(assistTranscriptRef.text);
    const unseen = response.detectedQuestions.find((question) => {
      const key = question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      if (assistTranscriptRef.questions.has(key)) return false;
      assistTranscriptRef.questions.add(key);
      assistTranscriptRef.detected.push(question);
      return true;
    });
    if (unseen) setDetectedQuestion(unseen);
    const suggestion = response.suggestions.find((item) => item.question === unseen) ?? response.suggestions[0];
    if (suggestion) setResult(suggestion);
    else if (
      response.detectedQuestions.length === 0
      && !response.suppressedAsCandidateAnswer
      && !response.ignoredAsAcknowledgement
    ) {
      // Keep the current answer visible until a new question produces an answer.
    }
    setHistory(await window.interviewAPI.getHistory());
  };

  const processScreenCapture = async (capture: ScreenOcrResult) => {
    const suggestion = capture.suggestions[0];
    if (capture.detectedQuestions[0]) setDetectedQuestion(capture.detectedQuestions[0]);
    if (suggestion) setResult(suggestion);
    const refreshedHistory = await window.interviewAPI.getHistory();
    setHistory(refreshedHistory);
    if (suggestion) setSelectedId(refreshedHistory[0]?.id ?? null);
  };

  useEffect(() => window.interviewAPI.onScreenAnalysis((capture) => { void processScreenCapture(capture); }), []);

  const exportSelectedSession = async () => {
    if (!selectedId) return;
    setHistoryActionBusy(true);
    setHistoryActionMessage(null);
    setHistoryActionError(null);
    try {
      const exported = await window.interviewAPI.exportSession(selectedId);
      if (!exported.canceled) setHistoryActionMessage('Markdown export saved.');
    } catch (error) {
      setHistoryActionError(errorMessage(error, 'Could not export the selected session.'));
    } finally {
      setHistoryActionBusy(false);
    }
  };

  const deleteSelectedSession = async () => {
    if (!selectedId || !window.confirm('Delete this saved interview answer?')) return;
    setHistoryActionBusy(true);
    setHistoryActionMessage(null);
    setHistoryActionError(null);
    try {
      setHistory(await window.interviewAPI.deleteSession(selectedId));
      setSelectedId(null);
      setResult(null);
      setHistoryActionMessage('History item deleted.');
    } catch (error) {
      setHistoryActionError(errorMessage(error, 'Could not delete the selected session.'));
    } finally {
      setHistoryActionBusy(false);
    }
  };

  const exportAllSessions = async () => {
    setHistoryActionBusy(true);
    setHistoryActionMessage(null);
    setHistoryActionError(null);
    try {
      const exported = await window.interviewAPI.exportAllSessions();
      if (!exported.canceled) setHistoryActionMessage('Complete history export saved.');
    } catch (error) {
      setHistoryActionError(errorMessage(error, 'Could not export the complete history.'));
    } finally {
      setHistoryActionBusy(false);
    }
  };

  const exportReviewSessions = async (ids: string[], format: SessionExportFormat) => {
    setHistoryActionBusy(true); setHistoryActionMessage(null); setHistoryActionError(null);
    try {
      const exported = await window.interviewAPI.exportSessions(ids, format);
      if (!exported.canceled) setHistoryActionMessage(`${format === 'json' ? 'JSON' : 'Markdown'} export saved.`);
    } catch (error) {
      setHistoryActionError(errorMessage(error, 'Could not export the selected sessions.'));
    } finally { setHistoryActionBusy(false); }
  };

  const exportAllReviewSessions = (format: SessionExportFormat) => exportReviewSessions(history.map((item) => item.id), format);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">A</span>
          <div>
            <h1>{APP_DISPLAY_NAME}</h1>
            <span>Practice with your own experience</span>
          </div>
        </div>
        <div className="header-statuses">
          {overlayClickThrough && <button className="overlay-toggle" type="button" onClick={() => void window.interviewAPI.setOverlayClickThrough(false).catch(error => setAnswerError(errorMessage(error, 'Could not restore overlay clicks.')))}>Restore overlay clicks</button>}
          <button className="overlay-toggle" type="button" onClick={() => void toggleOverlay()}>
            {overlayVisible ? 'Hide overlay' : 'Show overlay'} <kbd>Ctrl Shift O</kbd>
          </button>
          <div className="local-status"><i /> Local knowledge</div>
          <div className="local-status"><i /> Local speech-to-text</div>
          <div className={`local-status ${runtimeStatus?.openAIConfigured ? 'api-ready' : 'api-local'}`}>
            <i /> {runtimeStatus?.answerProvider === 'chatgpt-desktop' ? 'ChatGPT desktop · direct speaker speech' : runtimeStatus?.codexEnabled ? `Codex · ${runtimeStatus.codexModel} · ${runtimeStatus.codexFast ? 'Fast' : 'Standard'}` : runtimeStatus?.openAIConfigured ? `OpenAI fallback · ${runtimeStatus.openAIModel}` : 'AI fallback off'}
          </div>
        </div>
      </header>

      <main className="workspace">
        <UploadNotes notes={notes} loading={notesLoading} error={notesError} notice={notesNotice} onUpload={uploadNotes} />
        <section className="center-panel">
          <JobDescriptionPanel />
          <RealtimeVoicePanel onSaved={() => { void window.interviewAPI.getHistory().then(setHistory); }} />
          <details className="optional-tools"><summary>Legacy transcription and desktop voice tools</summary><AudioPanel
            transcript={transcript}
            detectedQuestion={detectedQuestion}
            onAssistModeChange={(enabled) => {
              if (enabled) {
                assistTranscriptRef.text = '';
                assistTranscriptRef.questions.clear();
                assistTranscriptRef.detected = [];
              } else if (assistTranscriptRef.text) {
                void window.interviewAPI.saveAssistSession({
                  transcript: assistTranscriptRef.text,
                  questions: assistTranscriptRef.detected,
                }).then(() => window.interviewAPI.getHistory()).then(setHistory).catch((error) => {
                  setAnswerError(errorMessage(error, 'Could not save the assist-mode transcript.'));
                });
              }
            }}
            onAssistChunk={processAssistChunk}
          /></details>
          {liveAnswer && <section className="suggestion-shell result-area" aria-label="Answer arriving">
            <div className="result-heading"><div><p className="eyebrow">Receiving answer</p><h2>{liveAnswer.question}</h2></div></div>
            <article className="answer-card"><AnswerBody answer={liveAnswer.answer} verbatim={false} /></article>
          </section>}
          {!liveAnswer && <SuggestionPanel result={result} loading={answerLoading} error={answerError} />}
          <p className="state-help" title={runtimeStatus?.captureProtection?.reason}>Screen-share protection: {runtimeStatus?.captureProtection?.active ? 'Verified active' : 'Unavailable / unverified'}</p>
          {runtimeStatus?.captureProtection?.reason && <p className="state-help">{runtimeStatus.captureProtection.reason}</p>}
          <QuestionInput loading={answerLoading} onSubmit={askQuestion} />
          <details className="optional-tools">
            <summary>Other tools</summary>
            <p>Manual screen text capture and semantic-search settings.</p>
            <KnowledgeSearchPanel />
            <ScreenshotPanel
              listSources={window.interviewAPI.listScreenCaptureSources}
              captureAndExtractText={window.interviewAPI.captureScreenAndExtractText}
              onCaptureComplete={processScreenCapture}
            />
          </details>
          <button className="review-toggle" type="button" onClick={() => setShowReview((current) => !current)}>
            {showReview ? 'Close practice history review' : 'Review saved practice sessions'}
          </button>
          {showReview && <SessionReviewPanel
              items={history}
              busy={historyActionBusy}
              message={historyActionMessage}
              error={historyActionError}
              onExportSelected={exportReviewSessions}
              onExportAll={exportAllReviewSessions}
              onReview={window.interviewAPI.reviewSession}
            />}
        </section>
        <HistoryPanel
          items={history}
          selectedId={selectedId}
          loading={historyLoading}
          actionBusy={historyActionBusy}
          actionMessage={historyActionMessage}
          actionError={historyActionError}
          onSelect={selectHistory}
          onExport={exportSelectedSession}
          onExportAll={exportAllSessions}
          onDelete={deleteSelectedSession}
        />
      </main>
    </div>
  );
}
