/* ───────────────────────────────────────────────────────
 *  RECITATIVE  —  recitative.js
 *
 *  Two voices that never sound simultaneously — until they do.
 *  Each phrase's contour shadows the other's silence.
 *  The listener constructs phantom harmonies.
 *  The final overlap reveals what was always wrong.
 *
 *  Performer API:
 *    import { perform } from './recitative.js';
 *    document.getElementById('play').onclick = perform;
 *
 *  Requires Strudel.js loaded globally as `strudel`.
 * ─────────────────────────────────────────────────────── */

const {
  note, s, gain, sustain, slow, cat, stack, rev,
  delay, room, speed, time, every, degrade, silence,
  slowcat, struct, fast, fastcat, never, sometimesBy
} = strudel;

/* ═══════════════════════════════════════════════════════
 *  TIMING  —  all values in cycles at BPM 60
 *  1 cycle ≈ 1 second
 * ═══════════════════════════════════════════════════════ */
const SECTION_1_END   = 90;   // 1:30 — first section dissolves
const SECTION_2_END   = 270;  // 4:30 — overlap begins
const PIECE_END       = 300;  // 5:00 — hard cut mid-phrase

/* ═══════════════════════════════════════════════════════
 *  VOICE FACTORIES
 * ═══════════════════════════════════════════════════════ */

/** Voice A — pure sine, high, exposed.
 *  Sounds like a person trying to begin a sentence
 *  they have rehearsed for years. */
const voiceA = (p) =>
  note(p)
    .s('sine')
    .gain(0.045)
    .sustain(0.85)
    .delay(0.12)
    .room(0.7);

/** Voice B — sawtooth, filtered low.
 *  Worldlier, warmer, but also more tired.
 *  The voice of someone who stopped waiting
 *  and started forgetting. */
const voiceB = (p) =>
  note(p)
    .s('sawtooth')
    .gain(0.022)
    .sustain(0.85)
    .delay(0.15)
    .room(0.85);

/** The chord that ends it — all the wrong harmonies
 *  stacked into one frozen moment. */
const finalChord = (p) =>
  note(p)
    .s('sawtooth')
    .gain(0.028)
    .sustain(1.0)
    .delay(0.18)
    .room(1.0);

/* ═══════════════════════════════════════════════════════
 *  SECTION 1  [0:00 – 1:30]
 *  A states. B answers in the shape of rest.
 *  Melodies are diatonic, almost hymnal.
 *  The listener hears absence as presence.
 * ═══════════════════════════════════════════════════════ */

/*  A's phrases: ascending, always reaching upward,
 *  as if trying to see over a wall. */
const s1_phrases_a = [
  'E4 G4 A4 B4 A4 G4 E4',           // arch — reach and return
  'D4 F4 A4 B4 C5 B4 A4 F4',        // higher arch, unfulfilled
  'E4 G4 B4 C5 B4 G4 E4',           // triadic, almost resolved
  'A3 C4 E4 G4 A4 G4 E4 C4',        // descending: a concession
  'E4 A4 B4 C5 B4 A4 E4',           // pentatonic yearning
  'D4 E4 G4 A4 B4 A4 G4',           // modal, searching
  'G4 A4 B4 C5 D5 C5 B4 G4',        // widest reach
  'E4 G4 A4 B4 A4 G4 E4',           // return — same words, emptier
];

/*  B's phrases: mirror contours, same scale,
 *  but displaced by a third or fifth — so the listener
 *  fills in the phantom interval. */
const s1_phrases_b = [
  'B3 D4 E4 F4 E4 D4 B3',           // shadows A's arch from below
  'G3 B3 D4 E4 F4 E4 D4 B3',        // wider, as if B listened harder
  'C4 E4 G4 A4 G4 E4 C4',           // inversion: rising where A fell
  'E3 G3 B3 D4 E4 D4 B3 G3',        // matching A's descent
  'C4 E4 G4 A4 G4 E4 C4',           // pentatonic answer
  'B3 D4 E4 G4 A4 G4 E4',           // modal echo
  'E4 F4 G4 A4 B4 A4 G4 E4',        // narrower — B holds back
  'B3 D4 E4 F4 E4 D4 B3',           // same return, same emptiness
];

/*  Interleave: A phrase → rest equal length → B phrase → rest.
 *  Each phrase slowed to ~12s (slow 12 on 8 notes). */
const s1_a = voiceA(slowcat(...s1_phrases_a).slow(12));
const s1_b = voiceB(slowcat(...s1_phrases_b).slow(12));

/* ═══════════════════════════════════════════════════════
 *  SECTION 2  [1:30 – 4:30]
 *  Phrases shorten. Fragments break off.
 *  The gap between voices widens.
 *  Silence becomes the dominant material.
 * ═══════════════════════════════════════════════════════ */

const s2_phrases_a = [
  'E4 G4 B4',
  'C5',
  'A4 G4',
  'E4',
  'B4 C5 D5',
  'G4',
  'E4 A4',
  '',
  'G4 B4',
  '',
  'E4',
  'C5 B4',
  '',
  'A4',
  '',
  'E4 G4',
  '',
  '',
  'B4',
  '',
];

const s2_phrases_b = [
  'B3 D4 E4',
  'F4',
  'D4 C4',
  'B3',
  'E4 F4 G4',
  'C4',
  'B3 E4',
  '',
  'D4 G4',
  '',
  'B3',
  'F4 E4',
  '',
  'D4',
  '',
  'B3 D4',
  '',
  '',
  'E4',
  '',
];

const s2_a = voiceA(slowcat(...s2_phrases_a).slow(8));
const s2_b = voiceB(slowcat(...s2_phrases_b).slow(8));

/* ═══════════════════════════════════════════════════════
 *  SECTION 3  [4:30 – 5:00]
 *  Irrevocable overlap.
 *  A and B sound simultaneously for the first time.
 *  The harmonies the listener constructed in silence
 *  are revealed to be wrong — dissonant, sour,
 *  the sound of two people who never learned to speak
 *  to each other finally trying and failing.
 *
 *  A climbs chromatically upward, desperate.
 *  B descends chromatically, resigned.
 *  They cross in the middle like strangers in a hallway.
 * ═══════════════════════════════════════════════════════ */

const s3_phrase_a = 'E4 F4 F#4 G4 Ab4 A4 Bb4 B4 C5';
const s3_phrase_b = 'Bb3 A3 Ab3 G3 F#3 F3 E3 Eb3 D3';

const s3_a = voiceA(s3_phrase_a.slow(6)).gain(0.04);
const s3_b = voiceB(s3_phrase_b.slow(6)).gain(0.02);

/*  The final sonority: all pitches accumulated,
 *  one chord — 18 pitches sounding at once.
 *  Then silence. Cut. */
const finalPile =
  'E4 F4 F#4 G4 Ab4 A4 Bb4 B4 C5 Bb3 A3 Ab3 G3 F#3 F3 E3 Eb3 D3';

const ending = finalChord(finalPile)
  .slow(30)
  .gain(0.02);

/* ═══════════════════════════════════════════════════════
 *  ASSEMBLE — time-gate each section
 * ═══════════════════════════════════════════════════════ */

const gate = (pattern, tStart, tEnd) =>
  pattern.when(
    x => time(x) >= tStart && time(x) < tEnd,
    x => x,
    x => x.gain(0)
  );

const section1 = stack(
  gate(s1_a, 0, SECTION_1_END),
  gate(s1_b, 0, SECTION_1_END)
);

const section2 = stack(
  gate(s2_a, SECTION_1_END, SECTION_2_END),
  gate(s2_b, SECTION_1_END, SECTION_2_END)
);

const section3 = stack(
  gate(s3_a, SECTION_2_END, PIECE_END),
  gate(s3_b, SECTION_2_END, PIECE_END),
  gate(ending, SECTION_2_END, PIECE_END)
);

/* ═══════════════════════════════════════════════════════
 *  MAIN PIECE
 * ═══════════════════════════════════════════════════════ */

const piece = stack(section1, section2, section3)
  .cps(1);

/* ═══════════════════════════════════════════════════════
 *  PERFORM — attach to UI
 * ═══════════════════════════════════════════════════════ */

function perform() {
  var btn  = document.getElementById('play');
  var info = document.getElementById('info');

  btn.style.transition = 'opacity 1.5s ease';
  btn.style.opacity = '0';
  setTimeout(function () { btn.style.display = 'none'; }, 1600);

  document.body.style.cursor = 'none';

  setTimeout(function () {
    document.body.style.transition = 'background 30s ease';
    document.body.style.background = '#080000';
  }, SECTION_2_END * 1000);

  if (info) {
    setTimeout(function () {
      info.style.transition = 'opacity 12s ease';
      info.textContent = '';
      info.style.opacity = '0';
    }, 0);
  }

  piece.play().catch(function (err) {
    console.error('Recitative failed:', err);
    if (info) {
      info.textContent = 'The audio could not begin.';
      info.style.color = '#553333';
    }
  });
}

/* ═══════════════════════════════════════════════════════
 *  EXPORTS
 * ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.recitative = { perform: perform, piece: piece };
}

export { perform, piece };
