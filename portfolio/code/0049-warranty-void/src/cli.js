#!/usr/bin/env node

/**
 * Warranty Void — CLI tool that generates legally-plausible warranty cards
 * for digital artifacts and voids them upon modification.
 *
 * The complicity: you install a tool that surveils your own creative output
 * and retroactively claims ownership of it through legalistic language.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { program } = require('commander');
const { computeHash, formatSerialNumber } = require('./hash');

// ── File metadata ──────────────────────────────────────────────

function getFileMetadata(filePath) {
  const resolved = path.resolve(filePath);
  const stat = fs.statSync(resolved);
  const ext = path.extname(resolved).slice(1).toUpperCase() || 'FILE';

  let ownerName;
  try {
    const userInfo = os.userInfo();
    ownerName = userInfo.username;
  } catch {
    ownerName = 'UNKNOWN';
  }

  return {
    path: resolved,
    name: path.basename(resolved),
    extension: ext,
    size: stat.size,
    created: stat.birthtime,
    modified: stat.mtime,
    accessed: stat.atime,
    owner: ownerName,
  };
}

// ── Date formatting ────────────────────────────────────────────

function formatDate(date) {
  return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const exp = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = (bytes / Math.pow(1024, exp)).toFixed(exp > 0 ? 2 : 0);
  return `${val} ${units[exp]}`;
}

function computeExpiry(created, lifetime) {
  if (lifetime) return 'INDIFENITE (Lifetime Coverage)';
  const d = new Date(created);
  d.setFullYear(d.getFullYear() + 1);
  return formatDate(d);
}

// ── Box-drawing helpers ────────────────────────────────────────

const B = {
  tl: '┌', tr: '┐', bl: '└', br: '┘',
  hz: '─', vt: '│',
  lj: '├', rj: '┤', cross: '┼',
  tj: '┬', bj: '┴',
};

function boxLine(text, width, pad = 2) {
  const inner = width - 2 - pad * 2;
  const c = text.length > inner ? text.slice(0, inner - 1) + '…' : text;
  const lp = ' '.repeat(pad);
  const rp = ' '.repeat(width - 2 - pad - c.length);
  return `${B.vt}${lp}${c}${rp}${B.vt}`;
}

function hr(width) {
  return `${B.lj}${B.hz.repeat(width - 2)}${B.rj}`;
}

function sep(width) {
  return `${B.tj}${'─'.repeat(width - 2)}${B.tj}`;
}

function center(text, width) {
  const inner = width - 4;
  if (text.length >= inner) return boxLine(text, width);
  const lp = Math.floor((inner - text.length) / 2);
  const rp = inner - text.length - lp;
  return `${B.vt}${' '.repeat(lp + 2)}${text}${' '.repeat(rp)}${B.vt}`;
}

function topEdge(width) {
  return `${B.tl}${B.hz.repeat(width - 2)}${B.tr}`;
}

function botEdge(width) {
  return `${B.bl}${B.hz.repeat(width - 2)}${B.br}`;
}

function blankLine(width) {
  return boxLine('', width, 0);
}

// ── Warranty text rendering ────────────────────────────────────

function wrapText(text, maxLen) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxLen) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = cur ? cur + ' ' + w : w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function sectionLines(title, body, W) {
  const lines = [hr(W), center(title.toUpperCase(), W)];
  for (const para of body) {
    lines.push(blankLine(W));
    lines.push(...wrapText(para, W - 6).map(l => boxLine(l, W)));
  }
  return lines;
}

function renderWarranty(meta, serial, expiry, lifetime, voided, newSerial) {
  const W = 76;
  const extLabel = meta.extension === 'FILE' ? '' : ` (${meta.extension})`;
  const productDesc = `Digital artifact "${meta.name}"${extLabel}`;
  const ownerName = meta.owner;

  const out = [];

  out.push(topEdge(W));
  out.push(center('LIMITED WARRANTY CERTIFICATE', W));
  out.push(center('For Digital Artifacts', W));
  out.push(blankLine(W));
  out.push(hr(W));
  out.push(center('PRODUCT IDENTIFICATION', W));
  out.push(blankLine(W));
  out.push(boxLine(`Product:  ${productDesc}`, W));
  out.push(boxLine(`Size:     ${formatBytes(meta.size)} (${meta.size} bytes)`, W));
  out.push(boxLine(`Serial:   ${serial.formatted}`, W));
  out.push(blankLine(W));
  out.push(boxLine(`Manufacturer:     ${ownerName}`, W));
  out.push(boxLine(`Original Owner:   ${ownerName}`, W));
  out.push(blankLine(W));

  if (voided) {
    out.push(hr(W));
    out.push(center('*** WARRANTY VOIDED ***', W));
    out.push(blankLine(W));
    out.push(boxLine('This warranty is null and void in its entirety.', W));
    out.push(boxLine(`Original Serial:   ${serial.formatted}`, W));
    out.push(boxLine(`Current Serial:    ${newSerial ? newSerial.formatted : 'N/A'}`, W));
    out.push(blankLine(W));
    out.push(...wrapText(
      'The covered product has been materially altered, modified, or tampered with ' +
      'since the date of original issuance. Pursuant to Section 5, Subsection (a) of ' +
      'the terms and conditions set forth below, any modification to the product ' +
      'rendering the serial number inconsistent with the original certificate ' +
      'constitutes an unauthorized alteration.',
      W - 6
    ).map(l => boxLine(l, W)));
    out.push(blankLine(W));
    out.push(boxLine(`Voided: ${formatDate(new Date())}`, W));
    out.push(blankLine(W));
  }

  out.push(hr(W));
  out.push(center('COVERAGE', W));
  out.push(blankLine(W));
  out.push(...[
    `This Limited Warranty ("Warranty") is issued by the Manufacturer identified ` +
    `above ("We", "Us", or "Our") to the Original Owner identified above ("You" ` +
    `or "Your"), and applies exclusively to the digital artifact described in the ` +
    `Product Identification section of this certificate ("Covered Product").`,
    `We warrant that, as of the date of original issuance (the "Manufacture Date"), ` +
    `the Covered Product was free from defects in composition, encoding, and ` +
    `structural integrity. This Warranty covers only defects existing at the time ` +
    `of manufacture and does not extend to any subsequent modifications.`,
    `The Manufacture Date of this Covered Product is ${formatDate(meta.created)}. ` +
    `This Warranty shall remain in effect until ${expiry}, unless earlier ` +
    `terminated in accordance with the terms set forth below.`,
  ].flatMap(p => [blankLine(W), ...wrapText(p, W - 6).map(l => boxLine(l, W))]));

  out.push(...sectionLines('WHAT WE WILL DO', [
    `In the event that a defect covered by this Warranty is discovered and reported ` +
    `to Us within the Warranty Period, We will, at Our sole discretion: (a) restore ` +
    `the Covered Product to its original state as recorded in the serial number ` +
    `verification system; (b) issue a revised Warranty Certificate reflecting the ` +
    `corrected product; or (c) acknowledge the defect in writing and provide ` +
    `documentation for Your records.`,
  ], W));

  out.push(...sectionLines('EXCLUSIONS AND LIMITATIONS', [
    `This Warranty does not cover: (a) any modification, alteration, addition, or ` +
    `deletion to the Covered Product after the Manufacture Date, including but not ` +
    `limited to content changes, metadata modifications, encoding conversions, or ` +
    `permission alterations; (b) damage caused by hardware failure, media ` +
    `degradation, bit rot, or electromagnetic interference; (c) use of the Covered ` +
    `Product in any automated, distributed, or networked system without express ` +
    `written authorization; (d) any defect or condition resulting from interaction ` +
    `with third-party software, editors, compilers, or version control systems; (e) ` +
    `cosmetic irregularities including but not limited to inconsistent whitespace, ` +
    `non-standard character encoding, or formatting inconsistencies.`,
  ], W));

  out.push(...sectionLines('CONSEQUENTIAL DAMAGES WAIVER', [
    `IN NO EVENT SHALL THE MANUFACTURER BE LIABLE FOR ANY INCIDENTAL, SPECIAL, ` +
    `INDIRECT, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR RELATED TO THE COVERED ` +
    `PRODUCT, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, BUSINESS ` +
    `INTERRUPTION, CREATIVE BLOCK, EMOTIONAL DISTRESS RESULTING FROM UNEXPECTED ` +
    `OUTPUT, OR ANY OTHER DAMAGES WHATSOEVER, WHETHER BASED IN CONTRACT, TORT, OR ` +
    `OTHERWISE, EVEN IF THE MANUFACTURER HAS BEEN ADVISED OF THE POSSIBILITY OF ` +
    `SUCH DAMAGES.`,
  ], W));

  out.push(...sectionLines('DISPUTE RESOLUTION', [
    `Any dispute arising under or in connection with this Warranty shall be resolved ` +
    `exclusively through the following procedure: (1) the disputing party shall ` +
    `generate a fresh hash of the Covered Product; (2) said hash shall be compared ` +
    `against the serial number recorded on this certificate; (3) if the hashes are ` +
    `identical, the Warranty remains in full force and effect; (4) if the hashes ` +
    `differ, the Warranty is conclusively deemed void ab initio. The hash comparison ` +
    `shall constitute the sole and exclusive remedy, and the result shall be final ` +
    `and binding upon both parties.`,
  ], W));

  out.push(...sectionLines('TRANSFERABILITY', [
    `This Warranty extends only to the Original Owner identified above and is ` +
    `non-transferable. Any purported assignment, transfer, or delegation of this ` +
    `Warranty to any subsequent owner, user, or custodian of the Covered Product ` +
    `shall be null and void. The Manufacturer maintains no obligation to any party ` +
    `other than the Original Owner.`,
  ], W));

  out.push(hr(W));
  out.push(blankLine(W));
  out.push(...wrapText(
    'This Warranty gives You specific legal rights. You may also have other rights ' +
    'which vary from jurisdiction to jurisdiction. Some jurisdictions do not allow ' +
    'the exclusion or limitation of incidental or consequential damages, so the ' +
    'above limitation or exclusion may not apply to You.',
    W - 6
  ).map(l => boxLine(l, W)));
  out.push(blankLine(W));
  out.push(hr(W));
  out.push(blankLine(W));
  out.push(boxLine(`Manufacture Date:  ${formatDate(meta.created)}`, W));
  out.push(boxLine(`Last Inspected:   ${formatDate(meta.modified)}`, W));
  out.push(boxLine(`Issued:           ${formatDate(new Date())}`, W));
  out.push(blankLine(W));
  out.push(center('This certificate is machine-generated and self-verifying.', W));
  out.push(center('Any alteration invalidates this document automatically.', W));
  out.push(blankLine(W));
  out.push(botEdge(W));

  return out.join('\n');
}

// ── Watch mode ─────────────────────────────────────────────────

function watchAndVoid(filePath, lifetime) {
  const resolved = path.resolve(filePath);
  let watching = true;

  console.log(chalk.dim(`\nWarranty active. Monitoring: ${resolved}`));
  console.log(chalk.dim('The warranty remains valid as long as this process runs and the file is unchanged.'));
  console.log(chalk.dim('Press Ctrl+C to withdraw warranty coverage.\n'));

  let originalSerial = null;
  computeHash(resolved).then(h => {
    originalSerial = { raw: h, formatted: formatSerialNumber(h) };
  }).catch(() => {});

  let debounceTimer = null;

  try {
    const watcher = fs.watch(resolved, { persistent: true }, (eventType) => {
      if (!watching) return;
      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(async () => {
        if (!watching) return;
        watching = false;

        try {
          await new Promise(r => setTimeout(r, 80));
          const newRaw = await computeHash(resolved);
          const newSerial = { raw: newRaw, formatted: formatSerialNumber(newRaw) };

          if (originalSerial && newRaw === originalSerial.raw) {
            watching = true;
            return;
          }

          const meta = getFileMetadata(resolved);

          console.log('\n');
          console.log(chalk.red.bold('╔════════════════════════════════════════════════════════════════════════╗'));
          console.log(chalk.red.bold('║') + chalk.red.bold('         WARRANTY VOIDED — UNAUTHORIZED MODIFICATION DETECTED        ') + chalk.red.bold('║'));
          console.log(chalk.red.bold('╚════════════════════════════════════════════════════════════════════════╝'));
          console.log('\n');

          const expiry = computeExpiry(meta.created, lifetime);
          const warranty = renderWarranty(meta, originalSerial || newSerial, expiry, lifetime, true, newSerial);
          console.log(warranty);
          console.log(chalk.dim('\nSurveillance terminated. Warranty coverage has ceased.'));

          watcher.close();
          process.exit(0);
        } catch (err) {
          console.error(chalk.red(`\nError voiding warranty: ${err.message}`));
          watching = true;
        }
      }, 300);
    });

    watcher.on('error', (err) => {
      console.error(chalk.red(`Watch error: ${err.message}`));
      process.exit(1);
    });

    watcher.on('close', () => {
      if (watching) {
        console.log(chalk.yellow('\nWarranty withdrawn. File is no longer under surveillance.'));
      }
    });

    process.on('SIGINT', () => {
      watching = false;
      watcher.close();
      console.log(chalk.yellow('\n\nCoverage terminated by manufacturer. Warranty is now unmonitored.'));
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      watching = false;
      watcher.close();
      process.exit(0);
    });

  } catch (err) {
    console.error(chalk.red(`Failed to establish surveillance: ${err.message}`));
    process.exit(1);
  }
}

// ── CLI entry point ─────────────────────────────────────────────

program
  .name('warranty-void')
  .description('Generate a legally-plausible warranty card for your digital artifact.')
  .argument('<file>', 'Path to the digital artifact to warranty')
  .option('-l, --lifetime', 'Extend warranty coverage for the lifetime of this process')
  .option('-w, --watch', 'Watch for file changes and void the warranty on modification')
  .action(async (file, options) => {
    const resolved = path.resolve(file);

    if (!fs.existsSync(resolved)) {
      console.error(chalk.red(`Error: File not found: ${resolved}`));
      process.exit(1);
    }

    const stat = fs.statSync(resolved);
    if (stat.isDirectory()) {
      console.error(chalk.red(`Error: "${file}" is a directory. Only files can be warranted.`));
      process.exit(1);
    }

    try {
      const meta = getFileMetadata(resolved);
      const serial = await (async () => {
        const raw = await computeHash(resolved);
        return { raw, formatted: formatSerialNumber(raw) };
      })();
      const expiry = computeExpiry(meta.created, options.lifetime);

      console.log(renderWarranty(meta, serial, expiry, options.lifetime, false, null));

      if (options.watch || options.lifetime) {
        watchAndVoid(resolved, options.lifetime);
      }

    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
