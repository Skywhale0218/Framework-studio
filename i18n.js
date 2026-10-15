/* 3개 국어 전환 스위치 (KO ← → EN ← → JA) — 두 페이지 공용 */
(function(){
  var KEY='fw-lang',LANGS=['ko','en','ja'],LAB=['한국어','EN','日本語'];
  var css='.lang{position:relative;display:inline-grid;grid-template-columns:repeat(3,1fr);width:156px;height:34px;border:1px solid var(--fg,#1b1d22);background:#fff;touch-action:none;cursor:pointer;flex:none;user-select:none;-webkit-user-select:none}'
  +'.lang .knob{position:absolute;top:2px;bottom:2px;left:2px;width:calc((100% - 4px)/3);background:var(--fg,#1b1d22);transition:transform .25s cubic-bezier(.3,.8,.3,1)}'
  +'.lang button{position:relative;z-index:1;font:inherit;font-size:.78rem;font-weight:700;background:none;border:0;color:var(--fg,#1b1d22);cursor:pointer;padding:0;transition:color .2s}'
  +'.lang button[aria-checked=true]{color:#fff}'
  +'@media(max-width:480px){.lang{width:130px;height:30px}.lang button{font-size:.7rem}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var I=window.I18N={lang:'ko',ls:[],on:function(f){this.ls.push(f)}};
  I.init=function(T){
    var els=[].slice.call(document.querySelectorAll('[data-k]')),title=document.title,
        md=document.querySelector('meta[name=description]'),mdo=md&&md.content;
    els.forEach(function(e){e._ko=e.innerHTML});
    var sw=document.createElement('div');sw.className='lang';sw.setAttribute('role','radiogroup');sw.setAttribute('aria-label','Language');
    sw.innerHTML='<span class="knob"></span>'+LANGS.map(function(l,i){return '<button type="button" role="radio" data-i="'+i+'" lang="'+l+'">'+LAB[i]+'</button>'}).join('');
    var slot=document.getElementById('lang-slot');if(slot)slot.appendChild(sw);
    var kn=sw.querySelector('.knob'),bs=[].slice.call(sw.querySelectorAll('button'));
    function apply(l){
      I.lang=l;var d=T[l]||{};
      els.forEach(function(e){var v=l==='ko'?null:d[e.getAttribute('data-k')];e.innerHTML=v==null?e._ko:v});
      document.title=(l!=='ko'&&d._title)||title;
      if(md)md.content=(l!=='ko'&&d._desc)||mdo;
      document.documentElement.lang=l;
      var i=LANGS.indexOf(l);kn.style.transform='translateX('+(i*100)+'%)';
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
