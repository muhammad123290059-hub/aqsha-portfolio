(function () {
  'use strict';

  // --- Configuration ---
  var STAR_COUNT = 180;
  var LAYERS = [
    { ratio: 0.5, size: [0.5, 1.2], opacity: [0.2, 0.5], parallax: 0.02 },  // far
    { ratio: 0.3, size: [1.0, 2.0], opacity: [0.4, 0.7], parallax: 0.05 },  // mid
    { ratio: 0.2, size: [1.8, 3.0], opacity: [0.6, 1.0], parallax: 0.1 }    // near
  ];
  var TWINKLE_SPEED = 0.002;

  // --- State ---
  var canvas, ctx;
  var stars = [];
  var scrollY = 0;
  var animId = null;
  var paused = false;
  var reducedMotion = false;
  var width = 0;
  var height = 0;

  // --- Utilities ---
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // --- Star generation ---
  function createStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      var layerIndex;
      var r = Math.random();
      if (r < LAYERS[0].ratio) {
        layerIndex = 0;
      } else if (r < LAYERS[0].ratio + LAYERS[1].ratio) {
        layerIndex = 1;
      } else {
        layerIndex = 2;
      }

      var layer = LAYERS[layerIndex];
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseY: Math.random() * height,
        size: rand(layer.size[0], layer.size[1]),
        baseOpacity: rand(layer.opacity[0], layer.opacity[1]),
        opacity: 0,
        parallax: layer.parallax,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: rand(TWINKLE_SPEED * 0.5, TWINKLE_SPEED * 1.5),
        layer: layerIndex
      });
    }
  }

  // --- Canvas setup ---
  function setupCanvas() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  // --- Render loop ---
  var lastTime = 0;

  function render(timestamp) {
    if (paused) {
      animId = null;
      return;
    }

    var dt = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < stars.length; i++) {
      var star = stars[i];

      // Twinkle
      var twinkle = Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset);
      star.opacity = star.baseOpacity * lerp(0.6, 1.0, (twinkle + 1) * 0.5);

      // Parallax vertical offset
      var offsetY = 0;
      if (!reducedMotion) {
        offsetY = scrollY * star.parallax;
      }

      var drawY = ((star.baseY - offsetY) % height + height) % height;

      // Draw star
      ctx.beginPath();
      ctx.arc(star.x, drawY, star.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + star.opacity.toFixed(3) + ')';
      ctx.fill();
    }

    animId = requestAnimationFrame(render);
  }

  function startLoop() {
    if (!animId && !paused) {
      lastTime = performance.now();
      animId = requestAnimationFrame(render);
    }
  }

  function stopLoop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // --- Event handlers ---
  function onScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
  }

  function onVisibilityChange() {
    if (document.hidden) {
      paused = true;
      stopLoop();
    } else {
      paused = false;
      startLoop();
    }
  }

  function onResize() {
    resize();
  }

  // --- Reduced motion ---
  function checkReducedMotion() {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mq.matches;
    mq.addEventListener('change', function (e) {
      reducedMotion = e.matches;
    });
  }

  // --- Init ---
  function init() {
    checkReducedMotion();
    setupCanvas();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    onScroll();
    startLoop();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // --- Append contour-bg div ---
  function appendContourDiv() {
    var contourDiv = document.createElement('div');
    contourDiv.className = 'contour-bg';
    contourDiv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(contourDiv);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appendContourDiv);
  } else {
    appendContourDiv();
  }
})();
