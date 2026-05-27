/**
 * THE QUIETING WARD — Chart Logic
 * Handles user input, validation, submission, and the reveal sequence.
 */

(function () {
    'use strict';

    // Clinical indicators — broad enough that any genuine observation
    // will match at least two, specific enough to block evasive non-answers.
    var CLINICAL_INDICATORS = [
        'patient', 'responsive', 'awake', 'alert', 'sleeping', 'resting',
        'pain', 'comfortable', 'comfort', 'vitals', 'stable',
        'oriented', 'confused', 'agitated', 'calm', 'quiet', 'pale',
        'skin', 'breathing', 'respiratory', 'pulse', 'blood pressure',
        'temperature', 'urine', 'output', 'intake', 'foley',
        'medication', 'administered', 'assessed', 'assessment', 'observed',
        'reports', 'stated', 'denies', 'complains', 'ambulatory', 'bedbound',
        'mobility', 'transfer', 'position', 'repositioned', 'wound',
        'pressure', 'ulcer', 'edema', 'swelling', 'color',
        'warm', 'cool', 'diaphoretic', 'dry', 'moist', 'lung', 'lungs',
        'heart', 'abdomen', 'abdominal', 'bowel', 'sounds', 'normoactive',
        'hypoactive', 'tender', 'distended', 'guarding',
        'movement', 'strength', 'grip', 'pupil', 'pupils', 'speech',
        'slurred', 'clear', 'garbled', 'mumbled', 'whispered',
        'eye', 'eyes', 'contact', 'tracking', 'following', 'responding',
        'arousable', 'lethargic', 'somnolent', 'drowsy', 'fatigued',
        'weakness', 'weak', 'tone', 'reflex', 'reflexes',
        'appetite', 'eating', 'drank', 'refused', 'tolerated',
        'nausea', 'vomiting', 'emesis', 'diarrhea', 'constipation',
        'oral', 'intravenous', 'iv',
        'site', 'dressing', 'clean', 'intact', 'redness',
        'drainage', 'odor', 'bleeding', 'cyanosis',
        'tremor', 'seizure', 'headache', 'chest',
        'shortness', 'dyspnea', 'cough', 'wheeze',
        'rales', 'rhonchi', 'crackles', 'murmur',
        'capillary', 'refill', 'peripheral', 'extremity', 'extremities',
        'numbness', 'tingling', 'sensation',
        'mood', 'affect', 'anxious', 'depressed',
        'tearful', 'crying', 'withdrawn', 'engaged', 'disengaged',
        'unresponsive', 'minimally',
        'pupillary', 'posturing', 'gait', 'balance', 'fall',
        'bed', 'chair', 'standing', 'sitting', 'lying',
        'bilateral', 'left', 'right',
        'discomfort', 'ache', 'sharp', 'dull', 'burning',
        'throbbing', 'radiating', 'cramping',
        'tenderness', 'soft', 'cachectic', 'muscle', 'atrophy',
        'noted', 'remains',
        'conscious', 'consciousness', 'arousal',
        'stimuli', 'response', 'respond',
        'declined', 'declining', 'improved', 'unchanged',
        'shift', 'during', 'throughout',
        'requested', 'request',
        'difficulty', 'able', 'unable',
        'appears', 'appears to be'
    ];

    var MIN_LENGTH = 15;
    var MAX_LENGTH = 500;
    var MIN_CLINICAL_MATCHES = 2;

    /**
     * Sanitize a string for safe HTML insertion.
     */
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Returns true if the text contains at least MIN_CLINICAL_MATCHES
     * distinct clinical indicator terms.
     */
    function hasClinicalContent(text) {
        var lower = text.toLowerCase();
        if (text.trim().length < MIN_LENGTH) return false;
        var matchCount = 0;
        for (var i = 0; i < CLINICAL_INDICATORS.length; i++) {
            if (lower.indexOf(CLINICAL_INDICATORS[i]) !== -1) {
                matchCount++;
                if (matchCount >= MIN_CLINICAL_MATCHES) return true;
            }
        }
        return false;
    }

    /**
     * Format current time as a four-digit military string (e.g. "1437").
     */
    function currentMilitaryTime() {
        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        return h + m;
    }

    // ── DOM references ──
    var authorInput      = document.getElementById('author-name');
    var observationInput = document.getElementById('observation');
    var charCurrent      = document.getElementById('char-current');
    var submitBtn        = document.getElementById('submit-btn');
    var validationMsg    = document.getElementById('validation-msg');
    var chartPhase       = document.getElementById('chart-phase');
    var revealPhase      = document.getElementById('reveal-phase');
    var revealContainer  = document.getElementById('reveal-container');

    // Stamp the current time into the note header
    document.getElementById('current-time').textContent = currentMilitaryTime();

    // ── Validation state ──
    var validationTimer = null;

    function updateSubmitState() {
        var obs = observationInput.value.trim();
        var author = authorInput.value.trim();
        var validLength = obs.length >= MIN_LENGTH && obs.length <= MAX_LENGTH;
        var validClinical = hasClinicalContent(obs);
        var validAuthor = author.length > 0;
        submitBtn.disabled = !(validLength && validClinical && validAuthor);
    }

    function showValidation(msg) {
        validationMsg.textContent = msg;
        validationMsg.style.opacity = '1';
        if (validationTimer) clearTimeout(validationTimer);
        validationTimer = setTimeout(function () {
            validationMsg.style.opacity = '0';
        }, 4000);
    }

    function updateAuthorDisplay() {
        var val = authorInput.value.trim();
        document.getElementById('input-author').textContent = val || 'YOUR NAME, RN';
    }

    // ── Event listeners ──
    observationInput.addEventListener('input', function () {
        var len = observationInput.value.length;
        charCurrent.textContent = len;
        charCurrent.style.color = len > MAX_LENGTH ? '#8b1a1a' : '';
        updateSubmitState();
    });

    authorInput.addEventListener('input', function () {
        updateAuthorDisplay();
        updateSubmitState();
    });

    submitBtn.addEventListener('click', function () {
        var author = authorInput.value.trim();
        var observation = observationInput.value.trim();

        if (!author) {
            showValidation('Please enter your name and credentials.');
            authorInput.focus();
            return;
        }

        if (!observation) {
            showValidation('Please enter your clinical observation.');
            observationInput.focus();
            return;
        }

        if (observation.length > MAX_LENGTH) {
            showValidation('Observation exceeds 500 character limit.');
            observationInput.focus();
            return;
        }

        if (!hasClinicalContent(observation)) {
            showValidation('Entry requires clinical documentation language to be accepted.');
            observationInput.focus();
            return;
        }

        // Lock the form
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting\u2026';
        authorInput.disabled = true;
        observationInput.disabled = true;

        // Brief processing delay, then reveal
        setTimeout(function () {
            buildReveal(author, observation);
            transitionToReveal();
        }, 1500);
    });

    // ── Phase transition ──
    function transitionToReveal() {
        chartPhase.style.transition = 'opacity 0.8s ease';
        chartPhase.style.opacity = '0';

        setTimeout(function () {
            chartPhase.style.display = 'none';
            revealPhase.style.display = 'block';
            revealPhase.classList.remove('hidden-phase');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Begin the staggered reveal after the page settles
            setTimeout(animateReveal, 600);
        }, 800);
    }

    function animateReveal() {
        var items = revealContainer.querySelectorAll('.basis-item');
        var i;

        for (i = 0; i < items.length; i++) {
            (function (idx) {
                setTimeout(function () {
                    items[idx].classList.add('revealed');
                }, idx * 400);
            })(i);
        }

        // DNR stamp appears after all basis items
        var stampDelay = items.length * 400 + 600;
        setTimeout(function () {
            var stamp = revealContainer.querySelector('.dnr-stamp');
            if (stamp) stamp.classList.add('stamped');
        }, stampDelay);

        // Closing text fades in after the stamp settles
        setTimeout(function () {
            var closing = revealContainer.querySelector('.reveal-closing');
            if (closing) closing.classList.add('visible');
        }, stampDelay + 2000);
    }

    // ── Build the reveal document ──
    function buildReveal(author, observation) {
        var userObs = escapeHtml(observation);
        var authorClean = escapeHtml(author);

        revealContainer.innerHTML =
            '<div class="reveal-document">' +

                '<div class="reveal-header">' +
                    '<h1>Physician Order \u2014 Status Change</h1>' +
                    '<div class="reveal-subtitle">WESTRIDGE MEDICAL CENTER \u00a0|\u00a0 UNIT 4-TELE \u00a0|\u00a0 ROOM 4-712</div>' +
                '</div>' +

                '<div class="reveal-meta">' +
                    '<div class="reveal-meta-field">' +
                        '<span class="reveal-meta-label">Patient:</span>' +
                        '<span class="reveal-meta-value">MARIN, R.</span>' +
                    '</div>' +
                    '<div class="reveal-meta-field">' +
                        '<span class="reveal-meta-label">MRN:</span>' +
                        '<span class="reveal-meta-value">45892-001</span>' +
                    '</div>' +
                    '<div class="reveal-meta-field">' +
                        '<span class="reveal-meta-label">Date:</span>' +
                        '<span class="reveal-meta-value">12/14/2024</span>' +
                    '</div>' +
                    '<div class="reveal-meta-field">' +
                        '<span class="reveal-meta-label">Physician:</span>' +
                        '<span class="reveal-meta-value">D.K. VOSS, MD</span>' +
                    '</div>' +
                '</div>' +

                '<div class="reveal-section">' +
                    '<div class="reveal-section-title">Order Summary</div>' +
                    '<div class="reveal-text">' +
                        '<p>Based on clinical assessment and documented evidence of progressive decline, the following changes are ordered effective immediately:</p>' +
                    '</div>' +
                '</div>' +

                '<div class="reveal-order-block">' +
                    '<strong>NEW ORDERS</strong>' +
                    '<p>1. Code status changed to <strong>DNR / DNI</strong>. Full code rescinded.</p>' +
                    '<p>2. IV fluids discontinued. Saline lock in place for PRN medication administration only.</p>' +
                    '<p>3. All routine medications held. Morphine 2 mg IV q2h PRN comfort. Haloperidol 0.5 mg IV q8h scheduled.</p>' +
                    '<p>4. Diet changed to comfort feeds. No dietary restrictions.</p>' +
                    '<p>5. Vital signs q12h. Routine labs held.</p>' +
                    '<p>6. Hudson Valley Hospice contacted, acceptance confirmed. Transfer estimated 24\u201348 hours.</p>' +
                '</div>' +

                '<div class="weaponized-section">' +
                    '<div class="basis-item">' +
                        'Patient demonstrating progressive decline in oral intake over 72+ hours. Three consecutive shifts of negative fluid balance. Nutritional support down-titrated without clinical objection.' +
                        '<span class="source">\u2014 Nursing progress notes, 12/12\u201312/14</span>' +
                    '</div>' +
                    '<div class="basis-item">' +
                        'Patient increasingly withdrawn with minimal spontaneous speech, reduced eye contact, declining responsiveness to stimuli. No longer initiates communication. Arousal to voice requires repeated effort.' +
                        '<span class="source">\u2014 Nursing progress notes, 12/13\u201312/14</span>' +
                    '</div>' +
                    '<div class="basis-item">' +
                        'Hemodynamic parameters stable but trending downward \u2014 gradual reduction in blood pressure and heart rate over 48 hours consistent with natural decline rather than acute decompensation.' +
                        '<span class="source">\u2014 Vital signs flow sheet, 12/12\u201312/14</span>' +
                    '</div>' +
                    '<div class="basis-item user-item">' +
                        userObs +
                        '<span class="source">\u2014 ' + authorClean + ', RN (12/14, most recent nursing assessment prior to order)</span>' +
                    '</div>' +
                    '<div class="basis-item">' +
                        'Family (daughter, healthcare proxy) counseled regarding trajectory. Patient has no surviving spouse. No advance directive on file at admission. Daughter agrees with comfort-focused approach.' +
                        '<span class="source">\u2014 Physician note 12/13 1700; Social work note 12/13</span>' +
                    '</div>' +
                '</div>' +

                '<div class="dnr-stamp">' +
                    '<div class="dnr-stamp-text">DNR / DNI</div>' +
                    '<div class="dnr-stamp-sub">DO NOT RESUSCITATE \u00a0\u00b7\u00a0 DO NOT INTUBATE</div>' +
                '</div>' +

                '<div class="reveal-signatures">' +
                    '<div class="sig-block">' +
                        '<div class="sig-line">D.K. Voss, MD \u2014 Internal Medicine</div>' +
                    '</div>' +
                    '<div class="sig-block">' +
                        '<div class="sig-line">Witnessed by: ' + authorClean + ', RN</div>' +
                    '</div>' +
                '</div>' +

                '<div class="reveal-closing">' +
                    '<p>WESTRIDGE MEDICAL CENTER \u2014 CONFIDENTIAL PATIENT RECORD</p>' +
                    '<p style="margin-top:8px;font-size:9px;color:#aaa;">Your observation has been incorporated into the permanent medical record.<br>Chart locked. No further entries permitted.</p>' +
                '</div>' +

            '</div>';
    }
})();
