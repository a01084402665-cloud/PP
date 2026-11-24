/**
 * PP CINEMATIC STUDIO — Interactive Animation & UX Controller
 * - Lenis Smooth Scroll
 * - GSAP & ScrollTrigger Parallax & Reveals
 * - Luxury Custom Cursor
 * - Smooth Header Navigation & Active Section Tracker
 * - Portfolio Video Hover Preview & Cinema Modal
 * - Character Persona Tab Switcher
 * - Category Filtering
 * - Dynamic Copyright & Floating Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Dynamic Copyright Year
  const currentYearElem = document.getElementById('currentYear');
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2.5 Theme Mode Controller (Luxury Dark / Royal Light)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('luxury-light');
      document.body.classList.remove('luxury-dark');
    } else {
      document.body.classList.remove('luxury-light');
      document.body.classList.add('luxury-dark');
    }
    localStorage.setItem('pp-theme', theme);
  };

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('pp-theme') || 'dark';
  applyTheme(savedTheme);

  const toggleTheme = () => {
    const isLight = document.body.classList.contains('luxury-light');
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    if (typeof showToast === 'function') {
      showToast(newTheme === 'light' ? '로열 라이트 모드로 전환되었습니다.' : '다크 럭셔리 모드로 전환되었습니다.');
    }
  };

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

  // --------------------------------------------------------------------------
  // 3. Initialize Lenis (Smooth Scroll) & GSAP ScrollTrigger Integration
  // --------------------------------------------------------------------------
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easeOut
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } catch (e) {
    console.warn('Lenis could not be initialized, falling back to native smooth scroll:', e);
  }

  // Helper smooth scroll function
  const scrollToTarget = (targetSelector, offset = 0) => {
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) return;

    if (lenis) {
      lenis.scrollTo(targetElement, {
        offset: offset,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // --------------------------------------------------------------------------
  // 4. Header Navigation & Smooth Scroll to Section
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTriggers = document.querySelectorAll('[data-scroll-to]');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Handle all smooth scroll links
  scrollTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-scroll-to');
      if (target) {
        scrollToTarget(target, target === '#hero' ? 0 : -30);
        // Close mobile drawer if open
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
          mobileToggle.classList.remove('active');
        }
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Scroll Progress Bar & Header Style on Scroll
  const progressBar = document.getElementById('progressBar');
  const topBtn = document.getElementById('topBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Progress Bar
    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Header Blur & Scrolled state
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Floating Top Button visibility
    if (topBtn) {
      if (scrollTop > 400) {
        topBtn.classList.add('visible');
      } else {
        topBtn.classList.remove('visible');
      }
    }

    // Update Active Nav Link based on visible section
    updateActiveNav();
  });

  // Top Button Click -> Smooth Scroll to top
  if (topBtn) {
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Active Navigation Tracker
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 180;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Luxury Custom Cursor Follower
  // --------------------------------------------------------------------------
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const renderFollower = () => {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderFollower);
    };
    renderFollower();

    // Hover interactive elements
    const interactives = document.querySelectorAll('a, button, .portfolio-card, .persona-tab-btn, input, textarea, select');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // --------------------------------------------------------------------------
  // 6. GSAP & ScrollTrigger Interactive Animations
  // --------------------------------------------------------------------------
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Reveal
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-badge', { y: -20, opacity: 0, duration: 0.9, delay: 0.2 })
      .from('.hero-kicker', { y: 15, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero-title .title-line', { y: 40, opacity: 0, duration: 1.1, stagger: 0.15 }, '-=0.4')
      .from('.hero-subtitle', { y: 25, opacity: 0, duration: 0.9 }, '-=0.6')
      .from('.hero-cta-group', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-scroll-indicator', { opacity: 0, duration: 1 }, '-=0.2');

    // Section Titles Fade & Parallax
    gsap.utils.toArray('.section-header').forEach((headerElem) => {
      gsap.from(headerElem.children, {
        scrollTrigger: {
          trigger: headerElem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
      });
    });

    // Portfolio Cards Stagger
    gsap.from('.portfolio-card', {
      scrollTrigger: {
        trigger: '#portfolioGrid',
        start: 'top 82%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // Profile Persona & Bio Reveal
    gsap.from('.persona-interactive-card', {
      scrollTrigger: {
        trigger: '.profile-showcase-grid',
        start: 'top 80%',
      },
      x: -40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.profile-bio-card', {
      scrollTrigger: {
        trigger: '.profile-showcase-grid',
        start: 'top 80%',
      },
      x: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Skills Bento Grid Stagger
    gsap.from('.skill-category-card', {
      scrollTrigger: {
        trigger: '.skills-bento-grid',
        start: 'top 82%',
      },
      y: 45,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // Contact Card Scale
    gsap.from('.contact-card', {
      scrollTrigger: {
        trigger: '.section-contact',
        start: 'top 78%',
      },
      y: 40,
      scale: 0.96,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Parallax floating ambient glows
    gsap.to('.glow-top', {
      y: 180,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    gsap.to('.glow-middle', {
      y: -150,
      scrollTrigger: {
        trigger: '#portfolio',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Portfolio Video Hover Preview & Cinema Modal
  // --------------------------------------------------------------------------
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const videoModal = document.getElementById('videoModal');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTag = document.getElementById('modalTag');
  const modalRatioPill = document.getElementById('modalRatioPill');
  const modalToolsList = document.getElementById('modalToolsList');

  // Hover Preview Video handler
  portfolioCards.forEach((card) => {
    const video = card.querySelector('.hover-preview-video');
    if (!video) return;

    let playPromise = null;

    card.addEventListener('mouseenter', () => {
      const src = video.getAttribute('data-src');
      if (!video.src && src) {
        video.src = src;
      }
      playPromise = video.play();
    });

    card.addEventListener('mouseleave', () => {
      if (playPromise !== null) {
        playPromise.then(() => {
          video.pause();
          video.currentTime = 0;
        }).catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Open Cinema Modal on Click
    card.addEventListener('click', () => {
      const videoSrc = card.getAttribute('data-video');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      const tools = card.getAttribute('data-tools') ? card.getAttribute('data-tools').split(',') : [];
      const ratio = card.getAttribute('data-ratio');

      openCinemaModal({ videoSrc, title, desc, tools, ratio });
    });
  });

  function openCinemaModal({ videoSrc, title, desc, tools, ratio }) {
    if (!videoModal || !modalVideoPlayer) return;

    modalTitle.textContent = title || '영상 상영';
    modalDesc.textContent = desc || '';
    modalTag.textContent = ratio === 'vertical' ? '9:16 VERTICAL CINEMATIC' : '16:9 WIDE CINEMATIC';
    modalRatioPill.textContent = ratio === 'vertical' ? 'VERTICAL SHORTS' : 'WIDE DISPLAY';

    // Populate tools badges if element exists
    if (modalToolsList) {
      modalToolsList.innerHTML = '';
      tools.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'tool-badge';
        span.textContent = t.trim();
        modalToolsList.appendChild(span);
      });
    }

    // Set video src & play
    modalVideoPlayer.src = videoSrc;
    modalVideoPlayer.load();
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const playPromise = modalVideoPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log('Autoplay blocked or interaction required:', err);
      });
    }

    // Pause Lenis smooth scroll while modal is active
    if (lenis) lenis.stop();
  }

  function closeCinemaModal() {
    if (!videoModal || !modalVideoPlayer) return;
    videoModal.classList.remove('active');
    modalVideoPlayer.pause();
    modalVideoPlayer.currentTime = 0;
    modalVideoPlayer.removeAttribute('src');
    modalVideoPlayer.load();
    document.body.style.overflow = '';

    // Resume Lenis smooth scroll
    if (lenis) lenis.start();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCinemaModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCinemaModal);

  // Close modal on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeCinemaModal();
    }
  });

  // --------------------------------------------------------------------------
  // 8. Portfolio Category Filter
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'block';
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45 });
        } else {
          card.style.display = 'none';
        }
      });

      // Refresh ScrollTrigger calculations
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Profile Persona Frame 3D Tilt Hover Effect
  // --------------------------------------------------------------------------
  const personaFrame = document.getElementById('personaFrame');
  if (personaFrame) {
    personaFrame.addEventListener('mousemove', (e) => {
      const rect = personaFrame.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 12;
      const rotateY = (x / rect.width) * 12;
      personaFrame.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    personaFrame.addEventListener('mouseleave', () => {
      personaFrame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // --------------------------------------------------------------------------
  // 10. Copy Email & Toast Notification
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');
  const luxuryToast = document.getElementById('luxuryToast');
  const toastMessage = document.getElementById('toastMessage');

  let toastTimeout = null;
  function showToast(msg) {
    if (!luxuryToast) return;
    if (toastMessage) toastMessage.textContent = msg;
    luxuryToast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      luxuryToast.classList.remove('show');
    }, 3000);
  }

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast(`이메일 주소(${email})가 복사되었습니다.`);
      }).catch(() => {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`이메일 주소(${email})가 복사되었습니다.`);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. Interactive Contact Form Submission
  // --------------------------------------------------------------------------
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('senderName')?.value || '';
    const contact = document.getElementById('senderContact')?.value || '';
    const type = document.getElementById('projectType')?.value || '';
    const message = document.getElementById('projectMessage')?.value || '';

    const subject = encodeURIComponent(`[PP 포트폴리오 프로젝트 문의] ${name}님 - ${type}`);
    const body = encodeURIComponent(
      `안녕하세요, PP STUDIO 프로젝트 협업 문의드립니다.\n\n` +
      `성함/기업명: ${name}\n` +
      `연락처: ${contact}\n` +
      `문의 분야: ${type}\n\n` +
      `프로젝트 상세 내용:\n${message}\n\n감사합니다.`
    );

    showToast('이메일 작성 창을 여는 중입니다...');
    setTimeout(() => {
      window.location.href = `mailto:a01084402665@gmail.com?subject=${subject}&body=${body}`;
    }, 600);
  };
});
