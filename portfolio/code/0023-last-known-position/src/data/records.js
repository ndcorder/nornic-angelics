/**
 * Record format generators.
 *
 * These produce the reference codes, filing numbers, and format patterns
 * used by actual public-record databases. The formats are real;
 * the specific values they encode are not.
 *
 * A property parcel ID in Fairfax County looks like "059-1-0020-037."
 * We generate strings that follow this exact pattern, with the same
 * character lengths and separator positions. Verifiable format, hollow content.
 */

/**
 * Generate a property parcel identification number.
 * Format varies by county — this produces the common format:
 *   {map}-{block}-{lot}-{unit} where each segment is zero-padded.
 *
 * Example: "0594 0030 0001 00" (Maricopa County style)
 * Example: "059-1-0020-037" (Fairfax County style)
 * Example: "16-07-22-302-019" (Cook County style)
 */
function generateParcelId(rng, style) {
  const styles = {
    fairfax: () => {
      const map = String(Math.floor(rng() * 200) + 1).padStart(3, '0');
      const block = String(Math.floor(rng() * 8) + 1);
      const lot = String(Math.floor(rng() * 500) + 1).padStart(4, '0');
      const unit = String(Math.floor(rng() * 100)).padStart(3, '0');
      return `${map}-${block}-${lot}-${unit}`;
    },
    cook: () => {
      const p1 = String(Math.floor(rng() * 80) + 1).padStart(2, '0');
      const p2 = String(Math.floor(rng() * 40) + 1).padStart(2, '0');
      const p3 = String(Math.floor(rng() * 30) + 1).padStart(2, '0');
      const p4 = String(Math.floor(rng() * 999) + 1).padStart(3, '0');
      const p5 = String(Math.floor(rng() * 999) + 1).padStart(3, '0');
      return `${p1}-${p2}-${p3}-${p4}-${p5}`;
    },
    maricopa: () => {
      const p1 = String(Math.floor(rng() * 300) + 1).padStart(4, '0');
      const p2 = String(Math.floor(rng() * 100) + 1).padStart(4, '0');
      const p3 = String(Math.floor(rng() * 100) + 1).padStart(4, '0');
      const p4 = String(Math.floor(rng() * 50)).padStart(2, '0');
      return `${p1} ${p2} ${p3} ${p4}`;
    },
    default: () => {
      const p1 = String(Math.floor(rng() * 999) + 1).padStart(3, '0');
      const p2 = String(Math.floor(rng() * 99) + 1).padStart(2, '0');
      const p3 = String(Math.floor(rng() * 9999) + 1).padStart(4, '0');
      return `${p1}-${p2}-${p3}`;
    }
  };

  const generator = styles[style] || styles.default;
  return generator();
}

/**
 * Generate a voter registration number.
 * Formats vary by state. Common patterns:
 *   - Sequential with county code prefix
 *   - Alphanumeric with check digits
 *
 * Example: "VA-084-6293751-01" (Virginia style)
 * Example: "L08-302-44-5839" (Florida style)
 */
function generateVoterRegId(rng, stateCode) {
  const prefixes = {
    VA: () => `VA-${String(Math.floor(rng() * 200) + 1).padStart(3, '0')}-${String(Math.floor(rng() * 9000000) + 1000000)}-${String(Math.floor(rng() * 99) + 1).padStart(2, '0')}`,
    MD: () => `${String(Math.floor(rng() * 30) + 1).padStart(2, '0')}-${String(Math.floor(rng() * 900000) + 100000)}-${String(Math.floor(rng() * 90) + 10)}`,
    IL: () => `IL${String(Math.floor(rng() * 9000000) + 1000000)}`,
    default: () => `${stateCode}-${String(Math.floor(rng() * 90000000) + 10000000)}`
  };
  return (prefixes[stateCode] || prefixes.default)();
}

/**
 * Generate a corporate filing / charter number.
 * State corporation divisions assign these when entities form.
 *
 * Example: "C12345-678" (Washington style)
 * Example: "20201234567" (Delaware style)
 * Example: "D09876543" (Texas style)
 */
function generateCorpNumber(rng, stateCode) {
  const formats = {
    TX: () => `${String.fromCharCode(65 + Math.floor(rng() * 6))}${String(Math.floor(rng() * 90000000) + 10000000)}`,
    WA: () => `${String.fromCharCode(65 + Math.floor(rng() * 4))}${String(Math.floor(rng() * 900000) + 100000)}-${String(Math.floor(rng() * 900) + 100)}`,
    CA: () => `C${String(Math.floor(rng() * 9000000) + 1000000)}-${String(Math.floor(rng() * 9000) + 1000)}`,
    default: () => {
      const year = 1995 + Math.floor(rng() * 28);
      const seq = String(Math.floor(rng() * 900000) + 100000);
      return `${year}${seq}`;
    }
  };
  return (formats[stateCode] || formats.default)();
}

/**
 * Generate a UCC filing number.
 * Uniform Commercial Code filings have specific formatting.
 * Example: "2023-012345-678"
 */
function generateUCCFilingId(rng) {
  const year = 2015 + Math.floor(rng() * 8);
  const seq = String(Math.floor(rng() * 900000) + 100000);
  const check = String(Math.floor(rng() * 900) + 100);
  return `${year}-${seq}-${check}`;
}

/**
 * Generate a court case number.
 * Format: {year}{case type}{sequence}
 * Example: "2021-CV-002937" (civil)
 * Example: "2019-F-004821" (felony)
 */
function generateCaseNumber(rng) {
  const year = 2010 + Math.floor(rng() * 13);
  const types = ["CV", "CF", "CT", "MM", "SC", "CH", "PR"];
  const caseType = types[Math.floor(rng() * types.length)];
  const seq = String(Math.floor(rng() * 90000) + 10000);
  return `${year}-${caseType}-${seq}`;
}

/**
 * Generate a DOB/DMV-style record identifier.
 * Not a real license number — just the format pattern.
 * Example: "S420-893-72-401"
 */
function generateDMVId(rng, stateCode) {
  if (stateCode === "WA") {
    const letters = String.fromCharCode(65 + Math.floor(rng() * 26)) +
                   String.fromCharCode(65 + Math.floor(rng() * 26)) +
                   String.fromCharCode(65 + Math.floor(rng() * 26));
    const num = String(Math.floor(rng() * 900) + 100);
    const seq = String(Math.floor(rng() * 900) + 100);
    return `${letters}${num}${seq}`;
  }
  if (stateCode === "CA") {
    const letter = String.fromCharCode(65 + Math.floor(rng() * 26));
    const num = String(Math.floor(rng() * 90000000) + 10000000);
    return `${letter}${num}`;
  }
  const prefix = String.fromCharCode(65 + Math.floor(rng() * 26));
  const seg1 = String(Math.floor(rng() * 900) + 100);
  const seg2 = String(Math.floor(rng() * 90) + 10);
  const seg3 = String(Math.floor(rng() * 9000) + 1000);
  return `${prefix}${seg1}-${seg2}-${seg3}`;
}

/**
 * Generate a phone number in NANP format.
 * Uses valid area code ranges but fabricated subscriber numbers.
 * Example: "(703) 555-0184"
 */
function generatePhone(rng) {
  const areaCodes = [
    "202", "213", "262", "301", "310", "312", "347", "404",
    "412", "415", "425", "480", "503", "510", "551", "571",
    "602", "612", "617", "626", "646", "651", "703", "713",
    "714", "718", "724", "732", "763", "781", "818", "832",
    "848", "857", "909", "917", "929", "949", "952", "973",
    "979"
  ];
  const area = areaCodes[Math.floor(rng() * areaCodes.length)];
  const exchange = String(Math.floor(rng() * 900) + 100);
  const subscriber = String(Math.floor(rng() * 9000) + 1000);
  return `(${area}) ${exchange}-${subscriber}`;
}

/**
 * Generate an email address that looks plausible.
 * Common email providers, realistic username patterns.
 */
function generateEmail(rng, firstName, lastName) {
  const separators = ["", ".", "_"];
  const sep = separators[Math.floor(rng() * separators.length)];
  const domains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
    "aol.com", "icloud.com", "protonmail.com", "live.com"
  ];
  const domain = domains[Math.floor(rng() * domains.length)];

  const useFirstInitial = rng() < 0.3;
  const includeNumbers = rng() < 0.4;
  const useNickname = rng() < 0.15;

  let local;
  if (useNickname) {
    const nicknames = [firstName.substring(0, Math.ceil(firstName.length / 2)), firstName + "9"];
    local = nicknames[Math.floor(rng() * nicknames.length)];
  } else if (useFirstInitial) {
    local = firstName[0] + sep + lastName;
  } else {
    local = firstName + sep + lastName;
  }

  if (includeNumbers) {
    local += String(Math.floor(rng() * 900) + 100);
  }

  local = local.toLowerCase();
  return `${local}@${domain}`;
}

/**
 * Generate a date string in MM/DD/YYYY format.
 */
function generateDate(rng, yearMin, yearMax) {
  const year = yearMin + Math.floor(rng() * (yearMax - yearMin + 1));
  const month = Math.floor(rng() * 12) + 1;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = daysInMonth[month - 1];
  const day = Math.floor(rng() * maxDay) + 1;
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

/**
 * Generate a timestamp in ISO-8601-ish format (the kind databases output).
 * Example: "2023-07-14T09:32:17-05:00"
 */
function generateTimestamp(rng, yearMin, yearMax) {
  const date = generateDate(rng, yearMin, yearMax);
  const [month, day, year] = date.split('/');
  const hour = String(Math.floor(rng() * 24)).padStart(2, '0');
  const minute = String(Math.floor(rng() * 60)).padStart(2, '0');
  const second = String(Math.floor(rng() * 60)).padStart(2, '0');
  const offsets = ["-05:00", "-06:00", "-07:00", "-08:00", "-04:00"];
  const offset = offsets[Math.floor(rng() * offsets.length)];
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
}

/**
 * Generate a currency value string.
 * Example: "$342,500.00"
 */
function formatCurrency(amount) {
  return "$" + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Generate a plausible property assessed value.
 */
function generateAssessedValue(rng) {
  const base = 80000 + Math.floor(rng() * 700000);
  return Math.round(base / 100) * 100;
}

/**
 * Generate a plausible filing timestamp (for corporate, UCC filings).
 * These tend to be during business hours on weekdays.
 */
function generateFilingTimestamp(rng, yearMin, yearMax) {
  const year = yearMin + Math.floor(rng() * (yearMax - yearMin + 1));
  const month = Math.floor(rng() * 12) + 1;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const day = Math.floor(rng() * daysInMonth[month - 1]) + 1;
  const hour = 8 + Math.floor(rng() * 9);
  const minute = String(Math.floor(rng() * 60)).padStart(2, '0');
  const second = String(Math.floor(rng() * 60)).padStart(2, '0');
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${hour}:${minute}:${second} CT`;
}

/**
 * Generate a corporate entity name.
 * Uses real entity type suffixes and plausible business name patterns.
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
  const prefix = prefixes[Math.floor(rng() * prefixes.length)];
  const suffix = suffixes[Math.floor(rng() * suffixes.length)];
  return `${prefix} ${suffix}`;
}

/**
 * Generate an entity status.
 */
function generateEntityStatus(rng) {
  const statuses = ["Active", "Active", "Active", "Active", "Dissolved", "Revoked", "Inactive", "Withdrawn", "Expired"];
  return statuses[Math.floor(rng() * statuses.length)];
}

/**
 * Generate a domain name that looks real.
 */
function generateDomain(rng, firstName, lastName) {
  const tlds = [".com", ".net", ".org", ".io", ".co"];
  const tld = tlds[Math.floor(rng() * tlds.length)];
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
    `${lastName.toLowerCase()}-${Math.floor(rng() * 900) + 100}${tld}`
  ];
  return patterns[Math.floor(rng() * patterns.length)];
}

/**
 * Generate a domain registration status.
 */
function generateDomainStatus(rng) {
  const statuses = ["clientTransferProhibited", "ok", "active", "clientDeleteProhibited"];
  return statuses[Math.floor(rng() * statuses.length)];
}

/**
 * Generate a jurisdiction code (state abbreviation).
 */
function generateJurisdictionCode(rng) {
  const codes = ["DE", "NV", "WY", "SD", "FL", "NY", "TX", "CA", "WA", "IL"];
  return codes[Math.floor(rng() * codes.length)];
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
