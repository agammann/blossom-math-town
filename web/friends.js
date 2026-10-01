export const FRIENDS=[
  {id:'pip',name:'Pip',gesture:'wink',action:'wink',message:'Pip gives you a wink!'},
  {id:'nori',name:'Nori',gesture:'wave',action:'wave',message:'Nori waves hello!'},
  {id:'milo',name:'Milo',gesture:'dance',action:'dance',message:'Milo does a happy dance!'},
  {id:'tilly',name:'Tilly',gesture:'kiss',action:'blow a kiss',message:'Tilly blows you a kiss!'},
  {id:'ziggy',name:'Ziggy',gesture:'peace',action:'make a peace sign',message:'Ziggy makes a peace sign!'},
  {id:'sunny',name:'Sunny',gesture:'double-wave',action:'wave both hands',message:'Sunny waves both hands!'},
  {id:'otto',name:'Otto',gesture:'point',action:'point',message:'Otto points to an adventure!'},
  {id:'poppy',name:'Poppy',gesture:'fist',action:'raise a happy fist',message:'Poppy cheers you on!'},
  {id:'luna',name:'Luna',gesture:'dance',action:'dance',message:'Luna does a little dance!'}
];
export const friendMarkup=()=>FRIENDS.map(friend=>`<figure><button class="monster-friend" id="friend-${friend.id}" data-gesture="${friend.gesture}" aria-label="Play with ${friend.name}: ${friend.action}" type="button"><span class="friend-sprite"><img class="friend-idle" src="assets/${friend.id}.webp" alt=""><img class="friend-pose" src="assets/gestures/${friend.id}.webp" alt="" aria-hidden="true"></span></button><figcaption>${friend.name}</figcaption></figure>`).join('');
export function activateFriends(root){
  const timers=new Map(),cleanup=[];
  for(const friend of FRIENDS){
    const button=root.querySelector('#friend-'+friend.id),pose=button.querySelector('.friend-pose');
    const ready=()=>{if(pose.naturalWidth)button.classList.add('pose-ready');};pose.addEventListener('load',ready);ready();
    const preview=()=>button.classList.add('friend-preview');
    const unpreview=()=>{button.classList.remove('friend-preview');button.style.removeProperty('--friend-lean');};
    const move=event=>{if(event.pointerType!=='mouse')return;const box=button.getBoundingClientRect();button.style.setProperty('--friend-lean',`${((event.clientX-box.left)/box.width-.5)*10}deg`);};
    const play=()=>{
      clearTimeout(timers.get(friend.id));button.classList.remove('friend-playing');void button.offsetWidth;button.classList.add('friend-playing');
      root.querySelector('#town-play-status').textContent=friend.message;
      timers.set(friend.id,setTimeout(()=>{button.classList.remove('friend-playing');timers.delete(friend.id);},2100));
    };
    const enter=event=>{if(event.pointerType==='mouse')preview();};
    for(const [event,fn] of [['pointerenter',enter],['pointerleave',unpreview],['pointermove',move],['focus',preview],['blur',unpreview],['click',play]]){button.addEventListener(event,fn);cleanup.push(()=>button.removeEventListener(event,fn));}
    cleanup.push(()=>pose.removeEventListener('load',ready));
  }
  return ()=>{for(const timer of timers.values())clearTimeout(timer);for(const fn of cleanup)fn();};
}
