/* ============================================================
   PARTICLES — Canvas-based particle field for hero
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouseX = 0;
  var mouseY = 0;
  var animationId;

  // Config
  var config = {
    count: 80,
    maxSize: 2,
    speed: 0.3,
    connectionDistance: 120,
    mouseRadius: 150,
    color: '124, 92, 255' // accent RGB
  };

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function createParticles() {
    particles = [];
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;

    for (var i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: Math.random() * config.maxSize + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawParticles() {
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Mouse repulsion
      var dx = p.x - mouseX;
      var dy = p.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < config.mouseRadius && dist > 0) {
        var force = (config.mouseRadius - dist) / config.mouseRadius;
        p.x += (dx / dist) * force * 2;
        p.y += (dy / dist) * force * 2;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + config.color + ',' + p.opacity + ')';
      ctx.fill();

      // Connections
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var cdx = p.x - p2.x;
        var cdy = p.y - p2.y;
        var cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < config.connectionDistance) {
          var alpha = (1 - cdist / config.connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(' + config.color + ',' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(drawParticles);
  }

  // Mouse tracking
  canvas.parentElement.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  // Init
  function init() {
    resize();
    createParticles();
    drawParticles();
  }

  // Responsive
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cancelAnimationFrame(animationId);
      resize();
      createParticles();
      drawParticles();
    }, 200);
  });

  // Reduce particles on mobile
  if (window.innerWidth < 768) {
    config.count = 40;
    config.connectionDistance = 80;
  }

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    config.speed = 0;
  }

  init();
})();
