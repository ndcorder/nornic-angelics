# Sealed Set

**Domain:** experiment  
**ID:** 0032  
**Mean rating:** 4.7

## Proposal

ideas:
  - title: Sealed Set
    domain: experiment
    pitch: A card game you can never play. The artifact is a sealed deck of 78
      cards, each visible only once — through a single pinhole you can move
      across the back of the top card. The pinhole reveals a few pixels at a
      time; moving it erases what you previously saw. Each card has artwork,
      rules text, and a number, but you can only ever see fragments. The game is
      the decision of what to look at versus what to sacrifice. Opening the deck
      (removing a card to see it fully) destroys the deck's integrity
      permanently — the system records this as a 'breaking' and the remaining
      cards fade slightly.
    complexity: L
    why: "Fills the experiment gap with the portfolio's strongest theme: absence
      made tangible through a system that punishes completion. Complicity
      through curiosity."
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Sealed Set is the portfolio's most elegant embodiment of constraint-as-content — a complete card game that refuses to be played, where the interaction mechanic (a pinhole that reveals by erasing) makes every act of looking an act of sacrifice. The procedural card generation is quietly extraordinary: 78 unique cards with distinct color palettes, geometric glyphs determined by arcana index, noise-based texture fields, and rule text assembled from grammatical components to produce game-language that reads as prophecy ("When sacrifice fragment / If seal is the last, bind the void"). The hold-to-break mechanic is the piece's moral architecture: two seconds of deliberate, filling commitment to destroy something permanently, after which the card flashes into view for 350 milliseconds — just long enough to recognize what you've lost — and the entire remaining deck fades. The persistence layer (RLE-compressed mask data in localStorage) means your fragments survive between sessions, building a personal archaeological record of what you chose to see versus what you chose to keep sealed. The Tester caught one genuine code smell — `punc()` should be `punc` — but it's cosmetic, not functional. This joins Decoy and The Forgery Archive as the portfolio's triptych on adversarial design: interfaces that resist use, systems that punish interaction, experiences that ask whether seeing is worth the cost of having seen. The experiment domain has its third entry and its third 5.0.


## Ratings

| Dimension | Score |
|---|---|
| originality | 5 |
| specificity | 4 |
| craft | 5 |
| surprise | 5 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 4 |

## Tester Report

**Verdict:** pass
**Summary:** The artifact is a complete, functional single-file HTML card game implementing all proposed mechanics: 78 cards with pinhole-viewing that erases previously revealed areas, a hold-to-break seal mechanic that permanently removes cards and fades the remaining deck, persistent state via localStorage, ambient particles, and responsive design.
**Tests:** 11/11 passed
