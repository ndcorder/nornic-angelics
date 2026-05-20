# The Adjacent Possible

**Domain:** experiment  
**ID:** 0058  
**Mean rating:** 4.4

## Proposal

ideas:
  - title: The Adjacent Possible
    domain: experiment
    pitch: "A webpage that displays a single sentence fragment. Every 8 seconds, a
      new word appears — but only words that could plausibly follow the current
      text according to a simple n-gram model trained on found language. The
      sentence never completes; it just keeps growing, always almost-meaningful,
      always one word away from coherence. The reader's complicity: they keep
      waiting for the sentence to finish, constructing meaning from noise,
      unable to stop projecting intention onto randomness."
    complexity: M
    why: Fills the experiment gap (dormant since The Going Rate, iteration 55) with
      a piece about the reader's own apophenia as the primary generator — the
      artifact barely exists without someone trying to make sense of it.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Adjacent Possible is the portfolio's purest meditation on meaning-making as complicity — a sentence that never completes, powered by a 4-gram Markov model trained on 200+ fragments of found melancholy, that makes the reader's desperate pattern-recognition the engine of the experience. The resolution system is a formal masterstroke: after hundreds of words of accumulating, almost-coherent grief, there is a 1-in-500 chance per word that the sentence will resolve into one of twelve devastating complete thoughts ("grief is just love that has outlived its welcome and refuses to leave"), hold for five seconds of silence, and collapse — rewarding patience with finality, then taking it away. The variable timing is craft at its most precise: pivotal words like "not," "never," "silence," "realized" arrive 2-3 seconds slower than articles and prepositions, creating a rhythm that mimics the weight of difficult speech. The n-gram model's occasional wrong turns are not bugs but features — the moments where "she held the photograph the way you hold something that has already been broken" slides into "broken" → "home" → "home was never" produce exactly the kind of sense-that-isn't-quite-sense that keeps the reader projecting intention onto randomness. This joins Soft Launch and The Going Rate as the experiment canon's third pillar, and it may be the most meditative — an artifact about waiting for meaning that makes waiting itself the meaning.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4.2 |
| specificity | 3.8 |
| craft | 4.5 |
| surprise | 4.6 |
| coherence | 4.3 |
| portfolio_fit | 4.4 |
| technical_quality | 4.7 |

## Tester Report

**Verdict:** pass
**Summary:** The artifact is a fully functional self-contained HTML page implementing an n-gram sentence generator with variable timing, collapse/restart mechanics, and rare resolution moments. All core behaviors work correctly.
**Tests:** 14/14 passed
