/**
 * wp-modern-homepage: theme switcher + slider + news grid
 */
(function () {
  'use strict';

  /* ── Theme Switcher ── */
  const STORAGE_KEY = 'wmh_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('wmh-theme-toggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light' : 'Switch to dark');
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY)
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(saved);

    const btn = document.getElementById('wmh-theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  }

  /* ── Hero Slider ── */
  function initSlider() {
    const slider = document.querySelector('.wmh-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.wmh-slide');
    const prev   = slider.querySelector('.wmh-slider__prev');
    const next   = slider.querySelector('.wmh-slider__next');
    let current  = 0;
    let timer;

    function show(index) {
      slides[current].classList.remove('wmh-slide--active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('wmh-slide--active');
    }

    function autoplay() {
      timer = setInterval(() => show(current + 1), 5000);
    }

    function resetAutoplay() {
      clearInterval(timer);
      autoplay();
    }

    if (slides.length) {
      slides[0].classList.add('wmh-slide--active');
      autoplay();
    }

    prev && prev.addEventListener('click', () => { show(current - 1); resetAutoplay(); });
    next && next.addEventListener('click', () => { show(current + 1); resetAutoplay(); });
  }

  /* ── News Slider (mobile) ── */
  function initNewsSlider() {
    const grid = document.querySelector('.wmh-news-grid');
    if (!grid) return;

    let startX = 0;
    let scrollLeft = 0;

    grid.addEventListener('touchstart', e => {
      startX    = e.touches[0].pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    }, { passive: true });

    grid.addEventListener('touchmove', e => {
      const x    = e.touches[0].pageX - grid.offsetLeft;
      const walk = (x - startX) * 1.5;
      grid.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  }

  /* ── Quick Search ── */
  function initSearch() {
    const btn   = document.getElementById('wmh-search-toggle');
    const form  = document.getElementById('wmh-search-form');
    const input = form && form.querySelector('input[type="search"]');
    if (!btn || !form) return;

    btn.addEventListener('click', () => {
      const open = form.classList.toggle('wmh-search--open');
      btn.setAttribute('aria-expanded', String(open));
      if (open && input) input.focus();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        form.classList.remove('wmh-search--open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSlider();
    initNewsSlider();
    initSearch();
  });
})();