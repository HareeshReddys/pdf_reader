const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {app}=require('electron');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
app.on('window-all-closed',()=>undefined);
app.whenReady().then(async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'voice-mirror-live-'));process.env.INTERVIEW_COPILOT_DATA_DIR=dir;
 const overlay=require('../dist/main/services/overlayService'), mirror=require('../dist/main/services/voiceMirrorService');
 let window;
 try {
 require('../dist/main/ipc').registerIpcHandlers();
 window=overlay.createOverlayWindow();await new Promise(r=>window.webContents.once('did-finish-load',r));window.show();
 await window.webContents.executeJavaScript("window.micCalls=0;navigator.mediaDevices.getUserMedia=async()=>{window.micCalls++;throw new Error('No microphone in text mirror test');}; true");
 await mirror.startVoiceMirror();await wait(1500);
 assert.equal(overlay.getOverlayState().streamingAnswer,undefined,'Must not import old answers on start');
 console.log('MIRROR READY: submitting the controlled probe using the app desktop bridge.');
 const request = require('../dist/main/services/chatgptDesktopService').askChatGptDesktop('Flow probe violet. For this mock practice test, reply directly with exactly this written sentence and no acknowledgement: Rendering calculates the UI; committing updates the DOM.');
 let requestError; request.catch(error => { requestError = error; });
 const started=Date.now();let firstAt=0, visibleAt=0;
 while(Date.now()-started<120000){
 if(requestError) throw requestError;
 const state=overlay.getOverlayState();
 if(state.question?.includes('Flow probe violet')&&state.streamingAnswer?.includes('Rendering calculates')){
  if(!firstAt)firstAt=Date.now();
  const displayed=await window.webContents.executeJavaScript("document.querySelector('.overlay-content')?.textContent || ''");
  if(displayed.includes(state.streamingAnswer)){visibleAt=Date.now();break;}
 }
 await wait(50);
 }
 assert.ok(visibleAt,'New actual ChatGPT reply must reach the overlay');
 await request;
 const answer=overlay.getOverlayState().streamingAnswer;assert.match(answer,/committing/i);
 assert.equal(await window.webContents.executeJavaScript('micCalls'),0);
 mirror.stopVoiceMirror();assert.equal(overlay.getOverlayState().voiceMirrorActive,false);assert.equal(overlay.getOverlayState().answer,answer,'Stop retains the displayed snapshot');
 const proof={verifiedAt:new Date().toISOString(),typedInputOnly:true,audioEndToEnd:false,answer,mainToVisibleMs:visibleAt-firstAt};
 await fs.writeFile(path.resolve('data/logs/voice-mirror-live.json'),JSON.stringify(proof,null,2));
 console.log('PASS: live ChatGPT written reply -> native reader -> typed IPC -> actual overlay; stop retains answer; no renderer microphone call.');console.log(JSON.stringify(proof));
 }catch(e){console.error(e);process.exitCode=1;}finally{mirror.stopVoiceMirror();overlay.destroyOverlayWindow();await fs.rm(dir,{recursive:true,force:true,maxRetries:10,retryDelay:200});app.exit(process.exitCode||0);}
});

