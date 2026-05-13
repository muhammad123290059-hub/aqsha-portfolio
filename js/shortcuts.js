/* ============================================================
   KEYBOARD SHORTCUTS & EASTER EGGS
   ? — open shortcut panel
   G then A/S/W/J/C — jump to section
   T — toggle theme
   Konami code — confetti burst
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------
   * Build shortcut modal
   * -------------------------------------------- */
  var modal = document.createElement('div');
  modal.className = 'sc-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="sc-modal__backdrop"></div>' +
    '<div class="sc-modal__panel" role="dialog" aria-label="Keyboard shortcuts">' +
      '<header class="sc-modal__header">' +
        '<div>' +
          '<span class="sc-modal__kicker">Shortcuts</span>' +
          '<h3>Kendalikan dengan <em>keyboard</em>.</h3>' +
        '</div>' +
        '<button class="sc-modal__close" aria-label="Tutup">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="sc-modal__body">' +
        '<div class="sc-group">' +
          '<h4>Navigasi</h4>' +
          '<div class="sc-row"><span>Ke About</span><kbd>G</kbd><kbd>A</kbd></div>' +
          '<div class="sc-row"><span>Ke Keahlian</span><kbd>G</kbd><kbd>S</kbd></div>' +
          '<div class="sc-row"><span>Ke Proyek</span><kbd>G</kbd><kbd>W</kbd></div>' +
          '<div class="sc-row"><span>Ke Perjalanan</span><kbd>G</kbd><kbd>J</kbd></div>' +
          '<div class="sc-row"><span>Ke Kontak</span><kbd>G</kbd><kbd>C</kbd></div>' +
          '<div class="sc-row"><span>Ke Atas</span><kbd>G</kbd><kbd>H</kbd></div>' +
        '</div>' +
        '<div class="sc-group">' +
          '<h4>Tampilan</h4>' +
          '<div class="sc-row"><span>Buka menu ini</span><kbd>?</kbd></div>' +
          '<div class="sc-row"><span>Tutup</span><kbd>ESC</kbd></div>' +
        '</div>' +
        '<div class="sc-hint">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
          'Easter egg: coba konami code ↑↑↓↓←→←→BA' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  var backdrop = modal.querySelector('.sc-modal__backdrop');
  var closeBtn = modal.querySelector('.sc-modal__close');

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  /* --------------------------------------------
   * Navigation shortcuts (G + key combo)
   * -------------------------------------------- */
  var navMap = {
    a: '#about',
    s: '#skills',
    w: '#work',
    j: '#journey',
    c: '#contact',
    h: '#home'
  };

  var awaitingNav = false;
  var awaitingTimer = null;

  function scrollToSection(href) {
    var target = document.querySelector(href);
    if (!target) return;
    var nav = document.getElementById('nav');
    var offset = nav ? nav.offsetHeight + 20 : 80;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  /* --------------------------------------------
   * Konami code detection
   * -------------------------------------------- */
  var konami = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown',
                'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  var konamiIdx = 0;

  function burstConfetti() {
    var colors = ['#7c5cff', '#18e2d6', '#d4a574', '#ff6b4a', '#ffffff'];
    var container = document.createElement('div');
    container.className = 'confetti';
    document.body.appendChild(container);

    for (var i = 0; i < 80; i++) {
      var p = document.createElement('i');
      p.style.cssText = [
        'position:fixed',
        'left:' + (50 + (Math.random() - 0.5) * 10) + '%',
        'top:45%',
        'width:' + (6 + Math.random() * 6) + 'px',
        'height:' + (6 + Math.random() * 6) + 'px',
        'background:' + colors[Math.floor(Math.random() * colors.length)],
        'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
        'pointer-events:none',
        'z-index:99999',
        'transform:translate(-50%,-50%)',
        'opacity:1'
      ].join(';');
      container.appendChild(p);

      var angle = Math.random() * Math.PI * 2;
      var vel = 200 + Math.random() * 300;
      var vx = Math.cos(angle) * vel;
      var vy = Math.sin(angle) * vel - 200;

      var startTime = null;
      (function (el, vx, vy) {
        function animate(ts) {
          if (!startTime) startTime = ts;
          var t = (ts - startTime) / 1000;
          var x = vx * t;
          var y = vy * t + 0.5 * 900 * t * t;
          var rot = t * 360;
          el.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px)) rotate(' + rot + 'deg)';
          el.style.opacity = Math.max(0, 1 - t / 2.5);
          if (t < 2.5) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      })(p, vx, vy);
    }

    // Toast
    var toast = document.createElement('div');
    toast.className = 'konami-toast';
    toast.textContent = '🎉 Konami unlocked! You found the easter egg.';
    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('is-visible'); }, 10);
    setTimeout(function () { toast.classList.remove('is-visible'); }, 3000);
    setTimeout(function () { toast.remove(); container.remove(); }, 3500);
  }

  /* --------------------------------------------
   * Global key listener
   * -------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    // Ignore when typing in form fields
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    var key = e.key.toLowerCase();

    // Konami check
    if (key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) {
        konamiIdx = 0;
        burstConfetti();
        return;
      }
    } else {
      konamiIdx = (key === konami[0]) ? 1 : 0;
    }

    // ESC closes modal
    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    // ? opens modal
    if (e.key === '?' || (e.shiftKey && key === '/')) {
      e.preventDefault();
      if (modal.classList.contains('is-open')) closeModal();
      else openModal();
      return;
    }

    // G starts nav combo
    if (key === 'g' && !awaitingNav) {
      awaitingNav = true;
      awaitingTimer = setTimeout(function () { awaitingNav = false; }, 1200);
      return;
    }

    // Second key of nav combo
    if (awaitingNav && navMap[key]) {
      awaitingNav = false;
      clearTimeout(awaitingTimer);
      scrollToSection(navMap[key]);
      return;
    }

    if (awaitingNav) {
      awaitingNav = false;
      clearTimeout(awaitingTimer);
    }
  });
})();


/* ============================================================
   FLOATING HINT BUTTON WIRING
   ============================================================ */
(function () {
  var btn = document.getElementById('scHintBtn');
  var modal = document.querySelector('.sc-modal');
  if (!btn || !modal) return;

  btn.addEventListener('click', function () {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
})();
