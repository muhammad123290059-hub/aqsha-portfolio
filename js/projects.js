/* ============================================================
   PROJECTS — Mission Archive scroll reveal & count-up
   ============================================================ */

(function () {
  'use strict';

  var entries = document.querySelectorAll('.mission-entry');
  var nextBlock = document.querySelector('.mission-next');

  if (!entries.length) return;

  // ---- Count-up animation for mission numbers ----
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 600;
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = Math.round(eased * target);
      el.textContent = String(current).padStart(3, '0');

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ---- IntersectionObserver for staggered reveal ----
  var revealObserver = new IntersectionObserver(function (items) {
    items.forEach(function (item) {
      if (!item.isIntersecting) return;

      var el = item.target;
      var delay = el.getAttribute('data-reveal-delay') || 0;

      setTimeout(function () {
        el.classList.add('is-visible');

        // Trigger count-up on mission numbers
        var numEl = el.querySelector('.mission-num');
        if (numEl && !numEl.dataset.counted) {
          numEl.dataset.counted = 'true';
          animateCount(numEl);
        }
      }, delay);

      revealObserver.unobserve(el);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  // Stagger entries
  entries.forEach(function (entry, i) {
    entry.setAttribute('data-reveal-delay', i * 100);
    revealObserver.observe(entry);
  });

  // Observe next mission block
  if (nextBlock) {
    nextBlock.setAttribute('data-reveal-delay', entries.length * 100);
    revealObserver.observe(nextBlock);
  }
})();
