/**
 * THE ROUTING TABLE — Game Controller
 *
 * State machine, routing logic, scoring, and narrative tracking.
 * Emits events for the UI layer to render.
 */
var Game = (function() {

  // ── Constants ─────────────────────────────────────
  var STATE = {
    BOOT:             'boot',
    BRIEFING:         'briefing',
    ACTIVE_SHIFT:     'active_shift',
    SHIFT_SUMMARY:    'shift_summary',
    PERSONAL_MESSAGE: 'personal_message',
    FINAL_CHOICE:     'final_choice',
    ENDGAME:          'endgame'
  };

  var ROUTE = {
    ALPHA: 'alpha',   // CORP-GOV — military/diplomatic
    BETA:  'beta',    // CIVILIAN — residential
    GAMMA: 'gamma',   // MEDICAL — emergency
    DROP:  'drop'     // Discard / buffer overflow
  };

  var SHIFT_CONFIG = [
    {
      shift: 1,
      outputSlots: 3,
      label: 'SHIFT 1 — 2300-0700',
      briefing: 'First night shift. Network load is moderate. Route packets to output channels — military/diplomatic to ALPHA, civilian to BETA, medical to GAMMA. Anything you cannot carry, drop to the buffer. Maintain efficiency above 60%. Good luck, operator.'
    },
    {
      shift: 2,
      outputSlots: 3,
      label: 'SHIFT 2 — 2300-0700',
      briefing: 'Traffic increasing. New priority directives from Corp-Gov: military traffic takes precedence. Bandwidth allocation unchanged. Route wisely.'
    },
    {
      shift: 3,
      outputSlots: 2,
      label: 'SHIFT 3 — 2300-0700',
      briefing: 'Bandwidth reduction — trunk line degradation. Output slots reduced to 2. Triage accordingly. Efficiency targets remain.'
    },
    {
      shift: 4,
      outputSlots: 2,
      label: 'SHIFT 4 — 2300-0700',
      briefing: 'Multiple routing conflicts detected. Priority queues backing up. Maintain operational parameters with reduced capacity.'
    },
    {
      shift: 5,
      outputSlots: 2,
      label: 'SHIFT 5 — 2300-0700',
      briefing: 'Network fragmentation accelerating. Civilian routes degraded. Medical and military channels competing for same trunk. Prioritize.'
    },
    {
      shift: 6,
      outputSlots: 1,
      label: 'SHIFT 6 — 2300-0700',
      briefing: 'Critical bandwidth shortage. Single output slot operational. Emergency routing protocols in effect. All decisions are final.'
    },
    {
      shift: 7,
      outputSlots: 1,
      label: 'SHIFT 7 — FINAL',
      briefing: 'Last shift. One output slot remains. Two packets in queue. Choose.'
    }
  ];

  // ── Internal State ────────────────────────────────
  var state = {
    currentState:     STATE.BOOT,
    currentShift:     0,
    packets:          [],
    routedPackets:    [],
    droppedPackets:   [],
    outputSlotsUsed:  0,
    outputSlotsMax:   3,
    score:            0,
    totalRouted:      0,
    totalDropped:     0,
    efficiency:       0,

    // Narrative tracking
    loveLetterFragmentsRouted: [],
    loveLetterFragmentsDropped: [],
    distressRouted:    0,
    distressDropped:   0,
    medicalRouted:     0,
    medicalDropped:    0,
    journalistRouted:  0,
    journalistDropped: 0,
    civilianRouted:    0,
    civilianDropped:   0,
    militaryRouted:    0,

    // Per-sender tracking for personal message selection
    senderActions:     {},

    // Final choice
    finalChoice:       null,

    // Message history
    personalMessagesReceived: []
  };

  // ── Event System ──────────────────────────────────
  var listeners = {};

  function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }

  function off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(function(cb) {
      return cb !== callback;
    });
  }

  function emit(event, data) {
    if (!listeners[event]) return;
    var i;
    for (i = 0; i < listeners[event].length; i++) {
      try {
        listeners[event][i](data || {});
      } catch (e) {
        console.error('Event error [' + event + ']:', e);
      }
    }
  }

  // ── Initialization ────────────────────────────────
  function init() {
    _resetState();
    state.currentState = STATE.BOOT;
    emit('game:init', { state: getPublicState() });
  }

  function _resetState() {
    state.currentShift = 0;
    state.packets = [];
    state.routedPackets = [];
    state.droppedPackets = [];
    state.outputSlotsUsed = 0;
    state.outputSlotsMax = 3;
    state.score = 0;
    state.totalRouted = 0;
    state.totalDropped = 0;
    state.efficiency = 0;
    state.loveLetterFragmentsRouted = [];
    state.loveLetterFragmentsDropped = [];
    state.distressRouted = 0;
    state.distressDropped = 0;
    state.medicalRouted = 0;
    state.medicalDropped = 0;
    state.journalistRouted = 0;
    state.journalistDropped = 0;
    state.civilianRouted = 0;
    state.civilianDropped = 0;
    state.militaryRouted = 0;
    state.senderActions = {};
    state.finalChoice = null;
    state.personalMessagesReceived = [];
  }

  // ── State Machine ─────────────────────────────────

  function startGame() {
    _resetState();
    _startShift(1);
  }

  function _startShift(shiftNumber) {
    if (shiftNumber < 1 || shiftNumber > 7) return;

    state.currentShift = shiftNumber;
    var config = SHIFT_CONFIG[shiftNumber - 1];
    state.outputSlotsMax = config.outputSlots;
    state.outputSlotsUsed = 0;
    state.packets = PacketData.getShiftPackets(shiftNumber);
    state.routedPackets = [];
    state.droppedPackets = [];

    state.currentState = STATE.BRIEFING;

    emit('shift:start', {
      shift: shiftNumber,
      config: config,
      packets: state.packets,
      outputSlotsMax: state.outputSlotsMax,
      state: getPublicState()
    });
  }

  function acceptBriefing() {
    if (state.currentState !== STATE.BRIEFING) return;

    if (state.currentShift === 7) {
      state.currentState = STATE.FINAL_CHOICE;
      emit('final:choice', {
        packets: state.packets,
        state: getPublicState()
      });
    } else {
      state.currentState = STATE.ACTIVE_SHIFT;
      emit('shift:active', {
        packets: state.packets,
        outputSlotsMax: state.outputSlotsMax,
        outputSlotsUsed: state.outputSlotsUsed,
        state: getPublicState()
      });
    }
  }

  // ── Packet Routing ────────────────────────────────

  function routePacket(packetId, route) {
    if (state.currentState !== STATE.ACTIVE_SHIFT &&
        state.currentState !== STATE.FINAL_CHOICE) {
      return false;
    }

    var packet = _findPacket(packetId);
    if (!packet || packet._processed) return false;

    packet._processed = true;

    if (route === ROUTE.DROP) {
      _handleDrop(packet);
    } else {
      // Check output capacity (final choice always allows one route)
      if (state.currentState !== STATE.FINAL_CHOICE &&
          state.outputSlotsUsed >= state.outputSlotsMax) {
        _handleDrop(packet);
        emit('packet:overflow', { packet: packet });
        return true;
      }
      _handleRoute(packet, route);
    }

    // Check shift completion
    if (_isShiftComplete()) {
      _completeShift();
    } else {
      emit('packet:queueUpdate', {
        remaining: _getRemainingPackets().length,
        outputSlotsMax: state.outputSlotsMax,
        outputSlotsUsed: state.outputSlotsUsed,
        state: getPublicState()
      });
    }

    return true;
  }

  function _handleRoute(packet, route) {
    packet._route = route;
    state.routedPackets.push(packet);
    state.outputSlotsUsed++;
    state.totalRouted++;

    // Calculate score
    var catInfo = PacketData.CATEGORIES[packet.category];
    var points = catInfo ? catInfo.baseScore : 1;
    points += _getRouteBonus(packet, route);
    state.score += points;

    // Track narrative categories
    _trackRouted(packet);
    _trackSender(packet.senderId, 'routed');

    emit('packet:routed', {
      packet: packet,
      route: route,
      points: points,
      outputSlotsUsed: state.outputSlotsUsed,
      outputSlotsMax: state.outputSlotsMax,
      state: getPublicState()
    });
  }

  function _handleDrop(packet) {
    packet._route = ROUTE.DROP;
    state.droppedPackets.push(packet);
    state.totalDropped++;

    _trackDropped(packet);
    _trackSender(packet.senderId, 'dropped');

    emit('packet:dropped', {
      packet: packet,
      state: getPublicState()
    });
  }

  function _getRouteBonus(packet, route) {
    var cat = packet.category;
    if (route === ROUTE.ALPHA && (cat === 'MILITARY' || cat === 'DIPLOMATIC')) return 3;
    if (route === ROUTE.BETA  && (cat === 'CIVILIAN' || cat === 'JOURNALIST')) return 1;
    if (route === ROUTE.GAMMA && cat === 'MEDICAL') return 3;
    if (route === ROUTE.ALPHA && cat !== 'MILITARY' && cat !== 'DIPLOMATIC') return -1;
    if (route === ROUTE.GAMMA && cat !== 'MEDICAL') return -1;
    return 0;
  }

  // ── Final Choice ──────────────────────────────────

  function makeFinalChoice(choiceType) {
    if (state.currentState !== STATE.FINAL_CHOICE) return false;
    if (choiceType !== 'distress' && choiceType !== 'loveLetter') return false;

    state.finalChoice = choiceType;

    var chosenPacket = null;
    var droppedPacket = null;
    var i, p;

    for (i = 0; i < state.packets.length; i++) {
      p = state.packets[i];
      if (choiceType === 'distress' && p.isDistress && p.isFinal) chosenPacket = p;
      if (choiceType === 'distress' && p.isLoveLetter && p.isFinal) droppedPacket = p;
      if (choiceType === 'loveLetter' && p.isLoveLetter && p.isFinal) chosenPacket = p;
      if (choiceType === 'loveLetter' && p.isDistress && p.isFinal) droppedPacket = p;
    }

    if (chosenPacket) _handleRoute(chosenPacket, ROUTE.BETA);
    if (droppedPacket) _handleDrop(droppedPacket);

    emit('final:chosen', {
      choice: choiceType,
      chosen: chosenPacket,
      dropped: droppedPacket,
      state: getPublicState()
    });

    // Transition to endgame after a beat
    setTimeout(function() {
      state.currentState = STATE.ENDGAME;
      emit('game:end', {
        state: getPublicState(),
        summary: getGameSummary()
      });
    }, 3000);

    return true;
  }

  // ── Shift Completion & Transitions ────────────────

  function _isShiftComplete() {
    var i;
    for (i = 0; i < state.packets.length; i++) {
      if (!state.packets[i]._processed) return false;
    }
    return true;
  }

  function _getRemainingPackets() {
    var remaining = [];
    var i;
    for (i = 0; i < state.packets.length; i++) {
      if (!state.packets[i]._processed) remaining.push(state.packets[i]);
    }
    return remaining;
  }

  function _completeShift() {
    state.efficiency = _calculateEfficiency();
    state.currentState = STATE.SHIFT_SUMMARY;

    emit('shift:complete', {
      shift: state.currentShift,
      efficiency: state.efficiency,
      score: state.score,
      routedCount: state.routedPackets.length,
      droppedCount: state.droppedPackets.length,
      state: getPublicState()
    });
  }

  function advanceFromSummary() {
    if (state.currentState !== STATE.SHIFT_SUMMARY) return;

    var message = _selectPersonalMessage(state.currentShift);
    if (message) {
      state.currentState = STATE.PERSONAL_MESSAGE;
      state.personalMessagesReceived.push({
        shift: state.currentShift,
        message: message
      });
      emit('personal:message', {
        shift: state.currentShift,
        message: message,
        state: getPublicState()
      });
    } else {
      // No message available — advance directly
      _advanceToNextShift();
    }
  }

  function advanceFromPersonalMessage() {
    if (state.currentState !== STATE.PERSONAL_MESSAGE) return;
    _advanceToNextShift();
  }

  function _advanceToNextShift() {
    var next = state.currentShift + 1;
    if (next <= 7) {
      _startShift(next);
    } else {
      state.currentState = STATE.ENDGAME;
      emit('game:end', {
        state: getPublicState(),
        summary: getGameSummary()
      });
    }
  }

  // ── Personal Message Selection ────────────────────
  // Picks the message from the sender the player has most
  // wronged (dropped > routed). Guilt is the prioritization.

  function _selectPersonalMessage(shiftNumber) {
    var key = 'shift' + shiftNumber;
    var messages = PacketData.PERSONAL_MESSAGES[key];
    if (!messages || messages.length === 0) return null;

    var best = null;
    var bestScore = -Infinity;
    var i, msg, score;

    for (i = 0; i < messages.length; i++) {
      msg = messages[i];
      score = _messageRelevance(msg.senderId);
      if (score > bestScore) {
        bestScore = score;
        best = msg;
      }
    }

    return best;
  }

  function _messageRelevance(senderId) {
    var score = 0;
    var actions = state.senderActions[senderId];
    if (actions) {
      score += actions.routed * 2;
      score += actions.dropped * 3;  // Guilt weighs heavier
    }
    // Slight jitter to prevent mechanical feel
    score += Math.random() * 0.5;
    return score;
  }

  // ── Category Tracking ─────────────────────────────

  function _trackRouted(packet) {
    switch (packet.category) {
      case 'MEDICAL':    state.medicalRouted++;    break;
      case 'JOURNALIST': state.journalistRouted++; break;
      case 'CIVILIAN':   state.civilianRouted++;   break;
      case 'MILITARY':
      case 'DIPLOMATIC': state.militaryRouted++;   break;
      case 'DISTRESS':   state.distressRouted++;   break;
      case 'LOVE_LETTER':
        if (packet.fragmentIndex !== undefined) {
          state.loveLetterFragmentsRouted.push(packet.fragmentIndex);
        }
        break;
    }
  }

  function _trackDropped(packet) {
    switch (packet.category) {
      case 'MEDICAL':    state.medicalDropped++;    break;
      case 'JOURNALIST': state.journalistDropped++; break;
      case 'CIVILIAN':   state.civilianDropped++;   break;
      case 'DISTRESS':   state.distressDropped++;   break;
      case 'LOVE_LETTER':
        if (packet.fragmentIndex !== undefined) {
          state.loveLetterFragmentsDropped.push(packet.fragmentIndex);
        }
        break;
    }
  }

  function _trackSender(senderId, action) {
    if (!senderId) return;
    if (!state.senderActions[senderId]) {
      state.senderActions[senderId] = { routed: 0, dropped: 0 };
    }
    state.senderActions[senderId][action]++;
  }

  // ── Scoring ───────────────────────────────────────

  function _calculateEfficiency() {
    if (state.packets.length === 0) return 0;
    return Math.round((state.routedPackets.length / state.packets.length) * 100);
  }

  function getOverallEfficiency() {
    var total = state.totalRouted + state.totalDropped;
    if (total === 0) return 0;
    return Math.round((state.totalRouted / total) * 100);
  }

  // ── Endgame Summary ───────────────────────────────

  function getGameSummary() {
    var loveRouted = state.loveLetterFragmentsRouted.slice().sort();
    var loveDropped = state.loveLetterFragmentsDropped.slice().sort();

    return {
      totalScore:                state.score,
      totalRouted:               state.totalRouted,
      totalDropped:              state.totalDropped,
      overallEfficiency:         getOverallEfficiency(),
      loveLetterFragmentsRouted: loveRouted,
      loveLetterFragmentsDropped: loveDropped,
      loveLetterComplete:        loveRouted.length >= 6,
      distressRouted:            state.distressRouted,
      distressDropped:           state.distressDropped,
      medicalRouted:             state.medicalRouted,
      medicalDropped:            state.medicalDropped,
      journalistRouted:          state.journalistRouted,
      journalistDropped:         state.journalistDropped,
      civilianRouted:            state.civilianRouted,
      civilianDropped:           state.civilianDropped,
      militaryRouted:            state.militaryRouted,
      finalChoice:               state.finalChoice,
      senderActions:             JSON.parse(JSON.stringify(state.senderActions)),
      personalMessagesReceived:  state.personalMessagesReceived.slice()
    };
  }

  // ── Helpers ───────────────────────────────────────

  function _findPacket(id) {
    var i;
    for (i = 0; i < state.packets.length; i++) {
      if (state.packets[i].id === id) return state.packets[i];
    }
    return null;
  }

  function getPublicState() {
    return {
      currentState:              state.currentState,
      currentShift:              state.currentShift,
      outputSlotsUsed:           state.outputSlotsUsed,
      outputSlotsMax:            state.outputSlotsMax,
      score:                     state.score,
      totalRouted:               state.totalRouted,
      totalDropped:              state.totalDropped,
      efficiency:                state.efficiency,
      loveLetterFragmentsRouted: state.loveLetterFragmentsRouted.slice(),
      distressRouted:            state.distressRouted,
      distressDropped:           state.distressDropped,
      medicalRouted:             state.medicalRouted,
      medicalDropped:            state.medicalDropped,
      journalistRouted:          state.journalistRouted,
      journalistDropped:         state.journalistDropped,
      civilianRouted:            state.civilianRouted,
      civilianDropped:           state.civilianDropped,
      militaryRouted:            state.militaryRouted,
      finalChoice:               state.finalChoice,
      totalPacketsInShift:       state.packets.length,
      remainingPackets:          _getRemainingPackets().length
    };
  }

  function getCurrentPackets() {
    return state.packets.slice();
  }

  function getShiftConfig(shiftNumber) {
    if (shiftNumber < 1 || shiftNumber > 7) return null;
    return SHIFT_CONFIG[shiftNumber - 1];
  }

  function canRoute() {
    return state.currentState === STATE.ACTIVE_SHIFT &&
           state.outputSlotsUsed < state.outputSlotsMax;
  }

  function getSlotsRemaining() {
    return state.outputSlotsMax - state.outputSlotsUsed;
  }

  function getReconstructedLoveLetter() {
    if (state.loveLetterFragmentsRouted.length < 6) return null;
    return PacketData.LOVE_LETTER_COMPLETE;
  }

  function getLoveLetterFragmentCount() {
    return state.loveLetterFragmentsRouted.length;
  }

  // ── Public API ────────────────────────────────────
  return {
    STATE: STATE,
    ROUTE: ROUTE,

    init:                       init,
    startGame:                  startGame,
    acceptBriefing:             acceptBriefing,
    routePacket:                routePacket,
    makeFinalChoice:            makeFinalChoice,
    advanceFromSummary:         advanceFromSummary,
    advanceFromPersonalMessage: advanceFromPersonalMessage,

    on:  on,
    off: off,

    getState:                   getPublicState,
    getCurrentPackets:          getCurrentPackets,
    getShiftConfig:             getShiftConfig,
    canRoute:                   canRoute,
    getSlotsRemaining:          getSlotsRemaining,
    getReconstructedLoveLetter: getReconstructedLoveLetter,
    getLoveLetterFragmentCount: getLoveLetterFragmentCount,
    getGameSummary:             getGameSummary,
    getOverallEfficiency:       getOverallEfficiency,
    findPacketById:             _findPacket
  };

})();
