import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { OverlayState } from '../../shared/types';
import { AnswerBody } from './SuggestionPanel';
import { APP_DISPLAY_NAME } from '../../shared/branding';
import './OverlayView.css';

const emptyState: OverlayState = { visible: true, answer: '', generationMode: 'local', activity: 'idle', panelOpacity: 0.91 };
const compactLabels = { idle: 'Ready', listening: 'Listening', hearing: 'Hearing', transcribing: 'Transcribing', searching: 'Searching', codex: 'CLI answer', chatgpt: 'ChatGPT reply', screen: 'Reading screen', ready: 'Answer ready', error: 'Attention' };
const labels = {
  idle: 'Ready', listening: 'Listening for a question', hearing: 'Hearing speech',
  transcribing: 'Transcribing speech locally', searching: 'Searching local knowledge',
  codex: 'Getting answer from Codex CLI', chatgpt: 'Getting assistant reply', screen: 'Reading selected screen',
  ready: 'Answer ready', error: 'Needs attention',
};
export default function OverlayView() {
  const [state, setState] = useState<OverlayState>(emptyState);
  const [elapsed, setElapsed] = useState(0);
  const [modelLabel, setModelLabel] = useState('');
  const [changingAssistant, setChangingAssistant] = useState(false);
  const [sendingScreenshot, setSendingScreenshot] = useState(false);
  const [contextSummary, setContextSummary] = useState<{ sourceNames: string[]; hasJobDescription: boolean; truncated: boolean }>();
  const [contextJd, setContextJd] = useState('');
  const [contextMessage, setContextMessage] = useState('');
  const [contextBusy, setContextBusy] = useState(false);
  const readingGestureUntil = useRef(0);
  const refreshContext = async () => {
    const [summary, jd] = await Promise.all([window.interviewAPI.getRealtimeContextSummary(), window.interviewAPI.getJobDescription()]);
    setContextSummary(summary); setContextJd(jd);
  };
  useEffect(() => { void refreshContext().catch(() => setContextMessage('Could not read saved interview context.')); }, []);
  const resizeOrigin = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const shortcutModifier = navigator.platform.toLowerCase().includes('mac') ? '⌘+Option' : 'Ctrl+Alt';
  useEffect(() => {
    const unsubscribe = window.interviewAPI.onOverlayUpdate(setState);
    void window.interviewAPI.getOverlayState().then(setState);
    void window.interviewAPI.getRuntimeStatus().then((status) => setModelLabel(status.answerProvider === 'chatgpt-desktop' ? 'ChatGPT desktop' : `${status.codexModel} · ${status.codexFast ? 'Fast mode' : 'Standard mode'}`));
    return unsubscribe;
  }, []);
  useEffect(() => {
    const startedAt = Date.now(); setElapsed(0);
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [state.activity]);
  useEffect(() => {
    // Only controls intercept clicks while click-through is enabled.
    const controls = 'input, button, select, textarea, summary, a, [role=button], .overlay-info-panel';
    let last: boolean | undefined;
    const update = (target: Element | null) => {
      const interactive = Boolean(target?.closest(controls));
      if (last === interactive) return;
      last = interactive;
      void window.interviewAPI.setOverlayPointerInteractive(interactive).catch(() => undefined);
    };
    const move = (event: MouseEvent) => update(event.target instanceof Element ? event.target : null);
    const leave = () => update(null);
    window.addEventListener('mousemove', move);
    document.documentElement.addEventListener('mouseleave', leave);
    const hovered = document.querySelectorAll(':hover');
    update(hovered.length ? hovered[hovered.length - 1] : null);
    return () => { window.removeEventListener('mousemove', move); document.documentElement.removeEventListener('mouseleave', leave); };
  }, [state.clickThrough]);
  const activity = state.activity ?? 'idle';
  const busy = ['transcribing', 'searching', 'codex', 'chatgpt', 'screen'].includes(activity);
  const verbatim = state.generationMode === 'reference' || state.generationMode === 'source';
  const act = (operation: () => Promise<unknown>) => { void operation().catch((error: unknown) => setState((old) => ({ ...old, activity: 'error', activityDetail: error instanceof Error ? error.message : 'Action failed.' }))); };
  const toggleAssistant = () => {
    setChangingAssistant(true);
    act(async () => {
      try { await window.interviewAPI.setAssistantMode(!state.voiceActive); }
      finally { setChangingAssistant(false); }
    });
  };
  return (
    <main className="overlay-view" style={{ '--panel-opacity': state.panelOpacity ?? 0.91 } as CSSProperties}>
      <header className="overlay-header">
        <div className="overlay-toolbar">
          <strong className="overlay-brand" title={APP_DISPLAY_NAME}>{APP_DISPLAY_NAME}</strong>
          <div className={`overlay-status ${busy ? 'is-busy' : ''} ${activity === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite" title={state.activityDetail || labels[activity]}>
            <i /><strong>{state.assistTurn?.held ? 'Held' : (activity === 'codex' || activity === 'chatgpt') && state.streamingAnswer ? 'Receiving' : compactLabels[activity]}</strong>{busy && <span>{elapsed}s</span>}
          </div>
          <label className="overlay-opacity" title="Background opacity · 20%–95%"><span>Background</span><input aria-label="Answer background opacity" type="range" min="20" max="95" value={Math.round((state.panelOpacity ?? 0.91) * 100)} onChange={(event) => act(() => window.interviewAPI.setOverlayOpacity(Number(event.target.value) / 100))} /></label>
          <button className="overlay-watch" title={`Watch entire screen · ${shortcutModifier}+X`} aria-label="Watch screen" aria-pressed={state.monitor?.active ?? false} disabled={state.monitor?.active ?? false} onClick={() => act(window.interviewAPI.startScreenMonitoring)}><span aria-hidden="true">▣</span><span className="overlay-control-label">Watch</span></button>
          <button className="overlay-watch" title={`Stop watching; keep the current answer · ${shortcutModifier}+C`} aria-label="Stop watching screen" onClick={() => act(window.interviewAPI.stopScreenMonitoring)}><span aria-hidden="true">■</span><span className="overlay-control-label">Stop watch</span></button>
          <button title={`Pass answer and background clicks through; controls stay usable · ${shortcutModifier}+P`} aria-label="Toggle click-through" aria-pressed={state.clickThrough ?? false} onClick={() => act(() => window.interviewAPI.setOverlayClickThrough(!state.clickThrough))}>⇥</button>
          {state.assistTurn?.active && <button aria-label={state.assistTurn.held ? 'Listen for next question' : 'Hold answer'} title="Hold / resume answers; audio stays on · Ctrl+Alt+Space" aria-pressed={state.assistTurn.held} onClick={() => act(() => window.interviewAPI.setAssistAnswerHold(!state.assistTurn?.held))}>{state.assistTurn.held ? '▶' : 'Ⅱ'}</button>}
          <details className="overlay-info">
            <summary title="Activity, audio and screen-share details" aria-label="Activity, audio and screen-share details">ⓘ</summary>
            <div className="overlay-info-panel">
              <strong>{labels[activity]}</strong>
              {activity === 'codex' && modelLabel && <p className="overlay-detail">{modelLabel}</p>}
              {state.activityDetail && <p className="overlay-detail">{state.activityDetail}</p>}
              <p className="overlay-detail" title={state.captureProtection?.reason}>Screen-share protection: {state.captureProtection?.active ? 'Verified active' : 'Unavailable / unverified'}</p>
              {state.captureProtection?.reason && <p className="overlay-detail">{state.captureProtection.reason}</p>}
              <div className="overlay-indicators"><span>{state.voiceActive ? state.speaking ? 'Voice: speech detected' : 'Voice: listening' : 'Voice: off'}</span><span>{state.monitor?.active ? `Screen: ${state.monitor.sourceName} · 10s` : 'Screen: off'}</span></div>
              <p className="overlay-detail">{shortcutModifier}+X: Watch · {shortcutModifier}+C: Stop watch · {shortcutModifier}+Z: Send screenshot · {shortcutModifier}+H: Hide / restore both windows.</p>
              <p className="overlay-detail">Ctrl+Alt+←: Previous question. Ctrl+Alt+→: Next question / resume. {shortcutModifier}+P: toggle click-through. Answer text passes clicks through and cannot be selected. Controls stay usable; turn click-through off to scroll, drag or resize.</p>
            </div>
          </details>
          <button title={`Hide / restore both windows · ${shortcutModifier}+H`} aria-label="Hide app" onClick={() => act(window.interviewAPI.toggleAppVisibility)}>−</button>
          <button title="Hide floating window · Ctrl+Shift+O" aria-label="Hide floating window" onClick={() => act(window.interviewAPI.toggleOverlay)}>×</button>
        </div>
        <div className="overlay-question"><p>{state.question || 'Waiting for a question…'}</p></div>
        <div className="overlay-audio-row">
          <details className="overlay-info overlay-context" onToggle={event => {
            if (event.currentTarget.open) {
              act(() => window.interviewAPI.setOverlayClickThrough(false));
              event.currentTarget.querySelector('textarea')?.focus({ preventScroll: true });
            }
          }}>
            <summary aria-label="Interview context" title="Resume, job description and scenario rules">Context</summary>
            <div className="overlay-info-panel overlay-context-panel" role="region" aria-label="Interview context editor">
              <div className="overlay-context-heading"><strong>Interview context</strong><button aria-label="Close interview context" onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')}>Close</button></div>
              <p className="overlay-detail">{contextSummary?.sourceNames.length ? contextSummary.sourceNames.join(', ') : 'No resume/profile found.'} · JD {contextSummary?.hasJobDescription ? 'saved' : 'not set'}{contextSummary?.truncated ? ' · shortened to fit' : ''}</p>
              <p className="overlay-detail">Loaded at API voice Start. Changes apply next start. Resume/project evidence is distinct from JD requirements and hypothetical examples.</p>
              <button disabled={contextBusy} onClick={() => { setContextBusy(true); void window.interviewAPI.uploadNotes().then(async result => { if (result.canceled) return; await refreshContext(); setContextMessage([result.imported.length ? `${result.imported.length} file(s) ready for the next voice session.` : '', ...result.errors].filter(Boolean).join(' ')); }).catch(error => setContextMessage(error instanceof Error ? error.message : 'Import failed.')).finally(() => setContextBusy(false)); }}>Import resume/project · Word, PDF, TXT or MD</button>
              <p className="overlay-detail">Use a filename containing resume, CV, profile, experience or project so it is included as candidate evidence. General technical reference pages are excluded.</p>
              <label className="overlay-detail" htmlFor="overlay-job-description">Target job description</label>
              <textarea id="overlay-job-description" aria-label="Interview job description" value={contextJd} maxLength={24000} disabled={contextBusy} onChange={event => setContextJd(event.target.value)} rows={6} style={{ width: '100%', boxSizing: 'border-box', color: '#17241f', background: '#fff', resize: 'vertical' }} />
              <button disabled={contextBusy} onClick={() => { setContextBusy(true); void window.interviewAPI.saveJobDescription(contextJd).then(refreshContext).then(() => setContextMessage('JD saved. Stop and start voice to load the updated context.')).catch(error => setContextMessage(error instanceof Error ? error.message : 'Could not save JD.')).finally(() => setContextBusy(false)); }}>Save JD</button>
              <button disabled={contextBusy} onClick={() => { setContextBusy(true); void window.interviewAPI.saveJobDescription('').then(refreshContext).then(() => setContextMessage('JD cleared for the next session.')).catch(error => setContextMessage(error instanceof Error ? error.message : 'Could not clear JD.')).finally(() => setContextBusy(false)); }}>Clear JD</button>
              {state.realtimeVoiceActive && <p className="overlay-detail">Changes are saved for your next voice session. Stop and start voice to apply them.</p>}
              {contextMessage && <p className="overlay-detail" role="status">{contextMessage}</p>}
            </div>
          </details>
          <button aria-label="Send screenshot to ChatGPT" disabled={sendingScreenshot || activity === 'screen'} title={`Capture the whole primary display and attach it to the current ChatGPT chat · ${shortcutModifier}+Z`} onClick={() => { setSendingScreenshot(true); act(async () => { try { await window.interviewAPI.askScreenQuestion(); } finally { setSendingScreenshot(false); } }); }}>{sendingScreenshot ? 'Sending screen…' : `Screen · ${shortcutModifier}+Z`}</button>
          {!state.voiceMirrorActive && !state.assistTurn?.active && <button aria-label={state.realtimeVoiceActive ? 'Stop continuous API voice' : 'Start continuous API voice'} onClick={() => act(() => window.interviewAPI.requestRealtimeVoiceAction(state.realtimeVoiceActive ? 'stop' : 'start'))}>{state.realtimeVoiceActive ? 'API voice · Stop' : 'API voice · Start'}</button>}
          {state.voiceMirrorActive && <button aria-label="Stop Voice text mirror" onClick={() => act(() => window.interviewAPI.setVoiceMirror(false))}>Voice text · Stop</button>}
          {state.realtimeVoiceActive && <button aria-label={state.assistTurn?.held ? 'Resume live answers' : 'Keep current answer'} aria-pressed={state.assistTurn?.held ?? false} onClick={() => act(() => window.interviewAPI.setAssistAnswerHold(!state.assistTurn?.held))}>{state.assistTurn?.held ? 'Resume live answers' : 'Keep answer'}</button>}
          {state.pendingVoiceAnswer && <button aria-label="Show new answer" onClick={() => act(window.interviewAPI.nextQuestion)}>New answer ready · Show</button>}
          {!state.voiceMirrorActive && !state.realtimeVoiceActive && state.assistTurn?.active && <><span className={`overlay-mic ${state.voiceActive ? 'is-listening' : ''} ${state.speaking ? 'is-speaking' : ''}`} role="status" aria-live="polite">
            <svg aria-hidden="true" width="13" height="16" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="1" width="6" height="11" rx="3"/><path d="M2 8v2a6 6 0 0 0 12 0V8M8 16v3M5 19h6"/></svg>
            {state.voiceActive ? state.assistTurn?.held ? 'Audio active · answer held' : state.speaking ? 'Speech detected' : 'Listening' : 'Audio off · start assistant mode'}
          </span>
          <button className="overlay-assistant-toggle" aria-label={state.voiceActive ? 'Stop assistant mode' : 'Start assistant mode'} aria-pressed={state.voiceActive ?? false} disabled={changingAssistant} title="Start or stop audio using the source selected in the main window" onClick={toggleAssistant}>{changingAssistant ? 'Changing…' : state.voiceActive ? 'Assistant on · Stop' : 'Assistant off · Start'}</button>
          </>}{state.voiceMirrorActive && <span className="overlay-mic is-listening" role="status">ChatGPT text connected</span>}
          <button aria-label="Previous question" title="Previous saved question · Ctrl+Alt+Left Arrow" onClick={() => act(window.interviewAPI.previousQuestion)}>Previous · Ctrl+Alt+←</button>
          <button aria-label="Next question" title="Next saved question, or resume listening · Ctrl+Alt+Right Arrow" onClick={() => act(window.interviewAPI.nextQuestion)}>Next · Ctrl+Alt+→</button>
        </div>
        {state.realtimeVoiceNotice && <p className="overlay-detail" role="status">{state.realtimeVoiceNotice}</p>}
        {state.clickThrough && <p className="overlay-detail">Background clicks pass through · controls still work · {shortcutModifier}+P to drag or resize.</p>}
        {state.assistTurn?.pendingQuestion && <div className="overlay-pending"><span>Finishing question… {state.assistTurn.pendingQuestion}</span><button aria-label="Ignore proposed question" onClick={() => act(window.interviewAPI.dismissAssistQuestion)}>×</button></div>}
        {activity === 'error' && state.activityDetail && <p className="overlay-detail overlay-error-detail" role="alert">{state.activityDetail}</p>}
      </header>
      <div className="overlay-content" aria-label="Scrollable answers" tabIndex={0}
      onWheel={() => { readingGestureUntil.current = Date.now() + 1500; }}
      onPointerDown={() => { readingGestureUntil.current = Date.now() + 1500; }}
      onKeyDown={event => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'End', 'Home', ' '].includes(event.key)) readingGestureUntil.current = Date.now() + 1500; }}
      onScroll={event => {
        if (Date.now() < readingGestureUntil.current && state.realtimeVoiceActive && !state.assistTurn?.held && event.currentTarget.scrollTop > 24) act(() => window.interviewAPI.setAssistAnswerHold(true));
      }}>
      {state.streamingAnswer && <article className="overlay-answer" aria-label={activity === 'chatgpt' ? 'Answer arriving from ChatGPT' : 'Answer arriving from Codex'}><AnswerBody answer={state.streamingAnswer} verbatim={false} plainText={activity === 'chatgpt'} /></article>}
      {state.answer ? <article className="overlay-answer">
        {state.answerQuestion && state.answerQuestion !== state.question && <p className="overlay-previous">Previous answer · {state.answerQuestion}</p>}
        <AnswerBody answer={state.answer} verbatim={verbatim} plainText={state.generationMode === 'chatgpt'} />
        {state.relatedAnswers?.map((related, index) => <section className="related-answer" key={index}><AnswerBody answer={related.content} verbatim={true} /></section>)}
      </article> : !state.streamingAnswer && <div className="overlay-empty"><p>Your prepared answer and code will appear here. Start assistant mode, or click Watch to read your entire primary display.</p></div>}
      {state.previousVoiceAnswers?.filter(item => item.answer !== state.answer).map((item, index) => <article className="overlay-answer" aria-label="Previous voice answer" key={`${index}-${item.question}`}><p className="overlay-previous">Previous answer · {item.question}</p><AnswerBody answer={item.answer} verbatim={false} /></article>)}
      </div>
      <button className="overlay-resize-grip" aria-label="Resize overlay" title="Drag to resize the overlay"
        onPointerDown={event => {
          event.preventDefault();
          resizeOrigin.current = { x: event.screenX, y: event.screenY, width: window.innerWidth, height: window.innerHeight };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const origin = resizeOrigin.current;
          if (origin) act(() => window.interviewAPI.resizeOverlay(origin.width + event.screenX - origin.x, origin.height + event.screenY - origin.y));
        }}
        onPointerUp={event => { resizeOrigin.current = null; event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => { resizeOrigin.current = null; }}>↘</button>
    </main>
  );
}
