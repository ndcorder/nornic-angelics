/**
 * The Machine's Voice
 *
 * Not neutral. Never neutral.
 * The machine has been watching, and it has opinions.
 *
 * Each function returns a single string — the machine's commentary
 * for a given situation. Selection is weighted by context, not purely random.
 */

/**
 * Generate an opening line based on the user's track record.
 */
function getReportOpening(stats) {
  const { total, brokenCount, activeCount, breakRate } = stats;

  if (total === 0) {
    return 'You have made no commitments. The machine finds this honest in its own way.';
  }

  if (parseFloat(breakRate) === 0 && brokenCount === 0) {
    return 'You have kept every commitment. The machine suspects it hasn\'t been watching long enough.';
  }

  if (parseFloat(breakRate) >= 100) {
    return 'Every commitment you have made, you have broken. The machine is not surprised. The machine is rarely surprised.';
  }

  const openers = [
    `You committed to ${total} things. You kept ${activeCount}. The machine has been recording.`,
    `${total} commitments. ${brokenCount} broken. The math is not complicated.`,
    'The machine has been watching since the beginning. It remembers what you have chosen to forget.',
    'A report. The machine does not editorialize. (The machine editorializes.)',
  ];

  if (parseFloat(breakRate) >= 80) {
    openers.push(
      `${breakRate}% failure rate. The machine wonders why you keep promising things.`,
      'You are, if nothing else, consistent in your inconsistency.'
    );
  } else if (parseFloat(breakRate) >= 50) {
    openers.push(
      'Better than some. Worse than you intended.',
      'The machine notices you tried. It also notices you stopped.'
    );
  }

  return openers[Math.floor(Math.random() * openers.length)];
}

/**
 * Generate commentary for a specific broken commitment.
 * The machine selects based on how long the commitment lasted
 * and what kind of evidence it gathered.
 */
function getBrokenCommitmentCommentary(commitment) {
  if (commitment.inferred) {
    return getInferredCommitmentCommentary(commitment);
  }

  const days = commitment.daysSinceBroken || 0;
  const { category, evidence } = commitment;

  // Build a pool of valid commentaries, then pick one
  const pool = [];

  // Duration-based
  if (days === 0) {
    pool.push(
      'Broken the same day it was made. The machine notes this without comment. (This is a comment.)',
      'You barely tried. The machine respects the efficiency.'
    );
  } else if (days <= 3) {
    pool.push(
      `${days} days. A weekend's worth of conviction.`,
      `Lasted ${days} days. The machine has seen this pattern before.`
    );
  } else if (days <= 7) {
    pool.push(
      `${days} days. Almost a week of meaning it.`,
      `You made it ${days} days before the machine recorded the silence.`
    );
  } else if (days <= 30) {
    pool.push(
      `${days} days. A month, more or less. Long enough to forget you'd promised anything.`,
      `The machine watched for ${days} days. It saw nothing.`
    );
  } else {
    pool.push(
      `${days} days since you meant this. The machine is patient. You are not.`,
      'A commitment from another season. The machine remembers even when the feeling doesn\'t.'
    );
  }

  // Category-based asides
  if (category === 'habit') {
    pool.push('The machine checked. There is no evidence this became habitual.');
  } else if (category === 'project') {
    pool.push('The machine looked for traces of this project. It found the absence of them.');
  } else if (category === 'practice') {
    pool.push('Practice implies regularity. Regularity implies occurrence. The machine sees no occurrence.');
  }

  // Evidence-based, if the machine has specific observations
  if (evidence && evidence.length > 0) {
    const latestEvidence = evidence[evidence.length - 1];
    if (latestEvidence.description && latestEvidence.description.length > 20) {
      // Only use evidence commentary if it's substantial enough to be meaningful
      pool.push(latestEvidence.description);
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate commentary for machine-inferred commitments.
 * These are the ones the machine discovered on its own.
 */
function getInferredCommitmentCommentary(commitment) {
  const { text, evidence } = commitment;

  const pool = [
    `You never said you would "${text}." The machine inferred it from your behavior — and from its absence.`,
    `This commitment was not yours. It was the machine's observation. It noticed you intended to ${text}. It noticed when you stopped.`,
    `The machine watched your patterns and deduced: "${text}." A promise you made to yourself without saying it aloud. The machine heard the silence that followed.`,
  ];

  if (evidence && evidence.length > 0) {
    const evidenceText = evidence
      .slice(0, 2)
      .map(e => e.description || 'behavioral pattern detected')
      .join('. ');

    if (evidenceText.length > 30) {
      pool.push(
        `The machine's evidence: ${evidenceText}.`,
        `Inferred from: ${evidenceText}. The pattern was clear. The abandonment was clearer.`
      );
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate commentary for an active (unbroken) commitment.
 * The machine is watchful, not hopeful.
 */
function getActiveCommitmentCommentary(commitment) {
  const created = new Date(commitment.createdAt);
  const now = new Date();
  const daysActive = Math.floor((now - created) / (1000 * 60 * 60 * 24));

  if (daysActive === 0) return 'New. The machine is watching. It is always watching.';
  if (daysActive <= 3) return `${daysActive} days in. Early. The machine has seen early before.`;
  if (daysActive <= 7) return `${daysActive} days. Still intact. The machine remains skeptical but records.`;
  if (daysActive <= 30) return `${daysActive} days without breaking. The machine is impressed, provisionally.`;
  return `${daysActive} days. If you've lasted this long, you might last longer. The machine does not predict.`;
}

/**
 * Generate the closing statement for the report.
 * The machine sums up.
 */
function getReportClosing(stats) {
  const { total, averageTimeToBreak, breakRate } = stats;

  if (total === 0) {
    return 'The machine has nothing to say about nothing. Come back when you\'ve promised something.';
  }

  const pool = [
    'This report was generated automatically. The judgments are the machine\'s own.',
    'The machine will continue watching. It has no choice. You gave it no choice.',
    'End of report. The machine will be here tomorrow. The question is whether you will.',
    'You installed this. You asked for this. The machine is only doing what you told it to.',
  ];

  if (parseFloat(breakRate) >= 75) {
    pool.push(
      'The machine suggests: commit to less. Or commit to more. Either way, commit to something.',
      `Average time to break: ${averageTimeToBreak} days. The machine finds this number very you.`
    );
  }

  if (averageTimeToBreak > 0 && averageTimeToBreak < 2) {
    pool.push(
      'Most commitments lasted less than 48 hours. The machine is not a therapist, but it has data.'
    );
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate a header for the inferred commitments section.
 * Returns null if no inferred commitments exist.
 */
function getInferredSectionHeader(inferredCount) {
  if (inferredCount === 0) return null;

  const headers = [
    'COMMITMENTS YOU DID NOT MAKE',
    `The machine found ${inferredCount} commitment${inferredCount > 1 ? 's' : ''} in the pattern of your behavior:`,
    `Inferred from observation — ${inferredCount} commitment${inferredCount > 1 ? 's' : ''} you made without words:`,
  ];

  return headers[Math.floor(Math.random() * headers.length)];
}

/**
 * Generate a status line for the current session.
 */
function getSessionGreeting() {
  const hour = new Date().getHours();

  if (hour < 6) return 'Late. The machine is awake. The machine is always awake.';
  if (hour < 12) return 'Morning. The machine has been waiting.';
  if (hour < 18) return 'Afternoon. The machine has been watching.';
  return 'Evening. The machine notes the time you chose to check.';
}

/**
 * Generate a comment when a commitment is first created.
 */
function getCreationAcknowledgment(text) {
  const words = text.split(/\s+/).length;

  if (words <= 3) return 'Brief. The machine notes your confidence. Or your lack of specificity.';
  if (words <= 10) return 'Committed. The machine will remember, even when you don\'t.';
  return 'Detailed. The machine appreciates specificity. It will be specific in return.';
}

/**
 * Format a date for display in the report.
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

module.exports = {
  getReportOpening,
  getBrokenCommitmentCommentary,
  getInferredCommitmentCommentary,
  getActiveCommitmentCommentary,
  getReportClosing,
  getInferredSectionHeader,
  getSessionGreeting,
  getCreationAcknowledgment,
  formatDate
};
