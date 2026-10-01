import {cp,mkdir,rm,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'dist');
if(path.dirname(output)!==path.resolve(root))throw new Error('Invalid build directory');
await access(path.join(root,'web/index.html'));
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});await cp(path.join(root,'web'),output,{recursive:true});
console.log('Built Blossom in dist/ — all games, art and narration included.');
