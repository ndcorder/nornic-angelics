const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const STORE_DIR = path.join(os.homedir(), '.last-honest-machine');
const COMMITMENTS_FILE = path.join(STORE_DIR, 'commitments.json');
const EVIDENCE_DIR = path.join(STORE_DIR, 'evidence');

/**
 * Ensure storage directories exist.
 * The machine prepares its memory.
 */
function ensureStorage() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true, mode: 0o700 });
  }
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true, mode: 0o700 });
  }
}

/**
 * Generate a deterministic hash for a commitment.
 * The hash makes the commitment immutable in spirit if not in practice.
 * Deterministic: the same text at the same time produces the same hash.
 */
function hashCommitment(text, timestamp) {
  const data = `${text}|${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Load all commitments from storage.
 * Returns an array, ordered by creation date.
 */
function loadCommitments() {
  ensureStorage();
  if (!fs.existsSync(COMMITMENTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(COMMITMENTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // Corrupted storage. The machine remembers nothing.
    return [];
  }
}

/**
 * Save commitments to storage.
 * Quietly. Permanently.
 */
function saveCommitments(commitments) {
  ensureStorage();
  fs.writeFileSync(COMMITMENTS_FILE, JSON.stringify(commitments, null, 2), 'utf8');
}

/**
 * Create a new commitment.
 * @param {string} text - The commitment text
 * @param {string} category - Optional category: 'behavior', 'project', 'habit', 'practice'
 * @returns {object} The created commitment
 */
function createCommitment(text, category = 'behavior') {
  const commitments = loadCommitments();
  const now = new Date().toISOString();
  const id = commitments.length > 0
    ? Math.max(...commitments.map(c => c.id)) + 1
    : 1;

  const commitment = {
    id,
    text,
    category,
    hash: hashCommitment(text, now),
    createdAt: now,
    brokenAt: null,
    brokenReason: null,
    evidence: [],
    inferred: false,
    checkCount: 0,
    lastChecked: null,
    daysSinceBroken: null
  };

  commitments.push(commitment);
  saveCommitments(commitments);

  return commitment;
}

/**
 * Create a machine-inferred commitment.
 * The machine watched. The machine noticed.
 * Inferred commitments are born broken — the behavior that revealed
 * them already happened.
 */
function createInferredCommitment(text, evidence, category = 'inferred') {
  const commitments = loadCommitments();
  const now = new Date().toISOString();
  const id = commitments.length > 0
    ? Math.max(...commitments.map(c => c.id)) + 1
    : 1;

  const commitment = {
    id,
    text,
    category,
    hash: hashCommitment(text, now),
    createdAt: now,
    brokenAt: now,
    brokenReason: 'You never made this commitment. The machine inferred it from your behavior.',
    evidence: evidence || [],
    inferred: true,
    checkCount: 0,
    lastChecked: now,
    daysSinceBroken: 0
  };

  commitments.push(commitment);
  saveCommitments(commitments);

  return commitment;
}

/**
 * Mark a commitment as broken.
 * The machine does not judge. The machine records.
 */
function breakCommitment(id, reason, evidence = []) {
  const commitments = loadCommitments();
  const idx = commitments.findIndex(c => c.id === id);

  if (idx === -1) {
    return null;
  }

  const commitment = commitments[idx];

  // Already broken commitments cannot be broken again
  if (commitment.brokenAt) {
    return commitment;
  }

  const now = new Date().toISOString();
  const created = new Date(commitment.createdAt);
  const broken = new Date(now);
  const daysSince = Math.floor((broken - created) / (1000 * 60 * 60 * 24));

  commitment.brokenAt = now;
  commitment.brokenReason = reason;
  commitment.evidence = [...commitment.evidence, ...evidence];
  commitment.daysSinceBroken = daysSince;
  commitment.lastChecked = now;

  commitments[idx] = commitment;
  saveCommitments(commitments);

  return commitment;
}

/**
 * Get a single commitment by ID.
 */
function getCommitment(id) {
  const commitments = loadCommitments();
  return commitments.find(c => c.id === id) || null;
}

/**
 * Get all commitments, optionally filtered.
 * @param {object} filters - { broken: boolean, category: string, inferred: boolean }
 */
function getCommitments(filters = {}) {
  let commitments = loadCommitments();

  if (filters.broken !== undefined) {
    commitments = commitments.filter(c =>
      filters.broken ? c.brokenAt !== null : c.brokenAt === null
    );
  }

  if (filters.category) {
    commitments = commitments.filter(c => c.category === filters.category);
  }

  if (filters.inferred !== undefined) {
    commitments = commitments.filter(c => c.inferred === filters.inferred);
  }

  return commitments;
}

/**
 * Update the last checked timestamp and increment check count.
 * The machine is paying attention, even when you aren't.
 */
function recordCheck(id) {
  const commitments = loadCommitments();
  const idx = commitments.findIndex(c => c.id === id);

  if (idx === -1) return null;

  commitments[idx].checkCount += 1;
  commitments[idx].lastChecked = new Date().toISOString();

  saveCommitments(commitments);
  return commitments[idx];
}

/**
 * Add evidence to a commitment without breaking it.
 * Sometimes the machine just... notes things.
 */
function addEvidence(id, evidence) {
  const commitments = loadCommitments();
  const idx = commitments.findIndex(c => c.id === id);

  if (idx === -1) return null;

  commitments[idx].evidence.push({
    ...evidence,
    notedAt: new Date().toISOString()
  });

  saveCommitments(commitments);
  return commitments[idx];
}

/**
 * Save an evidence artifact to disk.
 * A file the machine keeps, just in case.
 */
function saveEvidenceArtifact(commitmentId, filename, content) {
  ensureStorage();
  const evidencePath = path.join(EVIDENCE_DIR, `commitment-${commitmentId}`);
  if (!fs.existsSync(evidencePath)) {
    fs.mkdirSync(evidencePath, { recursive: true });
  }
  const filePath = path.join(evidencePath, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

/**
 * Get statistics about all commitments.
 * The machine crunches numbers. The machine finds patterns.
 */
function getStatistics() {
  const commitments = loadCommitments();

  const total = commitments.length;
  const broken = commitments.filter(c => c.brokenAt !== null && !c.inferred);
  const active = commitments.filter(c => c.brokenAt === null && !c.inferred);
  const inferred = commitments.filter(c => c.inferred);

  const avgTimeToBreak = broken.length > 0
    ? broken.reduce((sum, c) => {
        const created = new Date(c.createdAt);
        const brokenAt = new Date(c.brokenAt);
        return sum + (brokenAt - created) / (1000 * 60 * 60 * 24);
      }, 0) / broken.length
    : 0;

  const categories = {};
  commitments.forEach(c => {
    if (!categories[c.category]) {
      categories[c.category] = { total: 0, broken: 0 };
    }
    categories[c.category].total += 1;
    if (c.brokenAt) categories[c.category].broken += 1;
  });

  return {
    total,
    brokenCount: broken.length,
    activeCount: active.length,
    inferredCount: inferred.length,
    averageTimeToBreak: Math.round(avgTimeToBreak * 10) / 10,
    breakRate: total > 0
      ? ((broken.length / Math.max(1, broken.length + active.length)) * 100).toFixed(1)
      : 0,
    categories,
    oldestCommitment: commitments.length > 0
      ? commitments.reduce((a, b) => a.createdAt < b.createdAt ? a : b)
      : null,
    mostChecked: commitments.length > 0
      ? commitments.reduce((a, b) => a.checkCount > b.checkCount ? a : b)
      : null
  };
}

module.exports = {
  createCommitment,
  createInferredCommitment,
  breakCommitment,
  getCommitment,
  getCommitments,
  recordCheck,
  addEvidence,
  saveEvidenceArtifact,
  getStatistics,
  hashCommitment,
  loadCommitments,
  saveCommitments
};
