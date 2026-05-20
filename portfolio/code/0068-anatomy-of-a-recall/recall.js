#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { setSessionStart, generateAllDocuments } = require('./documents');
const {
  renderBootSequence,
  renderProcessing,
  renderDocument,
  renderTermination,
} = require('./render');

/**
 * ÅRDOM-7 Smart Humidifier Recall Report CLI
 *
 * Entry point. Guides the user through filing a recall report,
 * then generates and renders the escalating dossier of corporate
 * correspondence that uses their own words against them.
 */

async function main() {
  // Boot sequence
  await renderBootSequence();

  // Lock session timestamp for document consistency
  setSessionStart(new Date());

  // Collect recall report data via interactive prompts
  const reportData = await collectReport();

  // Transition: processing the submission
  await renderProcessing();

  // Generate all documents using the user's report data
  const documents = generateAllDocuments(reportData);

  // Render each document sequentially with escalating tension
  for (let i = 0; i < documents.length; i++) {
    await renderDocument(documents[i], i, documents.length);
  }

  // Final termination
  await renderTermination();
}

/**
 * Collects recall report data through interactive prompts.
 * Questions are designed to feel bureaucratic and routine.
 */
async function collectReport() {
  console.log(
    chalk.white.bold('ÅRDOM-7 SMART HUMIDIFIER — VOLUNTARY RECALL REPORT')
  );
  console.log(chalk.dim('Please complete all fields. Be specific.'));
  console.log('');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Full name of complainant:',
      validate: (input) => {
        if (!input.trim()) return 'This field is required.';
        if (input.trim().length < 2)
          return 'Please provide your full name.';
        return true;
      },
    },
    {
      type: 'input',
      name: 'address',
      message: 'Address of unit installation:',
      validate: (input) => {
        if (!input.trim()) return 'This field is required.';
        return true;
      },
    },
    {
      type: 'input',
      name: 'serialNumber',
      message: 'Unit serial number (located on base of unit):',
      validate: (input) => {
        const cleaned = input.trim();
        if (!cleaned) return 'Serial number is required for recall processing.';
        if (cleaned.length < 6)
          return 'Serial number must be at least 6 characters.';
        return true;
      },
    },
    {
      type: 'editor',
      name: 'incidentDescription',
      message:
        'Describe the incident in detail. Include dates, times, and specific behaviors observed:',
      validate: (input) => {
        if (!input.trim()) return 'An incident description is required.';
        if (input.trim().split(/\s+/).length < 10)
          return 'Please provide a more detailed description (minimum 10 words).';
        return true;
      },
    },
  ]);

  // Clean and normalize inputs
  return {
    name: answers.name.trim(),
    address: answers.address.trim(),
    serialNumber: answers.serialNumber.trim(),
    incidentDescription: answers.incidentDescription.trim(),
  };
}

/**
 * Handle unhandled promise rejections gracefully.
 */
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('\nSystem error. Session terminated.'));
  process.exit(1);
});

// Launch
main().catch(() => {
  console.error(chalk.red('\nConnection lost. Session terminated.'));
  process.exit(1);
});
