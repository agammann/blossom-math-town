import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,mkdtempSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

test('local server serves its root while refusing linked files outside it',async()=>{
  const fixture=mkdtempSync(path.join(tmpdir(),'blossom-server-'));
  const root=path.join(fixture,'root');
  const outside=path.join(fixture,'outside.txt');
  mkdirSync(root);
  writeFileSync(path.join(root,'index.html'),'in root');
  writeFileSync(outside,'outside sentinel');
  let linked=true;
  try{symlinkSync(outside,path.join(root,'linked.txt'),'file');}
  catch(error){if(process.platform!=='win32'||error.code!=='EPERM')throw error;linked=false;}
  const server=spawn(process.execPath,[fileURLToPath(new URL('../scripts/serve.mjs',import.meta.url)),root],{
    env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe'],windowsHide:true,
  });
  try{
    const base=await new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>reject(Error('server did not start')),5000);
      server.once('exit',(code)=>{clearTimeout(timeout);reject(Error(`server exited ${code}`));});
      server.stdout.on('data',(chunk)=>{
        const match=/http:\/\/127\.0\.0\.1:\d+/.exec(String(chunk));
        if(match){clearTimeout(timeout);resolve(match[0]);}
      });
    });
    const home=await fetch(base+'/');
    assert.equal(home.status,200);
    assert.equal(await home.text(),'in root');
    if(linked){
      const denied=await fetch(base+'/linked.txt');
      assert.equal(denied.status,404);
      assert.notEqual(await denied.text(),'outside sentinel');
    }
  }finally{
    server.kill();
    if(!fixture.startsWith(tmpdir()+path.sep))throw Error('Unexpected test fixture');
    rmSync(fixture,{recursive:true,force:true});
  }
});
