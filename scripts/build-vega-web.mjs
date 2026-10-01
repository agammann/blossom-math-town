import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'vega-web');
if(path.dirname(output)!==path.resolve(root))throw new Error('Invalid Vega web output directory');

await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(path.join(root,'web'),output,{recursive:true});
await build({
  entryPoints:[path.join(root,'web','app.js')],
  bundle:true,
  format:'iife',
  platform:'browser',
  target:'chrome118',
  outfile:path.join(output,'app.bundle.js'),
});

const font=(await readFile(path.join(root,'web','assets','nunito.ttf'))).toString('base64');
const cssPath=path.join(output,'style.css');
const css=await readFile(cssPath,'utf8');
if(!css.includes("url('assets/nunito.ttf')"))throw new Error('Could not embed the Vega font');
await writeFile(cssPath,css.replace("url('assets/nunito.ttf')",`url('data:font/ttf;base64,${font}')`));

const html=await readFile(path.join(root,'web','index.html'),'utf8');
const tvHtml=html
  .replace('<html lang="en">','<html lang="en" data-tv="true">')
  .replace(/\s*<link rel="preload" href="assets\/nunito\.ttf"[^>]*>/,'')
  .replace('<script type="module" src="app.js"></script>','<script defer src="app.bundle.js"></script>');
if(tvHtml===html||!tvHtml.includes('data-tv="true"')||!tvHtml.includes('app.bundle.js')){
  throw new Error('Could not make the Vega TV entry page');
}
await writeFile(path.join(output,'tv.html'),tvHtml);
console.log('Built local Vega web assets in vega-web/.');
