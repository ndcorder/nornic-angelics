const history = require('./history');
const bureaucratic = require('./registers/bureaucratic');
const formal = require('./registers/formal');
const forensic = require('./registers/forensic');

function analyzeSpecificity(input) {
  if (!input || input.trim().length === 0) return 0;

  const text = input.trim();
  let score = 0;

  // Length: more text implies more substance
  if (text.length > 20) score += 0.08;
  if (text.length > 60) score += 0.08;
  if (text.length > 150) score += 0.08;
  if (text.length > 300) score += 0.08;

  // Contains a proper noun (capitalized word not at sentence start)
  const midCapitalized = /\s[A-Z][a-z]+/.test(text);
  if (midCapitalized) score += 0.12;

  // Contains a date or time reference
  const datePatterns = [
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d/i,
    /\b(yesterday|last\s+(week|month|year|time)|ago)\b/i,
    /\b(when|on\s+(that|the)\s+(day|night|morning|evening))\b/i
  ];
  for (const pattern of datePatterns) {
    if (pattern.test(text)) {
      score += 0.1;
      break;
    }
  }

  // Specific references: quoted speech, promises, concrete events
  const specificIndicators = [
    /["'][^"']+["']/,
    /\b(promised|promise|vowed|swore|pledged|guaranteed)\b/i,
    /\b(said|told|claimed|asserted|insisted|declared)\b/i,
    /\b(remember|recall|can still|still\s+remember)\b/i,
    /\b(because|due\s+to|result\s+of|consequence)\b/i,
    /\b(happened|occurred|took\s+place)\b/i,
    /\b(never|always|every\s+(time|single))\b/i,
    /\b(exactly|specifically|precisely)\b/i
  ];
  let specificCount = 0;
  for (const pattern of specificIndicators) {
    if (pattern.test(text)) specificCount++;
  }
  score += Math.min(specificCount * 0.08, 0.24);

  // Sentence count
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 3) score += 0.06;
  if (sentences.length >= 5) score += 0.06;

  // Named third party combined with a proper noun
  if (/\b(he|she|they|him|her|them)\b/i.test(text) && midCapitalized) score += 0.08;

  return Math.min(score, 1.0);
}

function determineMode(specificity) {
  if (specificity < 0.25) return 'bureaucratic';
  if (specificity < 0.55) return 'formal';
  return 'forensic';
}

function generateReferenceNumber() {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `REP-${y}-${n}`;
}

function extractSpecifics(input) {
  const text = input.trim();
  if (text.length < 30) return null;

  // Strip common filler openings
  const cleaned = text
    .replace(/^(i\s+want\s+to\s+)?(repudiate|renounce|disavow)\s*/i, '')
    .replace(/^(this\s+is\s+about|regarding|concerning)\s*/i, '')
    .trim();

  if (cleaned.length > 25) {
    return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }
  return null;
}

function extractContextRef(input) {
  const contextMatch = input.match(
    /(?:despite|even\s+(?:though|if|after)|regardless\s+of|in\s+spite\s+of)\s+(.+?)(?:\.|$)/i
  );
  if (contextMatch) return contextMatch[1].trim();
  return null;
}

function formatDate(date) {
  date = date || new Date();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatPreviousRepudiations(matches) {
  if (!matches || matches.length === 0) return null;

  const lines = [];

  for (let i = 0; i < matches.length; i++) {
    const entry = matches[i].entry;
    const inputPreview = entry.input.length > 100
      ? entry.input.substring(0, 100) + '...'
      : entry.input;

    // Pull one sharp line from the previous output
    const outputLines = entry.output.split('\n').filter(l => l.trim().length > 10);
    const excerpt = outputLines.length > 2
      ? outputLines[Math.min(4, outputLines.length - 1)]
      : outputLines[0];

    lines.push(`PREVIOUS REPUDIATION (${entry.mode.toUpperCase()}, ${entry.date})`);
    lines.push(`Input: "${inputPreview}"`);
    lines.push(`"${excerpt.trim()}"`);
    lines.push('');
  }

  lines.push('The above addressed the same subject. This document joins that record.');
  lines.push('');

  return lines.join('\n');
}

function process(input) {
  const specificity = analyzeSpecificity(input);
  const mode = determineMode(specificity);
  const date = formatDate();
  const ref = generateReferenceNumber();

  const matches = history.findMatches(input, 0.3);
  const priorSection = formatPreviousRepudiations(matches);

  let output;

  switch (mode) {
    case 'bureaucratic':
      output = bureaucratic.generate(input, date, ref);
      break;
    case 'formal':
      output = formal.generate(input, date);
      break;
    case 'forensic':
      output = forensic.generate(input, date, extractSpecifics(input), extractContextRef(input));
      break;
    default:
      output = bureaucratic.generate(input, date, ref);
  }

  if (priorSection) {
    output = priorSection + '\n' + output;
  }

  history.save(input, output, specificity, mode);

  return { output, mode, specificity };
}

module.exports = {
  analyzeSpecificity,
  determineMode,
  process
};
