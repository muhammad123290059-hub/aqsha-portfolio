/* ============================================================
   HERO — Counter animation & parallax-like effects
   ============================================================ */

(function () {
  'use strict';

  // ---- Animated counters ----
  var counters = document.querySelectorAll('[data-count]');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);

        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Trigger counters when hero meta is in view
  var heroMeta = document.querySelector('.hero__meta');
  if (heroMeta && counters.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(heroMeta);
  }

  // ---- Parallax on hero grid ----
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
