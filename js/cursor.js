/* ============================================================
   CURSOR — Smooth magnetic cursor with glow trail
   ============================================================ */

(function () {
  'use strict';

  // Only on devices with fine pointer (desktop)
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
  var clicking = false;

  // Styles
  dot.style.cssText = 'position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;background:var(--accent);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width 0.3s cubic-bezier(0.16,1,0.3,1),height 0.3s cubic-bezier(0.16,1,0.3,1),background 0.3s,opacity 0.3s;box-shadow:0 0 12px var(--accent-glow);';
  ring.style.cssText = 'position:fixed;top:0;left:0;width:40px;height:40px;border-radius:50%;border:1.5px solid var(--accent);pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width 0.4s cubic-bezier(0.16,1,0.3,1),height 0.4s cubic-bezier(0.16,1,0.3,1),border-color 0.3s,background 0.3s,opacity 0.4s;opacity:0.5;';
  label.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);white-space:nowrap;opacity:0;transition:opacity 0.25s;transform:translate(-50%, 22px);';

  // Track mouse
  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!visible) {
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '0.5';
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
    ring.style.opacity = '0.5';
  });

  // Hover states
  var interactives = 'a, button, [data-cursor], input, textarea, select, .work-card, .skill-card';

  document.addEventListener('mouseover', function (e) {
    var target = e.target.closest(interactives);
    if (target) {
      hovering = true;
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.opacity = '0.8';
      ring.style.borderColor = 'var(--accent)';
      ring.style.background = 'rgba(124, 92, 255, 0.04)';
      dot.style.width = '4px';
      dot.style.height = '4px';

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
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.opacity = '0.5';
      ring.style.borderColor = 'var(--accent)';
      ring.style.background = 'transparent';
      dot.style.width = '8px';
      dot.style.height = '8px';
      label.style.opacity = '0';
    }
  });

  // Click effect
  document.addEventListener('mousedown', function () {
    clicking = true;
    dot.style.width = '14px';
    dot.style.height = '14px';
    ring.style.width = '28px';
    ring.style.height = '28px';
    ring.style.opacity = '0.9';
  });

  document.addEventListener('mouseup', function () {
    clicking = false;
    if (hovering) {
      dot.style.width = '4px';
      dot.style.height = '4px';
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.opacity = '0.8';
    } else {
      dot.style.width = '8px';
      dot.style.height = '8px';
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.opacity = '0.5';
    }
  });

  // Smooth animation loop
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animate() {
    // Dot follows fast (snappy)
    pos.dot.x = lerp(pos.dot.x, mouse.x, 0.2);
    pos.dot.y = lerp(pos.dot.y, mouse.y, 0.2);

    // Ring follows slower (smooth trail)
    pos.ring.x = lerp(pos.ring.x, mouse.x, 0.08);
    pos.ring.y = lerp(pos.ring.y, mouse.y, 0.08);

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
