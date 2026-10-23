const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { app, BrowserWindow, nativeImage } = require('electron');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'voice-renewal-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.join(directory, 'reference');
  process.env.OPENAI_API_KEY = 'test-key-never-exposed';
  require('dotenv').config = () => ({parsed: {}});
  const originalFetch = global.fetch;
  const requests = []; let failure = false, defer = false, deferredSignal;
  let window, floating, service;
  try {
    await fs.mkdir(path.join(directory, 'notes'));
    await fs.writeFile(path.join(directory, 'notes', 'resume.md'), 'Candidate is an engineer at Example Labs.');
    await require('../dist/main/services/jobDescriptionService').saveJobDescription('Original target role: Node.js.');
    global.fetch = async (_url, request) => {
      requests.push(JSON.parse(request.body.get('session')));
      if (defer) return new Promise((_resolve, reject) => { deferredSignal = request.signal; request.signal.addEventListener('abort', () => reject(new Error('Aborted')), {once: true}); });
      return new Response(failure ? '' : 'v=0\r\ns=mock-renewal\r\n', {status: failure ? 429 : 200});
    };
    const screen = require('../dist/main/services/screenCaptureService');
    screen.listScreenCaptureSources = async () => [{id: 'screen:test', name: 'Test display', kind: 'screen', thumbnailDataUrl: ''}];
    screen.captureScreenAndExtractText = async () => ({imageDataUrl: nativeImage.createFromBitmap(Buffer.from([255,255,255,255]), {width: 1, height: 1}).toDataURL()});
    window = new BrowserWindow({show: false, webPreferences: {preload: path.resolve('dist/main/preload.js'), sandbox: true, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false}});
    require('../dist/main/ipc').registerIpcHandlers(() => window);
    await window.loadFile(path.resolve('dist/renderer/index.html'));
    const run = code => window.webContents.executeJavaScript(code);
    await run(`
      window.__voiceClock = 0; const originalNow = Date.now.bind(Date); Date.now = () => originalNow() + __voiceClock;
      window.__peers = []; window.__messages = []; window.__micCalls = 0; window.__tracks = [];
      navigator.mediaDevices.enumerateDevices = async () => [{kind:'audioinput',deviceId:'b1',label:'Voicemeeter Out B1 (Test)'}];
      navigator.mediaDevices.getUserMedia = async () => { __micCalls++; const track = {enabled:true, stopped:false, stop(){this.stopped=true;}}; __tracks.push(track); return {getTracks:()=>[track],getAudioTracks:()=>[track]}; };
      window.RTCPeerConnection = class {
        connectionState='new'; sctp={maxMessageSize:65536}; tracks=[];
        constructor(){this.index=__peers.length;__peers.push(this);}
        addTrack(track){this.tracks.push(track);}
        createDataChannel(){ const peer=this; return this.channel={readyState:'connecting',bufferedAmount:0,send(raw){const message=JSON.parse(raw);__messages.push({peer:peer.index,...message});if(message.type==='conversation.item.create'&&message.item.id)queueMicrotask(()=>this.onmessage?.({data:JSON.stringify({type:'conversation.item.added',item:{id:message.item.id}})}));},close(){this.readyState='closed';this.onclose?.();}}; }
        async createOffer(){return {sdp:'v=0\\r\\ns=mock-offer\\r\\n'};}
        async setLocalDescription(){}
        async setRemoteDescription(){this.connectionState='connected';this.channel.readyState='open';this.channel.onopen?.();this.onconnectionstatechange?.();}
        close(){this.connectionState='closed';this.onconnectionstatechange?.();}
      }; true;
    `);
    service = require('../dist/main/services/realtimeVoiceService');
    const overlay = require('../dist/main/services/overlayService');
    floating = overlay.createOverlayWindow();
    if (floating.webContents.isLoading()) await new Promise(resolve => floating.webContents.once('did-finish-load', resolve));
    const ui = code => floating.webContents.executeJavaScript(code);
    const until = async condition => { const deadline=Date.now()+15000; while(!await condition()){if(Date.now()>deadline)throw new Error('Renewal test timed out: '+JSON.stringify(overlay.getOverlayState()));await wait(50);} };
    await ui("document.querySelector('[aria-label=\"Start continuous API voice\"]').click()");
    await until(() => service.isRealtimeVoiceActive());
    await until(() => run('__peers[0]?.channel.readyState === "open"'));
    const scope = require('../dist/main/services/practiceSessionService').getPracticeSessionId();
    const emit = (peer,event) => run(`__peers[${peer}].channel.onmessage({data:${JSON.stringify(JSON.stringify(event))}})`);
    async function answer(peer, item, question, text){
      await emit(peer,{type:'input_audio_buffer.speech_started',item_id:item});
      await emit(peer,{type:'conversation.item.input_audio_transcription.completed',item_id:item,transcript:question});
      await emit(peer,{type:'response.created',response:{id:'reply-'+item}});
      await emit(peer,{type:'response.done',response:{id:'reply-'+item,status:'completed',output:[{content:[{text}]}]}});
      await until(async()=> (await require('../dist/main/services/sessionService').listSessions()).some(s=>s.answer===text));
    }
    await answer(0,'one','What is Redis?','Redis is an in-memory data store.');
    await ui("document.querySelector('[aria-label=\"Send screenshot to ChatGPT\"]').click()");
    await until(()=>run("__messages.filter(m=>m.peer===0&&m.type==='response.create').length===2"));
    await emit(0,{type:'response.created',response:{id:'image-answer'}});
    await emit(0,{type:'response.done',response:{id:'image-answer',status:'completed',output:[{content:[{text:'The retained screenshot contains one white pixel.'}]}]}});
    await wait(100);
    await ui("document.querySelector('[aria-label=\"Keep current answer\"]').click()");
    await wait(100);
    const heldAnswer=overlay.getOverlayState().answer;
    // Changes after Start must not silently alter the active interview snapshot.
    await require('../dist/main/services/jobDescriptionService').saveJobDescription('Changed JD must wait for the next explicit Start.');
    await emit(0,{type:'input_audio_buffer.speech_started',item_id:'inflight'});
    await emit(0,{type:'conversation.item.input_audio_transcription.completed',item_id:'inflight',transcript:'What is cache invalidation?'});
    await emit(0,{type:'response.created',response:{id:'reply-inflight'}});
    await run('__voiceClock += 55*60*1000 + 1000');
    await until(()=>run('__peers[1]?.connectionState === "connected"'));
    await wait(200);
    assert.equal(await run('__peers[0].connectionState'),'connected','Preparation must not retire a connection with an answer in flight');
    assert.ok(overlay.getOverlayState().realtimeVoiceNotice.includes('Preparing'));
    await emit(0,{type:'response.done',response:{id:'reply-inflight',status:'completed',output:[{content:[{text:'Invalidate cached entries when their source changes.'}]}]}});
    await until(()=>overlay.getOverlayState().realtimeVoiceNotice?.includes('session renewed'));
    assert.equal(requests.length,2);
    assert.equal(requests[1].instructions,requests[0].instructions);
    assert.equal(require('../dist/main/services/practiceSessionService').getPracticeSessionId(),scope);
    assert.equal(overlay.getOverlayState().answer,heldAnswer);
    assert.equal(overlay.getOverlayState().assistTurn.held,true);
    assert.equal(await run('__micCalls'),1);
    assert.equal(await run('__tracks[0].stopped'),false);
    assert.equal(await run('__peers[0].connectionState'),'closed');
    assert.equal(await run('__peers[1].tracks[0] === __tracks[0]'),true);
    assert.ok(await run("__messages.some(m=>m.peer===1&&m.type==='conversation.item.create'&&m.item.content.some(c=>c.type==='input_text'&&c.text.includes('Redis is an in-memory')))"));
    assert.ok(await run("__messages.some(m=>m.peer===1&&m.type==='conversation.item.create'&&m.item.content.some(c=>c.type==='input_text'&&c.text.includes('Invalidate cached entries')))"),'A turn completed during preparation must be included in the handover context');
    assert.ok(await run("__messages.some(m=>m.peer===1&&m.type==='conversation.item.create'&&m.item.content.some(c=>c.type==='input_image'))"));
    assert.equal(await run("__messages.filter(m=>m.peer===1&&m.type==='response.create').length"),0,'Restoring context must not generate an unsolicited answer');
    await answer(1,'two','Why?','Because it can serve cached values quickly.');
    assert.equal(overlay.getOverlayState().answer,heldAnswer);
    await ui("document.querySelector('[aria-label=\"Show new answer\"]').click()"); await wait(100);
    assert.equal(overlay.getOverlayState().answer,'Because it can serve cached values quickly.');
    await assert.rejects(service.prepareRealtimeRenewal(window.webContents.id+1,'wrong','v=0\r\n'),/matching/);
    failure=true;
    await run('__voiceClock += 55*60*1000 + 1000');
    await until(()=>overlay.getOverlayState().realtimeVoiceNotice?.includes('renewal delayed'));
    assert.equal(service.isRealtimeVoiceActive(),true);
    assert.equal(await run('__peers[1].connectionState'),'connected');
    assert.equal(await run('__tracks[0].stopped'),false);
    failure=false;
    await run('__voiceClock += 31000');
    await until(()=>overlay.getOverlayState().realtimeVoiceNotice?.includes('session renewed'));
    assert.equal(require('../dist/main/services/practiceSessionService').getPracticeSessionId(),scope);
    assert.equal(await run('__micCalls'),1);
    await emit(3,{type:'error',error:{code:'session_expired',message:'The session reached its maximum duration.'}});
    await until(()=>run('__peers[3].connectionState === "closed" && __peers[4]?.connectionState === "connected"'));
    assert.equal(service.isRealtimeVoiceActive(),true,'An expiry error must recover without another Start');
    assert.equal(require('../dist/main/services/practiceSessionService').getPracticeSessionId(),scope);
    assert.equal(await run('__micCalls'),1);
    defer=true;
    await run('__voiceClock += 55*60*1000 + 1000');
    await until(()=>Boolean(deferredSignal));
    await ui("document.querySelector('[aria-label=\"Stop continuous API voice\"]').click()");
    await until(()=>!service.isRealtimeVoiceActive());
    await wait(200);
    assert.equal(deferredSignal.aborted,true);
    assert.equal(await run('__tracks.every(t=>t.stopped)'),true);
    assert.equal(await run('__peers.every(p=>p.connectionState === "closed")'),true);
    assert.equal(require('../dist/main/services/practiceSessionService').getPracticeSessionId(),scope);
    console.log('PASS: accelerated 55-minute handover through overlay; original context, confirmed image, recent Q&A, history scope, held answer, shared B1 track; failure/retry; Stop aborts in-flight renewal and closes both peers. API/WebRTC mocked.');
  } catch(error){console.error(error);process.exitCode=1;}
  finally { service?.stopRealtimeVoice();require('../dist/main/services/overlayService').destroyOverlayWindow();window?.destroy();global.fetch=originalFetch;await fs.rm(directory,{recursive:true,force:true});app.exit(process.exitCode||0); }
});
