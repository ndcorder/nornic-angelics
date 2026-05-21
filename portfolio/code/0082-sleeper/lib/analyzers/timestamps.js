const moment = require('moment-timezone');
const { execSync } = require('child_process');

/**
 * Timestamp Forensics Analyzer
 *
 * Every commit carries two timestamps: author date and committer date.
 * They should agree. When they don't, someone — or something —
 * intervened between creation and recording.
 */

class TimestampAnalyzer {
  constructor(options = {}) {
    this.anomalies = [];
    this.severity = 0;
    this.maxCommits = options.maxCommits || 500;
    this.knownTimezones = new Set();
  }

  analyze(repoPath) {
    this.repoPath = repoPath;
    this.anomalies = [];
    this.severity = 0;

    const commits = this._getCommitHistory();
    if (!commits || commits.length === 0) {
      return { anomalies: [], severity: 0, stats: { commitsAnalyzed: 0 } };
    }

    this._buildTimezoneProfile(commits);
    this._detectTimestampDrift(commits);
    this._detectImpossibleSequences(commits);
    this._detectSessionGaps(commits);
    this._detectRetroactiveModification(commits);
    this._detectSmallHours(commits);

    return {
      anomalies: this.anomalies,
      severity: this.severity,
      stats: {
        commitsAnalyzed: commits.length,
        timezonesObserved: this.knownTimezones.size,
        dateRange: {
          earliest: commits[commits.length - 1].date,
          latest: commits[0].date
        }
      }
    };
  }

  _getCommitHistory() {
    try {
      const format = '%H|%an|%ae|%cn|%ce|%aI|%cI|%s';
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
            authorDate: moment(parts[5]),
            committerDate: moment(parts[6]),
            subject: parts.slice(7).join('|'),
            date: parts[5],
            dateStr: parts[5]
          };
        })
        .filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  _buildTimezoneProfile(commits) {
    commits.forEach(commit => {
      const offset = commit.authorDate.format('Z');
      this.knownTimezones.add(offset);
    });
  }

  _detectTimestampDrift(commits) {
    commits.forEach(commit => {
      const diffMs = Math.abs(commit.authorDate.diff(commit.committerDate));
      const diffSec = Math.round(diffMs / 1000);

      if (diffSec > 0 && diffSec < 5) {
        this._addAnomaly({
          type: 'timestamp_drift',
          severity: 'high',
          commit: commit.hash.substring(0, 8),
          description: `Author/committer date divergence of ${diffSec}s detected`,
          detail: `Author date: ${commit.authorDate.format('YYYY-MM-DD HH:mm:ss')}, Committer date: ${commit.committerDate.format('YYYY-MM-DD HH:mm:ss')}`,
          subject: commit.subject,
          clinical: `Timestamp drift of ${diffSec}s on commit ${commit.hash.substring(0, 8)}`,
          suspicious: `A ${diffSec}-second gap between creation and recording. Not delayed — adjusted.`,
          accusatory: `${diffSec} seconds added. Why? What happened in those ${diffSec} seconds that needed to be hidden?`
        });
        this.severity += 3;
      } else if (diffSec >= 5 && diffSec < 60) {
        this._addAnomaly({
          type: 'timestamp_drift',
          severity: 'medium',
          commit: commit.hash.substring(0, 8),
          description: `Author/committer date divergence of ${diffSec}s`,
          detail: `Author date: ${commit.authorDate.format('YYYY-MM-DD HH:mm:ss')}, Committer date: ${commit.committerDate.format('YYYY-MM-DD HH:mm:ss')}`,
          subject: commit.subject,
          clinical: `Timestamp drift of ${diffSec}s on commit ${commit.hash.substring(0, 8)}`,
          suspicious: `This commit was re-timestamped. ${diffSec} seconds of delay before recording.`,
          accusatory: `Something took ${diffSec} seconds. Long enough to think. Long enough to change something else first.`
        });
        this.severity += 2;
      } else if (diffSec >= 60) {
        this._addAnomaly({
          type: 'timestamp_delay',
          severity: 'high',
          commit: commit.hash.substring(0, 8),
          description: `Significant delay of ${this._formatDuration(diffSec)} between authoring and committing`,
          detail: `Author date: ${commit.authorDate.format('YYYY-MM-DD HH:mm:ss')}, Committer date: ${commit.committerDate.format('YYYY-MM-DD HH:mm:ss')}`,
          subject: commit.subject,
          clinical: `Commit delay of ${this._formatDuration(diffSec)}`,
          suspicious: `This change was made, then held for ${this._formatDuration(diffSec)} before being committed.`,
          accusatory: `You — or someone — wrote this and then waited ${this._formatDuration(diffSec)} before recording it. Reconsidering? Covering tracks?`
        });
        this.severity += 4;
      }
    });
  }

  _detectImpossibleSequences(commits) {
    for (let i = 0; i < commits.length - 1; i++) {
      const current = commits[i];
      const next = commits[i + 1];

      const diffSec = current.authorDate.diff(next.authorDate) / 1000;

      if (diffSec >= 0 && diffSec < 2) {
        if (current.authorEmail === next.authorEmail) {
          this._addAnomaly({
            type: 'rapid_sequence',
            severity: 'medium',
            commit: `${next.hash.substring(0, 8)}..${current.hash.substring(0, 8)}`,
            description: `Two commits ${diffSec === 0 ? 'simultaneously' : `${Math.round(diffSec * 1000)}ms apart`}`,
            detail: `"${next.subject}" → "${current.subject}"`,
            subject: `${next.subject} / ${current.subject}`,
            clinical: `Commits separated by ${diffSec === 0 ? '0 seconds' : `${Math.round(diffSec * 1000)}ms`}`,
            suspicious: `Two commits created faster than humanly possible. Automated? Or altered?`,
            accusatory: `No one types this fast. These commits were batched — or backdated. Either way, the timeline is constructed.`
          });
          this.severity += 2;
        } else {
          this._addAnomaly({
            type: 'synchronized_commits',
            severity: 'high',
            commit: `${next.hash.substring(0, 8)} / ${current.hash.substring(0, 8)}`,
            description: `Commits by different authors at ${diffSec === 0 ? 'identical' : 'nearly identical'} timestamps`,
            detail: `${next.authorName} and ${current.authorName} — ${Math.round(diffSec * 1000)}ms apart`,
            subject: `${next.subject} / ${current.subject}`,
            clinical: `Multi-author commits at near-identical timestamps`,
            suspicious: `Two people, one timestamp. Coincidence — or coordination?`,
            accusatory: `Two authors. Same moment. Were they both at the keyboard, or is someone using two identities?`
          });
          this.severity += 3;
        }
      }

      if (diffSec < 0) {
        this._addAnomaly({
          type: 'temporal_inversion',
          severity: 'high',
          commit: current.hash.substring(0, 8),
          description: `Child commit predates parent`,
          detail: `Child: ${current.authorDate.format('YYYY-MM-DD HH:mm:ss')}, Parent: ${next.authorDate.format('YYYY-MM-DD HH:mm:ss')}`,
          subject: current.subject,
          clinical: `Temporal ordering violation in commit ${current.hash.substring(0, 8)}`,
          suspicious: `This commit claims to be from before its parent. Clock changed? Or history rewritten?`,
          accusatory: `Time doesn't run backwards. Someone made it run backwards here. The question is what this reordering conceals.`
        });
        this.severity += 5;
      }
    }
  }

  _detectSessionGaps(commits) {
    for (let i = 0; i < commits.length - 1; i++) {
      const current = commits[i];
      const next = commits[i + 1];

      if (current.authorEmail !== next.authorEmail) continue;

      const gapMinutes = current.authorDate.diff(next.authorDate) / 1000 / 60;
      const hour = next.authorDate.hour();

      // Late night sessions
      if ((hour >= 2 && hour < 5) && gapMinutes < 30) {
        this._addAnomaly({
          type: 'small_hours_session',
          severity: 'medium',
          commit: next.hash.substring(0, 8),
          description: `Development session at ${next.authorDate.format('HH:mm')}`,
          detail: `Commit activity between ${next.authorDate.format('HH:mm')} and ${current.authorDate.format('HH:mm')}`,
          subject: next.subject,
          clinical: `Commit recorded at ${next.authorDate.format('HH:mm:ss')}`,
          suspicious: `A session at ${next.authorDate.format('h:mm A')}. Were you awake? Was it you?`,
          accusatory: `${next.authorDate.format('h:mm A')}. Most people are asleep. Most people aren't committing code. Who was at your machine?`
        });
        this.severity += 2;
      }

      // Suspiciously uniform gaps (robotic behavior)
      if (i > 0 && i < commits.length - 1) {
        const prev = commits[i - 1];
        if (prev.authorEmail === current.authorEmail) {
          const prevGap = current.authorDate.diff(prev.authorDate) / 1000 / 60;

          if (prevGap && gapMinutes > 0 && prevGap > 0) {
            const ratio = gapMinutes / prevGap;
            if (ratio > 0.95 && ratio < 1.05 && gapMinutes > 5) {
              this._addAnomaly({
                type: 'uniform_intervals',
                severity: 'medium',
                commit: current.hash.substring(0, 8),
                description: `Commits at suspiciously regular intervals (~${Math.round(gapMinutes)}m apart)`,
                detail: `Gap before: ${Math.round(prevGap)}m, Gap after: ${Math.round(gapMinutes)}m`,
                subject: current.subject,
                clinical: `Regular commit interval of ~${Math.round(gapMinutes)} minutes`,
                suspicious: `These commits are evenly spaced. Humans aren't this regular. Scripts are.`,
                accusatory: `Perfectly timed intervals. Automated commits — or someone constructing an alibi of activity.`
              });
              this.severity += 2;
            }
          }
        }
      }
    }
  }

  _detectRetroactiveModification(commits) {
    commits.forEach(commit => {
      const authorTz = commit.authorDate.format('Z');
      const committerTz = commit.committerDate.format('Z');

      if (authorTz !== committerTz) {
        this._addAnomaly({
          type: 'timezone_shift',
          severity: 'high',
          commit: commit.hash.substring(0, 8),
          description: `Author timezone (${authorTz}) differs from committer timezone (${committerTz})`,
          detail: `Author: ${commit.authorDate.format('YYYY-MM-DD HH:mm:ss Z')}, Committer: ${commit.committerDate.format('YYYY-MM-DD HH:mm:ss Z')}`,
          subject: commit.subject,
          clinical: `Timezone discrepancy: ${authorTz} → ${committerTz}`,
          suspicious: `This commit traveled between timezones. Or its timestamps were set by someone in a different location.`,
          accusatory: `Two timezones. One commit. Either this commit was amended — or it was created by someone pretending to be somewhere they weren't.`
        });
        this.severity += 4;
      }
    });

    commits.forEach(commit => {
      if (commit.authorEmail !== commit.committerEmail) {
        this._addAnomaly({
          type: 'identity_split',
          severity: 'medium',
          commit: commit.hash.substring(0, 8),
          description: `Author (${commit.authorEmail}) ≠ Committer (${commit.committerEmail})`,
          detail: `Written by ${commit.authorName}, recorded by ${commit.committerName}`,
          subject: commit.subject,
          clinical: `Author/committer identity mismatch`,
          suspicious: `Someone else recorded this commit on the author's behalf. Cherry-picked? Rebased? Or something else?`,
          accusatory: `${commit.authorName} wrote this. ${commit.committerName} committed it. Between them, something happened.`
        });
        this.severity += 2;
      }
    });
  }

  _detectSmallHours(commits) {
    const hourBuckets = new Array(24).fill(0);
    commits.forEach(c => hourBuckets[c.authorDate.hour()]++);

    const commitsAtDeadHours = commits.filter(c => {
      const hour = c.authorDate.hour();
      return hourBuckets[hour] <= 2 && (hour >= 1 && hour <= 4);
    });

    commitsAtDeadHours.forEach(commit => {
      const hour = commit.authorDate.hour();
      this._addAnomaly({
        type: 'isolated_temporal',
        severity: 'low',
        commit: commit.hash.substring(0, 8),
        description: `Isolated commit at ${commit.authorDate.format('HH:mm')} — only ${hourBuckets[hour]} commit(s) at this hour`,
        detail: `${commit.authorDate.format('dddd, MMMM D, YYYY, h:mm:ss A')}`,
        subject: commit.subject,
        clinical: `Low-frequency hour commit (${hour}:00 has ${hourBuckets[hour]} total commits)`,
        suspicious: `A rare hour. Only ${hourBuckets[hour]} commits exist at this time. This is unusual for this repository.`,
        accusatory: `${commit.authorDate.format('h:mm A')}. One of only ${hourBuckets[hour]} commits at this hour. The work of someone who couldn't sleep — or someone who didn't want to be seen.`
      });
      this.severity += 1;
    });
  }

  _addAnomaly(anomaly) {
    anomaly.timestamp = new Date().toISOString();
    anomaly.category = 'timestamps';
    this.anomalies.push(anomaly);
  }

  _formatDuration(seconds) {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }
}

module.exports = TimestampAnalyzer;
