/**
 * Engine — The Appointment
 *
 * Core game loop controller. Manages session state transitions,
 * approach selection, fragment delivery, localStorage persistence,
 * and cross-session case-file continuity.
 *
 * Depends on: Patient (patient.js)
 */

var Engine = (function () {
  'use strict';

  // ==========================================================
  //  CONSTANTS
  // ==========================================================

  var STORAGE_KEY = 'the_appointment_casefile';
  var MAX_FRAGMENTS_PER_SESSION = 10;
  var MIN_FRAGMENTS_BEFORE_END = 4;
  var AUTOSAVE_DEBOUNCE_MS = 500;

  // ==========================================================
  //  ENGINE STATE
  // ==========================================================

  var engineState = {
    initialized: false,
    phase: 'intro',          // intro | active | paused | session_end | case_file | complete
    turnCount: 0,
    lastApproachId: null,
    lastFragmentId: null,
    sessionFragmentLog: [],   // [{fragmentId, approachId, distressBefore, distressAfter}]
    autosaveTimer: null,
    totalSessionsCompleted: 0
  };

  // ==========================================================
  //  CALLBACKS (UI bindings)
  // ==========================================================

  var callbacks = {
    onSessionStart: null,
    onFragmentDelivered: null,
    onApproachUpdate: null,
    onDistressChange: null,
    onSessionEnd: null,
    onCaseFileUpdate: null,
    onError: null,
    onPhaseChange: null
  };

  // ==========================================================
  //  INITIALIZATION
  // ==========================================================

  /**
   * Bootstrap the engine. Attempts to restore a saved case file.
   * @param {Object} uiCallbacks — optional event handlers
   * @returns {Object} initial public state for the UI
   */
  function init(uiCallbacks) {
    if (engineState.initialized) {
      console.warn('Engine already initialized');
      return getPublicState();
    }

    if (uiCallbacks) {
      Object.keys(callbacks).forEach(function (key) {
        if (typeof uiCallbacks[key] === 'function') {
          callbacks[key] = uiCallbacks[key];
        }
      });
    }

    var loaded = loadFromStorage();

    if (loaded) {
      engineState.phase = 'case_file';
      engineState.totalSessionsCompleted = Patient.getState().currentSession - 1;
    } else {
      engineState.phase = 'intro';
    }

    engineState.initialized = true;
    engineState.turnCount = 0;
    engineState.lastFragmentId = null;
    engineState.sessionFragmentLog = [];

    emit('onPhaseChange', { phase: engineState.phase });
    return getPublicState();
  }

  // ==========================================================
  //  SESSION MANAGEMENT
  // ==========================================================

  /**
   * Begin a new therapy session.
   * @returns {Object} session start info
   */
  function beginSession() {
    var patientState = Patient.getState();

    if (patientState.currentSession > 1 || engineState.totalSessionsCompleted > 0) {
      Patient.startNewSession();
    }

    engineState.phase = 'active';
    engineState.turnCount = 0;
    engineState.lastApproachId = null;
    engineState.lastFragmentId = null;
    engineState.sessionFragmentLog = [];

    var availableApproaches = Patient.getAvailableApproaches(null);
    var distressObs = Patient.getDistressObservation();
    var sessionNumber = Patient.getState().currentSession;

    emit('onSessionStart', {
      sessionNumber: sessionNumber,
      availableApproaches: availableApproaches,
      distressObservation: distressObs
    });

    emit('onPhaseChange', { phase: 'active' });

    return {
      sessionNumber: sessionNumber,
      availableApproaches: availableApproaches,
      distressObservation: distressObs,
      isFirstTurn: true
    };
  }

  /**
   * Process the player's chosen therapeutic approach.
   * @param {string} approachId
   * @returns {Object} turn result with fragment and updated state
   */
  function processTurn(approachId) {
    if (engineState.phase !== 'active') {
      emitError('Cannot process turn outside active session');
      return { error: 'Not in active session', success: false };
    }

    var available = Patient.getAvailableApproaches(engineState.lastFragmentId);
    if (available.indexOf(approachId) === -1) {
      emitError('Approach not available: ' + approachId);
      return { error: 'Approach not available', success: false };
    }

    var distressBefore = Patient.getState().distress;
    var result = Patient.respondToApproach(approachId, engineState.lastFragmentId);

    if (!result.fragment || result.sessionShouldEnd) {
      return handleSessionEnd('natural');
    }

    var distressAfter = result.currentDistress;

    engineState.turnCount++;
    engineState.lastApproachId = approachId;
    engineState.lastFragmentId = result.fragment.id;

    engineState.sessionFragmentLog.push({
      fragmentId: result.fragment.id,
      approachId: approachId,
      distressBefore: distressBefore,
      distressAfter: distressAfter,
      turnNumber: engineState.turnCount
    });

    emit('onFragmentDelivered', {
      fragment: result.fragment,
      approach: result.approach,
      distressBefore: distressBefore,
      distressAfter: distressAfter,
      turnNumber: engineState.turnCount,
      observation: Patient.getDistressObservation()
    });

    if (distressBefore !== distressAfter) {
      emit('onDistressChange', {
        from: distressBefore,
        to: distressAfter,
        observation: Patient.getDistressObservation()
      });
    }

    var nextApproaches = Patient.getAvailableApproaches(result.fragment.id);
    emit('onApproachUpdate', { approaches: nextApproaches });

    if (distressAfter >= 10) {
      return handleSessionEnd('crisis');
    }

    var softEnd = checkSoftSessionEnd();
    if (softEnd.shouldEnd && engineState.turnCount >= MIN_FRAGMENTS_BEFORE_END) {
      return handleSessionEnd('natural');
    }

    scheduleAutosave();

    return {
      success: true,
      fragment: result.fragment,
      approach: result.approach,
      distressBefore: distressBefore,
      distressAfter: distressAfter,
      turnNumber: engineState.turnCount,
      availableApproaches: nextApproaches,
      observation: Patient.getDistressObservation(),
      sessionContinuing: true
    };
  }

  /**
   * Probabilistic check — sessions tend to end after 7-10 fragments.
   */
  function checkSoftSessionEnd() {
    var count = Patient.getCurrentSessionFragments().length;

    if (count >= MAX_FRAGMENTS_PER_SESSION) {
      return { shouldEnd: true, reason: 'max_fragments' };
    }

    if (count >= 7) {
      var endChance = (count - 6) * 0.2;
      if (Math.random() < endChance) {
        return { shouldEnd: true, reason: 'natural' };
      }
    }

    return { shouldEnd: false };
  }

  /**
   * End the current session and assemble summary data.
   * @param {string} reason — 'natural' | 'crisis' | 'player_choice'
   */
  function handleSessionEnd(reason) {
    var summary = Patient.endSession();
    engineState.totalSessionsCompleted++;
    engineState.phase = 'session_end';

    var contradictions = Patient.getDiscoveredContradictions();
    var currentSession = Patient.getState().currentSession;

    var newContradictions = contradictions.filter(function (c) {
      var f1 = Patient.getFragment(c.fragment1.id);
      var f2 = Patient.getFragment(c.fragment2.id);
      return f1 && f2 &&
        (f1.firstHeardSession === currentSession ||
         f2.firstHeardSession === currentSession);
    });

    var stats = Patient.getCompletionStats();

    var endData = {
      reason: reason,
      summary: summary,
      contradictions: contradictions,
      newContradictions: newContradictions,
      stats: stats,
      sessionFragmentLog: engineState.sessionFragmentLog.slice(),
      nextSteps: determineNextSteps(reason, stats)
    };

    emit('onSessionEnd', endData);
    emit('onPhaseChange', { phase: 'session_end' });

    saveToStorage();

    return merge({ success: true, sessionEnd: true }, endData);
  }

  /**
   * Player manually terminates the current session.
   */
  function endSessionManually() {
    if (engineState.phase !== 'active') {
      return { error: 'No active session to end', success: false };
    }
    if (engineState.turnCount < 2) {
      return { error: 'Minimum 2 turns before ending session', success: false };
    }
    return handleSessionEnd('player_choice');
  }

  /**
   * Build post-session guidance for the player.
   */
  function determineNextSteps(reason, stats) {
    var steps = [];

    if (reason === 'crisis') {
      steps.push({
        type: 'warning',
        message: 'Session terminated due to patient crisis. Consider approach modifications for next session.'
      });
    }

    if (stats.completionPercent < 30) {
      steps.push({
        type: 'suggestion',
        message: 'The case file is incomplete. Multiple sessions are needed to build a full picture.'
      });
    }

    if (stats.fragmentsLocked > 0) {
      steps.push({
        type: 'info',
        message: stats.fragmentsLocked + ' fragments remain locked. Some require reaching higher distress thresholds in previous sessions.'
      });
    }

    if (stats.contradictionsDiscovered > 0) {
      steps.push({
        type: 'insight',
        message: 'Contradictions detected in patient narrative. Review case file timeline for discrepancies.'
      });
    }

    steps.push({
      type: 'action',
      message: 'You may begin a new session or review the case file.'
    });

    return steps;
  }

  // ==========================================================
  //  CASE FILE ACCESS
  // ==========================================================

  /**
   * Open the case file view with full analytical data.
   */
  function openCaseFile() {
    var timeline = Patient.getTimeline();
    var stats = Patient.getCompletionStats();
    var contradictions = Patient.getDiscoveredContradictions();
    var pursuit = Patient.getPursuitHistory();
    var patientState = Patient.getState();

    var allFragments = Patient.getAllFragments();
    var distressLocked = [];
    allFragments.forEach(function (f) {
      if (!f.heard && f.distressThreshold > patientState.maxDistressEver) {
        distressLocked.push({
          id: f.id,
          theme: f.theme,
          requiredDistress: f.distressThreshold,
          currentMaxDistress: patientState.maxDistressEver
        });
      }
    });

    var pursuitValues = Object.keys(pursuit).map(function (k) { return pursuit[k]; });
    var maxPursuit = Math.max.apply(null, pursuitValues.concat([0]));
    var minPursuit = Math.min.apply(null, pursuitValues.concat([0]));
    var pursuitImbalance = maxPursuit > 0 ? (maxPursuit - minPursuit) / maxPursuit : 0;

    var caseFileData = {
      timeline: timeline,
      stats: stats,
      contradictions: contradictions,
      pursuitProfile: pursuit,
      pursuitImbalance: pursuitImbalance,
      distressLocked: distressLocked,
      totalSessions: patientState.currentSession,
      maxDistressReached: patientState.maxDistressEver,
      canContinue: stats.fragmentsHeard < stats.fragmentsTotal
    };

    emit('onCaseFileUpdate', caseFileData);
    return caseFileData;
  }

  /**
   * Destroy all progress and start fresh.
   */
  function resetCaseFile() {
    Patient.resetCaseFile();

    engineState.phase = 'intro';
    engineState.turnCount = 0;
    engineState.lastApproachId = null;
    engineState.lastFragmentId = null;
    engineState.sessionFragmentLog = [];
    engineState.totalSessionsCompleted = 0;

    clearStorage();

    emit('onPhaseChange', { phase: 'intro' });

    return { reset: true, state: getPublicState() };
  }

  // ==========================================================
  //  PERSISTENCE
  // ==========================================================

  function saveToStorage() {
    try {
      var data = {
        patient: Patient.serialize(),
        engine: {
          phase: engineState.phase,
          turnCount: engineState.turnCount,
          lastApproachId: engineState.lastApproachId,
          lastFragmentId: engineState.lastFragmentId,
          totalSessionsCompleted: engineState.totalSessionsCompleted,
          sessionFragmentLog: engineState.sessionFragmentLog
        },
        savedAt: new Date().toISOString(),
        version: 1
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save:', e);
      return false;
    }
  }

  function loadFromStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      var data = JSON.parse(raw);
      if (!data || data.version !== 1) {
        clearStorage();
        return false;
      }

      if (!Patient.deserialize(data.patient)) {
        clearStorage();
        return false;
      }

      if (data.engine) {
        engineState.phase = data.engine.phase || 'intro';
        engineState.turnCount = data.engine.turnCount || 0;
        engineState.lastApproachId = data.engine.lastApproachId || null;
        engineState.lastFragmentId = data.engine.lastFragmentId || null;
        engineState.totalSessionsCompleted = data.engine.totalSessionsCompleted || 0;
        engineState.sessionFragmentLog = data.engine.sessionFragmentLog || [];
      }

      engineState.initialized = true;
      return true;
    } catch (e) {
      console.error('Failed to load:', e);
      clearStorage();
      return false;
    }
  }

  function clearStorage() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* silent */ }
  }

  function scheduleAutosave() {
    if (engineState.autosaveTimer) clearTimeout(engineState.autosaveTimer);
    engineState.autosaveTimer = setTimeout(function () {
      saveToStorage();
      engineState.autosaveTimer = null;
    }, AUTOSAVE_DEBOUNCE_MS);
  }

  function hasSavedData() {
    try { return localStorage.getItem(STORAGE_KEY) !== null; }
    catch (e) { return false; }
  }

  // ==========================================================
  //  HELPERS
  // ==========================================================

  function emit(event, data) {
    if (typeof callbacks[event] === 'function') {
      try { callbacks[event](data); }
      catch (e) { console.error('Callback error (' + event + '):', e); }
    }
  }

  function emitError(message) {
    console.warn('Engine error:', message);
    emit('onError', { message: message });
  }

  function getPublicState() {
    return {
      initialized: engineState.initialized,
      phase: engineState.phase,
      turnCount: engineState.turnCount,
      totalSessionsCompleted: engineState.totalSessionsCompleted,
      patientState: Patient.getState(),
      hasSavedData: hasSavedData()
    };
  }

  function getCurrentTurnInfo() {
    var patientState = Patient.getState();
    var available = Patient.getAvailableApproaches(engineState.lastFragmentId);

    var approaches = available.map(function (id) {
      var a = Patient.getApproach(id);
      return a ? { id: a.id, label: a.label, description: a.description } : null;
    }).filter(Boolean);

    return {
      phase: engineState.phase,
      turnNumber: engineState.turnCount,
      sessionNumber: patientState.currentSession,
      distressLevel: patientState.distress,
      distressObservation: Patient.getDistressObservation(),
      availableApproaches: approaches,
      lastFragmentId: engineState.lastFragmentId,
      canEndSession: engineState.turnCount >= 2
    };
  }

  /**
   * Produce the patient's opening line for the session.
   * First session uses a fixed intake line; later sessions
   * reference the most-pursued theme from prior work.
   */
  function getOpeningStatement() {
    var patientState = Patient.getState();

    if (patientState.currentSession === 1 && engineState.turnCount === 0) {
      return {
        text: "I've never done this before. David made the appointment. He said I needed to talk to someone. I think he just doesn't want to hear it anymore.",
        isAutomatic: true,
        approach: null,
        followUpApproaches: Patient.getAvailableApproaches(null)
      };
    }

    var pursuit = Patient.getPursuitHistory();
    var totalPursuit = 0;
    var keys = Object.keys(pursuit);
    keys.forEach(function (k) { totalPursuit += pursuit[k]; });

    if (totalPursuit === 0) {
      return {
        text: 'Hello again.',
        isAutomatic: true,
        approach: null,
        followUpApproaches: Patient.getAvailableApproaches(null)
      };
    }

    var sortedThemes = keys.sort(function (a, b) { return pursuit[b] - pursuit[a]; });
    var dominantTheme = sortedThemes[0];

    var openingMap = {
      marriage: "I've been thinking about what you said last time. About David. About us.",
      childhood: "I remembered something from when I was a kid. I don't know if it's relevant.",
      work: "I drove past the hospital yesterday. Didn't go in. Just sat in the parking lot for twenty minutes.",
      the_event: "I didn't sleep much. I kept thinking about that night.",
      hospital: "I still smell the ceiling tiles sometimes. Forty-seven holes.",
      aftermath: "The motel room is starting to feel permanent. I don't know if that's good or bad.",
      denial: "I want to start by saying I'm doing better. I think I am. Maybe.",
      confession: "There's something I didn't tell you last time. I don't know if I can say it now."
    };

    return {
      text: openingMap[dominantTheme] || "I've been thinking about our last session.",
      isAutomatic: true,
      approach: null,
      followUpApproaches: Patient.getAvailableApproaches(null),
      dominantTheme: dominantTheme
    };
  }

  function isCaseComplete() {
    var stats = Patient.getCompletionStats();
    return stats.fragmentsHeard >= stats.fragmentsTotal - stats.fragmentsLocked;
  }

  /**
   * Generate a formatted clinical note for the completed session.
   */
  function generateClinicalNote() {
    var summary = Patient.getSessionSummary();
    var pursuit = Patient.getPursuitHistory();
    var patientState = Patient.getState();

    var themeNames = {
      marriage: 'Marital/Relationship',
      childhood: 'Developmental/Childhood',
      work: 'Occupational',
      the_event: 'Index Event',
      hospital: 'Medical/Hospitalization',
      aftermath: 'Post-Event Adjustment',
      denial: 'Defensive/Minimizing',
      confession: 'Disclosure/Confession'
    };

    var themeNotes = summary.themeDistribution.map(function (t) {
      return themeNames[t.theme] + ': ' + t.count + ' exchanges';
    }).join('\n    ');

    var noteLines = [
      'SESSION NOTE — SESSION ' + summary.session,
      'Date: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      '',
      'PRESENTING STATUS:',
      '  ' + summary.distressObservation,
      '',
      'SESSION CONTENT:',
      '  Fragments discussed: ' + summary.fragmentsDiscussed,
      '  New material: ' + summary.newFragments + ' previously unheard fragments',
      '  Primary focus: ' + (themeNames[summary.primaryTheme] || 'General'),
      '',
      'THEMATIC DISTRIBUTION:',
      '    ' + themeNotes,
      '',
      'CLINICAL OBSERVATIONS:',
      '  Peak distress level: ' + patientState.distress + '/10',
      '  Maximum distress ever reached: ' + patientState.maxDistressEver + '/10',
      '  Total sessions conducted: ' + patientState.currentSession,
      '',
      'RECOMMENDATIONS:',
      generateRecommendations(summary, pursuit, patientState)
    ];

    return noteLines.join('\n');
  }

  function generateRecommendations(summary, pursuit, patientState) {
    var recs = [];
    var totalPursuit = 0;
    var keys = Object.keys(pursuit);
    keys.forEach(function (k) { totalPursuit += pursuit[k]; });

    if (totalPursuit > 0) {
      var sorted = keys.sort(function (a, b) { return pursuit[b] - pursuit[a]; });
      var topTheme = sorted[0];
      var topRatio = pursuit[topTheme] / totalPursuit;

      if (topRatio > 0.5) {
        recs.push('  WARNING: Significant therapeutic tunnel vision detected.');
        recs.push('  Over-reliance on ' + topTheme + ' theme may be limiting patient disclosure.');
        recs.push('  Consider exploring neglected areas in future sessions.');
      }
    }

    if (patientState.maxDistressEver >= 9) {
      recs.push('  CAUTION: Patient has previously reached acute distress.');
      recs.push('  Some locked content was accessible during that state.');
      recs.push('  Balance therapeutic safety with investigative needs.');
    } else if (patientState.maxDistressEver < 4) {
      recs.push('  NOTE: Patient has not experienced significant distress in sessions.');
      recs.push('  Certain disclosures require elevated patient distress.');
      recs.push('  This presents an ethical dilemma for the clinician.');
    }

    var contradictions = Patient.getDiscoveredContradictions();
    if (contradictions.length > 0) {
      recs.push('  ALERT: ' + contradictions.length + ' narrative contradiction(s) identified.');
      recs.push('  Review discrepancy between patient statements for diagnostic significance.');
    }

    if (recs.length === 0) {
      recs.push('  Continue standard therapeutic protocol.');
      recs.push('  Maintain balanced approach to thematic exploration.');
    }

    return recs.join('\n');
  }

  /**
   * Shallow merge utility (avoids dependency on Object.assign for
   * older environments while keeping intent clear).
   */
  function merge(target, source) {
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i++) {
      target[keys[i]] = source[keys[i]];
    }
    return target;
  }

  // ==========================================================
  //  PUBLIC API
  // ==========================================================

  return {
    // Lifecycle
    init: init,

    // Session flow
    beginSession: beginSession,
    processTurn: processTurn,
    endSessionManually: endSessionManually,
    getOpeningStatement: getOpeningStatement,

    // Case file
    openCaseFile: openCaseFile,
    resetCaseFile: resetCaseFile,
    isCaseComplete: isCaseComplete,

    // State access
    getPublicState: getPublicState,
    getCurrentTurnInfo: getCurrentTurnInfo,
    generateClinicalNote: generateClinicalNote,

    // Persistence
    saveToStorage: saveToStorage,
    loadFromStorage: loadFromStorage,
    hasSavedData: hasSavedData,
    clearStorage: clearStorage
  };
})();
