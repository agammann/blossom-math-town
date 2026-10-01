import {GAMES} from './lessons.js';
import {SHAPE_INFO} from './lessons.js';
import {shapeSvg} from './extra-games.js';
import {moreRound,TOKENS,patternNext,matchesSort,checkSubtraction,checkTrail,checkPattern,checkSort,checkMeasure,measureAnswer} from './more-math.js';
import {subtractionSuccess,trailSuccess} from './more-lessons.js';
export const isMore=view=>['subtract','trail','pattern','sort','measure'].includes(view);
const colours={red:'#eb7580',blue:'#719bdf',yellow:'#f5c856'};
const tokenColour={circle:colours.red,triangle:colours.blue,square:colours.yellow};
export function prepareMoreRound(state){
  const question=state.mode==='watch'?moreRound(state.view,0,0):moreRound(state.view,state.set,state.round);
  if(state.mode==='watch'&&state.view==='measure')Object.assign(question,{top:6,bottom:3,ask:'longer'});
  if(state.mode==='watch'&&state.view==='pattern')question.patternLength=6;
  Object.assign(state,question,{hint:false,taken:[],selected:[],wrong:null,demoStage:0,guide:GAMES[state.view].teacher});
}
export const morePrompt=state=>state.view==='measure'?GAMES.measure[state.ask+'Prompt']:GAMES[state.view].prompt;
const ruleText=state=>state.rule==='colour'?`Choose every ${state.target} treasure`:state.rule==='shape'?`Choose every ${state.target}`:`Choose every ${state.target} treasure`;
function board(state,art){
  const watch=state.mode==='watch';
  if(state.view==='subtract')return `<p class="puzzle-instruction">Otto has <strong>${state.a}</strong> berries. Take away <strong>${state.b}</strong>.</p><div class="take-board">${state.a?Array.from({length:state.a},(_,i)=>`<button class="take-berry ${state.taken.includes(i)?'taken':''}" id="take-${i}" aria-label="Berry ${i+1}${state.taken.includes(i)?', taken away':'. Tap to take away'}" ${watch||state.solved?'disabled':''}>${art('berry')}<span aria-hidden="true">${state.taken.includes(i)?'×':state.hint?i-state.b+1:''}</span></button>`).join(''):'<p class="empty-group">0 berries</p>'}</div><p class="equation">${state.a} − ${state.b} = ${state.solved?state.a-state.b:'?'}</p><p class="helper-text">${state.taken.length} of ${state.b} taken away. Tap a crossed-out berry to put it back.</p>`;
  if(state.view==='trail')return `<div class="number-trail" aria-label="Number trail">${Array.from({length:4},(_,i)=>`<span class="stepping-stone ${i===state.missing?'missing':''}">${i===state.missing&&!state.solved&&!state.hint?'?':state.start+i}</span>`).join('')}</div><p class="helper-text">One more on each step.</p>`;
  if(state.view==='pattern')return `<div class="pattern-strip" aria-label="Repeating pattern">${Array.from({length:state.patternLength},(_,i)=>`<span class="pattern-token ${state.hint?'pattern-group':''} ${i%state.unit.length===0?'group-start':''} ${(i+1)%state.unit.length===0?'group-end':''}" aria-label="${patternNext(state.unit,i)}">${shapeSvg(patternNext(state.unit,i),{color:tokenColour[patternNext(state.unit,i)]})}</span>`).join('')}<span class="pattern-token missing" aria-label="Next shape">${state.solved?shapeSvg(patternNext(state.unit,state.patternLength),{color:tokenColour[patternNext(state.unit,state.patternLength)]}):'?'}</span></div>${state.hint?`<p class="helper-text">Repeating group: ${state.unit.join(', ')}.</p>`:''}`;
  if(state.view==='sort')return `<p class="sorting-rule">${ruleText(state)}</p><div class="sort-grid" aria-label="Treasure collection">${state.objects.map((object,i)=>`<button id="sort-${i}" class="sort-object ${state.selected.includes(i)?'selected':''} ${state.hint&&matchesSort(object,state.rule,state.target)?'rule-match':''}" aria-label="${object.size} ${object.colour} ${object.shape}" aria-pressed="${state.selected.includes(i)}" ${watch||state.solved?'disabled':''}><span class="treasure ${object.size}">${shapeSvg(object.shape,{color:colours[object.colour]})}</span><span class="selection-mark" aria-hidden="true">${state.selected.includes(i)?'✓':'+'}</span></button>`).join('')}</div><p class="helper-text">${state.selected.length} treasures selected. Tap again to remove one.</p>`;
  return `<p class="puzzle-instruction">Find the <strong>${state.ask}</strong> ribbon, or choose the same length.</p><div class="ribbon-board"><div class="ribbon-row"><span>Top</span><div class="ribbon-track"><div class="ribbon top-ribbon" style="width:${state.top/8*100}%">${state.hint?Array.from({length:state.top},()=>'<i></i>').join(''):''}</div></div></div><div class="ribbon-row"><span>Bottom</span><div class="ribbon-track"><div class="ribbon bottom-ribbon" style="width:${state.bottom/8*100}%">${state.hint?Array.from({length:state.bottom},()=>'<i></i>').join(''):''}</div></div></div></div><p class="helper-text">Both ribbons start at the dotted line.</p>`;
}
function choices(state){
  if(state.mode==='watch')return '';
  if(state.view==='subtract')return `<div class="answers addition-answers" aria-label="Choose how many left">${Array.from({length:11},(_,n)=>answerButton(state,n,String(n))).join('')}</div>`;
  if(state.view==='trail'){
    const correct=state.start+state.missing,options=[correct,(correct+1)%21,(correct+20)%21,(correct+5)%21].sort((a,b)=>a-b);
    return `<div class="trail-answers answers" aria-label="Choose the missing number">${options.map(n=>answerButton(state,n,String(n))).join('')}</div>`;
  }
  if(state.view==='pattern')return `<div class="pattern-choices" aria-label="Choose the next shape">${TOKENS.map(token=>answerButton(state,token,shapeSvg(token,{color:tokenColour[token]})+`<span>${SHAPE_INFO[token].label}</span>`)).join('')}</div>`;
  if(state.view==='sort')return '';
  return `<div class="compare-choices" aria-label="Choose a ribbon">${[['top','Top ribbon'],['same','Same length'],['bottom','Bottom ribbon']].map(([value,label])=>answerButton(state,value,label)).join('')}</div>`;
}
const answerButton=(state,value,label)=>`<button class="${typeof value==='number'?'answer':'secondary'} ${state.wrong===value?'wrong':''}" id="more-answer-${value}" ${state.solved?'disabled':''}>${label}</button>`;
const titles={subtract:'How many are left?',trail:'Find the missing number',pattern:'What comes next?',sort:'Sort by the rule',measure:'Compare our ribbons'};
export function renderMore(state,ctx){
  const {art,work,stopFlow,say,renderWork,setMode,navigate,sets}=ctx;const game=GAMES[state.view],focus=document.activeElement?.id;ctx.syncTeacher();
  if(state.finished){
    work.innerHTML=`<div class="finish">${art(game.teacher)}<h2>Lovely exploring!</h2><p>Five little adventures complete. Thank you for helping ${game.name}!</p><div class="finish-actions"><button id="play-again" class="primary">Play again</button><button id="finish-town" class="secondary">Back to town</button></div></div>`;
    work.querySelector('#play-again').onclick=()=>{sets[state.view]++;state.set=sets[state.view];setMode('practice');};work.querySelector('#finish-town').onclick=()=>navigate('town');return;
  }
  const watch=state.mode==='watch';
  work.innerHTML=`<div class="work-heading"><h2>${titles[state.view]}</h2><span class="round-note">${watch?'Little lesson':`Round ${state.round+1} of 5`}</span></div>${board(state,art)}${choices(state)}<p id="feedback" class="feedback ${state.feedbackType}" role="status">${state.feedback}</p><div class="lesson-actions">${watch?`<button id="watch-demo" class="primary">${state.running?'Restart lesson':'Watch '+game.name}</button><button id="try-it" class="secondary">My turn</button>${state.running?'<button id="stop-demo" class="secondary">Stop lesson</button>':''}`:state.solved?`<button id="next-round" class="primary">${state.round===4?'All done':'Next round'}</button>`:`${state.view==='sort'?'<button id="check-sort" class="primary">Check my collection</button>':''}<button id="hint" class="secondary">Show a hint</button><button id="reset-round" class="secondary">Start over</button>`}</div>${watch?'<p class="demo-label">A short animated lesson. Watch as often as you like.</p>':`<div class="progress-track" aria-label="${state.round+(state.solved?1:0)} of five activities complete">${Array.from({length:5},(_,i)=>`<span class="progress-dot ${i<state.round+(state.solved?1:0)?'done':''}"></span>`).join('')}</div>`}`;
  const bind=(id,fn)=>work.querySelector('#'+id)?.addEventListener('click',fn);
  bind('watch-demo',()=>runMoreDemo(state,ctx));bind('try-it',()=>setMode('practice'));
  bind('stop-demo',()=>{stopFlow();renderWork();say('We can take a little pause. Press Watch to start again.');});
  bind('reset-round',()=>{stopFlow();state.taken=[];state.selected=[];state.hint=false;state.wrong=null;state.feedback='';state.feedbackType='';renderWork();say(morePrompt(state));});
  bind('hint',()=>{stopFlow();state.hint=true;if(state.view==='subtract')state.taken=Array.from({length:state.b},(_,i)=>i);renderWork();say(state.view==='measure'&&state.top===state.bottom?game.sameHint:state.view==='subtract'&&state.a===state.b?game.emptyHint:game.hint);});
  bind('next-round',()=>{
    if(!state.solved)return;stopFlow();
    if(state.round===4){state.finished=true;renderWork();say(game.finish);document.getElementById('play-again').focus({preventScroll:true});return;}
    state.round++;state.solved=false;state.feedback='';state.feedbackType='';prepareMoreRound(state);renderWork();say(morePrompt(state));const heading=document.querySelector('.work-heading h2');heading.tabIndex=-1;heading.focus({preventScroll:true});
  });
  if(!watch){
    for(const button of work.querySelectorAll('[id^="more-answer-"]'))button.onclick=()=>answerMore(state,['subtract','trail'].includes(state.view)?Number(button.id.slice(12)):button.id.slice(12),ctx);
    bind('check-sort',()=>answerMore(state,state.selected,ctx));
    if(state.view==='subtract')for(let i=0;i<state.a;i++)bind('take-'+i,()=>{
      if(state.solved)return;stopFlow();if(state.taken.includes(i))state.taken=state.taken.filter(x=>x!==i);else if(state.taken.length<state.b)state.taken.push(i);state.hint=false;renderWork();
    });
    if(state.view==='sort')for(let i=0;i<state.objects.length;i++)bind('sort-'+i,()=>{
      if(state.solved)return;stopFlow();state.selected=state.selected.includes(i)?state.selected.filter(x=>x!==i):[...state.selected,i];state.feedback='';state.feedbackType='';renderWork();
    });
  }
  const target=focus&&document.getElementById(focus);if(target&&!target.disabled)target.focus({preventScroll:true});
}
function answerMore(state,answer,ctx){
  if(state.solved||state.mode!=='practice')return;ctx.stopFlow();
  const correct=state.view==='subtract'?checkSubtraction(state.a,state.b,answer):state.view==='trail'?checkTrail(state.start,state.missing,answer):state.view==='pattern'?checkPattern(state.unit,state.patternLength,answer):state.view==='sort'?checkSort(state.objects,state.rule,state.target,answer):checkMeasure(state.top,state.bottom,state.ask,answer);
  state.solved=correct;state.wrong=correct?null:answer;state.feedbackType=correct?'success':'retry';
  const success=state.view==='subtract'?subtractionSuccess(state.a,state.b):state.view==='trail'?trailSuccess(state.start+state.missing):GAMES[state.view].success;
  state.feedback=correct?(state.view==='subtract'?`Yes! ${state.a} − ${state.b} = ${state.a-state.b}.`:state.view==='trail'?`Yes! ${state.start+state.missing} is the missing number.`:state.view==='pattern'?`Yes! ${patternNext(state.unit,state.patternLength)} comes next.`:state.view==='measure'?(answer==='same'?'Yes! Both ribbons are the same length.':`Yes! The ${answer} ribbon is ${state.ask}.`):'Yes! Every selected treasure follows our rule.'):'Have another look, or show a hint. You can try again.';
  if(correct&&state.view==='subtract')state.taken=Array.from({length:state.b},(_,i)=>i);
  ctx.renderWork();ctx.say(correct?success:GAMES[state.view].retry);if(correct)document.getElementById('next-round').focus({preventScroll:true});
}
async function runMoreDemo(state,ctx){
  ctx.stopFlow();prepareMoreRound(state);state.feedback='';state.feedbackType='';state.solved=false;state.running=true;
  const token=ctx.getEpoch(),game=GAMES[state.view];ctx.renderWork();if(!await ctx.beat(game.demoStart,1500,token))return;
  if(state.view==='subtract'){
    for(let i=0;i<state.b;i++){if(token!==ctx.getEpoch())return;state.taken.push(i);ctx.renderWork();if(i===0){if(!await ctx.beat(game.demoMove,650,token))return;}else await new Promise(resolve=>setTimeout(resolve,650));}
  }else{
    state.hint=true;if(state.view==='trail')state.solved=true;
    if(state.view==='sort')state.selected=state.objects.flatMap((object,i)=>matchesSort(object,state.rule,state.target)?[i]:[]);
    ctx.renderWork();if(!await ctx.beat(game.demoMove,1500,token))return;
  }
  if(token!==ctx.getEpoch())return;state.solved=true;ctx.renderWork();if(!await ctx.beat(game.demoEnd,1500,token))return;
  state.running=false;state.feedbackType='success';state.feedback='Now you can explore. Press My turn!';ctx.renderWork();ctx.say("Now it's your turn! Press My turn to play.");
}
