/* ============================================================
   CURSOR — Crosshair + trailing diamond with glow
   ============================================================ */

(function () {
  'use strict';

  if (!window.matchMedia('(pointer: fine)').matches) return;

  var cursor = document.querySelector('.cursor');
  if (!cursor) return;

  var dot = cursor.querySelector('.cursor__dot');
  var ring = cursor.querySelector('.cursor__ring');
  var label = cursor.querySelector('.cursor__label');

  // Hide default cursor
  var style = document.createElement('style');
  style.textContent = '*, *::before, *::after { cursor: none !important; }';
  document.head.appendChild(style);

  // State
  var mouse = { x: -100, y: -100 };
  var pos = { dot: { x: -100, y: -100 }, ring: { x: -100, y: -100 } };
  var visible = false;
  var hovering = false;
  var ringAngle = 0;

  // --- DOT: crosshair shape via CSS ---
  dot.style.cssText = [
    'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;',
    'width:20px;height:20px;',
    'transform:translate(-50%,-50%);',
    'opacity:0;',
    'transition:opacity 0.3s;'
  ].join('');

  // Build crosshair SVG inside dot
  dot.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="10" y1="0" x2="10" y2="7" stroke="var(--accent)" stroke-width="1.2" opacity="0.9"/>' +
    '<line x1="10" y1="13" x2="10" y2="20" stroke="var(--accent)" stroke-width="1.2" opacity="0.9"/>' +
    '<line x1="0" y1="10" x2="7" y2="10" stroke="var(--accent)" stroke-width="1.2" opacity="0.9"/>' +
    '<line x1="13" y1="10" x2="20" y2="10" stroke="var(--accent)" stroke-width="1.2" opacity="0.9"/>' +
    '<circle cx="10" cy="10" r="1.5" fill="var(--accent)"/>' +
    '</svg>';

  // --- RING: diamond / rotated square that trails ---
  ring.style.cssText = [
    'position:fixed;top:0;left:0;pointer-events:none;z-index:9998;',
    'width:32px;height:32px;',
    'border:1.2px solid var(--accent);',
    'transform:translate(-50%,-50%) rotate(45deg);',
    'opacity:0;',
    'transition:width 0.4s cubic-bezier(0.16,1,0.3,1),height 0.4s cubic-bezier(0.16,1,0.3,1),border-color 0.3s,background 0.3s,opacity 0.4s,border-radius 0.4s cubic-bezier(0.16,1,0.3,1);',
    'box-shadow:0 0 16px var(--accent-glow);',
    'border-radius:4px;'
  ].join('');

  // --- LABEL ---
  label.style.cssText = [
    'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;',
    'font-family:var(--font-mono);font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;',
    'color:var(--accent);white-space:nowrap;',
    'opacity:0;transition:opacity 0.25s;',
    'transform:translate(-50%, 26px);',
    'background:var(--bg-glass);padding:3px 8px;border-radius:4px;border:1px solid var(--border);'
  ].join('');

  // Track mouse
  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!visible) {
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '0.6';
    }
  });

  document.addEventListener('mouseleave', function () {
    visible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    label.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    visible = true;
    dot.style.opacity = '1';
    ring.style.opacity = '0.6';
  });

  // Hover states
  var interactives = 'a, button, [data-cursor], input, textarea, select, .mission-entry, .skill-card';

  document.addEventListener('mouseover', function (e) {
    var target = e.target.closest(interactives);
    if (target) {
      hovering = true;
      // Diamond expands and becomes more rounded
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.opacity = '0.9';
      ring.style.borderColor = 'var(--accent)';
      ring.style.background = 'rgba(124, 92, 255, 0.06)';
      ring.style.borderRadius = '8px';

      // Crosshair shrinks
      dot.style.transform = 'translate(-50%,-50%) scale(0.7)';

      var cursorAttr = target.closest('[data-cursor]');
      if (cursorAttr) {
        label.textContent = cursorAttr.getAttribute('data-cursor');
        label.style.opacity = '1';
      }
    }
  });

  document.addEventListener('mouseout', function (e) {
    var target = e.target.closest(interactives);
    if (target) {
      hovering = false;
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.opacity = '0.6';
      ring.style.borderColor = 'var(--accent)';
      ring.style.background = 'transparent';
      ring.style.borderRadius = '4px';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      label.style.opacity = '0';
    }
  });

  // Click effect — diamond collapses then springs back
  document.addEventListener('mousedown', function () {
    ring.style.width = '18px';
    ring.style.height = '18px';
    ring.style.opacity = '1';
    ring.style.borderRadius = '2px';
    dot.style.transform = 'translate(-50%,-50%) scale(1.3)';
  });

  document.addEventListener('mouseup', function () {
    if (hovering) {
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.opacity = '0.9';
      ring.style.borderRadius = '8px';
      dot.style.transform = 'translate(-50%,-50%) scale(0.7)';
    } else {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.opacity = '0.6';
      ring.style.borderRadius = '4px';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    }
  });

  // Smooth animation loop
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animate() {
    // Crosshair follows fast
    pos.dot.x = lerp(pos.dot.x, mouse.x, 0.25);
    pos.dot.y = lerp(pos.dot.y, mouse.y, 0.25);

    // Diamond trails behind slower
    pos.ring.x = lerp(pos.ring.x, mouse.x, 0.07);
    pos.ring.y = lerp(pos.ring.y, mouse.y, 0.07);

    dot.style.left = pos.dot.x + 'px';
    dot.style.top = pos.dot.y + 'px';

    ring.style.left = pos.ring.x + 'px';
    ring.style.top = pos.ring.y + 'px';

    label.style.left = pos.dot.x + 'px';
    label.style.top = pos.dot.y + 'px';

    requestAnimationFrame(animate);
  }

  animate();
})();
