import http from 'node:http';
import {constants} from 'node:fs';
import {open,realpath,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)),process.argv[2]||'web');
const canonicalRoot=await realpath(root);
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.ttf':'font/ttf','.wav':'audio/wav','.json':'application/json','.svg':'image/svg+xml'};
async function readAsset(target){
  const handle=await open(target,constants.O_RDONLY|(constants.O_NOFOLLOW||0)|(constants.O_NONBLOCK||0));
  try{
    const first=await handle.stat({bigint:true});
    if(!first.isFile()||first.size>32n*1024n*1024n)throw Error('Invalid asset');
    const canonical=await realpath(target);
    if(canonical!==canonicalRoot&&!canonical.startsWith(canonicalRoot+path.sep))throw Error('Asset escapes root');
    const current=await stat(target,{bigint:true});
    if(current.dev!==first.dev||current.ino!==first.ino)throw Error('Asset changed');
    const content=Buffer.alloc(Number(first.size));
    let length=0;
    while(length<content.length){
      const {bytesRead}=await handle.read(content,length,content.length-length,length);
      if(bytesRead===0)throw Error('Asset truncated');
      length+=bytesRead;
    }
    const {bytesRead:extra}=await handle.read(Buffer.alloc(1),0,1,content.length);
    const after=await handle.stat({bigint:true});
    const finalPath=await stat(target,{bigint:true});
    if(extra||after.size!==first.size||after.mtimeNs!==first.mtimeNs||after.ctimeNs!==first.ctimeNs||finalPath.dev!==first.dev||finalPath.ino!==first.ino)throw Error('Asset changed');
    return content;
  }finally{await handle.close();}
}
http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let target=path.resolve(root,'.'+pathname);
    if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if((await stat(target)).isDirectory())target=path.join(target,'index.html');
    const content=await readAsset(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(content);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',function(){console.log(`Blossom: http://127.0.0.1:${this.address().port} (serving ${path.basename(root)})`);});
