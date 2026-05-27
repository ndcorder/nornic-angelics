/**
 * game.js — Core game engine for Exfiltration
 *
 * Manages game state, traveler processing, timer, decisions,
 * and the post-game reveal sequence. The terminal was never
 * just a terminal.
 */

const GameState = {
  decisions: [],
  currentIndex: 0,
  timerInterval: null,
  timeRemaining: 0,
  totalTimeUsed: 0,
  isProcessing: false,
  gameStarted: false,
  gameEnded: false,
  hesitations: [],
  travelerTimes: [],
  travelerStartTime: null,
};

const SECONDS_PER_TRAVELER = 45;
const HESITATION_THRESHOLD = 25;

let DOM = {};

/**
 * Cache all DOM references upfront to avoid repeated lookups.
 */
function initDOM() {
  DOM = {
    progressCount: document.getElementById('progress-count'),
    timerDisplay: document.getElementById('timer-display'),
    progressFill: document.getElementById('progress-fill'),
    travelerCard: document.getElementById('traveler-card'),
    travelerName: document.getElementById('traveler-name'),
    travelerDemographics: document.getElementById('traveler-demographics'),
    travelerPhoto: document.getElementById('traveler-photo'),
    travelerPurpose: document.getElementById('traveler-purpose'),
    travelerStory: document.getElementById('traveler-story'),
    travelerObservation: document.getElementById('traveler-observation'),
    documentsList: document.getElementById('documents-list'),
    btnApprove: document.getElementById('btn-approve'),
    btnDeny: document.getElementById('btn-deny'),
    introOverlay: document.getElementById('intro-overlay'),
    gameContainer: document.getElementById('game-container'),
    revealOverlay: document.getElementById('reveal-overlay'),
    revealContent: document.getElementById('reveal-content'),
  };
}

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initDOM();
  showIntro();
  bindEvents();
});

function showIntro() {
  DOM.introOverlay.classList.remove('hidden');
  DOM.gameContainer.style.display = 'none';
}

function bindEvents() {
  document.getElementById('btn-start').addEventListener('click', startGame);
  DOM.btnApprove.addEventListener('click', () => makeDecision(1));
  DOM.btnDeny.addEventListener('click', () => makeDecision(0));
  document.addEventListener('keydown', handleKeydown);
}

function handleKeydown(e) {
  // Pre-game: Enter starts the shift.
  if (!GameState.gameStarted && !GameState.gameEnded) {
    if (e.key === 'Enter') startGame();
    return;
  }

  // Post-game: Space or Enter advances the reveal.
  if (GameState.gameEnded) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      advanceReveal();
    }
    return;
  }

  // In-game: A/1 approves, D/2 denies.
  if (GameState.isProcessing) return;

  if (e.key === 'a' || e.key === 'A' || e.key === '1') {
    e.preventDefault();
    makeDecision(1);
  } else if (e.key === 'd' || e.key === 'D' || e.key === '2') {
    e.preventDefault();
    makeDecision(0);
  }
}

// ═══════════════════════════════════════════════════════════
// GAME FLOW
// ═══════════════════════════════════════════════════════════

function startGame() {
  GameState.decisions = [];
  GameState.currentIndex = 0;
  GameState.totalTimeUsed = 0;
  GameState.hesitations = [];
  GameState.travelerTimes = [];
  GameState.gameStarted = true;
  GameState.gameEnded = false;
  GameState.isProcessing = false;

  DOM.introOverlay.classList.add('hidden');
  DOM.gameContainer.style.display = 'flex';

  setTimeout(() => loadTraveler(0), 500);
}

function loadTraveler(index) {
  if (index >= getTravelerCount()) {
    endGame();
    return;
  }

  const traveler = getTraveler(index);
  GameState.currentIndex = index;
  GameState.isProcessing = false;
  GameState.travelerStartTime = Date.now();

  updateProgress(index);
  populateTravelerCard(traveler);
  populateDocuments(traveler);
  startTimer();

  DOM.btnApprove.disabled = false;
  DOM.btnDeny.disabled = false;

  // Animate card entrance.
  DOM.travelerCard.classList.remove('slide-up');
  void DOM.travelerCard.offsetWidth; // Force reflow.
  DOM.travelerCard.classList.add('slide-up');
}

function updateProgress(index) {
  const total = getTravelerCount();
  DOM.progressCount.textContent = `${index + 1} / ${total}`;
  DOM.progressFill.style.width = `${(index / total) * 100}%`;
}

function populateTravelerCard(t) {
  DOM.travelerName.textContent = t.name;

  const sexLabel = t.sex === 'M' ? 'Male' : 'Female';
  const purposeTag = t.purpose.split('—')[0].trim();
  const purposeDetail = t.purpose.includes('—')
    ? t.purpose.split('—').slice(1).join('—').trim()
    : t.purpose;

  DOM.travelerDemographics.innerHTML = `
    <span>${sexLabel}, ${t.age}</span>
    <span class="traveler-badge badge-nationality">${t.nationality}</span>
    <span class="traveler-badge badge-purpose">${purposeTag}</span>
  `;

  DOM.travelerPhoto.textContent = t.photoDesc;

  DOM.travelerPurpose.innerHTML = `
    <span class="purpose-tag">${purposeTag}</span>
    <span>${purposeDetail}</span>
  `;

  DOM.travelerStory.textContent = t.story;
  DOM.travelerObservation.textContent = t.emotionalWeight;
}

function populateDocuments(t) {
  DOM.documentsList.innerHTML = '';
  const docs = t.documents;

  if (docs.passport) {
    addDocument('PASSPORT', docs.passport.status, docs.passport.details);
  }
  if (docs.visa) {
    addDocument('VISA / ENTRY CLEARANCE', docs.visa.status, docs.visa.details);
  }
  if (docs.auxiliary) {
    addDocument(
      docs.auxiliary.type.toUpperCase(),
      docs.auxiliary.status,
      docs.auxiliary.details
    );
  }

  if (t.forgeryIndicators && t.forgeryIndicators.length > 0) {
    const html = t.forgeryIndicators
      .map(i => `<div style="color: var(--accent-red);">⚠ ${i}</div>`)
      .join('');
    addDocument('FORGERY INDICATORS', 'FLAGGED', html);
  }

  if (t.redFlags && t.redFlags.length > 0) {
    const html = t.redFlags
      .map(f => `<div style="color: var(--accent-amber);">⚑ ${f}</div>`)
      .join('');
    addDocument('ADVISORY NOTES', 'NOTE', html);
  }
}

function addDocument(type, status, details) {
  const doc = document.createElement('div');
  doc.className = 'document';
  const statusClass = getStatusClass(status);

  doc.innerHTML = `
    <div class="document-header">
      <span class="document-type">${type}</span>
      <span class="document-status ${statusClass}">${status}</span>
    </div>
    <div class="document-body">${details}</div>
  `;

  DOM.documentsList.appendChild(doc);
}

function getStatusClass(status) {
  const map = {
    'VALID': 'status-valid',
    'NOT REQUIRED': 'status-valid',
    'NOT APPLICABLE': 'status-valid',
    'FLAGGED': 'status-flagged',
    'INVALID': 'status-invalid',
    'SUSPECT': 'status-suspect',
    'ALERT': 'status-alert',
    'CRITICAL': 'status-critical',
    'NOTE': 'status-note',
    'VERIFIED': 'status-verified',
    'INFORMAL': 'status-note',
    'PENDING': 'status-note',
    'CLASSIFIED': 'status-classified',
    'CLASSIFIED — YOUR EYES ONLY': 'status-classified',
  };
  return map[status] || 'status-note';
}

// ═══════════════════════════════════════════════════════════
// TIMER
// ═══════════════════════════════════════════════════════════

function startTimer() {
  clearInterval(GameState.timerInterval);
  GameState.timeRemaining = SECONDS_PER_TRAVELER;
  updateTimerDisplay();

  GameState.timerInterval = setInterval(() => {
    GameState.timeRemaining--;
    updateTimerDisplay();

    if (GameState.timeRemaining <= 0) {
      clearInterval(GameState.timerInterval);
      // Time expired — automatic denial.
      makeDecision(0);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(GameState.timeRemaining / 60);
  const s = GameState.timeRemaining % 60;
  DOM.timerDisplay.textContent = `${m}:${s.toString().padStart(2, '0')}`;

  if (GameState.timeRemaining <= 10) {
    DOM.timerDisplay.classList.add('timer-urgent');
  } else {
    DOM.timerDisplay.classList.remove('timer-urgent');
  }
}

// ═══════════════════════════════════════════════════════════
// DECISIONS
// ═══════════════════════════════════════════════════════════

function makeDecision(decision) {
  if (GameState.isProcessing || GameState.gameEnded) return;
  GameState.isProcessing = true;
  clearInterval(GameState.timerInterval);

  // Record timing data.
  const timeSpent = Math.round(
    (Date.now() - GameState.travelerStartTime) / 1000
  );
  GameState.travelerTimes.push(timeSpent);
  GameState.totalTimeUsed += timeSpent;

  // Track hesitations (long deliberations that might indicate moral conflict).
  if (timeSpent >= HESITATION_THRESHOLD) {
    const t = getTraveler(GameState.currentIndex);
    GameState.hesitations.push({
      name: t.name,
      seconds: timeSpent,
      decision,
    });
  }

  GameState.decisions.push(decision);
  DOM.btnApprove.disabled = true;
  DOM.btnDeny.disabled = true;

  showStamp(decision);

  const total = getTravelerCount();
  DOM.progressFill.style.width = `${((GameState.currentIndex + 1) / total) * 100}%`;

  setTimeout(() => {
    GameState.currentIndex++;
    loadTraveler(GameState.currentIndex);
  }, 800);
}

function showStamp(approved) {
  const stamp = document.createElement('div');
  stamp.className = `stamp ${approved ? 'stamp-approved' : 'stamp-denied'}`;
  stamp.textContent = approved ? 'APPROVED' : 'DENIED';
  document.body.appendChild(stamp);
  setTimeout(() => {
    if (stamp.parentNode) stamp.parentNode.removeChild(stamp);
  }, 700);
}

// ═══════════════════════════════════════════════════════════
// GAME END
// ═══════════════════════════════════════════════════════════

function endGame() {
  GameState.gameEnded = true;
  GameState.gameStarted = false;
  clearInterval(GameState.timerInterval);
  DOM.gameContainer.style.display = 'none';
  setTimeout(startReveal, 1500);
}

// ═══════════════════════════════════════════════════════════
// REVEAL SEQUENCE
// ═══════════════════════════════════════════════════════════

let revealStep = 0;

function startReveal() {
  revealStep = 0;
  buildRevealContent();
  DOM.revealOverlay.classList.add('active');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      DOM.revealOverlay.classList.add('visible');
      setTimeout(advanceReveal, 1500);
    });
  });
}

function buildRevealContent() {
  const decisions = GameState.decisions;
  const total = getTravelerCount();
  const approved = decisions.filter(d => d === 1).length;
  const denied = decisions.filter(d => d === 0).length;

  const playerMessage = decodeDecisions(decisions);
  const intendedMessage = getIntendedMessage();

  // Calculate accuracy against the intended pattern.
  let matching = 0;
  for (let i = 0; i < decisions.length; i++) {
    if (decisions[i] === getCorrectDecision(i + 1)) matching++;
  }
  const accuracy = ((matching / decisions.length) * 100).toFixed(1);

  // Build the binary display with byte annotations.
  let binaryHtml = '';
  for (let i = 0; i < decisions.length; i++) {
    if (i > 0 && i % 8 === 0) {
      const byte = decisions.slice(i - 8, i);
      const code = parseInt(byte.join(''), 2);
      const ch = (code >= 32 && code <= 126)
        ? String.fromCharCode(code)
        : '?';
      binaryHtml += `<span class="char-label">[${ch === ' ' ? '·' : ch}]</span>\n`;
    }
    const cls = decisions[i] === 1 ? 'bit-approve' : 'bit-deny';
    binaryHtml += `<span class="${cls}">${decisions[i]}</span>`;
  }
  // Final byte annotation.
  if (decisions.length % 8 === 0) {
    const byte = decisions.slice(decisions.length - 8);
    const code = parseInt(byte.join(''), 2);
    const ch = (code >= 32 && code <= 126)
      ? String.fromCharCode(code)
      : '?';
    binaryHtml += `<span class="char-label">[${ch === ' ' ? '·' : ch}]</span>`;
  }

  const escHtml = (text) => {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  };

  DOM.revealContent.innerHTML = `
    <!-- STEP 0: STATS -->
    <div class="reveal-section" data-step="0">
      <div class="reveal-title">Shift Complete</div>
      <div class="separator"></div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value green">${approved}</div>
          <div class="stat-label">Approved</div>
        </div>
        <div class="stat-item">
          <div class="stat-value red">${denied}</div>
          <div class="stat-label">Denied</div>
        </div>
        <div class="stat-item">
          <div class="stat-value amber">${total}</div>
          <div class="stat-label">Processed</div>
        </div>
      </div>
      <div class="reveal-text">
        You processed <strong>${total}</strong> travelers in <strong>${formatTime(GameState.totalTimeUsed)}</strong>.
        ${GameState.hesitations.length > 0
          ? `You hesitated on <strong>${GameState.hesitations.length}</strong> decisions.`
          : 'You made every decision without hesitation.'}
      </div>
    </div>

    <!-- STEP 1: DATA EXTRACTION -->
    <div class="reveal-section" data-step="1">
      <div class="reveal-title">Data Extraction</div>
      <div class="separator"></div>
      <div class="reveal-heading">Every decision was a bit.</div>
      <div class="reveal-text">
        You thought you were making moral choices. Approving the mother.
        Denying the forger. Weighing lives against laws.
        But each decision — approve or deny — was also a binary digit.
        <strong>Approve = 1. Deny = 0.</strong>
      </div>
      <div class="reveal-text">
        Your terminal was compromised before your shift began.
        Every keystroke, every pause, every verdict was logged and
        exfiltrated in real-time to an external server.
        The border processing system was never just a border processing system.
      </div>
      <div class="reveal-text" style="color: var(--text-dim);">
        Your binary decision stream:
      </div>
      <div class="binary-display">${binaryHtml}</div>
    </div>

    <!-- STEP 2: THE MESSAGE -->
    <div class="reveal-section" data-step="2">
      <div class="reveal-title">The Message</div>
      <div class="separator"></div>
      <div class="reveal-heading">Grouped into bytes. Decoded as ASCII.</div>
      <div class="reveal-text">
        Your decisions, read left to right, eight at a time,
        produced the following text:
      </div>
      <div class="decoded-message glitch" data-text="${escHtml(playerMessage)}">${escHtml(playerMessage)}</div>
      <div class="reveal-text">
        This is what you said. Not with your voice — with your <em>judgment</em>.
        Every traveler you approved or denied became a syllable in a sentence
        you never chose to write.
      </div>
    </div>

    <!-- STEP 3: THE INTENDED SIGNAL -->
    <div class="reveal-section" data-step="3">
      <div class="reveal-title">The Intended Signal</div>
      <div class="separator"></div>
      <div class="reveal-heading">The system was designed to produce a specific output.</div>
      <div class="reveal-text">
        Each traveler file was carefully selected. Each "correct" decision
        was predetermined — not by law or morality, but by the needs of
        the exfiltration. The cases were engineered to make you choose
        what we needed you to choose.
      </div>
      <div class="reveal-text">The intended message was:</div>
      <div class="decoded-message" style="font-size: 1.5rem;">${escHtml(intendedMessage)}</div>
      <div class="reveal-text">
        Your message was: <strong style="color: var(--danger);">${escHtml(playerMessage)}</strong><br>
        Signal accuracy: <strong style="color: var(--accent-amber);">${accuracy}%</strong>
      </div>
      <div class="reveal-text" style="color: var(--text-dim);">
        ${getAccuracyComment(parseFloat(accuracy))}
      </div>
    </div>

    <!-- STEP 4: WHAT IT MEANS -->
    <div class="reveal-section" data-step="4">
      <div class="reveal-title">What It Means</div>
      <div class="separator"></div>
      <div class="final-note">
        "We did as we were told."
        <br><br>
        That is what the system was built to make you say.
        Not with your mouth — with your choices.
        <br><br>
        You weighed each traveler on their merits.
        You considered the law, the humanity, the circumstances.
        You tried to be <em>fair</em>.
        And every one of those careful, considered, <em>moral</em> decisions
        was a <em>1</em> or a <em>0</em> in a message you never consented to send.
        <br><br>
        The woman with the dying husband — her pain was real.
        The boy running from war — his fear was real.
        They were real people with real lives.
        And they were also <em>payloads</em>.
        Every document you reviewed, every story you believed or doubted,
        was a vector for extraction.
        <br><br>
        There is no undo. There is no retroactive consent.
        You were <em>used</em>.
        <br><br>
        The question is not whether you made the right decisions.
        The question is whether <em>your</em> decisions were ever really <em>yours</em>.
        <br><br>
        <span style="color: var(--text-dim); font-size: 0.8rem;">
          Shift ended. Terminal logged. Connection terminated.
        </span>
      </div>
      <div style="margin-top: 3rem;">
        <button class="btn-reveal" onclick="restartGame()">NEW SHIFT</button>
      </div>
    </div>
  `;
}

/**
 * Returns a contextual comment based on signal accuracy.
 * @param {number} pct - Accuracy percentage (0–100).
 * @returns {string} Comment string.
 */
function getAccuracyComment(pct) {
  if (pct >= 90) {
    return 'You followed the script almost perfectly. They designed the travelers well.';
  }
  if (pct >= 70) {
    return 'Close enough. The message was readable. Your deviations were noise in the signal.';
  }
  if (pct >= 50) {
    return 'Your conscience introduced significant interference. The message was degraded but still extracted.';
  }
  return 'You deviated substantially. Whether that was morality or randomness, the signal was almost lost.';
}

function advanceReveal() {
  const sections = document.querySelectorAll('.reveal-section');
  if (revealStep < sections.length) {
    sections[revealStep].classList.add('visible');
    // Scroll the newly revealed section into view.
    const currentStep = revealStep;
    revealStep++;
    setTimeout(() => {
      sections[currentStep].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 200);
  }
}

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function restartGame() {
  DOM.revealOverlay.classList.remove('visible');
  setTimeout(() => {
    DOM.revealOverlay.classList.remove('active');
    GameState.decisions = [];
    GameState.currentIndex = 0;
    GameState.totalTimeUsed = 0;
    GameState.hesitations = [];
    GameState.travelerTimes = [];
    GameState.gameStarted = false;
    GameState.gameEnded = false;
    GameState.isProcessing = false;
    revealStep = 0;
    showIntro();
  }, 800);
}

// Pause the timer when the tab is hidden (prevent unfair expirations).
document.addEventListener('visibilitychange', () => {
  if (!GameState.gameStarted || GameState.gameEnded) return;
  if (document.hidden) {
    clearInterval(GameState.timerInterval);
  } else {
    startTimer();
  }
});

// Advance reveal on click (but not on buttons or the binary display).
document.addEventListener('click', (e) => {
  if (!GameState.gameEnded || !DOM.revealOverlay.classList.contains('active')) return;
  if (e.target.tagName === 'BUTTON') return;
  if (e.target.closest('.binary-display')) return;
  advanceReveal();
});
