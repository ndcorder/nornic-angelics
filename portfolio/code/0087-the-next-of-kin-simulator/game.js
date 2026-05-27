/**
 * game.js — Main game engine for The Next of Kin Simulator
 *
 * A terminal-based simulation where you hold a dead woman's phone
 * and must decide who learns what, when, and from whom.
 */

class NextOfKinSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.graph = new SocialGraph();

    // Game state
    this.battery = GAME_CONFIG.startingBattery;
    this.gameTime = 0;
    this.phase = "boot";
    this.running = false;
    this.paused = false;
    this.lastTick = null;
    this.gameOver = false;

    // Player state
    this.readThreads = {};
    this.currentView = null;
    this.notificationQueue = [];
    this.inCall = false;
    this.currentCallContact = null;

    // Terminal
    this.outputBuffer = [];
    this.typewriterSpeed = 18;

    // History
    this.actionLog = [];
    this.notificationHistory = [];

    // Warnings
    this.phaseWarningShown = false;
    this.batteryWarnings = { twenty: false, fifteen: false, ten: false, five: false };
    this.cascadeWarnings = [];

    // Input
    this.inputCallback = null;

    this._setupStyles();
  }

  // ── Setup ──────────────────────────────────────

  _setupStyles() {
    const s = this.container.style;
    s.backgroundColor = "#0a0a0a";
    s.color = "#c8c8c8";
    s.fontFamily = "'Courier New', Courier, monospace";
    s.fontSize = "14px";
    s.lineHeight = "1.6";
    s.padding = "20px 40px";
    s.height = "100vh";
    s.overflowY = "auto";
    s.boxSizing = "border-box";
    s.whiteSpace = "pre-wrap";
    s.wordWrap = "break-word";
  }

  // ── Start / Boot ───────────────────────────────

  start() {
    this.running = true;
    this.phase = "boot";
    this._showBootSequence();
  }

  async _showBootSequence() {
    await this._typeLine("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557");
    await this._typeLine("\u2551        NEXT OF KIN NOTIFICATION SYSTEM v2.4         \u2551");
    await this._typeLine("\u2551        San Francisco General Hospital               \u2551");
    await this._typeLine("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D");
    await this._typeLine("");
    await this._delay(800);

    await this._typeLine("INCIDENT REPORT \u2014 AUTO-GENERATED");
    await this._typeLine("\u2500".repeat(54));
    await this._typeLine("");
    await this._delay(400);

    await this._typeLine("  Decedent:  Maya Chen, 34");
    await this._typeLine("  Time:      6:47 AM, pronounced 7:23 AM");
    await this._typeLine("  Cause:     Pedestrian vs. vehicle collision");
    await this._typeLine("  Location:  Mission Street near 24th");
    await this._typeLine("  Hospital:  SF General, Trauma Unit");
    await this._typeLine("");
    await this._delay(400);

    await this._typeLine("  Phone recovered at scene. Unlocked.");
    await this._typeLine(`  Battery: ${this.battery}%`);
    await this._typeLine("  Last activity: Weather app, 6:44 AM");
    await this._typeLine("  She was checking if it would rain.");
    await this._typeLine("");
    await this._delay(600);

    await this._typeLine("\u2500".repeat(54));
    await this._typeLine("");
    await this._typeLine("You have been assigned as notification officer.");
    await this._typeLine("Your job: contact next of kin. Inform them of the death.");
    await this._typeLine("You have the phone. You have the contacts.");
    await this._typeLine("You have limited time and limited battery.");
    await this._typeLine("");
    await this._delay(400);

    await this._typeLine("Read the text threads. Learn who matters to whom.");
    await this._typeLine("Then call them. Decide what to say.");
    await this._typeLine("Decide what not to say.");
    await this._typeLine("");
    await this._delay(600);

    await this._typeLine("WARNINGS:");
    await this._typeLine("  \u2022 Each action drains battery.");
    await this._typeLine("  \u2022 Each second, someone who doesn't know is waiting.");
    await this._typeLine("  \u2022 Notified contacts may call others before you can.");
    await this._typeLine("  \u2022 You are reading messages you were never meant to see.");
    await this._typeLine("");
    await this._delay(400);

    await this._typeLine("\u2500".repeat(54));
    await this._typeLine("");

    this._promptContinue(() => {
      this._startDiscoveryPhase();
    }, "Press ENTER to access Maya Chen's phone");
  }

  // ── Discovery phase ────────────────────────────

  async _startDiscoveryPhase() {
    this.phase = "discovery";
    this.lastTick = Date.now();

    await this._typeLine("");
    await this._typeLine("\u2550".repeat(54));
    await this._typeLine("  PHASE 1: CONTACT DISCOVERY");
    await this._typeLine("\u2550".repeat(54));
    await this._typeLine("");
    await this._typeLine("Maya's phone is in your hands.");
    await this._typeLine("The contacts list is below. Read their messages to");
    await this._typeLine("understand who they are to each other.");
    await this._typeLine("");
    await this._typeLine("Type a number to read that contact's messages.");
    await this._typeLine("Type CALL to begin notifying people.");
    await this._typeLine("Type STATUS to see phone battery and time.");
    await this._typeLine("Type HELP for available commands.");
    await this._typeLine("");

    this._startGameLoop();
    this._showContactList();
  }

  _showContactList() {
    this._queueOutput("");
    this._queueOutput("\u2500".repeat(54));
    this._queueOutput("CONTACTS:");
    this._queueOutput("");

    const contacts = Object.values(CONTACTS);
    contacts.forEach((contact, i) => {
      const state = this.graph.getContactState(contact.id);
      const readPages = this.readThreads[contact.id] || 0;
      const totalPages = TEXT_THREADS[contact.id]?.pages.length || 0;
      const unread = totalPages - readPages;

      let status = "";
      if (state.alreadyKnows) {
        status = state.notifiedBy === "player"
          ? " [NOTIFIED]"
          : ` [KNOWS \u2014 via ${CONTACTS[state.notifiedBy]?.name || state.notifiedBy}]`;
      } else if (unread > 0) {
        status = ` [${unread} message${unread > 1 ? 's' : ''} unread]`;
      } else if (totalPages > 0) {
        status = " [all read]";
      }

      const groupLabel = contact.group.padEnd(8);
      const nameStr = contact.phone.padEnd(22);

      this._queueOutput(`  ${String(i + 1).padStart(2)}. [${groupLabel}] ${nameStr}${status}`);
    });

    this._queueOutput("");
    this._queueOutput("\u2500".repeat(54));
    this._queueOutput(`  Battery: ${this.battery.toFixed(1)}%    Time: ${this._formatTime(this.gameTime)}`);
    this._queueOutput("");

    this._flushOutput();
  }

  // ── Game loop ──────────────────────────────────

  _startGameLoop() {
    this.lastTick = Date.now();

    const tick = () => {
      if (!this.running || this.paused || this.gameOver) return;

      const now = Date.now();
      const dt = (now - this.lastTick) / 1000;
      this.lastTick = now;

      this.gameTime += dt;
      this.battery -= GAME_CONFIG.batteryDrain.idle * (dt / 60);

      this._processCascades();
      this._checkBatteryWarnings();

      if (this.battery <= 0) {
        this.battery = 0;
        this._handleBatteryDeath();
        return;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  _processCascades() {
    const cascades = this.graph.processCascades(this.gameTime);

    for (const cascade of cascades) {
      this._queueOutput("");
      this._queueOutput("\u26A0 CASCADE NOTIFICATION \u26A0");
      this._queueOutput(`${cascade.message}`);
      this._queueOutput("");
      this._flushOutput();

      this.actionLog.push({
        type: "cascade",
        time: this.gameTime,
        data: cascade
      });
    }
  }

  _checkBatteryWarnings() {
    const thresholds = [
      { limit: 20, key: "twenty", msg: "The phone is dying." },
      { limit: 15, key: "fifteen", msg: "Hurry." },
      { limit: 10, key: "ten", msg: "You're running out of time." },
      { limit: 5, key: "five", msg: "Critical. Make every second count." }
    ];

    for (const { limit, key, msg } of thresholds) {
      if (this.battery <= limit && !this.batteryWarnings[key]) {
        this.batteryWarnings[key] = true;
        this._queueOutput(`[ Battery: ${this.battery.toFixed(1)}% \u2014 ${msg} ]`);
        this._flushOutput();
      }
    }

    const warnings = this.graph.getCascadeWarnings(this.gameTime);
    for (const warning of warnings) {
      if (warning.urgency === "critical" &&
          !this.cascadeWarnings.includes(warning.to + warning.from)) {
        this.cascadeWarnings.push(warning.to + warning.from);
        this._queueOutput(
          `[ WARNING: ${warning.from} is about to call ${warning.to}. (${warning.secondsRemaining}s) ]`
        );
        this._flushOutput();
      }
    }
  }

  // ── Battery death ──────────────────────────────

  async _handleBatteryDeath() {
    this.gameOver = true;
    this.running = false;

    await this._typeLine("");
    await this._typeLine("\u2500".repeat(54));
    await this._typeLine("");
    await this._typeLine("The phone dies in your hand.");
    await this._typeLine("The screen flickers once, twice, then goes dark.");
    await this._typeLine("Whatever you didn't say is gone forever.");
    await this._typeLine("");
    await this._delay(1500);

    this._startFallout();
  }

  // ── Input handling ─────────────────────────────

  handleInput(input) {
    if (this.gameOver && this.phase !== "fallout") return;

    const trimmed = input.trim().toLowerCase();

    if (this.inputCallback) {
      const cb = this.inputCallback;
      this.inputCallback = null;
      cb(input.trim());
      return;
    }

    if (this.phase === "discovery" || this.phase === "notification") {
      this._handleMainCommand(trimmed);
    } else if (this.phase === "fallout") {
      if (trimmed === "restart" || trimmed === "new game") {
        this._restart();
      }
    }
  }

  _handleMainCommand(cmd) {
    const contactIds = Object.keys(CONTACTS);

    const num = parseInt(cmd);
    if (!isNaN(num) && num >= 1 && num <= contactIds.length) {
      this._readContactThread(contactIds[num - 1]);
      return;
    }

    switch (cmd) {
      case "call":
        this._startCallSequence();
        break;
      case "status":
        this._showStatus();
        break;
      case "contacts":
        this._showContactList();
        this._showPrompt();
        break;
      case "help":
        this._showHelp();
        break;
      case "done":
      case "end":
        this._confirmEndPhase();
        break;
      default:
        this._queueOutput(`Unknown command: "${cmd}". Type HELP for available commands.`);
        this._flushOutput();
        this._showPrompt();
        break;
    }
  }

  // ── Reading threads ────────────────────────────

  async _readContactThread(contactId) {
    const contact = CONTACTS[contactId];
    const thread = TEXT_THREADS[contactId];

    if (!thread) {
      this._queueOutput(`No messages with ${contact.phone}.`);
      this._flushOutput();
      this._showPrompt();
      return;
    }

    if (!this.readThreads[contactId]) {
      this.readThreads[contactId] = 0;
    }

    const currentPage = this.readThreads[contactId];
    const totalPages = thread.pages.length;

    if (currentPage >= totalPages) {
      this._queueOutput(`No more messages with ${contact.phone}.`);
      this._queueOutput("You've read everything.");
      this._flushOutput();
      this._showPrompt();
      return;
    }

    const cost = currentPage === 0
      ? GAME_CONFIG.batteryDrain.readText
      : GAME_CONFIG.batteryDrain.readPage;
    this.battery -= cost;

    if (this.battery <= 0) {
      this.battery = 0;
      this._handleBatteryDeath();
      return;
    }

    const page = thread.pages[currentPage];

    this._queueOutput("");
    this._queueOutput("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557");
    this._queueOutput(`\u2551  Messages with ${thread.title.padEnd(39).substring(0, 39)}\u2551`);
    this._queueOutput(`\u2551  Page ${String(currentPage + 1).padEnd(3)} of ${String(totalPages).padEnd(3)}                                    \u2551`);
    this._queueOutput("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D");
    this._queueOutput("");

    for (const msg of page.messages) {
      const sender = msg.from === "maya" ? "Maya" : contact.phone;
      const prefix = msg.from === "maya" ? "\u2192 " : "\u2190 ";
      this._queueOutput(`  ${prefix}${sender} (${msg.time}, ${msg.date})`);
      this._queueOutput(`    ${msg.text}`);
      this._queueOutput("");
    }

    const reveals = this.graph.processThreadRead(contactId, currentPage + 1);
    if (reveals.length > 0) {
      this._queueOutput("  \u2500\u2500\u2500 NEW CONNECTION DISCOVERED \u2500\u2500\u2500");
      for (const edge of reveals) {
        this._queueOutput(`  ${edge.label}`);
      }
      this._queueOutput("");
    }

    this.readThreads[contactId]++;
    this._queueOutput(`  Battery: ${this.battery.toFixed(1)}%    Time: ${this._formatTime(this.gameTime)}`);
    this._queueOutput("");
    this._flushOutput();
    this._showPrompt();
  }

  // ── Call sequence ──────────────────────────────

  _startCallSequence() {
    const contactIds = Object.keys(CONTACTS);

    this._queueOutput("");
    this._queueOutput("\u2500".repeat(54));
    this._queueOutput("CALL \u2014 Who do you want to notify?");
    this._queueOutput("");

    contactIds.forEach((id, i) => {
      const state = this.graph.getContactState(id);
      const contact = CONTACTS[id];

      if (state.alreadyKnows) {
        const note = state.notifiedBy === "player"
          ? "(already notified by you)"
          : `(already knows \u2014 via ${CONTACTS[state.notifiedBy]?.name || state.notifiedBy})`;
        this._queueOutput(`  ${String(i + 1).padStart(2)}. ${contact.phone.padEnd(22)} ${note}`);
      } else {
        this._queueOutput(`  ${String(i + 1).padStart(2)}. ${contact.phone.padEnd(22)} [available]`);
      }
    });

    this._queueOutput("");
    this._queueOutput("Type a number to call, or CANCEL to go back.");
    this._queueOutput("");
    this._flushOutput();

    this._promptInput((response) => {
      const trimmed = response.trim().toLowerCase();

      if (trimmed === "cancel" || trimmed === "c" || trimmed === "back") {
        this._queueOutput("Call cancelled.");
        this._queueOutput("");
        this._flushOutput();
        this._showPrompt();
        return;
      }

      const num = parseInt(trimmed);
      if (isNaN(num) || num < 1 || num > contactIds.length) {
        this._queueOutput("Invalid selection. Call cancelled.");
        this._queueOutput("");
        this._flushOutput();
        this._showPrompt();
        return;
      }

      const contactId = contactIds[num - 1];
      const state = this.graph.getContactState(contactId);

      if (state.alreadyKnows) {
        this._queueOutput(`${CONTACTS[contactId].phone} already knows.`);
        this._queueOutput("");
        this._flushOutput();
        this._showPrompt();
        return;
      }

      this._selectCallDetail(contactId);
    });
  }

  _selectCallDetail(contactId) {
    const contact = CONTACTS[contactId];

    this._queueOutput("");
    this._queueOutput("\u2500".repeat(54));
    this._queueOutput(`Calling ${contact.phone}...`);
    this._queueOutput("");
    this._queueOutput("How do you deliver the news?");
    this._queueOutput("");
    this._queueOutput(`  1. BRIEF   \u2014 "Maya has been in an accident. She didn't make it."`);
    this._queueOutput(`     (Quick. Battery cost: ${GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callBrief}%)`);
    this._queueOutput("");
    this._queueOutput(`  2. GENTLE  \u2014 Prepare them before delivering the news.`);
    this._queueOutput(`     (Takes time. Battery cost: ${GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callGentle}%)`);
    this._queueOutput("");
    this._queueOutput(`  3. FULL    \u2014 Tell them everything you know about what happened.`);
    this._queueOutput(`     (Complete but draining. Battery cost: ${GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callFull}%)`);
    this._queueOutput("");
    this._queueOutput("Type 1, 2, or 3. Or CANCEL to hang up.");
    this._queueOutput("");
    this._flushOutput();

    this._promptInput((response) => {
      const trimmed = response.trim().toLowerCase();

      if (trimmed === "cancel" || trimmed === "c" || trimmed === "back") {
        this._queueOutput("You hang up before it rings.");
        this._queueOutput("");
        this._flushOutput();
        this._showPrompt();
        return;
      }

      const choice = parseInt(trimmed);
      let detail, batteryCost;

      if (choice === 1) {
        detail = "brief";
        batteryCost = GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callBrief;
      } else if (choice === 2) {
        detail = "gentle";
        batteryCost = GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callGentle;
      } else if (choice === 3) {
        detail = "full";
        batteryCost = GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callFull;
      } else {
        this._queueOutput("Invalid choice. You hang up.");
        this._queueOutput("");
        this._flushOutput();
        this._showPrompt();
        return;
      }

      this._executeNotification(contactId, detail, batteryCost);
    });
  }

  async _executeNotification(contactId, detail, batteryCost) {
    const contact = CONTACTS[contactId];

    this.battery -= batteryCost;

    if (this.battery <= 0) {
      this.battery = 0;
      this._queueOutput("");
      this._queueOutput("The phone dies mid-call.");
      this._queueOutput("You hear the start of something terrible.");
      this._queueOutput("Then silence.");
      this._queueOutput("");
      this._flushOutput();
      await this._delay(2000);
      this._handleBatteryDeath();
      return;
    }

    const response = this.graph.recordNotification(contactId, detail, this.gameTime);

    this.notificationHistory.push({
      contactId: contactId,
      detail: detail,
      time: this.gameTime,
      battery: this.battery
    });

    this._queueOutput("");
    this._queueOutput("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557");
    this._queueOutput(`\u2551  CALL WITH ${contact.phone.padEnd(38).substring(0, 38)}\u2551`);
    this._queueOutput("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D");
    this._queueOutput("");

    for (const line of response) {
      this._queueOutput(`  ${line}`);
    }

    this._queueOutput("");
    this._queueOutput(`  Battery: ${this.battery.toFixed(1)}%    Time: ${this._formatTime(this.gameTime)}`);
    this._queueOutput("");

    const followup = NOTIFICATION_RESPONSES[contactId]?.followup;
    if (followup && (detail === "gentle" || detail === "full")) {
      this._queueOutput("  They ask:");
      for (const q of followup.questions) {
        this._queueOutput(`  ${q}`);
      }
      this._queueOutput("");
    }

    this._flushOutput();
    await this._delay(500);

    if (this.phase === "discovery") {
      this.phase = "notification";
      this._queueOutput("[ Phase transition: NOTIFICATION. You've begun the calls. ]");
      this._queueOutput("[ Type CONTACTS to see who's left. Type DONE when finished. ]");
      this._queueOutput("");
      this._flushOutput();
    }

    this._showPrompt();
  }

  // ── Status / Help ──────────────────────────────

  _showStatus() {
    const notifiedCount = this.notificationHistory.length;
    const totalContacts = Object.keys(CONTACTS).length;
    const reachedCount = Object.values(this.graph.nodes).filter(n => n.alreadyKnows).length;
    const secretsCount = Object.keys(this.graph.secretsRevealed).length;

    this._queueOutput("");
    this._queueOutput("\u2500".repeat(54));
    this._queueOutput("STATUS:");
    this._queueOutput(`  Battery:      ${this.battery.toFixed(1)}%`);
    this._queueOutput(`  Elapsed:      ${this._formatTime(this.gameTime)}`);
    this._queueOutput(`  Notified:     ${notifiedCount} by you, ${reachedCount} total`);
    this._queueOutput(`  Remaining:    ${totalContacts - reachedCount} contacts`);
    this._queueOutput(`  Phase:        ${this.phase.toUpperCase()}`);
    this._queueOutput(`  Discovered:   ${secretsCount} relationship${secretsCount !== 1 ? 's' : ''}`);

    const warnings = this.graph.getCascadeWarnings(this.gameTime);
    if (warnings.length > 0) {
      this._queueOutput("");
      this._queueOutput("  PENDING CASCADES:");
      for (const w of warnings) {
        this._queueOutput(`    ${w.from} \u2192 ${w.to} (${w.secondsRemaining}s)`);
      }
    }

    this._queueOutput("\u2500".repeat(54));
    this._queueOutput("");
    this._flushOutput();
    this._showPrompt();
  }

  _showHelp() {
    this._queueOutput("");
    this._queueOutput("\u2500".repeat(54));
    this._queueOutput("AVAILABLE COMMANDS:");
    this._queueOutput("");
    this._queueOutput("  [number]  Read that contact's text messages");
    this._queueOutput("  CALL      Begin notifying a contact");
    this._queueOutput("  CONTACTS  Show the contact list");
    this._queueOutput("  STATUS    Show battery, time, and progress");
    this._queueOutput("  DONE      End notification phase (if enough notified)");
    this._queueOutput("  HELP      Show this message");
    this._queueOutput("");
    this._queueOutput("TIPS:");
    this._queueOutput("  \u2022 Reading messages reveals hidden relationships");
    this._queueOutput("  \u2022 Notified contacts may call others before you can");
    this._queueOutput("  \u2022 Order matters \u2014 who hears first and from whom");
    this._queueOutput("  \u2022 The phone battery drains with every action");
    this._queueOutput("\u2500".repeat(54));
    this._queueOutput("");
    this._flushOutput();
    this._showPrompt();
  }

  // ── Ending ─────────────────────────────────────

  _confirmEndPhase() {
    const reachedCount = Object.values(this.graph.nodes).filter(n => n.alreadyKnows).length;
    const totalContacts = Object.keys(CONTACTS).length;
    const unnotified = totalContacts - reachedCount;

    this._queueOutput("");
    this._queueOutput("\u2500".repeat(54));

    if (unnotified > 0) {
      this._queueOutput(`There are still ${unnotified} contact${unnotified > 1 ? 's' : ''} who don't know.`);
      this._queueOutput("The phone battery won't last forever.");
      this._queueOutput("");
      this._queueOutput("Are you sure you're done? (YES/NO)");
      this._queueOutput("");
      this._flushOutput();

      this._promptInput((response) => {
        if (response.trim().toLowerCase() === "yes") {
          this._endGame();
        } else {
          this._queueOutput("Continuing...");
          this._queueOutput("");
          this._flushOutput();
          this._showPrompt();
        }
      });
    } else {
      this._queueOutput("All contacts have been notified.");
      this._queueOutput("");
      this._flushOutput();
      this._endGame();
    }
  }

  _endGame() {
    this.gameOver = true;
    this.running = false;

    this._queueOutput("");
    this._queueOutput("\u2500".repeat(54));
    this._queueOutput("");
    this._flushOutput();

    this._startFallout();
  }

  // ── Fallout phase ──────────────────────────────

  async _startFallout() {
    this.phase = "fallout";
    this.gameOver = true;
    this.running = false;

    await this._delay(1500);

    await this._typeLine("");
    await this._typeLine("\u2550".repeat(54));
    await this._typeLine("  PHASE 3: FALLOUT");
    await this._typeLine("\u2550".repeat(54));
    await this._typeLine("");
    await this._delay(1000);

    await this._typeLine("The calls are over.");
    await this._typeLine("The phone is dark or dying.");
    await this._typeLine("Everyone who will know, knows.");
    await this._typeLine("Everyone who doesn't, doesn't.");
    await this._typeLine("");
    await this._delay(1000);

    await this._typeLine("This is what you did.");
    await this._typeLine("");
    await this._delay(1500);

    const report = this.graph.generateFinalReport();

    for (const line of report.narrative) {
      await this._typeLine(line);
    }

    await this._delay(1000);
    await this._typeLine("");
    await this._typeLine("Type RESTART to begin again.");
    await this._typeLine("");

    this._promptInput((response) => {
      if (response.trim().toLowerCase() === "restart") {
        this._restart();
      }
    });
  }

  // ── Restart ────────────────────────────────────

  _restart() {
    this.graph.reset();

    this.battery = GAME_CONFIG.startingBattery;
    this.gameTime = 0;
    this.phase = "boot";
    this.running = false;
    this.paused = false;
    this.gameOver = false;
    this.lastTick = null;

    this.readThreads = {};
    this.notificationQueue = [];
    this.inCall = false;
    this.currentCallContact = null;

    this.outputBuffer = [];

    this.actionLog = [];
    this.notificationHistory = [];

    this.phaseWarningShown = false;
    this.batteryWarnings = { twenty: false, fifteen: false, ten: false, five: false };
    this.cascadeWarnings = [];

    this.inputCallback = null;

    this.container.innerHTML = "";
    this.start();
  }

  // ── Terminal output ────────────────────────────

  async _typeLine(text, speed) {
    speed = speed || this.typewriterSpeed;

    return new Promise((resolve) => {
      const lineEl = document.createElement("div");
      lineEl.className = "terminal-line";
      this.container.appendChild(lineEl);

      let i = 0;
      const type = () => {
        if (i < text.length) {
          lineEl.textContent += text[i];
          i++;
          this._scrollToBottom();
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };
      type();
    });
  }

  _queueOutput(text) {
    this.outputBuffer.push(text);
  }

  _flushOutput() {
    for (const text of this.outputBuffer) {
      const lineEl = document.createElement("div");
      lineEl.className = "terminal-line";
      lineEl.textContent = text;
      this.container.appendChild(lineEl);
    }
    this.outputBuffer = [];
    this._scrollToBottom();
  }

  _showPrompt() {
    const existingPrompt = this.container.querySelector(".terminal-prompt-container");
    if (existingPrompt) existingPrompt.remove();

    const container = document.createElement("div");
    container.className = "terminal-prompt-container";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.marginTop = "4px";

    const promptSpan = document.createElement("span");
    promptSpan.textContent = "> ";
    promptSpan.style.color = "#666";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";
    input.style.backgroundColor = "transparent";
    input.style.color = "#c8c8c8";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.fontFamily = "inherit";
    input.style.fontSize = "inherit";
    input.style.flex = "1";
    input.style.caretColor = "#c8c8c8";
    input.style.padding = "0";
    input.style.margin = "0";
    input.autofocus = true;

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const value = input.value;
        const responseLine = document.createElement("div");
        responseLine.className = "terminal-line";
        responseLine.textContent = `> ${value}`;
        responseLine.style.color = "#666";
        container.replaceWith(responseLine);
        this.handleInput(value);
      }
    });

    container.appendChild(promptSpan);
    container.appendChild(input);
    this.container.appendChild(container);

    input.focus();
    this._scrollToBottom();
  }

  _promptInput(callback) {
    this.inputCallback = callback;
    this._showPrompt();
  }

  _promptContinue(callback, message) {
    message = message || "Press ENTER to continue";

    const container = document.createElement("div");
    container.className = "terminal-prompt-container";
    container.style.marginTop = "8px";

    const promptSpan = document.createElement("span");
    promptSpan.className = "blink-prompt";
    promptSpan.textContent = `[ ${message} ]`;
    promptSpan.style.color = "#555";

    let visible = true;
    const blink = setInterval(() => {
      visible = !visible;
      promptSpan.style.opacity = visible ? "1" : "0";
    }, 700);

    container.appendChild(promptSpan);
    this.container.appendChild(container);
    this._scrollToBottom();

    const handler = (e) => {
      if (e.key === "Enter") {
        clearInterval(blink);
        container.remove();
        document.removeEventListener("keydown", handler);
        callback();
      }
    };

    document.addEventListener("keydown", handler);
  }

  // ── Utilities ──────────────────────────────────

  _formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }
}

// ── Initialization ───────────────────────────────

let game;

window.addEventListener('DOMContentLoaded', () => {
  game = new NextOfKinSimulator('terminal');
  game.start();
});
