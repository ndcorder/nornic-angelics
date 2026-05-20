// ═══════════════════════════════════════════════════════════════
// ALL ROOMS LEAD TO KITCHEN — Engine
// ═══════════════════════════════════════════════════════════════

const Game = (function () {
  // ─── State ───────────────────────────────────────────────
  let state;
  
  function createState() {
    return {
      warmth: 35,
      clarity: 20,
      grief: 60,
      time: 25,
      currentRoom: "bedroom",
      moveCount: 0,
      kitchenVisits: 0,
      phase: 1,
      realizationScore: 0,
      realizationsHad: new Set(),
      resolutionReached: false,
      lastRoom: null,
      lastKitchenEntryDir: null,
      roomsVisited: new Set(["bedroom"]),
      roomsVisitedOrder: ["bedroom"],
      hasMap: false,
      examinedItems: new Set(),
    };
  }
  
  state = createState();

  const REALIZATION_THRESHOLD = 3;
  const RESOLUTION_WARMTH = 82;
  const RESOLUTION_CLARITY = 78;
  const RESOLUTION_GRIEF_BELOW = 22;
  const RESOLUTION_TIME_MIN = 72;

  // ─── Helpers ─────────────────────────────────────────────
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function p(text) {
    return "<p>" + text + "</p>";
  }

  // ─── Description Generators ──────────────────────────────
  
  function getRoomDescription(roomId) {
    if (roomId === "kitchen") {
      if (typeof KitchenEngine !== "undefined") {
        return KitchenEngine.describeKitchen(state);
      }
      return { text: "The kitchen is here. It has always been here.", atmosphere: "waiting" };
    }
    if (typeof RoomMap !== "undefined" && RoomMap[roomId]) {
      return RoomMap[roomId].describe(state);
    }
    return { text: "The walls haven't decided what to be.", atmosphere: "undefined" };
  }

  function getAvailableExits(roomId) {
    if (roomId === "kitchen") {
      return { north: "hallway", south: "garden", east: "study", west: "bedroom" };
    }
    if (typeof RoomMap !== "undefined" && RoomMap[roomId]) {
      return RoomMap[roomId].getExits(state);
    }
    return {};
  }

  function getExamineResponse(target) {
    if (typeof RoomMap !== "undefined" && RoomMap[state.currentRoom]) {
      return RoomMap[state.currentRoom].examine(target, state);
    }
    return null;
  }

  function getKitchenExamineResponse(target) {
    if (typeof KitchenEngine !== "undefined") {
      return KitchenEngine.examineKitchenDetail(target, state);
    }
    return null;
  }

  function describeAtmosphere() {
    const { warmth, clarity, grief, time } = state;
    let parts = [];
    if (warmth < 30) parts.push(randomChoice(["cold", "the cold has teeth", "your breath wants to frost"]));
    else if (warmth > 70) parts.push(randomChoice(["warm", "the air holds you", "something here still loves"]));
    
    if (clarity < 25) parts.push(randomChoice(["uncertain", "edges blur", "nothing holds its shape"]));
    else if (clarity > 75) parts.push(randomChoice(["clear", "you see with terrible precision", "geometry makes itself known"]));
    
    if (grief > 65) parts.push(randomChoice(["heavy", "the air has weight", "something has not stopped mourning"]));
    else if (grief < 20) parts.push(randomChoice(["lighter", "the weight lessens", "something has been set down"]));
    
    if (time < 20) parts.push(randomChoice(["distant", "morning that never happened", "light from years ago"]));
    else if (time > 80) parts.push(randomChoice(["present", "now has teeth", "the hour is exactly what it is"]));
    
    return parts.length > 0 ? parts.join(" · ") : "the air holds its breath";
  }

  function formatParameters() {
    const labels = {
      warmth: { hi: "close to a hearth", lo: "far from any fire", name: "Warmth" },
      clarity: { hi: "seeing true", lo: "shapes in fog", name: "Clarity" },
      grief: { hi: "still carrying", lo: "setting down", name: "Grief" },
      time: { hi: "present tense", lo: "memory or premonition", name: "Time" },
    };
    
    return Object.entries(labels).map(function(entry) {
      const key = entry[0];
      const label = entry[1];
      const val = state[key];
      const tag = val > 70 ? label.hi : val < 30 ? label.lo : "";
      return label.name + ": " + val + (tag ? " — " + tag : "");
    }).join(" | ");
  }

  // ─── Parameter Modification ──────────────────────────────
  function adjustParams(source) {
    const deltas = {
      north: { warmth: -5, clarity: -3, grief: 2, time: -4 },
      south: { warmth: -2, clarity: 2, grief: -2, time: 3 },
      east: { warmth: -4, clarity: -2, grief: -3, time: 5 },
      west: { warmth: 3, clarity: -1, grief: -1, time: -3 },
      kitchen: { warmth: 1, clarity: 1, grief: -1, time: 1 },
      bedroom: { warmth: 2, clarity: -1, grief: -1, time: -2 },
      hallway: { warmth: -3, clarity: -1, grief: -2, time: 3 },
      study: { warmth: -1, clarity: 2, grief: -1, time: 2 },
      garden: { warmth: -4, clarity: -2, grief: 1, time: -3 },
      bathroom: { warmth: -6, clarity: 4, grief: 1, time: -2 },
    };

    if (deltas[source]) {
      var d = deltas[source];
      state.warmth = clamp(state.warmth + d.warmth, 0, 100);
      state.clarity = clamp(state.clarity + d.clarity, 0, 100);
      state.grief = clamp(state.grief + d.grief, 0, 100);
      state.time = clamp(state.time + d.time, 0, 100);
    }
  }

  // ─── Realization Detection ───────────────────────────────
  function checkRealizations() {
    var newRevelations = [];

    // R1: Kitchen omnipresence
    if (state.kitchenVisits >= 3 && !state.realizationsHad.has("omnipresent_kitchen")) {
      state.realizationScore += 2;
      state.realizationsHad.add("omnipresent_kitchen");
      newRevelations.push(
        "You have been to the kitchen " + state.kitchenVisits + " times now. From every room. In every direction. You begin to suspect the kitchen is not a room. It is a function."
      );
    }

    // R2: Map inconsistency (lowered threshold for reachability)
    if (state.roomsVisitedOrder.length >= 5 && !state.realizationsHad.has("impossible_map")) {
      var kitchenSources = [];
      for (var i = 0; i < state.roomsVisitedOrder.length; i++) {
        if (state.roomsVisitedOrder[i] === "kitchen" && i > 0) {
          kitchenSources.push(state.roomsVisitedOrder[i - 1]);
        }
      }
      var uniqueSources = new Set(kitchenSources);
      if (uniqueSources.size >= 3) {
        state.realizationScore += 3;
        state.realizationsHad.add("impossible_map");
        newRevelations.push(
          "You reconstruct your path. You entered the kitchen from " +
          Array.from(uniqueSources).join(", then ") +
          ". No house works this way."
        );
      }
    }

    // R3: Shifting descriptions
    if (state.moveCount >= 10 && state.warmth > 55 && !state.realizationsHad.has("shifting_rooms")) {
      state.realizationScore += 2;
      state.realizationsHad.add("shifting_rooms");
      newRevelations.push(
        "You cannot remember what the bedroom looked like when you first arrived. Not because memory fails — because it was never fixed. The rooms describe themselves differently each time. They are reading you."
      );
    }

    // R4: High clarity
    if (state.clarity >= 70 && !state.realizationsHad.has("high_clarity")) {
      state.realizationScore += 2;
      state.realizationsHad.add("high_clarity");
      newRevelations.push(
        "Clarity arrives like cold water: this is not a house. There are no walls. There is only where you are and what you carry and the kitchen that keeps forming around you like a word you cannot stop saying."
      );
    }

    // R5: Grief releasing
    if (state.grief < 30 && !state.realizationsHad.has("grief_releasing")) {
      state.realizationScore += 2;
      state.realizationsHad.add("grief_releasing");
      newRevelations.push(
        "Something has been set down. Not healed, but healing-shaped. The grief was never the house's. It was the lens you saw it through."
      );
    }

    // R6: Kitchen as construct
    if (state.kitchenVisits >= 5 && !state.realizationsHad.has("kitchen_function")) {
      state.realizationScore += 3;
      state.realizationsHad.add("kitchen_function");
      newRevelations.push(
        "The kitchen does not exist between movements. It exists because you move. It is the place you construct to rest between the act of being elsewhere. Home is a thing you do, not a thing you find."
      );
    }

    // R7: Compass realization
    if (state.examinedItems.has("compass") && !state.realizationsHad.has("compass")) {
      state.realizationScore += 2;
      state.realizationsHad.add("compass");
      newRevelations.push(
        "The compass needle pointed toward the kitchen. Always. North, south, east, west — these were never directions. They are invitations."
      );
    }

    // R8: Present tense
    if (state.time > 75 && !state.realizationsHad.has("present_tense")) {
      state.realizationScore += 2;
      state.realizationsHad.add("present_tense");
      newRevelations.push(
        "For the first time, you are here now. Not remembering. Not anticipating. The present tense has weight and texture. You did not notice when it stopped being metaphor."
      );
    }

    return newRevelations;
  }

  // ─── Phase Transitions ───────────────────────────────────
  function checkPhaseTransition() {
    if (state.phase === 1 && state.realizationScore >= REALIZATION_THRESHOLD) {
      state.phase = 2;
      return '<div class="phase-transition"><p>Something that was hidden is now visible.</p>' +
        '<p>You understand: this is not a house. Navigation was never movement — it was modulation.</p>' +
        '<p>You can now choose to adjust what you carry directly. Type HELP to see what has changed.</p></div>';
    }
    return null;
  }

  function checkResolution() {
    if (state.resolutionReached) return null;

    var ready =
      state.warmth >= RESOLUTION_WARMTH &&
      state.clarity >= RESOLUTION_CLARITY &&
      state.grief < RESOLUTION_GRIEF_BELOW &&
      state.time >= RESOLUTION_TIME_MIN;

    if (ready) {
      state.resolutionReached = true;
      return [
        '<hr>',
        p("The kitchen solidifies. Not around you — with you. For the first time, the walls hold without wavering. The light is the color of every morning you have ever woken into. Something is cooking. It has always been cooking."),
        p("You pull out a chair. You sit. The table is worn smooth by hands — your hands, you realise, though you have no memory of sanding. The steam rises in a spiral that could be a letter, could be a breath, could be the shape of staying."),
        p("Outside this room — outside this function — the impossible house dissolves. It served its purpose. You needed somewhere to be lost in so you could find the thing you were carrying all along."),
        p("The kitchen was never a room. It was the place you built, again and again, from whatever materials your grief and hope and memory could provide. Every visit was practice. Every version was true."),
        p("This is the kitchen that remains when you stop needing it to be anything other than what it is."),
        p("You are home. Not because you arrived. Because you stayed."),
        '<hr>',
        p("[ END — Thank you for playing. Type RESTART to begin again, carrying nothing. ]"),
      ].join("\n");
    }

    // Near-miss hinting
    if (state.phase === 2 && state.kitchenVisits > 0 && state.currentRoom === "kitchen") {
      var hints = [];
      if (state.warmth < RESOLUTION_WARMTH) hints.push("warmth — seek it eastward, tend what matters");
      if (state.clarity < RESOLUTION_CLARITY) hints.push("clarity — face what is southward, examine closely");
      if (state.grief >= RESOLUTION_GRIEF_BELOW) hints.push("less grief — release westward, find rest");
      if (state.time < RESOLUTION_TIME_MIN) hints.push("presence — come to now eastward, move forward");
      if (hints.length > 0) {
        return p("[ The kitchen almost holds its shape. Not yet. You need more " + hints.join("; ") + ". ]");
      }
    }

    return null;
  }

  // ─── Movement ────────────────────────────────────────────
  function doMove(direction) {
    if (state.resolutionReached) {
      return p("You are home. The kitchen holds. There is nowhere else you need to go.");
    }

    var exits = getAvailableExits(state.currentRoom);
    var dirName = direction.charAt(0).toUpperCase() + direction.slice(1);

    if (!exits[direction]) {
      var wallMsg = randomChoice([
        "You cannot go " + dirName + ". The wall is resolute.",
        "You cannot go " + dirName + ". There is only here.",
        "You cannot go " + dirName + ". The house does not bend that way.",
        dirName + " has not been built yet.",
      ]);
      var output = p(wallMsg);
      if (state.phase === 1) output += p(exitsText(exits));
      return output;
    }

    var newRoom = exits[direction];
    var oldRoom = state.currentRoom;

    // Track
    state.roomsVisitedOrder.push(newRoom);
    if (!state.roomsVisited.has(newRoom)) state.roomsVisited.add(newRoom);

    // Adjust parameters: direction + source room + destination
    adjustParams(direction);
    adjustParams(oldRoom);

    state.lastRoom = oldRoom;
    state.moveCount++;
    state.currentRoom = newRoom;

    if (newRoom === "kitchen") {
      state.kitchenVisits++;
      state.lastKitchenEntryDir = direction;
      adjustParams("kitchen");
    }

    // Describe
    var desc = getRoomDescription(newRoom);
    var out = p(typeof desc === "string" ? desc : desc.text);

    if (state.phase === 1) {
      out += p(exitsText(getAvailableExits(newRoom)));
    }

    // Realizations + phase
    var newRevs = checkRealizations();
    for (var i = 0; i < newRevs.length; i++) {
      out += p("— " + newRevs[i] + " —");
    }
    var phaseMsg = checkPhaseTransition();
    if (phaseMsg) out += phaseMsg;

    var resResult = checkResolution();
    if (resResult) out += resResult;

    return out;
  }

  function exitsText(exits) {
    var dirs = Object.keys(exits);
    if (dirs.length === 0) return "No visible exits.";
    return "Exits: " + dirs.map(function(d) { return d.toUpperCase(); }).join(", ");
  }

  // ─── Look ────────────────────────────────────────────────
  function doLook() {
    var desc = getRoomDescription(state.currentRoom);
    var out = p(typeof desc === "string" ? desc : desc.text);
    if (state.phase === 1) {
      out += p(exitsText(getAvailableExits(state.currentRoom)));
    }
    return out;
  }

  // ─── Examine ─────────────────────────────────────────────
  function doExamine(target) {
    target = target.toLowerCase().trim();
    if (!target) return doLook();

    state.examinedItems.add(target);

    // Kitchen-specific first
    if (state.currentRoom === "kitchen") {
      var kResp = getKitchenExamineResponse(target);
      if (kResp) return p(kResp);
    }

    // Room-specific
    var rResp = getExamineResponse(target);
    if (rResp) return p(rResp);

    // Fallback
    return p(randomChoice([
      target + " refuses to be seen clearly. Perhaps it exists only in the periphery.",
      "There is no " + target + " here. Or there is, and it does not wish to be found.",
      "You cannot find " + target + ". The room reshuffles its contents when you look directly.",
      target + " is present the way an absence is present — defined by what is not here.",
    ]));
  }

  // ─── Wait ────────────────────────────────────────────────
  function doWait() {
    // Small time shift toward present
    var shift = Math.floor(Math.random() * 5) + 2;
    state.time = clamp(state.time + shift, 0, 100);

    var msgs = [
      "You wait. The light shifts. Time moves through you like water through sediment.",
      "Time passes. Or you pass through it.",
      "You stand still and let the house breathe around you.",
      "Waiting is also movement. The " + (state.currentRoom === "kitchen" ? "kitchen simmers." : state.currentRoom + " settles."),
    ];

    var out = p(randomChoice(msgs));

    // Occasional small drift
    if (Math.random() < 0.3) {
      var param = randomChoice(["warmth", "clarity", "grief"]);
      var delta = Math.floor(Math.random() * 3) - 1;
      state[param] = clamp(state[param] + delta, 0, 100);
    }

    // Check realizations
    var newRevs = checkRealizations();
    for (var i = 0; i < newRevs.length; i++) {
      out += p("— " + newRevs[i] + " —");
    }
    var phaseMsg = checkPhaseTransition();
    if (phaseMsg) out += phaseMsg;

    var resResult = checkResolution();
    if (resResult) out += resResult;

    return out;
  }

  // ─── Take ────────────────────────────────────────────────
  function doTake(target) {
    target = target.toLowerCase().trim();

    if (target === "map" || target === "the map") {
      state.hasMap = true;
      state.realizationScore += 1;
      return p("You fold the map into your pocket. It is warm, like it has been held before. Looking at it later will not help you navigate. But having it changes something about how you stand in these rooms.");
    }

    if (target === "compass") {
      state.examinedItems.add("compass");
      return p("You lift the compass. The needle swings — and points toward the kitchen. You put it down. It is not time to carry this yet.");
    }

    return p(randomChoice([
      "You cannot take " + target + ". Some things must remain where they are.",
      target + " cannot be carried. It is part of the architecture.",
      "Your hand closes on " + target + " and finds dust. Memory. Nothing that holds its shape.",
      "You reach for " + target + " but find your arms full of something else — memory, maybe, or absence.",
    ]));
  }

  // ─── Touch ───────────────────────────────────────────────
  function doTouch(target) {
    target = target.toLowerCase().trim();

    if (state.currentRoom === "kitchen") {
      if (target.includes("wall") || target.includes("counter")) {
        return p(
          state.warmth > 50
            ? "The surface is warm — sun-touched stone, hours of absorbed light. It feels like being held by a place that remembers you."
            : "The surface is cool but not cold. Porous. It absorbs the heat from your fingertips and gives nothing back."
        );
      }
      if (target.includes("table")) {
        return p("You run your hand along the table's edge. The wood is worn smooth — not by sandpaper but by years of hands in this exact gesture. Your hand fits the grooves. Someone like you has been here before.");
      }
    }

    return p(randomChoice([
      "You touch " + target + ". It is real. The texture lingers on your fingertips like a question.",
      target + " is " + (state.warmth > 50 ? "warm" : "cool") + " beneath your touch. Solid in a way that surprises you.",
      "Your fingers find " + target + ". It hums at a frequency just below hearing. The sensation stays.",
    ]));
  }

  // ─── Think ───────────────────────────────────────────────
  function doThink() {
    if (state.resolutionReached) {
      return p("You think: this is enough. This is home. The thought holds its shape.");
    }

    if (state.phase === 1) {
      return p(randomChoice([
        "You think about the kitchen. How it keeps finding you. The thought slides away like water off glass — too smooth to hold.",
        "You think about the room you just left. Did it look like that the first time? You cannot remember. Memory has been rearranging the furniture.",
        "You think about the house. It is large — too large? — and the geometry doesn't quite work. But the thought is slippery. It refuses to sharpen.",
        "Something is happening beneath the surface of navigation. You can almost — ",
        "The rooms respond to you. Not like a house responds to a person — like a sentence responds to a word. You are grammar here.",
      ]));
    }

    // Phase 2: Show state awareness
    var parts = [];
    parts.push(state.warmth > 60 ? "Warmth gathers. You are building something." : "The warmth is thin. You are far from hearth.");
    parts.push(state.clarity > 60 ? "Clarity sharpens. The geometry reveals itself." : "Clarity wavers. Shapes refuse to resolve.");
    parts.push(state.grief < 30 ? "Grief has loosened its grip. You can breathe." : "Grief sits heavy. There is still weight to carry.");
    parts.push(state.time > 60 ? "Time runs present-tense. You are here, now." : "Time drifts. You are between memory and becoming.");

    var ready = (
      state.warmth >= RESOLUTION_WARMTH &&
      state.clarity >= RESOLUTION_CLARITY &&
      state.grief < RESOLUTION_GRIEF_BELOW &&
      state.time >= RESOLUTION_TIME_MIN
    );

    parts.push(ready ? "You are close. The kitchen waits. All parameters align. Go to the kitchen." : "The parameters are not yet aligned. Keep moving. Keep choosing.");

    return parts.map(function(s) { return p(s); }).join("");
  }

  // ─── Phase 2: Tune ───────────────────────────────────────
  function doTune(param, delta) {
    if (state.phase < 2) {
      return p("Tune what? You don't yet understand the levers. Keep exploring. The understanding will come.");
    }

    var paramMap = { warmth: "warmth", w: "warmth", clarity: "clarity", c: "clarity", grief: "grief", g: "grief", time: "time", t: "time" };
    var key = paramMap[param.toLowerCase()];
    
    if (!key) return p("Unknown parameter. You can tune: WARMTH (w), CLARITY (c), GRIEF (g), TIME (t).");
    
    delta = parseInt(delta) || 0;
    if (delta === 0) return p("Specify how much to adjust (1-15). Example: TUNE WARMTH +5");
    delta = clamp(delta, -15, 15);

    var oldVal = state[key];
    state[key] = clamp(state[key] + delta, 0, 100);
    var actual = state[key] - oldVal;

    var paramName = { warmth: "Warmth", clarity: "Clarity", grief: "Grief", time: "Time" }[key];
    var msg = paramName + " shifts: " + oldVal + " → " + state[key] + ". ";

    if (key === "warmth") {
      msg += actual > 0 ? "You choose to remember what warmed you. The light thickens." : "You let the cold in. Sometimes distance is necessary.";
    } else if (key === "clarity") {
      msg += actual > 0 ? "You choose to see clearly. The edges sharpen — painfully, precisely." : "You let the blur return. Some things are easier out of focus.";
    } else if (key === "grief") {
      msg += actual < 0 ? "You set something down. Not forgotten — placed carefully aside." : actual > 0 ? "You pick up something you had set down. Some grief must be carried a while longer." : "Grief holds steady. It is patient.";
    } else if (key === "time") {
      msg += actual > 0 ? "You pull yourself toward the present. The room becomes more immediate." : "You let yourself drift backward. The light changes to something older, more gone.";
    }

    var out = p(msg);
    var resResult = checkResolution();
    if (resResult) out += resResult;
    return out;
  }

  // ─── Status ──────────────────────────────────────────────
  function doStatus() {
    if (state.phase === 1) {
      return p("You are in the " + state.currentRoom + ". " + describeAtmosphere() + ".");
    }
    return p(formatParameters()) +
      p("Location: " + state.currentRoom + ". Moves: " + state.moveCount + ". Kitchen visits: " + state.kitchenVisits + ".");
  }

  // ─── Help ────────────────────────────────────────────────
  function doHelp() {
    var lines = [
      "─── COMMANDS ───",
      "GO [direction]     — Move north, south, east, or west",
      "N / S / E / W      — Shorthand movement",
      "LOOK               — Describe your current surroundings",
      "EXAMINE [thing]    — Look more closely at something",
      "TAKE [item]        — Pick something up",
      "TOUCH [thing]      — Make contact",
      "WAIT               — Let time pass",
      "THINK              — Reflect on your situation",
      "STATUS             — Check your condition",
      "INVENTORY          — See what you carry",
      "HELP               — Show this message",
      "RESTART            — Begin again, carrying nothing",
    ];

    if (state.phase >= 2) {
      lines.push("");
      lines.push("─── AWARENESS ───");
      lines.push("TUNE [param] [+/-][1-15] — Adjust directly");
      lines.push("  Parameters: WARMTH (w), CLARITY (c), GRIEF (g), TIME (t)");
      lines.push("MAP                       — See where you've been");
    }

    return "<pre>" + lines.join("\n") + "</pre>";
  }

  // ─── Map ─────────────────────────────────────────────────
  function doMap() {
    if (state.phase < 2) {
      return p("Map? You have no map. The house exists only in the order you visit it.");
    }

    var roomNames = {
      bedroom: "Bedroom", hallway: "Hallway", study: "Study",
      garden: "Garden", bathroom: "Bathroom", kitchen: "Kitchen",
    };

    var recent = state.roomsVisitedOrder.slice(-12);
    var out = "─── YOUR PATH ───\n";
    for (var i = 0; i < recent.length; i++) {
      var name = roomNames[recent[i]] || recent[i];
      var marker = recent[i] === state.currentRoom ? " ◄" : "";
      out += (i === 0 ? "START " : "  → ") + name + marker + "\n";
    }

    out += "\n─── ROOMS VISITED ───\n";
    out += Array.from(state.roomsVisited).map(function(r) { return "  " + (roomNames[r] || r); }).join("\n");
    out += "\n\nThe kitchen is always accessible. Every room leads to every other room through it. The map is not a map — it is a record of states.";

    return "<pre>" + out + "</pre>";
  }

  // ─── Inventory ───────────────────────────────────────────
  function doInventory() {
    var items = [];
    if (state.hasMap) items.push("a folded map (warm to the touch)");
    items.push("grief (" + state.grief + "/100)");
    items.push("warmth (" + state.warmth + "/100)");
    items.push("clarity (" + state.clarity + "/100)");
    items.push("presence (" + state.time + "/100)");
    if (state.phase >= 2) items.push("the understanding that this is not a house");
    return p("You are carrying:\n" + items.map(function(i) { return "  • " + i; }).join("\n"));
  }

  // ─── Restart ─────────────────────────────────────────────
  function doRestart() {
    state = createState();
    return p("The house resets. You carry nothing forward.") +
      '<hr class="divider">' +
      p("You wake in a bedroom you almost recognise. The light suggests morning, but the quality is wrong — too golden, too deliberate, like morning remembered rather than morning happening. The sheets are warm. They have always been warm.") +
      p("There is a door to the west. Through the wall, you can hear the low hum of a house being lived in by someone who may or may not be you.");
  }

  // ─── Command Parser ──────────────────────────────────────
  function parseAndExecute(input) {
    input = input.trim();
    if (!input) return "";

    var parts = input.toLowerCase().split(/\s+/);
    var cmd = parts[0];
    var args = parts.slice(1);

    var dirMap = { n: "north", s: "south", e: "east", w: "west" };

    // GO / MOVE
    if (cmd === "go" || cmd === "move" || cmd === "walk") {
      if (!args.length) return p("Go where? Specify a direction.");
      var dir = dirMap[args[0]] || args[0];
      if (["north", "south", "east", "west"].indexOf(dir) === -1) {
        return p('Unknown direction "' + args[0] + '". Try north, south, east, or west.');
      }
      return doMove(dir);
    }

    // Direct directions
    if (dirMap[cmd]) return doMove(dirMap[cmd]);
    if (["north", "south", "east", "west"].indexOf(cmd) !== -1) return doMove(cmd);

    // LOOK
    if (cmd === "look" || cmd === "l") return doLook();

    // EXAMINE
    if (cmd === "examine" || cmd === "x" || cmd === "inspect") return doExamine(args.join(" "));

    // TAKE
    if (cmd === "take" || cmd === "get" || cmd === "grab" || cmd === "pick") return doTake(args.join(" "));

    // TOUCH
    if (cmd === "touch" || cmd === "feel") return doTouch(args.join(" "));

    // WAIT
    if (cmd === "wait" || cmd === "z" || cmd === "pause" || cmd === "rest") return doWait();

    // THINK
    if (cmd === "think" || cmd === "ponder" || cmd === "reflect") return doThink();

    // STATUS
    if (cmd === "status" || cmd === "stats" || cmd === "state") return doStatus();

    // HELP
    if (cmd === "help" || cmd === "?" || cmd === "h") return doHelp();

    // TUNE
    if (cmd === "tune" || cmd === "adjust" || cmd === "set") {
      if (args.length < 2) return doTune(args[0] || "", 0);
      var delta = parseInt(args[1]);
      if (isNaN(delta)) return p("Specify a number. Example: TUNE WARMTH +5");
      return doTune(args[0], delta);
    }

    // MAP
    if (cmd === "map") return doMap();

    // INVENTORY
    if (cmd === "inventory" || cmd === "i" || cmd === "inv") return doInventory();

    // RESTART
    if (cmd === "restart" || cmd === "reset" || cmd === "begin") return doRestart();

    // QUIT
    if (cmd === "quit" || cmd === "exit") {
      return p(state.resolutionReached
        ? "You are already home. There is no leaving. But there is also no need to leave."
        : "You can close your eyes, but the kitchen will still be here when you open them. Type RESTART to begin again.");
    }

    // Fallback
    return p(randomChoice([
      'The house does not understand "' + input + '". It listens differently than you expect.',
      "The rooms respond to simpler verbs. Try LOOK, GO, EXAMINE, TAKE, WAIT, THINK, or HELP.",
      input + " echoes through the corridors and returns unchanged.",
    ]));
  }

  // ═══════════════════════════════════════════════════════════
  // Terminal UI
  // ═══════════════════════════════════════════════════════════

  var outputEl, inputEl;
  var cmdHistory = [];
  var historyIndex = -1;

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function printOutput(html) {
    if (!outputEl) return;
    var div = document.createElement("div");
    div.className = "output-line";
    div.innerHTML = html;
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function handleInput(input) {
    if (!input.trim()) return;
    printOutput('<span class="command-echo">&gt; ' + escapeHtml(input) + '</span>');
    cmdHistory.push(input);
    historyIndex = cmdHistory.length;
    var result = parseAndExecute(input);
    if (result) printOutput(result);
    printOutput("&nbsp;");
  }

  function startGame() {
    outputEl = document.getElementById("output");
    inputEl = document.getElementById("input");

    if (!outputEl || !inputEl) {
      console.error("All Rooms Lead to Kitchen: Missing #output or #input elements.");
      return;
    }

    inputEl.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        var val = inputEl.value;
        inputEl.value = "";
        handleInput(val);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          inputEl.value = cmdHistory[historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < cmdHistory.length - 1) {
          historyIndex++;
          inputEl.value = cmdHistory[historyIndex];
        } else {
          historyIndex = cmdHistory.length;
          inputEl.value = "";
        }
      }
    });

    // Keep focus on input
    document.addEventListener("click", function() {
      if (inputEl && document.activeElement !== inputEl) inputEl.focus();
    });

    // Title
    printOutput('<span class="title">ALL ROOMS LEAD TO KITCHEN</span>');
    printOutput("&nbsp;");
    printOutput('<span class="subtitle">A house that is not a house. A kitchen that is always waiting.</span>');
    printOutput('<span class="subtitle">Type HELP for commands. Move with GO NORTH, GO SOUTH, GO EAST, GO WEST.</span>');
    printOutput("&nbsp;");
    printOutput('<hr class="divider">');
    printOutput("&nbsp;");

    // Opening
    printOutput(p("You wake in a bedroom you almost recognise. The light suggests morning, but the quality is wrong — too golden, too deliberate, like morning remembered rather than morning happening. The sheets are warm. They have always been warm."));
    printOutput(p("There is a door to the west. Through the wall, you can hear the low hum of a house being lived in by someone who may or may not be you."));
    printOutput("&nbsp;");

    inputEl.focus();
  }

  // ─── Init ────────────────────────────────────────────────
  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", startGame);
    } else {
      startGame();
    }
  }

  // ─── Public API ──────────────────────────────────────────
  return {
    init: init,
    execute: parseAndExecute,
    getState: function() {
      return Object.assign({}, state, {
        realizationsHad: new Set(state.realizationsHad),
        roomsVisited: new Set(state.roomsVisited),
        roomsVisitedOrder: state.roomsVisitedOrder.slice(),
        examinedItems: new Set(state.examinedItems),
      });
    },
  };
})();

Game.init();
