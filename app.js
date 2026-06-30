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

  // App Journey Section — SVG path draw + step reveals (desktop)
  const journeySection = document.querySelector('.journey-desktop');
  const journeyPath = document.getElementById('journeyPath');

  if (journeySection && journeyPath) {
    const pathLength = journeyPath.getTotalLength();
    journeyPath.style.strokeDasharray = pathLength;
    journeyPath.style.strokeDashoffset = pathLength;

    gsap.to(journeyPath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: journeySection,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 1.5,
      }
    });

    // Reveal each step as scroll reaches it
    document.querySelectorAll('.journey-step').forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 70%',
        once: true,
        onEnter: () => step.classList.add('is-visible'),
      });
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
    if (lenis) {
      lenis.resize();
    }
    ScrollTrigger.refresh();
  });

  // Remove loading class when done
  document.body.classList.remove('loading');

});