/* ============================================================
   NAVBAR — Scroll behavior, progress bar, mobile drawer
   ============================================================ */

(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var progress = document.getElementById('navProgress');
  var links = document.querySelectorAll('.nav__link, .drawer__list a');

  if (!nav) return;

  // ---- Scroll: add class when scrolled ----
  var scrollThreshold = 60;

  function onScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Nav background
    if (scrollY > scrollThreshold) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    // Progress bar
    if (progress) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progress.style.width = pct + '%';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init

  // ---- Mobile drawer ----
  function toggleDrawer() {
    var isOpen = drawer.classList.contains('is-open');

    if (isOpen) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  if (burger && drawer) {
    burger.addEventListener('click', toggleDrawer);

    // Close drawer on link click
    var drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggleDrawer();
      });
    });
  }

  // ---- Smooth scroll for nav links ----
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          var offset = nav.offsetHeight + 20;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // ---- Active link highlight ----
  var sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    var scrollY = window.pageYOffset + nav.offsetHeight + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        links.forEach(function (link) {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
})();
