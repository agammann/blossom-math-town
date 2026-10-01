import { checkCount, snackResult, roundValue, WORDS } from './math.js';
import { MonsterVoices } from './voice.js';
import { GAMES } from './lessons.js';
import { isExtra,prepareExtraRound,extraPrompt,renderExtra } from './extra-games.js';
import { isMore,prepareMoreRound,morePrompt,renderMore } from './more-games.js';

const $ = selector => document.querySelector(selector);
const art = (name, extra='') => `<img src="assets/${name}.webp" alt="" ${extra}>`;
const icons = {
  sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4V4Z" fill="currentColor"/><path d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>',
  mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4V4Z"/><path d="m16 9 6 6m0-6-6 6"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3" fill="#f0f5fb"/><circle cx="16" cy="17" r="3" fill="#f0f5fb"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>',
  replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/></svg>'
};
const sets=Object.fromEntries(Object.keys(GAMES).map(view=>[view,0]));
let epoch=0;
let voiceEpoch=0;
let state={view:'town',caption:''};
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let calm=motionQuery.matches;
const voices = new MonsterVoices(() => queueMicrotask(updateVoiceUi));
$('#settings-open').innerHTML=icons.settings;
$('#settings-close').innerHTML=icons.close;
$('#calm-motion').checked=calm;
document.body.classList.toggle('calm',calm);

function updateVoiceUi() {
  $('#sound-icon').innerHTML=voices.enabled ? icons.sound : icons.mute;
  $('#sound-label').textContent=voices.available ? (voices.enabled?'Sound on':'Sound off') : 'Captions';
  $('#sound').setAttribute('aria-pressed',String(voices.enabled));
  $('#sound').setAttribute('aria-label',voices.enabled?'Mute narration':'Turn narration on');
  $('#voice-status').textContent=voices.describe();
  $('#hear-pip').disabled=!voices.enabled || !voices.available;
  $('#hear-nori').disabled=!voices.enabled || !voices.available;
  const note=$('#speech-mode');
  if(note)note.textContent=voices.hint();
}
function stopFlow() {
  epoch++;
  voiceEpoch++;
  voices.cancel();
  if(state.view!=='town')state.running=false;
  $('.teacher-image')?.classList.remove('talking');
}
function character(){return state.guide||GAMES[state.view]?.teacher||'pip';}
function extraContext(){return {art,work:$('#work'),stopFlow,say,renderWork,setMode,navigate,sets,beat,getEpoch:()=>epoch,syncTeacher(){
  const guide=character();$('.teacher-image').src=`assets/${guide}.webp`;
  $('.teacher-name').textContent=guide[0].toUpperCase()+guide.slice(1);
  const buddy=$('.teacher-buddy');if(buddy){const companion=guide==='ziggy'?'sunny':'ziggy';buddy.src=`assets/${companion}.webp`;buddy.alt=`${companion[0].toUpperCase()+companion.slice(1)} is helping too`;}
}};}
function caption(text) {
  state.caption=text;
  const element=$('#caption');
  if(element)element.textContent=text;
}
async function say(text) {
  caption(text);
  const sequence=++voiceEpoch;
  const image=$('.teacher-image');
  if(voices.enabled && voices.available)image?.classList.add('talking');
  await voices.say(text,character());
  if(sequence===voiceEpoch)image?.classList.remove('talking');
}
const wait = ms => new Promise(resolve=>setTimeout(resolve,ms));
async function beat(text, ms, token) {
  if(token!==epoch)return false;
  await Promise.all([say(text),wait(ms)]);
  return token===epoch;
}
function navigate(view) {
  if(view==='town')location.hash='';
  else location.hash=view;
}
function openView(view) {
  stopFlow();
  if(view==='town') {
    state={view:'town',caption:''};
    $('#app').innerHTML=`<section class="town expanded-town" aria-label="Blossom town. Choose an adventure.">
      ${art('town','class="town-art" fetchpriority="high"')}
      <div class="town-scene"><h1>Choose an adventure</h1><div class="town-crew" aria-label="Your monster friends">${['pip','nori','milo','tilly','ziggy','sunny','otto','poppy','luna'].map(name=>`<figure>${art(name)}<figcaption>${name[0].toUpperCase()+name.slice(1)}</figcaption></figure>`).join('')}</div></div>
      <div class="destinations">${Object.entries(GAMES).map(([view,game])=>`<button class="destination" id="open-${view}" aria-label="${game.title}"><span class="destination-art">${art(game.teacher)}${view==='shape'?art('sunny'):''}</span><span class="destination-title">${game.title}</span><span class="destination-skill">${game.skill}</span></button>`).join('')}</div>
    </section>`;
    for(const view of Object.keys(GAMES))$('#open-'+view).onclick=()=>navigate(view);
    document.title='Blossom · Little math adventures';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    return;
  }
  state={view,mode:'watch',round:0,set:sets[view],given:view==='count'?3:view==='snack'?6:null,marked:[],added:[],solved:false,finished:false,running:false,feedback:'',feedbackType:'',caption:''};
  if(isExtra(view))prepareExtraRound(state);
  if(isMore(view))prepareMoreRound(state);
  const name=GAMES[view].name;
  document.title=`${GAMES[view].title} — Blossom`;
  $('#app').innerHTML=`<section class="activity">
    <div class="activity-header"><div class="activity-title"><button class="town-back" id="town-back">Town</button><h1 tabindex="-1">${GAMES[view].title}</h1></div>
    <div class="mode-tabs" aria-label="Lesson mode"><button id="watch-tab" class="selected" aria-pressed="true">Watch ${name}</button><button id="practice-tab" aria-pressed="false">My turn</button></div></div>
    <div class="lesson-layout"><aside class="teacher" aria-label="Your monster teacher"><p class="teacher-name">${view==='shape'?'Ziggy':name}</p><div class="teachers-art">${art(character(),'class="teacher-image"')}${view==='shape'?'<img class="teacher-buddy" src="assets/sunny.webp" alt="Sunny is helping too">':''}</div>
      <div class="speech"><p id="caption" role="status" aria-live="polite" aria-atomic="true"></p><div class="replay-line"><button id="replay-caption" class="replay-caption">${icons.replay}Hear again</button><span class="caption-note" id="speech-mode">Captions on</span></div></div></aside>
      <section class="work-area" id="work" aria-label="Math play area"></section></div></section>`;
  $('#town-back').onclick=()=>navigate('town');
  $('#watch-tab').onclick=()=>setMode('watch');
  $('#practice-tab').onclick=()=>setMode('practice');
  $('#replay-caption').onclick=()=>{stopFlow();renderWork();void say(state.caption);};
  renderWork();
  updateVoiceUi();
  say(isExtra(view)||isMore(view)?GAMES[view].greeting:view==='count'?"Hi, I'm Pip! Want to count berries with me? Watch me, or try it yourself!":"Hello, I'm Nori! Let's make a tray of ten snacks. Watch me, or try it yourself!");
  $('.activity h1').focus({preventScroll:true});
  window.scrollTo({top:0,left:0,behavior:'instant'});
}
function setMode(mode) {
  stopFlow();
  state.mode=mode;
  state.round=0;
  state.finished=false;
  state.solved=false;
  state.marked=[];
  state.added=[];
  state.feedback='';
  state.feedbackType='';
  state.given=isExtra(state.view)||isMore(state.view)?null:mode==='watch'?(state.view==='count'?3:6):roundValue(state.view,state.set,0);
  if(isExtra(state.view))prepareExtraRound(state);
  if(isMore(state.view))prepareMoreRound(state);
  $('#watch-tab').classList.toggle('selected',mode==='watch');
  $('#practice-tab').classList.toggle('selected',mode==='practice');
  $('#watch-tab').setAttribute('aria-pressed',String(mode==='watch'));
  $('#practice-tab').setAttribute('aria-pressed',String(mode==='practice'));
  $('.teacher-image').src=`assets/${character()}.webp`;
  renderWork();
  if(mode==='watch')say(isExtra(state.view)||isMore(state.view)?GAMES[state.view].watchIntro:state.view==='count'?"Let's count one berry at a time. Press Watch to see how.":'This tray has ten spaces. Press Watch to make ten with me.');
  else promptRound();
}
function promptRound() {
  if(isMore(state.view)){say(morePrompt(state));return;}
  if(isExtra(state.view)){say(extraPrompt(state));return;}
  if(state.view==='count')say('How many berries do you see? You can touch each berry, then choose a number.');
  else say(state.given===10?"Ooh, this tray already has ten crackers! How many more snacks does it need? Check your tray when you're ready.":`Nori has ${WORDS[state.given]} ${state.given===1?'cracker':'crackers'}. How many berries make ten? Tap the empty spaces to add berries.`);
}
function berryBoard() {
  const length=state.given;
  return `<div class="garden-bed" aria-label="Berry patch">${Array.from({length},(_,i)=>{
    const count=state.marked.indexOf(i)+1;
    return `<button id="berry-${i}" class="berry-button ${count?'counted':''} ${count===state.marked.length && count?'just':''}" aria-label="Berry ${i+1}${count?`, counted as ${WORDS[count]}`:'. Tap to count'}" ${state.mode==='watch'||state.solved?'disabled':''}>${art('berry')}${count?`<span class="count-label" aria-hidden="true">${count}</span>`:''}</button>`;
  }).join('')}</div>`;
}
function trayBoard() {
  const result=snackResult(state.given,state.added.length);
  return `<div class="ten-frame" role="group" aria-label="Ten-frame: ${state.given} crackers, ${state.added.length} berries, ${10-result.total} empty spaces">${Array.from({length:10},(_,i)=>{
    const given=i<state.given, added=state.added.includes(i);
    return `<button id="space-${i}" class="frame-cell ${given?'filled':added?'added':''} ${state.hint&&!given&&!added?'hint':''}" aria-label="Space ${i+1}. ${given?'Cracker':added?'Berry. Tap to remove':'Empty. Tap to add a berry'}" ${given||state.mode==='watch'||state.solved?'disabled':''}>${given?art('cracker'):added?art('berry'):''}</button>`;
  }).join('')}</div><div class="snack-counter">${art('berry')}<span>You added <strong>${state.added.length}</strong> ${state.added.length===1?'berry':'berries'}</span></div>
  <p class="equation" aria-label="${state.given} plus ${state.solved?state.added.length:'how many'} equals ten">${state.given} + ${state.solved?state.added.length:'?'} = 10</p>`;
}
function renderWork() {
  if(state.view==='town')return;
  if(isMore(state.view)){renderMore(state,extraContext());return;}
  if(isExtra(state.view)){renderExtra(state,extraContext());return;}
  const focus=document.activeElement?.id;
  const name=state.view==='count'?'Pip':'Nori';
  if(state.finished) {
    $('#work').innerHTML=`<div class="finish">${art(character()+'-happy')}<h2>${state.view==='count'?'Lovely counting!':'Ten out of ten snacks!'}</h2><p>${state.view==='count'?'Five berry baskets counted. Thank you for helping Pip!':'Five snack trays ready. Thank you for helping Nori!'}</p><div class="finish-actions"><button id="play-again" class="primary">Play again</button><button id="finish-town" class="secondary">Back to town</button></div></div>`;
    $('#play-again').onclick=()=>{sets[state.view]++;state.set=sets[state.view];setMode('practice');};
    $('#finish-town').onclick=()=>navigate('town');
    return;
  }
  const watch=state.mode==='watch';
  $('#work').innerHTML=`<div class="work-heading"><h2>${state.view==='count'?(watch?'One berry at a time':'How many berries?'):(watch?'Let’s make 10':'Make 10 snacks')}</h2><span class="round-note">${watch?'Little lesson':`${state.view==='count'?'Basket':'Tray'} ${state.round+1} of 5`}</span></div>
    ${state.view==='count'?berryBoard():trayBoard()}
    ${!watch && state.view==='count'?`<p class="answers-title">Choose how many.</p><div class="answers" aria-label="Choose a number">${Array.from({length:10},(_,i)=>`<button class="answer ${state.wrong===i+1?'wrong':''} ${state.solved&&state.given===i+1?'correct':''}" id="answer-${i+1}" ${state.solved?'disabled':''}>${i+1}</button>`).join('')}</div><p class="helper-text">Touch each berry once to count along.</p>`:''}
    ${!watch && state.view==='snack'&&!state.solved?`<p class="helper-text">Tap a space to add a berry. Tap a berry to take it out.</p><div class="tray-actions"><button id="add-berry" class="secondary" ${state.given+state.added.length===10?'disabled':''}>Add a berry</button><button id="remove-berry" class="secondary" ${!state.added.length?'disabled':''}>Take one out</button></div>`:''}
    <p id="feedback" class="feedback ${state.feedbackType}" role="status">${state.feedback}</p>
    <div class="lesson-actions">${watch?`<button id="watch-demo" class="primary">${state.running?'Restart lesson':'Watch '+name}</button><button id="try-it" class="secondary">My turn</button>${state.running?'<button id="stop-demo" class="secondary">Stop lesson</button>':''}`:
      state.solved?`<button id="next-round" class="primary">${state.round===4?'All done':'Next '+(state.view==='count'?'basket':'tray')}</button>`:
      `${state.view==='snack'?'<button id="check-tray" class="primary">Check my tray</button>':''}<button id="hint" class="secondary">${state.view==='count'?'Count with Pip':'Show a hint'}</button><button id="reset-round" class="secondary">Start over</button>`}</div>
    ${watch?'<p class="demo-label">A short animated lesson. Watch as often as you like.</p>':`<div class="progress-track" aria-label="${state.round+(state.solved?1:0)} of five activities complete">${Array.from({length:5},(_,i)=>`<span class="progress-dot ${i<state.round+(state.solved?1:0)?'done':''}"></span>`).join('')}</div>`}`;
  $('#watch-demo')?.addEventListener('click',()=>runDemo());
  $('#stop-demo')?.addEventListener('click',()=>{stopFlow();renderWork();say('We can take a little pause. Press Watch to start again.');});
  $('#try-it')?.addEventListener('click',()=>setMode('practice'));
  $('#next-round')?.addEventListener('click',nextRound);
  $('#hint')?.addEventListener('click',hint);
  $('#reset-round')?.addEventListener('click',resetRound);
  $('#check-tray')?.addEventListener('click',checkTray);
  $('#add-berry')?.addEventListener('click',()=>toggleSpace(Array.from({length:10},(_,i)=>i).find(i=>i>=state.given&&!state.added.includes(i))));
  $('#remove-berry')?.addEventListener('click',()=>toggleSpace(state.added.at(-1)));
  if(!watch && state.view==='count') {
    for(let i=0;i<state.given;i++)$(`#berry-${i}`).onclick=()=>countBerry(i);
    for(let n=1;n<=10;n++)$(`#answer-${n}`).onclick=()=>answerCount(n);
  }
  if(!watch && state.view==='snack')for(let i=state.given;i<10;i++)$(`#space-${i}`).onclick=()=>toggleSpace(i);
  if(focus){const target=document.getElementById(focus);if(target&&!target.disabled)target.focus({preventScroll:true});}
}
function countBerry(index) {
  if(state.solved)return;
  stopFlow();
  if(!state.marked.includes(index))state.marked.push(index);
  state.feedback='';state.wrong=null;
  const ordinal=state.marked.indexOf(index)+1;
  renderWork();
  say(`${WORDS[ordinal]} ${ordinal===1?'berry':'berries'}!`);
}
function answerCount(answer) {
  if(state.mode!=='practice'||state.solved)return;
  stopFlow();
  state.wrong=null;
  if(checkCount(state.given,answer)) {
    state.solved=true;state.feedbackType='success';
    state.feedback=`Yes! ${state.given} ${state.given===1?'berry':'berries'}.`;
    $('.teacher-image').src='assets/pip-happy.webp';
    renderWork();say(`You got it! There ${state.given===1?'is one berry':`are ${WORDS[state.given]} berries`}. Lovely counting!`);
    $('#next-round').focus({preventScroll:true});
  } else {
    state.wrong=answer;state.feedbackType='retry';state.feedback='Let’s try again. Touch each berry once.';
    renderWork();say("Let's have another look. Touch each berry once, or count with me!");
  }
}
function toggleSpace(index) {
  if(!Number.isInteger(index)||index<state.given||index>9||state.solved||state.mode!=='practice')return;
  stopFlow();
  state.hint=false;state.feedback='';
  if(state.added.includes(index))state.added=state.added.filter(i=>i!==index);
  else state.added.push(index);
  renderWork();
  say(`${WORDS[state.added.length]} ${state.added.length===1?'berry':'berries'} added.`);
}
function checkTray() {
  if(state.mode!=='practice'||state.solved)return;
  stopFlow();
  const result=snackResult(state.given,state.added.length);
  if(result.correct) {
    state.solved=true;state.feedbackType='success';
    state.feedback=`Yes! ${state.given} + ${state.added.length} = 10.`;
    $('.teacher-image').src='assets/nori-happy.webp';
    renderWork();say(`Wonderful! ${WORDS[state.given]} and ${WORDS[state.added.length]} make ten. Our tray is full!`);
    $('#next-round').focus({preventScroll:true});
  } else {
    state.feedbackType='retry';state.feedback=`Your tray has ${result.total} ${result.total===1?'snack':'snacks'}. Fill every space to make 10.`;
    renderWork();say(`Your tray has ${WORDS[result.total]} ${result.total===1?'snack':'snacks'}. Let's fill the empty spaces to make ten. Take your time.`);
  }
}
function resetRound() {
  stopFlow();state.marked=[];state.added=[];state.solved=false;state.wrong=null;state.hint=false;state.feedback='';state.feedbackType='';
  renderWork();promptRound();
}
function nextRound() {
  if(!state.solved)return;
  stopFlow();
  if(state.round===4) {
    state.finished=true;
    renderWork();say(state.view==='count'?"Hooray! We counted five baskets together. You can visit the town or play again!":"Hooray! Five lovely trays of ten. You can visit the town or play again!");
    $('#play-again').focus({preventScroll:true});
    return;
  }
  state.round++;state.given=roundValue(state.view,state.set,state.round);state.marked=[];state.added=[];state.solved=false;state.wrong=null;state.hint=false;state.feedback='';state.feedbackType='';
  $('.teacher-image').src=`assets/${character()}.webp`;
  renderWork();promptRound();
  $('.work-heading h2').setAttribute('tabindex','-1');$('.work-heading h2').focus({preventScroll:true});
}
async function hint() {
  stopFlow();
  if(state.view==='snack') {
    state.hint=true;renderWork();
    say(state.given===10?'Every space is already full! You need zero more snacks.':`Ten spaces altogether. A snack goes in each space. Look at the empty spaces and add a berry in each one.`);
    return;
  }
  state.marked=[];state.wrong=null;state.feedback='';state.running=true;
  const token=epoch;
  renderWork();
  for(let i=0;i<state.given;i++) {
    if(token!==epoch)return;
    state.marked.push(i);renderWork();
    if(!await beat(`${WORDS[i+1]} ${i===0?'berry':'berries'}!`,850,token))return;
  }
  state.running=false;renderWork();
  say(`The last number is ${WORDS[state.given]}. That's how many berries we have! Now choose the number.`);
}
async function runDemo() {
  stopFlow();
  state.marked=[];state.added=[];state.feedback='';state.running=true;state.solved=false;
  state.given=state.view==='count'?3:6;
  const token=epoch;
  renderWork();
  if(state.view==='count') {
    if(!await beat("Let's touch each berry just once.",2000,token))return;
    for(let i=0;i<3;i++) {
      if(token!==epoch)return;
      state.marked.push(i);renderWork();
      if(!await beat(`${WORDS[i+1]} ${i===0?'berry':'berries'}!`,1100,token))return;
    }
    if(!await beat('One, two, three. The last number tells how many. Three berries!',2400,token))return;
    state.feedback='3 berries altogether.';
  } else {
    if(!await beat('A ten-frame has ten spaces. There are six crackers already.',2900,token))return;
    if(!await beat('Let’s put a berry in each empty space.',2000,token))return;
    for(let i=6;i<10;i++) {
      if(token!==epoch)return;
      state.added.push(i);renderWork();
      if(!await beat(`${WORDS[state.added.length]} ${state.added.length===1?'berry':'berries'} added.`,1100,token))return;
    }
    state.solved=true;renderWork();
    if(!await beat('Six crackers and four berries. Six and four make ten. Every space is full!',2800,token))return;
    state.feedback='6 + 4 = 10. A full tray!';
  }
  if(token!==epoch)return;
  state.running=false;state.feedbackType='success';renderWork();
  say('Now it’s your turn! Press My turn to play.');
}

$('#sound').onclick=()=>{voices.setEnabled(!voices.enabled);voiceEpoch++;$('.teacher-image')?.classList.remove('talking');updateVoiceUi();};
$('#settings-open').onclick=()=>{stopFlow();if(state.view!=='town')renderWork();$('#settings').showModal();};
$('#settings-close').onclick=()=>{voiceEpoch++;voices.cancel();$('#settings').close();};
$('#settings').addEventListener('close',()=>{voiceEpoch++;voices.cancel();});
$('#calm-motion').onchange=event=>{calm=event.target.checked;document.body.classList.toggle('calm',calm);};
motionQuery.addEventListener('change',event=>{if(event.matches){calm=true;$('#calm-motion').checked=true;document.body.classList.add('calm');}});
$('#hear-pip').onclick=()=>voices.say("Hello, little counter! I'm Pip. Let's count together. One, two, three. Lovely!",'pip');
$('#hear-nori').onclick=()=>voices.say("Hello! I'm Nori. Hmm, how many snacks make ten? Let's find out together. Take your time.",'nori');
window.addEventListener('hashchange',()=>openView(Object.hasOwn(GAMES,location.hash.slice(1))?location.hash.slice(1):'town'));
window.addEventListener('pagehide',stopFlow);
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopFlow();if(state.view!=='town')renderWork();}});
openView(Object.hasOwn(GAMES,location.hash.slice(1))?location.hash.slice(1):'town');

// Optional WebMCP support uses the same in-tab game state and navigation.
const context=document.modelContext;
if(context?.registerTool) {
  const lifecycle=new AbortController();
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  for(const tool of [
    {name:'read_blossom_activity',description:'Read the current Blossom activity, lesson mode, and in-tab practice state.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||Object.keys(input).length)throw new Error('Expected an empty object');return {activity:state.view,mode:state.mode||null,round:state.round==null?null:state.round+1,given:state.given??null,berriesAdded:state.added?.length??null,solved:state.solved||false};}},
    {name:'start_blossom_activity',description:'Open a kindergarten activity in Blossom. Starts its replayable lesson view.',inputSchema:{type:'object',properties:{activity:{type:'string',enum:Object.keys(GAMES)}},required:['activity'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},async execute(input){if(!input||!Object.hasOwn(GAMES,input.activity)||Object.keys(input).length!==1)throw new Error('Choose a Blossom activity');if(location.hash==='#'+input.activity)openView(input.activity);else{navigate(input.activity);await new Promise(resolve=>window.addEventListener('hashchange',resolve,{once:true}));}return {activity:state.view,mode:state.mode};}}
  ])try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
}
