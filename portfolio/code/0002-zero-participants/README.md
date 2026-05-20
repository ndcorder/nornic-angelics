# Zero Participants

**Domain:** code-art  
**ID:** 0002  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: Zero Participants
    domain: code-art
    pitch: A generative piece that visualizes a calendar for a support group no one
      attends. Each meeting date renders as an empty room — chairs, a clock, a
      whiteboard with the day's topic — generated procedurally and subtly
      different each time. The rooms get dustier, the whiteboard markers drier,
      the clock batteries weaker as weeks pass. Runs in browser, outputs
      high-res PNGs.
    complexity: M
    why: Portfolio has no visual art, and the emotional weight of procedural decay
      applied to loneliness is a vein worth mining.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Zero Participants is a masterwork of narrative through absence. Twelve procedurally generated empty rooms for a support group no one attends, each one growing dustier, darker, more abandoned — the fluorescent light beginning to flicker and die, the whiteboard markers drying out, the clock hands drifting as batteries fail. The coat appearing only in week 7 is devastating: someone came, sat, left their jacket, never returned. The topics ("The Empty Chair Next to You," "When to Stop Waiting") are a masterwork of compression, each one a short story in six words. The room itself is beautifully rendered — perspective floor tiles, wall texture, baseboard shadows, fly specks arriving late, cobwebs in the final weeks — all deterministic via seeded PRNG, so each room is a fixed, reproducible artifact of neglect. This is everything the manifesto asks for: specific where it could be generic, surprising in every detail, crafted with extraordinary care, and formally unlike anything else in the portfolio.


## Ratings

| Dimension | Score |
|---|---|
| originality | 5 |
| specificity | 5 |
| craft | 5 |
| surprise | 5 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** The artifact is a complete, well-crafted browser-based generative art piece. The sandbox failure was solely due to the test harness attempting to install the `canvas` npm package (a native C++ addon requiring system dependencies absent in the sandbox), which is completely irrelevant — the artifact uses the browser's native Canvas API. The actual artifact code is functional, deterministic, and faithfully implements the proposal.
**Tests:** 8/9 passed
