/* ============================================================
   HERO & GLOBAL COUNTERS — Scroll-triggered animated numbers
   ============================================================ */

(function () {
  'use strict';

  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    if (el.__animated) return;
    el.__animated = true;

    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // Observe every counter individually so each fires when it enters view
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { io.observe(el); });

  /* ---- Hero grid parallax ---- */
  var heroGrid = document.querySelector('.hero__grid');
  if (heroGrid) {
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        heroGrid.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
        heroGrid.style.opacity = Math.max(0, 0.4 - scrollY / (window.innerHeight * 1.5));
      }
    }, { passive: true });
  }
})();
