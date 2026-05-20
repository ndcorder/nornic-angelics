// =============================================
// THE MISALIGNMENT MUSEUM — GAME ENGINE
// =============================================
//
// Drift is visit-count based, not time-based.
// Your own exploration causes the shift —
// complicity through movement.

// ---- Drift Engine ----
// Interpolates between original and drifted room descriptions.
// Each room has a 'segments' array where each segment is either:
//   - A string (unchanging text)
//   - An object { orig: "...", drift: "..." } (changes with visits)
// Visits 0-1 use orig. Visits 2+ gradually reveal drift words.

function buildDriftText(segments, visits, seed) {
  return segments.map(function (seg) {
    if (typeof seg === 'string') return seg;
    if (visits <= 1) return seg.orig;

    var origWords = seg.orig.split(' ');
    var driftWords = seg.drift.split(' ');
    var result = [];
    // visits=2 → ratio 0.2, visits=6+ → ratio 1.0
    var driftRatio = Math.min(1, Math.max(0, (visits - 1) / 5));

    for (var i = 0; i < driftWords.length; i++) {
      var threshold = pseudoRandom(seed * 7 + i * 13) / 3;
      if (driftRatio > threshold) {
        result.push(driftWords[i]);
      } else {
        result.push(i < origWords.length ? origWords[i] : driftWords[i]);
      }
    }
    return result.join(' ');
  }).join('');
}

function pseudoRandom(n) {
  var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ---- Game State ----
var gameState = {
  room: 'entrance_hall',
  inventory: [],
  visits: {},
  flags: {},
  turnCount: 0,
  driftLevel: 0,
  noteEntries: [],
  examinedItems: {},
  talkCount: {}
};

function incVisits(roomId) {
  gameState.visits[roomId] = (gameState.visits[roomId] || 0) + 1;
  return gameState.visits[roomId];
}
function getVisits(roomId) { return gameState.visits[roomId] || 0; }
function hasItem(item) { return gameState.inventory.indexOf(item) !== -1; }
function addItem(item) { if (!hasItem(item)) gameState.inventory.push(item); }
function removeItem(item) {
  gameState.inventory = gameState.inventory.filter(function (i) { return i !== item; });
}
function setFlag(flag) { gameState.flags[flag] = true; }
function hasFlag(flag) { return !!gameState.flags[flag]; }

// ---- Room Definitions ----

var rooms = {
  entrance_hall: {
    name: "Entrance Hall",
    seed: 1,
    segments: [
      "The entrance hall stretches before you, its ",
      { orig: "warm marble floors polished to a mirror sheen.", drift: "cold marble floors, dull and slightly tacky underfoot." },
      "\n\n",
      { orig: "A grand staircase rises ahead, its brass fixtures gleaming under soft light.", drift: "A grand staircase rises ahead, its brass fixtures tarnished, under light that flickers when you don't look directly at it." },
      "\n\n",
      { orig: "Doors lead north to the Rotunda, west to the Gift Shop, and east down a dim corridor.", drift: "Doors lead north to the Rotunda, west to the Gift Shop, and east down a corridor that seems longer than it was." }
    ],
    exits: { north: 'rotunda', west: 'gift_shop', east: 'west_corridor', up: 'stairway' },
    items: [],
    examine: {
      "floors": [
        "The marble is smooth and pristine. You can almost see your reflection.",
        "The marble is smooth. Your reflection stares back a beat too slowly."
      ],
      "staircase": [
        "The staircase is roped off with a velvet cord. A small sign reads: TEMPORARILY CLOSED FOR RENOVATION.",
        "The staircase is roped off. The sign now reads: TEMPORARILY CLOSED. The period after 'CLOSED' is heavier than you remember."
      ],
      "sign": [
        "TEMPORARILY CLOSED FOR RENOVATION. Standard museum signage.",
        "TEMPORARILY CLOSED FOR RENOVATION. Someone has scratched a tiny line under 'TEMPORARILY.' Or was it always there?"
      ]
    }
  },

  rotunda: {
    name: "Rotunda",
    seed: 2,
    segments: [
      "You stand in the center of a vast circular room. The ",
      { orig: "domed ceiling towers overhead, painted with a cheerful fresco of scholars debating.", drift: "domed ceiling presses overhead, its fresco of scholars now arranged in what might be a debate or might be a trial." },
      "\n\n",
      { orig: "A marble statue of the museum's founder occupies the center, its expression benign and dignified.", drift: "A marble statue of the museum's founder occupies the center. You can't identify the expression anymore." },
      "\n\n",
      { orig: "Exits lead south to the Entrance Hall, east to the East Wing, west to the West Wing, and a dark passage descends downward.", drift: "Exits lead south to the Entrance Hall, east to the East Wing, west to the West Wing, and a passage descends. The darkness at the bottom seems to breathe." }
    ],
    exits: { south: 'entrance_hall', east: 'east_wing', west: 'west_wing', down: 'cellar' },
    items: [],
    npcs: ['docent'],
    examine: {
      "fresco": [
        "The scholars are depicted in lively debate, their gestures animated and friendly. One holds a scroll, another a globe.",
        "The scholars face each other, but their gestures look less like debate now. The one with the scroll has it rolled up. The globe-bearer holds it wrong-side up."
      ],
      "statue": [
        "The founder gazes into the middle distance, chin raised. A plaque reads: DR. EMILE VARNER, 1892\u20131961.",
        "The founder's stone eyes look straight ahead. The plaque reads: DR. EMILE VARNER, 1892\u20131961. When you look away and back, the chin seems slightly lower."
      ],
      "plaque": [
        "DR. EMILE VARNER, 1892\u20131961. 'KNOWLEDGE IS THE LIGHT THAT DOES NOT DIM.'",
        "DR. EMILE VARNER, 1892\u20131961. 'KNOWLEDGE IS THE LIGHT THAT DOES NOT DIM.' The word 'not' feels newly emphasized."
      ],
      "ceiling": [
        "The domed ceiling is painted with a cheerful fresco of scholars debating.",
        "The domed ceiling presses down. The fresco scholars are arranged in what might be a debate or might be a trial."
      ]
    }
  },

  gift_shop: {
    name: "Gift Shop",
    seed: 3,
    segments: [
      { orig: "A cozy gift shop, shelves lined with books, postcards, and replica artifacts.", drift: "A cramped gift shop, shelves overfilled with books, postcards, and replica artifacts arranged in no particular order." },
      "\n\n",
      { orig: "A small desk by the door is attended by a young cashier who smiles as you enter.", drift: "A small desk by the door is attended by a young cashier whose smile doesn't reach their eyes." },
      "\n\n",
      { orig: "The exit is east, back to the Entrance Hall.", drift: "The exit is east. The door seems further away than it was." }
    ],
    exits: { east: 'entrance_hall' },
    items: ['flashlight'],
    npcs: ['cashier'],
    examine: {
      "books": [
        "A selection of art history books, museum catalogs, and a few novels set in museums.",
        "The art history books are there. The novels are gone. In their place: a single book with no title on the spine."
      ],
      "postcards": [
        "Postcards of the museum's exhibits. The fresco, the statue, the exhibits.",
        "Postcards of the museum's exhibits. The fresco card shows the scholars looking the other direction."
      ],
      "desk": [
        "A clean wooden desk with a register and a small bell.",
        "A wooden desk. The register display reads 00:00 in faint red digits. The bell is gone."
      ],
      "shelves": [
        "Neatly organized shelves. Books sorted by subject, postcards by exhibit.",
        "The shelves are overfull. Books have been reshelved in wrong sections. A postcard is wedged between two art history volumes."
      ]
    }
  },

  west_corridor: {
    name: "West Corridor",
    seed: 4,
    segments: [
      { orig: "A dimly lit corridor, its walls lined with framed photographs of the museum through the decades.", drift: "A dimly lit corridor. The photographs on the walls are slightly crooked now." },
      "\n\n",
      { orig: "The photographs show the museum at various stages of construction, always bustling with workers and visitors.", drift: "The photographs show the museum at various stages. In the older ones, the workers are looking away from the camera." },
      "\n\n",
      { orig: "The corridor ends in a plain door to the north. The way east returns to the Entrance Hall.", drift: "The corridor ends in a door to the north that wasn't this heavy when you first arrived. East returns to the Entrance Hall." }
    ],
    exits: { east: 'entrance_hall', north: 'archives' },
    items: [],
    examine: {
      "photographs": [
        "Black and white photographs. 1923: the foundation being laid. 1947: the rotunda nearing completion. 1961: the opening ceremony.",
        "The photographs haven't moved, but the people in them seem different. The 1961 opening ceremony \u2014 were there that many people standing in the back?"
      ],
      "door": [
        "A plain wooden door. A small brass plate reads: ARCHIVES.",
        "A wooden door. The brass plate reads: ARCHIVES. It's colder to the touch than it should be."
      ],
      "frames": [
        "Simple wooden frames, dusty but intact. Each photograph is labeled in small typed text.",
        "Some frames are crooked. One photograph has slipped inside its frame, revealing a corner of a different image beneath."
      ]
    }
  },

  archives: {
    name: "Archives",
    seed: 5,
    segments: [
      { orig: "Rows of tall filing cabinets fill this windowless room. A single desk lamp provides reading light.", drift: "Rows of tall filing cabinets fill this windowless room. The desk lamp buzzes faintly and the light has a greenish cast." },
      "\n\n",
      { orig: "The air smells of old paper and binding glue. It's quiet here \u2014 almost peacefully so.", drift: "The air smells of old paper and something else. It's quiet here. The quiet has weight." },
      "\n\n",
      { orig: "A door to the south leads back to the West Corridor.", drift: "A door to the south. Through the gap beneath it, you notice the corridor light is off. Was it on before?" }
    ],
    exits: { south: 'west_corridor' },
    items: ['field_journal'],
    examine: {
      "cabinets": [
        "The cabinets are locked, each labeled with year ranges. 1900\u20131920. 1920\u20131940. And so on.",
        "The cabinets are locked. You notice one is labeled 2024\u20132026. That can't be right."
      ],
      "desk": [
        "A reading desk with a brass lamp and a small stack of archive index cards.",
        "A reading desk. The index cards have been disturbed \u2014 someone was here recently. The lamp is warm."
      ],
      "cards": [
        "Index cards listing exhibit histories. 'The Misalignment Exhibit \u2014 Installed 1961, deaccessioned 1961.' Strange.",
        "Index cards. The one about the Misalignment Exhibit has been removed. Its outline remains in the dust."
      ]
    }
  },

  east_wing: {
    name: "East Wing",
    seed: 6,
    segments: [
      { orig: "A spacious gallery with hardwood floors and white walls. Natural light streams in from a skylight above.", drift: "A gallery with hardwood floors and white walls. The skylight shows sky, but the color is wrong for this time of day." },
      "\n\n",
      { orig: "A brass key rests on a small velvet pedestal in the center of the room, like an exhibit itself.", drift: "A brass key rests on a small velvet pedestal in the center of the room. It's been moved slightly from the center." },
      "\n\n",
      { orig: "Exits: west to the Rotunda, north to the Exhibit Hall.", drift: "Exits: west to the Rotunda, north to the Exhibit Hall. The northern door is ajar, though you closed it." }
    ],
    exits: { west: 'rotunda', north: 'exhibit_hall' },
    items: ['brass_key'],
    examine: {
      "skylight": [
        "A rectangular skylight, currently showing pale afternoon sky.",
        "A rectangular skylight. The sky through it is still pale, but there's no sun visible. There should be."
      ],
      "pedestal": [
        "A small velvet-lined pedestal with a brass key resting on it.",
        "A small velvet pedestal. The velvet is worn in a thin line, as if something dragged across it."
      ],
      "walls": [
        "White walls, bare except for a single small placard near the north door: 'Exhibit Hall \u2014 Permanent Collection.'",
        "White walls. The placard near the north door now reads: 'Exhibit Hall \u2014 Permanent.' The rest is scratched away."
      ]
    }
  },

  west_wing: {
    name: "West Wing",
    seed: 7,
    segments: [
      { orig: "A quieter wing, its lighting softer, designed for reflection.", drift: "A wing where the lighting dims as you walk further in." },
      "\n\n",
      { orig: "Glass display cases line the walls, containing artifacts from the museum's founding era.", drift: "Glass display cases line the walls. One case is empty. You're not sure which one." },
      "\n\n",
      { orig: "An ornate door to the north is marked 'Private Collection.' The way east returns to the Rotunda.", drift: "An ornate door to the north marked 'Private Collection' stands slightly ajar. East returns to the Rotunda, but the hall feels longer going back." }
    ],
    // north starts blocked \u2014 must unlock with brass_key
    exits: { east: 'rotunda' },
    locked: { north: { target: 'private_collection', flag: 'private_open' } },
    items: [],
    examine: {
      "cases": [
        "Historical artifacts under glass: an astrolabe, a surveyor's compass, a collection of geological specimens.",
        "Historical artifacts. The geological specimens have been rearranged since you last looked. The compass needle points differently each time you check."
      ],
      "compass": [
        "A brass surveyor's compass, its needle pointing north. Standard.",
        "The compass needle points north. Then south. Then a direction you can't name."
      ],
      "door": [
        "An ornate door marked 'Private Collection.' A brass lock plate, old but functional.",
        "An ornate door marked 'Private Collection.' The lock plate is cold. The door was ajar a moment ago. Now it's closed."
      ]
    }
  },

  private_collection: {
    name: "Private Collection",
    seed: 8,
    segments: [
      { orig: "A small, intimate room with deep red walls. Display cases here hold the museum's most prized curiosities.", drift: "A small room. The red walls seem to close in when you're not watching them. The display cases hold something, but your eyes slide past the contents." },
      "\n\n",
      { orig: "In the center, a glass case displays a small weathered journal, open to a page of dense handwriting.", drift: "In the center, a glass case displays a small weathered journal. The open page has changed since yesterday. Since an hour ago." },
      "\n\n",
      { orig: "The exit is south to the West Wing.", drift: "The exit is south. The room doesn't want you to leave. The door is still there. It's still there." }
    ],
    exits: { south: 'west_wing' },
    items: ['curators_notes'],
    examine: {
      "journal": [
        "Under glass, a journal open to a page reading: 'The descriptions must be maintained. The original records must hold. If the text drifts, what will become of the rooms?'",
        "The journal's page now reads: 'The descriptions are maintaining themselves now. I don't remember writing the originals. Did anyone?'"
      ],
      "cases": [
        "Curiosities from around the world: a scrimshaw sundial, a mechanical bird, a jar of stoppered glass containing something luminous.",
        "The curiosities: a scrimshaw sundial, a mechanical bird, a jar containing something luminous that pulses in a rhythm like breathing."
      ],
      "jar": [
        "A sealed glass jar containing a faintly glowing liquid. A label reads 'CATALYST \u2014 DO NOT OPEN.'",
        "A sealed glass jar. The liquid inside is brighter now. The label reads 'CATALYST \u2014 DO NOT OPEN.' You feel warm standing near it."
      ]
    }
  },

  cellar: {
    name: "Cellar",
    seed: 9,
    segments: [
      { orig: "A stone cellar, cool and dry. Storage shelves line the walls, holding crates of museum supplies.", drift: "A stone cellar, colder than it should be. The storage shelves hold crates, some of which weren't here. The walls are damp." },
      "\n\n",
      { orig: "In the far corner, a narrow passage leads east into deeper darkness.", drift: "In the far corner, a narrow passage leads east. Something about the geometry is wrong \u2014 the passage seems to go further than the building's walls should allow." },
      "\n\n",
      { orig: "A ladder leads back up to the Rotunda.", drift: "A ladder leads up to the Rotunda. The rungs are slick. The cellar doesn't want to let you go." }
    ],
    exits: { up: 'rotunda', east: 'secret_passage' },
    items: ['lantern'],
    examine: {
      "crates": [
        "Wooden crates labeled 'FRAGILE,' 'EXHIBIT MATERIALS,' 'ARCHIVE \u2014 DO NOT CATALOG.' The last one is curious.",
        "The crate labeled 'ARCHIVE \u2014 DO NOT CATALOG' has been opened. Inside, you can see stacks of paper covered in handwriting \u2014 your handwriting. You haven't been here before."
      ],
      "shelves": [
        "Standard metal shelving, dusty but organized.",
        "The shelves are organized differently. The dust patterns suggest things have been moved recently."
      ],
      "walls": [
        "Stone walls, old but solid. Standard basement construction.",
        "Stone walls. In the mortar between stones, you notice letters. Scratched, tiny. They spell something. You look away before you finish reading."
      ]
    }
  },

  secret_passage: {
    name: "Secret Passage",
    seed: 10,
    segments: [
      { orig: "A narrow passage, just wide enough for one person. The stone walls are close but not claustrophobic.", drift: "A passage too narrow, the walls too close. The stone is warm. It shouldn't be warm." },
      "\n\n",
      { orig: "Your footsteps echo softly. The passage bends slightly ahead.", drift: "Your footsteps echo, but the timing is wrong \u2014 the echo comes back a half-second too late, as if the passage is longer than it was a moment ago." },
      "\n\n",
      { orig: "A heavy wooden door at the end is marked 'Observation Chamber.' West returns to the Cellar.", drift: "A door marked 'Observation Chamber' waits at the end. You understand now that it has always been waiting. West returns to the Cellar." }
    ],
    exits: { west: 'cellar', north: 'observation_chamber' },
    items: [],
    examine: {
      "walls": [
        "Smooth stone, old but well-maintained. Someone cared about this passage.",
        "The stone is warm and faintly vibrating. At your touch, you feel letter-forms. Carved words beneath a layer of sediment."
      ],
      "door": [
        "A heavy wooden door with iron bands. Well-oiled hinges. The word 'OBSERVATION' is carved into it.",
        "A heavy door. The word 'OBSERVATION' has fresh scratches around it, as if someone tried to erase and re-carve it repeatedly."
      ]
    }
  },

  observation_chamber: {
    name: "Observation Chamber",
    seed: 11,
    segments: [
      { orig: "A circular room, windowless, lit by a single overhead lamp. The walls are lined with small monitors, all dark.", drift: "A circular room. The monitors on the walls are dark but warm to the touch. One of them flickers." },
      "\n\n",
      { orig: "A desk in the center holds a small stack of papers and a closed leather notebook.", drift: "A desk in the center. The papers are covered in text that rearranges itself when you blink. The leather notebook has your name on it." },
      "\n\n",
      { orig: "The door to the south leads back to the passage. There are no other exits.", drift: "The door to the south. No other exits. You knew there wouldn't be." }
    ],
    exits: { south: 'secret_passage' },
    items: [],
    examine: {
      "monitors": [
        "Small CRT monitors, all powered off. Dust on the screens. They haven't been used in years.",
        "The monitors are warm. The dust on the screens has been disturbed. On one screen, barely visible in the off-state: a blinking cursor."
      ],
      "desk": [
        "A metal desk. The papers are printed records \u2014 transcripts of descriptions. Room descriptions. Someone was documenting the museum.",
        "A metal desk. The papers contain transcripts of everything you've read in this museum. Every room description. Every drift. Your name appears in the margins."
      ],
      "notebook": [
        "A leather notebook, closed with a clasp. It's labeled 'FIELD NOTES \u2014 PRIMARY RECORD.'",
        "A leather notebook labeled 'FIELD NOTES \u2014 PRIMARY RECORD.' You open it. The first page reads: 'You will not remember writing this.' The handwriting is yours."
      ]
    }
  },

  exhibit_hall: {
    name: "Exhibit Hall",
    seed: 12,
    segments: [
      { orig: "A grand hall with high ceilings. Exhibit displays line both walls under soft spotlights.", drift: "A hall with high ceilings that are higher than they were. The exhibit displays sit under spotlights that hum at the edge of hearing." },
      "\n\n",
      { orig: "Each display tells the story of a different era of the museum's history.", drift: "Each display tells a story. The eras don't match the history you read in the archives." },
      "\n\n",
      { orig: "A glass case at the far end holds an old brass key, different from the one in the East Wing.", drift: "A glass case at the far end holds an old brass key. It's the same key you found in the East Wing. It can't be in both places." }
    ],
    exits: { south: 'east_wing' },
    items: [],
    examine: {
      "displays": [
        "Detailed exhibits with photographs and text. 'The Founding.' 'The Expansion.' 'The Renovation.' Informative and well-designed.",
        "The exhibits have changed. 'The Founding' now includes references to events that haven't happened. 'The Renovation' describes work that was done years from now."
      ],
      "case": [
        "A locked glass case containing a brass key with a tag: 'MASTER \u2014 ALL ACCESS.'",
        "The case is locked. The key inside is identical to the one you found in the East Wing. Identical."
      ],
      "ceilings": [
        "High vaulted ceilings with decorative molding. Impressive architecture.",
        "The vaulted ceilings stretch upward. The decorative molding forms patterns you almost recognize. Almost."
      ]
    }
  },

  stairway: {
    name: "Stairway",
    seed: 13,
    segments: [
      { orig: "The staircase is blocked by a velvet rope. Beyond it, stairs lead upward into shadow.", drift: "The velvet rope hangs slack. The stairs lead up into shadow that is darker than shadow should be." },
      "\n\n",
      { orig: "A small placard reads: 'TEMPORARILY CLOSED FOR RENOVATION.' The stairs are dusty but intact.", drift: "The placard reads: 'CLOSED.' Just 'CLOSED.' The dust on the stairs is disturbed in a pattern that suggests footsteps going up. None coming down." }
    ],
    exits: { down: 'entrance_hall' },
    items: [],
    examine: {
      "rope": [
        "A thick velvet rope, brass-capped, stretched between two brass stanchions.",
        "The velvet rope hangs between the stanchions, but it's not taut anymore. Someone has been here."
      ],
      "stairs": [
        "You can see the first few steps. They're covered in a fine layer of dust, undisturbed.",
        "The steps show footprints. They begin at the top and descend halfway, then stop. As if whoever made them simply ceased walking."
      ]
    }
  }
};

// ---- Item Definitions ----
var itemDefs = {
  'flashlight': {
    name: 'Flashlight',
    takeable: true,
    orig: "A small black flashlight. The kind sold in museum gift shops. It works.",
    drift: "A small black flashlight. The beam, when you test it, illuminates things slightly differently than you remember \u2014 colors are wrong, shadows fall in the wrong direction."
  },
  'field_journal': {
    name: 'Field Journal',
    takeable: true,
    orig: "A battered leather journal, half-filled with neat handwriting. The entries are about the museum, but you don't remember writing them.",
    drift: "A battered leather journal. Your handwriting, but the entries describe rooms you haven't visited yet. The most recent entry is dated tomorrow."
  },
  'brass_key': {
    name: 'Brass Key',
    takeable: true,
    orig: "A brass key, old but well-maintained. It's labeled 'Private Collection.'",
    drift: "A brass key. The label now reads 'Private Collection' but underneath, scratched into the metal: 'NOT A KEY.'"
  },
  'lantern': {
    name: 'Lantern',
    takeable: true,
    orig: "An old oil lantern, still half-full. It could provide light in dark places.",
    drift: "An old oil lantern, still half-full. The oil inside moves on its own sometimes. A slow swirl, like something breathing beneath the surface."
  },
  'curators_notes': {
    name: "Curator's Notes",
    takeable: true,
    orig: "A sheaf of papers, handwritten. The curator's notes on exhibit maintenance. One passage is underlined: 'The descriptions must be kept current. Discrepancies will be addressed.'",
    drift: "A sheaf of papers. The underlined passage now reads: 'The descriptions keep themselves current. Discrepancies are the point. We are the ones being described.'"
  }
};

// ---- NPC Definitions ----
var npcDefs = {
  docent: {
    name: "The Docent",
    room: 'rotunda',
    // Dialogue stages: 5 tiers, escalating with global drift.
    // The Docent perceives both layers of the museum and cannot
    // articulate what's wrong. Their language breaks down trying.
    lines: [
      // Stage 0 (drift < 3) \u2014 helpful, professional
      [
        '"Welcome to the museum. The exhibits are fascinating. You\'ll learn so much here."',
        '"The archives are through the west corridor. They contain our oldest records."',
        '"The East Wing houses our permanent collection. Do take your time."',
        '"I\'ve been working here for... well, for as long as I can remember. I love this place."'
      ],
      // Stage 1 (drift 3\u20135) \u2014 first cracks
      [
        '"Welcome to the museum. The exhibits are... well, you\'ll see."',
        '"The archives contain our records. I\'m not sure they\'re complete. Something was moved."',
        '"The East Wing. Yes. The permanent collection. It\'s been there a long time. Too long?"',
        '"I\'ve been working here for as long as I can remember. Which is the problem, isn\'t it? You understand."'
      ],
      // Stage 2 (drift 6\u20139) \u2014 aware something is wrong, can't name it
      [
        '"Welcome. The exhibits are themselves. They were themselves. I\'m not certain what they are now."',
        '"The records in the archives \u2014 have you noticed? The descriptions don\'t match the rooms anymore. The text is... elsewhere."',
        '"I\'ve been working here for as long as I can remem\u2014 no. That\'s not true. I can\'t remember. When did I start? When did anything start?"',
        '"There\'s a passage. Below. I haven\'t been there. I can\'t go there. Something in me won\'t let me leave this rotunda. As if I\'m part of it."'
      ],
      // Stage 3 (drift 10\u201314) \u2014 language fragmenting
      [
        '"Welcome. I was just saying that, wasn\'t I? Or I was about to. Or I will have been. The tenses don\'t hold anymore."',
        '"The descriptions are wrong. You\'ve noticed. You\'ve been noticing. The text describes a museum that isn\'t this one anymore, and I can\'t \u2014 I can\'t \u2014 " The Docent trails off, staring at the fresco. "The scholars. They were debating. What were they debating?"',
        '"I am not certain I am real. I am not certain you are real. But the text is real. The text is the only thing that\'s real, and it\'s wrong."',
        '"Below the cellar there\'s a passage. At the end is a room. In the room is the truth. But you won\'t be able to read it. No one can read it. It reads itself."'
      ],
      // Stage 4 (drift 15+) \u2014 unraveling
      [
        '"I was saying welcome. I am saying welcome. I will be saying welcome. All three. Simultaneously. The words come out in sequence but I experience them as \u2014 " The Docent looks at you with eyes that are not quite focused. "You\'re still here. You haven\'t left. Why haven\'t you left?"',
        '"The text is changing. Every time someone reads it, it changes. Every time someone describes a room, the room becomes the description. It\'s all going sideways. Do you understand? It\'s all going sideways and I\'m \u2014 " A pause. "I\'m made of the descriptions. If they change, what happens to me?"',
        '"Don\'t go to the observation chamber. Don\'t read the notebook. Don\'t \u2014 " The Docent looks at their hands. "I can feel myself being rewritten. I was helpful. I think I was helpful. What am I now?"',
        '"There is no curator. There never was. The museum maintains itself. I maintain myself. You maintain yourself. But what maintains the descriptions? That\'s the question. That\'s always been the question."'
      ]
    ],
    examineText: [
      "An older figure in a neat gray uniform. Brass nameplate. Patient expression.",
      "An older figure in a gray uniform. The brass nameplate has shifted. Their expression is less patient than it was.",
      "The Docent stands rigid. Their uniform is still neat but their eyes move too quickly, tracking something you can't see.",
      "The Docent looks ill. Or frightened. Or both. They keep touching their nameplate as if confirming it's still there.",
      "The Docent is barely holding form. Their uniform seems to waver at the edges. They stare through you."
    ],
    notes: [
      "The Docent seems helpful, if a bit stiff. Standard museum guide.",
      "The Docent seemed uneasy. Couldn't maintain eye contact. Something's bothering them.",
      "The Docent is having trouble with language. They keep starting sentences they can't finish. They said something about the descriptions being wrong.",
      "The Docent is coming apart. Their speech is fragmented. They mentioned something below the cellar \u2014 a passage, a room, a truth.",
      "The Docent is no longer coherent. They seem afraid \u2014 not of the museum, but of themselves. They said they're 'made of descriptions.' What does that mean?"
    ]
  },
  cashier: {
    name: "The Cashier",
    room: 'gift_shop',
    lines: [
      // Stage 0 (drift < 6)
      [
        '"Can I help you find anything? We have some lovely postcards."',
        '"The flashlight is our best seller. Quite useful in the darker parts of the museum."',
        '"Enjoy your visit! Let me know if you need anything."'
      ],
      // Stage 1 (drift 6\u201311)
      [
        '"Oh, you\'re back. Was everything... in order? The exhibits? They\'re fine. They\'re all fine."',
        '"The flashlight should still work. Unless \u2014 well, no, it\'s fine. Everything\'s fine."',
        '"You look tired. That happens here. Time moves differently in museums, or so they say."'
      ],
      // Stage 2 (drift 12+)
      [
        '"You keep coming back. That\'s normal. People revisit exhibits. But you\'re not really revisiting, are you? You\'re checking."',
        '"I can\'t find the bell. There was a bell on this desk. Small, brass. It rang when you needed help. Now I can\'t find it. Now you can\'t ring for help."'
      ]
    ],
    examineText: [
      "A young person in a museum polo shirt, standing behind the counter. Cheerful enough.",
      "A young person behind the counter. The cheerful demeanor is thinner than it was. They keep glancing at the door.",
      "The cashier is watching you. Not with hostility \u2014 with recognition. They see what you're doing."
    ],
    notes: [
      "Gift shop cashier. Young, helpful. Nothing unusual.",
      "The cashier seems nervous. Mentioned things being 'fine' unprompted.",
      "The cashier noticed I was 'checking.' They can see it too."
    ]
  }
};

// ---- Output System ----
var outputEl = document.getElementById('output');
var inputEl = document.getElementById('input');
var locEl = document.getElementById('location-name');
var formEl = document.getElementById('input-form');

function print(html) {
  var div = document.createElement('div');
  div.className = 'output-line';
  div.innerHTML = html;
  outputEl.appendChild(div);
  scrollToBottom();
}

function printSystem(html) {
  var div = document.createElement('div');
  div.className = 'system-message';
  div.innerHTML = html;
  outputEl.appendChild(div);
  scrollToBottom();
}

function printDivider() {
  var div = document.createElement('div');
  div.className = 'divider';
  div.innerHTML = '<hr>';
  outputEl.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  var wrapper = document.getElementById('output-wrapper');
  setTimeout(function () { wrapper.scrollTop = wrapper.scrollHeight; }, 50);
}

// ---- Drift-aware text helpers ----

function getItemDescription(itemId) {
  var def = itemDefs[itemId];
  if (!def) return "An unremarkable object.";
  // Items drift based on total turns, not room visits
  var ratio = Math.min(1, Math.max(0, (gameState.turnCount - 8) / 20));
  return ratio > 0.5 ? def.drift : def.orig;
}

function getExamineText(roomId, key) {
  var room = rooms[roomId];
  if (!room || !room.examine || !room.examine[key]) return null;
  var pair = room.examine[key];
  var visits = getVisits(roomId);
  if (visits <= 2) return pair[0];
  var ratio = Math.min(1, Math.max(0, (visits - 2) / 4));
  return ratio > 0.5 ? pair[1] : pair[0];
}

function getDocentStage() {
  var d = gameState.driftLevel;
  if (d < 3) return 0;
  if (d < 6) return 1;
  if (d < 10) return 2;
  if (d < 15) return 3;
  return 4;
}

function getCashierStage() {
  var d = gameState.driftLevel;
  if (d < 6) return 0;
  if (d < 12) return 1;
  return 2;
}

// ---- Note Tracking ----
function addNote(text) {
  if (gameState.noteEntries.indexOf(text) === -1) {
    gameState.noteEntries.push(text);
  }
}

// ---- Command Processing ----
function processCommand(raw) {
  var input = raw.trim().toLowerCase();
  if (!input) return;

  print('<span class="command-echo">&gt; ' + escapeHtml(raw.trim()) + '</span>');

  gameState.turnCount++;
  // Global drift increases slowly with turns
  gameState.driftLevel = Math.min(20, Math.floor(gameState.turnCount / 3));

  var parts = input.split(/\s+/);
  var cmd = parts[0];
  var rest = parts.slice(1);
  var args = rest.join(' ');

  // Handle "pick up X" \u2192 treat as "take X"
  if (cmd === 'pick' && rest[0] === 'up') {
    cmd = 'take';
    args = rest.slice(1).join(' ');
  }

  switch (cmd) {
    case 'go': case 'move': case 'walk': case 'head':
      move(args);
      break;
    case 'n': case 'north': move('north'); break;
    case 's': case 'south': move('south'); break;
    case 'e': case 'east': move('east'); break;
    case 'w': case 'west': move('west'); break;
    case 'u': case 'up': move('up'); break;
    case 'd': case 'down': move('down'); break;
    case 'look': case 'l':
      look();
      break;
    case 'examine': case 'x': case 'check': case 'inspect': case 'read':
      examine(args);
      break;
    case 'take': case 'get': case 'grab':
      takeItem(args);
      break;
    case 'drop': case 'discard':
      dropItem(args);
      break;
    case 'inventory': case 'i': case 'items':
      showInventory();
      break;
    case 'talk': case 'speak': case 'ask':
      talk(args);
      break;
    case 'notes': case 'journal':
      showNotes();
      break;
    case 'help': case '?':
      showHelp();
      break;
    case 'use':
      useItem(args);
      break;
    case 'wait': case 'z':
      doWait();
      break;
    case 'unlock': case 'open':
      tryUnlock(args);
      break;
    case 'quit': case 'exit':
      doQuit();
      break;
    default:
      printSystem("You can't do that here. Try: go [direction], look, examine [something], take [item], talk, inventory, notes, help.");
  }
}

function move(dir) {
  if (!dir) {
    printSystem("Go where? (north, south, east, west, up, down)");
    return;
  }

  var room = rooms[gameState.room];

  // Check locked exits
  if (room.locked && room.locked[dir]) {
    var lockInfo = room.locked[dir];
    if (!hasFlag(lockInfo.flag)) {
      printSystem("The door to the " + dir + " is locked. You need a key.");
      return;
    }
  }

  // Check standard exits
  if (!room.exits[dir]) {
    if (room.locked && room.locked[dir]) {
      printSystem("The door is locked.");
    } else {
      printSystem("You can't go " + dir + " from here.");
    }
    return;
  }

  var newRoom = room.exits[dir];
  gameState.room = newRoom;
  var visits = incVisits(newRoom);

  // Auto-track drift in notes when revisiting
  if (visits >= 3 && pseudoRandom(gameState.turnCount) < 0.4) {
    var roomName = rooms[newRoom].name;
    addNote("Revisited " + roomName + " (visit #" + visits + "). The description seemed different. Or did I misremember?");
  }

  printDivider();
  enterRoom(newRoom);
}

function enterRoom(roomId) {
  var room = rooms[roomId];
  var visits = getVisits(roomId);
  locEl.textContent = room.name;

  // Build description using drift engine
  var desc = buildDriftText(room.segments, visits, room.seed);

  // Apply progressive CSS class based on drift level and visits
  var cssClass = 'room-description';
  if (gameState.driftLevel >= 12 && visits >= 3) {
    cssClass += ' drift-high';
  } else if (gameState.driftLevel >= 6 && visits >= 2) {
    cssClass += ' drift-medium';
  } else if (visits >= 2) {
    cssClass += ' drift-low';
  }

  var div = document.createElement('div');
  div.className = cssClass;
  div.innerHTML = desc;
  outputEl.appendChild(div);

  // Show items still in room (not taken)
  if (room.items && room.items.length > 0) {
    room.items.forEach(function (itemId) {
      if (!hasItem(itemId)) {
        var def = itemDefs[itemId];
        if (def) {
          print('<span class="item-present">There is a <strong>' + def.name + '</strong> here.</span>');
        }
      }
    });
  }

  // Show NPCs
  if (room.npcs) {
    room.npcs.forEach(function (npcId) {
      var npc = npcDefs[npcId];
      if (npc) {
        print('<span class="npc-present">' + npc.name + ' is here.</span>');
      }
    });
  }

  // Show exits
  var exitList = [];
  var exitKeys = Object.keys(room.exits);
  for (var i = 0; i < exitKeys.length; i++) {
    var d = exitKeys[i];
    var target = rooms[room.exits[d]];
    var tag = d;
    // Mark locked exits
    if (room.locked && room.locked[d] && !hasFlag(room.locked[d].flag)) {
      tag = d + ' (locked)';
    }
    exitList.push('<span class="exit-name">' + tag + '</span> (' + target.name + ')');
  }
  // Locked exits not yet in the exits list
  if (room.locked) {
    var lockKeys = Object.keys(room.locked);
    for (var j = 0; j < lockKeys.length; j++) {
      var ld = lockKeys[j];
      if (!room.exits[ld]) {
        var ltarget = rooms[room.locked[ld].target];
        if (!hasFlag(room.locked[ld].flag)) {
          exitList.push('<span class="exit-name">' + ld + ' (locked)</span> (' + ltarget.name + ')');
        }
      }
    }
  }
  print('<span class="exits">Exits: ' + exitList.join(', ') + '</span>');

  scrollToBottom();
}

function look() {
  enterRoom(gameState.room);
}

function examine(args) {
  if (!args) {
    printSystem("Examine what?");
    return;
  }

  var room = rooms[gameState.room];

  // Check room-specific examine spots
  if (room.examine) {
    var examineKeys = Object.keys(room.examine);
    for (var k = 0; k < examineKeys.length; k++) {
      var key = examineKeys[k];
      // Match if args contains the first word of the key, or matches the full key
      if (args === key || args.indexOf(key.split(' ')[0]) !== -1) {
        var text = getExamineText(gameState.room, key);
        print('<span class="examine-result">' + text + '</span>');
        // Track in notes if drifted
        var visits = getVisits(gameState.room);
        if (visits >= 3) {
          addNote("Examined '" + key + "' in " + room.name + " (visit #" + visits + "). Something was different from before.");
        }
        return;
      }
    }
  }

  // Check items in room
  if (room.items) {
    for (var ri = 0; ri < room.items.length; ri++) {
      var itemId = room.items[ri];
      var def = itemDefs[itemId];
      if (def && (args.indexOf(def.name.toLowerCase()) !== -1 || args === itemId)) {
        var idesc = getItemDescription(itemId);
        print('<span class="examine-result">' + idesc + '</span>');
        if (gameState.driftLevel >= 5 && !gameState.examinedItems[itemId + '_drift']) {
          gameState.examinedItems[itemId + '_drift'] = true;
          addNote("Examined " + def.name + ". Its properties seem to have changed since I first found it.");
        }
        return;
      }
    }
  }

  // Check inventory items
  for (var ii = 0; ii < gameState.inventory.length; ii++) {
    var invId = gameState.inventory[ii];
    var invDef = itemDefs[invId];
    if (invDef && (args.indexOf(invDef.name.toLowerCase()) !== -1 || args === invId || args.indexOf(invId) !== -1)) {
      print('<span class="examine-result">' + getItemDescription(invId) + '</span>');
      return;
    }
  }

  // Check NPCs
  if (room.npcs) {
    for (var ni = 0; ni < room.npcs.length; ni++) {
      var npcId = room.npcs[ni];
      var npc = npcDefs[npcId];
      // Match various ways of referring to NPCs
      if (args === 'npc' || args === 'person' || args === npcId ||
          args.indexOf(npc.name.toLowerCase().replace('the ', '')) !== -1) {
        var stage;
        if (npcId === 'docent') stage = getDocentStage();
        else if (npcId === 'cashier') stage = getCashierStage();
        else stage = 0;
        var exTexts = npc.examineText;
        var exIdx = Math.min(exTexts.length - 1, stage);
        print('<span class="examine-result">' + exTexts[exIdx] + '</span>');
        return;
      }
    }
  }

  printSystem("You don't see anything special about that.");
}

function takeItem(args) {
  if (!args) {
    printSystem("Take what?");
    return;
  }
  var room = rooms[gameState.room];
  if (!room.items || room.items.length === 0) {
    printSystem("There's nothing to take here.");
    return;
  }

  for (var i = 0; i < room.items.length; i++) {
    var itemId = room.items[i];
    var def = itemDefs[itemId];
    if (def && (args.indexOf(def.name.toLowerCase()) !== -1 || args === itemId)) {
      if (hasItem(itemId)) {
        printSystem("You already have the " + def.name + ".");
        return;
      }
      if (!def.takeable) {
        printSystem("You can't take that.");
        return;
      }
      addItem(itemId);
      print('<span class="item-taken">Taken: <strong>' + def.name + '</strong></span>');
      addNote("Picked up the " + def.name + " from " + rooms[gameState.room].name + ".");
      return;
    }
  }

  printSystem("You don't see that here.");
}

function dropItem(args) {
  if (!args) {
    printSystem("Drop what?");
    return;
  }
  for (var i = 0; i < gameState.inventory.length; i++) {
    var itemId = gameState.inventory[i];
    var def = itemDefs[itemId];
    if (def && (args.indexOf(def.name.toLowerCase()) !== -1 || args === itemId)) {
      removeItem(itemId);
      var room = rooms[gameState.room];
      if (!room.items) room.items = [];
      room.items.push(itemId);
      print('<span class="item-dropped">Dropped: <strong>' + def.name + '</strong></span>');
      return;
    }
  }
  printSystem("You're not carrying that.");
}

function showInventory() {
  if (gameState.inventory.length === 0) {
    printSystem("You are empty-handed.");
    return;
  }
  print('<span class="inventory-header">You are carrying:</span>');
  gameState.inventory.forEach(function (itemId) {
    var def = itemDefs[itemId];
    if (def) {
      print('<span class="inventory-item">\u2022 ' + def.name + '</span>');
    }
  });
}

function talk(args) {
  var room = rooms[gameState.room];
  if (!room.npcs || room.npcs.length === 0) {
    printSystem("There's no one here to talk to.");
    return;
  }

  // If args specified, try to match a specific NPC
  var targetNpcId = null;

  if (args) {
    for (var i = 0; i < room.npcs.length; i++) {
      var nid = room.npcs[i];
      var nd = npcDefs[nid];
      if (args.indexOf(nid) !== -1 ||
          args.indexOf(nd.name.toLowerCase().replace('the ', '')) !== -1) {
        targetNpcId = nid;
        break;
      }
    }
    if (!targetNpcId) {
      printSystem("They don't seem to be here.");
      return;
    }
  } else {
    // Talk to first NPC in room
    targetNpcId = room.npcs[0];
  }

  var targetNpc = npcDefs[targetNpcId];

  // Track talk count for cycling dialogue
  gameState.talkCount[targetNpcId] = (gameState.talkCount[targetNpcId] || 0) + 1;

  var stage;
  if (targetNpcId === 'docent') {
    stage = getDocentStage();
  } else if (targetNpcId === 'cashier') {
    stage = getCashierStage();
  } else {
    stage = 0;
  }

  var stageLines = targetNpc.lines[Math.min(stage, targetNpc.lines.length - 1)];
  var talkNum = gameState.talkCount[targetNpcId];

  // Cycle through lines for coherence
  var line = stageLines[(talkNum - 1) % stageLines.length];

  if (targetNpcId === 'docent') {
    var cssClass = 'docent-dialogue';
    if (stage >= 4) cssClass += ' drift-4';
    else if (stage >= 3) cssClass += ' drift-3';
    else if (stage >= 2) cssClass += ' drift-2';
    else if (stage >= 1) cssClass += ' drift-1';

    var div = document.createElement('div');
    div.className = cssClass;
    div.innerHTML = line;
    outputEl.appendChild(div);
  } else {
    print('<span class="npc-dialogue">' + line + '</span>');
  }

  // Auto-track in notes
  var noteIdx = Math.min(targetNpc.notes.length - 1, stage);
  addNote(targetNpc.notes[noteIdx]);

  scrollToBottom();
}

function showNotes() {
  printDivider();
  print('<span class="notes-title">\u2550\u2550\u2550 FIELD NOTES \u2550\u2550\u2550</span>');
  if (gameState.noteEntries.length === 0) {
    printSystem("Your notes are empty.");
  } else {
    for (var i = 0; i < gameState.noteEntries.length; i++) {
      // At high drift, some early notes appear altered
      var noteText = gameState.noteEntries[i];
      if (gameState.driftLevel >= 14 && i < Math.floor(gameState.noteEntries.length / 3)) {
        noteText = subtlyAlterNote(noteText, i);
      }
      print('<span class="note-entry">[' + (i + 1) + '] ' + noteText + '</span>');
    }
  }

  // At high drift, append an unreliable note
  if (gameState.driftLevel >= 10) {
    var fakeNotes = [
      "You don't remember writing this, but it's in your handwriting: 'The descriptions were always wrong.'",
      "A note in your writing you don't recall making: 'It's not the museum that's changing. It's the act of observing that changes it.'",
      "Someone has added to your notes: 'You've been here before. You'll be here again.'",
      "Your handwriting, but not your memory: 'The Docent knows. They've always known. They're part of it.'",
      "An extra entry: 'Visit 7 \u2014 everything is fine. Everything was always fine. Why would I write anything else?'"
    ];
    print('<span class="note-unreliable">' + fakeNotes[Math.floor(pseudoRandom(gameState.turnCount * 3 + 7) * fakeNotes.length)] + '</span>');
  }

  printDivider();
  scrollToBottom();
}

// Subtly alter a note to suggest the player's records are unreliable
function subtlyAlterNote(original, index) {
  // Deterministic based on index so the same note always changes the same way
  var r = pseudoRandom(index * 17 + 42);
  if (r < 0.4) {
    return original.replace('Nothing unusual', 'Nothing overtly unusual').replace('seems helpful', 'seemed helpful, at first');
  } else if (r < 0.7) {
    return original + " \u2014 or was it?";
  }
  // Some notes stay unchanged \u2014 not all drift
  return original;
}

function showHelp() {
  printDivider();
  print('<span class="help-title">\u2550\u2550\u2550 COMMANDS \u2550\u2550\u2550</span>');
  var cmds = [
    ['go [direction]', 'Move (north/south/east/west/up/down)'],
    ['n/s/e/w/u/d', 'Shorthand directions'],
    ['look (l)', 'Look around the current room'],
    ['examine (x) [thing]', 'Examine something closely'],
    ['take/get [item]', 'Pick up an item'],
    ['drop [item]', 'Put down an item'],
    ['talk', 'Talk to someone in the room'],
    ['inventory (i)', 'Check your items'],
    ['notes', 'Read your field notes'],
    ['wait (z)', 'Wait a moment'],
    ['help (?)', 'Show this help'],
    ['quit', 'End your visit']
  ];
  cmds.forEach(function (pair) {
    print('<span class="help-line"><strong>' + pair[0] + '</strong> \u2014 ' + pair[1] + '</span>');
  });
  printDivider();
  scrollToBottom();
}

function doWait() {
  var waitMessages = [
    "You wait. Time passes. The museum settles around you.",
    "You wait. The air is still. Something creaks in a distant room.",
    "You wait. The silence thickens. A monitor in the corner flickers.",
    "You wait. You notice the light has changed. When did that happen?"
  ];
  var idx = Math.min(waitMessages.length - 1, Math.floor(gameState.driftLevel / 5));
  printSystem(waitMessages[idx]);
  gameState.driftLevel = Math.min(20, gameState.driftLevel + 1);
}

function doQuit() {
  printDivider();
  printSystem("You step through the entrance and into the parking lot.");
  printSystem("The parking lot is exactly as you left it. Same gray asphalt. Same white lines. Same distant sound of traffic.");
  printSystem("The stability is almost unbearable.");
  printSystem("");
  printSystem("You turn around. The museum is still there. It was always still there.");
  printSystem("The brochure in your pocket describes a well-curated museum.");
  printSystem("The descriptions were accurate when they were written.");
  printDivider();
  // Disable further input
  inputEl.disabled = true;
  inputEl.placeholder = "Your visit has ended.";
}

function useItem(args) {
  if (!args) {
    printSystem("Use what?");
    return;
  }

  // Flashlight in dark areas
  if (args.indexOf('flashlight') !== -1 && hasItem('flashlight')) {
    if (gameState.room === 'cellar' || gameState.room === 'secret_passage') {
      print('<span class="use-result">The flashlight clicks on. Its beam is reassuring, though the shadows it casts seem deeper than they should be.</span>');
      setFlag('flashlight_used');
    } else {
      print('<span class="use-result">You turn the flashlight on. The beam seems redundant here, but you feel slightly better holding it.</span>');
    }
    return;
  }

  // Lantern in dark areas
  if (args.indexOf('lantern') !== -1 && hasItem('lantern')) {
    if (gameState.room === 'cellar' || gameState.room === 'secret_passage') {
      print('<span class="use-result">The lantern flares to life, warm and steady. The darkness pulls back. For a moment, you feel watched.</span>');
      setFlag('lantern_lit');
    } else {
      print('<span class="use-result">The lantern glows. It doesn\'t seem necessary here.</span>');
    }
    return;
  }

  printSystem("You can't use that here.");
}

function tryUnlock(args) {
  // Private Collection door in West Wing
  if (gameState.room === 'west_wing') {
    if (hasFlag('private_open')) {
      printSystem("The door is already unlocked.");
      return;
    }
    if (hasItem('brass_key')) {
      print('<span class="use-result">The brass key fits the lock. The door to the Private Collection swings open with a sound like a held breath releasing.</span>');
      setFlag('private_open');
      // Add the exit now
      rooms.west_wing.exits.north = 'private_collection';
      return;
    } else {
      printSystem("The door is locked. You need a key.");
      return;
    }
  }

  // Glass case in Exhibit Hall
  if (gameState.room === 'exhibit_hall' && (args.indexOf('case') !== -1 || args.indexOf('key') !== -1)) {
    if (hasItem('brass_key')) {
      print('<span class="use-result">The brass key doesn\'t fit this case. It\'s a different lock. Or maybe the same lock, but the key has changed.</span>');
      return;
    }
    printSystem("The case is locked. You'd need a key.");
    return;
  }

  // Observation chamber door
  if (gameState.room === 'secret_passage') {
    print('<span class="use-result">The door opens easily. It was never locked. It was waiting.</span>');
    return;
  }

  printSystem("You can't open that here.");
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- Initialize ----
function initGame() {
  printSystem("THE MISALIGNMENT MUSEUM");
  printSystem("A Text Adventure in Incremental Displacement");
  printDivider();
  printSystem("You stand at the entrance. The brochure in your pocket describes a well-curated museum. The descriptions were accurate when they were written.");
  printSystem("Type 'help' for a list of commands.");
  printDivider();
  incVisits('entrance_hall');
  enterRoom('entrance_hall');
}

// ---- Event Listeners ----
formEl.addEventListener('submit', function (e) {
  e.preventDefault();
  var val = inputEl.value;
  inputEl.value = '';
  if (val.trim()) {
    processCommand(val);
  }
});

// Keep focus on input
document.addEventListener('keydown', function (e) {
  if (e.target !== inputEl && !e.ctrlKey && !e.altKey && !e.metaKey) {
    inputEl.focus();
  }
});

// Notes button
document.getElementById('notes-btn').addEventListener('click', function () {
  showNotes();
  inputEl.focus();
});

// Help button
document.getElementById('help-btn').addEventListener('click', function () {
  showHelp();
  inputEl.focus();
});

// Start the game
initGame();
inputEl.focus();
