const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {app,BrowserWindow}=require('electron');
const execute=require('node:util').promisify(require('node:child_process').execFile);
const wait=ms=>new Promise(r=>setTimeout(r,ms));app.on('window-all-closed',()=>undefined);
app.whenReady().then(async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'voice-audio-e2e-'));process.env.INTERVIEW_COPILOT_DATA_DIR=directory;
 const overlay=require('../dist/main/services/overlayService'),mirror=require('../dist/main/services/voiceMirrorService');let player;
 try{
 const helper=await require('../dist/main/services/chatgptDesktopService').getChatGptDesktopHelper();
 const status=JSON.parse((await execute(helper,['--voice-status'])).stdout);
 assert.ok(status.active && status.microphoneEnabled,'ChatGPT Voice is not connected with input enabled; no audio was sent');
 assert.ok(status.speakersMuted,'Mute ChatGPT speakers before the audio test; no audio was sent');
 const question=process.env.COPILOT_VOICE_QUESTION || 'What is the virtual DOM in React?';
 const keyword=process.env.COPILOT_VOICE_KEYWORD || 'virtual DOM';
 const wav=path.join(directory,'question.wav');
 await execute('powershell.exe',['-NoProfile','-Command','Add-Type -AssemblyName System.Speech; $speaker=New-Object System.Speech.Synthesis.SpeechSynthesizer; $speaker.SetOutputToWaveFile($env:VOICE_TEST_WAV); $speaker.Speak($env:VOICE_TEST_QUESTION); $speaker.Dispose()'],{env:{...process.env,VOICE_TEST_WAV:wav,VOICE_TEST_QUESTION:question}});
 require('../dist/main/ipc').registerIpcHandlers();const window=overlay.createOverlayWindow();await new Promise(r=>window.webContents.once('did-finish-load',r));window.showInactive();await mirror.startVoiceMirror();
 player=new BrowserWindow({show:false,webPreferences:{sandbox:true}});await player.loadFile(path.resolve('scripts/fixtures/audio-output.html'));
 const devices=await player.webContents.executeJavaScript("navigator.mediaDevices.enumerateDevices().then(items=>items.filter(d=>d.kind==='audiooutput').map(d=>({id:d.deviceId,label:d.label})))");console.log('OUTPUT DEVICES',JSON.stringify(devices));
 const acoustic=process.env.COPILOT_VOICE_OUTPUT==='real-speaker';
 const target=devices.find(d=>acoustic?/^Speaker \(Realtek\(R\) Audio\)$/i.test(d.label):/^Voicemeeter Input \(/i.test(d.label));assert.ok(target,'Explicit requested output must be available; never play the probe through a guessed device');
 const data='data:audio/wav;base64,'+(await fs.readFile(wav)).toString('base64');const startedAt=Date.now();
 await player.webContents.executeJavaScript('window.probeEndedAt=0;window.probeAudio=new Audio('+JSON.stringify(data)+');probeAudio.onended=()=>window.probeEndedAt=Date.now();probeAudio.setSinkId('+JSON.stringify(target.id)+').then(()=>probeAudio.play())',true);
 let visibleAt=0,firstAnswer='',checkedVoiceAt=0;
 while(Date.now()-startedAt<90000){
 if(Date.now()-checkedVoiceAt>2000){checkedVoiceAt=Date.now();const live=JSON.parse((await execute(helper,['--voice-status'])).stdout);assert.ok(live.active&&live.microphoneEnabled,'ChatGPT Voice disconnected during the spoken test');assert.ok(live.speakersMuted,'ChatGPT speakers became unmuted during the spoken test');}
 const state=overlay.getOverlayState();if(state.voiceMirrorActive===false)throw new Error(state.activityDetail||'Mirror stopped');if(state.question?.toLowerCase().includes(keyword.toLowerCase())&&state.streamingAnswer?.length>15){const shown=await window.webContents.executeJavaScript("document.querySelector('.overlay-content')?.textContent || ''");if(shown.includes(state.streamingAnswer)){visibleAt=Date.now();firstAnswer=state.streamingAnswer;break;}}await wait(50);}
 assert.ok(visibleAt,'Spoken question did not produce a readable overlay reply within 90 seconds');let endedAt=await player.webContents.executeJavaScript('window.probeEndedAt');
 // Voice may start replying before the synthesized question finishes.
 const playbackDeadline=Date.now()+20000;while(!endedAt&&Date.now()<playbackDeadline){await wait(50);endedAt=await player.webContents.executeJavaScript('window.probeEndedAt');}assert.ok(endedAt,'Question playback must finish');
 await wait(4000);const final=overlay.getOverlayState();const proof={verifiedAt:new Date().toISOString(),question,transcript:final.question,firstAnswer,latestAnswer:final.streamingAnswer,speechEndToVisibleMs:visibleAt-endedAt,playbackToVisibleMs:visibleAt-startedAt,audioEndToEnd:true,inputDevice:acoustic?'ChatGPT system-default physical microphone (acoustic test)':'Voicemeeter Out B1 (requires separate input verification)',testOutputDevice:target.label,acousticTest:acoustic,chatGptOutput:'Voicemeeter AUX Input; all mixer routes disabled',physicalMicOpenedByTest:false};
 await fs.mkdir(path.resolve('data/logs'),{recursive:true});await fs.writeFile(path.resolve('data/logs/voice-audio-e2e.json'),JSON.stringify(proof,null,2));console.log('PASS actual synthesized audio -> '+(acoustic?'real speakers / physical mic':'virtual input')+' -> ChatGPT Voice -> native reader -> actual overlay');console.log(JSON.stringify(proof));
 }catch(error){console.error(error);await fs.mkdir(path.resolve('data/logs'),{recursive:true});await fs.writeFile(path.resolve('data/logs/voice-audio-last-failure.json'),JSON.stringify({verifiedAt:new Date().toISOString(),audioEndToEnd:false,error:String(error),overlay:overlay.getOverlayState()},null,2));process.exitCode=1;}finally{mirror.stopVoiceMirror();player?.destroy();overlay.destroyOverlayWindow();await fs.rm(directory,{recursive:true,force:true,maxRetries:10,retryDelay:100});app.exit(process.exitCode||0);}
});
