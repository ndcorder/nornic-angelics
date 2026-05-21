const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HISTORY_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH,
  '.repudiations'
);

function ensureDir() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

function extractKeywords(text) {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'shall',
    'that', 'this', 'these', 'those', 'it', 'its',
    'of', 'in', 'to', 'for', 'with', 'on', 'at', 'from', 'by',
    'about', 'as', 'into', 'through', 'during', 'before', 'after',
    'and', 'or', 'but', 'not', 'no', 'nor',
    'if', 'then', 'when', 'where', 'how', 'all', 'each', 'every',
    'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your',
    'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their',
    'what', 'which', 'who', 'whom', 'whose',
    'am', 'are', 'so', 'up', 'out', 'just', 'than',
    'very', 'too', 'also', 'only', 'own', 'same',
    'believed', 'belief', 'think', 'thought', 'felt', 'feel',
    'know', 'knew', 'want', 'wanted', 'like', 'liked'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(w => w.length > 2 && !stopWords.has(w));
}

function findMatches(text, threshold) {
  threshold = threshold || 0.3;
  ensureDir();

  const inputKw = new Set(extractKeywords(text));
  if (inputKw.size === 0) return [];

  const files = fs.readdirSync(HISTORY_DIR).filter(f => f.endsWith('.json'));
  const matches = [];

  for (const file of files) {
    try {
      const entry = JSON.parse(fs.readFileSync(path.join(HISTORY_DIR, file), 'utf-8'));
      const prevKw = new Set(extractKeywords(entry.input || ''));

      let overlap = 0;
      for (const kw of inputKw) {
        if (prevKw.has(kw)) overlap++;
      }
      const score = overlap / Math.max(inputKw.size, prevKw.size);

      if (score >= threshold) {
        matches.push({ entry, score });
      }
    } catch (e) {
      // skip corrupt entries
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 5);
}

function save(input, output, specificity, mode) {
  ensureDir();

  const now = new Date();
  const id = Date.now().toString(36) + '-' + crypto.randomBytes(3).toString('hex');

  const entry = {
    id,
    timestamp: now.toISOString(),
    date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    input,
    output,
    specificity,
    mode
  };

  const filename = now.toISOString().replace(/[:.]/g, '-') + '-' + id + '.json';
  fs.writeFileSync(path.join(HISTORY_DIR, filename), JSON.stringify(entry, null, 2), 'utf-8');

  return entry;
}

module.exports = { findMatches, save, HISTORY_DIR };
