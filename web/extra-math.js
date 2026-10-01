export const SHAPES=['circle','triangle','square','rectangle'];
const uniquePairs=(first,max)=>{
  const result=[...first],seen=new Set(first.map(p=>p.join(',')));
  for(let a=0;a<=10;a++)for(let b=0;b<=10;b++)if(a+b<=max&&!seen.has([a,b].join(',')))result.push([a,b]);
  return result;
};
export const ADD_ROUNDS=uniquePairs([[2,3],[1,4],[0,5],[3,3],[4,2],[1,0],[5,4],[2,6],[0,0],[5,5]],10);
export const COMPARE_ROUNDS=uniquePairs([[3,5],[6,2],[4,4],[0,3],[5,1],[10,9],[0,0],[1,0],[6,6],[2,8]],20).flatMap(([left,right])=>['more','fewer'].map(ask=>({left,right,ask})));
export const SHAPE_ROUNDS=Array.from({length:12},(_,i)=>({shape:SHAPES[i%4],rotation:[0,18,-25][Math.floor(i/4)],color:['#ea79a6','#28a5a4','#8571d3'][Math.floor(i/4)]}));
const validNumber=n=>Number.isInteger(n)&&n>=0&&n<=10;
export function checkAddition(a,b,answer){return validNumber(a)&&validNumber(b)&&a+b<=10&&validNumber(answer)&&answer===a+b;}
export function compareAnswer(left,right,ask='more'){
  if(!validNumber(left)||!validNumber(right)||!['more','fewer'].includes(ask))throw new RangeError('Invalid comparison');
  if(left===right)return 'same';
  return (ask==='more'?left>right:left<right)?'left':'right';
}
export function checkCompare(left,right,ask,answer){return ['left','right','same'].includes(answer)&&compareAnswer(left,right,ask)===answer;}
export function checkShape(target,answer){return SHAPES.includes(target)&&SHAPES.includes(answer)&&target===answer;}
export function extraRound(view,set,index){
  if(!Number.isInteger(set)||set<0||!Number.isInteger(index)||index<0)throw new RangeError('Invalid round');
  const pool={add:ADD_ROUNDS,compare:COMPARE_ROUNDS,shape:SHAPE_ROUNDS}[view];
  if(!pool)throw new RangeError('Unknown game');
  const value=pool[(set*5+index)%pool.length];
  return view==='add'?{a:value[0],b:value[1]}:{...value};
}
