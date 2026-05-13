/* ============================================================
   CURSOR TRAIL — Soft glowing particles following the pointer
   ============================================================ */

(function () {
  'use strict';

  // Only on desktop with fine pointer
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Create dedicated canvas overlay
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9997',
    mixBlendMode: 'screen'
  });
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  /* --------------------------------------------
   * Particles
   * -------------------------------------------- */
  var particles = [];
  var mouseX = -100;
  var mouseY = -100;
  var lastX = -100;
  var lastY = -100;

  function Particle(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 1;
    this.size = 2 + Math.random() * 2.5;
    // Gradient of accent color variations
    var palette = [
      [124, 92, 255],   // violet accent
      [155, 124, 255],  // lighter violet
      [24, 226, 214],   // teal
      [180, 150, 255]   // lavender
    ];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.vy += 0.02; // very slight gravity
    this.life -= 0.018;
    this.size *= 0.985;
  };

  Particle.prototype.draw = function () {
    if (this.life <= 0) return;
    ctx.beginPath();
    var alpha = this.life * 0.8;
    var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
    grad.addColorStop(0, 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',' + alpha + ')');
    grad.addColorStop(0.4, 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',' + (alpha * 0.3) + ')');
    grad.addColorStop(1, 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ', 0)');
    ctx.fillStyle = grad;
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
    ctx.fill();
  };

  /* --------------------------------------------
   * Mouse tracking
   * -------------------------------------------- */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    var dx = mouseX - lastX;
    var dy = mouseY - lastY;
    var speed = Math.sqrt(dx * dx + dy * dy);

    // Emit particles proportional to cursor speed
    if (speed > 2) {
      var count = Math.min(Math.floor(speed / 8), 3);
      for (var i = 0; i < count; i++) {
        var jitterX = (Math.random() - 0.5) * 8;
        var jitterY = (Math.random() - 0.5) * 8;
        particles.push(new Particle(
          mouseX + jitterX,
          mouseY + jitterY,
          (Math.random() - 0.5) * 0.8 - dx * 0.02,
          (Math.random() - 0.5) * 0.8 - dy * 0.02
        ));
      }
    }

    lastX = mouseX;
    lastY = mouseY;
  });

  /* --------------------------------------------
   * Animation loop
   * -------------------------------------------- */
  function render() {
    // Fade previous frame — creates the trail effect
    ctx.fillStyle = 'rgba(6, 7, 11, 0.18)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.update();
      p.draw();
      if (p.life <= 0 || p.size < 0.3) {
        particles.splice(i, 1);
      }
    }

    ctx.globalCompositeOperation = 'source-over';

    // Cap particles for perf
    if (particles.length > 120) {
      particles.splice(0, particles.length - 120);
    }

    requestAnimationFrame(render);
  }

  render();
})();
