import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {narration} from '../web/narration.js';
import {GAMES,NEW_NARRATION} from '../web/lessons.js';
import {narrationKey} from '../web/voice.js';
test('Ten real games and all nine teachers are included',async()=>{
  assert.equal(Object.keys(GAMES).length,10);
  for(const name of ['pip','nori','milo','tilly','ziggy','sunny','otto','poppy','luna'])await access(new URL(`../web/assets/${name}.webp`,import.meta.url));
});
test('Every new lesson line has a complete bundled British voice clip',async()=>{
  for(const {character,text} of NEW_NARRATION)assert(narration[narrationKey(text,character)],`${character}: ${text}`);
  assert.equal(Object.keys(narration).length,404);
  for(const clip of Object.values(narration)){
    assert(clip.duration>.25&&clip.duration<30);
    const audio=await readFile(new URL('../web/'+clip.src,import.meta.url));
    assert.equal(audio.toString('ascii',0,4),'RIFF');assert.equal(audio.toString('ascii',8,12),'WAVE');
    assert.equal(audio.readUInt32LE(4)+8,audio.length);
  }
});
