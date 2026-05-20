// poems.js — Triptych for a Demolition
// Three fixed-form poems on the same demolition: resident (villanelle), worker (pantoum), building (ghazal)
// The building never speaks its name.

const TRIPTYCH = {

  // ─────────────────────────────────────────────────
  // I. VILLANELLE — The Former Resident
  // Form: 19 lines, 5 tercets + 1 quatrain, 2 rhymes (a/b)
  //       Line 1 = refrain A (rhyme a), Line 3 = refrain B (rhyme b)
  //       Stanza pattern: A b B / a b A / a b B / a b A / a b B / a b A B
  // Rhymes: -air (stair, bear, care, air, there, bare), -ing (spring, ring, thing, swing, cling)
  // ─────────────────────────────────────────────────
  villanelle: {
    title: "I",
    form: "villanelle",
    lines: [
      "The scaffolding went up before the spring.",
      "The neighbors carried boxes down the stair.",
      "The house released us, took away its ring.",

      "I kept a coffee mug. I kept a thing",
      "my daughter made at nine, a ceramic bear.",
      "The scaffolding went up before the spring.",

      "From overhead, a wide blue arm would swing",
      "above the courtyard tree, above the chair",
      "The house released us, took away its ring.",

      "The slamming of the doors in every spring",
      "came back to me, came back to everywhere.",
      "The scaffolding went up before the spring.",

      "We stripped the walls. We offered everything.",
      "We tried to burn the smell of her from air.",
      "The house released us, took away its ring.",

      "I watched it buckle. Watched the last wall cling.",
      "A man in mud beside the wreckage stared.",
      "The scaffolding went up before the spring.",
      "The house released us, took away its ring."
    ]
  },

  // ─────────────────────────────────────────────────
  // II. PANTOUM — The Demolition Worker
  // Form: 16 lines, 4 quatrains
  //       Lines 2,4 of each stanza become lines 1,3 of next stanza
  //       Final stanza lines 2,4 echo first stanza lines 1,3 (in reverse: 3,1)
  // Rhymes: a/b slant — -ick (brick, click, trick), -ap (snap, lap, tap)
  // ─────────────────────────────────────────────────
  pantoum: {
    title: "II",
    form: "pantoum",
    lines: [
      "I swung the arm around and hit the brick",
      "The structure groaned, ash powder in the air",
      "The morning I started I drank from a plastic cup",
      "I know what copper sounds like when it snaps",

      "The structure groaned, ash powder in the air",
      "A radiator fell and crushed the tub",
      "I know what copper sounds like when it snaps",
      "The bucket curled and closed and bit the stair",

      "A radiator fell and crushed the tub",
      "I'll finish this by Thursday if it clicks",
      "The bucket curled and closed and bit the stair",
      "The second floor gave way and took the wall",

      "I'll finish this by Thursday if it clicks",
      "The morning I started I drank from a plastic cup",
      "The second floor gave way and took the wall",
      "I swung the arm around and hit the brick"
    ]
  },

  // ─────────────────────────────────────────────────
  // III. GHAZAL — The Building
  // Form: 5 couplets (sher), each ending with radif "for you"
  //       Qāfiyā (rhyme before radif): -and (stand, hand, sand, grand, stand)
  //       Matla: both lines rhyme in opening couplet
  //       Makta: final couplet — the building may name itself, but doesn't
  // The building addresses the city as beloved — but never speaks its own name.
  // ─────────────────────────────────────────────────
  ghazal: {
    title: "III",
    form: "ghazal",
    lines: [
      "I held your generations as they ran, for you.",
      "I held your dark and light within my hand, for you.",

      "The arch you pressed your palm to — I could not stand.",
      "The stair that learned your footfall turned to sand, for you.",

      "Two hundred windows opened on the sky.",
      "I held the glass between my teeth and I would stand, for you.",

      "Now dust is in my throat. Now I am pressed",
      "to earth, where once I rose and stretched my span, for you.",

      "I will not speak my name. The streets will stand",
      "where I no longer stand. But I will stand, for you."
    ]
  }
};
