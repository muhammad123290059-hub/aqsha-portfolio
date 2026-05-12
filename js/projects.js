/* ============================================================
   PROJECTS — Filter functionality
   ============================================================ */

(function () {
  'use strict';

  var filters = document.querySelectorAll('.work__filters .chip');
  var cards = document.querySelectorAll('.work-card');

  if (!filters.length || !cards.length) return;

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active state
      filters.forEach(function (f) { f.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var filter = btn.getAttribute('data-filter');

      cards.forEach(function (card) {
        var categories = card.getAttribute('data-category') || '';

        if (filter === 'all' || categories.indexOf(filter) !== -1) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';

          // Animate in
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(function () {
            card.classList.add('is-hidden');
          }, 300);
        }
      });
    });
  });

  // ---- Tilt effect on hover ----
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = ((y - centerY) / centerY) * -3;
      var rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';
    });
  });
})();
