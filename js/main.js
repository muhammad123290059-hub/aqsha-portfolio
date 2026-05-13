/* ============================================================
   MAIN — Loading screen, form handling, global init
   ============================================================ */

(function () {
  'use strict';

  // ---- Loading screen ----
  var loader = document.getElementById('loader');
  var loaderFill = loader ? loader.querySelector('.loader__fill') : null;
  var loaderCount = loader ? loader.querySelector('.loader__count') : null;

  function runLoader() {
    if (!loader) {
      document.body.classList.remove('is-loading');
      return;
    }

    document.body.classList.add('is-loading');

    var progress = 0;
    var target = 100;
    var speed = 1.5;

    function tick() {
      // Accelerate towards end
      var remaining = target - progress;
      var increment = Math.max(0.5, remaining * 0.04) * speed;
      progress = Math.min(progress + increment, target);

      if (loaderFill) loaderFill.style.width = progress + '%';
      if (loaderCount) loaderCount.textContent = Math.floor(progress);

      if (progress < target) {
        requestAnimationFrame(tick);
      } else {
        // Done
        setTimeout(function () {
          loader.classList.add('is-done');
          document.body.classList.remove('is-loading');
        }, 300);
      }
    }

    // Start after a brief pause for dramatic effect
    setTimeout(tick, 200);
  }

  // Run loader on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoader);
  } else {
    runLoader();
  }

  // ---- Contact form (Formspree via AJAX) ----
  var form = document.querySelector('.contact__form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.querySelector('span').textContent;

      // Simple validation
      var inputs = form.querySelectorAll('[required]');
      var valid = true;

      inputs.forEach(function (input) {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = 'var(--ember)';
          setTimeout(function () {
            input.style.borderColor = '';
          }, 2000);
        }
      });

      if (!valid) return;

      // Send via Formspree
      btn.querySelector('span').textContent = 'Mengirim…';
      btn.disabled = true;
      btn.style.opacity = '0.6';

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          btn.querySelector('span').textContent = 'Terkirim ✓';
          btn.style.opacity = '1';
          btn.style.background = '#22c55e';
          btn.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.3)';
          form.reset();

          setTimeout(function () {
            btn.querySelector('span').textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = '';
            btn.style.background = '';
            btn.style.boxShadow = '';
          }, 3000);
        } else {
          btn.querySelector('span').textContent = 'Gagal, coba lagi';
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.background = 'var(--ember)';

          setTimeout(function () {
            btn.querySelector('span').textContent = originalText;
            btn.style.background = '';
          }, 3000);
        }
      }).catch(function () {
        btn.querySelector('span').textContent = 'Error, coba lagi';
        btn.disabled = false;
        btn.style.opacity = '1';

        setTimeout(function () {
          btn.querySelector('span').textContent = originalText;
        }, 3000);
      });
    });
  }

  // ---- Smooth scroll for all anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var nav = document.getElementById('nav');
        var offset = nav ? nav.offsetHeight + 20 : 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---- Skill card shine on mouse move ----
  document.querySelectorAll('.skill-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      card.style.setProperty('--shine-x', x + 'px');
      card.style.setProperty('--shine-y', y + 'px');
    });
  });

  // ---- Year in footer (dynamic) ----
  var yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();


/* ============================================================
   MAGNETIC BUTTONS — Subtle pull towards cursor
   ============================================================ */

(function () {
  'use strict';

  if (!window.matchMedia('(pointer: fine)').matches) return;

  var magnetics = document.querySelectorAll('.btn, .nav__cta');

  magnetics.forEach(function (el) {
    var strength = el.classList.contains('btn--primary') ? 0.3 : 0.18;
    var inner = el.querySelector('span');

    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      if (inner) {
        inner.style.transform = 'translate(' + (x * strength * 0.4) + 'px,' + (y * strength * 0.4) + 'px)';
      }
    });

    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
      if (inner) inner.style.transform = '';
    });
  });
})();
