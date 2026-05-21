/**
 * Language Engine for Sleeper
 *
 * The escalation system. Anomaly descriptions exist at three tone levels:
 * clinical, suspicious, accusatory. The engine selects which level to use
 * based on cumulative anomaly count — not individual severity.
 *
 * This is the core of the artifact: a tool that becomes less objective
 * the more it finds, regardless of what it's finding.
 */

class LanguageEngine {
  constructor() {
    this.anomalyCount = 0;
    this.accumulatedTerms = new Set();
    this.sessionId = Date.now();
  }

  feedAnomalies(anomalies) {
    this.anomalyCount = anomalies.length;

    // Accumulate suspicious terms across the session
    anomalies.forEach(a => {
      if (a.type) this.accumulatedTerms.add(a.type);
      if (a.commit) this.accumulatedTerms.add(a.commit);
    });
  }

  getState() {
    return {
      count: this.anomalyCount,
      phase: this._phase(),
      termAccumulation: this.accumulatedTerms.size
    };
  }

  _phase() {
    if (this.anomalyCount <= 3) return 'clinical';
    if (this.anomalyCount <= 7) return 'suspicious';
    return 'accusatory';
  }

  /**
   * Format a single anomaly with tone-appropriate language.
   * The same finding reads differently depending on how many
   * findings came before it.
   */
  formatAnomaly(anomaly, index) {
    const phase = this._phase();

    // Use pre-written phase-specific text if available
    const headline = anomaly[phase] || anomaly.suspicious || anomaly.clinical || anomaly.description;

    // Escalate terms based on accumulation
    const escalated = this._escalateTerms(headline, phase);

    const formatted = {
      headline: escalated,
      phase: phase,
      severity: anomaly.severity
    };

    // Postscripts emerge at higher counts
    if (this.anomalyCount > 5) {
      formatted.whisper = this._generateWhisper(anomaly, phase);
    }

    return formatted;
  }

  /**
   * Generate the summary that appears after all anomalies.
   * This is where the tone shift becomes most visible.
   */
  generateSummary(anomalies) {
    const phase = this._phase();
    const count = anomalies.length;
    const categories = new Set(anomalies.map(a => a.category));

    const summaries = {
      clinical: [
        `Analysis complete. ${count} anomalies identified across ${categories.size} categories.`,
        `Review individual findings above for severity assessment.`,
        `Timestamp and metadata anomalies are common in collaborative repositories.`
      ],
      suspicious: [
        `${count} anomalies detected. The pattern warrants investigation.`,
        `Several findings suggest intervention in the commit timeline.`,
        `Not every anomaly indicates tampering — but the accumulation is notable.`
      ],
      accusatory: [
        `${count} anomalies. The timeline is compromised.`,
        `Someone — or something — has been modifying this repository.`,
        `The gaps between commits tell a story. The question is whether it's yours.`,
        `Recommend reviewing commit access logs and SSH keys.`
      ]
    };

    const lines = summaries[phase] || summaries.clinical;

    const postscripts = {
      clinical: null,
      suspicious: 'Run sleeper --clear to establish a new baseline. Or don\'t — the history will remain.',
      accusatory: 'The --clear flag exists. It will not help. The anomalies are in the repository, not the tool.'
    };

    return {
      lines,
      postscript: postscripts[phase]
    };
  }

  /**
   * Term escalation: replace clinical terms with charged alternatives
   * as anomaly count rises. "Anomaly" becomes "evidence." "Detected"
   * becomes "identified." The vocabulary of science becomes the
   * vocabulary of indictment.
   */
  _escalateTerms(text, phase) {
    if (phase === 'clinical') return text;

    const escalations = {
      suspicious: [
        { from: /\banomaly detected\b/gi, to: 'irregularity identified' },
        { from: /\btimestamp drift\b/gi, to: 'temporal manipulation' },
        { from: /\bpattern deviation\b/gi, to: 'behavioral divergence' },
        { from: /\bdetected\b/gi, to: 'identified' },
        { from: /\bfound\b/gi, to: 'uncovered' },
        { from: /\bobserved\b/gi, to: 'surfaced' }
      ],
      accusatory: [
        { from: /\birregularity identified\b/gi, to: 'evidence of interference' },
        { from: /\btemporal manipulation\b/gi, to: 'timeline reconstruction' },
        { from: /\bbehavioral divergence\b/gi, to: 'identity violation' },
        { from: /\bidentified\b/gi, to: 'exposed' },
        { from: /\bno corresponding session\b/gi, to: 'no authorized session' },
        { from: /\bunusual\b/gi, to: 'unexplained' },
        { from: /\bunknown origin\b/gi, to: 'unauthorized origin' }
      ]
    };

    let result = text;
    const applicable = escalations[phase] || [];
    applicable.forEach(({ from, to }) => {
      result = result.replace(from, to);
    });

    return result;
  }

  /**
   * Whispers: brief, unsettling asides that appear after anomalies
   * when the count gets high enough. Not full sentences. Fragments.
   */
  _generateWhisper(anomaly, phase) {
    if (phase === 'clinical') return null;

    const whispers = {
      suspicious: [
        '(who else has access?)',
        '(when did you last check?)',
        '(was this you?)',
        '(check the access logs)',
        '(the timing is wrong)',
        '(this is not normal)',
        '(something changed)'
      ],
      accusatory: [
        'you should check your ssh keys',
        'have you reviewed authorized_keys recently?',
        'someone was here',
        'this is not a drill',
        'the history does not lie — but someone did',
        'who is [unknown]?',
        '03:17',
        'the gap between commits is the gap in your memory',
        'they used your credentials',
        'when did you last change your password?'
      ]
    };

    const pool = whispers[phase] || whispers.suspicious;
    // Deterministic selection based on anomaly properties
    const index = (anomaly.type || '').length % pool.length;
    return pool[index];
  }

  /**
   * Generate the "commit message annotations" that appear
   * when the tool annotates specific commits with suspicion.
   */
  annotateCommit(commitSubject, phase) {
    const annotations = {
      clinical: null,
      suspicious: [
        '← the wording here is worth examining',
        '← why this message?',
        '← was this the original message?',
        '← who chooses these words?'
      ],
      accusatory: [
        '← this is not your writing',
        '← you did not write this',
        '← someone composed this message in your name',
        '← the voice is wrong',
        '← this was not typed by human hands'
      ]
    };

    const pool = annotations[phase];
    if (!pool) return null;

    const index = (commitSubject || '').length % pool.length;
    return pool[index];
  }
}

module.exports = { LanguageEngine };
