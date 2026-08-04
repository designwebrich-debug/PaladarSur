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
  const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-3d');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
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
  
  // Failsafe: Ensure everything is visible even if observer/JS has issues
  setTimeout(() => {
    animatedElements.forEach(el => el.classList.add('visible'));
  }, 1500);

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
  const heroTitleSub = document.querySelector('.hero__title-sub');
  const heroTitleMain = document.querySelector('.hero__title-main');

  function handleParallax() {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const heroHeight = hero.offsetHeight;
    
    // 1. Hero Effects
    if (scrollY <= heroHeight) {
      const progress = Math.min(scrollY / (heroHeight * 0.8), 1);
      
      // Background Image Parallax
      if (heroBgImg) {
        const translate = scrollY * 0.35;
        const scale = 1 + (progress * 0.05);
        heroBgImg.style.transform = `translateY(${translate}px) scale(${scale})`;
      }

      // Ultimate Title Effect
      if (heroContentContainer) {
        const containerScale = 1 + (progress * 0.1);
        const containerOpacity = 1 - (progress * 1.1);
        const containerBlur = progress * 8;
        
        heroContentContainer.style.opacity = Math.max(containerOpacity, 0);
        heroContentContainer.style.filter = `blur(${containerBlur}px)`;
        
        if (heroTitleSub) {
          const subTranslate = scrollY * -0.4;
          const subSpacing = progress * 12;
          heroTitleSub.style.transform = `translateY(${subTranslate}px) scale(${containerScale})`;
          heroTitleSub.style.letterSpacing = `${subSpacing}px`;
        }
        
        if (heroTitleMain) {
          const mainTranslate = scrollY * -0.15;
          const mainSpacing = progress * 6;
          heroTitleMain.style.transform = `translateY(${mainTranslate}px) scale(${containerScale})`;
          heroTitleMain.style.letterSpacing = `${mainSpacing}px`;
        }
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

  const varietyCards = document.querySelectorAll('.variety-card');

  // ─── PREMIUM BANNER SLIDERS INITIALIZER ────────────────────
  function initSliders() {
    const sliderContainers = document.querySelectorAll('.banner-slider');
    
    sliderContainers.forEach(container => {
      const wrapper = container.querySelector('.banner-slider__wrapper');
      const slides = container.querySelectorAll('.banner-slide');
      const prevBtn = container.querySelector('.slider-btn--prev');
      const nextBtn = container.querySelector('.slider-btn--next');
      const dots = container.querySelectorAll('.dot');
      
      if (!wrapper || slides.length === 0) return;
      
      let currentIndex = 0;
      let autoplayInterval;
      const AUTOPLAY_DELAY = 6000;
      
      function updateSlider() {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
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
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          startAutoplay();
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          startAutoplay();
        });
      }
      
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateSlider();
          startAutoplay();
        });
      });
      
      container.addEventListener('mouseenter', stopAutoplay);
      container.addEventListener('mouseleave', startAutoplay);
      startAutoplay();
    });
  }
  
  // ─── IPHONE FAN SLIDER ───────────────────────────────────────
  (function initIPhoneFan() {
    const prevBtn = document.getElementById('ifan-prev');
    const nextBtn = document.getElementById('ifan-next');
    const phones  = document.querySelectorAll('.ifan-phone');
    const dots    = document.querySelectorAll('.ifan-dot');
    if (!prevBtn || !nextBtn || phones.length === 0) return;

    // Images array (3 images, cycling through 5 positions)
    const images = [
      'assets/iphone-pasta.png?v=20260804',
      'assets/iphone-cazuela.png?v=20260804',
      'assets/iphone-encocado.png?v=20260804'
    ];
    const alts = [
      'Pasta Son del Pacífico',
      'Cazuela de Pescado',
      'Encocado Petronio'
    ];

    // Position names for 5 slots
    const POSITIONS = ['far-left', 'left', 'center', 'right', 'far-right'];

    // Current "offset" — which image is at center
    let current = 0; // index into images[]
    let autoTimer = null;

    function getImgIndex(offset) {
      return ((current + offset) % images.length + images.length) % images.length;
    }

    function render() {
      // 5 visual positions, map each to an image
      // slots: far-left=-2, left=-1, center=0, right=+1, far-right=+2
      const offsets = [-2, -1, 0, 1, 2];
      phones.forEach((phone, i) => {
        const imgEl  = phone.querySelector('.ifan-phone__img');
        const idx    = getImgIndex(offsets[i]);
        phone.setAttribute('data-pos', POSITIONS[i]);
        imgEl.src    = images[idx];
        imgEl.alt    = alts[idx];
        // Dark blend for cazuela (dark bg jpg)
        if (idx === 1) {
          imgEl.classList.add('ifan-phone__img--dark');
        } else {
          imgEl.classList.remove('ifan-phone__img--dark');
        }
      });

      // Dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('ifan-dot--active', i === current);
      });
    }

    function next() {
      current = (current + 1) % images.length;
      render();
    }

    function prev() {
      current = (current - 1 + images.length) % images.length;
      render();
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 3500);
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    nextBtn.addEventListener('click', () => { next(); startAuto(); });
    prevBtn.addEventListener('click', () => { prev(); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        current = i;
        render();
        startAuto();
      });
    });

    // Pause on hover
    const wrapper = document.querySelector('.iphone-fan-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAuto);
      wrapper.addEventListener('mouseleave', startAuto);
    }

    render();
    startAuto();
  })();

});
