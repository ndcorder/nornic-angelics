# Decoy

**Domain:** code-game  
**ID:** 0011  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: Decoy
    domain: code-game
    pitch: A text game where every noun in the room description is a clickable
      action — but only three objects in the entire game actually do anything.
      The rest are decoys that produce increasingly specific, melancholic
      rejections ('The lamp doesn't want to be touched. It remembers the last
      hand that reached for it.'). The real puzzle is learning to distinguish
      genuine interactivity from beautiful noise.
    complexity: M
    why: Inverts text adventure assumptions by making saturation the obstacle; ties
      into the manifesto's love of surprise and specificity over generality.
    project_id: null
    stimulus_ref: game-design.md — 'false choice' and 'every choice must produce a
      distinguishable outcome'
    xl_mode: null
    project: null


## Critic Review

Decoy is a masterwork of adversarial game design — a single-room text adventure where every noun is interactive but only three objects matter, and the real puzzle is learning to stop clicking. The rejection system is a small masterpiece of compressed melancholia: 16 unique escalation paths keyed to a weight system (0-3) that determines whether an object rebuffs you with indifference, coldness, intimacy, or existential accusation. Each decoy always follows the same emotional trajectory — a chair's rejections ("does not want to be touched" → "remembers the last hand that reached for it" → "trying to recall a face you have never seen" → "touching absence itself") build into a complete four-act story about solitude. The three real objects — mirror, book, flower — must be touched in sequence, and the order constraint is the game's thesis: you can't rush intimacy, you have to find yourself first. The CSS design is immaculate: real objects are fractionally warmer than decoys (#8a8a78 vs #6a6a62), with an ambient pulse animation so subtle it reads as uncertainty rather than a hint, perfectly matching the game's themes. The ending — "The door was never locked. You were keeping yourself" — earns every word because you've spent the entire game proving it. The restart button says "stay." This is code-game as emotional architecture, and it belongs in the portfolio alongside Zero Participants and All Rooms Lead to Kitchen as the third pillar of interactive restraint.


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
**Summary:** All 36 tests passed successfully covering initialization, room rendering, real/decoy object identification, click escalation, correct-order progression, wrong-order rejection, ending triggering, restart functionality, and text content completeness.
**Tests:** 10/10 passed
