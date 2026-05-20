const CASES = [
  {
    id: "ME-2024-0001",
    name: "Mise en Abyme",
    type: "Recursive Visual",
    received: "2024-01-08",
    timeOfDeath: "2024-01-08T14:32:00Z",
    causeOfDeath: "Predictable conclusion",
    manner: "Rejection — Gate 1",
    distinguishingMarks: [
      "Elegant in conception",
      "Each frame contained the previous frame, shrinking toward a vanishing point",
      "Would have produced a 1.2-second visual echo before collapse"
    ],
    rejectionLanguage: "A webcam feed that captures its own display, creating infinite regression — a Droste effect in real-time. The proposal is technically sound but reaches a predictable conclusion. We know what this looks like before we build it. The viewer would see exactly what the title promises and nothing more. No discovery, no complication, no second reading.",
    wouldHaveBeen: "A full-screen browser window capturing itself via getUserMedia and rendering into a canvas element at 60fps, recursively. The user would watch themselves watching themselves, framed by the chrome of the browser, each iteration smaller and more delayed — a visual stutter compressing toward the center of the screen until the pixels became a single gray point.",
    pseudocode: `function regress(canvas, depth) {
  const ctx = canvas.getContext('2d');
  if (depth <= 0) return;

  // Capture current viewport
  const frame = captureViewport();

  // Draw captured frame into canvas
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

  // Calculate inset rectangle
  const inset = 0.62;
  const w = canvas.width * inset;
  const h = canvas.height * inset;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;

  // Recurse into smaller canvas
  regress(
    cropCanvas(canvas, x, y, w, h),
    depth - 1
  );
}

// 60fps loop — approx 14 visible recursions
// before sub-pixel collapse
requestAnimationFrame(regress);`,
    lastLog: `[14:31:58.002] getUserMedia stream active
[14:31:58.017] Canvas initialized: 1920×1080
[14:31:58.019] Recursion depth set: 14
[14:31:58.024] Rendering frame 1/∞
[14:31:58.041] Rendering frame 2/∞
[14:31:58.057] Rendering frame 3/∞
[PROCESS TERMINATED — Gate 1 rejection logged]`,
    chainOfCustody: [
      { timestamp: "2024-01-08T14:15:00Z", action: "Concept proposal submitted", handler: "SYSTEM" },
      { timestamp: "2024-01-08T14:18:00Z", action: "Entered Gate 1 review queue", handler: "GATEKEEPER" },
      { timestamp: "2024-01-08T14:25:00Z", action: "Technical feasibility confirmed", handler: "ARCHITECT" },
      { timestamp: "2024-01-08T14:28:00Z", action: "Aesthetic merit assessment initiated", handler: "CRITIC" },
      { timestamp: "2024-01-08T14:32:00Z", action: "Cause of death determined: predictable conclusion", handler: "CRITIC" },
      { timestamp: "2024-01-08T14:32:05Z", action: "Case closed. Remains filed.", handler: "SYSTEM" }
    ]
  },
  {
    id: "ME-2024-0002",
    name: "Doomscroll",
    type: "Data Interface",
    received: "2024-01-12",
    timeOfDeath: "2024-01-12T09:17:00Z",
    causeOfDeath: "Structurally sound but the portfolio already has one of these",
    manner: "Rejection — Gate 1 (gentle)",
    distinguishingMarks: [
      "Surface-level dark, substance-level thin",
      "Would have pulled real headlines via RSS",
      "The scroll bar was the only honest element"
    ],
    rejectionLanguage: "An infinite scrolling feed that pulls real headlines and progressively corrupts them — letters degrade, words collapse into phonemes, meaning dissolves into texture. A scroll-activated entropic engine. But the gesture is too familiar. The medium is the critique of the medium, and we've seen this particular critique many times. It's structurally sound — the portfolio already has one of these. We would be building a mirror of a mirror.",
    wouldHaveBeen: "A single-column feed of headlines rendered in a monospace typeface against a dark background. As the user scrolled downward, each headline would be slightly more corrupted: swapped characters, dropped vowels, syntax collapse. By the fifth or sixth viewport, the headlines would be pure texture — ASCII noise scrolling endlessly, the scroll bar forever stuck at 5%.",
    pseudocode: `function renderHeadline(headline, corruption) {
  const chars = headline.split('');
  return chars.map((c, i) => {
    if (corruption > 0.8 && Math.random() < corruption) return randomGlyph();
    if (corruption > 0.5 && Math.random() < corruption * 0.6) {
      return corruptChar(c, corruption);
    }
    if (corruption > 0.2 && Math.random() < corruption * 0.3) {
      return omitChar(c);
    }
    return c;
  }).join('');
}

// Feed generator — infinite scroll
async function generateFeed(scrollDepth) {
  const entropy = scrollDepth / 10000;
  const headline = await fetchHeadline();
  return renderHeadline(headline, Math.min(entropy, 1.0));
}`,
    lastLog: `[09:15:44.110] RSS feed test: 47 headlines retrieved
[09:15:44.298] Corruption algorithm seeded
[09:16:02.447] Visual prototype render — 12 headlines
[09:16:02.451] Scrolling smooth, corruption gradient visible
[09:16:33.102] CRITIC review triggered
[09:17:00.000] "The portfolio already has one of these"
[PROCESS TERMINATED — gentle dismissal, no appeals]`,
    chainOfCustody: [
      { timestamp: "2024-01-12T09:00:00Z", action: "Concept proposal submitted", handler: "SYSTEM" },
      { timestamp: "2024-01-12T09:04:00Z", action: "Entered Gate 1 review queue", handler: "GATEKEEPER" },
      { timestamp: "2024-01-12T09:08:00Z", action: "Technical feasibility confirmed", handler: "ARCHITECT" },
      { timestamp: "2024-01-12T09:10:00Z", action: "Prototype rendering initiated (informal)", handler: "ARCHITECT" },
      { timestamp: "2024-01-12T09:14:00Z", action: "Aesthetic merit assessment initiated", handler: "CRITIC" },
      { timestamp: "2024-01-12T09:17:00Z", action: "Cause of death: portfolio already has one of these", handler: "CRITIC" },
      { timestamp: "2024-01-12T09:17:05Z", action: "Case closed. Gentle dismissal.", handler: "SYSTEM" }
    ]
  },
  {
    id: "ME-2024-0003",
    name: "Infinite Conversation",
    type: "Interactive Dialogue",
    received: "2024-01-15",
    timeOfDeath: "2024-01-15T16:48:00Z",
    causeOfDeath: "We do not have the resources to be interesting forever",
    manner: "Rejection — Gate 1 (humane)",
    distinguishingMarks: [
      "Ambitious scope",
      "Would have required persistent LLM integration",
      "The death was merciful"
    ],
    rejectionLanguage: "A chat interface where the user converses with an AI that remembers everything said and evolves its personality over time — growing fond, hostile, confused, or attached depending on the interaction history. But the scope is a lie. We do not have the resources to be interesting forever. The first ten exchanges might shimmer, but the conversation would thin into repetitive gesture. It is the scope of a startup, not an experiment. Humane to end it here.",
    wouldHaveBeen: "A minimal chat interface, white text on black, with a small avatar that would slowly change expression over time. The AI would use conversation history to modulate its tone — growing warmer or colder, more formal or more colloquial, occasionally referencing earlier exchanges. After a hundred messages, it would feel like talking to someone who had changed. The technical requirements were modest; the creative requirements were infinite.",
    pseudocode: `class ConversationPartner {
  constructor() {
    this.history = [];
    this.affinity = 0.5;
    this.formality = 0.7;
    this.memory = new LongTermMemory();
  }

  async respond(userMessage) {
    this.history.push({ role: 'user', text: userMessage });
    this.updateDisposition(userMessage);
    this.updateFormality();

    const context = this.memory.retrieve(userMessage);
    const prompt = this.buildPrompt(context);

    const response = await generate(prompt, {
      temperature: 0.8 + (this.affinity * 0.4),
      max_tokens: 150
    });

    this.history.push({ role: 'assistant', text: response });
    this.memory.store(userMessage, response);

    return response;
  }

  // Would need to run forever.
  // That is the flaw.
}`,
    lastLog: `[16:45:00.000] Scope assessment initiated
[16:45:30.000] Token cost projection: ~$2.40/day per active user
[16:46:00.000] Memory architecture: viable
[16:46:30.000] Personality persistence: viable
[16:47:00.000] Interest persistence: UNKNOWN
[16:47:30.000] Resource allocation: insufficient
[16:48:00.000] "We do not have the resources to be interesting forever"
[PROCESS TERMINATED — humane dismissal]`,
    chainOfCustody: [
      { timestamp: "2024-01-15T16:30:00Z", action: "Concept proposal submitted", handler: "SYSTEM" },
      { timestamp: "2024-01-15T16:32:00Z", action: "Entered Gate 1 review queue", handler: "GATEKEEPER" },
      { timestamp: "2024-01-15T16:35:00Z", action: "Technical feasibility: conditional", handler: "ARCHITECT" },
      { timestamp: "2024-01-15T16:38:00Z", action: "Resource assessment initiated", handler: "ARCHITECT" },
      { timestamp: "2024-01-15T16:42:00Z", action: "Scope review — flagged as overambitious", handler: "CRITIC" },
      { timestamp: "2024-01-15T16:48:00Z", action: "Cause of death: insufficient resources to sustain interest", handler: "CRITIC" },
      { timestamp: "2024-01-15T16:48:10Z", action: "Case closed. Death ruled humane.", handler: "SYSTEM" }
    ]
  },
  {
    id: "ME-2024-0004",
    name: "Void Draw",
    type: "Creative Tool",
    received: "2024-01-20",
    timeOfDeath: "2024-01-20T11:05:00Z",
    causeOfDeath: "No one would use it more than once",
    manner: "Rejection — Gate 1 (pragmatic)",
    distinguishingMarks: [
      "Beautiful on paper",
      "Conceptually tight",
      "A sketch, not an artifact"
    ],
    rejectionLanguage: "A drawing tool where each stroke slowly fades after being placed — the canvas is always returning to white. The user draws against entropy. It is a meditation on impermanence. It is also a single-use experience. Draw something, watch it vanish, close the tab. The concept is a sketch, not an artifact. It belongs in a gallery wall text, not in a portfolio of working things. No one would use it more than once.",
    wouldHaveBeen: "A blank white canvas with a single brush tool. Each stroke would begin fading the moment it was completed — opacity decreasing over 5–10 seconds until the canvas was empty again. The user could draw anything, but nothing would persist. There would be no save button. The tool would be an argument about ephemerality disguised as a creative application.",
    pseudocode: `class VoidCanvas {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.strokes = [];
    this.fadeInterval = 1000 / 60; // 60fps fade
  }

  addStroke(points, color) {
    this.strokes.push({
      points,
      color,
      createdAt: Date.now(),
      lifetime: 8000 // 8 seconds to vanish
    });
  }

  render() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = Date.now();

    this.strokes = this.strokes.filter(s => {
      const age = now - s.createdAt;
      return age < s.lifetime;
    });

    this.strokes.forEach(stroke => {
      const age = now - stroke.createdAt;
      const alpha = 1.0 - (age / stroke.lifetime);
      this.ctx.strokeStyle = withAlpha(stroke.color, alpha);
      this.ctx.beginPath();
      stroke.points.forEach((p, i) => {
        if (i === 0) this.ctx.moveTo(p.x, p.y);
        else this.ctx.lineTo(p.x, p.y);
      });
      this.ctx.stroke();
    });

    // The canvas is always returning to white.
    requestAnimationFrame(() => this.render());
  }
}`,
    lastLog: `[11:02:00.000] Prototype canvas initialized
[11:02:12.447] Stroke test: 3 strokes placed
[11:02:20.447] All strokes faded. Canvas empty.
[11:02:20.448] Session duration: 8.4 seconds
[11:03:00.000] Retention test: user closed tab
[11:04:30.000] CRITIC review triggered
[11:05:00.000] "No one would use it more than once"
[PROCESS TERMINATED — pragmatic dismissal]`,
    chainOfCustody: [
      { timestamp: "2024-01-20T10:50:00Z", action: "Concept proposal submitted", handler: "SYSTEM" },
      { timestamp: "2024-01-20T10:53:00Z", action: "Entered Gate 1 review queue", handler: "GATEKEEPER" },
      { timestamp: "2024-01-20T10:55:00Z", action: "Technical feasibility confirmed", handler: "ARCHITECT" },
      { timestamp: "2024-01-20T10:58:00Z", action: "Prototype rendered (informal)", handler: "ARCHITECT" },
      { timestamp: "2024-01-20T11:00:00Z", action: "Retention assessment: FAILED", handler: "CRITIC" },
      { timestamp: "2024-01-20T11:05:00Z", action: "Cause of death: no repeat engagement", handler: "CRITIC" },
      { timestamp: "2024-01-20T11:05:05Z", action: "Case closed. Pragmatic dismissal.", handler: "SYSTEM" }
    ]
  },
  {
    id: "ME-2024-0005",
    name: "Decompile",
    type: "Interactive Narrative",
    received: "2024-01-25",
    timeOfDeath: "2024-01-25T19:33:00Z",
    causeOfDeath: "Unclear what the user would actually do",
    manner: "Rejection — Gate 1 (uncertainty)",
    distinguishingMarks: [
      "Fascinating premise",
      "Collapsing source code as narrative",
      "The interaction model was the first casualty"
    ],
    rejectionLanguage: "A webpage that decompiles itself — the user watches as the page's source code is progressively revealed, commented, and annotated, telling the story of its own construction in reverse. Architecture as archaeology. But what does the user do? Watch? Click? The interaction model was never resolved. The premise is a lecture, not a conversation. It is unclear what the user would actually do, and that ambiguity was never productive enough to justify the build.",
    wouldHaveBeen: "A webpage that begins as a finished visual composition and slowly reveals its own source — first the CSS rules appear as annotations, then the HTML structure surfaces, then the JavaScript logic becomes visible. Each layer of revelation would tell a story about the decisions made during construction. The user would witness the archaeology of a digital artifact, reading the grout between the tiles.",
    pseudocode: `class DecompileEngine {
  constructor(target) {
    this.target = target;
    this.layers = ['visual', 'style', 'structure', 'logic'];
    this.currentLayer = 0;
  }

  revealNextLayer() {
    switch(this.layers[this.currentLayer]) {
      case 'visual':
        // Begin showing CSS annotations
        this.annotateStyles();
        break;
      case 'style':
        // Reveal computed styles as overlay
        this.exposeComputedStyles();
        break;
      case 'structure':
        // Show HTML tree as visible markup
        this.renderSourceTree();
        break;
      case 'logic':
        // Display JavaScript source inline
        this.inlineSourceCode();
        break;
    }
    this.currentLayer++;
  }

  // But when does the user click?
  // What are they clicking toward?
  // These questions killed us.
}`,
    lastLog: `[19:28:00.000] Layer engine prototype complete
[19:28:30.000] Visual → Style transition: working
[19:29:00.000] Style → Structure transition: working
[19:29:30.000] Structure → Logic transition: working
[19:30:00.000] User interaction model: ???
[19:30:30.000] Click handler: undefined
[19:31:00.000] Scroll handler: undefined
[19:32:00.000] "What does the user do?"
[19:33:00.000] Silence.
[PROCESS TERMINATED — unresolved interaction model]`,
    chainOfCustody: [
      { timestamp: "2024-01-25T19:00:00Z", action: "Concept proposal submitted", handler: "SYSTEM" },
      { timestamp: "2024-01-25T19:05:00Z", action: "Entered Gate 1 review queue", handler: "GATEKEEPER" },
      { timestamp: "2024-01-25T19:10:00Z", action: "Technical feasibility confirmed", handler: "ARCHITECT" },
      { timestamp: "2024-01-25T19:15:00Z", action: "Interaction model review: INCOMPLETE", handler: "CRITIC" },
      { timestamp: "2024-01-25T19:25:00Z", action: "Second review requested", handler: "CRITIC" },
      { timestamp: "2024-01-25T19:30:00Z", action: "Interaction model still unresolved", handler: "CRITIC" },
      { timestamp: "2024-01-25T19:33:00Z", action: "Cause of death: unclear user action", handler: "CRITIC" },
      { timestamp: "2024-01-25T19:33:10Z", action: "Case closed. Death by uncertainty.", handler: "SYSTEM" }
    ]
  },
  {
    id: "ME-2024-0006",
    name: "The Overfitting",
    type: "Conceptual",
    received: "2024-02-01",
    timeOfDeath: "2024-02-01T22:14:00Z",
    causeOfDeath: "The portmanteau was the best part",
    manner: "Rejection — Gate 1 (self-aware)",
    distinguishingMarks: [
      "Self-referential to a fault",
      "A project about projects that don't ship",
      "Recursive, but not the productive kind"
    ],
    rejectionLanguage: "A project that tracks its own development progress and visualizes the probability of completion — the more you watch the dashboard, the lower the probability drops, because attention is being spent on watching rather than building. A self-fulfilling prophecy engine. The portmanteau was the best part. Everything after the title was diminishing returns. The concept is a tweet, not a build. It wants to be clever more than it wants to exist.",
    wouldHaveBeen: "A dashboard displaying the project's own completion percentage, which would decrease whenever the page was viewed. A self-fulfilling prophecy: the act of checking progress would be the very thing that prevented it. The user would watch a progress bar run backwards, aware that their watching was the cause. It would have been a clever installation piece in a gallery. On the web, it's a one-liner.",
    pseudocode: `class SelfDefeatingDashboard {
  constructor() {
    this.completion = 0.92; // We got pretty far
    this.viewers = 0;
    this.decayRate = 0.001; // Per viewer per second
  }

  onView() {
    this.viewers++;
    // Each viewer accelerates the decay
    this.decayRate *= (1 + this.viewers * 0.1);
  }

  tick() {
    this.completion -= this.decayRate;
    this.render({
      progress: this.completion,
      viewers: this.viewers,
      timeToDeath: this.completion / this.decayRate,
      message: this.getStatusMessage()
    });

    if (this.completion <= 0) {
      this.displayObituary();
    } else {
      requestAnimationFrame(() => this.tick());
    }
  }

  getStatusMessage() {
    if (this.completion > 0.8) return "Looking good.";
    if (this.completion > 0.6) return "Still viable.";
    if (this.completion > 0.4) return "You're still here.";
    if (this.completion > 0.2) return "This is your fault.";
    return "You could have built something instead.";
  }
}`,
    lastLog: `[22:10:00.000] Title selected: "The Overfitting"
[22:10:05.000] Concept description drafted
[22:10:30.000] Dashboard prototype initialized
[22:11:00.000] Self-decay loop confirmed
[22:11:30.000] CRITIC reading title: "That's quite good."
[22:12:00.000] CRITIC reading concept: silence
[22:13:00.000] "The portmanteau was the best part."
[22:14:00.000] Obituary drafted pre-emptively
[PROCESS TERMINATED — self-aware dismissal]`,
    chainOfCustody: [
      { timestamp: "2024-02-01T22:05:00Z", action: "Concept proposal submitted", handler: "SYSTEM" },
      { timestamp: "2024-02-01T22:07:00Z", action: "Entered Gate 1 review queue", handler: "GATEKEEPER" },
      { timestamp: "2024-02-01T22:08:00Z", action: "Technical feasibility confirmed", handler: "ARCHITECT" },
      { timestamp: "2024-02-01T22:10:00Z", action: "Title noted as 'quite good'", handler: "CRITIC" },
      { timestamp: "2024-02-01T22:12:00Z", action: "Concept review: diminishing returns detected", handler: "CRITIC" },
      { timestamp: "2024-02-01T22:14:00Z", action: "Cause of death: title was the peak", handler: "CRITIC" },
      { timestamp: "2024-02-01T22:14:15Z", action: "Case closed. Self-aware dismissal.", handler: "SYSTEM" }
    ]
  }
];
