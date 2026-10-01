import { cp, mkdir, readFile, rm, writeFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const project=path.join(root,'vega-app');
const assets=path.join(project,'assets','blossom');
if(path.dirname(project)!==path.resolve(root)||path.dirname(assets)!==path.join(project,'assets')){
  throw new Error('Invalid Vega project directory');
}

try{await access(path.join(project,'manifest.toml'));}
catch{
  const result=spawnSync('vega',[
    'project','generate','--template','vegaWebview','--name','Blossom',
    '--packageId','io.github.agammann.blossom','--outputDir',project,
  ],{cwd:root,stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)throw new Error('Vega project generation failed');
}

const packagePath=path.join(project,'package.json');
const packageJson=JSON.parse(await readFile(packagePath,'utf8'));
if(!packageJson.dependencies?.['@amazon-devices/webview']){
  packageJson.dependencies={...packageJson.dependencies,'@amazon-devices/webview':'~4.0.2'};
  await writeFile(packagePath,JSON.stringify(packageJson,null,2)+'\n');
}

const result=spawnSync(process.execPath,[path.join(root,'scripts','build-vega-web.mjs')],{
  cwd:root,stdio:'inherit',
});
if(result.error)throw result.error;
if(result.status!==0)throw new Error('Vega web build failed');

await rm(assets,{recursive:true,force:true});
await mkdir(path.dirname(assets),{recursive:true});
await cp(path.join(root,'vega-web'),assets,{recursive:true});
await cp(path.join(root,'vega','App.tsx'),path.join(project,'src','App.tsx'));

const manifestPath=path.join(project,'manifest.toml');
let manifest=await readFile(manifestPath,'utf8');
const appVersion=JSON.parse(await readFile(path.join(root,'package.json'),'utf8')).version;
if(!/^title\s*=.*$/m.test(manifest)||!/^version\s*=.*$/m.test(manifest)){
  throw new Error('Could not set the Vega package title and version');
}
manifest=manifest
  .replace(/^title\s*=.*$/m,'title = "Blossom Math Town"')
  .replace(/^version\s*=.*$/m,`version = "${appVersion}"`);
for(const service of ['com.amazon.audio.stream','com.amazon.audio.control','com.amazon.gipc.uuid.*']){
  if(!manifest.includes(`id = "${service}"`)){
    manifest+=`\n[[wants.service]]\nid = "${service}"\n`;
  }
}
if(!/\[\[offers\.service\]\]\s*id\s*=\s*"com\.amazon\.gipc\.uuid\.\*"/.test(manifest)){
  manifest+='\n[[offers.service]]\nid = "com.amazon.gipc.uuid.*"\n';
}
await writeFile(manifestPath,manifest);
console.log('Prepared Vega app in vega-app/. Install dependencies and build with the Vega SDK.');
