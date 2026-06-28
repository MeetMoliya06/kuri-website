document.addEventListener("DOMContentLoaded", () => {
  
  gsap.registerPlugin(ScrollTrigger);


  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  // 3. Magnetic Hover Effect
  if (isFinePointer) {
    document.querySelectorAll('.hover-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const h = rect.width / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - (rect.height / 2);
        
        gsap.to(this, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
      });
      
      btn.addEventListener('mouseleave', function() {
        gsap.to(this, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      });
    });

    document.querySelectorAll('.hover-magnetic-subtle').forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const h = rect.width / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - (rect.height / 2);
        gsap.to(this, { x: x * 0.05, y: y * 0.05, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function() {
        gsap.to(this, { x: 0, y: 0, duration: 0.7, ease: 'power2.out' });
      });
    });
  }

  // 4. GSAP Entry Animations
  // Text Splitting for Hero
  const splitTitle = new SplitType('.split-text', { types: 'words, chars' });
  
  const tl = gsap.timeline();

  tl.from(splitTitle.chars, {
    y: 100,
    opacity: 0,
    rotationZ: 5,
    duration: 1,
    stagger: 0.015,
    ease: "power4.out",
    delay: 0.2
  })
  .from('.gsap-fade-up', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out"
  }, "-=0.6")
  .from('.phone-mockup', {
    y: 100,
    rotationY: 15,
    rotationX: -5,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out"
  }, "-=0.8")
  .from('.card-pop', {
    scale: 0.8,
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.5)"
  }, "-=0.5");

  // 5. GSAP Scroll Animations
  // Parallax the phone mockup slightly on scroll
  gsap.to('.parallax-mockup', {
    y: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Staggered reveal for Features Grid
  gsap.from('.gsap-stagger-card', {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".features",
      start: "top 75%"
    }
  });

  // 6. Reveal-on-scroll for extended sections
  document.querySelectorAll('.reveal').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        el.classList.add('is-in');

        // Animate any score bars inside this element
        el.querySelectorAll('.axis-fill').forEach((bar) => {
          bar.style.width = bar.dataset.width || '0%';
        });

        // Count up any stat numbers inside this element
        el.querySelectorAll('.count').forEach((num) => {
          const target = parseFloat(num.dataset.target);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => { num.textContent = Math.round(obj.v); },
          });
        });
      },
    });
  });

  // Refresh once layout settles (fonts, mockup, etc.)
  ScrollTrigger.refresh();

  // Remove loading class when done
  document.body.classList.remove('loading');

});
