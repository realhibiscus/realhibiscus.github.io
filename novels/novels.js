/* novels.js — OMENVEIL (9 novels, no transitions) */

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

window.addEventListener('load', function () {
  gsap.registerPlugin(ScrollTrigger);

  /* ── SCROLL LOCK ──────────────────────────────────────── */
  var scrollLocked = false;
  var lockTimer = null;
  function lockScroll(ms) {
    scrollLocked = true; document.body.style.overflow = 'hidden';
    clearTimeout(lockTimer); lockTimer = setTimeout(unlockScroll, ms);
  }
  function unlockScroll() { scrollLocked = false; document.body.style.overflow = ''; }
  window.addEventListener('wheel',     function(e){ if(scrollLocked) e.preventDefault(); }, { passive:false });
  window.addEventListener('touchmove', function(e){ if(scrollLocked) e.preventDefault(); }, { passive:false });


  /* ── DRAG SCROLLER ────────────────────────────────────── */
  (function(){
    var wrap = document.querySelector('.char-track-wrap');
    if (!wrap) return;
    var isDragging = false, startX = 0, scrollLeft = 0;
    wrap.addEventListener('mousedown', function(e){ isDragging=true; startX=e.pageX-wrap.offsetLeft; scrollLeft=wrap.scrollLeft; wrap.style.cursor='grabbing'; });
    document.addEventListener('mouseup',   function(){ isDragging=false; wrap.style.cursor='grab'; });
    document.addEventListener('mousemove', function(e){ if(!isDragging) return; e.preventDefault(); var walk=(e.pageX-wrap.offsetLeft-startX)*1.4; wrap.scrollLeft=scrollLeft-walk; });
    wrap.addEventListener('touchstart', function(e){ startX=e.touches[0].pageX; scrollLeft=wrap.scrollLeft; },{ passive:true });
    wrap.addEventListener('touchmove',  function(e){ wrap.scrollLeft=scrollLeft-(e.touches[0].pageX-startX)*1.4; },{ passive:true });
  })();

  /* ── HARBOR — calm sea canvas ─────────────────────── */
  (function(){
    var canvas  = document.getElementById('harbor-sea-canvas');
    var section = document.getElementById('harbor-section');
    if (!canvas||!section) return;
    var ctx = canvas.getContext('2d');

    function resize(){ canvas.width=section.offsetWidth; canvas.height=section.offsetHeight; }

    function draw(){
      var w=canvas.width, h=canvas.height;
      ctx.clearRect(0,0,w,h);
      var t=Date.now()/1000;

      // night sky gradient
      var sky = ctx.createLinearGradient(0,0,0,h*0.55);
      sky.addColorStop(0, 'rgba(8,4,3,0)');
      sky.addColorStop(1, 'rgba(30,15,10,0.15)');
      ctx.fillStyle = sky; ctx.fillRect(0,0,w,h);

      // calm water (bottom 45%)
      var waterTop = h * 0.55;
      var waterGrad = ctx.createLinearGradient(0,waterTop,0,h);
      waterGrad.addColorStop(0, 'rgba(196,125,110,0.06)');
      waterGrad.addColorStop(0.5,'rgba(100,50,30,0.08)');
      waterGrad.addColorStop(1, 'rgba(20,10,5,0.18)');
      ctx.fillStyle = waterGrad; ctx.fillRect(0,waterTop,w,h-waterTop);

      // moonlight reflection on water
      ctx.save();
      var refGrad = ctx.createLinearGradient(w*0.5-30,waterTop,w*0.5+30,h);
      refGrad.addColorStop(0,'rgba(240,200,160,0.12)');
      refGrad.addColorStop(1,'rgba(240,200,160,0)');
      ctx.fillStyle = refGrad;
      ctx.beginPath();
      ctx.moveTo(w*0.5-8, waterTop);
      ctx.lineTo(w*0.5+8, waterTop);
      ctx.lineTo(w*0.5+55, h);
      ctx.lineTo(w*0.5-55, h);
      ctx.closePath(); ctx.fill(); ctx.restore();

      // gentle ripple lines
      for(var i=0;i<6;i++){
        var y = waterTop + (h-waterTop)*(0.1+i*0.15) + Math.sin(t*0.3+i)*3;
        var alpha = 0.04 + i*0.01;
        ctx.beginPath();
        ctx.moveTo(0,y);
        for(var x=0;x<=w;x+=6){
          ctx.lineTo(x, y + Math.sin(x*0.008 + t*0.4 + i)*2.5);
        }
        ctx.strokeStyle='rgba(196,125,110,'+alpha+')';
        ctx.lineWidth=1; ctx.stroke();
      }

      // moon
      ctx.beginPath();
      ctx.arc(w*0.72, h*0.18, 22, 0, Math.PI*2);
      ctx.fillStyle='rgba(240,210,180,0.12)'; ctx.fill();
      ctx.beginPath();
      ctx.arc(w*0.72, h*0.18, 18, 0, Math.PI*2);
      ctx.fillStyle='rgba(240,210,180,0.08)'; ctx.fill();

      // stars
      if(!draw.stars){
        draw.stars=[];
        for(var s=0;s<40;s++) draw.stars.push({x:Math.random()*w,y:Math.random()*h*0.5,r:0.5+Math.random(),o:0.1+Math.random()*0.3,p:Math.random()*Math.PI*2,sp:0.3+Math.random()*0.5});
      }
      draw.stars.forEach(function(s){
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle='rgba(240,210,180,'+(s.o*(0.6+0.4*Math.sin(t*s.sp+s.p)))+')'; ctx.fill();
      });
    }
    resize(); window.addEventListener('resize',resize);
    (function loop(){ draw(); requestAnimationFrame(loop); })();
  })();


  /* ── TOMORROW NEVER — animate drips on enter ─────── */
  gsap.set('.yk-drip', { scaleY:0, transformOrigin:'top center' });
  gsap.set(['.yk-knife','.yk-gun'], { opacity:0 });
  gsap.set('.yks1,.yks2,.yks3', { opacity:0 });
  var yakuzaDecoPlayed = false;
  ScrollTrigger.create({ trigger:'#yakuza-section', start:'top 2%', onEnter: function(){
    if(yakuzaDecoPlayed) return; yakuzaDecoPlayed=true;
    gsap.to('.yk-drip',    { scaleY:1, stagger:0.1,  duration:0.6, ease:'power2.in', delay:0.3 });
    gsap.to('.yks1,.yks2,.yks3', { opacity:1, stagger:0.15, duration:0.8, delay:0.5 });
    gsap.to('.yk-knife',   { opacity:1, stagger:0.2,  duration:1.0, delay:0.7 });
    gsap.to('.yk-gun',     { opacity:1, stagger:0.2,  duration:0.9, delay:1.0 });
  }});


  /* ── HERO ENTRANCE ────────────────────────────────────── */
  gsap.set(['.ov-glyph-mark','.ov-rule','.ov-eyebrow','.ov-title','.ov-desc','.ov-meta','.ov-scroll-cue'], { opacity:0 });
  gsap.set('.ov-glyph-mark', { y:-18 }); gsap.set('.ov-title', { y:18 });
  lockScroll(2800);
  gsap.timeline({ delay:0.3, onComplete: unlockScroll })
    .to('.ov-glyph-mark', { opacity:1, y:0, duration:1.1, ease:'power2.out' })
    .to('.ov-rule',       { opacity:1, duration:0.7 }, '-=0.5')
    .to('.ov-eyebrow',    { opacity:1, duration:0.6 }, '-=0.4')
    .to('.ov-title',      { opacity:1, y:0, duration:1.0, ease:'power3.out' }, '-=0.3')
    .to('.ov-desc',       { opacity:1, duration:0.8 }, '-=0.4')
    .to('.ov-meta',       { opacity:1, duration:0.6 }, '-=0.3')
    .to('.ov-scroll-cue', { opacity:1, duration:0.5 });


  /* ── HELPER: build section entrance ──────────────────── */
  function makeEntrance(sectionId, extraBefore, lockMs) {
    var sel = '#' + sectionId;
    var items = [
      sel + ' .novel-index', sel + ' .novel-title', sel + ' .novel-rule',
      sel + ' .novel-genre', sel + ' .novel-desc',  sel + ' .novel-tags',
      sel + ' .read-btn'
    ];
    var played = false;

    // hide everything
    gsap.set(items, { opacity:0 });
    gsap.set(sel + ' .novel-title', { y:20 });
    if (extraBefore) extraBefore();

    ScrollTrigger.create({
      trigger: sel, start: 'top 2%',
      onEnter: function() {
        if (played) return; played = true;
        lockScroll(lockMs || 2200);
        var tl = gsap.timeline({ onComplete: unlockScroll });
        tl.to(sel + ' .novel-index', { opacity:1, duration:0.45 })
          .to(sel + ' .novel-title', { opacity:1, y:0, duration:0.85, ease:'power3.out' }, '-=0.25')
          .to(sel + ' .novel-rule',  { opacity:1, duration:0.35 }, '-=0.4')
          .to(sel + ' .novel-genre', { opacity:1, duration:0.35 }, '-=0.2')
          .to(sel + ' .novel-desc',  { opacity:1, duration:0.6  }, '-=0.2')
          .to(sel + ' .novel-tags',  { opacity:1, duration:0.4  }, '-=0.2')
          .to(sel + ' .read-btn',    { opacity:1, duration:0.35 }, '-=0.1');
        return tl;
      }
    });
  }


  /* ── I: WALL ──────────────────────────────────────────── */
  // Pre-hide portal elements for dramatic entrance
  gsap.set('.wall-portal', { scale: 0, opacity: 0 });
  gsap.set('.portal-ring',      { scale: 0, opacity: 0 });
  gsap.set('.portal-void',      { scale: 0, opacity: 0 });
  gsap.set('.portal-core',      { scale: 0, opacity: 0 });
  gsap.set('.portal-tendril',   { scale: 0, opacity: 0 });
  gsap.set('.portal-shockwave', { scale: 0, opacity: 0 });
  (function(){
    var canvas  = document.getElementById('wall-stars-canvas');
    var section = document.getElementById('wall-section');
    if (!canvas||!section) return;
    var ctx=canvas.getContext('2d'), stars=[];
    function resize(){
      canvas.width=section.offsetWidth; canvas.height=section.offsetHeight; stars=[];
      var n=Math.floor((canvas.width*canvas.height)/2400);
      for(var i=0;i<n;i++) stars.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()<0.06?1.4:Math.random()<0.2?0.9:0.45, a:0.3+Math.random()*0.7, ts:0.4+Math.random()*2, to:Math.random()*Math.PI*2, c:Math.random()<0.08?'rgba(140,180,255,':'rgba(255,255,255,' });
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      var t=Date.now()/1000;
      stars.forEach(function(s){ var tw=s.a*(0.55+0.45*Math.sin(t*s.ts+s.to)); ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=s.c+tw+')'; ctx.fill(); });
    }
    resize(); window.addEventListener('resize',resize);
    (function loop(){ draw(); requestAnimationFrame(loop); })();
  })();

  gsap.set(['.wn1','.wn2','.wall-slab'], { opacity:0 });
  var wallPlayed = false;
  ScrollTrigger.create({ trigger:'#wall-section', start:'top 2%', onEnter: function(){
    if(wallPlayed) return; wallPlayed=true;
    lockScroll(2800);
    gsap.timeline({ onComplete: unlockScroll })
      .to(['.wn1','.wn2'],  { opacity:1, duration:2.2, stagger:0.3, ease:'power1.out' })
      .to('.wall-slab',     { opacity:1, duration:1.4, ease:'power2.out' }, '-=1.8')
      .to('#wall-section .novel-index', { opacity:1, duration:0.45 }, '-=0.8')
      .to('#wall-section .novel-title', { opacity:1, y:0, duration:0.85, ease:'power3.out' }, '-=0.25')
      .to('#wall-section .novel-rule',  { opacity:1, duration:0.35 }, '-=0.4')
      .to('#wall-section .novel-genre', { opacity:1, duration:0.35 }, '-=0.2')
      .to('#wall-section .novel-desc',  { opacity:1, duration:0.6  }, '-=0.2')
      .to('#wall-section .novel-tags',  { opacity:1, duration:0.4  }, '-=0.2')
      .to('#wall-section .read-btn',    { opacity:1, duration:0.35 }, '-=0.1');
    gsap.set(['#wall-section .novel-index','#wall-section .novel-title','#wall-section .novel-rule',
              '#wall-section .novel-genre','#wall-section .novel-desc','#wall-section .novel-tags','#wall-section .read-btn'], { opacity:0 });
    gsap.set('#wall-section .novel-title', { y:20 });

    // PORTAL OPENS FIRST — dramatic
    gsap.timeline()
      .to('.wall-portal',        { scale:1, opacity:1, duration:0.4, ease:'power4.out' }, 0.1)
      .to('.portal-void',        { scale:1, opacity:1, duration:0.6, ease:'back.out(1.5)' }, 0.2)
      .to('.portal-shockwave',   { scale:1, opacity:1, duration:0.1 }, 0.3)
      .to('.pr1',                { scale:1, opacity:1, duration:0.5, ease:'back.out(2)' }, 0.35)
      .to('.pr2',                { scale:1, opacity:1, duration:0.6, ease:'back.out(1.8)' }, 0.45)
      .to('.pr3',                { scale:1, opacity:1, duration:0.7, ease:'back.out(1.5)' }, 0.55)
      .to('.pr4',                { scale:1, opacity:1, duration:0.8, ease:'back.out(1.2)' }, 0.65)
      .to('.portal-core',        { scale:1, opacity:1, duration:0.6 }, 0.4)
      .to('.portal-tendril',     { scale:1, opacity:1, duration:0.8, stagger:0.08, ease:'power2.out' }, 0.7);
  }});
  // pre-hide
  gsap.set(['#wall-section .novel-index','#wall-section .novel-title','#wall-section .novel-rule',
            '#wall-section .novel-genre','#wall-section .novel-desc','#wall-section .novel-tags','#wall-section .read-btn'], { opacity:0 });
  gsap.set('#wall-section .novel-title', { y:20 });


  /* ── II: HARBOR ───────────────────────────────────────── */
  makeEntrance('harbor-section', null, 2000);


  /* ── III: CHAPEL ──────────────────────────────────────── */
  gsap.set(['.chapel-arch','.candle'], { opacity:0 });
  var chapelPlayed = false;
  ScrollTrigger.create({ trigger:'#dark-section', start:'top 2%', onEnter: function(){
    if(chapelPlayed) return; chapelPlayed=true;
    lockScroll(2600);
    gsap.timeline({ onComplete: unlockScroll })
      .to('.chapel-arch', { opacity:1, y:0, duration:1.2, ease:'power2.out' })
      .to('.candle',      { opacity:1, duration:0.9, stagger:0.2 }, '-=0.7')
      .to('#dark-section .novel-index', { opacity:1, duration:0.45 }, '-=0.5')
      .to('#dark-section .novel-title', { opacity:1, y:0, duration:0.85, ease:'power3.out' }, '-=0.25')
      .to('#dark-section .novel-rule',  { opacity:1, duration:0.35 }, '-=0.4')
      .to('#dark-section .novel-genre', { opacity:1, duration:0.35 }, '-=0.2')
      .to('#dark-section .novel-desc',  { opacity:1, duration:0.6  }, '-=0.2')
      .to('#dark-section .novel-tags',  { opacity:1, duration:0.4  }, '-=0.2')
      .to('#dark-section .read-btn',    { opacity:1, duration:0.35 }, '-=0.1');
  }});
  gsap.set(['#dark-section .novel-index','#dark-section .novel-title','#dark-section .novel-rule',
            '#dark-section .novel-genre','#dark-section .novel-desc','#dark-section .novel-tags','#dark-section .read-btn'], { opacity:0 });
  gsap.set('#dark-section .novel-title', { y:20 });
  gsap.set('.chapel-arch', { y:-10 });
  // candle flicker
  document.querySelectorAll('.candle').forEach(function(c,i){
    gsap.to(c, { filter:'brightness(0.86)', duration:0.12, repeat:-1, yoyo:true, delay:i*0.4, ease:'steps(1)', repeatDelay:1.8+Math.random()*2 });
  });


  /* ── IV: PIXEL ────────────────────────────────────────── */
  (function(){
    var pxPart = document.getElementById('px-particles');
    if (!pxPart) return;
    for(var i=0;i<22;i++){
      var p=document.createElement('div');
      var sz=1+Math.floor(Math.random()*2);
      p.style.cssText='position:absolute;width:'+sz+'px;height:'+sz+'px;background:rgba(46,196,182,'+(0.06+Math.random()*0.16)+');left:'+(Math.random()*100)+'%;top:'+(Math.random()*100)+'%;';
      pxPart.appendChild(p);
      (function(el){ gsap.to(el,{ y:-(20+Math.random()*55), x:(Math.random()-.5)*25, opacity:0, duration:3+Math.random()*4, repeat:-1, delay:Math.random()*4, ease:'power1.out', onRepeat:function(){ gsap.set(el,{left:Math.random()*100+'%',top:Math.random()*100+'%',opacity:0.06+Math.random()*0.14,y:0,x:0}); } }); })(p);
    }
  })();

  gsap.set(['.px-eye-wrap','.px-window-panel','.px-quote-block',
            '#pixel-section .novel-index','#pixel-section .novel-title','#pixel-section .novel-rule',
            '#pixel-section .novel-genre','#pixel-section .novel-desc',
            '#pixel-section .novel-tags','#pixel-section .read-btn'], { opacity:0 });
  gsap.set('#pixel-section .novel-title', { y:20 });
  var pxPlayed = false;
  ScrollTrigger.create({ trigger:'#pixel-section', start:'top 2%', onEnter: function(){
    if(pxPlayed) return; pxPlayed=true;
    lockScroll(2800);
    gsap.timeline({ onComplete: unlockScroll })
      .to('.px-window-panel', { opacity:1, duration:1.8, ease:'power1.out' })
      .to('.px-eye-wrap',     { opacity:1, duration:0.7 }, '-=1.4')
      .to('#pixel-section .novel-index', { opacity:1, duration:0.45 }, '-=0.9')
      .to('#pixel-section .novel-title', { opacity:1, y:0, duration:0.85, ease:'power3.out' }, '-=0.25')
      .to('#pixel-section .novel-rule',  { opacity:1, duration:0.35 }, '-=0.4')
      .to('#pixel-section .novel-genre', { opacity:1, duration:0.35 }, '-=0.2')
      .to('#pixel-section .novel-desc',  { opacity:1, duration:0.6  }, '-=0.2')
      .to('.px-quote-block',             { opacity:1, duration:0.45 }, '-=0.2')
      .to('#pixel-section .novel-tags',  { opacity:1, duration:0.4  }, '-=0.1')
      .to('#pixel-section .read-btn',    { opacity:1, duration:0.35 }, '-=0.1');
  }});


  /* ── V: TEARS OF LIE ──────────────────────────────────── */
  gsap.set('.blood-drip', { scaleY:0, transformOrigin:'top center' });
  gsap.set(['.tears-eye-wrap', '.t-key', '.tears-shadow-tl','.tears-shadow-tr','.tears-shadow-bl','.tears-shadow-br'], { opacity:0 });
  gsap.set([
    '#blood-section .novel-index','#blood-section .novel-title','#blood-section .novel-rule',
    '#blood-section .novel-genre','#blood-section .novel-desc','#blood-section .novel-tags','#blood-section .read-btn'
  ], { opacity:0 });
  gsap.set('#blood-section .novel-title', { y:20 });
  var bloodPlayed = false;
  ScrollTrigger.create({ trigger:'#blood-section', start:'top 2%', onEnter: function(){
    if(bloodPlayed) return; bloodPlayed=true;
    lockScroll(2800);
    gsap.timeline({ onComplete: unlockScroll })
      .to(['.tears-shadow-tl','.tears-shadow-tr','.tears-shadow-bl','.tears-shadow-br'], { opacity:1, duration:1.2, stagger:0.1, ease:'power2.out' })
      .to('.blood-drip',    { scaleY:1, stagger:0.07, duration:0.75, ease:'power2.in' }, '-=0.6')
      .to('.t-key', { opacity:1, duration:1, stagger:0.2, ease:'power2.out' }, '-=0.6')
      .to('.tears-eye-wrap', { opacity:1, duration:0.8, ease:'power2.out' }, '-=0.4')
      .to('#blood-section .novel-index', { opacity:1, duration:0.45 }, '-=0.3')
      .to('#blood-section .novel-title', { opacity:1, y:0, duration:0.85, ease:'power3.out' }, '-=0.25')
      .to('#blood-section .novel-rule',  { opacity:1, duration:0.35 }, '-=0.4')
      .to('#blood-section .novel-genre', { opacity:1, duration:0.35 }, '-=0.2')
      .to('#blood-section .novel-desc',  { opacity:1, duration:0.6  }, '-=0.2')
      .to('#blood-section .novel-tags',  { opacity:1, duration:0.4  }, '-=0.2')
      .to('#blood-section .read-btn',    { opacity:1, duration:0.35 }, '-=0.1');
  }});

  /* ── EYE TRACKING & TWITCHING ─────────────────────── */
  (function(){
    var pupil = document.querySelector('.tears-eye-pupil');
    var eye = document.querySelector('.tears-eye');
    if (!pupil || !eye) return;

    var eyeTrack = { x: 0, y: 0 };
    var isTwitching = false;

    document.addEventListener('mousemove', function(e) {
      if (isTwitching) return;
      var rect = eye.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var dx = e.clientX - centerX;
      var dy = e.clientY - centerY;
      
      var distance = Math.min(25, Math.hypot(dx, dy) / 10);
      var angle = Math.atan2(dy, dx);
      
      eyeTrack.x = Math.cos(angle) * distance;
      eyeTrack.y = Math.sin(angle) * distance;
      
      gsap.to(pupil, { x: eyeTrack.x, y: eyeTrack.y, duration: 0.15 });
    });

    setInterval(function() {
      if (Math.random() > 0.6) {
        isTwitching = true;
        var rx = (Math.random() - 0.5) * 50;
        var ry = (Math.random() - 0.5) * 50;
        gsap.to(pupil, { x: rx, y: ry, duration: 0.1, onComplete: function() {
          setTimeout(function() {
            isTwitching = false;
            gsap.to(pupil, { x: eyeTrack.x, y: eyeTrack.y, duration: 0.2 });
          }, 150 + Math.random() * 300);
        }});
      }
    }, 1500);
  })();


  /* ── VI: TOMORROW NEVER ───────────────────────────────── */
  makeEntrance('yakuza-section', null, 2000);


  /* ── VII: THIN ICE ────────────────────────────────────── */
  (function(){
    var canvas  = document.getElementById('ice-canvas');
    var section = document.getElementById('ice-section');
    if (!canvas||!section) return;
    var ctx = canvas.getContext('2d');
    var cracks = [];

    function resize(){
      canvas.width = section.offsetWidth; canvas.height = section.offsetHeight;
      buildCracks();
    }

    function buildCracks(){
      cracks = [];
      var n = 14;
      for(var i=0;i<n;i++){
        var cx = Math.random()*canvas.width;
        var cy = Math.random()*canvas.height;
        var segs = [];
        var x=cx, y=cy, angle=Math.random()*Math.PI*2;
        for(var s=0;s<10+Math.floor(Math.random()*12);s++){
          angle += (Math.random()-.5)*0.7;
          var len = 20+Math.random()*60;
          var nx=x+Math.cos(angle)*len, ny=y+Math.sin(angle)*len;
          segs.push({x1:x,y1:y,x2:nx,y2:ny});
          x=nx; y=ny;
        }
        cracks.push({ segs:segs, opacity: 0.04+Math.random()*0.1, phase: Math.random()*Math.PI*2, speed: 0.2+Math.random()*0.5 });
      }
    }

    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      var t = Date.now()/1000;
      // snowflakes
      if(!draw.flakes){
        draw.flakes=[];
        for(var i=0;i<80;i++) draw.flakes.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:0.5+Math.random()*1.5, s:0.2+Math.random()*0.5, o:0.3+Math.random()*0.5, ox:Math.random()*canvas.width });
      }
      draw.flakes.forEach(function(f){
        f.y = (f.y + f.s) % canvas.height;
        f.x = f.ox + Math.sin(t*0.4+f.y*0.02)*8;
        ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(200,225,235,'+f.o+')'; ctx.fill();
      });
      // ice cracks
      cracks.forEach(function(cr){
        var op = cr.opacity * (0.6 + 0.4*Math.sin(t*cr.speed + cr.phase));
        ctx.strokeStyle = 'rgba(136,192,208,'+op+')';
        ctx.lineWidth = 0.5;
        cr.segs.forEach(function(seg){
          ctx.beginPath(); ctx.moveTo(seg.x1,seg.y1); ctx.lineTo(seg.x2,seg.y2); ctx.stroke();
        });
      });
    }

    resize(); window.addEventListener('resize', resize);
    (function loop(){ draw(); requestAnimationFrame(loop); })();
  })();

  makeEntrance('ice-section', null, 2000);


  /* ── VIII: WAVES ──────────────────────────────────────── */
  (function(){
    var canvas  = document.getElementById('waves-canvas');
    var section = document.getElementById('waves-section');
    if(!canvas||!section) return;
    var ctx=canvas.getContext('2d');

    function resize(){ canvas.width=section.offsetWidth; canvas.height=section.offsetHeight; }

    function draw(){
      var w=canvas.width, h=canvas.height;
      ctx.clearRect(0,0,w,h);
      var t=Date.now()/1000;
      for(var layer=0;layer<5;layer++){
        var yBase   = h*(0.45+layer*0.08);
        var amp     = 18+layer*10;
        var freq    = 0.006-layer*0.0004;
        var speed   = 0.4+layer*0.2;
        var opacity = 0.04+layer*0.03;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for(var x=0;x<=w;x+=4){
          var y = yBase + Math.sin(x*freq + t*speed)*amp + Math.sin(x*freq*1.6 + t*speed*0.7)*amp*0.5;
          x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
        ctx.fillStyle='rgba(74,127,165,'+opacity+')'; ctx.fill();
      }
      // spray particles
      if(!draw.drops){ draw.drops=[]; for(var i=0;i<60;i++) draw.drops.push({ x:Math.random()*1400, y:Math.random()*400+h*0.3, vx:(Math.random()-.5)*0.4, vy:-0.3-Math.random()*0.6, life:Math.random(), maxLife:0.5+Math.random()*1.5 }); }
      draw.drops.forEach(function(d){
        d.life+=0.008; d.x+=d.vx; d.y+=d.vy;
        if(d.life>d.maxLife){ d.life=0; d.x=Math.random()*w; d.y=h*0.4+Math.random()*h*0.3; d.vx=(Math.random()-.5)*0.4; d.vy=-0.3-Math.random()*0.6; }
        var a=(1-d.life/d.maxLife)*0.25;
        ctx.beginPath(); ctx.arc(d.x,d.y,0.8,0,Math.PI*2);
        ctx.fillStyle='rgba(180,215,235,'+a+')'; ctx.fill();
      });
    }

    resize(); window.addEventListener('resize',resize);
    (function loop(){ draw(); requestAnimationFrame(loop); })();
  })();

  makeEntrance('waves-section', null, 2000);


  /* ── IX: TO DUST AND NOTHING ──────────────────────────── */
  (function(){
    var container = document.getElementById('dust-particles');
    if(!container) return;
    for(var i=0;i<50;i++){
      var p=document.createElement('div');
      var sz=0.5+Math.random()*2;
      p.style.cssText='position:absolute;border-radius:50%;width:'+sz+'px;height:'+sz+'px;left:'+(Math.random()*100)+'%;top:'+(Math.random()*100)+'%;background:rgba('+(150+Math.floor(Math.random()*80))+','+(120+Math.floor(Math.random()*60))+','+(80+Math.floor(Math.random()*50))+','+(0.04+Math.random()*0.12)+');';
      container.appendChild(p);
      (function(el){ gsap.to(el,{ y:-(15+Math.random()*50), x:(Math.random()-.5)*30, opacity:0, duration:4+Math.random()*6, repeat:-1, delay:Math.random()*5, ease:'power1.out', onRepeat:function(){ gsap.set(el,{ left:Math.random()*100+'%', top:(50+Math.random()*50)+'%', opacity:0.04+Math.random()*0.1, y:0, x:0 }); } }); })(p);
    }
  })();

  makeEntrance('dust-section', null, 2000);


  /* ── FAST SCROLL SAFETY NET ───────────────────────────── */
  ScrollTrigger.refresh();

}); /* end load */