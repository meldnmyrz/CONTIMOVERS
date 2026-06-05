/* ContiMovers — main.js */

// --- Navbar scroll behavior + burger menu ---
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });
const navMenu = document.getElementById('navMenu');

function closeMenu() {
  navMenu?.classList.remove('open');
  burger?.classList.remove('is-open');
  navbar?.classList.remove('menu-open');
  document.body.style.overflow = '';
}

burger?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burger.classList.toggle('is-open', isOpen);
  navbar.classList.toggle('menu-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// --- Dropdown toggle en móvil ---
navMenu?.querySelectorAll('[data-toggle="dropdown"]').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    // Solo en móvil
    if (window.innerWidth > 768) return;
    const dropdown = toggle.closest('.nav-dropdown');
    const isOpen = dropdown.classList.toggle('is-open');
    // Si el click fue en la flecha (no en el link), prevenir navegación
    if (e.target.closest('.toggle-arrow')) {
      e.preventDefault();
    }
  });
});

// Cerrar al hacer click en un enlace del menú (no en los toggles)
navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (e.target.closest('[data-toggle="dropdown"]') && !e.target.closest('.toggle-arrow')) return;
    closeMenu();
  });
});

// Cerrar al tocar fuera del menú
document.addEventListener('click', (e) => {
  if (navMenu?.classList.contains('open') && !navMenu.contains(e.target) && !burger.contains(e.target)) {
    closeMenu();
  }
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('revealed'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// --- Animated counters ---
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString('es-PE');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// --- Hero scroll transition ---
(function () {
  const heroScroll = document.getElementById('heroScroll');
  const slide1     = document.getElementById('heroSlide1');
  const slide2     = document.getElementById('heroSlide2');
  const dots       = document.querySelectorAll('.hero-dot');
  const heroDots   = document.querySelector('.hero-dots');
  if (!heroScroll || !slide1 || !slide2) return;

  const img1 = slide1.querySelector('.hero-slide__img');
  const img2 = slide2.querySelector('.hero-slide__img');

  function setDot(i) {
    dots.forEach((d, j) => d.classList.toggle('hero-dot--active', j === i));
  }

  // Dot click → scroll al punto correcto
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const top = heroScroll.offsetTop + (i === 0 ? 0 : window.innerHeight);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function ease(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
  const isMobile = () => window.innerWidth <= 768;

  // Setup inicial
  const c1 = slide1.querySelector('.hero-slide__content');
  const c2 = slide2.querySelector('.hero-slide__content');
  slide2.style.opacity = '0';
  if (c2) { c2.style.opacity = '0'; c2.style.transform = 'translateY(20px)'; }

  let rafPending = false;

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const scrollY = window.scrollY;
      const vh      = window.innerHeight;
      const heroTop = heroScroll.offsetTop;
      const raw     = clamp01((scrollY - heroTop) / vh);
      const mobile  = isMobile();

      /* ─── SLIDE 1 ─── */
      const kbP   = ease(clamp01(raw / 0.85));
      const fadeP = ease(clamp01((raw - 0.45) / 0.35));

      // Ken Burns solo en desktop (muy pesado en móvil)
      if (!mobile && img1) img1.style.transform = `scale(${1 + kbP * 0.14})`;
      if (c1) {
        c1.style.opacity   = `${1 - fadeP}`;
        c1.style.transform = `translateY(${-fadeP * 20}px)`;
      }

      /* ─── SLIDE 2 ─── */
      const p2  = ease(clamp01((raw - 0.35) / 0.55));
      const tp2 = ease(clamp01((raw - 0.58) / 0.42));

      slide2.style.opacity = `${p2}`;
      // Zoom inverso solo en desktop
      if (!mobile && img2) img2.style.transform = `scale(${1.1 - p2 * 0.1})`;
      if (c2) {
        c2.style.opacity   = `${tp2}`;
        c2.style.transform = `translateY(${(1 - tp2) * 20}px)`;
      }

      // Dots
      setDot(raw > 0.55 ? 1 : 0);
      if (heroDots) {
        const heroH = heroScroll.offsetHeight;
        heroDots.classList.toggle('is-hidden', scrollY > heroTop + heroH - vh * 0.3);
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
