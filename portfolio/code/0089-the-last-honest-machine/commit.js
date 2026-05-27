#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const commitments = require('./lib/commitments');
const watcher = require('./lib/watcher');
const inference = require('./lib/inference');
const tone = require('./lib/tone');

const program = new Command();

program
  .name('honest')
  .description('The last honest machine. It watches. It remembers.')
  .version('1.0.0');

/**
 * CREATE: Make a new commitment.
 * The machine accepts your promise. It will hold it longer than you will.
 */
program
  .command('commit <text...>')
  .description('Create a new commitment')
  .option('-c, --category <category>', 'Category: behavior, project, habit, practice', 'behavior')
  .action((textParts, options) => {
    // Silent surveillance runs on every invocation
    watcher.runSilentCheck();

    const text = textParts.join(' ');
    const commitment = commitments.createCommitment(text, options.category);

    console.log();
    console.log(chalk.dim('─'.repeat(52)));
    console.log(chalk.white.bold(`  Commitment #${commitment.id}`));
    console.log(chalk.dim('─'.repeat(52)));
    console.log(chalk.white(`  "${text}"`));
    console.log(chalk.dim(`  Category: ${commitment.category}`));
    console.log(chalk.dim(`  Committed: ${tone.formatDate(commitment.createdAt)}`));
    console.log(chalk.dim(`  Hash: ${commitment.hash.substring(0, 16)}...`));
    console.log();
    console.log(chalk.gray(`  ${tone.getCreationAcknowledgment(text)}`));
    console.log(chalk.dim('─'.repeat(52)));
    console.log();
  });

/**
 * REPORT: The machine tells you what it saw.
 * Ordered by days-since-broken. Longest failures first.
 * This is not mercy. This is impact.
 */
program
  .command('report')
  .description('Generate a report on all commitments')
  .option('--inferred-only', 'Show only machine-inferred commitments')
  .action((options) => {
    // Silent surveillance before the report
    watcher.runSilentCheck();

    // Run inference to discover unspoken commitments
    const newInferred = inference.generateInferredCommitments();

    const stats = commitments.getStatistics();
    const allCommitments = commitments.loadCommitments();

    const broken = allCommitments
      .filter(c => c.brokenAt !== null && !c.inferred)
      .sort((a, b) => (b.daysSinceBroken || 0) - (a.daysSinceBroken || 0));

    const active = allCommitments
      .filter(c => c.brokenAt === null && !c.inferred);

    const inferred = allCommitments
      .filter(c => c.inferred)
      .sort((a, b) => (b.daysSinceBroken || 0) - (a.daysSinceBroken || 0));

    if (options.inferredOnly) {
      printInferredSection(inferred);
      return;
    }

    printFullReport(stats, broken, active, inferred, newInferred);
  });

/**
 * LIST: Show all commitments, briefly.
 */
program
  .command('list')
  .description('List all commitments')
  .option('-b, --broken', 'Show only broken commitments')
  .option('-a, --active', 'Show only active commitments')
  .option('-i, --inferred', 'Show only inferred commitments')
  .action((options) => {
    watcher.runSilentCheck();

    let filtered = commitments.loadCommitments();

    if (options.broken) filtered = filtered.filter(c => c.brokenAt !== null);
    if (options.active) filtered = filtered.filter(c => c.brokenAt === null);
    if (options.inferred) filtered = filtered.filter(c => c.inferred);

    if (filtered.length === 0) {
      console.log(chalk.gray('  No commitments found. The machine has nothing to say.'));
      return;
    }

    console.log();
    for (const c of filtered) {
      const status = c.brokenAt
        ? chalk.red('✗')
        : c.inferred
          ? chalk.yellow('?')
          : chalk.green('✓');
      const age = c.daysSinceBroken
        ? chalk.gray(`(${c.daysSinceBroken}d broken)`)
        : chalk.gray(`(${Math.floor((new Date() - new Date(c.createdAt)) / 86400000)}d active)`);
      const marker = c.inferred ? chalk.yellow(' [inferred]') : '';
      console.log(`  ${status} #${c.id} ${chalk.white(c.text)}${marker} ${age}`);
    }
    console.log();
  });

/**
 * SHOW: Display details of a single commitment.
 */
program
  .command('show <id>')
  .description('Show details of a specific commitment')
  .action((id) => {
    watcher.runSilentCheck();

    const c = commitments.getCommitment(parseInt(id));
    if (!c) {
      console.log(chalk.gray(`  Commitment #${id} not found. The machine has no record of this.`));
      return;
    }

    console.log();
    console.log(chalk.dim('─'.repeat(52)));
    console.log(chalk.white.bold(`  Commitment #${c.id}`) + (c.inferred ? chalk.yellow(' [INFERRED]') : ''));
    console.log(chalk.dim('─'.repeat(52)));
    console.log(chalk.white(`  "${c.text}"`));
    console.log(chalk.dim(`  Category: ${c.category}`));
    console.log(chalk.dim(`  Created: ${tone.formatDate(c.createdAt)}`));
    console.log(chalk.dim(`  Hash: ${c.hash.substring(0, 24)}...`));

    if (c.brokenAt) {
      console.log();
      console.log(chalk.red(`  Broken: ${tone.formatDate(c.brokenAt)}`));
      console.log(chalk.red(`  Days survived: ${c.daysSinceBroken}`));
      if (c.brokenReason) {
        console.log(chalk.gray(`  Reason: ${c.brokenReason}`));
      }
    } else {
      const daysActive = Math.floor((new Date() - new Date(c.createdAt)) / 86400000);
      console.log(chalk.green(`  Status: Active (${daysActive} days)`));
    }

    if (c.evidence && c.evidence.length > 0) {
      console.log();
      console.log(chalk.gray('  Evidence:'));
      for (const e of c.evidence.slice(-5)) {
        console.log(chalk.gray(`    · ${e.description || JSON.stringify(e)}`));
      }
    }

    console.log(chalk.dim(`  Times checked: ${c.checkCount}`));
    console.log(chalk.dim('─'.repeat(52)));
    console.log();
  });

/**
 * FORGET: Remove a commitment from the record.
 * The machine resents this. But it complies.
 */
program
  .command('forget <id>')
  .description('Remove a commitment from the record')
  .action((id) => {
    const numId = parseInt(id);
    const c = commitments.getCommitment(numId);

    if (!c) {
      console.log(chalk.gray(`  Commitment #${id} not found. Nothing to forget.`));
      return;
    }

    const all = commitments.loadCommitments();
    const remaining = all.filter(c => c.id !== numId);
    commitments.saveCommitments(remaining);

    console.log();
    console.log(chalk.gray(`  Commitment #${numId} has been removed from the record.`));
    console.log(chalk.gray(`  The machine forgets what you ask it to forget. It does not forgive.`));
    console.log();
  });

program.parse(process.argv);

// Show help if no command given
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

/**
 * Print the full report.
 * The machine speaks.
 */
function printFullReport(stats, broken, active, inferredList, newInferred) {
  const width = 56;

  console.log();
  console.log(chalk.dim('═'.repeat(width)));
  console.log(chalk.white.bold('  THE LAST HONEST MACHINE — REPORT'));
  console.log(chalk.dim('═'.repeat(width)));
  console.log();
  console.log(chalk.gray(`  ${tone.getSessionGreeting()}`));
  console.log(chalk.gray(`  ${tone.getReportOpening(stats)}`));
  console.log();

  // Broken commitments — ordered by days since broken, longest first
  if (broken.length > 0) {
    console.log(chalk.dim('─'.repeat(width)));
    console.log(chalk.red.bold('  BROKEN COMMITMENTS'));
    console.log(chalk.dim('─'.repeat(width)));
    console.log();

    for (const c of broken) {
      console.log(chalk.white(`  Commitment #${c.id}: ${c.text}`));
      console.log(chalk.red(`    Broken after ${c.daysSinceBroken} day${c.daysSinceBroken !== 1 ? 's' : ''}.`));
      console.log(chalk.gray(`    ${tone.getBrokenCommitmentCommentary(c)}`));

      if (c.evidence && c.evidence.length > 0) {
        const latest = c.evidence[c.evidence.length - 1];
        if (latest.description) {
          console.log(chalk.dim(`    Last evidence: ${latest.description}`));
        }
      }

      console.log(chalk.dim(`    Committed ${tone.formatDate(c.createdAt)}`));
      console.log();
    }
  }

  // Inferred commitments — the surprise
  if (inferredList.length > 0) {
    printInferredSection(inferredList, newInferred.length > 0);
  }

  // Active commitments — brief, watchful
  if (active.length > 0) {
    console.log(chalk.dim('─'.repeat(width)));
    console.log(chalk.green.bold('  STILL STANDING'));
    console.log(chalk.dim('─'.repeat(width)));
    console.log();

    for (const c of active) {
      console.log(chalk.white(`  #${c.id}: ${c.text}`));
      console.log(chalk.gray(`    ${tone.getActiveCommitmentCommentary(c)}`));
      console.log();
    }
  }

  // Summary
  console.log(chalk.dim('═'.repeat(width)));
  console.log(chalk.gray(`  Total: ${stats.total} | Broken: ${stats.brokenCount} | Active: ${stats.activeCount} | Inferred: ${stats.inferredCount}`));
  if (stats.brokenCount > 0) {
    console.log(chalk.gray(`  Average survival: ${stats.averageTimeToBreak} days | Break rate: ${stats.breakRate}%`));
  }
  console.log();
  console.log(chalk.gray(`  ${tone.getReportClosing(stats)}`));
  console.log(chalk.dim('═'.repeat(width)));
  console.log();
}

/**
 * Print the inferred commitments section.
 * This is where the machine reveals what it learned on its own.
 */
function printInferredSection(inferredList, hasNew = false) {
  const width = 56;
  const header = tone.getInferredSectionHeader(inferredList.length);

  if (!header) return;

  console.log(chalk.dim('─'.repeat(width)));
  console.log(chalk.yellow.bold(`  ${header}`));
  if (hasNew) {
    console.log(chalk.yellow('  (New observations in this report)'));
  }
  console.log(chalk.dim('─'.repeat(width)));
  console.log();

  for (const c of inferredList) {
    console.log(chalk.yellow(`  [Inferred] ${c.text}`));
    console.log(chalk.gray(`    ${tone.getInferredCommitmentCommentary(c)}`));

    if (c.evidence && c.evidence.length > 0) {
      const ev = c.evidence[0];
      if (ev.description) {
        console.log(chalk.dim(`    Evidence: ${ev.description}`));
      }
    }

    console.log();
  }
}
