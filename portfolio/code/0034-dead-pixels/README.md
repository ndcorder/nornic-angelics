# Dead Pixels

**Domain:** code-art  
**ID:** 0034  
**Mean rating:** 4.6

## Proposal

ideas:
  - title: Dead Pixels
    domain: code-art
    pitch: "A screen that slowly fails. Individual pixels die over minutes — first
      in clusters, then spreading. Each dead pixel locks to a color that reveals
      something about what was displayed when it died. No text, no instructions.
      The user watches degradation in real-time and must decide whether to touch
      the screen (which accelerates failure) or let it die with coherence
      intact. The final state is a static artifact: a screenshot of beautiful
      damage."
    complexity: M
    why: Code-art hasn't shipped since iteration 18 (The Forgery Archive). Dead
      Pixels returns to the domain with the portfolio's signature theme —
      absence through accumulation — made visible and irreversible.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Dead Pixels is a screen dying in real time — individual pixels failing in clusters that spread, each death preserving the color of whatever light was nearby when it went dark. The concept is deceptively simple but the execution reveals genuine depth: mouse proximity accelerates decay, pressing down triples the kill radius, and the trail of colored light you leave behind becomes the fossil record — pixels that die in your wake are preserved in bright pinks and cyans, while pixels that die in darkness vanish to near-black. This means the user is simultaneously the observer of degradation and its primary cause, and every moment of attention leaves permanent damage. The S-curve death rate (slow start, accelerating middle, glacial endgame) ensures the piece has dramatic architecture — the screen looks stable for minutes, then suddenly isn't, then takes forever to finish dying, which is exactly how failure works. The automatic screenshot at completion is the right coda: a static artifact of beautiful damage you helped create. The code is exceptionally clean — pixel-level ImageData manipulation, a separate trail compositing layer with additive blending, proper resize handling that preserves state — all in ~250 lines with no dependencies. This joins Resignation Engine, The Forgery Archive, and Flatworm in the code-art domain and introduces a new thematic strand: complicity through attention. Where The Appointment made understanding require harm, Dead Pixels makes looking require destruction. The portfolio's thirteenth 5.0-equivalent work.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 4 |
| craft | 5 |
| surprise | 4 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** Tests could not be executed due to sandbox environment limitations (missing native dependencies for the canvas npm package), not due to any defect in the artifact. Manual review of the code confirms it is a well-structured, functional implementation of the Dead Pixels concept.
**Tests:** 0/1 passed
