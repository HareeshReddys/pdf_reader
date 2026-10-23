// Drives audio only. Answers are rendered by the separately running production app.
const {app,BrowserWindow}=require('electron');
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {spawn,execFile}=require('node:child_process');
const execute=require('node:util').promisify(execFile),{createInterface}=require('node:readline');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const questions=[['How would you investigate an API that suddenly became slow in production?','production'],['How do you prevent duplicate records when multiple requests arrive simultaneously?','duplicate'],['Tell me about a production issue you resolved at Eli Lilly. What happened, how did you diagnose it, and how did you prevent it from recurring?','production']];
app.whenReady().then(async()=>{let player,reader,directory;const results=[];
try{
 directory=await fs.mkdtemp(path.join(os.tmpdir(),'live-interview-'));
 const helper=await require('../dist/main/services/chatgptDesktopService').getChatGptDesktopHelper();
 const parse=require('../dist/main/services/voiceReplyParser').parseVoiceReply;
 const audio=[];
 for(let i=0;i<questions.length;i++){
  const wav=path.join(directory,`question-${i}.wav`);
  await execute('powershell.exe',['-NoProfile','-Command','Add-Type -AssemblyName System.Speech; $s=New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SetOutputToWaveFile($env:VOICE_TEST_WAV); $s.Speak($env:VOICE_TEST_QUESTION); $s.Dispose()'],{env:{...process.env,VOICE_TEST_WAV:wav,VOICE_TEST_QUESTION:questions[i][0]}});
  audio.push('data:audio/wav;base64,'+(await fs.readFile(wav)).toString('base64'));
 }
 player=new BrowserWindow({show:false,webPreferences:{sandbox:true}});await player.loadFile(path.resolve('scripts/fixtures/audio-output.html'));
 await player.webContents.executeJavaScript(`(async()=>{const devices=await navigator.mediaDevices.enumerateDevices();const output=devices.find(d=>d.kind==='audiooutput'&&d.label==='Voicemeeter Input (VB-Audio Voicemeeter VAIO)');if(!output)throw new Error('VAIO missing');window.interviewAudio=[];for(const data of ${JSON.stringify(audio)}){const a=new Audio(data);await a.setSinkId(output.deviceId);await new Promise((resolve,reject)=>{a.oncanplaythrough=resolve;a.onerror=reject;a.load();});interviewAudio.push(a);}return true;})()`);
 let latest,changedAt=0,readerError='';
 reader=spawn(helper,['--watch-voice'],{windowsHide:true,stdio:['ignore','pipe','pipe']});
 createInterface({input:reader.stdout}).on('line',line=>{try{const reply=parse(JSON.parse(line).text);if(reply&&JSON.stringify(reply)!==JSON.stringify(latest)){latest=reply;changedAt=Date.now();}}catch{}});
 reader.stderr.on('data',bytes=>readerError+=String(bytes));
 await wait(1000);console.log('SIMULATION READY: all three questions preloaded; ten-second answer windows.');
 console.log('Waiting up to two minutes: start ChatGPT Voice and leave its microphone enabled.');
 const voiceDeadline=Date.now()+120000;let voiceReady=false;
 while(Date.now()<voiceDeadline){try{const status=JSON.parse((await execute(helper,['--voice-status'])).stdout);if(status.active&&status.microphoneEnabled){voiceReady=true;break;}}catch{}await wait(50);}
 if(!voiceReady)throw new Error('Voice did not become active; no question played.');
 // Leave window placement to the user; moving ChatGPT can temporarily hide its Voice controls from UI Automation.
 for(let i=0;i<questions.length;i++){
  let status,ready=false;const statusDeadline=Date.now()+15000;
  while(Date.now()<statusDeadline){try{status=JSON.parse((await execute(helper,['--voice-status'])).stdout);if(status.active&&status.microphoneEnabled){ready=true;break;}}catch{}await wait(250);}
  if(!ready)throw new Error('ChatGPT Voice is not ready after 15 seconds; no question played. Last status: '+JSON.stringify(status??null)+'. Keep Voice open with its microphone enabled.');
  const baseline=latest?.question,startedAt=Date.now();let firstAt=0;
  console.log(`QUESTION ${i+1}: ${questions[i][0]}`);
  const endedAt=await player.webContents.executeJavaScript(`(async()=>{const a=interviewAudio[${i}];await a.play();await new Promise(resolve=>a.onended=resolve);return Date.now();})()`,true);
  const deadline=Date.now()+60000;
  while(Date.now()<deadline){
   if(reader.exitCode!==null)throw new Error(readerError||'ChatGPT reader stopped');
   if(latest&&latest.question!==baseline&&latest.question.toLowerCase().includes(questions[i][1])&&latest.answer.length>25){
    if(!firstAt){firstAt=Date.now();console.log(`ANSWER ${i+1} STREAMING: ${latest.answer}`);}
    if(Date.now()-changedAt>=1800&&Date.now()-firstAt>=2000)break;
   }
   await wait(100);
  }
  if(!firstAt)throw new Error(`No written reply for question ${i+1}`);
  const answerReadyAt=Date.now();const turn={question:questions[i][0],transcript:latest.question,answer:latest.answer,startedAt,speechEndedAt:endedAt,firstReplyObservedAt:firstAt,answerReadyAt,answerWindowMs:10000};
  console.log(`YOUR TURN ${i+1}: ten seconds to answer aloud.`);
  await wait(10000);turn.answerWindowEndedAt=Date.now();results.push(turn);
 }
 console.log('SIMULATION COMPLETE: three questions and three ten-second answer windows.');
}catch(e){console.error(e);process.exitCode=1;}
finally{
 await fs.mkdir(path.resolve('data/logs'),{recursive:true});await fs.writeFile(path.resolve('data/logs/live-interview-simulation.json'),JSON.stringify({completed:results.length===questions.length,productionApp:true,results},null,2));
 reader?.kill();player?.destroy();if(directory)await fs.rm(directory,{recursive:true,force:true,maxRetries:10,retryDelay:100});app.exit(process.exitCode||0);
}});


