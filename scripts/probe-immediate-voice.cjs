const {app,BrowserWindow}=require('electron');
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const execute=require('node:util').promisify(require('node:child_process').execFile);
app.whenReady().then(async()=>{let window,directory;try{
 directory=await fs.mkdtemp(path.join(os.tmpdir(),'immediate-voice-'));const wav=path.join(directory,'question.wav');
 const question='What is the difference between rendering and committing in React? Answer in two sentences.';
 const output=process.env.VOICE_PROBE_OUTPUT==='vaio'?'Voicemeeter Input (VB-Audio Voicemeeter VAIO)':'Speaker (Realtek(R) Audio)';
 await execute('powershell.exe',['-NoProfile','-Command','Add-Type -AssemblyName System.Speech; $s=New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SetOutputToWaveFile($env:VOICE_TEST_WAV); $s.Speak($env:VOICE_TEST_QUESTION); $s.Dispose()'],{env:{...process.env,VOICE_TEST_WAV:wav,VOICE_TEST_QUESTION:question}});
 const helper=await require('../dist/main/services/chatgptDesktopService').getChatGptDesktopHelper();
 window=new BrowserWindow({show:false,webPreferences:{sandbox:true}});await window.loadFile(path.resolve('scripts/fixtures/audio-output.html'));
 const data='data:audio/wav;base64,'+(await fs.readFile(wav)).toString('base64');
 await window.webContents.executeJavaScript(`(async()=>{const devices=await navigator.mediaDevices.enumerateDevices();const speaker=devices.find(d=>d.kind==='audiooutput'&&d.label===${JSON.stringify(output)});if(!speaker)throw new Error('Requested output missing');window.readyAudio=new Audio(${JSON.stringify(data)});await readyAudio.setSinkId(speaker.deviceId);await new Promise((resolve,reject)=>{readyAudio.oncanplaythrough=resolve;readyAudio.onerror=reject;readyAudio.load();});return true;})()`);
 console.log('AUDIO FULLY READY: sink selected and audio loaded. Start Voice now.');
 const until=Date.now()+120000;let activeAt;
 while(Date.now()<until){try{const status=JSON.parse((await execute(helper,['--voice-status'])).stdout);if(status.active&&status.microphoneEnabled){activeAt=Date.now();break;}}catch{}await new Promise(r=>setTimeout(r,50));}
 if(!activeAt)throw new Error('Voice never became active');
 const playback=await window.webContents.executeJavaScript(`(async()=>{const startedAt=Date.now();await readyAudio.play();await new Promise(resolve=>readyAudio.onended=resolve);return{startedAt,endedAt:Date.now()};})()`,true);
 const proof={question,voiceActiveObservedAt:activeAt,...playback,observedActiveToPlaybackMs:playback.startedAt-activeAt,output,microphoneOpenedByTest:false,voiceResponseVerified:false};
 await fs.writeFile(path.resolve('data/logs/immediate-voice-playback.json'),JSON.stringify(proof,null,2));console.log(JSON.stringify(proof));
 }catch(e){console.error(e);process.exitCode=1;}finally{window?.destroy();if(directory)await fs.rm(directory,{recursive:true,force:true,maxRetries:10,retryDelay:100});app.exit(process.exitCode||0);}});
