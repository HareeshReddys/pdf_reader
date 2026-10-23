const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {EventEmitter}=require('node:events'),{PassThrough}=require('node:stream'),{app}=require('electron');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
app.on('window-all-closed',()=>undefined);
app.whenReady().then(async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'voice-mirror-test-'));process.env.INTERVIEW_COPILOT_DATA_DIR=directory;
 let child,overlay,mirror;
 try{
 const cp=require('node:child_process');const originalSpawn=cp.spawn,originalExecFile=cp.execFile;
 let hideCalls=0;cp.execFile=(binary,args,options,callback)=>{assert.equal(binary,'fixture-helper');assert.deepEqual(args,['--background-voice-window']);hideCalls++;callback(null,'{"background":true}','');};
 require('../dist/main/services/chatgptDesktopService').getChatGptDesktopHelper=async()=> 'fixture-helper';
 cp.spawn=(binary,args)=>{
  assert.equal(binary,'fixture-helper');assert.deepEqual(args,['--watch-voice']);
  child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();child.kill=()=>{setImmediate(()=>child.emit('close',0));return true;};
  setImmediate(()=>child.stdout.write(JSON.stringify({text:'You said:\nOld question\nChatGPT said:\nOld answer',observedAtMs:Date.now()})+'\n'));return child;
 };
 overlay=require('../dist/main/services/overlayService');mirror=require('../dist/main/services/voiceMirrorService');
 let screenCalls=0;
 require('../dist/main/services/screenChatService').askChatGptAboutScreen=async()=>{screenCalls++;};
 require('../dist/main/ipc').registerIpcHandlers();const window=overlay.createOverlayWindow();await new Promise(r=>window.webContents.once('did-finish-load',r));
 await window.webContents.executeJavaScript('window.interviewAPI.setVoiceMirror(true)');assert.equal(overlay.getOverlayState().voiceMirrorActive,true);assert.equal(overlay.getOverlayState().streamingAnswer,undefined);
 assert.equal(hideCalls,0,'Keep the active Voice surface available to accessibility and attachment controls');
 assert.equal(await window.webContents.executeJavaScript("document.querySelector('[aria-label=\"Start assistant mode\"]')===null"),true,'Hide local microphone controls while ChatGPT text is connected');
 assert.ok(await window.webContents.executeJavaScript("document.body.textContent.includes('ChatGPT text connected')"));
 await assert.rejects(mirror.startVoiceMirror(),/already active/);
 child.stdout.write(JSON.stringify({text:'You said:\nWhat is rendering?\nLatest response',observedAtMs:Date.now()})+'\n');
 for(let i=0;i<100&&overlay.getOverlayState().question!=='What is rendering?';i++)await wait(10);
 assert.equal(overlay.getOverlayState().question,'What is rendering?','Question appears before an answer exists');
 assert.equal(overlay.getOverlayState().streamingAnswer,undefined);
 child.stdout.write(JSON.stringify({text:'You said:\nWhat is rendering?\nChatGPT said:\nGot it.\nChatGPT said:\nRendering calculates the UI.',observedAtMs:Date.now()})+'\n');
 for(let i=0;i<100;i++){if(await window.webContents.executeJavaScript("document.querySelector('.overlay-content')?.textContent.includes('Rendering calculates the UI.')"))break;await wait(20);}
 assert.equal(await window.webContents.executeJavaScript("document.querySelector('.overlay-content')?.textContent.trim()"),'Rendering calculates the UI.');
 assert.equal(await window.webContents.executeJavaScript("document.querySelector('[aria-label=\"Send screenshot to ChatGPT\"]').disabled"),false,'Screenshot remains usable while a Voice answer is streaming');
 await window.webContents.executeJavaScript("document.querySelector('[aria-label=\"Send screenshot to ChatGPT\"]').click()");
 for(let i=0;i<100&&screenCalls!==1;i++)await wait(10);
 assert.equal(screenCalls,1,'Overlay Screen button reaches its typed IPC handler');
 mirror.suspendVoiceMirrorUpdates(true);
 child.stdout.write(JSON.stringify({text:'You said:\nUse this screenshot as context for my next spoken question.\nCapture reference: test\nChatGPT said:\nWaiting for your question.'})+'\n');
 await wait(20); mirror.suspendVoiceMirrorUpdates(false);
 child.stdout.write(JSON.stringify({text:'You said:\nUse this screenshot as context for my next spoken question.\nCapture reference: test\nChatGPT said:\nWaiting for your question.'})+'\n');
 await wait(20);
 assert.equal(overlay.getOverlayState().question,'What is rendering?','Screenshot context acknowledgement does not replace the interview question');
 await window.webContents.executeJavaScript('window.interviewAPI.setVoiceMirror(false)');assert.equal(overlay.getOverlayState().voiceMirrorActive,false);assert.equal(overlay.getOverlayState().answer,'Rendering calculates the UI.');
 child.stdout.write(JSON.stringify({text:'You said:\nLate question\nChatGPT said:\nLate answer'})+'\n');await wait(20);assert.equal(overlay.getOverlayState().answer,'Rendering calculates the UI.');
 cp.spawn=originalSpawn;cp.execFile=originalExecFile;console.log('PASS: typed IPC start/stop, no old-answer import, acknowledgement exclusion, actual overlay rendering, retained answer, duplicate-start rejection and late-update suppression. Native source is mocked; this is not an audio E2E test.');
 }catch(error){console.error(error);process.exitCode=1;}finally{mirror?.stopVoiceMirror();overlay?.destroyOverlayWindow();await fs.rm(directory,{recursive:true,force:true,maxRetries:10,retryDelay:100});app.exit(process.exitCode||0);}
});
