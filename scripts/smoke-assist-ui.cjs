const assert = require('node:assert/strict');
const { app, BrowserWindow } = require('electron');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const execute = require('node:util').promisify(require('node:child_process').execFile);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check) { for(let i=0;i<80;i++){ if(await check()) return; await delay(100); } throw new Error('Assistant UI did not update'); }
app.on('window-all-closed', () => undefined);
app.whenReady().then(async () => {
  const data = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-assist-ui-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = data;
  let main, module;
  const sink = `copilot_ui_${process.pid}`;
  const callAudio = require('../dist/main/services/callAudioService');
  const turns = require('../dist/main/services/assistTurnService');
  const overlay = require('../dist/main/services/overlayService');
  try {
    module = (await execute('pactl', ['load-module', 'module-null-sink', `sink_name=${sink}`])).stdout.trim();
    require('../dist/main/ipc').registerIpcHandlers();
    main = new BrowserWindow({ show:false, webPreferences:{preload:path.resolve('dist/main/preload.js'),sandbox:true,contextIsolation:true,nodeIntegration:false}});
    await main.loadFile(path.resolve('dist/renderer/index.html'));
    await until(async()=>await main.webContents.executeJavaScript("document.querySelector('.audio-panel select')?.value.startsWith('pulse:')"));
    await main.webContents.executeJavaScript(`const picker = document.querySelector('.audio-panel select'); picker.value = 'pulse:${sink}.monitor'; picker.dispatchEvent(new Event('change', { bubbles: true }));`);
    await delay(100);
    await main.webContents.executeJavaScript("navigator.mediaDevices.getUserMedia = async () => { throw new Error('Physical microphone must not be opened in call-output mode'); }; Array.from(document.querySelectorAll('.audio-panel button')).find(button=>button.textContent==='Start assistant mode').click()");
    await until(async()=>await main.webContents.executeJavaScript("Boolean(document.querySelector('.audio-panel .is-stop'))"));
    assert.equal(turns.getAssistTurnState().active, true);
    const floating = overlay.createOverlayWindow();
    await floating.loadFile(path.resolve('dist/renderer/index.html'), {query:{view:'overlay'}});
    await until(async()=>await floating.webContents.executeJavaScript("Boolean(document.querySelector('button[aria-label=\"Hold answer\"]'))"));
    await floating.webContents.executeJavaScript("document.querySelector('button[aria-label=\"Hold answer\"]').click()");
    await until(()=>turns.getAssistTurnState().held);
    floating.setSize(420, 720); await delay(100);
    const compact = await floating.webContents.executeJavaScript(`(() => { const row = document.querySelector('.overlay-toolbar').getBoundingClientRect(); return [...document.querySelector('.overlay-toolbar').children].every(node => { const r = node.getBoundingClientRect(); return r.right <= row.right + 1 && Math.abs(r.top + r.height/2 - row.top - row.height/2) < 2; }); })()`);
    assert.equal(compact, true, 'Active assistant controls must fit one row at 420px');
    await until(async()=>(await main.webContents.executeJavaScript("document.querySelector('.audio-panel__turn-controls')?.textContent")).includes('Listen for next question'));
    await floating.webContents.executeJavaScript("document.querySelector('button[aria-label=\"Listen for next question\"]').click()");
    await until(()=>!turns.getAssistTurnState().held);
    turns.ingestAssistTranscript('What is CSS Grid?', {audioSource:'microphone',capturedAt:Date.now()+1});
    await until(async()=>await floating.webContents.executeJavaScript("Boolean(document.querySelector('.overlay-pending'))"));
    await main.webContents.executeJavaScript("document.querySelector('.audio-panel .is-stop').click()");
    await until(()=>!turns.getAssistTurnState().active);
    await until(async()=>!(await floating.webContents.executeJavaScript("Boolean(document.querySelector('.overlay-pending'))")));
    console.log('PASS: native call output selected, microphone never opened, main/overlay hold synchronization, pending confirmation UI, and stop clears pending questions.');
    overlay.destroyOverlayWindow(); main.destroy();
  } catch(error){console.error(error);process.exitCode=1;}
  finally { callAudio.stopCallAudioCapture(); turns.configureAssistTurn(false); overlay.destroyOverlayWindow(); main?.destroy(); await fs.rm(data,{recursive:true,force:true}); if (module) await execute('pactl', ['unload-module', module]); app.exit(process.exitCode || 0); }
});
