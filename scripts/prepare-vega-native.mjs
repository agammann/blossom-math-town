import {access, cp, mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const project = path.join(root, 'vega-native-app');
if (path.dirname(project) !== path.resolve(root)) throw new Error('Invalid project path');

try {
  await access(path.join(project, 'manifest.toml'));
} catch {
  const result = spawnSync('vega', [
    'project', 'generate', '--template', 'helloWorld', '--name', 'Blossom',
    '--packageId', 'io.github.agammann.blossom', '--outputDir', project,
  ], {cwd: root, stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('Vega project generation failed');
}

const assetDir = path.join(project, 'src', 'assets');
await mkdir(assetDir, {recursive: true});
for (const name of ['town', 'pip', 'nori', 'milo', 'tilly', 'ziggy', 'otto', 'poppy', 'luna', 'sunny']) {
  await cp(path.join(root, 'web', 'assets', `${name}.webp`), path.join(assetDir, `${name}.webp`));
}
await cp(path.join(root, 'vega', 'NativeApp.tsx'), path.join(project, 'src', 'App.tsx'));

const manifestPath = path.join(project, 'manifest.toml');
let manifest = await readFile(manifestPath, 'utf8');
const appVersion = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version;
if (!/^title\s*=.*$/m.test(manifest) || !/^version\s*=.*$/m.test(manifest)) {
  throw new Error('Could not set the Vega package title and version');
}
manifest = manifest
  .replace(/^title\s*=.*$/m, 'title = "Blossom Math Town"')
  .replace(/^version\s*=.*$/m, `version = "${appVersion}"`);
await writeFile(manifestPath, manifest);
console.log('Prepared native Vega app in vega-native-app/.');
