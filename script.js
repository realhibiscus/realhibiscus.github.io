/* ================================================================
   script.js  —  Blue Imagination Portfolio
   ================================================================

   WHAT THIS FILE DOES:
   It controls all the moving / animated parts of the site.

   SECTIONS:
   1.  Wait for page to load (important!)
   2.  Setup GSAP
   3.  Custom cursor
   4.  Background floating shapes
   5.  Parallax (mouse-move depth effect)
   6.  Navbar (shrinks on scroll)
   7.  Hero entrance animation
   8.  Scroll reveal (sections fade in as you scroll)
   9.  Gallery card hover effects
   10. Skill bars (fill up on scroll)
   11. Hibiscus animations
   12. Contact icons pop in

   TIPS FOR EDITING:
   - duration: 1.0 means 1 second. Make it bigger = slower, smaller = faster.
   - delay: 0.5 means wait 0.5 seconds before starting.
   - ease: 'back.out(1.4)' gives a bouncy overshoot effect.
   - ease: 'power3.out' gives a smooth ease-out.
   - ease: 'sine.inOut' gives a gentle wave-like motion.
================================================================ */


// Always start at the very top when the page loads or refreshes
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ================================================================
   1. WAIT FOR PAGE TO LOAD
   Everything inside this function runs AFTER the page is ready.
   This is important — it prevents the "blank page" bug!
================================================================ */
window.addEventListener('load', function () {


  /* ================================================================
     2. SETUP — tell GSAP to use the ScrollTrigger plugin
  ================================================================ */
  gsap.registerPlugin(ScrollTrigger);


  /* ================================================================
     3. CUSTOM CURSOR — removed, using normal cursor
  ================================================================ */


  /* ================================================================
     4. BACKGROUND FLOATING SHAPES
     Creates small heart and diamond shapes that float in the background.
  ================================================================ */
  const bgCanvas = document.getElementById('bg-canvas');

  // how many shapes to create — change this number if you want more or fewer
  const TOTAL_SHAPES = 24;

  for (let i = 0; i < TOTAL_SHAPES; i++) {
    const shape = document.createElement('div');
    shape.className = 'bg-particle';

    // alternate between heart shapes and diamond shapes
    const isHeart = Math.random() > 0.4;

    if (isHeart) {
      // CSS heart using borders
      shape.style.cssText = `
        width: ${6 + Math.random() * 14}px;
        height: ${6 + Math.random() * 14}px;
        background: hsl(${200 + Math.random() * 60}, 70%, ${65 + Math.random() * 20}%);
        left: ${Math.random() * 100}%;
        top:  ${Math.random() * 100}%;
        opacity: ${0.12 + Math.random() * 0.25};
        transform: rotate(-45deg);
        border-radius: 0;
      `;
      // add the two bumps of the heart
      const bL = document.createElement('div');
      const bR = document.createElement('div');
      const s  = parseFloat(shape.style.width);
      const shared = `position:absolute;background:inherit;border-radius:50%;width:${s}px;height:${s}px;`;
      bL.style.cssText = shared + `top:${-s/2}px;left:0;`;
      bR.style.cssText = shared + `top:0;left:${s/2}px;`;
      shape.appendChild(bL);
      shape.appendChild(bR);
    } else {
      // simple rotated square (diamond)
      const size = 5 + Math.random() * 10;
      shape.style.cssText = `
        width:   ${size}px;
        height:  ${size}px;
        background: hsl(${200 + Math.random() * 60}, 65%, ${70 + Math.random() * 18}%);
        left:    ${Math.random() * 100}%;
        top:     ${Math.random() * 100}%;
        opacity: ${0.1 + Math.random() * 0.2};
        transform: rotate(45deg);
        border-radius: 2px;
      `;
    }

    bgCanvas.appendChild(shape);

    // GSAP floating animation — each shape drifts at a different speed
    gsap.to(shape, {
      y:        -(25 + Math.random() * 55),
      x:        (Math.random() - 0.5) * 35,
      duration: 4 + Math.random() * 7,
      repeat:   -1,    // loop forever
      yoyo:     true,  // reverse back to start
      ease:     'sine.inOut',
      delay:    Math.random() * 6,
    });
  }


  /* ================================================================
     5. PARALLAX — background shapes react to mouse movement
     Shapes at different "depths" move at different speeds.
  ================================================================ */
  window.addEventListener('mousemove', function (e) {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 2;  // -1 to +1
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;  // -1 to +1

    Array.from(bgCanvas.children).forEach(function (el, i) {
      const depth = (i % 5 + 1) * 3.5;
      gsap.to(el, {
        x:        '+=' + (cx * depth * 0.25),
        y:        '+=' + (cy * depth * 0.25),
        duration: 1.4,
        ease:     'power1.out',
      });
    });
  });


  /* ================================================================
     6. NAVBAR — shrinks slightly when you scroll down
  ================================================================ */
  ScrollTrigger.create({
    start: 'top -50',
    onEnter:     function () { gsap.to('#navbar', { padding: '10px 48px', duration: 0.4 }); },
    onLeaveBack: function () { gsap.to('#navbar', { padding: '14px 48px', duration: 0.4 }); },
  });


  /* ================================================================
     7. HERO ENTRANCE ANIMATION
     We use gsap.set first to make sure starting states are correct,
     then animate everything in cleanly.
  ================================================================ */

  // Step 1: immediately hide the pieces we want to animate in
  gsap.set(['.hero-card', '.nav-logo', '.nav-links li'], { opacity: 0, y: 30 });
  gsap.set('.hero-signature', { opacity: 0, x: 40 });
  gsap.set('.hero-text p',    { opacity: 0, x: 40 });
  gsap.set('.hero-text .btn-primary', { opacity: 0, y: 20 });
  gsap.set('.hibiscus',       { opacity: 0, scale: 0, rotation: -80 });
  gsap.set('.deco-heart',     { opacity: 0, scale: 0 });
  gsap.set('.css-star',       { opacity: 0, scale: 0 });

  // Step 2: animate everything in one after another
  const heroTL = gsap.timeline({
    delay: 0.1,
    // this is a safety net — if anything goes wrong, make everything visible after 2s
    onComplete: function() {
      gsap.set([
        '.hero-card', '.nav-logo', '.nav-links li',
        '.hero-signature', '.hero-text p', '.hero-text .btn-primary',
        '.hibiscus', '.deco-heart', '.css-star', '.dot'
      ], { clearProps: 'all' });
    }
  });

  heroTL
    // nav logo
    .to('.nav-logo', {
      opacity: 1, y: 0, duration: 0.5, ease: 'power3.out'
    })
    // nav links
    .to('.nav-links li', {
      opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power3.out'
    }, '<0.1')
    // hero card box itself
    .to('.hero-card', {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
    }, '<0.1')
    // hibiscus flower spins in
    .to('.hibiscus', {
      opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)'
    }, '-=0.4')
    // star sparkles around flower
    .to('.css-star', {
      opacity: 0.7, scale: 1, stagger: 0.08, duration: 0.4, ease: 'back.out(2)'
    }, '-=0.4')
    // dots row
    .to('.dot', {
      opacity: 1, scale: 1, stagger: 0.1, duration: 0.3, ease: 'back.out(2)'
    }, '-=0.3')
    // signature slides in
    .to('.hero-signature', {
      opacity: 1, x: 0, duration: 0.6, ease: 'power3.out'
    }, '-=0.2')
    // tagline
    .to('.hero-text p', {
      opacity: 1, x: 0, duration: 0.5, ease: 'power3.out'
    }, '-=0.3')
    // button
    .to('.hero-text .btn-primary', {
      opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)'
    }, '-=0.2')
    // corner hearts
    .to('.deco-heart', {
      opacity: 0.5, scale: 1, stagger: 0.1, duration: 0.4, ease: 'back.out(2)'
    }, '-=0.3');


  /* ================================================================
     8. SCROLL REVEAL
     Elements with class "scroll-reveal" start invisible
     and fade+rise into view as you scroll to them.
  ================================================================ */
  gsap.utils.toArray('.scroll-reveal').forEach(function (el, i) {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        // small stagger so grouped items don't all appear at the same time
        delay: (i % 4) * 0.07,
        scrollTrigger: {
          trigger: el,
          start: 'top 84%',         // starts when element is 84% into the viewport
          toggleActions: 'play none none none',
        },
      }
    );
  });


  /* ================================================================
     9. GALLERY CARD HOVER EFFECTS
  ================================================================ */
  document.querySelectorAll('.gallery-item').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      gsap.to(card, { scale: 1.05, duration: 0.28, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', function () {
      gsap.to(card, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.6)' });
    });
  });


  /* ================================================================
     10. SKILL BARS
     Each bar reads its data-width attribute from the HTML
     and animates to that percentage when it scrolls into view.

     To change a skill level, go to index.html and change:
       data-width="92"   ← the number here (0 to 100)
  ================================================================ */
  document.querySelectorAll('.skill-fill').forEach(function (bar) {
    const targetPct = bar.getAttribute('data-width');

    ScrollTrigger.create({
      trigger: bar,
      start: 'top 87%',
      once: true,               // only triggers once
      onEnter: function () {
        gsap.to(bar, {
          width: targetPct + '%',
          duration: 1.5,
          ease: 'power3.out'
        });
      }
    });
  });


  /* ================================================================
     11. HIBISCUS ANIMATIONS
  ================================================================ */

  // hero flower gently floats up and down
  gsap.to('.hibiscus-wrap:not(.small)', {
    y: -14,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // about section flower (slightly different timing)
  gsap.to('.hibiscus-wrap.small', {
    y: -9,
    duration: 3.1,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.6,
  });

  // petals gently "breathe" (scale in and out)
  gsap.to('.petal', {
    scale: 1.05,
    duration: 1.9,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.15,
  });

  // stamen core glows
  gsap.to('.stamen-core', {
    boxShadow: '0 0 18px rgba(244, 200, 40, 0.9), 0 0 38px rgba(244, 200, 40, 0.4)',
    duration: 1.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // hero card 3D tilt on mouse move (feels interactive and fun!)
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    heroCard.addEventListener('mousemove', function (e) {
      const rect = heroCard.getBoundingClientRect();
      const cx = (e.clientX - rect.left)  / rect.width  - 0.5;  // -0.5 to +0.5
      const cy = (e.clientY - rect.top)   / rect.height - 0.5;
      gsap.to(heroCard, {
        rotationY: cx * 7,
        rotationX: -cy * 7,
        transformPerspective: 900,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
    heroCard.addEventListener('mouseleave', function () {
      gsap.to(heroCard, {
        rotationX: 0, rotationY: 0,
        duration: 0.8, ease: 'elastic.out(1, 0.5)'
      });
    });
  }


  /* ================================================================
     12. CONTACT SOCIAL ICONS — pop in when scrolled into view
  ================================================================ */
  /* social icons — no animation, always visible */

  // dots removed


}); // end of window.addEventListener('load', ...)