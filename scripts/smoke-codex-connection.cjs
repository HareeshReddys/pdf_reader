const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { CodexConnection } = require('../dist/main/services/codexConnection');
(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-server-test-'));
  const fake = path.join(directory, 'codex.cjs');
  let connection;
  try {
    await fs.writeFile(fake, `#!/usr/bin/env node
const rl=require('node:readline').createInterface({input:process.stdin});
let initialized=false; let sequence=0;
const send=m=>process.stdout.write(JSON.stringify(m)+'\\n');
rl.on('line',line=>{const m=JSON.parse(line);
if(m.method==='initialize'){initialized=true;send({id:m.id,result:{}});}
else if(m.method==='thread/start'){if(!initialized||m.params.sandbox!=='read-only'||!m.params.ephemeral)process.exit(4);send({id:m.id,result:{thread:{id:'thread'+(++sequence)}}});}
else if(m.method==='turn/start'){const threadId=m.params.threadId;send({id:m.id,result:{turn:{id:'turn1'}}});
setTimeout(()=>send({method:'item/agentMessage/delta',params:{threadId,itemId:'answer',delta:'## Topic\\n'}}),5);
setTimeout(()=>send({method:'item/agentMessage/delta',params:{threadId,itemId:'answer',delta:'- Explanation'}}),10);
setTimeout(()=>{send({method:'item/completed',params:{threadId,item:{id:'answer',type:'agentMessage',text:'## Topic\\n- Explanation.'}}});send({method:'turn/completed',params:{threadId,turn:{id:'turn1',status:'completed'}}});},20);}
else if(m.id)send({id:m.id,result:{}});
});
`, { mode: 0o700 });
    connection = new CodexConnection(fake, true);
    const partials = [];
    const answers = await Promise.all([
      connection.answer('question one', directory, 'test-model', true, undefined, value => partials.push(value)),
      connection.answer('question two', directory, 'test-model', true),
    ]);
    assert.deepEqual(answers, ['## Topic\n- Explanation.', '## Topic\n- Explanation.']);
    assert.equal(partials[0], '## Topic\n');
    assert.equal(partials.at(-1), answers[0]);
    assert.equal(connection.alive, true);
    connection.dispose();
    assert.equal(connection.alive, false);
    await assert.rejects(connection.answer('closed', directory, 'test-model', true), /closed/);
    console.log('PASS: persistent handshake, concurrent thread isolation, incremental text, authoritative final text, disposal.');
  } finally { connection?.dispose(); await fs.rm(directory, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
