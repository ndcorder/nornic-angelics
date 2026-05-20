/**
 * The hallucination engine.
 *
 * Each dossier contains at least one detail that is technically possible
 * to verify but functionally unverifiable — a property transaction in a
 * real county on a real date, at an address that doesn't exist.
 */

const { pick, randInt, chance } = require('./seeds');
const { COUNTIES, STATE_NAMES, generateAddress, getRandomZip } = require('./generators/locations');
const records = require('./generators/records');

/**
 * Generate a property transaction record — the primary hallucination.
 */
function generatePropertyTransaction(rng, seed) {
  const county = pick(rng, COUNTIES);
  const stateCode = county.state;
  const stateName = STATE_NAMES[stateCode];
  const zip = getRandomZip(county, rng);
  const addr = generateAddress(rng);

  const parcelStyles = {
    'Fairfax': 'fairfax',
    'Cook': 'cook',
    'Maricopa': 'maricopa'
  };
  const parcelStyle = parcelStyles[county.name] || 'default';
  const parcelId = records.generateParcelId(rng, parcelStyle);

  const currentYear = new Date().getFullYear();
  const txYear = currentYear - randInt(rng, 2, 8);
  const recordedDate = records.generateDate(rng, txYear, txYear);

  const assessedValue = records.generateAssessedValue(rng);
  const transferMultiplier = 0.85 + rng() * 0.4;
  const transferAmount = Math.round(assessedValue * transferMultiplier / 100) * 100;

  const docStampRate = stateCode === 'FL' ? 0.70 : (stateCode === 'PA' ? 1.0 : 0.55);
  const docStampTax = Math.round((transferAmount / 500) * docStampRate * 100) / 100;

  const grantorType = pick(rng, ['Individual', 'Joint Tenants', 'Trust']);
  const book = String(randInt(rng, 1000, 9999));
  const page = String(randInt(rng, 1, 999)).padStart(4, '0');
  const instrumentNo = `${txYear}${String(randInt(rng, 10000, 99999))}`;

  const displayFirst = seed.firstName.charAt(0).toUpperCase() + seed.firstName.slice(1);
  const displayLast = seed.lastName.charAt(0).toUpperCase() + seed.lastName.slice(1);

  const subdivisionNames = [
    `${displayLast} Heights`, `${displayLast} Acres`,
    `${displayLast} Estates`, 'Cedar Hills', 'Oak Grove',
    'Maplewood', 'Fairview', 'Lakefront', 'Summit View',
    'Green Valley', 'Riverside', 'Pleasant Ridge'
  ];
  const subdivision = pick(rng, subdivisionNames);
  const lot = String(randInt(rng, 1, 200));
  const block = String(randInt(rng, 1, 30));

  return {
    type: 'property_transaction',
    county: county.name,
    state: stateCode,
    stateName: stateName,
    address: addr.street,
    city: addr.city,
    zip: zip,
    parcelId: parcelId,
    recordedDate: recordedDate,
    instrumentNumber: instrumentNo,
    bookPage: `${book}/${page}`,
    grantor: `${displayFirst} ${displayLast}`,
    grantorType: grantorType,
    grantee: `${displayFirst} ${displayLast}`,
    consideration: records.formatCurrency(transferAmount),
    assessedValue: records.formatCurrency(assessedValue),
    docStampTax: records.formatCurrency(docStampTax),
    legalDescription: `Lot ${lot}, Block ${block}, ${subdivision}`,
    recorderOffice: `${county.name} County Recorder's Office`,
    verificationHint: 'County confirmed real. Address does not exist.'
  };
}

/**
 * Generate a corporate filing hallucination.
 */
function generateCorporateFiling(rng, seed) {
  const jurisdiction = records.generateJurisdictionCode(rng);
  const displayLast = seed.lastName.charAt(0).toUpperCase() + seed.lastName.slice(1);
  const entityName = records.generateEntityName(rng, displayLast);
  const entityNumber = records.generateCorpNumber(rng, jurisdiction);
  const filingDate = records.generateFilingTimestamp(rng, 2008, 2022);
  const addr = generateAddress(rng);

  const naicsCodes = [
    '541110', '541211', '541219', '541600', '519290',
    '611430', '541990', '523900', '531120', '531390',
    '541720', '541620', '541930', '524210', '525990'
  ];

  const displayFirst = seed.firstName.charAt(0).toUpperCase() + seed.firstName.slice(1);

  const annualReportDates = [];
  let arYear = new Date().getFullYear() - randInt(rng, 1, 3);
  for (let i = 0; i < 3; i++) {
    annualReportDates.push(`${arYear + i}-01-${String(randInt(rng, 1, 28)).padStart(2, '0')}`);
  }

  return {
    type: 'corporate_filing',
    entityName: entityName,
    entityNumber: entityNumber,
    jurisdiction: jurisdiction,
    filingDate: filingDate,
    status: pick(rng, ['Active', 'Active', 'Active', 'Active - Good Standing', 'Delinquent']),
    naicsCode: pick(rng, naicsCodes),
    registeredAgent: `${displayFirst} ${displayLast}`,
    agentAddress: addr.street,
    agentCity: addr.city,
    agentState: addr.state,
    agentZip: addr.zip,
    principalOffice: `${addr.city}, ${addr.state}`,
    annualReportDates: annualReportDates,
    divisionName: `Secretary of State, ${STATE_NAMES[jurisdiction] || jurisdiction} — Corporations Division`,
    verificationHint: 'Division confirmed real. Entity number returns no results.'
  };
}

/**
 * Generate a domain registration hallucination.
 */
function generateDomainRecord(rng, seed) {
  const domain = records.generateDomain(rng, seed.firstName, seed.lastName);
  const registrar = pick(rng, [
    'GoDaddy.com LLC', 'Namecheap Inc.', 'Google Domains LLC',
    'Tucows Domains Inc.', 'Network Solutions LLC', 'Cloudflare Inc.',
    'Amazon Registrar Inc.', 'Porkbun LLC'
  ]);

  const createdYear = randInt(rng, 2005, 2020);
  const createdDate = `${createdYear}-${String(randInt(rng, 1, 12)).padStart(2, '0')}-${String(randInt(rng, 1, 28)).padStart(2, '0')}`;
  const expiresYear = createdYear + randInt(rng, 1, 5);
  const expiresDate = `${expiresYear}-${String(randInt(rng, 1, 12)).padStart(2, '0')}-${String(randInt(rng, 1, 28)).padStart(2, '0')}`;
  const updatedDate = `${createdYear + randInt(rng, 1, 3)}-${String(randInt(rng, 1, 12)).padStart(2, '0')}-${String(randInt(rng, 1, 28)).padStart(2, '0')}`;

  const nsDomains = ['bluehost.com', 'godaddy.com', 'cloudflare.com', 'namecheapdns.com', 'dnsimple.com'];
  const nameservers = [`ns1.${pick(rng, nsDomains)}`, `ns2.${pick(rng, nsDomains)}`];

  const displayFirst = seed.firstName.charAt(0).toUpperCase() + seed.firstName.slice(1);
  const displayLast = seed.lastName.charAt(0).toUpperCase() + seed.lastName.slice(1);

  return {
    type: 'domain_registration',
    domain: domain,
    registrar: registrar,
    createdDate: createdDate,
    updatedDate: updatedDate,
    expiresDate: expiresDate,
    status: records.generateDomainStatus(rng),
    nameservers: nameservers,
    registrantName: `${displayFirst} ${displayLast}`,
    registrantOrg: `${displayLast} Holdings`,
    verificationHint: 'WHOIS format verified. Domain unregistered or registered to different entity.'
  };
}

/**
 * Generate a UCC filing hallucination.
 */
function generateUCCRecord(rng, seed) {
  const filingNumber = records.generateUCCFilingId(rng);
  const filingDate = records.generateFilingTimestamp(rng, 2016, 2023);
  const county = pick(rng, COUNTIES);

  const displayFirst = seed.firstName.charAt(0).toUpperCase() + seed.firstName.slice(1);
  const displayLast = seed.lastName.charAt(0).toUpperCase() + seed.lastName.slice(1);

  const collateralTypes = [
    'All business assets including inventory, accounts, equipment, and general intangibles',
    'Equipment: office furniture, computer hardware, and related peripherals',
    'Accounts receivable and general intangibles',
    'Inventory and fixtures located at business premises',
    'Commercial real property fixtures and improvements'
  ];

  const securedParties = [
    `${displayLast} Capital LLC`, 'National Business Credit Corp.',
    'First Commercial Finance', 'Heartland Funding Group',
    'Pacific Coast Lending', `${displayLast} & Associates`
  ];

  return {
    type: 'ucc_filing',
    filingNumber: filingNumber,
    filingDate: filingDate,
    debtor: `${displayFirst} ${displayLast}`,
    securedParty: pick(rng, securedParties),
    collateral: pick(rng, collateralTypes),
    filingOffice: `${STATE_NAMES[county.state]} Secretary of State — UCC Division`,
    jurisdiction: county.state,
    verificationHint: `Filing format matches ${STATE_NAMES[county.state]} SOS standard. Filing number returns no results.`
  };
}

/**
 * Generate all hallucination records for a dossier.
 */
function generateHallucinations(rng, seed) {
  const hallucinations = [];
  hallucinations.push(generatePropertyTransaction(rng, seed));

  const additionalGenerators = [
    generateCorporateFiling,
    generateDomainRecord,
    generateUCCRecord
  ];

  const shuffled = [...additionalGenerators];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const additionalCount = chance(rng, 0.6) ? 2 : 1;
  for (let i = 0; i < additionalCount && i < shuffled.length; i++) {
    hallucinations.push(shuffled[i](rng, seed));
  }

  return hallucinations;
}

module.exports = {
  generatePropertyTransaction,
  generateCorporateFiling,
  generateDomainRecord,
  generateUCCRecord,
  generateHallucinations
};
