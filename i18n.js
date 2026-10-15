/* 3개 국어 전환 스위치 (KO ← → EN ← → JA) — 두 페이지 공용 */
(function(){
  var KEY='fw-lang',LANGS=['ko','en','ja'],LAB=['KO','EN','JA'],FULL=['한국어','English','日本語'];
  var css='.lang{position:relative;display:inline-grid;grid-template-columns:repeat(3,1fr);width:92px;height:32px;border:1px solid var(--fg,#1b1d22);border-radius:999px;background:#fff;touch-action:none;cursor:pointer;flex:none;user-select:none;-webkit-user-select:none}'
  +'.lang .knob{position:absolute;top:2px;left:16.667%;width:26px;height:26px;border-radius:50%;transform:translateX(-50%);background:var(--fg,#1b1d22);color:#fff;font-size:.62rem;font-weight:700;letter-spacing:.02em;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2;transition:left .28s cubic-bezier(.3,.8,.3,1)}'
  +'.lang button{position:relative;z-index:1;font:inherit;font-size:.62rem;font-weight:700;background:none;border:0;border-radius:999px;color:#9aa1b2;cursor:pointer;padding:0}'
  +'.lang button:focus-visible{outline:2px solid var(--acc,#2b50d6);outline-offset:1px}'
  +'@media(max-width:480px){.lang{width:84px;height:28px}.lang .knob{width:22px;height:22px;font-size:.58rem}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var I=window.I18N={lang:'ko',ls:[],on:function(f){this.ls.push(f)}};
  I.init=function(T){
    var els=[].slice.call(document.querySelectorAll('[data-k]')),title=document.title,
        md=document.querySelector('meta[name=description]'),mdo=md&&md.content;
    els.forEach(function(e){e._ko=e.innerHTML});
    var sw=document.createElement('div');sw.className='lang';sw.setAttribute('role','radiogroup');sw.setAttribute('aria-label','Language');
    sw.innerHTML='<span class="knob"></span>'+LANGS.map(function(l,i){return '<button type="button" role="radio" data-i="'+i+'" lang="'+l+'" title="'+FULL[i]+'" aria-label="'+FULL[i]+'">'+LAB[i]+'</button>'}).join('');
    var slot=document.getElementById('lang-slot');if(slot)slot.appendChild(sw);
    var kn=sw.querySelector('.knob'),bs=[].slice.call(sw.querySelectorAll('button'));
    function apply(l){
      I.lang=l;var d=T[l]||{};
      els.forEach(function(e){var v=l==='ko'?null:d[e.getAttribute('data-k')];e.innerHTML=v==null?e._ko:v});
      document.title=(l!=='ko'&&d._title)||title;
      if(md)md.content=(l!=='ko'&&d._desc)||mdo;
      document.documentElement.lang=l;
      var i=LANGS.indexOf(l);kn.style.left=(i*100/3+100/6)+'%';kn.textContent=LAB[i];
      bs.forEach(function(b,j){b.setAttribute('aria-checked',j===i)});
      try{localStorage.setItem(KEY,l)}catch(e){}
      I.ls.forEach(function(f){f(l)});
    }
    function set(i){if(LANGS[i]!==I.lang)apply(LANGS[i])}
    function at(x){var r=sw.getBoundingClientRect();return Math.max(0,Math.min(2,Math.floor((x-r.left)/r.width*3)))}
    var down=false;
    sw.addEventListener('pointerdown',function(e){down=true;try{sw.setPointerCapture(e.pointerId)}catch(_){}set(at(e.clientX))});
    sw.addEventListener('pointermove',function(e){if(down)set(at(e.clientX))});
    ['pointerup','pointercancel'].forEach(function(n){sw.addEventListener(n,function(){down=false})});
    bs.forEach(function(b,i){b.addEventListener('click',function(){set(i)});b.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){set(Math.min(2,i+1));bs[Math.min(2,i+1)].focus()}if(e.key==='ArrowLeft'){set(Math.max(0,i-1));bs[Math.max(0,i-1)].focus()}})});
    var saved='ko';try{saved=localStorage.getItem(KEY)||'ko'}catch(e){}
    if(LANGS.indexOf(saved)<0)saved='ko';
    apply(saved);
  };
})();
