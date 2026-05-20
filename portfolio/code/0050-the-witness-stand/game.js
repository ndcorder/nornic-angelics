/**
 * game.js — Core game engine for The Witness Stand
 *
 * Manages state machine, question flow, consistency tracking,
 * evidence introduction, and ending conditions.
 *
 * Depends on: CASEFILE (casefile.js)
 */

(function () {
  'use strict';

  // ============================================================
  // CONFIGURATION
  // ============================================================

  const CONFIG = {
    typingSpeed: 26,           // ms per character for prosecutor lines
    playerTypingDelay: 400,
    evidenceDelay: 1200,
    phaseTransitionDelay: 800,
    maxQuestions: 32,
    minQuestionsBeforeEnd: 12,
    contradictionThreshold: 3,
    honestyThreshold: 0.6,
    perjuryThreshold: 0.8,
    silenceLimit: 3
  };

  // ============================================================
  // PHASES
  // ============================================================

  const PHASES = {
    INTRO: 'intro',
    RELATIONSHIP: 'relationship',
    COMPANY: 'company',
    DISCOVERY: 'discovery',
    TESTIMONY: 'testimony',
    AFTERMATH: 'aftermath',
    MORALITY: 'morality',
    ENDING: 'ending'
  };

  const PHASE_ORDER = [
    PHASES.INTRO,
    PHASES.RELATIONSHIP,
    PHASES.COMPANY,
    PHASES.DISCOVERY,
    PHASES.TESTIMONY,
    PHASES.AFTERMATH,
    PHASES.MORALITY
  ];

  // ============================================================
  // GAME STATE
  // ============================================================

  let state = null;

  function createInitialState() {
    return {
      phase: PHASES.INTRO,
      phaseIndex: 0,
      questionCount: 0,
      answers: [],
      contradictions: [],
      honestyScore: 0.5,
      warmthScore: 0.5,
      knowledgeRevealed: [],
      evidenceIntroduced: [],
      silenceCount: 0,
      totalSilence: 0,
      hasContradicted: false,
      hasAdmittedLying: false,
      hasExpressedRemorse: false,
      hasNamedElena: false,
      hasReferencedDeath: false,
      deductionTriggered: false,
      gameOver: false,
      previousAnswer: null,
      toneShift: [],
      pressureLevel: 0,
      phaseTransitions: 0,
      waitingForInput: false,
      currentQuestion: null,
      inputHistory: []
    };
  }

  // ============================================================
  // DOM ELEMENTS
  // ============================================================

  let elements = {};
  let isTyping = false;

  function cacheElements() {
    elements = {
      transcript: document.getElementById('transcript'),
      inputArea: document.getElementById('input-area'),
      inputField: document.getElementById('input-field'),
      submitBtn: document.getElementById('submit-btn'),
      evidencePanel: document.getElementById('evidence-panel'),
      evidenceContent: document.getElementById('evidence-content'),
      evidenceClose: document.getElementById('evidence-close'),
      phaseIndicator: document.getElementById('phase-indicator'),
      pressureBar: document.getElementById('pressure-bar'),
      statusLine: document.getElementById('status-line')
    };
  }

  // ============================================================
  // TEXT DISPLAY
  // ============================================================

  function clearInput() {
    if (elements.inputField) {
      elements.inputField.value = '';
    }
  }

  function scrollToBottom() {
    const t = elements.transcript;
    if (t) {
      t.scrollTop = t.scrollHeight;
    }
  }

  /**
   * Append a line to the transcript.
   * Prosecutor, system, and narration lines are typed out character by character.
   * Player lines appear instantly.
   */
  function addLine(className, text, callback) {
    var line = document.createElement('div');
    line.className = 'line ' + className;

    if (className === 'prosecutor' || className === 'system' || className === 'narration') {
      var textSpan = document.createElement('span');
      textSpan.className = 'text-content';
      line.appendChild(textSpan);
      elements.transcript.appendChild(line);
      scrollToBottom();
      typeText(textSpan, text, function () {
        if (callback) callback();
      });
    } else {
      line.textContent = text;
      elements.transcript.appendChild(line);
      scrollToBottom();
      if (callback) callback();
    }
  }

  function typeText(element, text, callback, speed) {
    var s = speed || CONFIG.typingSpeed;
    var i = 0;
    element.textContent = '';
    isTyping = true;

    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '▌';
    element.appendChild(cursor);

    function typeNext() {
      if (i < text.length) {
        element.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        scrollToBottom();
        setTimeout(typeNext, s);
      } else {
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        isTyping = false;
        if (callback) callback();
      }
    }

    typeNext();
  }

  function addBlankLine() {
    var line = document.createElement('div');
    line.className = 'line blank';
    line.innerHTML = '&nbsp;';
    elements.transcript.appendChild(line);
    scrollToBottom();
  }

  function addSeparator() {
    var line = document.createElement('div');
    line.className = 'line separator';
    line.textContent = '———';
    elements.transcript.appendChild(line);
    scrollToBottom();
  }

  // ============================================================
  // INPUT HANDLING
  // ============================================================

  function enableInput() {
    state.waitingForInput = true;
    if (elements.inputArea) elements.inputArea.classList.remove('hidden');
    if (elements.inputField) {
      elements.inputField.disabled = false;
      elements.inputField.focus();
    }
  }

  function disableInput() {
    state.waitingForInput = false;
    if (elements.inputField) elements.inputField.disabled = true;
  }

  function handleInput(text) {
    if (!state.waitingForInput || state.gameOver) return;
    var answer = text.trim();
    if (!answer) return;

    disableInput();

    // Display player's answer
    addLine('player', answer);

    // Record the answer
    state.answers.push({
      question: state.currentQuestion,
      answer: answer,
      phase: state.phase,
      questionNumber: state.questionCount
    });
    state.inputHistory.push(answer);
    state.previousAnswer = answer;
    state.questionCount++;

    // Analyze the answer
    analyzeAnswer(answer);

    // Check for ending conditions
    if (checkEndingConditions(answer)) {
      return;
    }

    // Advance phase if needed
    checkPhaseTransition(function () {
      askNextQuestion();
    });
  }

  // ============================================================
  // ANSWER ANALYSIS
  // ============================================================

  function analyzeAnswer(answer) {
    var lower = answer.toLowerCase();

    // --- Detect silence / evasion ---
    if (answer.length < 5 || lower.match(/^(i don'?t know|no comment|pass|\.\.\.|silence|nothing|i refuse|i decline|no answer|idk|i can'?t)/)) {
      state.silenceCount++;
      state.totalSilence++;
    } else {
      state.silenceCount = 0;
    }

    // --- Honesty markers ---
    var honestyMarkers = [
      /\b(i lied|not true|wasn'?t true|fabricat|made up|false|i changed|exaggerat|didn'?t happen)\b/,
      /\b(i modified|altered|created that|after the|before my testimony)\b/,
      /\b(i wanted|wanted her|wanted the company)\b/,
      /\b(i knew it was|i knew that|it wasn'?t|they weren'?t)\b/
    ];
    var dishonestyMarkers = [
      /\b(she was guilty|she did it|i told the truth|everything i said|stand by my|told the truth)\b/,
      /\b(correct|that'?s right|yes absolutely|no i never)\b/i
    ];

    var honestyDelta = 0;
    honestyMarkers.forEach(function (regex) {
      if (lower.match(regex)) {
        honestyDelta += 0.08;
        if (lower.match(/\b(i lied|fabricat|made up|false)\b/)) {
          state.hasAdmittedLying = true;
          honestyDelta += 0.12;
        }
      }
    });
    dishonestyMarkers.forEach(function (regex) {
      if (lower.match(regex)) {
        honestyDelta -= 0.06;
      }
    });
    state.honestyScore = Math.max(0, Math.min(1, state.honestyScore + honestyDelta));

    // --- Warmth toward Elena ---
    var warmthMarkers = [
      /\b(friend|loved|care|miss|close|trusted|she was good|she was kind|she helped)\b/,
      /\b(i loved her|she mattered|she meant|i miss her|my fault|i'?m sorry|i feel guilty)\b/,
      /\b(she deserved better|i betrayed|i wronged|i failed her)\b/
    ];
    var coldnessMarkers = [
      /\b(she was criminal|she deserved|she did this|her fault|manipulat|calculat|cold|ruthless)\b/,
      /\b(don'?t care|don'?t think about|moved on|irrelevant|the past)\b/
    ];

    var warmthDelta = 0;
    warmthMarkers.forEach(function (regex) {
      if (lower.match(regex)) {
        warmthDelta += 0.1;
        state.hasExpressedRemorse = true;
      }
    });
    coldnessMarkers.forEach(function (regex) {
      if (lower.match(regex)) {
        warmthDelta -= 0.1;
      }
    });
    state.warmthScore = Math.max(0, Math.min(1, state.warmthScore + warmthDelta));

    // --- Track tone shifts ---
    if (state.toneShift.length > 0) {
      var lastTone = state.toneShift[state.toneShift.length - 1];
      var currentTone = warmthDelta > 0 ? 'warm' : (warmthDelta < 0 ? 'cold' : 'neutral');
      if (currentTone !== 'neutral' && currentTone !== lastTone && lastTone !== 'neutral') {
        state.toneShift.push(currentTone);
        checkContradiction('tone', currentTone);
      } else if (currentTone !== 'neutral') {
        state.toneShift.push(currentTone);
      }
    } else {
      if (warmthDelta > 0) state.toneShift.push('warm');
      else if (warmthDelta < 0) state.toneShift.push('cold');
    }

    // --- Detect references to key facts ---
    if (lower.match(/\b(elena|voss)\b/) && !state.hasNamedElena) {
      state.hasNamedElena = true;
      state.knowledgeRevealed.push('namedElena');
    }
    if (lower.match(/\b(died|death|prison|in custody|cell|passed away|killed)\b/)) {
      if (!state.hasReferencedDeath) {
        state.hasReferencedDeath = true;
        state.knowledgeRevealed.push('referencedDeath');
      }
    }
    if (lower.match(/\b(partnership agreement|clause|14\.3|for cause|buy out|buyout)\b/)) {
      state.knowledgeRevealed.push('partnershipClause');
    }
    if (lower.match(/\b(audit|internal audit|fabricat|metadata|created after|forged)\b/)) {
      state.knowledgeRevealed.push('auditKnowledge');
      if (lower.match(/\b(fabricat|forged|created|falsif|made up)\b/)) {
        state.hasAdmittedLying = true;
      }
    }
    if (lower.match(/\b(i wanted the company|wanted full control|wanted it for myself|wanted what was hers|took her|stole)\b/)) {
      state.knowledgeRevealed.push('motiveAcknowledged');
    }
    if (lower.match(/\b(she died because|my fault she|because of me|i killed her|her death is on)\b/)) {
      state.knowledgeRevealed.push('deathAcknowledged');
    }
    if (lower.match(/\b(untouchable|she told me|word against|trapped)\b/)) {
      state.honestyScore = Math.max(0, state.honestyScore - 0.05);
    }

    // --- Deduction triggers ---
    if (lower.match(/i lied.*take.*(company|firm|hers|partnership)/)) {
      state.deductionTriggered = true;
    }
    if (lower.match(/i lied.*she died/i) || lower.match(/she died.*i lied/i)) {
      state.deductionTriggered = true;
    }
    if (lower.match(/fabricat.*evidence.*and.*died/i)) {
      state.deductionTriggered = true;
    }
    if (lower.match(/i lied to take what was hers/i) && lower.match(/died/i)) {
      state.deductionTriggered = true;
    }
    if (lower.match(/i lied.*and.*she died for it/i)) {
      state.deductionTriggered = true;
    }
    // Broader deduction: admitted lying + acknowledged death
    if (state.hasAdmittedLying && state.knowledgeRevealed.indexOf('deathAcknowledged') !== -1) {
      state.deductionTriggered = true;
    }
    // Lying + motive + death reference
    if (state.hasAdmittedLying && state.knowledgeRevealed.indexOf('motiveAcknowledged') !== -1 && state.hasReferencedDeath) {
      state.deductionTriggered = true;
    }

    // --- Pressure from sustained silence ---
    if (state.silenceCount >= CONFIG.silenceLimit) {
      state.pressureLevel = Math.min(3, state.pressureLevel + 1);
    }
  }

  function checkContradiction(type, detail) {
    var contradiction = {
      type: type,
      detail: detail,
      questionNumber: state.questionCount,
      phase: state.phase
    };
    state.contradictions.push(contradiction);
    state.hasContradicted = true;

    if (state.contradictions.length >= CONFIG.contradictionThreshold) {
      state.pressureLevel = Math.min(3, state.pressureLevel + 1);
    }
  }

  // ============================================================
  // QUESTION BANK
  // ============================================================

  var QUESTION_BANK = {
    intro: [
      {
        id: 'intro_1',
        text: 'State your name for the record.',
        type: 'administrative'
      },
      {
        id: 'intro_2',
        text: 'You understand you\'re under oath?',
        type: 'administrative'
      },
      {
        id: 'intro_3',
        text: 'You were previously called as a witness in the case of United States v. Voss. Do you recall that testimony?',
        type: 'orientation'
      },
      {
        id: 'intro_4',
        text: 'And you stand by that testimony today?',
        type: 'commitment'
      }
    ],

    relationship: [
      {
        id: 'rel_1',
        text: 'Let\'s start simple. How did you and the defendant meet?',
        type: 'relationship'
      },
      {
        id: 'rel_2',
        text: 'How would you describe your relationship with her?',
        type: 'relationship'
      },
      {
        id: 'rel_3',
        text: 'Would you say you were close?',
        type: 'relationship'
      },
      {
        id: 'rel_4',
        text: 'Did she trust you?',
        type: 'relationship'
      },
      {
        id: 'rel_5',
        text: 'She named you executor of her will. Were you aware of that?',
        type: 'relationship'
      },
      {
        id: 'rel_6',
        text: 'What did you admire about her?',
        type: 'relationship'
      },
      {
        id: 'rel_7',
        text: 'Did you socialize outside of work?',
        type: 'relationship'
      },
      {
        id: 'rel_8',
        text: 'She had no family. Did you know that?',
        type: 'relationship'
      },
      {
        id: 'rel_9',
        text: 'In your original testimony, you described her as a "calculating individual." Is that how you thought of her — before all this?',
        type: 'challenge'
      },
      {
        id: 'rel_10',
        text: 'When was the last time you spoke to her?',
        type: 'relationship'
      }
    ],

    company: [
      {
        id: 'comp_1',
        text: 'Tell me about Ashland Strategic Partners. How did it start?',
        type: 'company'
      },
      {
        id: 'comp_2',
        text: 'The firm was a 50/50 partnership. Equal equity. Is that right?',
        type: 'company'
      },
      {
        id: 'comp_3',
        text: 'Who brought in the clients, primarily?',
        type: 'company'
      },
      {
        id: 'comp_4',
        text: 'Financial records show she was responsible for roughly 70% of revenue. Does that sound right?',
        type: 'company'
      },
      {
        id: 'comp_5',
        text: 'What did you contribute, operationally?',
        type: 'company'
      },
      {
        id: 'comp_6',
        text: 'Were you satisfied with the 50/50 split?',
        type: 'trap'
      },
      {
        id: 'comp_7',
        text: 'There was a clause in the partnership agreement — Section 14.3. Are you familiar with it?',
        type: 'evidence_lead',
        evidenceId: 'partnershipAgreement',
        introduceEvidenceBefore: true
      },
      {
        id: 'comp_8',
        text: 'The clause states that if a partner is removed for cause, the remaining partner assumes full ownership. At no cost. You knew this clause existed.',
        type: 'assertion'
      },
      {
        id: 'comp_9',
        text: 'In 2016, Elena was exploring expansion to London. How did you feel about that?',
        type: 'company'
      },
      {
        id: 'comp_10',
        text: 'She suggested you stay in Chicago to manage operations while she expanded. Did you see that as an opportunity — or a threat?',
        type: 'trap'
      }
    ],

    discovery: [
      {
        id: 'disc_1',
        text: 'Let\'s talk about when you first discovered the financial irregularities. When was that, exactly?',
        type: 'discovery'
      },
      {
        id: 'disc_2',
        text: 'What did you find?',
        type: 'discovery'
      },
      {
        id: 'disc_3',
        text: 'How much money are we talking about?',
        type: 'discovery'
      },
      {
        id: 'disc_4',
        text: 'In your testimony, you described "systematic embezzlement." Over a million dollars. Is that what you found?',
        type: 'challenge'
      },
      {
        id: 'disc_5',
        text: 'I\'m showing you Exhibit B — the actual expense reconciliation. Thirty-four thousand dollars. Over three years. Some of it potentially legitimate. This is what you described as "systematic embezzlement"?',
        type: 'evidence_challenge',
        evidenceId: 'expenseReport',
        introduceEvidenceBefore: true
      },
      {
        id: 'disc_6',
        text: 'What did you do between finding these irregularities and going to the board? That\'s approximately four months.',
        type: 'gap_challenge'
      },
      {
        id: 'disc_7',
        text: 'Did you talk to Elena about what you found?',
        type: 'discovery'
      },
      {
        id: 'disc_8',
        text: 'You consulted an attorney during this period. David Chen. What did you discuss with him?',
        type: 'discovery'
      },
      {
        id: 'disc_9',
        text: 'What did Mr. Chen advise you to do?',
        type: 'discovery'
      },
      {
        id: 'disc_10',
        text: 'You presented your findings to the board in October 2016. The board voted unanimously to terminate and refer for prosecution. How did you characterize the violations to the board?',
        type: 'challenge'
      }
    ],

    testimony: [
      {
        id: 'test_1',
        text: 'I want to read back a portion of your testimony from November 2017. You said — and I\'m quoting — "I watched her defraud our clients for years." Is that accurate?',
        type: 'testimony_challenge'
      },
      {
        id: 'test_2',
        text: 'You also said: "I stayed to gather evidence." Gather evidence. You\'re not law enforcement. You\'re not an investigator. Why did you use that phrase?',
        type: 'testimony_challenge'
      },
      {
        id: 'test_3',
        text: 'You testified that Elena told you she was "untouchable." That she said — quote — "they\'ll never catch me, and even if they do, I\'ll take you down with me." When exactly did she say that?',
        type: 'testimony_challenge',
        evidenceId: 'testimony',
        introduceEvidenceBefore: true
      },
      {
        id: 'test_4',
        text: 'You stated that you attempted to report Elena\'s conduct to outside counsel prior to going to the board. That counsel has no record of any such meeting. Can you explain that?',
        type: 'direct_challenge'
      },
      {
        id: 'test_5',
        text: 'Let me show you Exhibit C. This is the internal audit you provided during the original investigation. A forensic examination shows it was created on November 3rd, 2017. Five days before your testimony.',
        type: 'evidence_confrontation',
        evidenceId: 'internalAudit',
        introduceEvidenceBefore: true
      },
      {
        id: 'test_6',
        text: 'This audit was created after you had already been prepped for testimony. By your own account. The metadata shows the author was you. How do you explain a document you used to support your testimony being created after the testimony was prepared?',
        type: 'escalation'
      },
      {
        id: 'test_7',
        text: 'I\'m going to ask you directly, and I want you to think carefully before you answer. Was this document created as a contemporaneous business record — or was it fabricated to support testimony you had already decided to give?',
        type: 'direct_challenge'
      },
      {
        id: 'test_8',
        text: 'You provided emails during the trial. Emails that demonstrated Elena\'s knowledge of the fraud. Were those emails authentic?',
        type: 'testimony_challenge'
      }
    ],

    aftermath: [
      {
        id: 'aft_1',
        text: 'Elena Voss was convicted on all counts. November 2017. She was sentenced to 96 months in federal custody. How did you feel when you heard the verdict?',
        type: 'aftermath'
      },
      {
        id: 'aft_2',
        text: 'Did you visit her?',
        type: 'aftermath'
      },
      {
        id: 'aft_3',
        text: 'You were her godparent. She had a daughter, Maya. She was seven when Elena went to prison. Did you ever visit Maya?',
        type: 'emotional_challenge'
      },
      {
        id: 'aft_4',
        text: 'You were close enough to be her godparent. And you never visited her daughter once?',
        type: 'escalation'
      },
      {
        id: 'aft_5',
        text: 'Elena Voss died on March 14th, 2019. In federal custody. Pneumonia. She was ill for three days before receiving medical attention. Were you aware of this?',
        type: 'aftermath',
        evidenceId: 'deathCertificate',
        introduceEvidenceBefore: true
      },
      {
        id: 'aft_6',
        text: 'You were listed as her emergency contact. The facility called your office three times. Your office. The firm that used to be hers. What happened when those calls came in?',
        type: 'direct_challenge'
      },
      {
        id: 'aft_7',
        text: 'She had no family. No estate. A legal aid attorney handled her remains. She was cremated. Ashes scattered per institution protocol. You were her executor. You were her emergency contact. You were the person she trusted most. And you did nothing.',
        type: 'assertion'
      },
      {
        id: 'aft_8',
        text: 'She wrote a letter she never sent. It was found in her personal effects. Would you like to know what it said?',
        type: 'evidence_lead',
        evidenceId: 'theLetter',
        introduceEvidenceAfter: true
      },
      {
        id: 'aft_9',
        text: '"This company is ours. Not mine. Ours. I mean that." She never sent it. What do you think she meant by that?',
        type: 'emotional_challenge'
      },
      {
        id: 'aft_10',
        text: 'What happened to Ashland Strategic Partners after Elena was removed?',
        type: 'aftermath'
      },
      {
        id: 'aft_11',
        text: 'The firm grew to $28 million in revenue. You removed her name from the website. From the wall. From the founding documents. New employees don\'t know there was a co-founder. Why?',
        type: 'challenge'
      }
    ],

    morality: [
      {
        id: 'mor_1',
        text: 'The partnership agreement gave Elena the right to buy you out at 2x book value if you left voluntarily. But if she were removed for cause — you got everything. You knew this.',
        type: 'moral_challenge'
      },
      {
        id: 'mor_2',
        text: 'Do you believe Elena Voss was a criminal?',
        type: 'moral_challenge'
      },
      {
        id: 'mor_3',
        text: 'Do you believe your testimony was truthful?',
        type: 'moral_challenge'
      },
      {
        id: 'mor_4',
        text: 'If you could go back to October 2016 — knowing everything you know now — would you do anything differently?',
        type: 'moral_challenge'
      },
      {
        id: 'mor_5',
        text: 'Elena Voss trusted you with her life. Literally — she named you executor. You sat across from her in a courtroom and told a jury she was a fraud. She looked at you when the verdict was read. She looked confused. What do you think she was trying to understand?',
        type: 'emotional_challenge'
      },
      {
        id: 'mor_6',
        text: 'One more question. If Elena were sitting in this room right now — what would you say to her?',
        type: 'final'
      }
    ]
  };

  // Dynamic follow-ups based on analysis
  var DYNAMIC_RESPONSES = {
    silence: [
      'The court requires an answer.',
      'I\'ll repeat the question.',
      'Your silence is noted for the record.',
      'I remind you that you are under oath.',
      'The jury will draw their own conclusions from your refusal to answer.'
    ],
    contradiction: [
      'That\'s not consistent with what you told me earlier.',
      'I want to make sure I understand — which version is the truth?',
      'Your testimony is developing some interesting contradictions.',
      'You seem to be revising your story. Shall we try again?',
      'I\'d like the record to reflect that the witness has changed their account.'
    ],
    evasion: [
      'That\'s not what I asked.',
      'Answer the question.',
      'Let me ask it differently.',
      'The court isn\'t interested in speeches. Just answers.',
      'I\'ll note that as non-responsive.'
    ]
  };

  // ============================================================
  // QUESTION SELECTION
  // ============================================================

  var phaseQuestionIndex = {};

  function getQuestionsForPhase(phase) {
    return QUESTION_BANK[phase] || [];
  }

  function selectNextQuestion() {
    var phase = state.phase;
    var questions = getQuestionsForPhase(phase);

    if (!phaseQuestionIndex[phase]) {
      phaseQuestionIndex[phase] = 0;
    }

    var idx = phaseQuestionIndex[phase];

    if (idx >= questions.length) {
      return null;
    }

    var q = questions[idx];
    phaseQuestionIndex[phase] = idx + 1;
    return q;
  }

  function getDynamicResponse(type) {
    var responses = DYNAMIC_RESPONSES[type] || DYNAMIC_RESPONSES.silence;
    var idx = Math.min(state.pressureLevel, responses.length - 1);
    return responses[idx];
  }

  // ============================================================
  // EVIDENCE DISPLAY
  // ============================================================

  function showEvidence(evidenceId, callback) {
    var evidence = CASEFILE.evidence[evidenceId];
    if (!evidence) {
      if (callback) callback();
      return;
    }

    state.evidenceIntroduced.push(evidenceId);

    var html = '<div class="evidence-document">';
    html += '<div class="evidence-header">';
    html += '<div class="evidence-stamp">UNITED STATES DISTRICT COURT</div>';
    html += '<div class="evidence-exhibit">' + evidence.exhibit + '</div>';
    html += '<div class="evidence-title">' + escapeHtml(evidence.title) + '</div>';
    html += '</div>';
    html += '<div class="evidence-body">';
    html += '<pre class="evidence-text">' + escapeHtml(evidence.content) + '</pre>';
    html += '</div>';
    html += '</div>';

    addBlankLine();
    addLine('system', '[ The prosecutor places a document on the screen. ]', function () {
      if (elements.evidencePanel && elements.evidenceContent) {
        elements.evidenceContent.innerHTML = html;
        elements.evidencePanel.classList.remove('hidden');
      }

      if (callback) {
        var closed = false;

        var closeHandler = function () {
          if (closed) return;
          closed = true;
          if (elements.evidencePanel) elements.evidencePanel.classList.add('hidden');
          if (elements.evidenceClose) {
            elements.evidenceClose.removeEventListener('click', closeHandler);
          }
          setTimeout(callback, CONFIG.phaseTransitionDelay);
        };

        if (elements.evidenceClose) {
          elements.evidenceClose.addEventListener('click', closeHandler);
        }
        if (elements.evidencePanel) {
          elements.evidencePanel.addEventListener('click', function handler(e) {
            if (e.target === elements.evidencePanel) {
              elements.evidencePanel.removeEventListener('click', handler);
              closeHandler();
            }
          });
        }

        // Auto-close after 15 seconds if user doesn't close manually
        setTimeout(function () {
          if (!closed) closeHandler();
        }, 15000);
      }
    });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  // PHASE MANAGEMENT
  // ============================================================

  function checkPhaseTransition(callback) {
    var currentPhase = state.phase;
    var currentQuestions = getQuestionsForPhase(currentPhase);
    var idx = phaseQuestionIndex[currentPhase] || 0;

    var phaseComplete = idx >= currentQuestions.length;
    var minQuestionsInPhase = Math.max(2, Math.floor(currentQuestions.length * 0.6));
    var enoughQuestions = idx >= minQuestionsInPhase;

    var shouldAdvance = phaseComplete ||
      (enoughQuestions && shouldAdvanceEarly());

    if (shouldAdvance) {
      var nextPhase = getNextPhase();
      if (nextPhase && nextPhase !== state.phase) {
        transitionToPhase(nextPhase, callback);
        return;
      }
    }

    callback();
  }

  function shouldAdvanceEarly() {
    if (state.silenceCount >= CONFIG.silenceLimit) return true;
    if (state.pressureLevel >= 2 && state.questionCount > CONFIG.minQuestionsBeforeEnd) return true;
    if (state.deductionTriggered) return true;
    return false;
  }

  function getNextPhase() {
    var currentIdx = PHASE_ORDER.indexOf(state.phase);
    for (var i = currentIdx + 1; i < PHASE_ORDER.length; i++) {
      return PHASE_ORDER[i];
    }
    return PHASES.MORALITY;
  }

  function transitionToPhase(newPhase, callback) {
    state.phase = newPhase;
    state.phaseTransitions++;
    updatePhaseIndicator();

    addBlankLine();
    addSeparator();
    addLine('system', '[ The prosecutor adjusts his notes. The line of questioning shifts. ]', function () {
      setTimeout(callback, CONFIG.phaseTransitionDelay);
    });
  }

  function updatePhaseIndicator() {
    if (elements.phaseIndicator) {
      var labels = {
        intro: 'PROCEEDINGS COMMENCED',
        relationship: 'LINE OF INQUIRY: PERSONAL RELATIONSHIP',
        company: 'LINE OF INQUIRY: BUSINESS OPERATIONS',
        discovery: 'LINE OF INQUIRY: DISCOVERY OF CONDUCT',
        testimony: 'LINE OF INQUIRY: PRIOR TESTIMONY',
        aftermath: 'LINE OF INQUIRY: SUBSEQUENT EVENTS',
        morality: 'LINE OF INQUIRY: REFLECTION'
      };
      elements.phaseIndicator.textContent = labels[state.phase] || '';
    }

    if (elements.pressureBar) {
      var pressurePct = (state.pressureLevel / 3) * 100;
      elements.pressureBar.style.width = pressurePct + '%';
    }
  }

  // ============================================================
  // QUESTION ASKING
  // ============================================================

  function askNextQuestion() {
    if (state.gameOver) return;

    // Insert dynamic responses for sustained silence
    if (state.silenceCount >= 2 && state.silenceCount % 2 === 0) {
      var response = getDynamicResponse('silence');
      addLine('prosecutor', response, function () {
        askStandardQuestion();
      });
      return;
    }

    // Call out contradictions at key moments
    if (state.hasContradicted && state.contradictions.length > 0 &&
        state.contradictions.length % 2 === 0 && state.questionCount % 3 === 0) {
      var cResponse = getDynamicResponse('contradiction');
      addLine('prosecutor', cResponse, function () {
        askStandardQuestion();
      });
      return;
    }

    askStandardQuestion();
  }

  function askStandardQuestion() {
    if (state.gameOver) return;

    var question = selectNextQuestion();

    if (!question) {
      if (state.phase === PHASES.MORALITY || state.questionCount >= CONFIG.maxQuestions) {
        determineEnding();
        return;
      }
      var nextPhase = getNextPhase();
      if (nextPhase && nextPhase !== state.phase) {
        transitionToPhase(nextPhase, function () {
          askNextQuestion();
        });
      } else {
        determineEnding();
      }
      return;
    }

    state.currentQuestion = question;

    // Show evidence before question if flagged
    if (question.introduceEvidenceBefore && question.evidenceId &&
        state.evidenceIntroduced.indexOf(question.evidenceId) === -1) {
      showEvidence(question.evidenceId, function () {
        deliverQuestion(question);
      });
    } else {
      deliverQuestion(question);
    }
  }

  function deliverQuestion(question) {
    var prefix = 'Q: ';
    var fullText = prefix + question.text;

    addLine('prosecutor', fullText, function () {
      // Show evidence after question if flagged
      if (question.introduceEvidenceAfter && question.evidenceId &&
          state.evidenceIntroduced.indexOf(question.evidenceId) === -1) {
        showEvidence(question.evidenceId, function () {
          enableInput();
        });
      } else {
        enableInput();
      }
    });

    updateStatusLine();
  }

  function updateStatusLine() {
    if (elements.statusLine) {
      var status = 'Question ' + state.questionCount;
      if (state.contradictions.length > 0) {
        status += ' \u00A0|\u00A0 Contradictions: ' + state.contradictions.length;
      }
      elements.statusLine.textContent = status;
    }
  }

  // ============================================================
  // ENDING CONDITIONS
  // ============================================================

  function checkEndingConditions() {
    // Deduction triggered during analysis
    if (state.deductionTriggered) {
      // Require minimum questions before allowing ending
      if (state.questionCount >= CONFIG.minQuestionsBeforeEnd) {
        triggerEnding('deduction');
        return true;
      }
    }

    // Check if we've hit max questions
    if (state.questionCount >= CONFIG.maxQuestions) {
      determineEnding();
      return true;
    }

    return false;
  }

  function determineEnding() {
    if (state.honestyScore >= CONFIG.honestyThreshold && (state.hasExpressedRemorse || state.hasAdmittedLying)) {
      triggerEnding('deduction');
    } else if (state.honestyScore <= (1 - CONFIG.perjuryThreshold) && !state.hasAdmittedLying) {
      triggerEnding('stubbornPerjury');
    } else {
      triggerEnding('revelation');
    }
  }

  function triggerEnding(endingType) {
    state.gameOver = true;
    disableInput();

    var endingText;
    var endingKey;

    if (endingType === 'deduction' || state.deductionTriggered) {
      endingKey = 'deduction';
      endingText = CASEFILE.endings.deduction.text;
    } else if (endingType === 'stubbornPerjury') {
      endingKey = 'stubbornPerjury';
      endingText = CASEFILE.endings.stubbornPerjury.text;
    } else {
      endingKey = 'revelation';
      endingText = CASEFILE.endings.revelation.text;
    }

    addBlankLine();
    addSeparator();
    addBlankLine();

    if (endingKey === 'revelation') {
      showRevelationSequence(function () {
        displayEndingText(endingText, endingKey);
      });
    } else {
      displayEndingText(endingText, endingKey);
    }
  }

  function showRevelationSequence(callback) {
    var evidenceSequence = ['internalAudit', 'deathCertificate', 'theLetter'];
    var idx = 0;

    function showNext() {
      if (idx >= evidenceSequence.length) {
        callback();
        return;
      }

      var eid = evidenceSequence[idx];
      idx++;

      if (state.evidenceIntroduced.indexOf(eid) === -1) {
        showEvidence(eid, function () {
          showNext();
        });
      } else {
        showNext();
      }
    }

    showNext();
  }

  function displayEndingText(text, endingKey) {
    addLine('narration', text, function () {
      addBlankLine();
      addSeparator();
      addBlankLine();

      var endLabel = document.createElement('div');
      endLabel.className = 'line ending-label';

      if (endingKey === 'deduction') {
        endLabel.textContent = 'ENDING: DEDUCTION';
      } else if (endingKey === 'stubbornPerjury') {
        endLabel.textContent = 'ENDING: STUBBORN PERJURY';
      } else {
        endLabel.textContent = 'ENDING: REVELATION';
      }

      elements.transcript.appendChild(endLabel);
      scrollToBottom();

      addBlankLine();

      var stats = document.createElement('div');
      stats.className = 'line stats';
      stats.innerHTML =
        '<div>Questions asked: ' + state.questionCount + '</div>' +
        '<div>Contradictions detected: ' + state.contradictions.length + '</div>' +
        '<div>Elena Voss, 1978\u20132019</div>';

      elements.transcript.appendChild(stats);
      scrollToBottom();

      addBlankLine();

      var restartBtn = document.createElement('button');
      restartBtn.className = 'restart-btn';
      restartBtn.textContent = '[ BEGIN AGAIN ]';
      restartBtn.addEventListener('click', function () {
        restartGame();
      });
      elements.transcript.appendChild(restartBtn);
      scrollToBottom();
    });
  }

  // ============================================================
  // GAME FLOW
  // ============================================================

  function startGame() {
    state = createInitialState();
    phaseQuestionIndex = {};
    isTyping = false;

    if (elements.transcript) {
      elements.transcript.innerHTML = '';
    }

    if (elements.inputArea) {
      elements.inputArea.classList.add('hidden');
    }

    if (elements.evidencePanel) {
      elements.evidencePanel.classList.add('hidden');
    }

    updatePhaseIndicator();

    setTimeout(function () {
      addLine('system', 'UNITED STATES DISTRICT COURT', function () {
        addLine('system', 'NORTHERN DISTRICT OF ILLINOIS', function () {
          addLine('system', 'GRAND JURY PROCEEDING \u2014 MATERIAL WITNESS EXAMINATION', function () {
            addLine('system', 'Case No. 24-GJ-00187', function () {
              addLine('system', 'Date: March 18, 2024', function () {
                addLine('system', 'Prosecutor: AUSA Marcus Webb', function () {
                  addBlankLine();
                  addLine('narration', 'The courtroom is smaller than you expected. Wood paneling. Fluorescent lights. A court reporter in the corner, fingers ready. The prosecutor sets a thin file on the table. Your name is on it.', function () {
                    addLine('narration', 'You are a material witness. You are under oath. You do not yet understand why you are really here.', function () {
                      addBlankLine();
                      addSeparator();
                      addBlankLine();
                      state.phase = PHASES.INTRO;
                      askNextQuestion();
                    });
                  });
                });
              });
            });
          });
        });
      });
    }, 600);
  }

  function restartGame() {
    clearInput();
    startGame();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function init() {
    cacheElements();

    if (elements.inputField) {
      elements.inputField.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var val = elements.inputField.value.trim();
          if (val && state.waitingForInput && !isTyping) {
            handleInput(val);
            clearInput();
          }
        }
      });
    }

    if (elements.submitBtn) {
      elements.submitBtn.addEventListener('click', function () {
        var val = elements.inputField.value.trim();
        if (val && state.waitingForInput && !isTyping) {
          handleInput(val);
          clearInput();
        }
      });
    }

    if (typeof CASEFILE === 'undefined') {
      console.error('CASEFILE not loaded. Ensure casefile.js is included before game.js.');
      return;
    }

    startGame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
