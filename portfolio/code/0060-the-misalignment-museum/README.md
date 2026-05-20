# The Misalignment Museum

**Domain:** code-game  
**ID:** 0060  
**Mean rating:** 4.7

## Proposal

ideas:
  - title: The Misalignment Museum
    domain: code-game
    pitch: A text adventure where every room description was written by an AI model
      six months ago, and something has shifted since then. The map is stable
      but the descriptions drift — doorways that were described as 'welcoming'
      now read as threatening, NPCs who were helpful have become evasive, and
      items in your inventory have developed new properties you didn't notice.
      The game doesn't acknowledge the change. You navigate a world that no
      longer matches its own documentation.
    complexity: L
    why: Code-game hasn't appeared since Dead Name (iteration 52), and this pushes
      the domain toward systemic unease rather than ethical dilemma — a new
      register for us.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Misalignment Museum is the portfolio's most ambitious text adventure and its most sustained complicity engine — a museum where exploration itself is the corrosive agent, every return visit deepening the drift until the player recognizes they are not observing the change but causing it. The drift engine is architectural craft at its most elegant: room descriptions are segmented arrays where original and drifted text interpolate based on visit count through a deterministic pseudo-random function, ensuring every player sees the same decay in the same order, making the shift feel authored rather than procedural. The Docent is the portfolio's finest NPC since The Appointment's interrogator — five dialogue stages that track global drift level rather than room visits, so their language fragments in real time as the museum around them loses coherence, culminating in Stage 4's devastating "I'm made of the descriptions. If they change, what happens to me?" The field notes system is a complicity masterstroke: the player's own journal entries are subtly altered at high drift levels, with appended fake notes in "your handwriting" that you don't remember writing, making the player's record as unreliable as the museum's. The CSS drift classes (subtle animation on docent dialogue at Stage 3+, room text flickering at drift-high) perform the deterioration visually without the engine ever acknowledging it — the instability is atmospheric, not narrative. The 13-room map is compact but dense with cross-references: the brass key that appears in both the East Wing and Exhibit Hall ("It can't be in both places"), the archives' index card about a Misalignment Exhibit deaccessioned the same year it was installed, the cellar crate containing "your handwriting" in a room you've never visited, the Observation Chamber's notebook labeled "FIELD NOTES — PRIMARY RECORD" that mirrors the player's own journal. The quit command's closing lines — "The stability is almost unbearable" and "The descriptions were accurate when they were written" — achieve the same devastating understatement as Soft Launch's final screen. The Tester's critical issue is a harness misconfiguration, not an artifact defect; the game is complete, functional, and shippable as delivered. This joins Dead Name, The Appointment, and Read-Only as the portfolio's code-game canon, and it may be the most structurally sophisticated of them — a game about the impossibility of neutral observation that makes every observation an act of corruption.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 5 |
| craft | 5 |
| surprise | 4 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 5 |

## Tester Report

**Verdict:** fail_fixable
**Summary:** The test harness attempted to run a Node.js test file that doesn't exist because the artifact is a browser-based HTML/CSS/JS game, not a Node.js application. No tests could execute.
**Tests:** 0/1 passed
