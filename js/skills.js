/* ============================================================
   SKILLS — Constellation Star Map Interactivity
   - Twinkling background stars (canvas)
   - SVG constellation lines with draw-in animation
   - Node click → detail panel
   - Active line highlighting
   - IntersectionObserver for viewport entry
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------
   * Skill Data
   * -------------------------------------------- */
  var skillData = {
    web: {
      idx: 'S-01',
      name: 'Web Development',
      status: 'Active',
      desc: 'Membangun website dari nol. Clean markup, CSS yang scalable, dan JavaScript yang sadar performa. Setiap pixel punya alasan.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design']
    },
    python: {
      idx: 'S-02',
      name: 'Python',
      status: 'Active',
      desc: 'Mengolah data, membangun logika, dan visualisasi. Python jadi andalan untuk eksplorasi dari dataset kecil sampai komputasi numerik.',
      tags: ['Python', 'NumPy', 'Pandas', 'Matplotlib']
    },
    atmos: {
      idx: 'S-03',
      name: 'Atmospheric Science',
      status: 'Active',
      desc: 'Riset atmosfer dan analisis data ilmiah yang membentuk cara saya mendekati masalah: observasi, hipotesis, verifikasi.',
      tags: ['Meteorologi', 'Data Iklim', 'Sains Keplanetan', 'Pemodelan']
    },
    data: {
      idx: 'S-04',
      name: 'Data Analysis',
      status: 'Active',
      desc: 'Mengubah data mentah jadi insight yang bermakna lewat analisis statistik dan visualisasi yang jelas.',
      tags: ['Pandas', 'Matplotlib', 'Jupyter', 'Visualisasi']
    },
    research: {
      idx: 'S-05',
      name: 'Research',
      status: 'Active',
      desc: 'Pendekatan ilmiah yang sistematis: literature review, metodologi riset, dan penulisan ilmiah.',
      tags: ['Scientific Writing', 'Metodologi', 'Analisis', 'Eksplorasi']
    },
    solve: {
      idx: 'S-06',
      name: 'Problem Solving',
      status: 'Active',
      desc: 'Bug, error aneh, tantangan baru. Justru di situlah serunya, dipecahkan satu per satu dengan logika dan adaptasi.',
      tags: ['Debugging', 'Analytical Thinking', 'Algorithmic Logic', 'Adaptability']
    },
    collab: {
      idx: 'S-07',
      name: 'Collaboration',
      status: 'Active',
      desc: 'Kolaborasi efektif lewat komunikasi yang jelas, version control, dan kerja tim yang solid.',
      tags: ['Git', 'Teamwork', 'Communication', 'Fast Learning']
    },
    creative: {
      idx: 'S-08',
      name: 'Creative Technology',
      status: 'Active',
      desc: 'Menggabungkan kreativitas visual dengan teknologi. Desain digital yang elegan dan interaktif.',
      tags: ['UI/UX', 'Figma', 'CSS Animation', 'Canvas API']
    }
  };

  /* --------------------------------------------
   * Constellation connections
   * -------------------------------------------- */
  var connections = [
    ['web', 'python'],
    ['python', 'atmos'],
    ['python', 'data'],
    ['data', 'atmos'],
    ['data', 'research'],
    ['web', 'solve'],
    ['solve', 'collab'],
    ['data', 'creative'],
    ['creative', 'research']
  ];

  /* --------------------------------------------
   * DOM References
   * -------------------------------------------- */
  var container = document.querySelector('.constellation');
  if (!container) return;

  var canvas = container.querySelector('.constellation__stars');
  var svgOverlay = container.querySelector('.constellation__lines');
  var detailPanel = container.querySelector('.star-detail');
  var closeBtn = container.querySelector('.star-detail__close');
  var nodes = container.querySelectorAll('.star-node');

  var ctx = canvas ? canvas.getContext('2d') : null;
  var activeNode = null;
  var animFrameId = null;
  var linesDrawn = false;

  /* --------------------------------------------
   * Twinkling Stars (Canvas)
   * -------------------------------------------- */
  var stars = [];
  var STAR_COUNT = 60;

  function initStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.2 + 0.3,
        baseOpacity: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.4
      });
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  function drawStars(time) {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var opacity = s.baseOpacity + Math.sin(time * 0.001 * s.speed + s.phase) * 0.3;
      opacity = Math.max(0.02, Math.min(1, opacity));

      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + opacity.toFixed(3) + ')';
      ctx.fill();
    }

    animFrameId = requestAnimationFrame(drawStars);
  }

  function startStarAnimation() {
    initStars();
    resizeCanvas();
    animFrameId = requestAnimationFrame(drawStars);
  }

  /* --------------------------------------------
   * SVG Constellation Lines
   * -------------------------------------------- */
  function getNodeCenter(nodeEl) {
    var rect = nodeEl.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2
    };
  }

  function buildLines() {
    if (!svgOverlay) return;

    // Clear existing lines
    svgOverlay.innerHTML = '';

    // Create SVG namespace elements
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Gradient for lines
    var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'line-grad');
    grad.setAttribute('gradientUnits', 'userSpaceOnUse');

    var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#7c5cff');
    stop1.setAttribute('stop-opacity', '0.3');

    var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#18e2d6');
    stop2.setAttribute('stop-opacity', '0.15');

    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svgOverlay.appendChild(defs);

    // Build node map
    var nodeMap = {};
    nodes.forEach(function (n) {
      var id = n.getAttribute('data-skill');
      if (id) nodeMap[id] = n;
    });

    // Draw lines
    connections.forEach(function (conn, idx) {
      var fromNode = nodeMap[conn[0]];
      var toNode = nodeMap[conn[1]];
      if (!fromNode || !toNode) return;

      var from = getNodeCenter(fromNode);
      var to = getNodeCenter(toNode);

      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', from.x);
      line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x);
      line.setAttribute('y2', to.y);
      line.setAttribute('data-from', conn[0]);
      line.setAttribute('data-to', conn[1]);
      line.style.stroke = 'url(#line-grad)';

      // Calculate line length for dash animation
      var dx = to.x - from.x;
      var dy = to.y - from.y;
      var length = Math.sqrt(dx * dx + dy * dy);
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;

      // Stagger the draw-in
      line.style.transitionDelay = (idx * 0.12) + 's';

      svgOverlay.appendChild(line);
    });
  }

  function drawLinesIn() {
    if (linesDrawn) return;
    linesDrawn = true;

    var lines = svgOverlay.querySelectorAll('line');
    // Trigger reflow then add class
    lines.forEach(function (line) {
      void line.offsetWidth;
      line.classList.add('is-drawn');
    });
  }

  function highlightActiveLines(skillId) {
    if (!svgOverlay) return;

    var lines = svgOverlay.querySelectorAll('line');
    lines.forEach(function (line) {
      var from = line.getAttribute('data-from');
      var to = line.getAttribute('data-to');

      if (skillId && (from === skillId || to === skillId)) {
        line.classList.add('is-active-line');
      } else {
        line.classList.remove('is-active-line');
      }
    });
  }

  /* --------------------------------------------
   * Detail Panel
   * -------------------------------------------- */
  function showDetail(skillId, nodeEl) {
    var data = skillData[skillId];
    if (!data || !detailPanel) return;

    // Populate content
    var nameEl = detailPanel.querySelector('.star-detail__name');
    var idxEl = detailPanel.querySelector('.star-detail__idx');
    var statusEl = detailPanel.querySelector('.star-detail__status');
    var descEl = detailPanel.querySelector('.star-detail__desc');
    var tagsEl = detailPanel.querySelector('.star-detail__tags');

    if (nameEl) nameEl.textContent = data.name;
    if (idxEl) idxEl.textContent = data.idx;
    if (statusEl) statusEl.textContent = data.status;
    if (descEl) descEl.textContent = data.desc;

    if (tagsEl) {
      tagsEl.innerHTML = '';
      data.tags.forEach(function (tag) {
        var li = document.createElement('li');
        li.textContent = tag;
        tagsEl.appendChild(li);
      });
    }

    // Position panel near node (desktop only)
    if (window.innerWidth > 768) {
      var nodeRect = nodeEl.getBoundingClientRect();
      var containerRect = container.getBoundingClientRect();

      var nodeX = nodeRect.left - containerRect.left + nodeRect.width / 2;
      var nodeY = nodeRect.top - containerRect.top + nodeRect.height / 2;

      // Determine best position (prefer right, fallback left)
      var panelWidth = 320;
      var panelHeight = 280;
      var offsetX = 30;
      var offsetY = -40;

      var left = nodeX + offsetX;
      var top = nodeY + offsetY;

      // Keep within container bounds
      if (left + panelWidth > containerRect.width - 20) {
        left = nodeX - panelWidth - offsetX;
      }
      if (top + panelHeight > containerRect.height - 20) {
        top = containerRect.height - panelHeight - 20;
      }
      if (top < 20) {
        top = 20;
      }
      if (left < 20) {
        left = 20;
      }

      detailPanel.style.left = left + 'px';
      detailPanel.style.top = top + 'px';
      detailPanel.style.right = 'auto';
      detailPanel.style.bottom = 'auto';
    } else {
      // Mobile: reset inline positioning (CSS handles fixed bottom)
      detailPanel.style.left = '';
      detailPanel.style.top = '';
      detailPanel.style.right = '';
      detailPanel.style.bottom = '';
    }

    detailPanel.classList.add('is-visible');
  }

  function hideDetail() {
    if (detailPanel) {
      detailPanel.classList.remove('is-visible');
    }
  }

  /* --------------------------------------------
   * Node Click Handling
   * -------------------------------------------- */
  function handleNodeClick(e) {
    var nodeEl = e.currentTarget;
    var skillId = nodeEl.getAttribute('data-skill');

    // Toggle off if clicking same node
    if (activeNode === nodeEl) {
      deactivateAll();
      return;
    }

    // Deactivate previous
    if (activeNode) {
      activeNode.classList.remove('is-active');
    }

    // Activate new
    activeNode = nodeEl;
    nodeEl.classList.add('is-active');

    // Highlight connected lines
    highlightActiveLines(skillId);

    // Show detail panel
    showDetail(skillId, nodeEl);
  }

  function deactivateAll() {
    if (activeNode) {
      activeNode.classList.remove('is-active');
      activeNode = null;
    }
    highlightActiveLines(null);
    hideDetail();
  }

  /* --------------------------------------------
   * Event Listeners
   * -------------------------------------------- */
  nodes.forEach(function (node) {
    node.addEventListener('click', handleNodeClick);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      deactivateAll();
    });
  }

  // Close panel when clicking empty space in container
  container.addEventListener('click', function (e) {
    if (e.target === container || e.target === canvas || e.target === svgOverlay) {
      deactivateAll();
    }
  });

  // Escape key closes panel
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      deactivateAll();
    }
  });

  /* --------------------------------------------
   * Resize Handler
   * -------------------------------------------- */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resizeCanvas();
      buildLines();
      if (linesDrawn) {
        // Re-draw lines immediately after rebuild
        var lines = svgOverlay.querySelectorAll('line');
        lines.forEach(function (line) {
          line.style.transition = 'none';
          line.classList.add('is-drawn');
        });
        // Restore transitions after a frame
        requestAnimationFrame(function () {
          lines.forEach(function (line) {
            line.style.transition = '';
          });
        });
      }
    }, 150);
  });

  /* --------------------------------------------
   * IntersectionObserver — Trigger animations
   * -------------------------------------------- */
  var hasEntered = false;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !hasEntered) {
        hasEntered = true;

        // Start canvas stars
        startStarAnimation();

        // Build and animate lines
        buildLines();
        // Small delay so lines are in DOM before animating
        setTimeout(drawLinesIn, 100);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(container);

  /* --------------------------------------------
   * Cleanup on page hide (performance)
   * -------------------------------------------- */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    } else if (hasEntered && !animFrameId) {
      animFrameId = requestAnimationFrame(drawStars);
    }
  });

})();
