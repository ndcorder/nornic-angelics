/**
 * Core fabrication engine.
 *
 * Takes a name and returns a structured dossier object.
 * Deterministic — same name always produces the same dossier.
 */

const { createSeed, pick, pickMultiple, randInt, randFloat, chance } = require('./seeds');
const { COUNTIES, STATE_NAMES, generateAddress, generateUnit, getRandomCounty, getRandomZip } = require('./generators/locations');
const { generateDateOfBirth, generateGenderMarker, formatDOB } = require('./generators/demographics');
const records = require('./generators/records');
const { generateHallucinations } = require('./hallucinate');

/**
 * Generate associated persons — family members, co-registrants.
 */
function generateAssociates(rng, seed) {
  const maleFirstNames = [
    "James", "Robert", "Michael", "William", "David", "Richard",
    "Joseph", "Thomas", "Christopher", "Charles", "Daniel", "Matthew",
    "Anthony", "Mark", "Steven", "Andrew", "Paul", "Joshua",
    "Kenneth", "Kevin", "Brian", "George", "Edward", "Ronald", "Timothy",
    "Jason", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric",
    "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin",
    "Samuel", "Raymond", "Gregory", "Frank", "Alexander", "Patrick", "Jack",
    "Dennis", "Jerry", "Tyler", "Aaron", "Nathan", "Henry", "Peter",
    "Adam", "Douglas", "Zachary", "Walter"
  ];

  const femaleFirstNames = [
    "Mary", "Patricia", "Jennifer", "Linda", "Barbara", "Elizabeth",
    "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty",
    "Margaret", "Sandra", "Ashley", "Dorothy", "Kimberly", "Emily",
    "Donna", "Michelle", "Carol", "Amanda", "Melissa", "Deborah",
    "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia", "Kathleen",
    "Amy", "Angela", "Shirley", "Anna", "Brenda", "Pamela", "Emma",
    "Nicole", "Helen", "Samantha", "Katherine", "Christine", "Debra",
    "Rachel", "Carolyn", "Janet", "Catherine", "Maria", "Heather",
    "Diane", "Ruth", "Julie", "Olivia", "Joyce", "Virginia"
  ];

  const associates = [];
  const count = randInt(rng, 2, 4);

  const isMale = chance(rng, 0.5);
  const familyFirst = isMale ? pick(rng, maleFirstNames) : pick(rng, femaleFirstNames);
  const displayLast = seed.lastName.charAt(0).toUpperCase() + seed.lastName.slice(1);
  const relTypes = ["possible relative", "possible co-habitant", "likely associate"];
  associates.push({
    name: `${familyFirst} ${displayLast}`,
    type: pick(rng, relTypes)
  });

  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia",
    "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez",
    "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore",
    "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris",
    "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen",
    "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall",
    "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
  ];

  for (let i = 1; i < count; i++) {
    const aIsMale = chance(rng, 0.5);
    const aFirst = aIsMale ? pick(rng, maleFirstNames) : pick(rng, femaleFirstNames);
    const aLast = pick(rng, lastNames);
    associates.push({
      name: `${aFirst} ${aLast}`,
      type: pick(rng, ["possible associate", "co-registrant", "linked address", "adjacent property owner"])
    });
  }

  return associates;
}

/**
 * Generate address history.
 */
function generateAddressHistory(rng, seed) {
  const history = [];
  const count = randInt(rng, 2, 5);

  let county = COUNTIES[seed.lastHash % COUNTIES.length];

  for (let i = 0; i < count; i++) {
    if (i > 0 && chance(rng, 0.35)) {
      county = getRandomCounty(rng);
    }

    const addr = generateAddress(rng);
    const unit = generateUnit(rng);
    const currentYear = new Date().getFullYear();
    const fromYear = currentYear - randInt(rng, 1, 15) - (i * 3);
    const toYear = fromYear + randInt(rng, 1, 5);
    const fromMonth = String(randInt(rng, 1, 12)).padStart(2, '0');
    const toMonth = String(randInt(rng, 1, 12)).padStart(2, '0');

    history.push({
      address: addr.street + (unit ? `, ${unit}` : ''),
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      period: {
        from: `${fromMonth}/${fromYear}`,
        to: i === 0 ? 'current' : `${toMonth}/${toYear}`
      },
      type: i === 0 ? 'primary' : pick(rng, ['prior', 'prior', 'secondary']),
      source: pick(rng, [
        'property record', 'voter registration', 'utility filing',
        'corporate filing', 'DMV record'
      ])
    });
  }

  return history;
}

/**
 * Generate the complete dossier from a full name.
 * Main entry point for the fabrication engine.
 */
function fabricate(fullName) {
  const seed = createSeed(fullName);
  const rng = seed.rng;

  const displayFirst = seed.firstName.charAt(0).toUpperCase() + seed.firstName.slice(1);
  const displayLast = seed.lastName.charAt(0).toUpperCase() + seed.lastName.slice(1);
  const displayName = `${displayFirst} ${displayLast}`;

  // Core biographical data
  const dob = generateDateOfBirth(rng);
  const genderMarker = generateGenderMarker(rng, seed.firstName);

  // Primary location (deterministic from last name)
  const primaryCounty = COUNTIES[seed.lastHash % COUNTIES.length];
  const primaryZip = getRandomZip(primaryCounty, rng);

  const identifiers = {
    dmvId: records.generateDMVId(rng, primaryCounty.state),
    voterReg: records.generateVoterRegId(rng, primaryCounty.state),
    ssnPattern: `XXX-XX-${String(randInt(rng, 1000, 9999))}`,
    phone: records.generatePhone(rng),
    email: records.generateEmail(rng, seed.firstName, seed.lastName)
  };

  const addressHistory = generateAddressHistory(rng, seed);

  // Property records
  const propertyRecords = [];
  const propCount = randInt(rng, 1, 3);
  for (let i = 0; i < propCount; i++) {
    const county = chance(rng, 0.5) ? primaryCounty : getRandomCounty(rng);
    const addr = generateAddress(rng);
    const parcelStyle = county.name === 'Fairfax' ? 'fairfax' :
                       county.name === 'Cook' ? 'cook' :
                       county.name === 'Maricopa' ? 'maricopa' : 'default';
    const currentYear = new Date().getFullYear();

    propertyRecords.push({
      parcelId: records.generateParcelId(rng, parcelStyle),
      address: addr.street,
      city: addr.city,
      county: county.name,
      state: county.state,
      zip: addr.zip,
      assessedValue: records.formatCurrency(records.generateAssessedValue(rng)),
      lastTransfer: records.generateDate(rng, currentYear - randInt(rng, 3, 12), currentYear - 1),
      status: pick(rng, ['current', 'current', 'current', 'prior', 'disposed'])
    });
  }

  // Corporate entities
  const corporateEntities = [];
  const corpCount = randInt(rng, 1, 3);
  for (let i = 0; i < corpCount; i++) {
    const jurisdiction = records.generateJurisdictionCode(rng);
    corporateEntities.push({
      name: records.generateEntityName(rng, displayLast),
      number: records.generateCorpNumber(rng, jurisdiction),
      jurisdiction: jurisdiction,
      status: records.generateEntityStatus(rng),
      filingDate: records.generateFilingTimestamp(rng, 2005, 2022),
      role: pick(rng, ['registered agent', 'officer', 'director', 'member', 'manager'])
    });
  }

  // Court records
  const courtRecords = [];
  const courtCount = randInt(rng, 0, 3);
  for (let i = 0; i < courtCount; i++) {
    courtRecords.push({
      caseNumber: records.generateCaseNumber(rng),
      court: `${primaryCounty.name} County ${pick(rng, ['Circuit', 'District', 'Superior', 'Municipal'])} Court`,
      type: pick(rng, ['civil', 'civil', 'small claims', 'traffic', 'ordinance', 'contract']),
      status: pick(rng, ['closed', 'closed', 'closed', 'disposed', 'settled', 'dismissed']),
      filedDate: records.generateDate(rng, 2010, 2022)
    });
  }

  const associates = generateAssociates(rng, seed);
  const hallucinations = generateHallucinations(rng, seed);

  const dossier = {
    meta: {
      generatedAt: new Date().toISOString(),
      subject: displayName,
      queryHash: seed.hash.toString(16).toUpperCase().padStart(8, '0'),
      disclaimer: 'THIS DOCUMENT IS ENTIRELY SYNTHETIC — NO REAL DATA WAS ACCESSED OR REPRODUCED'
    },
    subject: {
      name: displayName,
      firstName: displayFirst,
      lastName: displayLast,
      dob: formatDOB(dob),
      dobParts: dob,
      estimatedAge: new Date().getFullYear() - dob.year,
      genderMarker: genderMarker
    },
    identifiers: identifiers,
    addresses: addressHistory,
    properties: propertyRecords,
    corporate: corporateEntities,
    court: courtRecords,
    associates: associates,
    hallucinations: hallucinations,
    verification: {
      propertyTransaction: hallucinations.find(h => h.type === 'property_transaction'),
      corporateFiling: hallucinations.find(h => h.type === 'corporate_filing'),
      domainRecord: hallucinations.find(h => h.type === 'domain_registration'),
      uccFiling: hallucinations.find(h => h.type === 'ucc_filing'),
      note: 'All records follow authentic formatting standards. Specific values are synthetic — verification attempts will fail.'
    }
  };

  return dossier;
}

module.exports = { fabricate };
