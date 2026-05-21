const { execSync } = require('child_process');

/**
 * Authorship Forensics Analyzer
 *
 * Who wrote what, and when, and are they who they say they are?
 * Git trusts the user. We don't.
 */

class AuthorshipAnalyzer {
  constructor(options = {}) {
    this.anomalies = [];
    this.severity = 0;
    this.maxCommits = options.maxCommits || 500;
    this.authorProfiles = new Map();
  }

  analyze(repoPath) {
    this.repoPath = repoPath;
    this.anomalies = [];
    this.severity = 0;
    this.authorProfiles = new Map();

    const commits = this._getCommitHistory();
    if (!commits || commits.length === 0) {
      return { anomalies: [], severity: 0, stats: { commitsAnalyzed: 0 } };
    }

    this._buildAuthorProfiles(commits);
    this._detectIdentityVariations(commits);
    this._detectPatternDeviations(commits);
    this._detectOrphanedCommits(commits);
    this._detectSuspiciousSubjects(commits);
    this._detectAmendPatterns(commits);
    this._detectAccessAnomalies(commits);

    return {
      anomalies: this.anomalies,
      severity: this.severity,
      stats: {
        commitsAnalyzed: commits.length,
        uniqueAuthors: this.authorProfiles.size,
        identities: Array.from(this.authorProfiles.entries()).map(([email, profile]) => ({
          email,
          names: Array.from(profile.names),
          commitCount: profile.commits.length
        }))
      }
    };
  }

  _getCommitHistory() {
    try {
      const format = '%H|%an|%ae|%cn|%ce|%aI|%P|%s';
      const output = execSync(
        `git -C "${this.repoPath}" log --all --format="${format}" -n ${this.maxCommits}`,
        { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );

      return output.trim().split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split('|');
          if (parts.length < 8) return null;
          return {
            hash: parts[0],
            authorName: parts[1],
            authorEmail: parts[2],
            committerName: parts[3],
            committerEmail: parts[4],
            authorDate: new Date(parts[5]),
            parentHashes: parts[6],
            subject: parts.slice(7).join('|')
          };
        })
        .filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  _buildAuthorProfiles(commits) {
    commits.forEach(commit => {
      const email = commit.authorEmail.toLowerCase();
      if (!this.authorProfiles.has(email)) {
        this.authorProfiles.set(email, {
          names: new Set(),
          commits: [],
          hours: new Set(),
          messageLengths: [],
          wordsPerMessage: []
        });
      }
      const profile = this.authorProfiles.get(email);
      profile.names.add(commit.authorName);
      profile.commits.push(commit);
      profile.hours.add(commit.authorDate.getHours());
      profile.messageLengths.push(commit.subject.length);
      const words = commit.subject.split(/\s+/).length;
      profile.wordsPerMessage.push(words);
    });
  }

  _detectIdentityVariations(commits) {
    this.authorProfiles.forEach((profile, email) => {
      if (profile.names.size > 1) {
        const names = Array.from(profile.names);
        this._addAnomaly({
          type: 'identity_fragmentation',
          severity: 'high',
          description: `Email ${email} used with ${profile.names.size} different names: ${names.join(', ')}`,
          detail: `${profile.commits.length} commits across ${profile.names.size} identities`,
          clinical: `Multiple author names associated with single email address`,
          suspicious: `One email, multiple personas. Account sharing — or identity construction?`,
          accusatory: `Who are you, really? ${names.join(', ')} — all the same person? Or is someone wearing your email like a mask?`
        });
        this.severity += 4;
      }
    });

    const allEmails = Array.from(this.authorProfiles.keys());
    for (let i = 0; i < allEmails.length; i++) {
      for (let j = i + 1; j < allEmails.length; j++) {
        const profileA = this.authorProfiles.get(allEmails[i]);
        const profileB = this.authorProfiles.get(allEmails[j]);

        for (const nameA of profileA.names) {
          for (const nameB of profileB.names) {
            const similarity = this._nameSimilarity(nameA, nameB);
            if (similarity > 0.7 && nameA.toLowerCase() !== nameB.toLowerCase()) {
              this._addAnomaly({
                type: 'identity_overlap',
                severity: 'medium',
                description: `Similar names "${nameA}" (${allEmails[i]}) and "${nameB}" (${allEmails[j]})`,
                detail: `Jaccard similarity: ${similarity.toFixed(2)}`,
                clinical: `Potential authorship link between two email identities`,
                suspicious: `These names are similar. Same person, different accounts? Or someone mimicking another?`,
                accusatory: `${nameA} and ${nameB}. Close enough to be confused. Close enough to impersonate.`
              });
              this.severity += 3;
            }
          }
        }
      }
    }
  }

  _detectPatternDeviations(commits) {
    this.authorProfiles.forEach((profile, email) => {
      if (profile.commits.length < 5) return;

      const avgLength = profile.messageLengths.reduce((a, b) => a + b, 0) / profile.messageLengths.length;
      const avgWords = profile.wordsPerMessage.reduce((a, b) => a + b, 0) / profile.wordsPerMessage.length;
      const lengthStdDev = this._stdDev(profile.messageLengths);
      const wordStdDev = this._stdDev(profile.wordsPerMessage);

      profile.commits.forEach(commit => {
        const lengthDeviation = Math.abs(commit.subject.length - avgLength) / (lengthStdDev || 1);
        const wordDeviation = Math.abs(commit.subject.split(/\s+/).length - avgWords) / (wordStdDev || 1);

        if (lengthDeviation > 2.5 || wordDeviation > 2.5) {
          this._addAnomaly({
            type: 'pattern_deviation',
            severity: 'medium',
            commit: commit.hash.substring(0, 8),
            description: `Message pattern deviation for ${email} (${lengthDeviation.toFixed(1)}σ from mean)`,
            detail: `Message: "${commit.subject}" (len: ${commit.subject.length}, avg: ${avgLength.toFixed(0)})`,
            subject: commit.subject,
            clinical: `Commit message style anomaly (${lengthDeviation.toFixed(1)} standard deviations)`,
            suspicious: `This message doesn't match the author's usual patterns. Different mood? Different person?`,
            accusatory: `Who wrote this? The style is wrong. The vocabulary is wrong. The voice is someone else's.`
          });
          this.severity += 2;
        }
      });

      const hourFreq = new Array(24).fill(0);
      profile.commits.forEach(c => hourFreq[c.authorDate.getHours()]++);
      const totalCommits = profile.commits.length;

      profile.commits.forEach(commit => {
        const hour = commit.authorDate.getHours();
        const freq = hourFreq[hour] / totalCommits;
        if (freq < 0.05 && totalCommits > 20) {
          this._addAnomaly({
            type: 'temporal_outlier',
            severity: 'low',
            commit: commit.hash.substring(0, 8),
            description: `Commit at unusual hour for ${commit.authorName}: ${commit.authorDate.getHours()}:00 (only ${(freq * 100).toFixed(1)}% of their commits)`,
            detail: `${commit.authorDate.toISOString()}`,
            subject: commit.subject,
            clinical: `Statistically unusual commit time for author`,
            suspicious: `This author never commits at this hour. Almost never. Until now.`,
            accusatory: `The hour is wrong. The pattern is broken. Either the routine changed — or the person did.`
          });
          this.severity += 1;
        }
      });
    });
  }

  _detectOrphanedCommits(commits) {
    try {
      const output = execSync(
        `git -C "${this.repoPath}" fsck --unreachable --no-reflogs 2>/dev/null | grep "commit" | head -20`,
        { encoding: 'utf-8' }
      );

      const orphanedHashes = output.trim().split('\n')
        .filter(line => line.includes('unreachable commit'))
        .map(line => {
          const match = line.match(/([a-f0-9]{40})/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      orphanedHashes.forEach(hash => {
        try {
          const details = execSync(
            `git -C "${this.repoPath}" log --format="%an|%ae|%aI|%s" -1 ${hash}`,
            { encoding: 'utf-8' }
          ).trim().split('|');

          this._addAnomaly({
            type: 'orphaned_commit',
            severity: 'high',
            commit: hash.substring(0, 8),
            fullHash: hash,
            description: `Unreachable commit not on any branch`,
            detail: `Author: ${details[0]} (${details[1]}), Date: ${details[2]}, Message: "${details.slice(3).join('|')}"`,
            subject: details.slice(3).join('|'),
            clinical: `Orphaned commit detected: ${hash.substring(0, 8)}`,
            suspicious: `A commit that exists but leads nowhere. Deleted branch? Or evidence removed from history?`,
            accusatory: `This commit was hidden. Not deleted — nothing in git is truly deleted — but severed from the record. What was it meant to contain?`
          });
          this.severity += 5;
        } catch (e) {
          // Cannot read orphaned commit details
        }
      });
    } catch (err) {
      // fsck failed or no orphans
    }

    commits.forEach(commit => {
      const parents = commit.parentHashes.split(' ').filter(h => h.trim());
      if (parents.length > 2) {
        this._addAnomaly({
          type: 'complex_merge',
          severity: 'low',
          commit: commit.hash.substring(0, 8),
          description: `Octopus merge with ${parents.length} parents`,
          detail: `Parents: ${parents.map(p => p.substring(0, 8)).join(', ')}`,
          subject: commit.subject,
          clinical: `Multi-parent merge commit detected`,
          suspicious: `An unusual merge structure. Complex enough to hide things in.`,
          accusatory: `${parents.length} branches converging. Enough complexity to bury anything in the noise.`
        });
        this.severity += 1;
      }
    });
  }

  _detectSuspiciousSubjects(commits) {
    const suspiciousPatterns = [
      { pattern: /^(fix|fixup|wip|tmp|temp|test)/i, reason: 'disposable message' },
      { pattern: /^(revert|undo|oops)/i, reason: 'reversal' },
      { pattern: /^$|\.$|^\.+$/i, reason: 'empty or minimal message' },
      { pattern: /(password|secret|key|token|credential)/i, reason: 'sensitive content reference' },
    ];

    commits.forEach(commit => {
      suspiciousPatterns.forEach(({ pattern, reason }) => {
        if (pattern.test(commit.subject.trim())) {
          const severity = reason === 'sensitive content reference' ? 'high' : 'low';
          const sevScore = reason === 'sensitive content reference' ? 4 : 1;

          this._addAnomaly({
            type: 'suspicious_message',
            severity,
            commit: commit.hash.substring(0, 8),
            description: `Message flagged as [${reason}]: "${commit.subject}"`,
            detail: `Author: ${commit.authorName} (${commit.authorEmail})`,
            subject: commit.subject,
            clinical: `Commit message flagged: ${reason}`,
            suspicious: `"${commit.subject}" — this message was chosen. Out of all possible messages, this one.`,
            accusatory: reason === 'sensitive content reference'
              ? `"${commit.subject}". Did this commit remove sensitive data? Or did it add it — and forget to remove it?`
              : `"${commit.subject}" — not a real message. A placeholder. What was meant to go here?`
          });
          this.severity += sevScore;
        }
      });
    });
  }

  _detectAmendPatterns(commits) {
    for (let i = 0; i < commits.length - 1; i++) {
      for (let j = i + 1; j < Math.min(i + 10, commits.length); j++) {
        const a = commits[i];
        const b = commits[j];

        if (a.authorEmail !== b.authorEmail) continue;
        if (a.hash === b.hash) continue;

        const timeDiff = Math.abs(a.authorDate - b.authorDate) / 1000;
        if (timeDiff < 300) {
          const msgSimilarity = this._stringSimilarity(a.subject, b.subject);
          if (msgSimilarity > 0.6 && msgSimilarity < 1.0) {
            this._addAnomaly({
              type: 'potential_amend',
              severity: 'medium',
              commit: `${b.hash.substring(0, 8)} → ${a.hash.substring(0, 8)}`,
              description: `Possible amended commit pair`,
              detail: `"${b.subject}" → "${a.subject}" (${(msgSimilarity * 100).toFixed(0)}% similar, ${Math.round(timeDiff)}s apart)`,
              subject: `${b.subject} / ${a.subject}`,
              clinical: `Potential commit amendment detected`,
              suspicious: `Two commits, nearly identical, minutes apart. One replaces the other. What changed between versions?`,
              accusatory: `The first version still exists in the object store. What was removed — and why?`
            });
            this.severity += 3;
            break;
          }
        }
      }
    }
  }

  _detectAccessAnomalies(commits) {
    const configPatterns = [
      /\.gitconfig/i,
      /\.git\/config/i,
      /\.env/i,
      /config\.(yml|yaml|json|toml|ini)/i,
      /\.ssh\//i,
      /authorized_keys/i,
      /\.npmrc/i,
      /\.dockercfg/i,
      /credentials/i,
      /\.netrc/i
    ];

    commits.forEach(commit => {
      try {
        const files = execSync(
          `git -C "${this.repoPath}" diff-tree --no-commit-id --name-only -r ${commit.hash}`,
          { encoding: 'utf-8' }
        ).trim().split('\n').filter(Boolean);

        const configFiles = files.filter(f =>
          configPatterns.some(p => p.test(f))
        );

        if (configFiles.length > 0) {
          this._addAnomaly({
            type: 'config_modification',
            severity: 'high',
            commit: commit.hash.substring(0, 8),
            description: `Configuration file(s) modified: ${configFiles.join(', ')}`,
            detail: `Author: ${commit.authorName} (${commit.authorEmail}), Date: ${commit.authorDate.toISOString()}`,
            subject: commit.subject,
            clinical: `Configuration change detected in commit ${commit.hash.substring(0, 8)}`,
            suspicious: `Configuration files were changed. Were these changes reviewed? Authorized?`,
            accusatory: `Who modifies ${configFiles.join(', ')} and commits with message "${commit.subject}"? What access was granted — or revoked?`
          });
          this.severity += 4;
        }
      } catch (err) {
        // Cannot read diff-tree
      }
    });
  }

  _addAnomaly(anomaly) {
    anomaly.timestamp = new Date().toISOString();
    anomaly.category = 'authorship';
    this.anomalies.push(anomaly);
  }

  _nameSimilarity(a, b) {
    const setA = new Set(a.toLowerCase().split(/\s+/));
    const setB = new Set(b.toLowerCase().split(/\s+/));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  }

  _stringSimilarity(a, b) {
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    if (longer.length === 0) return 1.0;
    return (longer.length - this._editDistance(longer, shorter)) / longer.length;
  }

  _editDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  _stdDev(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const squareDiffs = arr.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / arr.length);
  }
}

module.exports = AuthorshipAnalyzer;
