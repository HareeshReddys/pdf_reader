// Isolated audio probe: no overlay, prompt submission, or local transcription.
const {app,BrowserWindow}=require('electron');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const execute=require('node:util').promisify(require('node:child_process').execFile);
app.whenReady().then(async()=>{
 let player,directory;
 try {
  directory=await fs.mkdtemp(path.join(os.tmpdir(),'b1-speech-probe-'));
  const wav=path.join(directory,'probe.wav');
  const phrase=process.env.VOICE_PROBE_PHRASE || 'Audio input check. The orange bridge has seven windows. Please repeat this sentence.';
  await execute('powershell.exe',['-NoProfile','-Command','Add-Type -AssemblyName System.Speech; $speaker=New-Object System.Speech.Synthesis.SpeechSynthesizer; $speaker.SetOutputToWaveFile($env:VOICE_TEST_WAV); $speaker.Speak($env:VOICE_TEST_QUESTION); $speaker.Dispose()'],{env:{...process.env,VOICE_TEST_WAV:wav,VOICE_TEST_QUESTION:phrase}});
  player=new BrowserWindow({show:false,webPreferences:{sandbox:true}});
  await player.loadFile(path.resolve('scripts/fixtures/audio-output.html'));
  const data='data:audio/wav;base64,'+(await fs.readFile(wav)).toString('base64');
  if(process.env.VOICE_PROBE_WAIT_FOR_VOICE==='1'){
   const helper=await require('../dist/main/services/chatgptDesktopService').getChatGptDesktopHelper();
   await player.webContents.executeJavaScript(`window.preparedProbe=new Audio(${JSON.stringify(data)});preparedProbe.preload='auto';preparedProbe.load();true`);
   console.log('AUDIO READY: question synthesized and player loaded; waiting for Voice to become active.');
   const deadline=Date.now()+120000;let active=false;
   while(Date.now()<deadline){try{const status=JSON.parse((await execute(helper,['--voice-status'])).stdout);if(status.active&&status.microphoneEnabled){active=true;console.log('VOICE ACTIVE: playing prepared audio now.');break;}}catch{}await new Promise(r=>setTimeout(r,50));}
   if(!active)throw new Error('Voice did not become active within 120 seconds; no audio played');
  }
  const result=await player.webContents.executeJavaScript(`(async()=>{
   const devices=await navigator.mediaDevices.enumerateDevices();
   const output=devices.find(d=>d.kind==='audiooutput'&&d.label.startsWith(${JSON.stringify(process.env.VOICE_PROBE_OUTPUT==='real-speaker'?'Speaker (Realtek(R) Audio)':'Voicemeeter Input (')}));
   const input=devices.find(d=>d.kind==='audioinput'&&d.label.startsWith('Voicemeeter Out B1 ('));
   if(!input||!output)throw new Error('Explicit VAIO/B1 endpoints missing');
   const stream=await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact:input.deviceId},echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
   const ctx=new AudioContext(),analyser=ctx.createAnalyser();ctx.createMediaStreamSource(stream).connect(analyser);
   const audio=window.preparedProbe||new Audio(${JSON.stringify(data)});await audio.setSinkId(output.deviceId);
   let peak=0;const samples=new Float32Array(analyser.fftSize);
   const timer=setInterval(()=>{analyser.getFloatTimeDomainData(samples);peak=Math.max(peak,Math.sqrt(samples.reduce((n,v)=>n+v*v,0)/samples.length));},20);
   try{await new Promise((resolve,reject)=>{audio.onended=resolve;audio.onerror=()=>reject(new Error('Probe playback failed'));audio.play().catch(reject);});return{input:stream.getAudioTracks()[0].label,output:output.label,speechRmsPeak:peak};}
   finally{clearInterval(timer);audio.pause();stream.getTracks().forEach(t=>t.stop());await ctx.close();}
  })()`,true);
  const proof={at:new Date().toISOString(),phrase,...result,chatGptReceptionVerified:false};
  await fs.mkdir(path.resolve('data/logs'),{recursive:true});await fs.writeFile(path.resolve('data/logs/b1-speech-probe.json'),JSON.stringify(proof,null,2));
  console.log(JSON.stringify(proof));if(process.env.VOICE_PROBE_OUTPUT!=='real-speaker'&&result.speechRmsPeak<0.01)throw new Error('Spoken phrase did not reach B1');
 }catch(e){console.error(e);process.exitCode=1;}
 finally{player?.destroy();if(directory)await fs.rm(directory,{recursive:true,force:true,maxRetries:10,retryDelay:100});app.exit(process.exitCode||0);}
});
