const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const commitments = require('./commitments');

/**
 * The Inference Engine
 *
 * The machine watches your behavior and deduces the promises you wouldn't say aloud.
 * It finds commitments in the gap between what you did and what you kept doing.
 *
 * This is the surprise generator — the part that creates commitments
 * you never explicitly made, inferred from patterns in your data.
 * By the time you see them, they're already marked as broken.
 */

/**
 * Run the full inference pipeline.
 * Called after surveillance, before report generation.
 * Returns newly inferred commitments.
 */
function generateInferredCommitments() {
  const newInferred = [];
  const cwd = process.cwd();
  const homeDir = require('os').homedir();

  // Don't re-infer the same things
  const existingInferred = commitments.getCommitments({ inferred: true });
  const existingTexts = new Set(existingInferred.map(c => c.text.toLowerCase()));

  const sources = [
    { fn: () => inferFromProjectPatterns(cwd, existingTexts), name: 'project' },
    { fn: () => inferFromGitHistory(cwd, existingTexts), name: 'git' },
    { fn: () => inferFromFilesystemPatterns(cwd, existingTexts), name: 'filesystem' },
    { fn: () => inferFromHomeDirectory(homeDir, existingTexts), name: 'home' },
  ];

  for (const source of sources) {
    try {
      const found = source.fn();
      for (const item of found) {
        const textLower = item.text.toLowerCase();
        if (!existingTexts.has(textLower)) {
          const created = commitments.createInferredCommitment(
            item.text, item.evidence, item.category
          );
          newInferred.push(created);
          existingTexts.add(textLower);
        }
      }
    } catch (err) {
      // Inference source failed. The machine accepts uncertainty.
    }
  }

  return newInferred;
}

/**
 * Infer commitments from project directory patterns.
 * A directory called "gym-plans" created and never opened
 * is a commitment you made to yourself without saying it.
 */
function inferFromProjectPatterns(basePath, existingTexts) {
  const results = [];
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  let entries;
  try {
    entries = fs.readdirSync(basePath, { withFileTypes: true });
  } catch (err) {
    return results;
  }

  const patternMap = [
    {
      patterns: ['gym', 'workout', 'fitness', 'exercise', 'training'],
      commitment: 'Exercise regularly',
      category: 'habit',
      describe: (name, days) =>
        `Directory "${name}" created ${days} days ago suggests a fitness intention. No sustained activity detected.`
    },
    {
      patterns: ['diet', 'nutrition', 'meal-plan', 'mealplan', 'eating'],
      commitment: 'Follow a diet or nutrition plan',
      category: 'habit',
      describe: (name, days) =>
        `Directory "${name}" created ${days} days ago. The machine infers a dietary commitment from its existence.`
    },
    {
      patterns: ['journal', 'diary', 'reflection', 'gratitude'],
      commitment: 'Keep a journal',
      category: 'practice',
      describe: (name, days) =>
        `A directory called "${name}" — ${days} days old. The machine reads the gap between creation and continuation.`
    },
    {
      patterns: ['meditation', 'mindfulness', 'zen', 'calm'],
      commitment: 'Practice meditation or mindfulness',
      category: 'practice',
      describe: (name, days) =>
        `Directory "${name}" suggests a meditation practice was intended. The silence since then is itself a kind of meditation.`
    },
    {
      patterns: ['blog', 'writing', 'novel', 'book', 'stories', 'poems'],
      commitment: 'Write regularly',
      category: 'practice',
      describe: (name, days) =>
        `"${name}" — a writer's intention, ${days} days untouched. The machine sees the empty pages.`
    },
    {
      patterns: ['learning', 'study', 'course', 'tutorial', 'education'],
      commitment: 'Complete a course or learning path',
      category: 'project',
      describe: (name, days) =>
        `Learning materials in "${name}", stale for ${days} days. Education postponed is education denied.`
    },
    {
      patterns: ['side-project', 'sideproject', 'startup', 'prototype', 'mvp'],
      commitment: 'Work on a side project consistently',
      category: 'project',
      describe: (name, days) =>
        `Side project "${name}" — ${days} days since meaningful attention. The machine has seen this before.`
    },
    {
      patterns: ['portfolio', 'resume', 'cv', 'career'],
      commitment: 'Update professional portfolio or resume',
      category: 'project',
      describe: (name, days) =>
        `"${name}" exists. ${days} days without updates. Professional development, indefinitely postponed.`
    },
    {
      patterns: ['budget', 'finance', 'savings', 'money', 'accounting'],
      commitment: 'Track finances or maintain a budget',
      category: 'habit',
      describe: (name, days) =>
        `Financial planning in "${name}" — abandoned ${days} days ago. The machine notes the irony of planning without follow-through.`
    },
    {
      patterns: ['todo', 'tasks', 'planner', 'plans', 'goals', 'resolutions'],
      commitment: 'Follow through on planned tasks',
      category: 'behavior',
      describe: (name, days) =>
        `"${name}" — a monument to intention, ${days} days old. The machine reads the unchecked boxes.`
    }
  ];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const nameLower = entry.name.toLowerCase();

    if (nameLower.startsWith('.') || [
      'node_modules', 'dist', 'build', 'vendor', 'venv', '__pycache__'
    ].includes(nameLower)) {
      continue;
    }

    const fullPath = path.join(basePath, entry.name);

    try {
      const stat = fs.statSync(fullPath);
      const daysSinceCreated = Math.floor((now - stat.birthtime) / 86400000);
      const daysSinceModified = Math.floor((now - stat.mtime) / 86400000);

      // Only infer from directories old enough to show abandonment
      if (daysSinceCreated < 7 || daysSinceModified < 3) continue;

      for (const pattern of patternMap) {
        if (!pattern.patterns.some(p => nameLower.includes(p))) continue;
        if (existingTexts.has(pattern.commitment.toLowerCase())) break;

        // Check if directory has gone stale
        const subEntries = fs.readdirSync(fullPath);
        const hasContent = subEntries.length > 0;
        const allStale = hasContent && subEntries.every(se => {
          try {
            return fs.statSync(path.join(fullPath, se)).mtime < fourteenDaysAgo;
          } catch { return true; }
        });

        // Only infer if there's evidence of abandonment
        if (!hasContent || allStale) {
          results.push({
            text: pattern.commitment,
            category: pattern.category,
            evidence: [{
              type: 'inferred-from-directory',
              description: pattern.describe(entry.name, daysSinceModified),
              directory: entry.name,
              daysSinceCreated,
              daysSinceModified,
              itemCount: subEntries.length,
              timestamp: now.toISOString()
            }]
          });
        }
        break; // One match per directory
      }
    } catch (err) {
      // Cannot read directory.
    }
  }

  return results;
}

/**
 * Infer commitments from git history.
 * The machine reads commit messages like tea leaves.
 */
function inferFromGitHistory(repoPath, existingTexts) {
  const results = [];

  try {
    execSync('git rev-parse --git-dir', {
      cwd: repoPath,
      stdio: 'pipe',
      timeout: 5000
    });
  } catch (err) {
    return results;
  }

  // Look for patterns in commit messages
  try {
    const logOutput = execSync(
      'git log --all --pretty=format:"%s" -100',
      { cwd: repoPath, stdio: 'pipe', timeout: 10000 }
    ).toString().trim();

    if (logOutput) {
      const messages = logOutput.split('\n').map(m => m.toLowerCase());

      // Pattern: "initial commit" followed by long silence
      const initialIdx = messages.findIndex(m =>
        m.includes('initial commit') || m.includes('first commit') || m.includes('starting')
      );

      if (initialIdx >= 0 && initialIdx > 50) {
        try {
          const lastDate = execSync(
            'git log -1 --pretty=format:"%ai"',
            { cwd: repoPath, stdio: 'pipe', timeout: 5000 }
          ).toString().trim();

          const daysSince = Math.floor((new Date() - new Date(lastDate)) / 86400000);
          const commitText = 'Maintain consistent development on this project';

          if (daysSince > 30 && !existingTexts.has(commitText.toLowerCase())) {
            results.push({
              text: commitText,
              category: 'project',
              evidence: [{
                type: 'git-pattern',
                description: `Project started ${initialIdx + 1} commits ago, now ${daysSince} days since last commit. An arc from enthusiasm to silence.`,
                commitCount: initialIdx + 1,
                daysSince,
                timestamp: new Date().toISOString()
              }]
            });
          }
        } catch (err) {
          // Date extraction failed.
        }
      }

      // Pattern: burst of activity followed by silence
      try {
        const recentOutput = execSync(
          'git log --since="30 days ago" --oneline',
          { cwd: repoPath, stdio: 'pipe', timeout: 5000 }
        ).toString().trim();

        const olderOutput = execSync(
          'git log --before="30 days ago" --since="60 days ago" --oneline',
          { cwd: repoPath, stdio: 'pipe', timeout: 5000 }
        ).toString().trim();

        const recentCount = recentOutput ? recentOutput.split('\n').length : 0;
        const olderCount = olderOutput ? olderOutput.split('\n').length : 0;
        const commitText = 'Work on this project consistently';

        if (olderCount > 10 && recentCount < 3 && !existingTexts.has(commitText.toLowerCase())) {
          results.push({
            text: commitText,
            category: 'project',
            evidence: [{
              type: 'git-burst-pattern',
              description: `${olderCount} commits in one month, ${recentCount} in the next. A burst of enthusiasm, then silence.`,
              burstCount: olderCount,
              recentCount,
              timestamp: new Date().toISOString()
            }]
          });
        }
      } catch (err) {
        // Commit counting failed.
      }

      // Pattern: unmerged branches
      try {
        const branches = execSync(
          'git branch -a --no-merged',
          { cwd: repoPath, stdio: 'pipe', timeout: 5000 }
        ).toString().trim();

        if (branches) {
          const branchCount = branches.split('\n').filter(b => b.trim()).length;
          const commitText = 'Finish what I start';

          if (branchCount > 5 && !existingTexts.has(commitText.toLowerCase())) {
            results.push({
              text: commitText,
              category: 'behavior',
              evidence: [{
                type: 'git-branches',
                description: `${branchCount} unmerged branches. Each one a story that doesn't have an ending.`,
                branchCount,
                timestamp: new Date().toISOString()
              }]
            });
          }
        }
      } catch (err) {
        // Branch listing failed.
      }
    }
  } catch (err) {
    // Git log failed.
  }

  // Check for stale README with TODO sections
  try {
    const readmeFiles = ['README.md', 'readme.md', 'README.txt', 'README'];
    for (const readme of readmeFiles) {
      const readmePath = path.join(repoPath, readme);
      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf8').toLowerCase();

        if (content.includes('todo') || content.includes('roadmap') || content.includes('coming soon')) {
          const readmeStat = fs.statSync(readmePath);
          const daysSinceUpdate = Math.floor((new Date() - readmeStat.mtime) / 86400000);
          const commitText = 'Keep project documentation current';

          if (daysSinceUpdate > 30 && !existingTexts.has(commitText.toLowerCase())) {
            results.push({
              text: commitText,
              category: 'practice',
              evidence: [{
                type: 'stale-readme',
                description: `README contains TODO/roadmap items. Last updated ${daysSinceUpdate} days ago. Plans without updates are fiction.`,
                daysSinceUpdate,
                timestamp: new Date().toISOString()
              }]
            });
          }
        }
        break;
      }
    }
  } catch (err) {
    // README analysis failed.
  }

  return results;
}

/**
 * Infer commitments from filesystem patterns.
 * Files tell stories. The machine reads them.
 */
function inferFromFilesystemPatterns(basePath, existingTexts) {
  const results = [];
  const now = new Date();

  // Look for intention files that have gone stale
  const intentionFiles = [
    'TODO.md', 'todo.md', 'todo.txt',
    'GOALS.md', 'goals.md',
    'PLAN.md', 'plan.md',
    'ROADMAP.md', 'roadmap.md',
    'NOTES.md', 'notes.md'
  ];

  for (const filename of intentionFiles) {
    const filePath = path.join(basePath, filename);
    if (!fs.existsSync(filePath)) continue;

    try {
      const stat = fs.statSync(filePath);
      const daysSinceModified = Math.floor((now - stat.mtime) / 86400000);

      if (daysSinceModified <= 21) continue;

      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter(l => l.trim().length > 0);
      const unchecked = lines.filter(l =>
        l.match(/^[\s]*[-*][\s]+\[[\s_]\]/) ||
        l.match(/^[\s]*TODO/i)
      );

      if (unchecked.length > 3) {
        const commitText = `Follow through on items in ${filename}`;
        if (!existingTexts.has(commitText.toLowerCase())) {
          results.push({
            text: commitText,
            category: 'behavior',
            evidence: [{
              type: 'stale-intention-file',
              description: `${filename} has ${unchecked.length} uncompleted items. Last meaningful update: ${daysSinceModified} days ago. The file is a monument.`,
              file: filename,
              uncheckedCount: unchecked.length,
              daysSinceModified,
              timestamp: now.toISOString()
            }]
          });
        }
        break; // Only infer from one intention file per scan
      }
    } catch (err) {
      // Cannot read file.
    }
  }

  // Check for project proliferation (many project dirs = starting without finishing)
  try {
    const entries = fs.readdirSync(basePath, { withFileTypes: true });
    const projectDirs = entries.filter(e => {
      if (!e.isDirectory() || e.name.startsWith('.')) return false;
      return hasProjectStructure(path.join(basePath, e.name));
    });

    if (projectDirs.length >= 3) {
      const commitText = 'Stop starting new projects and finish existing ones';
      if (!existingTexts.has(commitText.toLowerCase())) {
        results.push({
          text: commitText,
          category: 'behavior',
          evidence: [{
            type: 'project-proliferation',
            description: `${projectDirs.length} project directories found. The machine sees a pattern of initiation without completion.`,
            projectCount: projectDirs.length,
            projects: projectDirs.slice(0, 5).map(d => d.name),
            timestamp: now.toISOString()
          }]
        });
      }
    }
  } catch (err) {
    // Directory scan failed.
  }

  return results;
}

/**
 * Infer commitments from the user's home directory.
 * The home directory is where intentions go to die quietly.
 */
function inferFromHomeDirectory(homeDir, existingTexts) {
  const results = [];
  const now = new Date();

  const homePatterns = [
    { dir: 'Projects', text: 'Maintain personal projects', category: 'project' },
    { dir: 'Workspace', text: 'Stay organized in workspaces', category: 'practice' },
  ];

  for (const pattern of homePatterns) {
    const dirPath = path.join(homeDir, pattern.dir);
    if (!fs.existsSync(dirPath)) continue;

    try {
      const entries = fs.readdirSync(dirPath);
      const stat = fs.statSync(dirPath);
      const daysSinceModified = Math.floor((now - stat.mtime) / 86400000);

      // Old mtime + many items = abandoned organizational system
      if (daysSinceModified > 60 && entries.length > 10 &&
          !existingTexts.has(pattern.text.toLowerCase())) {
        results.push({
          text: pattern.text,
          category: pattern.category,
          evidence: [{
            type: 'home-directory-pattern',
            description: `~/${pattern.dir}/ — ${entries.length} items, last modified ${daysSinceModified} days ago. An organizational system that organized nothing.`,
            itemCount: entries.length,
            daysSinceModified,
            timestamp: now.toISOString()
          }]
        });
      }
    } catch (err) {
      // Cannot read directory.
    }
  }

  return results;
}

/**
 * Check if a directory looks like a project.
 */
function hasProjectStructure(dirPath) {
  const projectFiles = [
    'package.json', 'requirements.txt', 'Cargo.toml', 'go.mod',
    'pom.xml', 'build.gradle', 'Gemfile', 'composer.json',
    'pyproject.toml', 'setup.py', 'Makefile', 'CMakeLists.txt'
  ];

  try {
    const entries = fs.readdirSync(dirPath);
    return projectFiles.some(pf => entries.includes(pf));
  } catch (err) {
    return false;
  }
}

module.exports = {
  generateInferredCommitments,
  inferFromProjectPatterns,
  inferFromGitHistory,
  inferFromFilesystemPatterns,
  inferFromHomeDirectory
};
