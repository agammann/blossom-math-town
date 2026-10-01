export const NUMBERS=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
export const TOKENS=['circle','triangle','square'];
export const COLOURS=['red','blue','yellow'];
const integer=(n,max)=>Number.isInteger(n)&&n>=0&&n<=max;
export function checkSubtraction(a,b,answer){return integer(a,10)&&integer(b,a)&&integer(answer,10)&&answer===a-b;}
export function checkTrail(start,missing,answer){return integer(start,17)&&integer(missing,3)&&integer(answer,20)&&answer===start+missing;}
export function patternNext(unit,index){if(!Array.isArray(unit)||!unit.length||unit.some(x=>!TOKENS.includes(x))||!Number.isInteger(index)||index<0)throw new RangeError('Invalid pattern');return unit[index%unit.length];}
export const checkPattern=(unit,index,answer)=>TOKENS.includes(answer)&&answer===patternNext(unit,index);
export const matchesSort=(object,rule,target)=>['shape','colour','size'].includes(rule)&&object[rule]===target;
export function checkSort(objects,rule,target,selected){
  if(!Array.isArray(objects)||!Array.isArray(selected)||!['shape','colour','size'].includes(rule)||new Set(selected).size!==selected.length||selected.some(i=>!integer(i,objects.length-1)))return false;
  const wanted=objects.flatMap((object,i)=>matchesSort(object,rule,target)?[i]:[]);
  return wanted.length===selected.length&&wanted.every(i=>selected.includes(i));
}
export function measureAnswer(top,bottom,ask){
  if(!Number.isInteger(top)||top<1||top>8||!Number.isInteger(bottom)||bottom<1||bottom>8||!['longer','shorter'].includes(ask))throw new RangeError('Invalid lengths');
  return top===bottom?'same':(ask==='longer'?top>bottom:top<bottom)?'top':'bottom';
}
export const checkMeasure=(top,bottom,ask,answer)=>['top','bottom','same'].includes(answer)&&answer===measureAnswer(top,bottom,ask);
export const SUB_ROUNDS=[];
for(const pair of [[5,2],[3,1],[4,4],[6,0],[8,3],[0,0],[10,5]])SUB_ROUNDS.push(pair);
for(let a=0;a<=10;a++)for(let b=0;b<=a;b++)if(!SUB_ROUNDS.some(([x,y])=>x===a&&y===b))SUB_ROUNDS.push([a,b]);
const units=[['circle','triangle'],['triangle','square'],['square','circle'],['circle','circle','triangle'],['square','triangle','triangle'],['circle','triangle','square']];
const sortObjects=seed=>Array.from({length:9},(_,i)=>({shape:TOKENS[(i+seed)%3],colour:COLOURS[(Math.floor(i/3)+seed)%3],size:(i+Math.floor(i/3)+seed)%2?'small':'large'}));
export function moreRound(view,set,index){
  if(!Number.isInteger(set)||set<0||!Number.isInteger(index)||index<0)throw new RangeError('Invalid round');
  const n=set*5+index;
  if(view==='subtract'){const [a,b]=SUB_ROUNDS[n%SUB_ROUNDS.length];return {a,b};}
  if(view==='trail')return {start:(Math.floor(n/4)*5)%18,missing:(n+2)%4};
  if(view==='pattern'){const unit=units[n%units.length];return {unit,patternLength:unit.length*2+(n%2)};}
  if(view==='sort'){const rule=['colour','shape','size'][n%3],objects=sortObjects(n);return {rule,target:objects[(n*2)%9][rule],objects};}
  if(view==='measure')return {top:n%5===2?4:2+(n*3)%7,bottom:n%5===2?4:1+(n*5+3)%8,ask:n%2?'shorter':'longer'};
  throw new RangeError('Unknown game');
}
