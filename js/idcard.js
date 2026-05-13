/* ============================================================
   ID CARD — Premium lanyard physics with 3D tilt
   ============================================================ */

(function () {
  'use strict';

  var card = document.getElementById('idCard');
  var lanyard = document.getElementById('lanyard');
  var ropePath = document.getElementById('ropePath');
  var shine = card ? card.querySelector('.id-card__shine') : null;

  if (!card || !lanyard || !ropePath) return;

  /* --------------------------------------------
   * Physics state
   * -------------------------------------------- */
  var state = {
    // Position offset from rest
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    // Target (while dragging)
    targetX: 0,
    targetY: 0,
    // Rotation (z-axis swing)
    rotation: 0,
    angularVel: 0,
    // 3D tilt (while dragging for depth)
    tiltX: 0,
    tiltY: 0,
    dragging: false,
    hasInteracted: false
  };

  /* --------------------------------------------
   * Tuning
   * -------------------------------------------- */
  var SPRING = 0.07;
  var FRICTION = 0.88;
  var ROT_SPRING = 0.09;
  var ROT_FRICTION = 0.85;
  var ROT_INFLUENCE = 0.15;
  var MAX_PULL = 220;

  /* --------------------------------------------
   * Measurements
   * -------------------------------------------- */
  var anchorX = 0;
  var anchorY = 0;
  var cardRestY = 140; // matches CSS .id-card top value

  function measure() {
    var rect = lanyard.getBoundingClientRect();
    anchorX = rect.width / 2;
    anchorY = 0;
  }
  measure();

  /* --------------------------------------------
   * Rope path (curved with sag)
   * -------------------------------------------- */
  function updateRope() {
    var cardX = anchorX + state.x;
    var cardY = cardRestY + state.y;

    var dx = cardX - anchorX;
    var dy = cardY - anchorY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // Base sag amount — rope droops more when card hangs
    var sag = 25 + Math.min(dist * 0.12, 50);

    // Perpendicular vector for bezier offset
    var perpX = dist > 0 ? -dy / dist : 0;
    var perpY = dist > 0 ?  dx / dist : 1;

    // Two control points for more natural curve
    var midX = (anchorX + cardX) / 2;
    var midY = (anchorY + cardY) / 2;

    var ctrlX = midX + perpX * sag * 0.25;
    var ctrlY = midY + sag;

    var path = 'M ' + anchorX + ' ' + anchorY +
               ' Q ' + ctrlX + ' ' + ctrlY +
               ' ' + cardX + ' ' + cardY;

    ropePath.setAttribute('d', path);
  }

  /* --------------------------------------------
   * Main animation loop
   * -------------------------------------------- */
  function tick() {
    if (state.dragging) {
      // Smooth follow while dragging
      state.x += (state.targetX - state.x) * 0.32;
      state.y += (state.targetY - state.y) * 0.32;

      // Card rotates naturally from horizontal drag
      var targetRot = state.x * ROT_INFLUENCE;
      state.rotation += (targetRot - state.rotation) * 0.18;

      // 3D tilt based on horizontal/vertical velocity for parallax
      var targetTiltY = state.x * 0.08;
      var targetTiltX = -state.y * 0.05;
      state.tiltY += (targetTiltY - state.tiltY) * 0.15;
      state.tiltX += (targetTiltX - state.tiltX) * 0.15;
    } else {
      // Spring back toward origin
      state.vx += -state.x * SPRING;
      state.vy += -state.y * SPRING * 1.3;
      state.vx *= FRICTION;
      state.vy *= FRICTION;
      state.x += state.vx;
      state.y += state.vy;

      // Rotation with natural swing (influenced by position + velocity)
      var rotForce = -state.rotation * ROT_SPRING;
      rotForce += -state.x * 0.025; // pendulum effect
      state.angularVel += rotForce;
      state.angularVel *= ROT_FRICTION;
      state.rotation += state.angularVel;

      // Tilt returns to zero
      state.tiltX *= 0.92;
      state.tiltY *= 0.92;
    }

    // Compose transform with 3D rotation
    card.style.transform =
      'translate3d(' + state.x + 'px, ' + state.y + 'px, 0) ' +
      'rotate(' + state.rotation + 'deg) ' +
      'rotateX(' + state.tiltX + 'deg) ' +
      'rotateY(' + state.tiltY + 'deg)';

    // Shine reacts to tilt/rotation
    if (shine) {
      var shineOffsetX = state.rotation * 0.8 + state.tiltY * 2;
      var shineOffsetY = state.tiltX * 2;
      shine.style.transform = 'translate(' + shineOffsetX + '%, ' + shineOffsetY + '%)';
    }

    updateRope();
    requestAnimationFrame(tick);
  }

  /* --------------------------------------------
   * Drag handlers
   * -------------------------------------------- */
  var dragOffsetX = 0;
  var dragOffsetY = 0;

  function onDragStart(e) {
    state.dragging = true;
    state.hasInteracted = true;
    card.style.cursor = 'grabbing';

    var point = e.touches ? e.touches[0] : e;
    var cardRect = card.getBoundingClientRect();

    dragOffsetX = point.clientX - (cardRect.left + cardRect.width / 2);
    dragOffsetY = point.clientY - cardRect.top;

    e.preventDefault();
  }

  function onDragMove(e) {
    if (!state.dragging) return;

    var point = e.touches ? e.touches[0] : e;
    var rect = lanyard.getBoundingClientRect();

    var cursorX = point.clientX - rect.left - anchorX - dragOffsetX;
    var cursorY = point.clientY - rect.top - cardRestY - dragOffsetY;

    // Constrain max pull (rope length)
    var dist = Math.sqrt(cursorX * cursorX + cursorY * cursorY);
    if (dist > MAX_PULL) {
      cursorX = (cursorX / dist) * MAX_PULL;
      cursorY = (cursorY / dist) * MAX_PULL;
    }
    // Prevent lifting above anchor
    if (cursorY < -80) cursorY = -80;

    state.targetX = cursorX;
    state.targetY = cursorY;

    e.preventDefault();
  }

  function onDragEnd() {
    if (!state.dragging) return;
    state.dragging = false;
    card.style.cursor = 'grab';

    // Carry release momentum for a natural spring-back
    state.vx = (state.targetX - state.x) * 0.35;
    state.vy = (state.targetY - state.y) * 0.35;
    state.angularVel = state.x * 0.06;
  }

  card.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  card.addEventListener('touchstart', onDragStart, { passive: false });
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('touchend', onDragEnd);

  /* --------------------------------------------
   * Resize
   * -------------------------------------------- */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 120);
  });

  /* --------------------------------------------
   * Idle gentle sway (continuous, subtle)
   * -------------------------------------------- */
  var swayTime = Math.random() * 100;
  setInterval(function () {
    if (state.dragging) return;

    swayTime += 0.025;

    // Only sway if mostly at rest
    if (Math.abs(state.x) < 3 && Math.abs(state.vx) < 0.3) {
      state.vx += Math.sin(swayTime) * 0.02;
      state.angularVel += Math.cos(swayTime * 1.2) * 0.008;
    }
  }, 50);

  /* --------------------------------------------
   * Intro animation — drop + swing in
   * -------------------------------------------- */
  function introAnimation() {
    state.y = -220;
    state.vy = 14;
    state.rotation = -18;
    state.angularVel = 0.8;
  }

  // Trigger intro when the about section scrolls into view
  var introDone = false;
  var introObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !introDone) {
        introDone = true;
        introAnimation();
      }
    });
  }, { threshold: 0.3 });

  var aboutSection = document.getElementById('about');
  if (aboutSection) introObserver.observe(aboutSection);

  /* --------------------------------------------
   * Start loop
   * -------------------------------------------- */
  // Start card slightly above so it "drops" into place even before scroll
  state.y = -40;
  tick();
})();
