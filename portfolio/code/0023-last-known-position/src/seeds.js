/**
 * Deterministic seeding from name input.
 * Same name always produces the same dossier.
 * The tool should feel like it's "finding" something, not inventing it.
 */

/**
 * FNV-1a hash — fast, well-distributed, deterministic.
 * Produces a 32-bit unsigned integer from any string.
 */
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Simple seeded PRNG (xorshift32).
 * Returns a function that produces floats in [0, 1).
 */
function createRng(seed) {
  let state = seed | 0 || 1;
  return function next() {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

/**
 * Create a seed object from a person's name.
 * Normalizes the name (lowercase, collapse whitespace) so that
 * "John  Smith" and "john smith" produce identical results.
 *
 * Returns an object with:
 *   - rng: a callable PRNG function
 *   - hash: the raw hash value (useful for ID generation)
 *   - nameHash: hash of just the normalized full name
 *   - lastHash: hash of just the surname (for location consistency)
 */
function createSeed(fullName) {
  const normalized = fullName.toLowerCase().replace(/\s+/g, ' ').trim();
  const parts = normalized.split(' ');

  const nameHash = fnv1a(normalized);
  const firstHash = fnv1a(parts[0]);
  const lastHash = fnv1a(parts[parts.length - 1]);
  const combinedHash = (nameHash ^ (firstHash * 31) ^ (lastHash * 37)) >>> 0;

  return {
    rng: createRng(combinedHash),
    hash: combinedHash,
    nameHash,
    firstHash,
    lastHash,
    fullName: normalized,
    firstName: parts[0],
    lastName: parts[parts.length - 1]
  };
}

/**
 * Utility: pick a random element from an array using the seeded RNG.
 */
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Utility: pick multiple unique elements from an array.
 */
function pickMultiple(rng, arr, count) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/**
 * Utility: generate a seeded integer in [min, max].
 */
function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Utility: generate a seeded float in [min, max).
 */
function randFloat(rng, min, max) {
  return rng() * (max - min) + min;
}

/**
 * Utility: true/false with given probability.
 */
function chance(rng, probability) {
  return rng() < probability;
}

module.exports = {
  fnv1a,
  createRng,
  createSeed,
  pick,
  pickMultiple,
  randInt,
  randFloat,
  chance
};
