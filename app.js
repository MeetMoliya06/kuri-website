document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Check if Touch Device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let lenis = null;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true
  });

  if (!isTouchDevice) {
    // Initialize Lenis Smooth Scroll (Desktop Only)
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      infinite: false,
    });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      if (e.scroll > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
      } else {
        document.querySelector('.navbar').classList.remove('scrolled');
      }
    });

    // Use GSAP ticker for Lenis RAF (only once)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Native Mobile Scroll Listener
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
      } else {
        document.querySelector('.navbar').classList.remove('scrolled');
      }
    });
  }

  // Scroll to top listener
  const scrollTopLink = document.querySelector('a[href="#smooth-wrapper"]');
  if (scrollTopLink) {
    scrollTopLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }


  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  // 3. Magnetic Hover Effect (Only for Navbar/Hero Buttons now)
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
    
    // NOTE: Removed '.hover-magnetic-subtle' block.
    // The new Geometric Cards use pure CSS for their bouncy hover states!
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
  .from('.phone-mockup-image', {
    y: 100,
    rotationY: 15,
    rotationX: -5,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out"
  }, "-=0.8")
  .from('.doodle-cloche', {
    y: -20,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)"
  }, "-=0.5")
  .from('.mockup-offset-frame', {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  }, "-=1.0");

  // 5. GSAP Scroll Animations
  // Parallax the phone mockup slightly on scroll (Desktop only for performance)
  if (!isTouchDevice) {
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
  }

  // Staggered reveal for Features Grid (Geometric Cards)
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

  // App Journey — reveal steps on scroll
  document.querySelectorAll('.journey-step').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 72%',
      once: true,
      onEnter: () => step.classList.add('is-visible'),
    });
  });

  // App Journey — dynamic SVG path, runs after load so image heights are final
  function initJourneyPath() {
    const journeyDesktop = document.querySelector('.journey-desktop');
    const svgEl = document.getElementById('journeyPathSvg');
    const pathEl = document.getElementById('journeyPath');
    const steps = Array.from(document.querySelectorAll('.journey-desktop .journey-step'));

    if (!journeyDesktop || !svgEl || !pathEl || !steps.length) return;

    const scrollY = window.scrollY;
    const sRect = journeyDesktop.getBoundingClientRect();
    const W = sRect.width;
    const H = sRect.height;
    const sAbsTop = sRect.top + scrollY;

    const pts = steps.map((step) => {
      const r = step.getBoundingClientRect();
      const y = (r.top + scrollY) - sAbsTop + r.height / 2;
      const x = step.dataset.side === 'left' ? W * 0.28 : W * 0.72;
      return { x, y };
    });

    let d = `M ${W / 2} 0`;

    pts.forEach((pt, i) => {
      if (i === 0) {
        const gap = pt.y;
        // CP1 leans to the OPPOSITE side of where we're going —
        // this creates a wide graceful sweep instead of a straight dive
        const leanX = pt.x < W / 2 ? W * 0.72 : W * 0.28;
        d += ` C ${leanX} ${gap * 0.1}, ${pt.x} ${pt.y - gap * 0.22}, ${pt.x} ${pt.y}`;
      } else {
        const prev = pts[i - 1];
        const gap = pt.y - prev.y;
        const pull = gap * 0.36;
        d += ` C ${prev.x} ${prev.y + pull}, ${pt.x} ${pt.y - pull}, ${pt.x} ${pt.y}`;
      }
      // Decorative circle loop at each waypoint — path lassos the dot then continues
      const lr = 24;
      const sweep = pt.x < W / 2 ? 0 : 1;
      d += ` a ${lr} ${lr} 0 1 ${sweep} 0.01 0`;
    });

    const last = pts[pts.length - 1];
    const tailGap = H - last.y;
    d += ` C ${last.x} ${last.y + tailGap * 0.4}, ${W / 2} ${H - tailGap * 0.2}, ${W / 2} ${H}`;

    svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
    pathEl.setAttribute('d', d);

    // Use setAttribute for SVG attrs — gsap.set is unreliable for stroke-dash* on SVG
    const pathLen = pathEl.getTotalLength();
    pathEl.setAttribute('stroke-dasharray', pathLen);
    pathEl.setAttribute('stroke-dashoffset', pathLen);

    const lastStep = steps[steps.length - 1];

    // Animate via GSAP attr:{} — the correct way to tween SVG presentation attributes
    gsap.to(pathEl, {
      attr: { 'stroke-dashoffset': 0 },
      ease: 'none',
      scrollTrigger: {
        trigger: journeyDesktop,
        start: 'top 85%',
        endTrigger: lastStep,
        end: 'center 55%',
        scrub: 1,
      }
    });
  }

  // App Journey — mobile vertical line fill
  const mobileLineFill = document.querySelector('.journey-mobile-line-fill');
  const mobileJourney = document.querySelector('.journey-mobile');

  if (mobileLineFill && mobileJourney) {
    gsap.to(mobileLineFill, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: mobileJourney,
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 1,
      }
    });
  }

  // Refresh once layout settles (fonts, mockup, etc.)
  ScrollTrigger.refresh();

  // Mobile Menu Toggle Logic
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuCloseLinks = document.querySelectorAll('.mobile-menu-close');
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    hamburger.setAttribute('aria-expanded', isMenuOpen);
    hamburger.classList.toggle('is-active');
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('menu-open', isMenuOpen);
    }
    
    if (isMenuOpen) {
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock scroll
      if(lenis) lenis.stop(); // stop lenis scrolling
    } else {
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Unlock scroll
      if(lenis) lenis.start(); // start lenis scrolling
    }
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMenu);
  }

  mobileMenuCloseLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // Refresh heights when page is fully loaded (images, fonts, layout)
  window.addEventListener('load', () => {
    if (lenis) lenis.resize();
    initJourneyPath();
    ScrollTrigger.refresh();
  });

  // Remove loading class when done
  document.body.classList.remove('loading');

});