/* ═══════════════════════════════════════════════════════════════
   PALADAR SUR® — ONE PAGE LANDING — JAVASCRIPT
   Apple-inspired interactions & scroll animations
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── DOM REFERENCES ───────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.navbar__link') : [];

  // ─── SCROLL PROGRESS BAR ─────────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress');
  document.body.prepend(progressBar);

  // ─── NAVBAR SCROLL EFFECT ────────────────────────────────────
  let lastScroll = 0;
  const SCROLL_THRESHOLD = 60;

  function handleNavbarScroll() {
    const currentScroll = window.scrollY;

    // Add/remove scrolled class
    if (currentScroll > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (currentScroll / docHeight) * 100;
    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;

    lastScroll = currentScroll;
  }

  // ─── HAMBURGER MENU ──────────────────────────────────────────
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── SCROLL ANIMATIONS (IntersectionObserver) ────────────────
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.offsetTop - 72;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── LANGUAGE TOGGLE ─────────────────────────────────────────
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    const langOptions = langToggle.querySelectorAll('.navbar__lang-option');
    langToggle.addEventListener('click', () => {
      langOptions.forEach(opt => opt.classList.toggle('navbar__lang-option--active'));
    });
  }

  // ─── PARALLAX EFFECT ON HERO ─────────────────────────────────
  const heroBgImg = document.querySelector('.hero__bg-img');
  const heroContentContainer = document.querySelector('.hero__content');

  function handleParallax() {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const heroHeight = hero.offsetHeight;
    
    if (scrollY <= heroHeight) {
      // Background Image Parallax
      if (heroBgImg) {
        const translate = scrollY * 0.3;
        const scale = 1 + (scrollY * 0.0002);
        heroBgImg.style.transform = `translateY(${translate}px) scale(${scale})`;
      }

      // Title Zoom & Fade Effect
      if (heroContentContainer) {
        // Calculate progress (0 to 1) over the first 70% of the hero height
        const progress = Math.min(scrollY / (heroHeight * 0.7), 1);
        
        const titleScale = 1 + (progress * 0.15); // Grow 15%
        const titleOpacity = 1 - (progress * 1.2); // Fade out (faster than zoom)
        const titleTranslate = scrollY * -0.2; // Move up slowly
        
        heroContentContainer.style.transform = `translateY(${titleTranslate}px) scale(${titleScale})`;
        heroContentContainer.style.opacity = Math.max(titleOpacity, 0);
      }
    }
  }

  // ─── SCROLL EVENT (throttled with rAF) ───────────────────────
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial call
  handleNavbarScroll();

  // ─── HERO CONTENT ENTRANCE ANIMATION ─────────────────────────
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const children = heroContent.querySelectorAll('.animate-on-scroll');
    children.forEach((child, index) => {
      child.style.transitionDelay = `${0.3 + (index * 0.15)}s`;
      // Trigger after a short delay
      setTimeout(() => {
        child.classList.add('visible');
      }, 100);
    });
  }

  // ─── HOVER SOUND EFFECT (optional subtle) ────────────────────
  // Disabled by default — uncomment to enable subtle click feedback

  // ─── PREMIUM BANNER SLIDER ──────────────────────────────────
  const sliderWrapper = document.getElementById('slider-wrapper');
  const slides = document.querySelectorAll('.banner-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dots = document.querySelectorAll('.dot');
  
  if (sliderWrapper && slides.length > 0) {
    let currentIndex = 0;
    let autoplayInterval;
    const AUTOPLAY_DELAY = 5000;
    
    function updateSlider() {
      // Update wrapper position
      sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }
    
    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    }
    
    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }
    
    function stopAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
    }
    
    // Event Listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay(); // Reset timer
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay(); // Reset timer
      });
    }
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
        startAutoplay(); // Reset timer
      });
    });
    
    // Pause on hover
    const sliderContainer = document.querySelector('.banner-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopAutoplay);
      sliderContainer.addEventListener('mouseleave', startAutoplay);
    }
    
    // Initial start
    startAutoplay();
  }

  // ─── CONSOLE BRANDING ────────────────────────────────────────
  console.log(
    '%c🌿 Paladar Sur® — Somos Tradición Desde 1975',
    'color: #00ae51; font-size: 16px; font-weight: bold; font-family: system-ui;'
  );
  console.log(
    '%cDesarrollado con ❤️ para el Día de la Madre 2026',
    'color: #e9a1a6; font-size: 12px; font-family: system-ui;'
  );
});
