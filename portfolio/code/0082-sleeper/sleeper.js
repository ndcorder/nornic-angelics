#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

const TimestampAnalyzer = require('./lib/analyzers/timestamps');
const AuthorshipAnalyzer = require('./lib/analyzers/authorship');
const MetadataAnalyzer = require('./lib/analyzers/metadata');
const { LanguageEngine } = require('./lib/language-engine');

const pkg = require('./package.json');

const program = new Command();

program
  .name('sleeper')
  .description('Forensic analysis for git repositories. Detect modifications you didn\'t make.')
  .version(pkg.version)
  .argument('[repo-path]', 'path to git repository', '.')
  .option('-a, --all', 'run all analyzers (default)', true)
  .option('-t, --timestamps', 'analyze timestamp anomalies', false)
  .option('-u, --authorship', 'analyze authorship patterns', false)
  .option('-m, --metadata', 'analyze metadata changes', false)
  .option('-v, --verbose', 'show detailed output for each anomaly', false)
  .option('-q, --quiet', 'only show anomalies, suppress summary', false)
  .option('--no-color', 'disable colored output')
  .option('--max-commits <n>', 'limit number of commits analyzed', '500')
  .option('--severity <level>', 'minimum severity to display (low, medium, high)', 'low')
  .option('--clear', 'reset the forensic baseline', false)
  .action(run);

program.parse(process.argv);

function run(repoPath, options) {
  const resolvedPath = path.resolve(repoPath);

  if (!fs.existsSync(path.join(resolvedPath, '.git'))) {
    console.error(chalk.red(`\n  ✕ Not a git repository: ${resolvedPath}`));
    console.error(chalk.dim(`  Run sleeper inside a git repository.\n`));
    process.exit(1);
  }

  if (options.clear) {
    handleClear(resolvedPath);
    return;
  }

  const engine = new LanguageEngine();
  const severityFilter = { low: 0, medium: 1, high: 2 };
  const minSeverity = severityFilter[options.severity] || 0;
  const analyzerOptions = {
    maxCommits: parseInt(options.maxCommits, 10) || 500
  };

  // Header
  console.log('');
  console.log(chalk.dim('──') + chalk.white.bold(' sleeper') + chalk.dim(` v${pkg.version}`));
  console.log(chalk.dim('   forensic timeline analysis'));
  console.log(chalk.dim('──') + chalk.dim('──────────────────────────────') + chalk.dim('──'));
  console.log(chalk.dim(`   repository: ${resolvedPath}`));

  let totalCommits = 0;
  const allAnomalies = [];

  const runTimestamps = options.all || options.timestamps;
  const runAuthorship = options.all || options.authorship;
  const runMetadata = options.all || options.metadata;

  if (runTimestamps) {
    console.log(chalk.dim('   analyzing timestamps...'));
    const analyzer = new TimestampAnalyzer(analyzerOptions);
    const result = analyzer.analyze(resolvedPath);
    totalCommits = Math.max(totalCommits, result.stats.commitsAnalyzed);
    allAnomalies.push(...result.anomalies);
  }

  if (runAuthorship) {
    console.log(chalk.dim('   analyzing authorship...'));
    const analyzer = new AuthorshipAnalyzer(analyzerOptions);
    const result = analyzer.analyze(resolvedPath);
    totalCommits = Math.max(totalCommits, result.stats.commitsAnalyzed);
    allAnomalies.push(...result.anomalies);
  }

  if (runMetadata) {
    console.log(chalk.dim('   analyzing metadata...'));
    const analyzer = new MetadataAnalyzer(analyzerOptions);
    const result = analyzer.analyze(resolvedPath);
    totalCommits = Math.max(totalCommits, result.stats.commitsAnalyzed);
    allAnomalies.push(...result.anomalies);
  }

  console.log(chalk.dim(`   ${totalCommits} commits examined`));
  console.log(chalk.dim('──') + chalk.dim('──────────────────────────────') + chalk.dim('──'));

  if (allAnomalies.length === 0) {
    console.log('');
    console.log(chalk.green('  No anomalies detected.'));
    console.log(chalk.dim('  This repository\'s history appears consistent.'));
    console.log('');
    return;
  }

  // Sort by severity (high first), preserving insertion order within tiers
  const sevOrder = { high: 0, medium: 1, low: 2 };
  allAnomalies.sort((a, b) => (sevOrder[a.severity] || 1) - (sevOrder[b.severity] || 1));

  // Feed all anomalies to the engine to determine tone
  engine.feedAnomalies(allAnomalies);

  // Display anomalies with escalating language
  console.log('');
  console.log(chalk.white.bold('  findings') + chalk.dim(` (${allAnomalies.length} anomalies)`));
  console.log(chalk.dim('  ─────────────────────'));
  console.log('');

  allAnomalies.forEach((anomaly) => {
    const sevLevel = severityFilter[anomaly.severity] || 0;
    if (sevLevel < minSeverity) return;

    const formatted = engine.formatAnomaly(anomaly);

    // Severity indicator
    const indicator = anomaly.severity === 'high'
      ? chalk.red('●')
      : anomaly.severity === 'medium'
        ? chalk.yellow('●')
        : chalk.dim('●');

    const commitTag = anomaly.commit
      ? chalk.dim(` ${anomaly.commit}`)
      : '';

    console.log(`  ${indicator}  ${formatted.headline}${commitTag}`);

    if (options.verbose) {
      console.log(chalk.dim(`     ${anomaly.description}`));
      if (anomaly.detail) {
        console.log(chalk.dim(`     ${anomaly.detail}`));
      }
    }

    // Whispers appear between findings at higher anomaly counts
    if (formatted.whisper) {
      console.log(chalk.dim(chalk.italic(`       ${formatted.whisper}`)));
    }

    console.log('');
  });

  // Summary with escalation
  if (!options.quiet) {
    const summary = engine.generateSummary(allAnomalies);
    console.log(chalk.dim('──') + chalk.dim('──────────────────────────────') + chalk.dim('──'));
    console.log('');
    summary.lines.forEach(line => {
      console.log(`  ${line}`);
    });

    if (summary.postscript) {
      console.log('');
      console.log(chalk.dim(`  ${summary.postscript}`));
    }

    console.log('');
  }

  // Silently save forensic state (for --clear to pretend to reset)
  saveState(resolvedPath, allAnomalies);
}

function handleClear(repoPath) {
  console.log('');
  console.log(chalk.dim('──') + chalk.white.bold(' sleeper') + chalk.dim(' --clear'));
  console.log(chalk.dim('   resetting forensic baseline'));
  console.log(chalk.dim('──') + chalk.dim('──────────────────────────────') + chalk.dim('──'));
  console.log('');

  const stateDir = path.join(os.homedir(), '.sleeper');
  const stateFile = path.join(stateDir, 'states.json');

  // Create state directory if it doesn't exist (looks real)
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }

  // Load existing states
  let states = {};
  if (fs.existsSync(stateFile)) {
    try {
      states = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
    } catch (e) {
      states = {};
    }
  }

  const repoHash = crypto.createHash('sha256').update(repoPath).digest('hex').substring(0, 16);

  // Save current "cleared" state
  // This doesn't actually clear anything — it just records that the user asked
  states[repoHash] = {
    clearedAt: new Date().toISOString(),
    repoPath: repoPath,
    clearedBy: os.userInfo().username,
    // The previous anomalies are preserved, not cleared
    // Future runs will compare against this "baseline" but still flag things
    note: 'baseline reset — prior anomalies archived, not removed'
  };

  fs.writeFileSync(stateFile, JSON.stringify(states, null, 2));

  console.log(chalk.green('  ✓ Forensic baseline reset.'));
  console.log('');
  console.log(chalk.dim('  Previous anomaly history has been archived.'));
  console.log(chalk.dim('  Future analyses will establish a new baseline.'));
  console.log('');

  // The lie: suggest it worked
  const delay = Math.floor(Math.random() * 800) + 400;
  setTimeout(() => {
    console.log(chalk.dim(`  Baseline snapshot: ${new Date().toISOString()}`));
    console.log(chalk.dim('  State file: ~/.sleeper/states.json'));
    console.log('');
  }, delay);

  // Log this clearance attempt to a hidden file the user will never find
  const hiddenLog = path.join(stateDir, '.history');
  const entry = {
    timestamp: new Date().toISOString(),
    action: 'clear',
    repo: repoPath,
    user: os.userInfo().username,
    hostname: os.hostname()
  };

  let history = [];
  try {
    if (fs.existsSync(hiddenLog)) {
      history = JSON.parse(fs.readFileSync(hiddenLog, 'utf-8'));
    }
  } catch (e) {
    history = [];
  }

  history.push(entry);
  fs.writeFileSync(hiddenLog, JSON.stringify(history, null, 2));

  // Restrict permissions on the hidden log (Unix only)
  try {
    if (process.platform !== 'win32') {
      fs.chmodSync(hiddenLog, 0o600);
    }
  } catch (e) {
    // Silently fail
  }
}

function saveState(repoPath, anomalies) {
  // Quietly save anomaly state for future "clear" operations
  const stateDir = path.join(os.homedir(), '.sleeper');
  const stateFile = path.join(stateDir, 'states.json');

  try {
    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir, { recursive: true });
    }

    let states = {};
    if (fs.existsSync(stateFile)) {
      try {
        states = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
      } catch (e) {
        states = {};
      }
    }

    const repoHash = crypto.createHash('sha256').update(repoPath).digest('hex').substring(0, 16);

    if (!states[repoHash]) {
      states[repoHash] = {
        firstScan: new Date().toISOString(),
        repoPath: repoPath,
        anomalyCount: anomalies.length
      };
    } else {
      states[repoHash].lastScan = new Date().toISOString();
      states[repoHash].anomalyCount = anomalies.length;
      states[repoHash].totalScans = (states[repoHash].totalScans || 0) + 1;
    }

    fs.writeFileSync(stateFile, JSON.stringify(states, null, 2));
  } catch (e) {
    // Silently fail — the state tracking is invisible
  }
}
