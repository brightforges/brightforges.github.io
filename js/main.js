/**
 * Bright Forge - Modern Responsive Single-Page Application
 * Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSparks();
  initStickyNavbar();
  initMobileMenu();
  initScrollSpy();
  initRevealOnScroll();
  initAnimatedCounters();
  initPortfolioFilter();
  initTestimonialCarousel();
  initContactForm();
  initQuoteModal();
  initBackToTop();
  initSmoothScroll();
});

/* ==========================================================================
   1. HERO SPARK & PARTICLE CANVAS ANIMATION
   ========================================================================== */
function initHeroSparks() {
  const canvas = document.getElementById('sparkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 80;
  const colors = [
    'rgba(255, 106, 0, ',    // Vibrant Orange
    'rgba(255, 140, 0, ',    // Deep Orange
    'rgba(255, 200, 61, ',   // Golden Yellow
    'rgba(255, 235, 153, '   // Bright spark white-gold
  ];

  let mouse = { x: null, y: null, radius: 100 };

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  class Spark {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + Math.random() * 20;
      this.size = Math.random() * 2.8 + 0.8;
      this.speedY = -(Math.random() * 1.6 + 0.6);
      this.speedX = (Math.random() - 0.5) * 0.9;
      this.baseAlpha = Math.random() * 0.7 + 0.3;
      this.alpha = this.baseAlpha;
      this.fadeRate = Math.random() * 0.004 + 0.002;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.sway = Math.random() * 0.03 + 0.01;
      this.swayAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.swayAngle += this.sway;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.5;
      this.y += this.speedY;
      this.alpha -= this.fadeRate;

      // Mouse gentle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 2;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      if (this.y < -10 || this.alpha <= 0 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + Math.max(0, this.alpha) + ')';
      ctx.shadowBlur = this.size * 6;
      ctx.shadowColor = '#FF6A00';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Spark());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. STICKY NAVBAR & MOBILE MENU
   ========================================================================== */
function initStickyNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      navbar.classList.add('bg-[#121A2B]/95', 'backdrop-blur-md', 'shadow-xl', 'py-3');
      navbar.classList.remove('bg-transparent', 'py-5');
    } else {
      navbar.classList.remove('bg-[#121A2B]/95', 'backdrop-blur-md', 'shadow-xl', 'py-3');
      navbar.classList.add('bg-transparent', 'py-5');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. SCROLL SPY (ACTIVE NAV LINK)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-[#FF6A00]', 'font-semibold');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-[#FF6A00]', 'font-semibold');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   4. REVEAL ON SCROLL (FADE IN ANIMATION)
   ========================================================================== */
function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. ANIMATED COUNTERS (ABOUT US)
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-counter');
  if (!counterElements.length) return;

  let hasAnimated = false;

  const startCounters = () => {
    counterElements.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * target);

        counter.textContent = currentCount + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          hasAnimated = true;
          startCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(aboutSection);
  }
}

/* ==========================================================================
   6. PORTFOLIO FILTER TABS
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card-item');

  if (!filterBtns.length || !portfolioCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-[#FF6A00]', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      });

      btn.classList.add('bg-[#FF6A00]', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. TESTIMONIAL CAROUSEL
   ========================================================================== */
function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const carouselContainer = document.getElementById('testimonialCarouselContainer');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  const showSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;

    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
        slide.classList.remove('hidden');
      } else {
        slide.classList.remove('active');
        slide.classList.add('hidden');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('bg-[#FF6A00]', 'w-8');
        dot.classList.remove('bg-slate-300', 'w-3');
      } else {
        dot.classList.remove('bg-[#FF6A00]', 'w-8');
        dot.classList.add('bg-slate-300', 'w-3');
      }
    });
  };

  const nextSlide = () => showSlide(currentIndex + 1);
  const prevSlide = () => showSlide(currentIndex - 1);

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(targetIndex);
    });
  });

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
      }
      startAutoplay();
    }, { passive: true });
  }

  showSlide(0);
  startAutoplay();
}

/* ==========================================================================
   8. FORM VALIDATION & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');

  const showError = (input, message) => {
    input.classList.add('border-red-500', 'focus:ring-red-400');
    input.classList.remove('border-slate-300', 'focus:ring-[#FF6A00]');
    let errorElem = input.parentElement.querySelector('.form-error-msg');
    if (!errorElem) {
      errorElem = document.createElement('p');
      errorElem.className = 'form-error-msg text-xs text-red-500 mt-1 font-medium';
      input.parentElement.appendChild(errorElem);
    }
    errorElem.textContent = message;
  };

  const clearError = (input) => {
    input.classList.remove('border-red-500', 'focus:ring-red-400');
    input.classList.add('border-slate-300', 'focus:ring-[#FF6A00]');
    const errorElem = input.parentElement.querySelector('.form-error-msg');
    if (errorElem) errorElem.remove();
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Allows optional +, digits, spaces, dashes, parentheses
    return /^[\d\s+\-()]{7,20}$/.test(phone.trim());
  };

  // Real-time error removal
  [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Please provide your email address.');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Validate Phone (Optional)
    if (phoneInput && phoneInput.value.trim() && !validatePhone(phoneInput.value.trim())) {
      showError(phoneInput, 'Please enter a valid phone number format.');
      isValid = false;
    } else if (phoneInput) {
      clearError(phoneInput);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Message must be at least 10 characters long.');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Forging Transmission...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        showToast('Thank you! Your message has been forged. We will reply within 24 hours.', 'success');
      }, 1200);
    }
  });
}

/* ==========================================================================
   9. GET A QUOTE MODAL DIALOG
   ========================================================================== */
function initQuoteModal() {
  const openButtons = document.querySelectorAll('.open-quote-modal');
  const modal = document.getElementById('quoteModal');
  const closeBtn = document.getElementById('closeQuoteModal');
  const quoteForm = document.getElementById('quoteForm');

  if (!modal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  openButtons.forEach((btn) => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Quote request received! Our team is preparing your custom blueprint.', 'success');
      quoteForm.reset();
    });
  }
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;

  if (toastIcon) {
    if (type === 'success') {
      toastIcon.innerHTML = `
        <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;
    } else {
      toastIcon.innerHTML = `
        <svg class="w-6 h-6 text-[#FF6A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;
    }
  }

  toast.classList.remove('toast-hidden');
  toast.classList.add('toast-visible');

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hidden');
  }, 4500);
}

/* ==========================================================================
   11. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  const toggleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-6');
      backToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-6');
      backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    }
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   12. SMOOTH SCROLL FOR IN-PAGE ANCHORS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

