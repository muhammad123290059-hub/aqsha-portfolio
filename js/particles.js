/* ============================================================
   AURORA — Animated gradient mesh background for hero
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var width = 0;
  var height = 0;
  var time = 0;
  var mouseX = 0.5;
  var mouseY = 0.5;
  var targetMouseX = 0.5;
  var targetMouseY = 0.5;

  // Aurora blobs config
  var blobs = [
    { baseX: 0.25, baseY: 0.35, radius: 0.45, color: [124, 92, 255], speed: 0.0003, phase: 0 },
    { baseX: 0.75, baseY: 0.65, radius: 0.5, color: [24, 226, 214], speed: 0.00025, phase: 2 },
    { baseX: 0.55, baseY: 0.3, radius: 0.4, color: [212, 165, 116], speed: 0.00035, phase: 4 },
    { baseX: 0.2, baseY: 0.75, radius: 0.35, color: [255, 107, 74], speed: 0.00028, phase: 1 }
  ];

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function render() {
    time += 1;

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.03;
    mouseY += (targetMouseY - mouseY) * 0.03;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw each blob as radial gradient
    for (var i = 0; i < blobs.length; i++) {
      var b = blobs[i];

      // Animate position with sin/cos waves + subtle mouse influence
      var t = time * b.speed + b.phase;
      var offsetX = Math.sin(t) * 0.15;
      var offsetY = Math.cos(t * 1.3) * 0.12;
      var mouseInfluenceX = (mouseX - 0.5) * 0.08;
      var mouseInfluenceY = (mouseY - 0.5) * 0.08;

      var cx = (b.baseX + offsetX + mouseInfluenceX) * width;
      var cy = (b.baseY + offsetY + mouseInfluenceY) * height;
      var r = b.radius * Math.max(width, height);

      // Subtle radius breathing
      r *= 1 + Math.sin(t * 2) * 0.08;

      var gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      var c = b.color;
      gradient.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ', 0.22)');
      gradient.addColorStop(0.4, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ', 0.08)');
      gradient.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ', 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Subtle noise/grain overlay via globalCompositeOperation could go here
    // Keep it light to not kill perf

    requestAnimationFrame(render);
  }

  // Mouse tracking
  canvas.parentElement.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) / rect.width;
    targetMouseY = (e.clientY - rect.top) / rect.height;
  });

  // Resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    blobs.forEach(function (b) { b.speed = 0; });
  }

  resize();
  render();
})();
