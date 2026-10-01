import { narration } from './narration.js';

// Finished Emma clips are served with the Site; no device voice or remote voice service.
export const narrationKey = (text,character='pip') => character+'|'+text.normalize('NFKC').replace(/[\u2018\u2019]/g,"'").replace(/\s+/g,' ').trim().toLowerCase();

export class MonsterVoices {
  constructor(onChange) {
    this.enabled=true;
    this.available=typeof window.Audio==='function';
    this.audio=this.available ? new Audio() : null;
    if(this.audio){this.audio.preload='none';this.audio.volume=.9;}
    this.sequence=0;
    this.finish=null;
    this.issue='';
    this.onChange=onChange;
    this.onChange?.();
  }
  cancel() {
    this.sequence++;
    if(this.audio){
      this.audio.onended=null;
      this.audio.onerror=null;
      this.audio.onplaying=null;
      this.audio.pause();
      try{this.audio.currentTime=0;}catch{}
    }
    const finish=this.finish;
    this.finish=null;
    finish?.();
  }
  setEnabled(value) { this.enabled=value;this.cancel();this.onChange?.(); }
  async say(text,character='pip') {
    this.cancel();
    if(!this.enabled||!this.available)return;
    const clip=narration[narrationKey(text,character)];
    if(!clip){this.issue='missing';this.onChange?.();return;}
    const token=this.sequence;
    const audio=this.audio;
    this.issue='';
    this.onChange?.();
    return new Promise(resolve=>{
      let timeout;
      let finished=false;
      const done=()=>{
        if(finished)return;
        finished=true;
        clearTimeout(timeout);
        if(this.sequence===token){
          this.finish=null;
          audio.onended=null;audio.onerror=null;audio.onplaying=null;
        }
        resolve();
      };
      const failed=error=>{
        if(this.sequence!==token)return;
        this.issue=error?.name==='NotAllowedError'?'blocked':'load';
        audio.pause();
        this.onChange?.();
        done();
      };
      this.finish=done;
      audio.onended=done;
      audio.onerror=()=>failed();
      audio.onplaying=()=>{if(this.sequence===token){this.issue='';this.onChange?.();}};
      audio.src=new URL(clip.src,document.baseURI).href;
      timeout=setTimeout(()=>failed(),Math.ceil(clip.duration*1000)+6000);
      try{const playing=audio.play();playing?.catch(failed);}catch(error){failed(error);}
    });
  }
  hint() {
    if(!this.available||!this.enabled)return 'Read along';
    if(this.issue==='blocked')return 'Tap Hear again';
    if(this.issue)return 'Read along · retry sound';
    return 'Captions on';
  }
  describe() {
    if(!this.available)return 'Audio is unavailable here. Captions and visual hints keep every lesson playable.';
    if(this.issue==='blocked')return 'Emma · British English. Tap Hear again or a voice button to allow audio in this browser.';
    if(this.issue)return 'Emma’s audio could not play. Captions and visual hints still work; tap Hear again to retry.';
    return 'Emma · British English. Pip uses a lively pace; Nori takes things a little more slowly. Audio clips are saved with Blossom.';
  }
}
