import test from 'node:test';
import assert from 'node:assert/strict';
import {checkCount,snackResult} from '../web/math.js';
import {checkAddition,checkCompare,checkShape,SHAPES,ADD_ROUNDS} from '../web/extra-math.js';
import {checkSubtraction,checkTrail,patternNext,checkPattern,checkSort,checkMeasure,moreRound,SUB_ROUNDS} from '../web/more-math.js';
test('Counting and ten-frames include their boundary cases',()=>{
  for(let n=1;n<=10;n++)for(let answer=-1;answer<=11;answer++)assert.equal(checkCount(n,answer),answer===n);
  for(let given=0;given<=10;given++)for(let added=0;added<=10-given;added++)assert.equal(snackResult(given,added).correct,given+added===10);
  assert.throws(()=>snackResult(7,4),RangeError);assert.equal(checkCount(3,'3'),false);
});
test('Every sum and take-away within ten checks exactly one integer answer',()=>{
  assert.equal(ADD_ROUNDS.length,66);assert.equal(SUB_ROUNDS.length,66);
  for(let a=0;a<=10;a++)for(let b=0;b<=10;b++)for(let answer=-1;answer<=11;answer++){
    assert.equal(checkAddition(a,b,answer),a+b<=10&&answer===a+b);
    assert.equal(checkSubtraction(a,b,answer),b<=a&&answer===a-b);
  }
  assert.equal(checkAddition(2,3,'5'),false);assert.equal(checkSubtraction(5,2,3.5),false);
});
test('Comparisons cover unequal, equal, empty and reversed questions',()=>{
  for(let a=0;a<=10;a++)for(let b=0;b<=10;b++)for(const ask of ['more','fewer']){
    const expected=a===b?'same':(ask==='more'?a>b:a<b)?'left':'right';
    for(const answer of ['left','right','same'])assert.equal(checkCompare(a,b,ask,answer),answer===expected);
  }
  for(let top=1;top<=8;top++)for(let bottom=1;bottom<=8;bottom++)for(const ask of ['longer','shorter']){
    const expected=top===bottom?'same':(ask==='longer'?top>bottom:top<bottom)?'top':'bottom';
    for(const answer of ['top','bottom','same'])assert.equal(checkMeasure(top,bottom,ask,answer),answer===expected);
  }
});
test('Number trails reach all numbers from zero through twenty',()=>{
  const reached=new Set();
  for(let n=0;n<72;n++){
    const round=moreRound('trail',Math.floor(n/5),n%5);reached.add(round.start+round.missing);
    for(let answer=0;answer<=20;answer++)assert.equal(checkTrail(round.start,round.missing,answer),answer===round.start+round.missing);
  }
  assert.equal(reached.size,21);
});
test('Patterns repeat their group, and shape checks do not accept another shape',()=>{
  for(const unit of [['circle','triangle'],['circle','circle','triangle'],['circle','triangle','triangle'],['circle','triangle','square']])for(let i=0;i<15;i++){
    assert.equal(patternNext(unit,i),unit[i%unit.length]);
    for(const answer of ['circle','triangle','square'])assert.equal(checkPattern(unit,i,answer),answer===unit[i%unit.length]);
  }
  for(const target of SHAPES)for(const answer of SHAPES)assert.equal(checkShape(target,answer),target===answer);
});
test('Sorting requires all and only matching objects, independent of selection order',()=>{
  for(let n=0;n<18;n++){
    const {objects,rule,target}=moreRound('sort',Math.floor(n/5),n%5);
    const wanted=objects.flatMap((object,i)=>object[rule]===target?[i]:[]);
    assert(wanted.length>0&&wanted.length<objects.length);
    assert.equal(checkSort(objects,rule,target,[...wanted].reverse()),true);
    assert.equal(checkSort(objects,rule,target,wanted.slice(1)),false);
    assert.equal(checkSort(objects,rule,target,[...wanted,wanted[0]]),false);
    assert.equal(checkSort(objects,rule,target,[...wanted,objects.findIndex(object=>object[rule]!==target)]),false);
  }
});
