const selectors='button:not(:disabled), a[href], input:not(:disabled)';

function visibleControls(root=document){
  return [...root.querySelectorAll(selectors)].filter(element=>{
    const box=element.getBoundingClientRect();
    const style=getComputedStyle(element);
    return box.width>0&&box.height>0&&style.visibility!=='hidden'&&style.display!=='none';
  });
}

function focusStart(){
  const target=document.querySelector('#work button:not(:disabled)')
    ||document.querySelector('.destination:not(:disabled)')
    ||document.querySelector('.monster-friend:not(:disabled)');
  target?.focus({preventScroll:true});
}

function moveFocus(key){
  const dialog=document.querySelector('#settings');
  const controls=visibleControls(dialog?.open?dialog:document);
  if(!controls.length)return;
  const current=document.activeElement;
  if(!controls.includes(current)){
    controls[0].focus({preventScroll:true});
    controls[0].scrollIntoView({block:'nearest',inline:'nearest'});
    return;
  }
  const origin=current.getBoundingClientRect();
  const cx=origin.left+origin.width/2;
  const cy=origin.top+origin.height/2;
  const horizontal=key==='ArrowLeft'||key==='ArrowRight';
  const sign=key==='ArrowRight'||key==='ArrowDown'?1:-1;
  let best=null;
  let bestScore=Infinity;
  for(const candidate of controls){
    if(candidate===current)continue;
    const box=candidate.getBoundingClientRect();
    const dx=box.left+box.width/2-cx;
    const dy=box.top+box.height/2-cy;
    const primary=(horizontal?dx:dy)*sign;
    if(primary<=2)continue;
    const secondary=Math.abs(horizontal?dy:dx);
    const score=primary+secondary*1.8;
    if(score<bestScore){best=candidate;bestScore=score;}
  }
  if(best){
    best.focus({preventScroll:true});
    best.scrollIntoView({block:'nearest',inline:'nearest'});
  }
}

export function activateTv({navigate}){
  const main=document.querySelector('#app');
  let pending=false;
  const scheduleFocus=()=>{
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{
      pending=false;
      const active=document.activeElement;
      if(active===document.body||active===document.documentElement||active?.matches('h1, h2'))focusStart();
    });
  };
  new MutationObserver(scheduleFocus).observe(main,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>requestAnimationFrame(focusStart));
  document.querySelector('#settings-open').addEventListener('click',()=>{
    requestAnimationFrame(()=>document.querySelector('#settings-close').focus());
  });
  document.querySelector('#settings').addEventListener('close',()=>{
    document.querySelector('#settings-open').focus();
  });
  window.addEventListener('keydown',event=>{
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      event.preventDefault();
      moveFocus(event.key);
      return;
    }
    if(['Escape','Backspace','GoBack'].includes(event.key)||event.keyCode===27){
      const settings=document.querySelector('#settings');
      if(settings.open){
        event.preventDefault();
        settings.close();
      }else if(location.hash){
        event.preventDefault();
        navigate('town');
      }
    }
  });
  scheduleFocus();
}
