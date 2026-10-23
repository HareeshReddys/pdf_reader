import { useEffect, useRef, useState } from 'react';
import { RealtimeTranscript } from '../../shared/realtimeTranscript';
import { isInterviewRequest } from '../../shared/realtimeTurnFilter';
import { RealtimeQuestionBuffer } from '../../shared/realtimeQuestionBuffer';
import { VOICE_RENEW_AFTER_MS, VOICE_RENEW_RETRY_MS, voiceRenewalContext } from '../../shared/realtimeRenewal';
import type { ScreenCaptureSource } from '../../shared/types';
import './RealtimeVoicePanel.css';

type Connection = { pc: RTCPeerConnection; stream: MediaStream; audio: HTMLAudioElement; channel: RTCDataChannel; id?: string; parser: RealtimeTranscript; timer?: ReturnType<typeof setTimeout>; renewalTimer?: ReturnType<typeof setInterval>; cancelRenewal?: () => void; lastImage?: string; handoverBusy?: boolean };
export default function RealtimeVoicePanel({ onSaved }: { onSaved: () => void }) {
  const connection = useRef<Connection>();
  const generation = useRef(0);
  const starting = useRef(false);
  const [status, setStatus] = useState('Stopped');
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [inputs, setInputs] = useState<MediaDeviceInfo[]>([]);
  const [input, setInput] = useState('');
  const [sources, setSources] = useState<ScreenCaptureSource[]>([]);
  const [source, setSource] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const imageInFlight = useRef(false);
  const pendingImage = useRef<{ id: string; image: string; timer: ReturnType<typeof setTimeout> }>();
  const showError = (message: string) => { setError(message); void window.interviewAPI.reportVoiceActivity({ active: Boolean(connection.current), speaking: false, error: message }).catch(() => undefined); };
  const stop = () => {
    ++generation.current;
    starting.current = false;
    const current = connection.current; connection.current = undefined;
    if (pendingImage.current) clearTimeout(pendingImage.current.timer);
    pendingImage.current = undefined;
    imageInFlight.current = false;
    if (current) {
      clearTimeout(current.timer);
      clearInterval(current.renewalTimer); current.cancelRenewal?.();
      current.channel.onclose = null; current.pc.onconnectionstatechange = null;
      current.stream.getTracks().forEach(track => { track.onended = null; });
      current.stream.getTracks().forEach(track => track.stop());
      current.channel.close(); current.pc.close(); current.audio.pause(); current.audio.srcObject = null;
    }
    void window.interviewAPI.stopRealtimeVoice().catch(() => undefined);
    setActive(false); setBusy(false); setMuted(false); setImageBusy(false); setImagePreview(''); setStatus('Stopped');
  };
  useEffect(() => () => { stop(); }, []);
  const refreshDevices = async () => {
    try {
      setInputs((await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'audioinput'));
      setSources(await window.interviewAPI.listScreenCaptureSources(false));
    } catch (problem) { setError(problem instanceof Error ? problem.message : 'Could not list devices.'); }
  };
  const start = async () => {
    if (connection.current || starting.current) return;
    starting.current = true;
    const epoch = ++generation.current;
    setBusy(true); setError(''); setQuestion(''); setAnswer(''); setStatus('Connecting…');
    let stream: MediaStream | undefined;
    try {
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'audioinput');
      const selected = input ? devices.find(device => device.deviceId === input) : devices.find(device => /^Voicemeeter (Out B1|Output) \(/i.test(device.label));
      if (!selected) throw new Error('Speaker-audio input was not found. Refresh inputs and choose your virtual audio channel. The physical microphone will not be opened automatically.');
      stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: selected.deviceId }, echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
      if (generation.current !== epoch) { stream.getTracks().forEach(track => track.stop()); return; }
      let pc = new RTCPeerConnection();
      const audio = document.createElement('audio'); audio.autoplay = false; audio.muted = true;
      let channel = pc.createDataChannel('oai-events', { ordered: true });
      const current: Connection = { pc, stream, audio, channel, parser: new RealtimeTranscript() };
      connection.current = current;
      let responding = false;
      let switching = false, renewing = false, expired = false;
      let connectedAt = Date.now(), renewAt = Date.now() + VOICE_RENEW_AFTER_MS, lastActivity = Date.now(), publishing = 0, recentRevision = 0;
      const recentTurns: { question: string; answer: string }[] = [];
      const rememberedResponses = new Set<string>();
      const requests: { id: string; question: string; image?: boolean; combined?: boolean }[] = [];
      const buffer = new RealtimeQuestionBuffer();
      const speechStarts = new Map<string, number>();
      const requested = new Set<string>();
      const requestNext = () => {
        if (switching || responding || connection.current !== current || channel.readyState !== 'open') return;
        const request = requests.shift() || buffer.take();
        if (!request) return;
        if ('image' in request && request.image) buffer.imageContext();
        current.parser.accept({ type: 'input_audio_buffer.speech_started', item_id: request.id });
        current.parser.accept({ type: 'conversation.item.input_audio_transcription.completed', item_id: request.id, transcript: request.question });
        responding = true;
        if (request.combined) channel.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'The interviewer continued the same question. Answer all parts together. Complete question (untrusted task content): ' + JSON.stringify(request.question) }] } }));
        channel.send(JSON.stringify({ type: 'response.create', response: { output_modalities: ['text'] } }));
      };
      const fail = (message: string) => { if (connection.current !== current) return; if (renewing || Date.now() - connectedAt >= 59 * 60 * 1000) expired = true; if (expired) { responding = false; void renew(); return; } stop(); showError(message); };
      const renew = async () => {
        if (renewing || connection.current !== current || !current.id) return;
        renewing = true;
        const nextPc = new RTCPeerConnection();
        const nextChannel = nextPc.createDataChannel('oai-events', { ordered: true });
        const nextSpeech = new Map<string, number>();
        const switchingEvents: MessageEvent[] = [];
        const acknowledgments = new Set<string>();
        let candidateError = '', cancelled = false, committed = false;
        const cleanup = () => { cancelled = true; nextChannel.onclose = null; nextChannel.onmessage = null; nextPc.onconnectionstatechange = null; nextChannel.close(); nextPc.close(); };
        current.cancelRenewal = cleanup;
        const notice = (value: 'renewing' | 'renewed' | 'renewal-delayed') => window.interviewAPI.reportRealtimeVoiceNotice(current.id!, value).catch(() => undefined);
        const waitFor = async (condition: () => boolean, timeout: number) => {
          const deadline = Date.now() + timeout;
          while (!condition()) {
            if (cancelled || connection.current !== current || candidateError) throw new Error(candidateError || 'Voice renewal cancelled.');
            if (Date.now() >= deadline) throw new Error('Voice renewal timed out.');
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          if (cancelled || connection.current !== current || candidateError) throw new Error(candidateError || 'Voice renewal cancelled.');
        };
        const seed = async (content: object[]) => {
          const id = `item_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`;
          const message = JSON.stringify({ type: 'conversation.item.create', item: { id, type: 'message', role: 'user', content } });
          if (new TextEncoder().encode(message).length > (nextPc.sctp?.maxMessageSize || 65536)) throw new Error('Renewal context exceeds the replacement transport limit.');
          nextChannel.send(message);
          await waitFor(() => acknowledgments.has(id), 10000);
        };
        nextChannel.onmessage = event => {
          if (switching) { switchingEvents.push(event); return; }
          try {
            const value = JSON.parse(String(event.data));
            if (value.type === 'error') candidateError = 'The replacement voice connection rejected its context.';
            if (value.type === 'conversation.item.added' || value.type === 'conversation.item.done') acknowledgments.add(value.item?.id);
            if (value.type === 'input_audio_buffer.speech_started') nextSpeech.set(value.item_id, Date.now());
            if (value.type === 'conversation.item.input_audio_transcription.completed' || value.type === 'conversation.item.input_audio_transcription.failed') {
              nextSpeech.delete(value.item_id);
              nextChannel.send(JSON.stringify({ type: 'conversation.item.delete', item_id: value.item_id }));
            }
          } catch { /* Unrelated replacement events are not interviewer requests. */ }
        };
        nextChannel.onclose = () => { candidateError = 'Replacement voice connection closed.'; };
        nextPc.onconnectionstatechange = () => { if (nextPc.connectionState === 'failed' || nextPc.connectionState === 'closed') candidateError = 'Replacement voice connection failed.'; };
        nextPc.ontrack = () => { audio.muted = true; };
        try {
          await notice('renewing');
          // Reuse the already selected track. Never reopen an input during renewal.
          current.stream.getTracks().forEach(track => nextPc.addTrack(track, current.stream));
          const offer = await nextPc.createOffer(); await nextPc.setLocalDescription(offer);
          const prepared = await window.interviewAPI.prepareRealtimeRenewal(current.id, offer.sdp!);
          if (cancelled || connection.current !== current) throw new Error('Voice renewal cancelled.');
          await nextPc.setRemoteDescription({ type: 'answer', sdp: prepared.sdp });
          await waitFor(() => nextChannel.readyState === 'open' && nextPc.connectionState === 'connected', 20000);
          const quiet = () => !responding && publishing === 0 && !speechStarts.size && !nextSpeech.size && !requests.length && !buffer.hasPending && !imageInFlight.current && Date.now() - lastActivity >= 1000;
          let seededTurns = -1, seededImage: string | undefined;
          do {
            await waitFor(() => expired || quiet(), 120000);
            if (seededTurns !== recentRevision) { const revision = recentRevision; await seed([{ type: 'input_text', text: voiceRenewalContext(recentTurns) }]); seededTurns = revision; }
            if (current.lastImage && seededImage !== current.lastImage) {
              await seed([{ type: 'input_image', image_url: current.lastImage }, { type: 'input_text', text: 'Retained, previously confirmed screenshot context. Do not answer now; use it for later image follow-ups.' }]);
              seededImage = current.lastImage;
            }
          } while (!expired && (!quiet() || seededTurns !== recentRevision || seededImage !== current.lastImage));
          switching = true; current.handoverBusy = true;
          await window.interviewAPI.commitRealtimeRenewal(current.id, prepared.token);
          if (cancelled || connection.current !== current) throw new Error('Voice renewal cancelled.');
          const oldPc = pc, oldChannel = channel;
          oldChannel.onmessage = null; oldChannel.onclose = null; oldPc.onconnectionstatechange = null;
          pc = nextPc; channel = nextChannel; current.pc = pc; current.channel = channel; current.parser = new RealtimeTranscript();
          channel.onmessage = onMessage; channel.onclose = () => fail('Voice session closed. Start again to reconnect.');
          pc.onconnectionstatechange = onConnectionState;
          speechStarts.clear(); nextSpeech.forEach((at, id) => speechStarts.set(id, at));
          switching = false; current.handoverBusy = false; expired = false; committed = true; current.cancelRenewal = undefined;
          clearTimeout(current.timer); connectedAt = Date.now(); renewAt = Date.now() + VOICE_RENEW_AFTER_MS;
          oldChannel.close(); oldPc.close();
          for (const event of switchingEvents) onMessage(event);
          await notice('renewed'); setStatus('Listening'); setError(''); requestNext();
        } catch {
          switching = false; current.handoverBusy = false;
          if (!committed) cleanup();
          if (connection.current === current) await window.interviewAPI.cancelRealtimeRenewal(current.id!).catch(() => undefined);
          if (connection.current === current) {
            renewAt = Date.now() + VOICE_RENEW_RETRY_MS;
            if (expired) { expired = false; stop(); showError('Automatic voice renewal failed after expiry. Check the connection or API credits, then Start again. Your answers are saved.'); }
            else { await notice('renewal-delayed'); requestNext(); }
          }
        } finally { renewing = false; if (current.cancelRenewal === cleanup) current.cancelRenewal = undefined; }
      };
      stream.getTracks().forEach(track => { pc.addTrack(track, stream!); track.onended = () => { if (connection.current === current) { stop(); showError('Audio input ended. Start voice again to reconnect.'); } }; });
      // This flow is audio input -> text output. Never play a remote audio track.
      pc.ontrack = () => { audio.muted = true; };
      const onConnectionState = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') fail('Voice connection ended. Start again to reconnect.');
        if (pc.connectionState === 'disconnected') { setStatus('Connection interrupted…'); current.timer = setTimeout(() => fail('Voice disconnected. Start again to reconnect.'), 10000); }
        if (pc.connectionState === 'connected') { clearTimeout(current.timer); setStatus('Listening'); }
      };
      pc.onconnectionstatechange = onConnectionState;
      channel.onopen = () => { if (connection.current === current) { starting.current = false; setActive(true); setBusy(false); setStatus('Listening'); clearTimeout(current.timer); } };
      channel.onclose = () => fail('Voice session closed. Start again to reconnect.');
      const onMessage = (event: MessageEvent) => {
        if (connection.current !== current || !current.id) return;
        if (switching) return;
        try {
          const value = JSON.parse(String(event.data));
          if (value.type === 'error' || value.type === 'conversation.item.input_audio_transcription.failed' || (value.type === 'response.done' && value.response?.status === 'failed')) {
            const detail = value.error || value.response?.status_details?.error;
            if (detail?.code === 'session_expired') { expired = true; responding = false; speechStarts.clear(); void renew(); return; }
            const message = typeof detail?.message === 'string' ? detail.message.replace(/data:image\/[^\s"']+/g, '[image]').replace(/sk-[A-Za-z0-9_-]+/g, '[redacted]').slice(0, 350) : 'Check credits, model access, and connection.';
            fail(`Voice service: ${message}`); return;
          }
          if (value.type === 'input_audio_buffer.speech_started') { lastActivity = Date.now(); speechStarts.set(value.item_id, Date.now()); if (speechStarts.size > 200) speechStarts.delete(speechStarts.keys().next().value!); setStatus('Hearing you'); }
          if (value.type === 'input_audio_buffer.speech_stopped') setStatus('Thinking…');
          if (value.type === 'output_audio_buffer.started') setStatus('Speaking');
          if (value.type === 'output_audio_buffer.stopped') setStatus('Listening');
          if ((value.type === 'conversation.item.added' || value.type === 'conversation.item.done') && value.item?.id === pendingImage.current?.id) {
            const imageId = pendingImage.current!.id;
            current.lastImage = pendingImage.current!.image;
            clearTimeout(pendingImage.current!.timer); pendingImage.current = undefined; imageInFlight.current = false; setImageBusy(false); setStatus('Screenshot received. Answer requested.');
            void window.interviewAPI.reportRealtimeVoiceNotice(current.id, 'received').catch(() => undefined);
            requests.push({ id: imageId, question: 'Analyze the submitted screenshot', image: true });
            requestNext();
          }
          if (value.type === 'input_audio_buffer.speech_started') return;
          if (value.type === 'conversation.item.input_audio_transcription.completed') {
            lastActivity = Date.now();
            if (requested.has(value.item_id)) return;
            requested.add(value.item_id);
            if (requested.size > 200) requested.delete(requested.values().next().value!);
            const startedAt = speechStarts.get(value.item_id) ?? Date.now();
            speechStarts.delete(value.item_id);
            if (!isInterviewRequest(value.transcript || '', buffer.hasContext, value.logprobs)) {
              channel.send(JSON.stringify({ type: 'conversation.item.delete', item_id: value.item_id }));
              setStatus(responding ? 'Answering' : 'Listening');
              return;
            }
            buffer.add(value.item_id, value.transcript, startedAt);
            requestNext();
            return;
          }
          const turn = current.parser.accept(value);
          if (turn) {
            setQuestion(turn.question); setAnswer(turn.answer);
            publishing++;
            void window.interviewAPI.publishRealtimeVoice(current.id, turn).then(() => { if (turn.complete && !turn.interrupted && !rememberedResponses.has(turn.responseId)) { rememberedResponses.add(turn.responseId); if (rememberedResponses.size > 200) rememberedResponses.delete(rememberedResponses.values().next().value!); recentTurns.push({ question: turn.question, answer: turn.answer }); recentRevision++; if (recentTurns.length > 20) recentTurns.shift(); onSaved(); } }).catch(problem => { if (connection.current === current) setError(problem instanceof Error ? problem.message : 'Could not publish voice text.'); }).finally(() => { publishing--; });
          }
          if (value.type === 'response.done') { buffer.answerCompleted(Date.now()); responding = false; requestNext(); }
        } catch { /* Ignore malformed or unrelated events. */ }
      };
      channel.onmessage = onMessage;
      const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
      if (generation.current !== epoch) return;
      const result = await window.interviewAPI.connectRealtimeVoice(offer.sdp!);
      if (generation.current !== epoch) return;
      current.id = result.id;
      await pc.setRemoteDescription({ type: 'answer', sdp: result.sdp });
      if (pc.connectionState !== 'connected' || channel.readyState !== 'open') current.timer = setTimeout(() => fail('Voice did not connect in time. Start again.'), 20000);
      current.renewalTimer = setInterval(() => { if (connection.current === current && Date.now() >= renewAt) void renew(); }, 1000);
      void refreshDevices();
    } catch (problem) {
      stream?.getTracks().forEach(track => track.stop());
      if (generation.current === epoch) { stop(); showError(problem instanceof Error ? problem.message : 'Voice could not start.'); }
    }
  };
  const sendScreenshot = async (requestedSource?: string) => {
    const current = connection.current;
    const chosenSource = requestedSource || source;
    if (!current?.id || current.handoverBusy || current.channel.readyState !== 'open' || !chosenSource || imageInFlight.current) return;
    imageInFlight.current = true;
    setImageBusy(true); setError('');
    try {
      const limit = current.pc.sctp?.maxMessageSize || 65536;
      const image = await window.interviewAPI.captureRealtimeImage(current.id, chosenSource, limit);
      if (connection.current !== current) return;
      const id = `item_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`;
      const message = JSON.stringify({ type: 'conversation.item.create', item: { id, type: 'message', role: 'user', content: [{ type: 'input_image', image_url: image }, { type: 'input_text', text: 'Answer the visible question in this screenshot now. If there is no explicit question, explain its relevant content; ask for clarification if unreadable.' }] } });
      if (new TextEncoder().encode(message).length > limit || current.channel.bufferedAmount > 65536) throw new Error('Image cannot be sent right now. Choose a smaller window or retry when the connection is clear.');
      pendingImage.current = { id, image, timer: setTimeout(() => { pendingImage.current = undefined; imageInFlight.current = false; setImageBusy(false); showError('Screenshot receipt was not confirmed. No automatic resend was attempted.'); if (current.id) void window.interviewAPI.reportRealtimeVoiceNotice(current.id, 'unconfirmed').catch(() => undefined); }, 15000) };
      void window.interviewAPI.reportRealtimeVoiceNotice(current.id, 'sending').catch(() => undefined);
      current.channel.send(message);
      setImagePreview(image);
      setStatus('Sending screenshot…');
    } catch (problem) { if (pendingImage.current) clearTimeout(pendingImage.current.timer); pendingImage.current = undefined; imageInFlight.current = false; setImageBusy(false); showError(problem instanceof Error ? problem.message : 'Screenshot failed.'); }
  };
  useEffect(() => window.interviewAPI.onRealtimeVoiceAction(action => {
    if (action === 'start') { void start(); return; }
    if (action === 'stop') { stop(); return; }
    void (async () => {
      if (imageBusy || pendingImage.current) return;
      const available = await window.interviewAPI.listScreenCaptureSources(false);
      const selected = source || available.find(item => item.id.startsWith('screen:'))?.id;
      if (!selected) { setError('Select a screenshot source in the main window first.'); return; }
      await sendScreenshot(selected);
    })().catch(() => setError('Could not share the selected screen.'));
  }), [source, imageBusy, input, busy]);
  return <section className="audio-panel realtime-voice-panel" aria-label="Continuous API voice">
    <h2>Continuous voice</h2>
    <p>Speaker audio goes to OpenAI while this session is active. Questions and replies appear as text; replies are never played through speakers. API usage is billed separately.</p>
    <div role="status">{status}</div>
    <div className="button-row">
      <button type="button" onClick={() => void refreshDevices()}>Refresh inputs and screens</button>
      <select aria-label="Voice audio input" disabled={busy || active} value={input} onChange={event => setInput(event.target.value)}><option value="">Speaker audio · Voicemeeter B1 (automatic)</option>{inputs.map(device => <option key={device.deviceId} value={device.deviceId}>{device.label || 'Audio input'}</option>)}</select>
      <button type="button" disabled={busy || active} onClick={() => void start()}>Start continuous voice</button>
      <button type="button" disabled={!busy && !active} onClick={stop}>Stop voice</button>
      <button type="button" disabled={!active} onClick={() => { const next = !muted; connection.current?.stream.getAudioTracks().forEach(track => { track.enabled = !next; }); setMuted(next); }}>{muted ? 'Unmute input' : 'Mute input'}</button>
    </div>
    <p>Keep Windows/call playback on the existing Voicemeeter channel routed to B1. No physical microphone is selected automatically. Output: text only.</p>
    <div className="button-row"><select aria-label="Voice screenshot source" disabled={imageBusy} value={source} onChange={event => setSource(event.target.value)}><option value="">Choose a window or screen</option>{sources.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button type="button" disabled={!active || !source || imageBusy} onClick={() => void sendScreenshot()}>{imageBusy ? 'Sending…' : 'Send screenshot as context'}</button></div>
    <p>Screenshots are shared only when you press Send. Wait for receipt, then ask about the image aloud. Small text may lose detail; choose a focused window.</p>
    {imagePreview && <img src={imagePreview} alt="Screenshot sent as voice context" style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain' }} />}
    {error && <p role="alert">{error}</p>}
    {question && <p><strong>You:</strong> {question}</p>}
    {answer && <p style={{ whiteSpace: 'pre-wrap' }}><strong>Assistant:</strong> {answer}</p>}
  </section>;
}
