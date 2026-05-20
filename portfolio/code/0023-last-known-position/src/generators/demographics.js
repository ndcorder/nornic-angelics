/**
 * Demographics generator.
 *
 * Produces date of birth, gender marker, and estimated age
 * from a seeded RNG. All values are fabricated but follow
 * plausible distributions.
 */

const { pick, randInt, chance } = require('../seeds');

/**
 * Name-to-gender mapping for common American first names.
 * Used to make the gender marker feel connected to the name.
 */
const FEMALE_NAMES = new Set([
  "mary", "patricia", "jennifer", "linda", "barbara", "elizabeth",
  "susan", "jessica", "sarah", "karen", "lisa", "nancy", "betty",
  "margaret", "sandra", "ashley", "dorothy", "kimberly", "emily",
  "donna", "michelle", "carol", "amanda", "melissa", "deborah",
  "stephanie", "rebecca", "sharon", "laura", "cynthia", "kathleen",
  "amy", "angela", "shirley", "anna", "brenda", "pamela", "emma",
  "nicole", "helen", "samantha", "katherine", "christine", "debra",
  "rachel", "carolyn", "janet", "catherine", "maria", "heather",
  "diane", "ruth", "julie", "olivia", "joyce", "virginia", " victoria",
  "grace", "chloe", "sophia", "isabella", "mia", "charlotte",
  "amelia", "harper", "evelyn", "abigail", "ella", "scarlett",
  "madison", "lily", "chloe", "penelope", "layla", "riley",
  "nora", "lillian", "addison", "eleanor", "hannah", "lila",
  "brooklyn", "zoe", "natalie", "naomi", "zoraida", "xochitl"
]);

/**
 * Generate a plausible date of birth.
 * Person is between 28 and 72 years old.
 * Returns { year, month, day } — always.
 */
function generateDateOfBirth(rng) {
  const currentYear = new Date().getFullYear();
  const year = currentYear - randInt(rng, 28, 72);
  const month = randInt(rng, 1, 12);
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const day = randInt(rng, 1, daysInMonth[month - 1]);

  return { year, month, day };
}

/**
 * Generate a gender marker (M/F) derived from the first name.
 * For single-name inputs, uses that name for inference.
 * Falls back to seeded random for unrecognized names.
 */
function generateGenderMarker(rng, firstName) {
  const normalized = (firstName || '').toLowerCase().trim();

  if (FEMALE_NAMES.has(normalized)) {
    return 'F';
  }

  // If not in the female set and not empty, check if it's likely male
  // (Most common names that aren't in our female set are male)
  if (normalized.length > 0 && !FEMALE_NAMES.has(normalized)) {
    // seeded chance so the same name always gets the same result
    return chance(rng, 0.35) ? 'F' : 'M';
  }

  // Absolute fallback
  return chance(rng, 0.5) ? 'F' : 'M';
}

/**
 * Format a DOB object as MM/DD/YYYY string.
 */
function formatDOB(dob) {
  return `${String(dob.month).padStart(2, '0')}/${String(dob.day).padStart(2, '0')}/${dob.year}`;
}

module.exports = {
  generateDateOfBirth,
  generateGenderMarker,
  formatDOB,
  FEMALE_NAMES
};
