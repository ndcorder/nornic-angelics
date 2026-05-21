/**
 * Static Routing — Game Engine
 *
 * Core loop: packet queue management, click-to-route interaction,
 * level progression, consequence tracking, and terminal UI rendering.
 */

// ═══════════════════════════════════════════════════════════
//  GAME STATE
// ═══════════════════════════════════════════════════════════

const GameState = {
  currentLevel: 0,
  phase: 'title',
  packetQueue: [],
  channels: [],
  selectedPacket: null,
  consequences: [],
  levelConsequences: [],
  allConsequences: [],
  packetsDelivered: 0,
  packetsLost: 0,
  packetsMonitored: 0,
  packetsVoided: 0,
  timer: null,
  timerSeconds: 0,
  levelStartTime: 0,
  animating: false,
  hoveredPacket: null,
  hoveredChannel: null,
  finalSentPacket: null,
  finalDroppedPacket: null,
  scrollOffset: 0,
  particles: [],
  bootComplete: false,
  audioCtx: null
};

// ═══════════════════════════════════════════════════════════
//  LEVEL CONFIGURATIONS
// ═══════════════════════════════════════════════════════════

const LEVEL_CONFIG = [
  {
    level: 1,
    title: "FIRST SHIFT",
    subtitle: "Residential Queue Routing",
    description: "Three output channels. Two work fine. One is damaged.\nRoute the packets. Don't overthink it.",
    packetConfig: [
      { category: 'couple_arguing', count: 4 },
      { category: 'parent_child', count: 3 }
    ],
    timeLimit: 90,
    briefing: [
      "You are a packet router. Packets arrive on the left.",
      "Choose an output channel on the right for each one.",
      "Green channels deliver safely. Yellow channels are damaged.",
      "Click a packet, then click a channel to route it.",
      "Some packets are more important than others.",
      "You'll see."
    ]
  },
  {
    level: 2,
    title: "MONITORED LINES",
    subtitle: "Surveillance Infrastructure",
    description: "One of these channels is watching.\nDelivering through it has consequences.",
    packetConfig: [
      { category: 'doctor_patient', count: 4 },
      { category: 'couple_arguing', count: 3 }
    ],
    timeLimit: 85,
    briefing: [
      "New channel type: MONITORED (red).",
      "Monitored channels deliver the packet, but flag the recipient.",
      "Their location, relationships, and message content are logged.",
      "The message arrives — but someone else reads it too.",
      "Sometimes there's no other choice. Sometimes there is.",
      "The broken channel from last shift is still damaged."
    ]
  },
  {
    level: 3,
    title: "DEAD ENDS",
    subtitle: "Routes to Nothing",
    description: "Some destinations no longer exist.\nPackets sent there simply disappear.",
    packetConfig: [
      { category: 'witness_crime', count: 4 },
      { category: 'soldier_home', count: 4 }
    ],
    timeLimit: 80,
    briefing: [
      "New channel type: NONEXISTENT (grey).",
      "The destination has been decommissioned, shut down, or destroyed.",
      "Packets sent here produce no error, no bounce, no acknowledgment.",
      "Just silence.",
      "",
      "Think about what you're routing before you choose.",
      "Not all silence is equal."
    ]
  },
  {
    level: 4,
    title: "TRIAGE",
    subtitle: "Everything Is Broken",
    description: "Two broken channels. One monitored. One dead end.\nNo clean routes. Choose carefully.",
    packetConfig: [
      { category: 'emergency_dispatch', count: 5 },
      { category: 'whistleblower_evidence', count: 3 }
    ],
    timeLimit: 75,
    briefing: [
      "No safe channels this time.",
      "Every route has a cost: surveillance, loss, or void.",
      "Emergency traffic and sensitive evidence in the same queue.",
      "A whistleblower's evidence through a monitored channel means they're exposed.",
      "An emergency dispatch through a broken channel means someone waits longer.",
      "",
      "There are no correct answers. Only consequences."
    ]
  },
  {
    level: 5,
    title: "LAST ROUTINE",
    subtitle: "Before the End",
    description: "One safe channel. The rest are watching or gone.\nMost of these messages are to people who can't receive them.",
    packetConfig: [
      { category: 'lost_confession', count: 5 },
      { category: 'parent_child', count: 2 },
      { category: 'soldier_home', count: 2 }
    ],
    timeLimit: 70,
    briefing: [
      "One clean channel. Use it wisely — it has limited capacity.",
      "The other routes are monitored or lead nowhere.",
      "A dying woman's confession to her sister.",
      "A parent's last attempt to reach their child.",
      "A soldier's letters home.",
      "",
      "You can't save them all.",
      "Who deserves to be heard?"
    ]
  },
  {
    level: 6,
    title: "STATIC",
    subtitle: "One Output",
    description: "The network is dying. One channel remains.\nTwo packets. Room for one.",
    packetConfig: [
      { category: 'final_distress', count: 1 },
      { category: 'final_love_letter', count: 1 }
    ],
    timeLimit: 0,
    briefing: [
      "This is the last queue.",
      "One output channel. It works. Just barely.",
      "Two packets:",
      "  — A MAYDAY from a sinking fishing vessel. Six souls. A child.",
      "  — A love letter. Three years in the making. Finally sent.",
      "",
      "You can route one. The other will be lost.",
      "",
      "There is no right answer.",
      "Choose."
    ],
    isFinal: true
  }
];

// ═══════════════════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════════════════

function initGame() {
  buildDOM();
  startBootSequence();
}

function buildDOM() {
  const root = document.getElementById('game-root');
  root.innerHTML = '';

  // Scanline overlay
  const scanlines = document.createElement('div');
  scanlines.id = 'scanlines';
  scanlines.className = 'scanline-overlay';
  root.appendChild(scanlines);

  // CRT flicker overlay
  const flicker = document.createElement('div');
  flicker.id = 'flicker';
  flicker.className = 'flicker-overlay';
  root.appendChild(flicker);

  // Floating particle canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.className = 'particle-canvas';
  root.appendChild(canvas);

  // Terminal wrapper
  const terminal = document.createElement('div');
  terminal.id = 'terminal';
  terminal.className = 'terminal';
  root.appendChild(terminal);

  // Hidden screen (used for boot only)
  const screen = document.createElement('div');
  screen.id = 'screen';
  screen.className = 'screen';
  terminal.appendChild(screen);

  // Top bar
  const topbar = document.createElement('div');
  topbar.id = 'topbar';
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <div class="topbar-left">
      <span class="topbar-indicator" id="status-indicator">●</span>
      <span class="topbar-label" id="status-label">STATIC ROUTING v2.1</span>
    </div>
    <div class="topbar-center" id="topbar-title"></div>
    <div class="topbar-right">
      <span class="topbar-stat" id="stat-delivered">DELIVERED: 0</span>
      <span class="topbar-stat" id="stat-lost">LOST: 0</span>
      <span class="topbar-stat" id="stat-monitored">MONITORED: 0</span>
      <span class="topbar-timer" id="timer-display"></span>
    </div>
  `;
  terminal.appendChild(topbar);

  // Main content area
  const content = document.createElement('div');
  content.id = 'content';
  content.className = 'content';
  terminal.appendChild(content);

  // Bottom consequence log
  const conLog = document.createElement('div');
  conLog.id = 'consequence-log';
  conLog.className = 'consequence-log';
  terminal.appendChild(conLog);

  initParticles(canvas);
}

// ═══════════════════════════════════════════════════════════
//  BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════

function startBootSequence() {
  const screen = document.getElementById('screen');
  const lines = [
    { text: 'STATIC ROUTING SYSTEM v2.1.7', delay: 0 },
    { text: 'Copyright (c) 2031 Meridian Networks Corp.', delay: 200 },
    { text: '', delay: 400 },
    { text: 'Initializing packet queue manager...', delay: 600 },
    { text: 'Loading routing table............ OK', delay: 1000 },
    { text: 'Scanning output channels......... OK', delay: 1400 },
    { text: 'Connecting to backbone........... OK', delay: 1800 },
    { text: '', delay: 2000 },
    { text: 'WARNING: 3 channels DEGRADED', delay: 2200, cls: 'text-warning' },
    { text: 'WARNING: 2 channels OFFLINE', delay: 2400, cls: 'text-warning' },
    { text: 'WARNING: Network integrity at 23%', delay: 2600, cls: 'text-danger' },
    { text: '', delay: 2800 },
    { text: 'Queue manager ready.', delay: 3000 },
    { text: 'Awaiting operator input.', delay: 3200 },
    { text: '', delay: 3500 },
    { text: '> START', delay: 3700, cls: 'text-command' }
  ];

  screen.innerHTML = '<div class="boot-text"></div>';
  const bootEl = screen.querySelector('.boot-text');

  lines.forEach(line => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'boot-line ' + (line.cls || '');
      div.textContent = line.text || '\u00A0';
      bootEl.appendChild(div);
      bootEl.scrollTop = bootEl.scrollHeight;
    }, line.delay);
  });

  setTimeout(() => {
    GameState.bootComplete = true;
    showTitleScreen();
  }, 4500);
}

// ═══════════════════════════════════════════════════════════
//  TITLE SCREEN
// ═══════════════════════════════════════════════════════════

function showTitleScreen() {
  GameState.phase = 'title';
  const screen = document.getElementById('screen');
  const content = document.getElementById('content');

  screen.style.display = 'none';
  content.style.display = 'block';
  content.className = 'content title-screen';

  document.getElementById('topbar-title').textContent = '';
  document.getElementById('status-label').textContent = 'STATIC ROUTING v2.1';

  content.innerHTML = `
    <div class="title-container">
      <div class="title-glitch" data-text="STATIC">STATIC</div>
      <div class="title-sub">ROUTING</div>
      <div class="title-tagline">Every packet has a destination.<br>Not every destination still exists.</div>
      <div class="title-divider">─────────────────────────────</div>
      <div class="title-prompt" id="title-prompt">PRESS ANY KEY TO BEGIN</div>
      <div class="title-footer">
        <span>6 LEVELS</span>
        <span>·</span>
        <span>8 CONVERSATION THREADS</span>
        <span>·</span>
        <span>1 IMPOSSIBLE CHOICE</span>
      </div>
    </div>
  `;

  const prompt = document.getElementById('title-prompt');
  let blink = true;
  const blinkId = setInterval(() => {
    if (GameState.phase !== 'title') { clearInterval(blinkId); return; }
    prompt.style.opacity = blink ? '1' : '0.3';
    blink = !blink;
  }, 700);

  const handler = () => {
    if (GameState.phase !== 'title') return;
    clearInterval(blinkId);
    document.removeEventListener('keydown', handler);
    document.removeEventListener('click', handler);
    playTone(440, 0.1, 'sine');
    startLevel(1);
  };

  document.addEventListener('keydown', handler);
  document.addEventListener('click', handler);
}

// ═══════════════════════════════════════════════════════════
//  LEVEL MANAGEMENT
// ═══════════════════════════════════════════════════════════

function startLevel(levelNum) {
  const config = LEVEL_CONFIG[levelNum - 1];
  if (!config) { showEnding(); return; }

  GameState.currentLevel = levelNum;
  GameState.levelConsequences = [];
  GameState.selectedPacket = null;
  GameState.timerSeconds = config.timeLimit;
  GameState.scrollOffset = 0;
  GameState.finalSentPacket = null;
  GameState.finalDroppedPacket = null;

  // Build and shuffle packet queue
  GameState.packetQueue = buildLevelPackets(config.packetConfig);
  GameState.packetQueue.forEach((p, i) => {
    p._queueIndex = i;
    p._routed = false;
  });

  // Load channels for this level
  GameState.channels = getChannelsForLevel(levelNum);
  GameState.channels.forEach(ch => { ch._currentQueue = 0; });

  showBriefing(config);
}

// ═══════════════════════════════════════════════════════════
//  BRIEFING SCREEN
// ═══════════════════════════════════════════════════════════

function showBriefing(config) {
  GameState.phase = 'briefing';
  const screen = document.getElementById('screen');
  const content = document.getElementById('content');

  screen.style.display = 'none';
  content.style.display = 'block';
  content.className = 'content briefing-screen';

  document.getElementById('topbar-title').textContent = `LEVEL ${config.level}: ${config.title}`;
  document.getElementById('status-label').textContent = 'BRIEFING';

  const channelList = GameState.channels.map(ch => {
    const info = getChannelTypeDescription(ch.type);
    return `
      <div class="briefing-channel" style="border-left: 3px solid ${info.color}">
        <span class="briefing-channel-icon" style="color:${info.color}">${ch.icon}</span>
        <span class="briefing-channel-name">${ch.name}</span>
        <span class="briefing-channel-type" style="color:${info.color}">${info.label}</span>
        <span class="briefing-channel-desc">${ch.description}</span>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div class="briefing-container">
      <div class="briefing-header">
        <div class="briefing-level">LEVEL ${config.level}</div>
        <div class="briefing-title">${config.title}</div>
        <div class="briefing-subtitle">${config.subtitle}</div>
      </div>
      <div class="briefing-description">${config.description.replace(/\n/g, '<br>')}</div>
      <div class="briefing-divider">─────────────────────────────</div>
      <div class="briefing-channels">
        <div class="briefing-channels-title">OUTPUT CHANNELS</div>
        ${channelList}
      </div>
      <div class="briefing-divider">─────────────────────────────</div>
      <div class="briefing-text-container" id="briefing-text"></div>
      <div class="briefing-prompt" id="briefing-prompt" style="display:none">CLICK TO BEGIN ROUTING</div>
    </div>
  `;

  // Typewriter briefing text
  const textEl = document.getElementById('briefing-text');
  const lines = config.briefing;
  let lineIdx = 0;

  function typeLine() {
    if (lineIdx >= lines.length) {
      const prompt = document.getElementById('briefing-prompt');
      prompt.style.display = 'block';
      let blink = true;
      const bi = setInterval(() => {
        if (GameState.phase !== 'briefing') { clearInterval(bi); return; }
        prompt.style.opacity = blink ? '1' : '0.3';
        blink = !blink;
      }, 600);

      const proceed = () => {
        if (GameState.phase !== 'briefing') return;
        clearInterval(bi);
        content.removeEventListener('click', proceed);
        document.removeEventListener('keydown', proceed);
        playTone(330, 0.08, 'sine');
        beginRouting();
      };
      content.addEventListener('click', proceed);
      document.addEventListener('keydown', proceed);
      return;
    }

    const line = lines[lineIdx];
    const div = document.createElement('div');
    div.className = 'briefing-line';
    textEl.appendChild(div);

    if (line === '') {
      div.innerHTML = '&nbsp;';
      lineIdx++;
      setTimeout(typeLine, 150);
      return;
    }

    let ci = 0;
    const tick = () => {
      if (ci < line.length) {
        div.textContent = line.substring(0, ci + 1);
        ci++;
        setTimeout(tick, 18);
      } else {
        lineIdx++;
        setTimeout(typeLine, 200);
      }
    };
    tick();
  }

  setTimeout(typeLine, 500);
}

// ═══════════════════════════════════════════════════════════
//  ROUTING PHASE
// ═══════════════════════════════════════════════════════════

function beginRouting() {
  const config = LEVEL_CONFIG[GameState.currentLevel - 1];
  GameState.phase = 'playing';
  GameState.levelStartTime = Date.now();

  const screen = document.getElementById('screen');
  const content = document.getElementById('content');

  screen.style.display = 'none';
  content.style.display = 'block';
  content.className = 'content routing-screen';

  document.getElementById('status-label').textContent = 'ROUTING ACTIVE';
  document.getElementById('status-indicator').className = 'topbar-indicator indicator-active';
  document.getElementById('topbar-title').textContent = config.isFinal
    ? `FINAL: ${config.title}`
    : `LEVEL ${config.level}: ${config.title}`;

  renderRoutingUI();

  if (config.timeLimit > 0) startTimer();
  if (config.isFinal) showFinalPrompt();
}

function renderRoutingUI() {
  const content = document.getElementById('content');
  const unrouted = GameState.packetQueue.filter(p => !p._routed);

  let html = '<div class="routing-container">';

  // ── Packet queue (left) ──
  html += '<div class="packet-queue-panel">';
  html += `<div class="panel-header">INPUT QUEUE <span class="packet-count">${unrouted.length} REMAINING</span></div>`;
  html += '<div class="packet-list" id="packet-list">';

  unrouted.forEach(packet => {
    const selected = GameState.selectedPacket && GameState.selectedPacket.id === packet.id;
    const hovered = GameState.hoveredPacket === packet.id;
    html += `
      <div class="packet-card ${selected ? 'packet-selected' : ''} ${hovered ? 'packet-hovered' : ''}"
           data-packet-id="${packet.id}"
           onmouseenter="onPacketHover('${packet.id}')"
           onmouseleave="onPacketLeave()"
           onclick="onPacketClick('${packet.id}')">
        <div class="packet-header">
          <span class="packet-sender">${packet.sender}</span>
          <span class="packet-arrow">→</span>
          <span class="packet-recipient">${packet.recipient}</span>
          <span class="packet-weight">${'●'.repeat(Math.min(packet.weight, 5))}</span>
        </div>
        <div class="packet-content">${escapeHtml(packet.content)}</div>
        <div class="packet-meta">
          <span class="packet-category">${formatCategory(packet.category)}</span>
          ${packet.sequence ? `<span class="packet-sequence">SEQ ${packet.sequence}</span>` : ''}
        </div>
      </div>
    `;
  });

  if (unrouted.length === 0) {
    html += '<div class="packet-empty">QUEUE EMPTY</div>';
  }

  html += '</div></div>';

  // ── Center info ──
  html += '<div class="routing-center">';
  if (GameState.selectedPacket) {
    const p = GameState.selectedPacket;
    html += `
      <div class="selected-packet-info">
        <div class="selected-label">SELECTED PACKET</div>
        <div class="selected-detail">${p.sender} → ${p.recipient}</div>
        <div class="selected-content">${escapeHtml(p.content)}</div>
        <div class="selected-weight">PRIORITY: ${'●'.repeat(p.weight)}</div>
        <div class="selected-hint">Click an output channel to route</div>
      </div>
    `;
  } else {
    html += `
      <div class="routing-instructions">
        <div class="instruction-text">Select a packet from the queue</div>
        <div class="instruction-text">then choose an output channel</div>
        <div class="instruction-arrow">← →</div>
      </div>
    `;
  }
  html += '</div>';

  // ── Output channels (right) ──
  html += '<div class="channel-panel">';
  html += '<div class="panel-header">OUTPUT CHANNELS</div>';
  html += '<div class="channel-list" id="channel-list">';

  GameState.channels.forEach(ch => {
    const info = getChannelTypeDescription(ch.type);
    const hovered = GameState.hoveredChannel === ch.id;
    const dots = Array.from({ length: ch.maxQueue }, (_, i) =>
      `<span class="queue-dot ${i < ch._currentQueue ? 'dot-filled' : ''}"
             style="${i < ch._currentQueue ? `background:${ch.color}` : ''}"></span>`
    ).join('');

    html += `
      <div class="channel-card ${hovered ? 'channel-hovered' : ''}"
           data-channel-id="${ch.id}"
           style="border-color: ${ch.color}40"
           onmouseenter="onChannelHover('${ch.id}')"
           onmouseleave="onChannelLeave()"
           onclick="onChannelClick('${ch.id}')">
        <div class="channel-header" style="color: ${ch.color}">
          <span class="channel-icon">${ch.icon}</span>
          <span class="channel-name">${ch.name}</span>
          <span class="channel-type-badge"
                style="background: ${ch.color}20; color: ${ch.color}">${info.label}</span>
        </div>
        <div class="channel-address">${ch.address}</div>
        <div class="channel-status">STATUS: <span style="color:${ch.color}">${ch.status}</span></div>
        <div class="channel-desc">${ch.description}</div>
        <div class="channel-queue">
          <span class="queue-label">QUEUE:</span>
          ${dots}
          <span class="queue-count">${ch._currentQueue}/${ch.maxQueue}</span>
        </div>
      </div>
    `;
  });

  html += '</div></div></div>';
  content.innerHTML = html;
  updateStats();
}

function showFinalPrompt() {
  const log = document.getElementById('consequence-log');
  log.innerHTML = `
    <div class="final-instruction">
      <span class="final-warning">⚠ ONE QUEUE. TWO PACKETS. CHOOSE WHICH TO SEND.</span>
    </div>
  `;
  log.style.display = 'block';
}

// ═══════════════════════════════════════════════════════════
//  INTERACTION HANDLERS
// ═══════════════════════════════════════════════════════════

function onPacketHover(id) {
  GameState.hoveredPacket = id;
  renderRoutingUI();
}

function onPacketLeave() {
  GameState.hoveredPacket = null;
  renderRoutingUI();
}

function onPacketClick(id) {
  if (GameState.animating) return;
  const packet = GameState.packetQueue.find(p => p.id === id && !p._routed);
  if (!packet) return;

  GameState.selectedPacket = (GameState.selectedPacket && GameState.selectedPacket.id === id)
    ? null
    : packet;

  playTone(520, 0.05, 'sine');
  renderRoutingUI();
}

function onChannelHover(id) {
  GameState.hoveredChannel = id;
  renderRoutingUI();
}

function onChannelLeave() {
  GameState.hoveredChannel = null;
  renderRoutingUI();
}

function onChannelClick(id) {
  if (GameState.animating) return;
  if (!GameState.selectedPacket) {
    showLogMessage("Select a packet first.", '#fbbf24');
    return;
  }

  const channel = GameState.channels.find(ch => ch.id === id);
  if (!channel) return;

  if (channel._currentQueue >= channel.maxQueue) {
    showLogMessage(`${channel.name} queue is full.`, '#f87171');
    return;
  }

  const config = LEVEL_CONFIG[GameState.currentLevel - 1];
  if (config.isFinal) {
    handleFinalRouting(GameState.selectedPacket, channel);
    return;
  }

  routePacket(GameState.selectedPacket, channel);
}

// ═══════════════════════════════════════════════════════════
//  PACKET ROUTING
// ═══════════════════════════════════════════════════════════

function routePacket(packet, channel) {
  GameState.animating = true;

  packet._routed = true;
  packet._routedTo = channel.id;
  channel._currentQueue++;

  const consequence = resolveRouting(packet, channel);
  GameState.levelConsequences.push(consequence);
  GameState.allConsequences.push(consequence);

  // Update counters
  if (consequence.delivered && !consequence.monitored) {
    GameState.packetsDelivered++;
  } else if (consequence.monitored) {
    GameState.packetsMonitored++;
  } else if (consequence.voided) {
    GameState.packetsVoided++;
  } else if (!consequence.delivered) {
    GameState.packetsLost++;
  }

  GameState.selectedPacket = null;
  GameState.hoveredPacket = null;
  GameState.hoveredChannel = null;

  showRoutingAnimation(packet, channel, consequence, () => {
    GameState.animating = false;
    renderRoutingUI();

    const unrouted = GameState.packetQueue.filter(p => !p._routed);
    if (unrouted.length === 0) {
      setTimeout(() => completeLevel(), 800);
    }
  });
}

function showRoutingAnimation(packet, channel, consequence, callback) {
  const log = document.getElementById('consequence-log');
  log.style.display = 'block';

  const typeColor = consequence.delivered
    ? (consequence.monitored ? '#f87171' : '#4ade80')
    : (consequence.voided ? '#6b7280' : '#fbbf24');

  const statusText = consequence.delivered
    ? (consequence.monitored ? 'DELIVERED [MONITORED]' : 'DELIVERED')
    : (consequence.voided ? 'LOST [VOID]' : 'LOST [FAILED]');

  const entry = document.createElement('div');
  entry.className = 'log-entry log-appearing';
  entry.innerHTML = `
    <div class="log-header">
      <span class="log-route">${packet.sender} → ${channel.name}</span>
      <span class="log-status" style="color: ${typeColor}">${statusText}</span>
    </div>
    <div class="log-message" style="color: ${typeColor}">${escapeHtml(consequence.message)}</div>
  `;

  // Keep log trimmed
  while (log.children.length > 2) {
    log.removeChild(log.firstChild);
  }
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;

  if (consequence.delivered) {
    playTone(consequence.monitored ? 220 : 660, 0.15, consequence.monitored ? 'sawtooth' : 'sine');
  } else {
    playTone(150, 0.2, 'square');
  }

  flashScreen(typeColor, 0.15);
  setTimeout(callback, 600);
}

// ═══════════════════════════════════════════════════════════
//  FINAL LEVEL
// ═══════════════════════════════════════════════════════════

function handleFinalRouting(packet, channel) {
  const otherPacket = GameState.packetQueue.find(p => p.id !== packet.id);
  if (!otherPacket) return;

  GameState.finalSentPacket = packet;
  GameState.finalDroppedPacket = otherPacket;
  packet._routed = true;
  otherPacket._routed = true;

  const result = resolveFinalConsequence(packet, otherPacket);
  GameState.phase = 'final_choice';
  showFinalConsequenceSequence(result);
}

function showFinalConsequenceSequence(result) {
  const content = document.getElementById('content');
  content.className = 'content final-screen';

  content.innerHTML = `
    <div class="final-consequence-container">
      <div class="final-sent" style="opacity:0">
        <div class="final-status" style="color: #c084fc">SENT</div>
        <div class="final-packet-sender">${result.sent.packet.sender} → ${result.sent.packet.recipient}</div>
        <div class="final-packet-content">"${escapeHtml(result.sent.packet.content)}"</div>
        <div class="final-consequence-msg">${escapeHtml(result.sent.message)}</div>
      </div>
      <div class="final-divider" style="opacity:0">─────────────────────────────</div>
      <div class="final-dropped" style="opacity:0">
        <div class="final-status" style="color: #374151">NOT SENT</div>
        <div class="final-packet-sender">${result.dropped.packet.sender} → ${result.dropped.packet.recipient}</div>
        <div class="final-packet-content">"${escapeHtml(result.dropped.packet.content)}"</div>
        <div class="final-consequence-msg" style="color: #ef4444">${escapeHtml(result.dropped.message)}</div>
      </div>
    </div>
  `;

  const sent = content.querySelector('.final-sent');
  const divider = content.querySelector('.final-divider');
  const dropped = content.querySelector('.final-dropped');

  playTone(440, 0.3, 'sine');

  setTimeout(() => { sent.style.transition = 'opacity 1.5s'; sent.style.opacity = '1'; }, 500);
  setTimeout(() => { divider.style.transition = 'opacity 1s'; divider.style.opacity = '1'; }, 2000);
  setTimeout(() => {
    dropped.style.transition = 'opacity 1.5s';
    dropped.style.opacity = '1';
    playTone(110, 0.5, 'sawtooth');
  }, 3000);

  setTimeout(() => showEnding(), 8000);
}

// ═══════════════════════════════════════════════════════════
//  LEVEL COMPLETION
// ═══════════════════════════════════════════════════════════

function completeLevel() {
  if (GameState.timer) { clearInterval(GameState.timer); GameState.timer = null; }

  const config = LEVEL_CONFIG[GameState.currentLevel - 1];
  if (config.isFinal) return;

  GameState.phase = 'transition';
  const content = document.getElementById('content');

  document.getElementById('screen').style.display = 'none';
  content.style.display = 'block';
  content.className = 'content transition-screen';
  document.getElementById('status-label').textContent = 'SHIFT COMPLETE';
  document.getElementById('status-indicator').className = 'topbar-indicator';

  const delivered = GameState.levelConsequences.filter(c => c.delivered && !c.monitored).length;
  const monitored = GameState.levelConsequences.filter(c => c.monitored).length;
  const lost = GameState.levelConsequences.filter(c => c.broken).length;
  const voided = GameState.levelConsequences.filter(c => c.voided).length;

  // Highlight the most emotionally impactful consequence
  const worst = GameState.levelConsequences.reduce((best, c) =>
    (c.emotionalImpact > (best ? best.emotionalImpact : 0)) ? c : best
  , null);

  const worstHtml = (worst && worst.emotionalImpact >= 3) ? `
    <div class="transition-highlight">
      <div class="transition-highlight-label">REMEMBER</div>
      <div class="transition-highlight-msg">${escapeHtml(worst.message)}</div>
    </div>
  ` : '';

  const hasNext = GameState.currentLevel < LEVEL_CONFIG.length;

  content.innerHTML = `
    <div class="transition-container">
      <div class="transition-level">SHIFT ${config.level} COMPLETE</div>
      <div class="transition-title">${config.title}</div>
      <div class="transition-divider">─────────────────────────────</div>
      <div class="transition-stats">
        <div class="transition-stat" style="color: #4ade80">DELIVERED: ${delivered}</div>
        <div class="transition-stat" style="color: #f87171">MONITORED: ${monitored}</div>
        <div class="transition-stat" style="color: #fbbf24">LOST (BROKEN): ${lost}</div>
        <div class="transition-stat" style="color: #6b7280">VOIDED: ${voided}</div>
      </div>
      ${worstHtml}
      <div class="transition-divider">─────────────────────────────</div>
      <div class="transition-prompt" id="transition-prompt">
        ${hasNext ? 'CLICK TO CONTINUE' : 'CLICK TO END'}
      </div>
    </div>
  `;

  const prompt = document.getElementById('transition-prompt');
  let blink = true;
  const bi = setInterval(() => {
    if (GameState.phase !== 'transition') { clearInterval(bi); return; }
    prompt.style.opacity = blink ? '1' : '0.3';
    blink = !blink;
  }, 600);

  setTimeout(() => {
    const handler = () => {
      if (GameState.phase !== 'transition') return;
      clearInterval(bi);
      content.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
      playTone(330, 0.08, 'sine');
      if (hasNext) { startLevel(GameState.currentLevel + 1); }
      else { showEnding(); }
    };
    content.addEventListener('click', handler);
    document.addEventListener('keydown', handler);
  }, 1500);
}

// ═══════════════════════════════════════════════════════════
//  ENDING SCREEN
// ═══════════════════════════════════════════════════════════

function showEnding() {
  GameState.phase = 'ending';
  const screen = document.getElementById('screen');
  const content = document.getElementById('content');
  const log = document.getElementById('consequence-log');

  screen.style.display = 'none';
  log.style.display = 'none';
  content.style.display = 'block';
  content.className = 'content ending-screen';

  document.getElementById('status-label').textContent = 'END OF LINE';
  document.getElementById('status-indicator').className = 'topbar-indicator';
  document.getElementById('topbar-title').textContent = '';
  document.getElementById('timer-display').textContent = '';

  const totalDelivered = GameState.packetsDelivered;
  const totalMonitored = GameState.packetsMonitored;
  const totalLost = GameState.packetsLost;
  const totalVoided = GameState.packetsVoided;

  // Collect the most impactful consequences for the echo section
  const impactful = GameState.allConsequences
    .filter(c => c.emotionalImpact >= 4)
    .slice(-5);

  let echoHtml = '';
  if (impactful.length > 0) {
    echoHtml = '<div class="ending-echoes"><div class="ending-echo-title">ECHOES</div>';
    impactful.forEach(c => {
      const color = c.delivered
        ? (c.monitored ? '#f87171' : '#4ade80')
        : (c.voided ? '#6b7280' : '#fbbf24');
      echoHtml += `<div class="ending-echo" style="color:${color}">${escapeHtml(c.message)}</div>`;
    });
    echoHtml += '</div>';
  }

  let finalHtml = '';
  if (GameState.finalSentPacket && GameState.finalDroppedPacket) {
    finalHtml = `
      <div class="ending-final-choice">
        <div class="ending-final-label">YOUR LAST ROUTING</div>
        <div class="ending-final-sent">SENT: ${GameState.finalSentPacket.sender} → ${GameState.finalSentPacket.recipient}</div>
        <div class="ending-final-dropped">LOST: ${GameState.finalDroppedPacket.sender} → ${GameState.finalDroppedPacket.recipient}</div>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="ending-container">
      <div class="ending-title">END OF LINE</div>
      <div class="ending-subtitle">SHIFT COMPLETE. LOGGING OUT.</div>
      <div class="ending-divider">─────────────────────────────</div>
      <div class="ending-stats">
        <div class="ending-stat">
          <span class="ending-stat-label">DELIVERED SAFELY</span>
          <span class="ending-stat-value" style="color:#4ade80">${totalDelivered}</span>
        </div>
        <div class="ending-stat">
          <span class="ending-stat-label">DELIVERED UNDER SURVEILLANCE</span>
          <span class="ending-stat-value" style="color:#f87171">${totalMonitored}</span>
        </div>
        <div class="ending-stat">
          <span class="ending-stat-label">LOST IN TRANSIT</span>
          <span class="ending-stat-value" style="color:#fbbf24">${totalLost}</span>
        </div>
        <div class="ending-stat">
          <span class="ending-stat-label">SENT INTO NOTHING</span>
          <span class="ending-stat-value" style="color:#6b7280">${totalVoided}</span>
        </div>
      </div>
      ${finalHtml}
      ${echoHtml}
      <div class="ending-divider">─────────────────────────────</div>
      <div class="ending-credits">
        <div>Every packet was a person.</div>
        <div>Every route was a choice.</div>
        <div>There was no neutral.</div>
      </div>
      <div class="ending-divider">─────────────────────────────</div>
      <div class="ending-thanks">STATIC ROUTING v2.1.7</div>
      <div class="ending-thanks-sub">Meridian Networks Corp.</div>
      <div class="ending-prompt" id="ending-prompt">REFRESH TO ROUTE AGAIN</div>
    </div>
  `;

  // Staggered reveal
  const children = content.querySelector('.ending-container').children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.opacity = '0';
    children[i].style.transition = 'opacity 1s';
  }

  let delay = 500;
  for (let i = 0; i < children.length; i++) {
    setTimeout(() => { children[i].style.opacity = '1'; }, delay);
    delay += 400;
  }

  playTone(330, 0.5, 'sine');
  setTimeout(() => playTone(220, 0.8, 'sine'), 1000);
  setTimeout(() => playTone(165, 1.2, 'sine'), 2000);
}

// ═══════════════════════════════════════════════════════════
//  TIMER
// ═══════════════════════════════════════════════════════════

function startTimer() {
  if (GameState.timer) clearInterval(GameState.timer);
  const display = document.getElementById('timer-display');

  GameState.timer = setInterval(() => {
    if (GameState.phase !== 'playing') {
      clearInterval(GameState.timer);
      return;
    }

    GameState.timerSeconds--;

    if (GameState.timerSeconds <= 0) {
      GameState.timerSeconds = 0;
      clearInterval(GameState.timer);
      display.textContent = 'TIME: 0s';
      display.style.color = '#ef4444';
      autoRouteRemaining();
      return;
    }

    display.textContent = `TIME: ${GameState.timerSeconds}s`;
    display.style.color = GameState.timerSeconds <= 15 ? '#f87171'
      : GameState.timerSeconds <= 30 ? '#fbbf24'
      : '#4ade80';
  }, 1000);

  display.textContent = `TIME: ${GameState.timerSeconds}s`;
  display.style.color = '#4ade80';
}

function autoRouteRemaining() {
  const unrouted = GameState.packetQueue.filter(p => !p._routed);
  if (unrouted.length === 0) {
    setTimeout(() => completeLevel(), 500);
    return;
  }

  let delay = 0;
  unrouted.forEach((packet, idx) => {
    setTimeout(() => {
      const available = GameState.channels.filter(ch => ch._currentQueue < ch.maxQueue);
      const channel = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : GameState.channels[0];

      packet._routed = true;
      channel._currentQueue++;

      const consequence = resolveRouting(packet, channel);
      GameState.levelConsequences.push(consequence);
      GameState.allConsequences.push(consequence);

      if (consequence.delivered && !consequence.monitored) GameState.packetsDelivered++;
      else if (consequence.monitored) GameState.packetsMonitored++;
      else if (consequence.voided) GameState.packetsVoided++;
      else GameState.packetsLost++;

      showRoutingAnimation(packet, channel, consequence, () => renderRoutingUI());

      if (idx === unrouted.length - 1) {
        setTimeout(() => completeLevel(), 1200);
      }
    }, delay);
    delay += 500;
  });
}

// ═══════════════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

function updateStats() {
  document.getElementById('stat-delivered').textContent = `DELIVERED: ${GameState.packetsDelivered}`;
  document.getElementById('stat-lost').textContent = `LOST: ${GameState.packetsLost + GameState.packetsVoided}`;
  document.getElementById('stat-monitored').textContent = `MONITORED: ${GameState.packetsMonitored}`;
}

function showLogMessage(msg, color) {
  const log = document.getElementById('consequence-log');
  log.style.display = 'block';

  const entry = document.createElement('div');
  entry.className = 'log-entry log-appearing';
  entry.innerHTML = `<div class="log-message" style="color: ${color}">${escapeHtml(msg)}</div>`;

  while (log.children.length > 2) {
    log.removeChild(log.firstChild);
  }
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;

  setTimeout(() => {
    entry.style.transition = 'opacity 0.5s';
    entry.style.opacity = '0';
    setTimeout(() => { if (entry.parentNode) entry.parentNode.removeChild(entry); }, 500);
  }, 2000);
}

function formatCategory(cat) {
  return cat.replace(/_/g, ' ').toUpperCase();
}

function escapeHtml(str) {
  const el = document.createElement('div');
  el.textContent = str;
  return el.innerHTML;
}

// ═══════════════════════════════════════════════════════════
//  AUDIO
// ═══════════════════════════════════════════════════════════

function playTone(freq, duration, type) {
  try {
    if (!GameState.audioCtx) {
      GameState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = GameState.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio unavailable — fail silently
  }
}

// ═══════════════════════════════════════════════════════════
//  VISUAL EFFECTS
// ═══════════════════════════════════════════════════════════

function flashScreen(color, intensity) {
  const el = document.getElementById('flicker');
  el.style.backgroundColor = color;
  el.style.opacity = intensity;
  setTimeout(() => {
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '0';
    setTimeout(() => { el.style.transition = ''; }, 300);
  }, 50);
}

function initParticles(canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  GameState.particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.3 + 0.1,
    char: String.fromCharCode(0x30 + Math.floor(Math.random() * 10))
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of GameState.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.font = `${p.size * 8}px monospace`;
      ctx.fillStyle = `rgba(74, 222, 128, ${p.alpha})`;
      ctx.fillText(p.char, p.x, p.y);
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Subtle random scanline flicker
setInterval(() => {
  if (Math.random() < 0.1) {
    const el = document.getElementById('scanlines');
    if (el) el.style.opacity = (Math.random() * 0.03 + 0.02).toFixed(3);
  }
}, 200);

// ═══════════════════════════════════════════════════════════
//  START
// ═══════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', initGame);
