import {GAMES,SHAPE_INFO,additionSuccess,countedBerries,basketCount,compareSuccess} from './lessons.js';
import {SHAPES,extraRound,checkAddition,checkCompare,compareAnswer,checkShape} from './extra-math.js';
export const isExtra=view=>['add','compare','shape'].includes(view);
export function prepareExtraRound(state){
  const question=state.mode==='watch'?{add:{a:2,b:3},compare:{left:3,right:5,ask:'more'},shape:{shape:'circle',rotation:0,color:'#ea79a6'}}[state.view]:extraRound(state.view,state.set,state.round);
  Object.assign(state,question,{hint:false,marked:[],revealed:[],wrong:null,demoStage:0,guide:state.view==='shape'?(state.round%2?'sunny':'ziggy'):GAMES[state.view].teacher});
}
export function extraPrompt(state){return state.view==='add'?GAMES.add.prompt:state.view==='compare'?GAMES.compare[state.ask+'Prompt']:SHAPE_INFO[state.shape].prompt;}
export function shapeSvg(shape,{rotation=0,color='#5c7fdd',hint=false}={}){
  const geometry={circle:'<circle cx="100" cy="70" r="52"/>',triangle:'<polygon points="100,15 175,125 25,125"/>',square:'<rect x="54" y="24" width="92" height="92"/>',rectangle:'<rect x="20" y="35" width="160" height="70"/>'}[shape];
  const corners={circle:[],triangle:[[100,15],[175,125],[25,125]],square:[[54,24],[146,24],[146,116],[54,116]],rectangle:[[20,35],[180,35],[180,105],[20,105]]}[shape];
  return `<svg viewBox="0 0 200 150" aria-hidden="true" focusable="false"><g transform="rotate(${rotation} 100 70)"><g fill="${color}" stroke="#33466b" stroke-width="4" stroke-linejoin="round">${geometry}</g>${hint?corners.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="10" fill="#fff6ca" stroke="#765b14" stroke-width="2"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="12" font-weight="900" fill="#493818">${i+1}</text>`).join(''):''}</g></svg>`;
}
function additionBoard(state,art){
  const group=side=>{
    const count=state[side==='left'?'a':'b'];
    return `<div class="pond-group" aria-label="${side} group: ${count} berries"><p class="group-name">${side==='left'?'First group':'Second group'}</p><div class="pond-berries">${count?Array.from({length:count},(_,i)=>{
      const id=side+'-'+i,ordinal=state.marked.indexOf(id)+1;
      return `<button class="pond-berry ${ordinal?'counted':''}" id="add-${id}" aria-label="${side} berry ${i+1}${ordinal?`, counted as ${ordinal}`:'. Tap to count'}" ${state.mode==='watch'||state.solved?'disabled':''}>${art('berry')}${ordinal?`<span class="count-label">${ordinal}</span>`:''}</button>`;
    }).join(''):'<span class="empty-group">0 berries</span>'}</div></div>`;
  };
  return `<div class="pond-board">${group('left')}<span class="join-symbol" aria-label="plus">+</span>${group('right')}</div><p class="equation">${state.a} + ${state.b} = ${state.solved?state.a+state.b:'?'}</p>`;
}
function compareBoard(state,art){
  const group=side=>{
    const count=state[side],shown=state.hint||state.revealed.includes(side),paired=Math.min(state.left,state.right);
    return `<section class="basket ${state.hint&&count>paired?'extra-berries':''}" aria-label="${side} basket, ${count} berries"><h3>${side==='left'?'Left basket':'Right basket'}</h3><div class="basket-berries">${count?Array.from({length:count},(_,i)=>`<span class="basket-berry ${state.hint&&i>=paired?'leftover':''}">${art('berry')}${shown?`<span>${i+1}</span>`:''}</span>`).join(''):'<span class="empty-group">0 berries</span>'}</div><button id="count-${side}" class="secondary count-basket" ${state.mode==='watch'?'disabled':''}>${shown?count+' berries':'Count '+side}</button></section>`;
  };
  return `<div class="compare-baskets">${group('left')}${group('right')}</div>${state.hint?'<p class="helper-text compare-hint">Match a berry from each basket. Look for berries left over.</p>':''}`;
}
function shapeBoard(state){
  const info=SHAPE_INFO[state.shape];
  return `<div class="shape-target"><p>${state.mode==='watch'?'Explore this shape':`Find ${info.spoken}.`}</p>${shapeSvg(state.shape,{rotation:state.rotation,color:state.color,hint:state.hint})}${state.hint?`<p class="shape-clue">${info.hint}</p>`:''}</div>${state.mode==='practice'?`<div class="shape-choices" aria-label="Choose a shape">${SHAPES.map(shape=>`<button id="shape-${shape}" class="shape-choice ${state.wrong===shape?'wrong':''} ${state.solved&&state.shape===shape?'correct':''}" ${state.solved?'disabled':''}>${shapeSvg(shape)}<span>${SHAPE_INFO[shape].label}</span></button>`).join('')}</div>`:''}`;
}
export function renderExtra(state,ctx){
  const {art,work,stopFlow,say,renderWork,setMode,navigate,sets}=ctx;
  const game=GAMES[state.view];const focus=document.activeElement?.id;
  ctx.syncTeacher();
  if(state.finished){
    work.innerHTML=`<div class="finish">${art(state.guide)}<h2>${state.view==='add'?'Lovely adding!':state.view==='compare'?'Lovely comparing!':'Wonderful shape spotting!'}</h2><p>Five little adventures complete. Thank you for helping ${game.name}!</p><div class="finish-actions"><button id="play-again" class="primary">Play again</button><button id="finish-town" class="secondary">Back to town</button></div></div>`;
    work.querySelector('#play-again').onclick=()=>{sets[state.view]++;state.set=sets[state.view];setMode('practice');};
    work.querySelector('#finish-town').onclick=()=>navigate('town');return;
  }
  const watch=state.mode==='watch';
  const title=state.view==='add'?'How many altogether?':state.view==='compare'?`Which basket has ${state.ask}?`:watch?'Shapes all around':'Find the shape';
  work.innerHTML=`<div class="work-heading"><h2>${title}</h2><span class="round-note">${watch?'Little lesson':`Round ${state.round+1} of 5`}</span></div>
    ${state.view==='add'?additionBoard(state,art):state.view==='compare'?compareBoard(state,art):shapeBoard(state)}
    ${state.view==='add'&&!watch?`<p class="answers-title">Choose how many altogether.</p><div class="answers addition-answers" aria-label="Choose a total">${Array.from({length:11},(_,n)=>`<button id="extra-answer-${n}" class="answer ${state.wrong===n?'wrong':''} ${state.solved&&state.a+state.b===n?'correct':''}" ${state.solved?'disabled':''}>${n}</button>`).join('')}</div>`:''}
    ${state.view==='compare'&&!watch?`<div class="compare-choices" aria-label="Choose a basket"><button class="secondary ${state.wrong==='left'?'wrong':''}" id="choose-left" ${state.solved?'disabled':''}>Left basket</button><button class="secondary ${state.wrong==='same'?'wrong':''}" id="choose-same" ${state.solved?'disabled':''}>Same amount</button><button class="secondary ${state.wrong==='right'?'wrong':''}" id="choose-right" ${state.solved?'disabled':''}>Right basket</button></div>`:''}
    <p id="feedback" class="feedback ${state.feedbackType}" role="status">${state.feedback}</p>
    <div class="lesson-actions">${watch?`<button id="watch-demo" class="primary">${state.running?'Restart lesson':'Watch '+game.name}</button><button id="try-it" class="secondary">My turn</button>${state.running?'<button id="stop-demo" class="secondary">Stop lesson</button>':''}`:state.solved?`<button id="next-round" class="primary">${state.round===4?'All done':'Next round'}</button>`:'<button id="hint" class="secondary">Show a hint</button><button id="reset-round" class="secondary">Start over</button>'}</div>
    ${watch?'<p class="demo-label">A short animated lesson. Watch as often as you like.</p>':`<div class="progress-track" aria-label="${state.round+(state.solved?1:0)} of five activities complete">${Array.from({length:5},(_,i)=>`<span class="progress-dot ${i<state.round+(state.solved?1:0)?'done':''}"></span>`).join('')}</div>`}`;
  const bind=(id,fn)=>work.querySelector('#'+id)?.addEventListener('click',fn);
  bind('watch-demo',()=>runExtraDemo(state,ctx));bind('try-it',()=>setMode('practice'));
  bind('stop-demo',()=>{stopFlow();renderWork();say('We can take a little pause. Press Watch to start again.');});
  bind('next-round',()=>nextExtraRound(state,ctx));
  bind('reset-round',()=>{stopFlow();state.marked=[];state.revealed=[];state.hint=false;state.wrong=null;state.feedback='';state.feedbackType='';renderWork();say(extraPrompt(state));});
  bind('hint',()=>{
    stopFlow();state.hint=true;
    if(state.view==='add')state.marked=[...Array.from({length:state.a},(_,i)=>'left-'+i),...Array.from({length:state.b},(_,i)=>'right-'+i)];
    if(state.view==='shape')state.guide='sunny';
    renderWork();say(state.view==='shape'?SHAPE_INFO[state.shape].hint:state.view==='add'&&state.a+state.b===0?game.emptyHint:state.view==='compare'&&state.left===state.right?game.sameHint:game.hint);
  });
  if(!watch&&state.view==='add'){
    for(const side of ['left','right'])for(let i=0;i<state[side==='left'?'a':'b'];i++)bind('add-'+side+'-'+i,()=>{
      if(state.solved)return;stopFlow();const id=side+'-'+i;if(!state.marked.includes(id))state.marked.push(id);
      state.feedback='';state.wrong=null;renderWork();say(countedBerries(state.marked.indexOf(id)+1));
    });
    for(let n=0;n<=10;n++)bind('extra-answer-'+n,()=>answerExtra(state,n,ctx));
  }
  if(!watch&&state.view==='compare'){
    for(const side of ['left','right'])bind('count-'+side,()=>{stopFlow();if(!state.revealed.includes(side))state.revealed.push(side);renderWork();say(basketCount(side,state[side]));});
    for(const answer of ['left','right','same'])bind('choose-'+answer,()=>answerExtra(state,answer,ctx));
  }
  if(!watch&&state.view==='shape')for(const shape of SHAPES)bind('shape-'+shape,()=>answerExtra(state,shape,ctx));
  const target=focus&&document.getElementById(focus);if(target&&!target.disabled)target.focus({preventScroll:true});
}
function answerExtra(state,answer,ctx){
  if(state.solved||state.mode!=='practice')return;
  ctx.stopFlow();
  const correct=state.view==='add'?checkAddition(state.a,state.b,answer):state.view==='compare'?checkCompare(state.left,state.right,state.ask,answer):checkShape(state.shape,answer);
  state.wrong=correct?null:answer;state.solved=correct;state.feedbackType=correct?'success':'retry';
  state.feedback=correct?(state.view==='add'?`Yes! ${state.a} + ${state.b} = ${state.a+state.b}.`:state.view==='compare'?(answer==='same'?'Yes! Both baskets have the same amount.':`Yes! The ${answer} basket has ${state.ask}.`):`Yes! ${SHAPE_INFO[state.shape].label}.`):"Let's try again. Have another look, or show a hint.";
  ctx.renderWork();ctx.say(correct?(state.view==='add'?additionSuccess(state.a,state.b):state.view==='compare'?compareSuccess(answer,state.ask):SHAPE_INFO[state.shape].success):GAMES[state.view].retry);
  if(correct)document.getElementById('next-round').focus({preventScroll:true});
}
function nextExtraRound(state,ctx){
  if(!state.solved)return;ctx.stopFlow();
  if(state.round===4){state.finished=true;ctx.renderWork();ctx.say(GAMES[state.view].finish);document.getElementById('play-again').focus({preventScroll:true});return;}
  state.round++;state.solved=false;state.feedback='';state.feedbackType='';prepareExtraRound(state);ctx.renderWork();ctx.say(extraPrompt(state));
  const heading=document.querySelector('.work-heading h2');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
}
async function runExtraDemo(state,ctx){
  ctx.stopFlow();prepareExtraRound(state);state.feedback='';state.feedbackType='';state.solved=false;state.running=true;
  const token=ctx.getEpoch();ctx.renderWork();const game=GAMES[state.view];
  if(state.view==='add'){
    if(!await ctx.beat(game.demoStart,2200,token))return;
    if(!await ctx.beat(game.demoJoin,1600,token))return;
    for(const side of ['left','right'])for(let i=0;i<state[side==='left'?'a':'b'];i++){
      if(token!==ctx.getEpoch())return;state.marked.push(side+'-'+i);ctx.renderWork();
      if(!await ctx.beat(countedBerries(state.marked.length),850,token))return;
    }
    state.solved=true;ctx.renderWork();if(!await ctx.beat(game.demoEnd,2600,token))return;state.feedback='2 + 3 = 5. Five berries altogether.';
  }else if(state.view==='compare'){
    if(!await ctx.beat(game.demoStart,2200,token))return;state.hint=true;ctx.renderWork();
    if(!await ctx.beat(game.demoPair,2200,token))return;
    state.demoStage=2;ctx.renderWork();if(!await ctx.beat(game.demoEnd,2600,token))return;state.feedback='5 is more than 3. 3 is fewer than 5.';
  }else{
    for(const [i,shape] of SHAPES.entries()){
      if(token!==ctx.getEpoch())return;state.shape=shape;state.guide=i<2?'ziggy':'sunny';state.rotation=i===2?18:0;state.hint=true;ctx.renderWork();
      if(!await ctx.beat(SHAPE_INFO[shape].demo,2300,token))return;
    }
    state.feedback='Circles, triangles, squares, and long rectangles!';
  }
  if(token!==ctx.getEpoch())return;state.running=false;state.feedbackType='success';ctx.renderWork();ctx.say("Now it's your turn! Press My turn to play.");
}
