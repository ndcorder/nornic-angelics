/**
 * Record format generators.
 *
 * These produce the reference codes, filing numbers, and format patterns
 * used by actual public-record databases. The formats are real;
 * the specific values they encode are not.
 */

const { pick, randInt, chance } = require('../seeds');

/**
 * Generate a property parcel identification number.
 */
function generateParcelId(rng, style) {
  const styles = {
    fairfax: () => {
      const map = String(randInt(rng, 1, 200)).padStart(3, '0');
      const block = String(randInt(rng, 1, 8));
      const lot = String(randInt(rng, 1, 500)).padStart(4, '0');
      const unit = String(randInt(rng, 0, 99)).padStart(3, '0');
      return `${map}-${block}-${lot}-${unit}`;
    },
    cook: () => {
      const p1 = String(randInt(rng, 1, 80)).padStart(2, '0');
      const p2 = String(randInt(rng, 1, 40)).padStart(2, '0');
      const p3 = String(randInt(rng, 1, 30)).padStart(2, '0');
      const p4 = String(randInt(rng, 1, 999)).padStart(3, '0');
      const p5 = String(randInt(rng, 1, 999)).padStart(3, '0');
      return `${p1}-${p2}-${p3}-${p4}-${p5}`;
    },
    maricopa: () => {
      const p1 = String(randInt(rng, 1, 300)).padStart(4, '0');
      const p2 = String(randInt(rng, 1, 100)).padStart(4, '0');
      const p3 = String(randInt(rng, 1, 100)).padStart(4, '0');
      const p4 = String(randInt(rng, 0, 50)).padStart(2, '0');
      return `${p1} ${p2} ${p3} ${p4}`;
    },
    default: () => {
      const p1 = String(randInt(rng, 1, 999)).padStart(3, '0');
      const p2 = String(randInt(rng, 1, 99)).padStart(2, '0');
      const p3 = String(randInt(rng, 1, 9999)).padStart(4, '0');
      return `${p1}-${p2}-${p3}`;
    }
  };
  return (styles[style] || styles.default)();
}

/**
 * Generate a voter registration number.
 */
function generateVoterRegId(rng, stateCode) {
  const prefixes = {
    VA: () => `VA-${String(randInt(rng, 1, 200)).padStart(3, '0')}-${randInt(rng, 1000000, 9999999)}-${String(randInt(rng, 1, 99)).padStart(2, '0')}`,
    MD: () => `${String(randInt(rng, 1, 30)).padStart(2, '0')}-${randInt(rng, 100000, 999999)}-${randInt(rng, 10, 99)}`,
    IL: () => `IL${randInt(rng, 1000000, 9999999)}`,
    default: () => `${stateCode}-${randInt(rng, 10000000, 99999999)}`
  };
  return (prefixes[stateCode] || prefixes.default)();
}

/**
 * Generate a corporate filing / charter number.
 */
function generateCorpNumber(rng, stateCode) {
  const formats = {
    TX: () => `${String.fromCharCode(65 + randInt(rng, 0, 5))}${randInt(rng, 10000000, 99999999)}`,
    WA: () => `${String.fromCharCode(65 + randInt(rng, 0, 3))}${randInt(rng, 100000, 999999)}-${randInt(rng, 100, 999)}`,
    CA: () => `C${randInt(rng, 1000000, 9999999)}-${randInt(rng, 1000, 9999)}`,
    default: () => {
      const year = randInt(rng, 1995, 2022);
      const seq = String(randInt(rng, 100000, 999999));
      return `${year}${seq}`;
    }
  };
  return (formats[stateCode] || formats.default)();
}

/**
 * Generate a UCC filing number.
 */
function generateUCCFilingId(rng) {
  const year = randInt(rng, 2015, 2023);
  const seq = String(randInt(rng, 100000, 999999));
  const check = String(randInt(rng, 100, 999));
  return `${year}-${seq}-${check}`;
}

/**
 * Generate a court case number.
 */
function generateCaseNumber(rng) {
  const year = randInt(rng, 2010, 2022);
  const types = ["CV", "CF", "CT", "MM", "SC", "CH", "PR"];
  const caseType = pick(rng, types);
  const seq = String(randInt(rng, 10000, 99999));
  return `${year}-${caseType}-${seq}`;
}

/**
 * Generate a DMV-style record identifier.
 */
function generateDMVId(rng, stateCode) {
  if (stateCode === "WA") {
    const l1 = String.fromCharCode(65 + randInt(rng, 0, 25));
    const l2 = String.fromCharCode(65 + randInt(rng, 0, 25));
    const l3 = String.fromCharCode(65 + randInt(rng, 0, 25));
    return `${l1}${l2}${l3}${randInt(rng, 100, 999)}${randInt(rng, 100, 999)}`;
  }
  if (stateCode === "CA") {
    const letter = String.fromCharCode(65 + randInt(rng, 0, 25));
    return `${letter}${randInt(rng, 10000000, 99999999)}`;
  }
  const prefix = String.fromCharCode(65 + randInt(rng, 0, 25));
  return `${prefix}${randInt(rng, 100, 999)}-${randInt(rng, 10, 99)}-${randInt(rng, 1000, 9999)}`;
}

/**
 * Generate a phone number in NANP format.
 */
function generatePhone(rng) {
  const areaCodes = [
    "202", "213", "262", "301", "310", "312", "347", "404",
    "412", "415", "425", "480", "503", "510", "571",
    "602", "612", "617", "626", "646", "651", "703", "713",
    "714", "718", "724", "763", "781", "818", "832",
    "857", "909", "917", "929", "949", "952", "973"
  ];
  const area = pick(rng, areaCodes);
  const exchange = String(randInt(rng, 100, 999));
  const subscriber = String(randInt(rng, 1000, 9999));
  return `(${area}) ${exchange}-${subscriber}`;
}

/**
 * Generate an email address.
 */
function generateEmail(rng, firstName, lastName) {
  const separators = ["", ".", "_"];
  const sep = pick(rng, separators);
  const domains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
    "aol.com", "icloud.com", "protonmail.com", "live.com"
  ];
  const domain = pick(rng, domains);
  const useFirstInitial = chance(rng, 0.3);
  const includeNumbers = chance(rng, 0.4);

  let local;
  if (useFirstInitial) {
    local = firstName[0] + sep + lastName;
  } else {
    local = firstName + sep + lastName;
  }

  if (includeNumbers) {
    local += String(randInt(rng, 100, 999));
  }

  return `${local.toLowerCase()}@${domain}`;
}

/**
 * Generate a date string in MM/DD/YYYY format.
 */
function generateDate(rng, yearMin, yearMax) {
  const year = randInt(rng, yearMin, yearMax);
  const month = randInt(rng, 1, 12);
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const day = randInt(rng, 1, daysInMonth[month - 1]);
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

/**
 * Generate a timestamp in ISO-ish format.
 */
function generateTimestamp(rng, yearMin, yearMax) {
  const year = randInt(rng, yearMin, yearMax);
  const month = String(randInt(rng, 1, 12)).padStart(2, '0');
  const day = String(randInt(rng, 1, 28)).padStart(2, '0');
  const hour = String(randInt(rng, 0, 23)).padStart(2, '0');
  const minute = String(randInt(rng, 0, 59)).padStart(2, '0');
  const second = String(randInt(rng, 0, 59)).padStart(2, '0');
  const offsets = ["-05:00", "-06:00", "-07:00", "-08:00", "-04:00"];
  const offset = pick(rng, offsets);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
}

/**
 * Format a number as currency.
 */
function formatCurrency(amount) {
  return "$" + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Generate a plausible property assessed value.
 */
function generateAssessedValue(rng) {
  const base = randInt(rng, 80000, 780000);
  return Math.round(base / 100) * 100;
}

/**
 * Generate a filing timestamp (business hours).
 */
function generateFilingTimestamp(rng, yearMin, yearMax) {
  const year = randInt(rng, yearMin, yearMax);
  const month = String(randInt(rng, 1, 12)).padStart(2, '0');
  const day = String(randInt(rng, 1, 28)).padStart(2, '0');
  const hour = randInt(rng, 8, 16);
  const minute = String(randInt(rng, 0, 59)).padStart(2, '0');
  const second = String(randInt(rng, 0, 59)).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second} CT`;
}

/**
 * Generate a corporate entity name.
 */
function generateEntityName(rng, lastName) {
  const prefixes = [
    lastName, lastName + " Group", lastName + " Holdings",
    lastName + " Capital", lastName + " Properties",
    lastName + " & Associates", lastName + " Ventures",
    lastName + " Management", lastName + " Consulting",
    lastName + " Enterprises"
  ];
  const suffixes = [
    "LLC", "Inc.", "Corp.", "Ltd.", "LP", "LLLP", "GP",
    "Holdings LLC", "Capital Inc.", "Group Corp."
  ];
  return `${pick(rng, prefixes)} ${pick(rng, suffixes)}`;
}

/**
 * Generate an entity status.
 */
function generateEntityStatus(rng) {
  const statuses = ["Active", "Active", "Active", "Active", "Dissolved", "Revoked", "Inactive", "Withdrawn", "Expired"];
  return pick(rng, statuses);
}

/**
 * Generate a domain name.
 */
function generateDomain(rng, firstName, lastName) {
  const tlds = [".com", ".net", ".org", ".io", ".co"];
  const tld = pick(rng, tlds);
  const patterns = [
    `${lastName.toLowerCase()}${tld}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}${tld}`,
    `${lastName.toLowerCase()}consulting${tld}`,
    `${lastName.toLowerCase()}group${tld}`,
    `the${lastName.toLowerCase()}${tld}`,
    `${lastName.toLowerCase()}law${tld}`,
    `${lastName.toLowerCase()}properties${tld}`,
    `${lastName.toLowerCase()}holdings${tld}`,
    `${firstName[0].toLowerCase()}${lastName.toLowerCase()}${tld}`,
    `${lastName.toLowerCase()}-${randInt(rng, 100, 999)}${tld}`
  ];
  return pick(rng, patterns);
}

/**
 * Generate a domain status.
 */
function generateDomainStatus(rng) {
  return pick(rng, ["clientTransferProhibited", "ok", "active", "clientDeleteProhibited"]);
}

/**
 * Generate a jurisdiction code.
 */
function generateJurisdictionCode(rng) {
  return pick(rng, ["DE", "NV", "WY", "SD", "FL", "NY", "TX", "CA", "WA", "IL"]);
}

module.exports = {
  generateParcelId,
  generateVoterRegId,
  generateCorpNumber,
  generateUCCFilingId,
  generateCaseNumber,
  generateDMVId,
  generatePhone,
  generateEmail,
  generateDate,
  generateTimestamp,
  formatCurrency,
  generateAssessedValue,
  generateFilingTimestamp,
  generateEntityName,
  generateEntityStatus,
  generateDomain,
  generateDomainStatus,
  generateJurisdictionCode
};
