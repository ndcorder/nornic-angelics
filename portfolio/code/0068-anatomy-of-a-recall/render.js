const chalk = require('chalk');

/**
 * Terminal Rendering Engine
 * Handles document display, typewriter pacing, classification markings,
 * and atmospheric transitions between documents in the dossier sequence.
 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Renders a document to the terminal with full formatting.
 */
async function renderDocument(doc, index, total) {
  console.log('');
  console.log(
    chalk.dim('────────────────────────────────────────────────────────')
  );
  console.log(
    chalk.dim(`RETRIEVING DOCUMENT ${index + 1} OF ${total}...`)
  );
  await sleep(800 + Math.random() * 600);

  // Classification header
  if (doc.classification) {
    const urgency = getUrgency(doc.classification);
    await sleep(300);
    console.log('');
    if (urgency === 'classified') {
      console.log(chalk.bgRed.white.bold('  ▌' + '█'.repeat(54) + '▐  '));
      console.log(chalk.bgRed.white.bold(`  ▌  ${doc.classification.padEnd(52)}▐  `));
      console.log(chalk.bgRed.white.bold('  ▌' + '█'.repeat(54) + '▐  '));
    } else if (urgency === 'restricted') {
      console.log(chalk.bgYellow.black.bold(`  ${doc.classification}  `));
    } else {
      console.log(chalk.yellow.bold(`  ${doc.classification}  `));
    }
    await sleep(400);
  }

  // Document title
  console.log('');
  console.log(chalk.white.bold(`  ${doc.title}`));
  console.log(chalk.dim('─'.repeat(60)));
  await sleep(500);

  // Document body with typewriter effect
  const lines = doc.body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    await renderLine(lines[i], index);
    // Variable pause between lines — tension escalates across documents
    const linePause = index < 2 ? 30 : 50;
    if (lines[i].trim() === '') {
      await sleep(linePause);
    } else if (
      lines[i].includes(' NOT ') ||
      lines[i].includes('CANNOT') ||
      lines[i].includes('SHOULD NOT') ||
      lines[i].includes('should not') ||
      lines[i].includes('no internal battery')
    ) {
      await sleep(linePause * 4);
    } else {
      await sleep(linePause);
    }
  }

  // Document footer
  console.log('');
  console.log(chalk.dim('─'.repeat(60)));
  await sleep(200);
  console.log(chalk.dim(`  ${doc.footer}`));
  console.log(
    chalk.dim('────────────────────────────────────────────────────────')
  );

  // Pause between documents — escalates with tension
  const interDocPause = 1500 + index * 800;
  await sleep(interDocPause);
}

/**
 * Renders a single line with context-appropriate formatting.
 */
async function renderLine(line, docIndex) {
  // Formatted field entries (indented with colon)
  if (line.startsWith('    ') && line.includes(':')) {
    console.log(chalk.cyan(line));
    return;
  }

  // Memo header fields
  if (
    line.startsWith('FROM:') ||
    line.startsWith('TO:') ||
    line.startsWith('CC:') ||
    line.startsWith('DATE:') ||
    line.startsWith('RE:')
  ) {
    console.log(chalk.gray(line));
    return;
  }

  // Separator lines
  if (line.startsWith('──') || line.startsWith('━━')) {
    console.log(chalk.dim(line));
    return;
  }

  // Inspector signatures and addenda
  if (
    docIndex >= 2 &&
    (line.startsWith('—') || line.startsWith('ADDENDUM'))
  ) {
    console.log(chalk.gray.italic(line));
    return;
  }

  // Horror beats in later documents — slow and weighted
  if (
    docIndex >= 3 &&
    (line.includes('should not') ||
      line.includes('cannot') ||
      line.includes('no internal battery') ||
      line.includes('without any power') ||
      line.includes('not going to offer'))
  ) {
    await sleep(200);
    console.log(chalk.white(line));
    await sleep(200);
    return;
  }

  // Quoted incident descriptions in the memo
  if (docIndex >= 4 && line.includes('"')) {
    console.log(chalk.gray(line));
    return;
  }

  // Final system notes — cold, clinical
  if (
    docIndex >= 4 &&
    (line.includes('Integration status') ||
      line.includes('Profile confidence') ||
      line.includes('Keystroke Dynamics'))
  ) {
    console.log(chalk.red(line));
    return;
  }

  // Classification/destroy directives
  if (
    line.includes('DESTROY') ||
    line.includes('DO NOT DISTRIBUTE') ||
    line.includes('EYES ONLY')
  ) {
    console.log(chalk.red.bold(line));
    return;
  }

  // Default
  console.log(chalk.white(line));
}

/**
 * Determines display urgency from classification string.
 */
function getUrgency(classification) {
  const upper = classification.toUpperCase();
  if (upper.includes('CLASSIFIED')) return 'classified';
  if (upper.includes('RESTRICTED')) return 'restricted';
  return 'standard';
}

/**
 * Renders the initial system boot header.
 */
async function renderBootSequence() {
  console.log('');
  await sleep(300);

  const bootLines = [
    'ÅRDOM TECHNOLOGIES AB — RECALL MANAGEMENT SYSTEM v4.7.2',
    'Secure Terminal Connection Established',
    `Session initiated: ${new Date().toISOString()}`,
    '─'.repeat(60),
  ];

  for (const line of bootLines) {
    console.log(chalk.green(line));
    await sleep(400);
  }

  console.log('');
  await sleep(600);
  console.log(chalk.dim('Recall report template loaded.'));
  await sleep(400);
  console.log(
    chalk.dim('All submissions are logged and cannot be deleted.')
  );
  await sleep(600);
  console.log('');
}

/**
 * Renders the post-submission processing transition.
 */
async function renderProcessing() {
  console.log('');
  console.log(
    chalk.dim('────────────────────────────────────────────────────────')
  );
  console.log('');
  console.log(chalk.green('Recall report submitted successfully.'));
  await sleep(600);
  console.log(chalk.dim('Generating case file documentation...'));
  await sleep(1000);
  console.log(
    chalk.dim('Querying Central Incident Registry for related records...')
  );
  await sleep(1200);
  console.log(chalk.dim('5 documents retrieved. Rendering dossier.'));
  await sleep(800);
}

/**
 * Renders the final termination sequence.
 */
async function renderTermination() {
  console.log('');
  await sleep(500);
  console.log(
    chalk.dim('────────────────────────────────────────────────────────')
  );
  await sleep(300);
  console.log(chalk.green('Dossier rendering complete.'));
  await sleep(600);
  console.log(chalk.dim('Session terminating...'));
  await sleep(400);

  // The cold close
  console.log('');
  console.log(
    chalk.dim(
      'Your respiratory profile has been updated. Thank you for using ÅRDOM.'
    )
  );
  await sleep(300);
  console.log('');
}

module.exports = {
  renderDocument,
  renderBootSequence,
  renderProcessing,
  renderTermination,
  sleep,
};
