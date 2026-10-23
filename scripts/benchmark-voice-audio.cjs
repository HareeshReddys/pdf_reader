// Gate the batch on a successful first spoken flow. Never substitute typed probes.
const {spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path');
const questions=[
 ['What is the virtual DOM in React?','virtual DOM'],
 ['Explain JavaScript closures.','closure'],
 ['What is a database index?','index'],
 ['Explain an HTTP idempotent request.','idempotent'],
];
const results=[];
for(const [question,keyword] of questions){
 const run=spawnSync(process.execPath,[path.resolve('scripts/run-electron.cjs'),path.resolve('scripts/smoke-voice-audio-e2e.cjs')],{stdio:'inherit',env:{...process.env,COPILOT_VOICE_QUESTION:question,COPILOT_VOICE_KEYWORD:keyword},timeout:120000,windowsHide:true});
 if(run.error||run.status!==0){console.error('Voice benchmark stopped: spoken acceptance flow failed. No latency claim.');process.exitCode=1;break;}
 results.push(JSON.parse(fs.readFileSync(path.resolve('data/logs/voice-audio-e2e.json'),'utf8')));
}
fs.mkdirSync(path.resolve('data/logs'),{recursive:true});
fs.writeFileSync(path.resolve('data/logs/voice-audio-benchmark.json'),JSON.stringify({complete:results.length===questions.length,results,meanSpeechEndToVisibleMs:results.length?results.reduce((n,r)=>n+r.speechEndToVisibleMs,0)/results.length:null},null,2));
