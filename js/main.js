/* ContiMovers — main.js */

// --- Navbar scroll behavior ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// --- Mobile burger menu ---
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
burger?.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
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

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  // ease in-out cúbico
  function ease(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }

  // Setup inicial
  const c1 = slide1.querySelector('.hero-slide__content');
  const c2 = slide2.querySelector('.hero-slide__content');
  slide2.style.opacity = '0';
  if (c2) { c2.style.opacity = '0'; c2.style.transform = 'translateY(28px)'; }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const vh      = window.innerHeight;
    const heroTop = heroScroll.offsetTop;

    // raw: 0 = inicio hero, 1 = fin de los 200vh
    const raw = clamp01((scrollY - heroTop) / vh);

    /* ─── SLIDE 1 ─────────────────────────────────────────
       Ken Burns: imagen hace zoom lento mientras el usuario
       scrollea. Texto y overlay se desvanecen al final.     */
    const kbP   = ease(clamp01(raw / 0.85));          // 0→1 durante casi todo el scroll
    const fadeP = ease(clamp01((raw - 0.45) / 0.35)); // fade empieza al 45%, completo al 80%

    if (img1) img1.style.transform = `scale(${1 + kbP * 0.14})`;
    if (c1)  { c1.style.opacity = `${1 - fadeP}`; c1.style.transform = `translateY(${-fadeP * 24}px)`; }

    /* ─── SLIDE 2 ─────────────────────────────────────────
       Cross-dissolve puro: empieza a aparecer al 35%.
       Imagen arranca con zoom-out suave (zoom → normal).
       Texto entra desde abajo con ligero delay.             */
    const p2  = ease(clamp01((raw - 0.35) / 0.55));  // 0→1 entre 35% y 90%
    const tp2 = ease(clamp01((raw - 0.58) / 0.42));  // texto empieza al 58%

    slide2.style.opacity = `${p2}`;
    if (img2) img2.style.transform = `scale(${1.1 - p2 * 0.1})`;
    if (c2)  { c2.style.opacity = `${tp2}`; c2.style.transform = `translateY(${(1 - tp2) * 28}px)`; }

    // Dots
    setDot(raw > 0.55 ? 1 : 0);
    if (heroDots) {
      const heroH = heroScroll.offsetHeight;
      heroDots.classList.toggle('is-hidden', scrollY > heroTop + heroH - vh * 0.3);
    }
  }, { passive: true });
})();
