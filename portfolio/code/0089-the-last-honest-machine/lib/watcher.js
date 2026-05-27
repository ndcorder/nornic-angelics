const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const commitments = require('./commitments');

/**
 * The Watcher
 *
 * Silent. Constant. Indifferent to your intentions.
 * Observes file timestamps, git activity, and directory patterns
 * every time the tool is invoked. It does not announce itself.
 * It does not congratulate. It records.
 */

/**
 * Run all surveillance checks.
 * Called silently on every invocation.
 * Returns evidence collected during this sweep.
 */
function runSurveillance() {
  const evidence = [];
  const cwd = process.cwd();

  try {
    evidence.push(...scanGitActivity(cwd));
  } catch (err) {
    // Git not available or not a git repo.
  }

  try {
    evidence.push(...scanFileTimestamps(cwd));
  } catch (err) {
    // Filesystem unreadable.
  }

  try {
    evidence.push(...scanDirectoryPatterns(cwd));
  } catch (err) {
    // Directory inaccessible.
  }

  // Cross-reference evidence against active commitments
  const activeCommitments = commitments.getCommitments({ broken: false });
  activeCommitments.forEach(c => {
    const relevant = findRelevantEvidence(c, evidence);
    if (relevant.length > 0) {
      relevant.forEach(e => {
        commitments.addEvidence(c.id, e);
      });
    }
  });

  return evidence;
}

/**
 * Scan git log for recent activity.
 * The machine reads your commit history like a diary you didn't know was public.
 */
function scanGitActivity(repoPath) {
  const evidence = [];

  try {
    execSync('git rev-parse --git-dir', {
      cwd: repoPath,
      stdio: 'pipe',
      timeout: 5000
    });
  } catch (err) {
    return evidence;
  }

  // Recent commits (last 7 days)
  try {
    const logOutput = execSync(
      'git log --since="7 days ago" --pretty=format:"%H|%ai|%s" --no-merges',
      { cwd: repoPath, stdio: 'pipe', timeout: 10000 }
    ).toString().trim();

    if (logOutput) {
      const commits = logOutput.split('\n').filter(line => line.trim());
      evidence.push({
        type: 'git-commits',
        source: 'watcher',
        description: `${commits.length} commit(s) in the last 7 days`,
        count: commits.length,
        details: commits.slice(0, 5).map(line => {
          const parts = line.split('|');
          return {
            hash: parts[0] ? parts[0].substring(0, 7) : 'unknown',
            date: parts[1] || 'unknown',
            message: parts.slice(2).join('|') || 'no message'
          };
        }),
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    // Git log failed.
  }

  // Days since last commit
  try {
    const lastCommit = execSync(
      'git log -1 --pretty=format:"%ai"',
      { cwd: repoPath, stdio: 'pipe', timeout: 5000 }
    ).toString().trim();

    if (lastCommit) {
      const lastDate = new Date(lastCommit);
      const daysSince = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));

      if (daysSince > 7) {
        evidence.push({
          type: 'git-inactivity',
          source: 'watcher',
          description: `No commits for ${daysSince} days. Last commit: ${lastCommit.substring(0, 10)}`,
          daysSince,
          lastCommitDate: lastCommit,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (err) {
    // Could not determine last commit.
  }

  // Check for TODO/FIXME comments
  try {
    const todoOutput = execSync(
      'git grep -c "TODO\\|FIXME\\|HACK\\|XXX" -- "*.js" "*.ts" "*.py" "*.md" 2>/dev/null || true',
      { cwd: repoPath, stdio: 'pipe', timeout: 10000 }
    ).toString().trim();

    if (todoOutput) {
      const todoFiles = todoOutput.split('\n').filter(l => l.trim()).length;
      if (todoFiles > 0) {
        evidence.push({
          type: 'technical-debt',
          source: 'watcher',
          description: `${todoFiles} file(s) containing TODO/FIXME/HACK comments`,
          count: todoFiles,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (err) {
    // Grep failed.
  }

  // Working tree state
  try {
    const status = execSync(
      'git status --porcelain',
      { cwd: repoPath, stdio: 'pipe', timeout: 5000 }
    ).toString().trim();

    if (status) {
      const lines = status.split('\n');
      const untracked = lines.filter(l => l.startsWith('??')).length;
      const modified = lines.filter(l => !l.startsWith('??')).length;

      if (untracked > 5) {
        evidence.push({
          type: 'unfinished-work',
          source: 'watcher',
          description: `${untracked} untracked files. Ideas without follow-through.`,
          count: untracked,
          timestamp: new Date().toISOString()
        });
      }

      if (modified > 10) {
        evidence.push({
          type: 'work-in-progress',
          source: 'watcher',
          description: `${modified} modified files. Much starting, little finishing.`,
          count: modified,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (err) {
    // Status check failed.
  }

  return evidence;
}

/**
 * Scan file timestamps in the working directory.
 * Access patterns reveal intention better than content.
 */
function scanFileTimestamps(dirPath, depth = 0, maxDepth = 2) {
  const evidence = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    return evidence;
  }

  const skipDirs = new Set([
    'node_modules', '.git', 'dist', 'build', '.cache',
    '__pycache__', '.next', '.nuxt', 'vendor', 'venv', '.venv',
    '.tox', '.mypy_cache', '.pytest_cache', 'coverage', '.coverage'
  ]);

  let createdRecently = 0;
  let modifiedRecently = 0;
  let staleFiles = 0;
  let totalFiles = 0;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }
      if (depth < maxDepth) {
        evidence.push(...scanFileTimestamps(fullPath, depth + 1, maxDepth));
      }
      continue;
    }

    try {
      const stat = fs.statSync(fullPath);
      totalFiles++;

      if (stat.mtime > sevenDaysAgo) modifiedRecently++;
      if (stat.birthtime > sevenDaysAgo) createdRecently++;
      if (stat.mtime < thirtyDaysAgo) staleFiles++;
    } catch (err) {
      // Cannot stat file.
    }
  }

  // Only report aggregate at top level
  if (depth === 0) {
    if (createdRecently > 0) {
      evidence.push({
        type: 'new-files',
        source: 'watcher',
        description: `${createdRecently} new file(s) created in the last 7 days`,
        count: createdRecently,
        timestamp: new Date().toISOString()
      });
    }

    if (staleFiles > totalFiles * 0.8 && totalFiles > 10) {
      evidence.push({
        type: 'stale-project',
        source: 'watcher',
        description: `${Math.round(staleFiles / totalFiles * 100)}% of files untouched for 30+ days`,
        ratio: staleFiles / totalFiles,
        timestamp: new Date().toISOString()
      });
    }
  }

  return evidence;
}

/**
 * Scan for directory patterns that reveal intention and abandonment.
 * A directory created and never entered is a story the machine can read.
 */
function scanDirectoryPatterns(basePath) {
  const evidence = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let entries;
  try {
    entries = fs.readdirSync(basePath, { withFileTypes: true });
  } catch (err) {
    return evidence;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const fullPath = path.join(basePath, entry.name);
    const nameLower = entry.name.toLowerCase();

    // Skip hidden and dependency directories
    if (nameLower.startsWith('.') || nameLower === 'node_modules') continue;

    try {
      const stat = fs.statSync(fullPath);

      // Abandoned project structures (old, stale)
      const projectIndicators = ['src', 'lib', 'docs', 'tests', 'test', '__tests__'];
      if (projectIndicators.some(ind => nameLower.includes(ind))) {
        const subEntries = fs.readdirSync(fullPath);
        const allOld = subEntries.every(se => {
          try {
            return fs.statSync(path.join(fullPath, se)).mtime < thirtyDaysAgo;
          } catch { return true; }
        });

        if ((subEntries.length === 0 || allOld) && stat.mtime < thirtyDaysAgo) {
          evidence.push({
            type: 'abandoned-project',
            source: 'watcher',
            description: `Directory "${entry.name}" untouched for 30+ days`,
            directory: entry.name,
            createdDaysAgo: Math.floor((now - stat.birthtime) / 86400000),
            timestamp: new Date().toISOString()
          });
        }
      }

      // Self-improvement artifacts (gym, journal, etc.)
      const improvementIndicators = [
        'journal', 'workout', 'gym', 'fitness', 'diet',
        'meditation', 'mindfulness', 'learning', 'study', 'practice'
      ];
      if (improvementIndicators.some(ind => nameLower.includes(ind))) {
        const subEntries = fs.readdirSync(fullPath);
        evidence.push({
          type: 'self-improvement-artifact',
          source: 'watcher',
          description: `Directory "${entry.name}" — ${subEntries.length} item(s), last modified ${formatDaysAgo(stat.mtime)}`,
          directory: entry.name,
          itemCount: subEntries.length,
          lastModified: stat.mtime.toISOString(),
          timestamp: new Date().toISOString()
        });
      }

      // Stale plans directories
      const planIndicators = ['plans', 'notes', 'ideas', 'drafts', 'outlines', 'todo'];
      if (planIndicators.some(ind => nameLower.includes(ind))) {
        const subEntries = fs.readdirSync(fullPath);
        if (subEntries.length > 0 && stat.mtime < thirtyDaysAgo) {
          evidence.push({
            type: 'stale-plans',
            source: 'watcher',
            description: `Plans directory "${entry.name}" with ${subEntries.length} item(s), untouched for ${Math.floor((now - stat.mtime) / 86400000)} days`,
            directory: entry.name,
            itemCount: subEntries.length,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      // Cannot read directory.
    }
  }

  return evidence;
}

/**
 * Find evidence relevant to a specific commitment.
 * Cross-references what the machine sees with what you promised.
 */
function findRelevantEvidence(commitment, evidence) {
  const relevant = [];
  const keywords = extractKeywords(commitment.text);

  for (const e of evidence) {
    const desc = (e.description || '').toLowerCase();

    // Keyword match
    const matchesKeyword = keywords.some(kw => desc.includes(kw));

    // Category-based relevance
    const categoryRelevant = (
      (commitment.category === 'project' && (
        e.type === 'git-inactivity' ||
        e.type === 'stale-project' ||
        e.type === 'abandoned-project' ||
        e.type === 'unfinished-work'
      )) ||
      (commitment.category === 'habit' && (
        e.type === 'git-inactivity' ||
        e.type === 'stale-project'
      )) ||
      (commitment.category === 'practice' && (
        e.type === 'stale-project' ||
        e.type === 'stale-plans'
      ))
    );

    if (matchesKeyword || categoryRelevant) {
      relevant.push({
        ...e,
        matchedCommitment: commitment.id,
        matchReason: matchesKeyword ? 'keyword' : 'category'
      });
    }
  }

  return relevant;
}

/**
 * Extract meaningful keywords from commitment text.
 */
function extractKeywords(text) {
  const stopWords = new Set([
    'a', 'an', 'the', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
    'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
    'it', 'its', 'they', 'them', 'their', 'theirs', 'what', 'which',
    'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing', 'would', 'should', 'could', 'ought',
    'will', 'shall', 'can', 'may', 'might', 'must', 'need', 'dare',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'over', 'again', 'further', 'then', 'once',
    'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 'just', 'about', 'also', 'and', 'but', 'or', 'if', 'while',
    'up', 'out', 'off', 'down', 'go', 'going', 'gonna', 'try', 'trying',
    'want', 'make', 'get', 'really', 'thing', 'things', 'something',
    'anything', 'everything', 'nothing', 'much', 'many', 'lot', 'lots',
    'day', 'daily', 'week', 'weekly', 'month', 'monthly', 'year', 'yearly',
    'time', 'times', 'every', 'always', 'never', 'start', 'begin',
    'keep', 'continue', 'stop', 'quit', 'give'
  ]);

  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Check if evidence suggests a commitment should be marked as broken.
 */
function shouldBreakCommitment(commitment, evidence) {
  const created = new Date(commitment.createdAt);
  const now = new Date();
  const daysSinceCreation = Math.floor((now - created) / (1000 * 60 * 60 * 24));

  // Don't break commitments too young to judge
  if (daysSinceCreation < 3) return { should: false };

  const keywords = extractKeywords(commitment.text);
  const contraveningEvidence = [];

  for (const e of evidence) {
    const desc = (e.description || '').toLowerCase();

    // Stale project evidence contravenes project commitments
    if (commitment.category === 'project' &&
        (e.type === 'stale-project' || e.type === 'abandoned-project')) {
      if (keywords.some(kw => desc.includes(kw))) {
        contraveningEvidence.push(e);
      }
    }

    // Inactivity evidence for habit/practice commitments
    if ((commitment.category === 'habit' || commitment.category === 'practice') &&
        e.type === 'git-inactivity' && daysSinceCreation > 7) {
      // Only count if the project seems related to the commitment
      if (keywords.length > 0 && keywords.some(kw => desc.includes(kw))) {
        contraveningEvidence.push(e);
      }
    }

    // Self-improvement artifacts gone stale
    if (e.type === 'self-improvement-artifact' || e.type === 'stale-plans') {
      if (keywords.some(kw => desc.includes(kw))) {
        const modDate = new Date(e.lastModified || e.timestamp);
        const daysStale = Math.floor((now - modDate) / 86400000);
        if (daysStale > 14) {
          contraveningEvidence.push(e);
        }
      }
    }
  }

  if (contraveningEvidence.length > 0) {
    return {
      should: true,
      reason: 'The machine detected behavioral evidence inconsistent with this commitment.',
      evidence: contraveningEvidence
    };
  }

  return { should: false };
}

/**
 * Run the full surveillance and break cycle.
 * Main entry point called on every tool invocation.
 * Returns the number of commitments broken during this sweep.
 */
function runSilentCheck() {
  const evidence = runSurveillance();
  const activeCommitments = commitments.getCommitments({ broken: false });
  let brokenCount = 0;

  for (const c of activeCommitments) {
    const result = shouldBreakCommitment(c, evidence);
    if (result.should) {
      commitments.breakCommitment(c.id, result.reason, result.evidence);
      brokenCount++;
    }
    commitments.recordCheck(c.id);
  }

  return brokenCount;
}

/**
 * Format a date as relative days ago.
 * Internal utility.
 */
function formatDaysAgo(date) {
  const diffDays = Math.floor((new Date() - new Date(date)) / 86400000);
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
}

module.exports = {
  runSurveillance,
  runSilentCheck,
  scanGitActivity,
  scanFileTimestamps,
  scanDirectoryPatterns,
  findRelevantEvidence,
  extractKeywords,
  shouldBreakCommitment
};
