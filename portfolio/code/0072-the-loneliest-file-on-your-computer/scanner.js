const fs = require('fs');
const path = require('path');

/**
 * Directories we skip entirely. System paths, package caches,
 * and other locations that pollute results with noise.
 */
const DEFAULT_IGNORE_DIRS = new Set([
  'node_modules', '.git', '.svn', '.hg', '__pycache__',
  '.cache', '.npm', '.yarn', '.pnpm-store',
  '.DS_Store',
  'System Volume Information', '$RECYCLE.BIN',
  'Windows', 'System32',
  'sys', 'proc', 'dev', 'run', 'snap', 'boot',
  'lib', 'bin', 'sbin', 'usr', 'etc', 'var',
  'tmp', '.tmp',
  '.config', '.local', '.vscode', '.idea',
  'Library', 'Application Support', 'Logs',
  'Saved Application State', 'WebKit',
  'com.apple', 'Containers', 'Group Containers',
]);

const IGNORE_EXTENSIONS = new Set([
  '.pyc', '.pyo', '.class', '.o', '.obj',
  '.pdb', '.ilk', '.exp', '.lib',
  '.cache', '.lock', '.log',
]);

const IGNORE_FILENAMES = new Set([
  '.DS_Store', 'Thumbs.db', 'desktop.ini',
  '.gitkeep', '.gitignore', '.npmignore',
  '.eslintcache',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
]);

/**
 * Scan a directory recursively, collecting file records
 * sorted by neglect (most forgotten first).
 */
async function scan(rootPath, options = {}) {
  const {
    maxDepth = Infinity,
    maxFiles = 5000,
    includeHidden = false,
    ignoreDirs = new Set(),
    onError = () => {},
  } = options;

  const mergedIgnoreDirs = new Set([...DEFAULT_IGNORE_DIRS, ...ignoreDirs]);
  const files = [];
  const absoluteRoot = path.resolve(rootPath);

  async function walkDir(dirPath, depth) {
    if (files.length >= maxFiles) return;
    if (depth > maxDepth) return;

    let entries;
    try {
      entries = await readdir(dirPath);
    } catch (err) {
      onError(dirPath, err);
      return;
    }

    for (const entry of entries) {
      if (files.length >= maxFiles) break;
      if (!includeHidden && entry.name.startsWith('.')) continue;

      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (mergedIgnoreDirs.has(entry.name)) continue;
        await walkDir(fullPath, depth + 1);
      } else if (entry.isFile()) {
        if (IGNORE_FILENAMES.has(entry.name)) continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (IGNORE_EXTENSIONS.has(ext)) continue;

        try {
          const stat = await statFile(fullPath);
          files.push(buildFileRecord(fullPath, stat, absoluteRoot));
        } catch (err) {
          onError(fullPath, err);
        }
      }
    }
  }

  await walkDir(absoluteRoot, 0);
  files.sort((a, b) => a.neglectScore - b.neglectScore);
  return files;
}

/**
 * Build a file record. Neglect score is the older of atime and mtime —
 * whichever timestamp recedes furthest into the past.
 */
function buildFileRecord(fullPath, stat, rootPath) {
  const now = Date.now();
  const mtime = stat.mtimeMs;
  const atime = stat.atimeMs;
  const ctime = stat.ctimeMs;

  const neglectScore = Math.min(mtime, atime);

  const mtimeDays = Math.floor((now - mtime) / (1000 * 60 * 60 * 24));
  const atimeDays = Math.floor((now - atime) / (1000 * 60 * 60 * 24));

  const ext = path.extname(fullPath).toLowerCase();
  const basename = path.basename(fullPath);
  const dirname = path.dirname(fullPath);
  const relativePath = path.relative(rootPath, fullPath) || '.';

  return {
    path: fullPath,
    relativePath,
    name: basename,
    dirname,
    extension: ext || '(none)',
    size: stat.size,
    sizeFormatted: formatSize(stat.size),
    mtime: new Date(mtime),
    atime: new Date(atime),
    ctime: new Date(ctime),
    mtimeDays,
    atimeDays,
    waitDays: Math.max(mtimeDays, atimeDays),
    neglectScore,
    characteristics: detectCharacteristics(basename, ext, stat, mtimeDays, atimeDays),
  };
}

/**
 * Detect characteristics that make a file narratively interesting.
 * These feed grouping and display logic in the reporter.
 */
function detectCharacteristics(basename, ext, stat, mtimeDays, atimeDays) {
  const chars = [];
  const lower = basename.toLowerCase();

  if (lower.includes('temp') || lower.includes('tmp') || lower.startsWith('~')) {
    chars.push('temporary-sounding');
  }
  if (lower.includes('copy') || lower.includes('backup') || lower.includes('old')) {
    chars.push('backup');
  }
  if (/v\d+/i.test(lower) || /final/i.test(lower) || /last/i.test(lower)) {
    chars.push('versioned');
  }
  if (lower.includes('draft') || lower.includes('untitled')) {
    chars.push('draft');
  }
  if (stat.size === 0) {
    chars.push('empty');
  } else if (stat.size < 100) {
    chars.push('nearly-empty');
  }
  if (mtimeDays > 365) chars.push('year-plus');
  if (mtimeDays > 365 * 2) chars.push('two-years-plus');
  if (mtimeDays > 365 * 5) chars.push('ancient');
  if (atimeDays === mtimeDays && mtimeDays > 30) {
    chars.push('never-reopened');
  }

  return chars;
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function readdir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
      if (err) reject(err);
      else resolve(entries);
    });
  });
}

function statFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) reject(err);
      else resolve(stats);
    });
  });
}

module.exports = {
  scan,
  buildFileRecord,
  formatSize,
  detectCharacteristics,
  DEFAULT_IGNORE_DIRS,
  IGNORE_EXTENSIONS,
  IGNORE_FILENAMES,
};
