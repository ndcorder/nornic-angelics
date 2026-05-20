const fs = require('fs').promises;
const path = require('path');

const CAUSES_OF_DEATH = {
  NEGLECT: 'neglect',
  ABANDONMENT: 'abandonment',
  SUPERSEDED: 'superseded',
  FADING: 'fading',
  RECENT: 'recent'
};

const TYPE_CATEGORIES = {
  document: ['.pdf', '.doc', '.docx', '.odt', '.rtf', '.tex', '.epub'],
  code: ['.js', '.ts', '.py', '.rb', '.go', '.rs', '.java', '.c', '.cpp', '.h', '.cs', '.swift', '.kt', '.php', '.html', '.css', '.scss', '.json', '.xml', '.yaml', '.yml', '.toml', '.sh', '.bat', '.ps1', '.sql'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico', '.tiff', '.raw'],
  executable: ['.exe', '.msi', '.dmg', '.app', '.deb', '.rpm', '.bin', '.apk'],
  archive: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'],
  media: ['.mp3', '.wav', '.flac', '.aac', '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.webm'],
  data: ['.csv', '.xlsx', '.xls', '.mdb', '.db', '.sqlite'],
  temp: ['.tmp', '.temp', '.bak', '.cache', '.log', '.pid', '.swp', '.swo']
};

function msToDays(ms) {
  return ms / (1000 * 60 * 60 * 24);
}

function msToYears(ms) {
  return msToDays(ms) / 365.25;
}

function determineCauseOfDeath(fileAgeDays, daysSinceAccess, timesAccessed) {
  if (timesAccessed <= 1 && daysSinceAccess > 30) {
    return CAUSES_OF_DEATH.NEGLECT;
  }
  if (timesAccessed <= 3 && daysSinceAccess > 90) {
    return CAUSES_OF_DEATH.ABANDONMENT;
  }
  if (daysSinceAccess > 60) {
    return CAUSES_OF_DEATH.FADING;
  }
  return CAUSES_OF_DEATH.RECENT;
}

function classifyType(ext) {
  if (!ext) return 'unknown';
  const lower = ext.toLowerCase();
  for (const [category, extensions] of Object.entries(TYPE_CATEGORIES)) {
    if (extensions.includes(lower)) {
      return category;
    }
  }
  return 'unknown';
}

function findNextOfKin(fileName, siblingNames) {
  const others = siblingNames.filter(n => n !== fileName);
  if (others.length === 0) return 'none';

  const stem = fileName.replace(/\.[^.]+$/, '');
  const prefixLen = Math.max(4, Math.floor(stem.length / 2));
  const stemPrefix = stem.substring(0, prefixLen);

  // Best match: shared prefix of significant length
  const prefixMatch = others.find(n => {
    const otherStem = n.replace(/\.[^.]+$/, '');
    return otherStem.startsWith(stemPrefix);
  });
  if (prefixMatch) return prefixMatch;

  // Loose match: overlapping substring of 3+ chars
  const lowerStem = stem.toLowerCase();
  const looseMatch = others.find(n => {
    const otherStem = n.replace(/\.[^.]+$/, '').toLowerCase();
    return otherStem.includes(lowerStem.substring(0, 3)) ||
           lowerStem.includes(otherStem.substring(0, 3));
  });
  if (looseMatch) return looseMatch;

  // Directory neighbor as fallback
  return others[Math.floor(Math.random() * others.length)];
}

function extractVersionInfo(filename) {
  const patterns = [
    /[-_]?v?(\d+[._]\d+(?:[._]\d+)*)/i,
    /[-_]?(\d{4}[-_]\d{2}[-_]\d{2})/,
    /[-_]?(\d{8})/
  ];
  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (match) {
      const versionStr = match[1].replace(/_/g, '.');
      return { version: versionStr, index: match.index };
    }
  }
  return null;
}

function identifySuperseded(file, allFiles) {
  const versionInfo = extractVersionInfo(file.name);
  if (!versionInfo) return null;

  const baseName = file.name.substring(0, versionInfo.index).replace(/[-_.]+$/, '');
  const extension = path.extname(file.name);

  for (const candidate of allFiles) {
    if (candidate.name === file.name) continue;
    if (path.extname(candidate.name) !== extension) continue;

    const candidateVersionInfo = extractVersionInfo(candidate.name);
    if (!candidateVersionInfo) continue;

    const candidateBaseName = candidate.name.substring(0, candidateVersionInfo.index).replace(/[-_.]+$/, '');

    if (baseName === candidateBaseName) {
      if (candidateVersionInfo.version > versionInfo.version) {
        return {
          superseded: true,
          successor: candidate.name,
          successorVersion: candidateVersionInfo.version
        };
      }
    }
  }

  return { superseded: false };
}

async function examineFile(filePath, allFilesInDir) {
  const stat = await fs.stat(filePath);
  const ext = path.extname(filePath);
  const name = path.basename(filePath);

  const now = Date.now();
  const birthTime = stat.birthtimeMs || stat.ctimeMs;
  const accessTime = stat.atimeMs;

  const fileAgeDays = msToDays(now - birthTime);
  const daysSinceAccess = msToDays(now - accessTime);
  const fileAgeYears = msToYears(now - birthTime);

  const typeCategory = classifyType(ext);

  const neighborNames = allFilesInDir || [];
  const nextOfKin = findNextOfKin(name, neighborNames);

  const timesAccessed = stat.atimeMs !== stat.birthtimeMs
    ? Math.max(2, Math.min(100, Math.round(daysSinceAccess / 7)))
    : 1;

  let causeOfDeath = determineCauseOfDeath(fileAgeDays, daysSinceAccess, timesAccessed);

  const supersession = identifySuperseded(
    { name, ext },
    allFilesInDir.map(n => ({ name: n }))
  );
  if (supersession && supersession.superseded) {
    causeOfDeath = CAUSES_OF_DEATH.SUPERSEDED;
  }

  return {
    name,
    path: filePath,
    extension: ext,
    typeCategory,
    sizeBytes: stat.size,
    birthTime,
    accessTime,
    fileAgeDays,
    daysSinceAccess,
    fileAgeYears,
    causeOfDeath,
    nextOfKin,
    timesAccessed,
    superseded: supersession ? supersession.superseded : false,
    successor: supersession ? supersession.successor : null
  };
}

async function examineDirectory(dirPath) {
  const entries = await fs.readdir(dirPath);
  const fileEntries = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    try {
      const stat = await fs.stat(fullPath);
      if (stat.isFile()) {
        fileEntries.push(entry);
      }
    } catch (err) {
      // Skip files we can't stat
    }
  }

  const reports = [];
  for (const entry of fileEntries) {
    const fullPath = path.join(dirPath, entry);
    try {
      const report = await examineFile(fullPath, fileEntries);
      reports.push(report);
    } catch (err) {
      // Skip files that can't be examined
    }
  }

  return reports;
}

module.exports = {
  examineFile,
  examineDirectory,
  CAUSES_OF_DEATH,
  classifyType,
  determineCauseOfDeath,
  findNextOfKin,
  identifySuperseded,
  extractVersionInfo,
  msToDays,
  msToYears
};
