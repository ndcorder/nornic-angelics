/**
 * THE MORGUE — Interaction Logic
 * Drawer management, autopsy mode, ambient effects
 */

(function () {
  'use strict';

  // ===== AMBIENT: FLUORESCENT FLICKER =====
  var flickerOverlay = document.getElementById('flicker-overlay');
  var flickerTimeout = null;

  function triggerFlicker() {
    if (flickerOverlay.classList.contains('flicker')) return;
    flickerOverlay.classList.add('flicker');
    flickerOverlay.addEventListener('animationend', function handler() {
      flickerOverlay.classList.remove('flicker');
      flickerOverlay.removeEventListener('animationend', handler);
    });
    scheduleFlicker();
  }

  function scheduleFlicker() {
    var minDelay = 3000;
    var maxDelay = 12000;
    var delay = minDelay + Math.random() * (maxDelay - minDelay);
    flickerTimeout = setTimeout(triggerFlicker, delay);
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    scheduleFlicker();
  }

  // ===== AMBIENT: SCANLINE HUM =====
  var humCanvas = document.getElementById('hum-canvas');
  var humCtx = humCanvas.getContext('2d');

  function resizeHumCanvas() {
    humCanvas.width = window.innerWidth;
    humCanvas.height = window.innerHeight;
    if (!prefersReducedMotion) {
      drawScanlines();
    }
  }

  function drawScanlines() {
    var w = humCanvas.width;
    var h = humCanvas.height;
    humCtx.clearRect(0, 0, w, h);

    humCtx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (var y = 0; y < h; y += 3) {
      humCtx.fillRect(0, y, w, 1);
    }
  }

  resizeHumCanvas();
  window.addEventListener('resize', resizeHumCanvas);

  // ===== DRAWER RENDERING =====
  var drawersContainer = document.getElementById('drawers');
  var overlay = document.getElementById('overlay');
  var caseFileContainer = document.getElementById('case-file');
  var closeOverlayBtn = document.getElementById('close-overlay');
  var lastOpenedCaseId = null;

  function formatDate(isoString) {
    var d = new Date(isoString);
    var year = d.getUTCFullYear();
    var month = String(d.getUTCMonth() + 1).padStart(2, '0');
    var day = String(d.getUTCDate()).padStart(2, '0');
    var hours = String(d.getUTCHours()).padStart(2, '0');
    var minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ' UTC';
  }

  function formatTimestamp(isoString) {
    var d = new Date(isoString);
    var hours = String(d.getUTCHours()).padStart(2, '0');
    var minutes = String(d.getUTCMinutes()).padStart(2, '0');
    var seconds = String(d.getUTCSeconds()).padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
  }

  function renderDrawers() {
    drawersContainer.innerHTML = '';

    CASES.forEach(function (c) {
      var drawer = document.createElement('div');
      drawer.className = 'drawer';
      drawer.setAttribute('role', 'button');
      drawer.setAttribute('tabindex', '0');
      drawer.setAttribute('aria-label', 'Open case file for ' + c.name);
      drawer.dataset.caseId = c.id;

      drawer.innerHTML =
        '<div class="drawer-handle">&#9776;</div>' +
        '<div class="drawer-body">' +
          '<span class="drawer-id">' + c.id + '</span>' +
          '<div class="drawer-name-block">' +
            '<div class="drawer-name">' + c.name + '</div>' +
            '<div class="drawer-type">' + c.type + '</div>' +
          '</div>' +
          '<div class="drawer-cause">' + c.causeOfDeath + '</div>' +
          '<div class="drawer-status">' +
            '<span class="status-dot"></span>' +
            '<span class="status-text">Closed</span>' +
          '</div>' +
          '<span class="drawer-open-indicator">&#8594;</span>' +
        '</div>';

      drawer.addEventListener('click', function () {
        openCase(c.id);
      });

      drawer.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCase(c.id);
        }
      });

      drawersContainer.appendChild(drawer);
    });
  }

  // ===== CASE FILE RENDERING =====
  function openCase(caseId) {
    var c = CASES.find(function (cs) { return cs.id === caseId; });
    if (!c) return;

    lastOpenedCaseId = c.id;
    caseFileContainer.innerHTML = renderCaseFile(c);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(function () {
      closeOverlayBtn.focus();
    }, 100);
  }

  function closeOverlay() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    var storedId = lastOpenedCaseId;
    lastOpenedCaseId = null;

    if (storedId) {
      var drawer = drawersContainer.querySelector('[data-case-id="' + storedId + '"]');
      if (drawer) drawer.focus();
    }
  }

  closeOverlayBtn.addEventListener('click', closeOverlay);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeOverlay();
    }
  });

  function renderCaseFile(c) {
    var html = '';

    // Header
    html += '<div class="cf-header">';
    html += '<div class="cf-title-row">';
    html += '<h2 class="cf-name">' + c.name + '</h2>';
    html += '<span class="cf-id">' + c.id + '</span>';
    html += '</div>';
    html += '<div class="cf-type">' + c.type + ' &middot; Received ' + c.received + '</div>';

    // Meta grid
    html += '<div class="cf-meta-grid">';
    html += '<div class="cf-meta-item">';
    html += '<span class="cf-meta-label">Cause of Death</span>';
    html += '<span class="cf-meta-value cause">' + c.causeOfDeath + '</span>';
    html += '</div>';
    html += '<div class="cf-meta-item">';
    html += '<span class="cf-meta-label">Manner</span>';
    html += '<span class="cf-meta-value">' + c.manner + '</span>';
    html += '</div>';
    html += '<div class="cf-meta-item">';
    html += '<span class="cf-meta-label">Time of Death</span>';
    html += '<span class="cf-meta-value">' + formatDate(c.timeOfDeath) + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Distinguishing marks
    html += '<div class="cf-section">';
    html += '<h3 class="cf-section-title">Distinguishing Marks</h3>';
    html += '<ul class="cf-marks-list">';
    c.distinguishingMarks.forEach(function (mark) {
      html += '<li>' + mark + '</li>';
    });
    html += '</ul>';
    html += '</div>';

    // Rejection language
    html += '<div class="cf-section">';
    html += '<h3 class="cf-section-title">Rejection Language</h3>';
    html += '<div class="cf-rejection-text">' + c.rejectionLanguage + '</div>';
    html += '</div>';

    // Would have been
    html += '<div class="cf-section">';
    html += '<h3 class="cf-section-title">Reconstructed: What It Would Have Been</h3>';
    html += '<p class="cf-wouldhave-text">' + c.wouldHaveBeen + '</p>';
    html += '</div>';

    // Autopsy toggle
    html += '<div class="cf-autopsy-toggle">';
    html += '<button class="autopsy-btn" id="autopsy-toggle-btn" aria-expanded="false">Request Full Autopsy</button>';
    html += '</div>';

    // Autopsy panel (hidden initially)
    html += '<div class="autopsy-panel" id="autopsy-panel">';
    html += '<div class="autopsy-inner">';

    // Pseudocode
    html += '<div class="autopsy-section">';
    html += '<div class="autopsy-label">Recovered Source &mdash; Pseudocode</div>';
    html += '<div class="code-block"><pre>' + escapeHtml(c.pseudocode) + '</pre></div>';
    html += '</div>';

    // Last log
    html += '<div class="autopsy-section">';
    html += '<div class="autopsy-label">Terminal Log &mdash; Final Output</div>';
    html += '<div class="log-block">' + renderLog(c.lastLog) + '</div>';
    html += '</div>';

    // Chain of custody
    html += '<div class="autopsy-section">';
    html += '<div class="autopsy-label">Chain of Custody</div>';
    html += '<div class="custody-timeline">';
    c.chainOfCustody.forEach(function (entry) {
      html += '<div class="custody-entry">';
      html += '<div class="custody-time">' + formatTimestamp(entry.timestamp) + '</div>';
      html += '<div class="custody-action">' + entry.action + '</div>';
      html += '<div class="custody-handler">' + entry.handler + '</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';

    html += '</div>'; // autopsy-inner
    html += '</div>'; // autopsy-panel

    return html;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderLog(logText) {
    var lines = logText.split('\n');
    return lines.map(function (line) {
      var escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (line.indexOf('TERMINATED') !== -1) {
        return '<span class="log-terminated">' + escaped + '</span>';
      }
      return escaped;
    }).join('<br>');
  }

  // ===== AUTOPSY TOGGLE (delegated) =====
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#autopsy-toggle-btn');
    if (!btn) return;

    var panel = document.getElementById('autopsy-panel');
    if (!panel) return;

    var isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
      btn.classList.remove('open');
      btn.textContent = 'Request Full Autopsy';
      btn.setAttribute('aria-expanded', 'false');
    } else {
      panel.classList.add('open');
      btn.classList.add('open');
      btn.textContent = 'Close Autopsy';
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  // ===== INIT =====
  renderDrawers();

})();
