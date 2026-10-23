import { useEffect, useRef, useState } from 'react';
import { useAssistRecorder, type AudioRecordingResult } from '../hooks/useAssistRecorder';
import type { AssistTurnState, CallAudioSource } from '../../shared/types';
import './AudioPanel.css';

export type AudioPanelProps = {
  transcript?: string;
  detectedQuestion?: string;
  onAssistModeChange?: (enabled: boolean) => void;
  onAssistChunk: (recording: AudioRecordingResult) => void | Promise<void>;
};

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

export default function AudioPanel({ transcript = '', detectedQuestion = '', onAssistModeChange, onAssistChunk }: AudioPanelProps) {

  const [callSources, setCallSources] = useState<CallAudioSource[]>([]);
  const [directChat, setDirectChat] = useState(false);
  const [turn, setTurn] = useState<AssistTurnState>({ active: false, held: false });
  const [deviceId, setDeviceId] = useState('');
  const [sourceError, setSourceError] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const changingMode = useRef(false);
  const sourceDeviceId = (source: CallAudioSource) => source.id === 'windows-loopback' ? 'system:windows-loopback' : `pulse:${source.id}`;
  const deviceLabel = callSources.find(source => sourceDeviceId(source) === deviceId)?.name || 'Speaker output';
  const isSystemAudio = deviceId.startsWith('pulse:') || deviceId === 'system:windows-loopback';
  const assist = useAssistRecorder({
    onChunk: onAssistChunk,
    deviceId,
    deviceLabel,
    audioSource: 'system',
    endpointPauseMs: 1400,
  });

  const refreshDevices = async () => {
    try {
      setSourceError('');
      const outputs = await window.interviewAPI.listCallAudioSources();
      setCallSources(outputs);
      setDeviceId(current => outputs.some(source => sourceDeviceId(source) === current) ? current : outputs[0] ? sourceDeviceId(outputs[0]) : '');
      if (!outputs.length) setSourceError('Speaker-output capture is unavailable on this platform. Microphone fallback is disabled.');
    } catch (reason) {
      setSourceError(reason instanceof Error ? reason.message : 'Speaker outputs could not be listed.');
    }
  };
  useEffect(() => {
    void window.interviewAPI.getRuntimeStatus().then(status => setDirectChat(status.answerProvider === 'chatgpt-desktop'));
    void window.interviewAPI.getAssistTurnState().then(setTurn);
    return window.interviewAPI.onAssistTurnUpdate((update) => setTurn(update.state));
  }, []);

  useEffect(() => {
    void refreshDevices();
    const changed = () => void refreshDevices();
    navigator.mediaDevices.addEventListener('devicechange', changed);
    return () => navigator.mediaDevices.removeEventListener('devicechange', changed);
  }, []);
  useEffect(() => {
    void window.interviewAPI.reportVoiceActivity({ active: assist.active, speaking: assist.voiceDetected, error: assist.error ?? undefined }).catch(() => undefined);
  }, [assist.active, assist.voiceDetected, assist.error]);
  const action = async (operation: () => Promise<unknown>) => { try { await operation(); } catch (reason) { setSourceError(reason instanceof Error ? reason.message : 'Assistant action failed.'); } };
  const changeMode = async (enabled: boolean) => {
    if (changingMode.current) throw new Error('Assistant mode is already changing.');
    changingMode.current = true; setTransitioning(true);
    try {
      if (enabled) {
        if (!isSystemAudio) throw new Error('Choose speaker output. Microphone fallback is disabled.');
        await window.interviewAPI.configureAssistTurn(true);
        if (!await assist.start()) {
          await window.interviewAPI.configureAssistTurn(false);
          throw new Error('Could not start audio. Check speaker-output capture in the main window. Microphone fallback is disabled.');
        }
        onAssistModeChange?.(true);
      } else {
        await window.interviewAPI.configureAssistTurn(false);
        await assist.stop();
        onAssistModeChange?.(false);
      }
    } finally { changingMode.current = false; setTransitioning(false); }
  };
  const changeModeRef = useRef(changeMode);
  changeModeRef.current = changeMode;
  useEffect(() => window.interviewAPI.onAssistantModeRequest(enabled => changeModeRef.current(enabled)), []);
  const start = () => action(() => changeMode(true));
  const stop = () => action(() => changeMode(false));

  return (
    <section className="audio-panel" aria-labelledby="audio-panel-title">
      <div className="audio-panel__heading">
        <div><p className="audio-panel__eyebrow">Local voice assistant</p><h2 id="audio-panel-title">Assistant mode</h2></div>
        <div className={`audio-panel__status ${assist.active ? 'audio-panel__status--recording' : ''}`} role="status" aria-live="polite">
          <span aria-hidden="true" /> {assist.voiceDetected ? 'Speech detected' : assist.processing ? 'Transcribing locally' : assist.active ? 'Listening' : 'Ready'}
        </div>
      </div>
      {sourceError && <div className="audio-panel__error" role="alert"><span>{sourceError}</span><button type="button" onClick={() => setSourceError('')}>Dismiss</button></div>}
      <p className="audio-panel__description">{directChat ? 'Speaker output goes directly to the open ChatGPT conversation after each speech pause. Question detection is off. Keep ChatGPT in Chat mode with Instant selected and its editor empty.' : 'Assistant mode listens to speaker output only. Your microphone is not opened. Detected questions are answered after a brief speech pause.'}</p>
      <div className="audio-panel__source-row">
        <label><span>Audio source</span><select value={deviceId} disabled={assist.active} onChange={(event) => setDeviceId(event.target.value)}>{!callSources.length && <option value="">No speaker output available</option>}{callSources.map(source => <option key={source.id} value={sourceDeviceId(source)}>{source.name} — Output only</option>)}</select></label>
        <button type="button" disabled={assist.active} onClick={() => void refreshDevices()}>Find audio sources</button>
        <strong className={isSystemAudio ? 'is-system' : ''}>{isSystemAudio ? 'Interviewer / call audio' : 'No output selected'}</strong>
      </div>
      <p className="audio-panel__guard-note">{isSystemAudio
        ? 'Only the selected speaker/headphone output is captured. Disable microphone playback/loopback in your sound settings; other audio on that output is also captured.'
        : 'Select speaker output to start. The microphone is never used as a fallback.'}</p>
      <div className="audio-panel__assist audio-panel__assist--primary">
        <span><strong>{formatDuration(assist.elapsedMs)}</strong><small>Local speech detection waits for a brief pause, then transcribes the completed utterance.</small></span>
        <div className="audio-panel__assist-controls">
          {!assist.active ? <button type="button" disabled={transitioning} onClick={() => void start()}>Start assistant mode</button> : <button className="is-stop" type="button" disabled={transitioning} onClick={() => void stop()}>Stop assistant mode</button>}
        </div>
      </div>
      {assist.active && <div className="audio-panel__turn-controls">
        <button aria-pressed={turn.held} onClick={() => void action(() => window.interviewAPI.setAssistAnswerHold(!turn.held))}>{turn.held ? 'Listen for next question' : 'I’m answering · hold answer'}</button>
        <button onClick={() => void action(window.interviewAPI.previousQuestion)}>Previous question · Shift+←</button>
        <button onClick={() => void action(window.interviewAPI.nextQuestion)}>Next question · Shift+→</button>
        <span>{turn.held ? 'Answer held · Shift+→ to resume' : 'Questions auto-answer · Ctrl+Alt+Space holds the answer'}</span>
      </div>}
      {turn.pendingQuestion && <div className="audio-panel__pending"><strong>Question finishing · answers automatically</strong><p>{turn.pendingQuestion}</p><button onClick={() => void action(window.interviewAPI.dismissAssistQuestion)}>Ignore</button></div>}
      {assist.active && <div className="audio-panel__recording-banner" role="status"><i /> {isSystemAudio ? 'Call output is active' : 'No speaker output selected'} — click Stop assistant mode to end capture</div>}
      {assist.processing && <div className="audio-panel__processing" role="status">The latest audio section is being transcribed on this computer…</div>}
      {assist.error && <div className="audio-panel__error" role="alert"><span>{assist.error}</span><button type="button" onClick={assist.dismissError}>Dismiss</button></div>}
      <div className="audio-panel__output-grid">
        <article className="audio-panel__output"><h3>Live transcript</h3><p className={transcript ? '' : 'audio-panel__placeholder'}>{transcript || 'Your transcript will appear after the first audio section.'}</p></article>
        <article className="audio-panel__output"><h3>{directChat ? 'Latest forwarded speech' : 'Latest detected question'}</h3><p className={detectedQuestion ? '' : 'audio-panel__placeholder'}>{detectedQuestion || (directChat ? 'Waiting for speaker audio.' : 'Waiting for an interview question.')}</p></article>
      </div>
    </section>
  );
}
