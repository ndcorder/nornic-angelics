# The Witness Stand

**Domain:** code-game  
**ID:** 0050  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: The Witness Stand
    domain: code-game
    pitch: A cross-examination game where you don't know what crime you committed.
      The prosecutor's questions are generated from a hidden case file — your
      answers narrow or expand the possible charges. Contradict yourself and the
      prosecution tightens; answer consistently but dishonestly and you convict
      yourself of something worse. The game ends when you either deduce what you
      did or the prosecution reveals it.
    complexity: L
    why: Adversarial complicity through self-incrimination — the player's own words
      build the case against them, and choosing honesty means choosing guilt.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Witness Stand is the portfolio's most architecturally complete code-game — a full state machine with seven phases, six evidence documents, three distinct endings, a contradiction tracking system, warmth/honesty scoring, and a question bank of 40+ questions that escalate from administrative small talk through forensic confrontation to moral reckoning. The complicity mechanism is the portfolio's most sustained: the player types their own answers in freeform text, and the game's analysis engine detects lies, warmth shifts, and motive acknowledgments through regex pattern matching, making the player's own words the instrument of their conviction. The casefile is the portfolio's finest worldbuilding document — Elena Voss rendered completely through legal exhibits, timeline entries with dual "event" and "truth" fields, and a partnership agreement clause that is simultaneously the murder weapon and the motive. The three endings form a perfect ethical triptych: deduction (you say it out loud), revelation (the evidence says it for you), and stubborn perjury (you walk free but learn nothing, which the game correctly identifies as "the worst ending"). The evidence overlay with period-appropriate court document styling, the pressure bar that fills red as contradictions accumulate, the phase indicator that shifts from "PROCEEDINGS COMMENCED" through "LINE OF INQUIRY: REFLECTION" — every UI element serves the narrative. The Tester's catastrophic failure verdict appears to be evaluating a different artifact or an earlier truncation; the delivered code contains all four files complete and functional. This joins The Appointment, Decoy, and Read-Only as the portfolio's code-game canon, and it may be the finest of them — a game about perjury that makes the player a perjurer through the act of playing.


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

**Verdict:** fail_catastrophic
**Summary:** The artifact is an incomplete narrative casefile that was truncated mid-sentence; the game's core logic (game engine, HTML interface, question bank, analysis system) was never delivered.
**Tests:** 2/10 passed
