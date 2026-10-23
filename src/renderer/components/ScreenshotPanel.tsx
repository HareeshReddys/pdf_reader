import { useEffect, useRef, useState } from 'react';
import type { ScreenCaptureSource, ScreenOcrResult } from '../../shared/types';
import './ScreenshotPanel.css';

export type ScreenshotPanelProps = {
  listSources: () => Promise<ScreenCaptureSource[]>;
  captureAndExtractText: (sourceId: string) => Promise<ScreenOcrResult>;
  onCaptureComplete?: (result: ScreenOcrResult) => void | Promise<void>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Screen capture failed. Please try again.';
}

export default function ScreenshotPanel({
  listSources,
  captureAndExtractText,
  onCaptureComplete,
}: ScreenshotPanelProps) {
  const [sources, setSources] = useState<ScreenCaptureSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [result, setResult] = useState<ScreenOcrResult>();
  const [status, setStatus] = useState<'idle' | 'loading-sources' | 'capturing'>('idle');
  const [error, setError] = useState('');
  const [watching, setWatching] = useState(false);
  const lastImage = useRef('');
  const busyRef = useRef(false);
  useEffect(() => {
    void window.interviewAPI.getScreenMonitorState().then((state) => { setWatching(state.active); setSelectedSourceId(state.sourceId); });
    const unsubscribe = window.interviewAPI.onScreenMonitorUpdate((state) => { setWatching(state.active); setSelectedSourceId(state.sourceId); if (state.error) setError(state.error); });
    const unsubscribeAnalysis = window.interviewAPI.onScreenAnalysis(setResult);
    return () => { unsubscribe(); unsubscribeAnalysis(); };
  }, []);
  const selectSource = async (sourceId: string) => {
    try { const state = await window.interviewAPI.selectScreenMonitorSource(sourceId); setSelectedSourceId(state.sourceId); }
    catch (error) { setError(getErrorMessage(error)); }
  };
  const toggleWatching = async () => {
    try { const state = await (watching ? window.interviewAPI.stopScreenMonitoring() : window.interviewAPI.startScreenMonitoring()); setWatching(state.active); }
    catch (error) { setError(getErrorMessage(error)); }
  };

  const loadSources = async () => {
    setStatus('loading-sources');
    setError('');
    try {
      const availableSources = await listSources();
      setSources(availableSources);
      const sourceId = availableSources.some((source) => source.id === selectedSourceId) ? selectedSourceId : availableSources[0]?.id ?? '';
      if (sourceId) await selectSource(sourceId);
      if (availableSources.length === 0) {
        setError('No screens or windows are available. Check screen capture permission and try again.');
      }
    } catch (loadError) {
      setSources([]);
      setSelectedSourceId('');
      setError(getErrorMessage(loadError));
    } finally {
      setStatus('idle');
    }
  };

  const capture = async () => {
    if (!selectedSourceId || busyRef.current) return;
    busyRef.current = true;
    setStatus('capturing');
    setError('');
    try {
      const captureResult = await captureAndExtractText(selectedSourceId);
      setResult(captureResult);
      if (lastImage.current !== captureResult.imageDataUrl) {
        lastImage.current = captureResult.imageDataUrl;
        await onCaptureComplete?.(captureResult);
      }
    } catch (captureError) {
      setError(getErrorMessage(captureError));
      setWatching(false);
    } finally {
      busyRef.current = false;
      setStatus('idle');
    }
  };
  const busy = status !== 'idle';
  const selectedSource = sources.find((source) => source.id === selectedSourceId);

  return (
    <section className="screenshot-panel" aria-labelledby="screenshot-panel-title">
      <div className="screenshot-panel__heading">
        <div>
          <p className="screenshot-panel__eyebrow">Screen context</p>
          <h2 id="screenshot-panel-title">Coding answers from your screen</h2>
        </div>
        <span className={`screenshot-panel__status screenshot-panel__status--${status}`} role="status" aria-live="polite">
          <span aria-hidden="true" />
          {status === 'loading-sources' && 'Finding sources'}
          {status === 'capturing' && 'Preparing screen answer'}
          {status === 'idle' && (watching ? 'Watching selected screen' : 'Manual capture')}
        </span>
      </div>

      <p className="screenshot-panel__help">
        Watch automatically captures your entire primary display every 10 seconds. No source selection is needed. Screenshots are sent to Codex for answers. On multiple displays, Watch uses the primary display.
      </p>

      <div className="screenshot-panel__controls">
        <button type="button" className="screenshot-panel__button screenshot-panel__button--secondary" onClick={() => void loadSources()} disabled={busy}>
          {sources.length > 0 ? 'Refresh sources' : 'Choose screen or window'}
        </button>
        <label>
          <span>Capture source</span>
          <select
            value={selectedSourceId}
            onChange={(event) => void selectSource(event.target.value)}
            disabled={busy || watching || sources.length === 0}
          >
            {sources.length === 0 && <option value="">Choose a source first</option>}
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.kind === 'screen' ? 'Screen' : 'Window'}: {source.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="screenshot-panel__button screenshot-panel__button--capture" onClick={() => void capture()} disabled={busy || !selectedSourceId}>
          {status === 'capturing' ? 'Preparing answer…' : 'Capture screen'}
        </button>
      </div>

      <button type="button" className="screenshot-panel__button" onClick={() => void toggleWatching()}>{watching ? 'Stop watching screen' : 'Watch entire screen'}</button>
      <p className="screenshot-panel__help">Windows: Ctrl+Alt+X watches, Ctrl+Alt+C stops, Ctrl+Alt+Z attaches a screenshot to ChatGPT, Ctrl+Alt+H hides/restores both windows. Mac: Command+Option+X / C / Z / H (Control+Option also works). Stop watching keeps the current answer while you write; click Watch to resume. Monitoring uses the latest spoken question as context.</p>

      {error && (
        <div className="screenshot-panel__error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      <div className="screenshot-panel__output-grid">
        <article className="screenshot-panel__preview">
          <h3>Preview</h3>
          {(result?.imageDataUrl || selectedSource?.thumbnailDataUrl) ? (
            <img
              src={result?.imageDataUrl || selectedSource?.thumbnailDataUrl}
              alt={result ? `Captured ${result.sourceName}` : `Preview of ${selectedSource?.name ?? 'selected source'}`}
            />
          ) : (
            <p className="screenshot-panel__placeholder">Choose a screen or window to see a preview.</p>
          )}
        </article>
        <article className="screenshot-panel__text">
          <h3>Screen context</h3>
          <p className={result?.extractedText ? '' : 'screenshot-panel__placeholder'}>
            {result?.extractedText || (result ? 'Screenshot sent directly to Codex for visual understanding.' : 'The selected screenshot will be used to understand the task and its code.')}
          </p>
        </article>
      </div>
    </section>
  );
}


