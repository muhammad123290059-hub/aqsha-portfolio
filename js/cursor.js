/* ============================================================
   CURSOR — Custom cursor with label & magnetic effect
   ============================================================ */

(function () {
  'use strict';

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  const label = cursor.querySelector('.cursor__label');

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;
  let isVisible = false;
  let isHovering = false;

  // Hide default cursor via CSS
  const style = document.createElement('style');
  style.textContent = `
    @media (pointer: fine) {
      * { cursor: none !important; }
      .cursor { display: block; }
    }
    @media (pointer: coarse) {
      .cursor { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  // Base styles
  Object.assign(cursor.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    pointerEvents: 'none',
    zIndex: '9999',
    display: 'none'
  });

  Object.assign(dot.style, {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent)',
    position: 'absolute',
    top: '-3px',
    left: '-3px',
    transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1), opacity 0.2s'
  });

  Object.assign(ring.style, {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid var(--accent)',
    position: 'absolute',
    top: '-18px',
    left: '-18px',
    opacity: '0.4',
    transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), top 0.3s cubic-bezier(0.16,1,0.3,1), left 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s, border-color 0.3s'
  });

  Object.assign(label.style, {
    position: 'absolute',
    top: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    whiteSpace: 'nowrap',
    opacity: '0',
    transition: 'opacity 0.2s'
  });

  // Track mouse
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursor.style.display = 'block';
    }
  });

  document.addEventListener('mouseleave', function () {
    isVisible = false;
    cursor.style.display = 'none';
  });

  // Hover detection
  function onEnter(e) {
    isHovering = true;
    ring.style.width = '52px';
    ring.style.height = '52px';
    ring.style.top = '-26px';
    ring.style.left = '-26px';
    ring.style.opacity = '0.7';
    dot.style.transform = 'scale(0.5)';

    var cursorLabel = e.target.closest('[data-cursor]');
    if (cursorLabel) {
      label.textContent = cursorLabel.getAttribute('data-cursor');
      label.style.opacity = '1';
    }
  }

  function onLeave() {
    isHovering = false;
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.top = '-18px';
    ring.style.left = '-18px';
    ring.style.opacity = '0.4';
    dot.style.transform = 'scale(1)';
    label.style.opacity = '0';
  }

  // Attach to interactive elements
  var interactives = 'a, button, [data-cursor], input, textarea, select';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(interactives)) onEnter(e);
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(interactives)) onLeave();
  });

  // Mouse down / up
  document.addEventListener('mousedown', function () {
    dot.style.transform = 'scale(2)';
    ring.style.transform = 'scale(0.85)';
  });

  document.addEventListener('mouseup', function () {
    dot.style.transform = isHovering ? 'scale(0.5)' : 'scale(1)';
    ring.style.transform = 'scale(1)';
  });

  // Animation loop — smooth follow
  function animate() {
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dot.parentElement.style.transform = 'translate3d(' + dotX + 'px,' + dotY + 'px, 0)';
    ring.style.transform = 'translate3d(' + (ringX - dotX) + 'px,' + (ringY - dotY) + 'px, 0)' + (ring.style.transform.includes('scale') ? '' : '');

    // Simpler: move whole cursor to dot position, offset ring
    cursor.style.transform = 'translate3d(' + dotX + 'px,' + dotY + 'px, 0)';

    requestAnimationFrame(animate);
  }

  // Override: just move cursor container smoothly
  // Reset approach: dot follows instantly, ring lags
  let rafId;
  function loop() {
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;

    dot.style.transform = 'translate3d(' + dotX + 'px,' + dotY + 'px, 0)' + (isHovering ? ' scale(0.5)' : '');
    ring.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px, 0)';
    label.style.transform = 'translate3d(' + dotX + 'px,' + (dotY) + 'px, 0) translateX(-50%)';

    rafId = requestAnimationFrame(loop);
  }

  // Reset inline transforms set above — use the loop approach
  cursor.style.transform = '';
  dot.style.position = 'fixed';
  dot.style.top = '0';
  dot.style.left = '0';
  dot.style.marginTop = '-3px';
  dot.style.marginLeft = '-3px';

  ring.style.position = 'fixed';
  ring.style.top = '0';
  ring.style.left = '0';
  ring.style.marginTop = '-18px';
  ring.style.marginLeft = '-18px';

  label.style.position = 'fixed';
  label.style.top = '24px';
  label.style.left = '0';

  loop();
})();
