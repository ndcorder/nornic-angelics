/**
 * SHA-256 hashing utility for digital artifact serial numbers.
 * Produces unforgeable identifiers from file contents.
 */

const crypto = require('crypto');
const fs = require('fs');

/**
 * Compute SHA-256 hash of a file's contents.
 * @param {string} filePath - Absolute or relative path to the file.
 * @returns {Promise<string>} Hex digest of the file hash.
 */
async function computeHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * Format a hex hash as a serial number, grouped in blocks of 8
 * characters separated by hyphens, all uppercase.
 * Example: A1B2C3D4-E5F6A7B8-9C0D1E2F-3A4B5C6D
 * @param {string} hexDigest - Raw hex hash string (64 chars for SHA-256).
 * @returns {string} Formatted serial number string.
 */
function formatSerialNumber(hexDigest) {
  const upper = hexDigest.toUpperCase();
  const groups = [];
  for (let i = 0; i < upper.length; i += 8) {
    groups.push(upper.slice(i, i + 8));
  }
  return groups.join('-');
}

/**
 * Compute and format a file's hash as a serial number.
 * @param {string} filePath - Path to the file.
 * @returns {Promise<{raw: string, formatted: string}>}
 */
async function computeSerialNumber(filePath) {
  const raw = await computeHash(filePath);
  return { raw, formatted: formatSerialNumber(raw) };
}

module.exports = { computeHash, formatSerialNumber, computeSerialNumber };
