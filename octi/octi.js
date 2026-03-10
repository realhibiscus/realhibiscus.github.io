// Initialization sequence: Glides from the bright sector (100% 100%) to the dark abyss (0% 0%)
gsap.to(".parallax-bg", {
  backgroundPosition: "0% 0%", 
  duration: 3,
  ease: "power2.inOut"
});

// Parallax engine: Scroll-reactive coordinate mapping
window.addEventListener("scroll", () => {
  let scrollY = window.scrollY;
  let maxScroll = document.body.scrollHeight - window.innerHeight;
  
  // Calculates scroll progress
  let scrollPercentage = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
  
  // Shifts the gradient diagonally based on scroll depth to create a fluid wave effect
  gsap.to(".parallax-bg", {
    backgroundPosition: `${scrollPercentage / 2}% ${scrollPercentage}%`,
    duration: 0.5,
    ease: "power1.out"
  });
});

// Nav animation: Targets all children (both links and separators)
gsap.from(".gsap-nav > *", {
  y: -20,
  opacity: 0,
  duration: 1,
  stagger: 0.1,
  ease: "power2.out"
});
// This smoothly slides your main title upwards
gsap.from(".gsap-title", {
  y: 20,
  opacity: 0,
  duration: 1.5,
  delay: 0.3,
  ease: "power3.out"
});

// This slides the OCTI System subtitle right after the main title
gsap.from(".gsap-subtitle", {
  y: 20,
  opacity: 0,
  duration: 1.5,
  delay: 0.5,
  ease: "power3.out"
});

// This fades in your author text, intro paragraph, and the Omenveil note one by one
gsap.from(".gsap-fade", {
  y: 10,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  delay: 0.8
});

// This expands that glowing center divider line outward from the middle
gsap.from(".gsap-glow", {
  scaleX: 0,
  opacity: 0,
  duration: 1.5,
  delay: 1.2,
  ease: "power2.inOut"
});

// This pushes your large content card up from the bottom of the screen
gsap.from(".gsap-card", {
  y: 40,
  opacity: 0,
  duration: 1.5,
  delay: 1.5,
  ease: "power3.out"
});