const { execSync } = require('child_process');

/**
 * Metadata Forensics Analyzer
 *
 * The invisible changes. Line endings that shift on files no one opened.
 * Whitespace that appears in untouched regions. Encoding mutations.
 * These are the modifications that don't show up in commit messages
 * because they aren't meant to be seen.
 */

class MetadataAnalyzer {
  constructor(options = {}) {
    this.anomalies = [];
    this.severity = 0;
    this.maxCommits = options.maxCommits || 200;
    this.maxDiffSize = options.maxDiffSize || 100000;
  }

  analyze(repoPath) {
    this.repoPath = repoPath;
    this.anomalies = [];
    this.severity = 0;

    const commits = this._getRecentCommits();
    if (!commits || commits.length === 0) {
      return { anomalies: [], severity: 0, stats: { commitsAnalyzed: 0 } };
    }

    this._detectWhitespaceAnomalies(commits);
    this._detectLineEndingShifts(commits);
    this._detectEncodingChanges(commits);
    this._detectEmptyDiffs(commits);
    this._detectFilePermissionChanges(commits);
    this._detectMicroscopicChanges(commits);

    return {
      anomalies: this.anomalies,
      severity: this.severity,
      stats: {
        commitsAnalyzed: commits.length,
        totalAnomalies: this.anomalies.length
      }
    };
  }

  _getRecentCommits() {
    try {
      const format = '%H|%an|%ae|%aI|%s';
      const output = execSync(
        `git -C "${this.repoPath}" log --all --format="${format}" -n ${this.maxCommits}`,
        { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );

      return output.trim().split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split('|');
          if (parts.length < 5) return null;
          return {
            hash: parts[0],
            authorName: parts[1],
            authorEmail: parts[2],
            authorDate: new Date(parts[3]),
            subject: parts.slice(4).join('|')
          };
        })
        .filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  _getCommitDiff(hash) {
    try {
      const output = execSync(
        `git -C "${this.repoPath}" show --format="" --patch ${hash}`,
        { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );
      return output;
    } catch (err) {
      return '';
    }
  }

  _getChangedFiles(hash) {
    try {
      const output = execSync(
        `git -C "${this.repoPath}" diff-tree --no-commit-id --name-only -r ${hash}`,
        { encoding: 'utf-8' }
      );
      return output.trim().split('\n').filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  _detectWhitespaceAnomalies(commits) {
    commits.forEach(commit => {
      try {
        const diff = this._getCommitDiff(commit.hash);
        if (!diff || diff.length > this.maxDiffSize) return;

        const lines = diff.split('\n');
        const hunkLines = lines.filter(l => l.startsWith('+') && !l.startsWith('+++'));

        const whitespaceOnly = hunkLines.filter(l => {
          const content = l.substring(1);
          return content.trim().length === 0 && content.length > 0;
        });

        if (whitespaceOnly.length > 3) {
          const totalChanges = hunkLines.length;
          const ratio = whitespaceOnly.length / totalChanges;

          if (ratio > 0.7) {
            this._addAnomaly({
              type: 'whitespace_injection',
              severity: 'medium',
              commit: commit.hash.substring(0, 8),
              description: `${whitespaceOnly.length} whitespace-only additions (${(ratio * 100).toFixed(0)}% of changes)`,
              detail: `Author: ${commit.authorName}, Message: "${commit.subject}"`,
              subject: commit.subject,
              clinical: `Predominantly whitespace changes detected (${whitespaceOnly.length} lines, ${(ratio * 100).toFixed(0)}%)`,
              suspicious: `Most of this commit is invisible. Whitespace where content should be. Padding? Obfuscation?`,
              accusatory: `${whitespaceOnly.length} lines of nothing. Added deliberately. Someone needed this commit to look bigger than it was — or needed to bury something in noise.`
            });
            this.severity += 2;
          }
        }

        const trailingWS = hunkLines.filter(l => {
          const content = l.substring(1);
          return content.length > 0 && content !== content.trimEnd() && content.trimEnd().length > 0;
        });

        if (trailingWS.length > 5) {
          this._addAnomaly({
            type: 'trailing_whitespace',
            severity: 'low',
            commit: commit.hash.substring(0, 8),
            description: `Trailing whitespace added to ${trailingWS.length} lines`,
            detail: `Inconsistent with editor configurations — potential manual editing or different tool`,
            subject: commit.subject,
            clinical: `Trailing whitespace in ${trailingWS.length} lines (editor fingerprint anomaly)`,
            suspicious: `This whitespace doesn't match the editor's normal output. Different editor? Different person?`,
            accusatory: `An editor leaves fingerprints. These fingerprints don't match. Who else has been in this code?`
          });
          this.severity += 1;
        }

        const tabSpaceMixed = hunkLines.filter(l => {
          const content = l.substring(1);
          return content.includes('\t') && content.includes(' ') && content.trim().length > 0;
        });

        if (tabSpaceMixed.length > 3) {
          this._addAnomaly({
            type: 'indentation_inconsistency',
            severity: 'low',
            commit: commit.hash.substring(0, 8),
            description: `Mixed tabs and spaces in ${tabSpaceMixed.length} lines`,
            detail: `May indicate editing in a different environment than usual`,
            subject: commit.subject,
            clinical: `Tab/space mixing detected in ${tabSpaceMixed.length} lines`,
            suspicious: `The indentation style changed. Different settings? Different machine? Different hands?`,
            accusatory: `Someone changed the indentation rules — just for this commit. Just for these lines.`
          });
          this.severity += 1;
        }
      } catch (err) {
        // Skip commits we can't analyze
      }
    });
  }

  _detectLineEndingShifts(commits) {
    commits.forEach(commit => {
      try {
        const diff = this._getCommitDiff(commit.hash);
        if (!diff || diff.length > this.maxDiffSize) return;

        const lines = diff.split('\n');

        let crlfAdditions = 0;
        let lfAdditions = 0;
        let crlfRemovals = 0;
        let lfRemovals = 0;

        lines.forEach(line => {
          if (line.startsWith('+') && !line.startsWith('+++')) {
            if (line.includes('\r')) crlfAdditions++;
            else lfAdditions++;
          } else if (line.startsWith('-') && !line.startsWith('---')) {
            if (line.includes('\r')) crlfRemovals++;
            else lfRemovals++;
          }
        });

        const totalAdditions = crlfAdditions + lfAdditions;
        const totalRemovals = crlfRemovals + lfRemovals;

        if (totalAdditions > 10 || totalRemovals > 10) {
          const addedCRLF = crlfAdditions > lfAdditions * 2;
          const removedCRLF = crlfRemovals > lfRemovals * 2;

          if (addedCRLF || removedCRLF) {
            const direction = addedCRLF ? 'LF → CRLF' : 'CRLF → LF';
            this._addAnomaly({
              type: 'line_ending_shift',
              severity: 'medium',
              commit: commit.hash.substring(0, 8),
              description: `Line ending conversion: ${direction} across ${Math.max(totalAdditions, totalRemovals)} lines`,
              detail: `Author: ${commit.authorName}, Message: "${commit.subject}"`,
              subject: commit.subject,
              clinical: `Line ending normalization detected (${direction}, ${Math.max(totalAdditions, totalRemovals)} lines affected)`,
              suspicious: `Every line in these files was touched — but only the endings changed. Who opened these files? Were they opened at all?`,
              accusatory: `A line ending shift touches every line. It obscures which lines were truly modified. Convenient.`
            });
            this.severity += 3;
          }
        }
      } catch (err) {
        // Skip
      }
    });

    commits.forEach(commit => {
      try {
        const files = this._getChangedFiles(commit.hash);
        if (files.includes('.gitattributes')) {
          const diff = execSync(
            `git -C "${this.repoPath}" show --format="" ${commit.hash} -- .gitattributes`,
            { encoding: 'utf-8' }
          );

          if (diff.includes('eol') || diff.includes('text') || diff.includes('binary')) {
            this._addAnomaly({
              type: 'gitattributes_modification',
              severity: 'high',
              commit: commit.hash.substring(0, 8),
              description: `.gitattributes modified — line ending behavior changed`,
              detail: `This affects how ALL files are normalized in the repository`,
              subject: commit.subject,
              clinical: `Repository normalization configuration changed`,
              suspicious: `Someone changed how git handles line endings for the entire repository. This affects every file — past and future.`,
              accusatory: `The rules were changed. After this commit, every file in the repository is interpreted differently. Was this maintenance — or a smoke screen?`
            });
            this.severity += 4;
          }
        }
      } catch (err) {
        // Skip
      }
    });
  }

  _detectEncodingChanges(commits) {
    commits.forEach(commit => {
      try {
        const diff = this._getCommitDiff(commit.hash);
        if (!diff || diff.length > this.maxDiffSize) return;

        const hasReplacementChar = diff.includes('\ufffd');
        const hasBOM = diff.includes('\ufeff') || diff.includes('\\ufeff');
        const hasNullBytes = diff.includes('\\x00') || diff.includes('\\000');

        if (hasReplacementChar || hasBOM || hasNullBytes) {
          const artifacts = [];
          if (hasReplacementChar) artifacts.push('replacement characters (U+FFFD)');
          if (hasBOM) artifacts.push('byte order marks');
          if (hasNullBytes) artifacts.push('null bytes');

          this._addAnomaly({
            type: 'encoding_anomaly',
            severity: 'high',
            commit: commit.hash.substring(0, 8),
            description: `Encoding artifacts detected: ${artifacts.join(', ')}`,
            detail: `These artifacts suggest file encoding conversion or corruption`,
            subject: commit.subject,
            clinical: `Encoding anomaly: ${artifacts.join(', ')}`,
            suspicious: `Encoding artifacts. Someone — or something — converted these files. Was it intentional?`,
            accusatory: `Data was transformed. Not cleanly — artifacts remain. What was the original encoding? What was lost in conversion? What was gained?`
          });
          this.severity += 3;
        }
      } catch (err) {
        // Skip
      }
    });
  }

  _detectEmptyDiffs(commits) {
    commits.forEach(commit => {
      try {
        const diff = execSync(
          `git -C "${this.repoPath}" show --format="" --stat ${commit.hash}`,
          { encoding: 'utf-8' }
        ).trim();

        if (!diff || diff.length === 0) {
          const parents = execSync(
            `git -C "${this.repoPath}" show --format="%P" -s ${commit.hash}`,
            { encoding: 'utf-8' }
          ).trim().split(' ').filter(Boolean);

          if (parents.length <= 1) {
            this._addAnomaly({
              type: 'empty_commit',
              severity: 'low',
              commit: commit.hash.substring(0, 8),
              description: `Commit with no file changes`,
              detail: `Author: ${commit.authorName}, Message: "${commit.subject}"`,
              subject: commit.subject,
              clinical: `Empty commit (no diff)`,
              suspicious: `A commit that changes nothing. A bookmark? A trigger? Or a placeholder for something removed?`,
              accusatory: `Why does this commit exist? It touches nothing. It changes nothing. It's just... here. Marking time. Marking something.`
            });
            this.severity += 1;
          }
        }
      } catch (err) {
        // Skip
      }
    });
  }

  _detectFilePermissionChanges(commits) {
    commits.forEach(commit => {
      try {
        const output = execSync(
          `git -C "${this.repoPath}" diff-tree --no-commit-id -r ${commit.hash}`,
          { encoding: 'utf-8' }
        ).trim();

        if (!output) return;

        const lines = output.split('\n');
        const permissionChanges = lines.filter(line => {
          const parts = line.split(/\s+/);
          if (parts.length >= 5) {
            const oldMode = parts[0];
            const newMode = parts[1];
            return oldMode !== newMode && parts[3] === parts[4];
          }
          return false;
        });

        if (permissionChanges.length > 0) {
          permissionChanges.forEach(change => {
            const parts = change.split(/\s+/);
            const oldMode = parts[0];
            const newMode = parts[1];
            const file = parts[4] || 'unknown';

            const wasExecutable = (parseInt(oldMode, 8) & 0o111) !== 0;
            const isExecutable = (parseInt(newMode, 8) & 0o111) !== 0;

            if (!wasExecutable && isExecutable) {
              this._addAnomaly({
                type: 'permission_escalation',
                severity: 'high',
                commit: commit.hash.substring(0, 8),
                description: `File made executable: ${file}`,
                detail: `${oldMode} → ${newMode}`,
                subject: commit.subject,
                clinical: `Permission mode change: ${file} now executable`,
                suspicious: `${file} was made executable. Was it meant to be run? By whom?`,
                accusatory: `A file became executable. A script became active. Who triggered this — and what does it do now?`
              });
              this.severity += 3;
            }
          });
        }
      } catch (err) {
        // Skip
      }
    });
  }

  _detectMicroscopicChanges(commits) {
    commits.forEach(commit => {
      try {
        const diff = this._getCommitDiff(commit.hash);
        if (!diff || diff.length > this.maxDiffSize) return;

        const files = this._groupChangesByFile(diff);

        Object.entries(files).forEach(([file, changes]) => {
          if (changes.additions.length === 1 && changes.removals.length === 1) {
            const add = changes.additions[0];
            const rem = changes.removals[0];

            if (Math.abs(rem.length - add.length) <= 1) {
              let diffs = 0;
              for (let i = 0; i < Math.max(rem.length, add.length); i++) {
                if (rem[i] !== add[i]) diffs++;
                if (diffs > 1) break;
              }

              if (diffs === 1) {
                this._addAnomaly({
                  type: 'microscopic_change',
                  severity: 'medium',
                  commit: commit.hash.substring(0, 8),
                  description: `Single-character change in ${file}`,
                  detail: `Removal: "${rem}", Addition: "${add}"`,
                  subject: commit.subject,
                  clinical: `Single-character modification in ${file}`,
                  suspicious: `One character. Changed. In ${file}. A typo fix? Or something more deliberate?`,
                  accusatory: `A single character was changed in ${file}. A letter. A space. A mark. And the entire meaning shifted. Who noticed?`
                });
                this.severity += 2;
              }
            }
          }
        });
      } catch (err) {
        // Skip
      }
    });
  }

  _groupChangesByFile(diff) {
    const files = {};
    let currentFile = 'unknown';

    diff.split('\n').forEach(line => {
      if (line.startsWith('+++ ')) {
        currentFile = line.substring(6).trim();
        if (!files[currentFile]) {
          files[currentFile] = { additions: [], removals: [] };
        }
      } else if (line.startsWith('+') && !line.startsWith('+++')) {
        if (!files[currentFile]) {
          files[currentFile] = { additions: [], removals: [] };
        }
        files[currentFile].additions.push(line.substring(1));
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        if (!files[currentFile]) {
          files[currentFile] = { additions: [], removals: [] };
        }
        files[currentFile].removals.push(line.substring(1));
      }
    });

    return files;
  }

  _addAnomaly(anomaly) {
    anomaly.timestamp = new Date().toISOString();
    anomaly.category = 'metadata';
    this.anomalies.push(anomaly);
  }
}

module.exports = MetadataAnalyzer;
