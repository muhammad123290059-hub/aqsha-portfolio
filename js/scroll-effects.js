/* ============================================================
   SCROLL EFFECTS — Reveal on scroll & skill bar animation
   ============================================================ */

(function () {
  'use strict';

  // ---- Reveal on scroll ----
  var reveals = document.querySelectorAll('[data-reveal]');

  if (!reveals.length) return;

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- Skill progress bars ----
  var skillCards = document.querySelectorAll('.skill-card');

  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Animate bars
        var bars = entry.target.querySelectorAll('[data-progress]');
        bars.forEach(function (bar, index) {
          var progress = bar.getAttribute('data-progress');
          setTimeout(function () {
            bar.querySelector('i').style.width = progress + '%';
            bar.style.setProperty('--bar-width', progress + '%');
          }, index * 100);
        });

        skillObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  skillCards.forEach(function (card) {
    skillObserver.observe(card);
  });

  // ---- Timeline items stagger ----
  var timelineItems = document.querySelectorAll('.timeline__item');

  var timelineObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  timelineItems.forEach(function (item) {
    timelineObserver.observe(item);
  });
})();
