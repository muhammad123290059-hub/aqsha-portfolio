/* ============================================================
   THEME — Dark/Light toggle with persistence
   ============================================================ */

(function () {
  'use strict';

  var toggle = document.getElementById('themeToggle');
  var html = document.documentElement;
  var STORAGE_KEY = 'av-theme';

  // Get saved preference or system preference
  function getPreferred() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;

    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  // Apply theme
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update meta theme-color
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#06070b' : '#f5f4f1');
    }
  }

  // Init
  setTheme(getPreferred());

  // Toggle
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);

      // Small animation on toggle
      toggle.style.transform = 'rotate(180deg) scale(0.8)';
      setTimeout(function () {
        toggle.style.transform = '';
      }, 300);
    });
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
