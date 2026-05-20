# Recitative

**Domain:** music  
**ID:** 0046  
**Mean rating:** 4.6

## Proposal

ideas:
  - title: Recitative
    domain: music
    pitch: A piece for two voices that never sound simultaneously. Each voice's
      melodic contours shadow the other's silences — when one sings, the shape
      of its phrase describes the rest the other is taking. The listener must
      mentally construct the phantom harmonies that would exist if both sang at
      once. By the final section, the voices begin overlapping for the first
      time, and the listener realizes the harmonies they'd been imagining were
      wrong.
    complexity: L
    why: Music has been dormant for 17 iterations; this extends 'absence as
      presence' into the one domain where silence is already a compositional
      tool, and forces the listener into active harmonic completion — complicity
      through imagined sound.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Recitative is the portfolio's most accomplished music artifact and its most rigorous execution of a single formal constraint — two voices that never sound simultaneously until they do, revealing that the harmonies the listener constructed in silence were always wrong. The Web Audio API implementation in index.html is impeccable: gain envelopes with attack/release ramps prevent every click, the convolution reverb's power-decay impulse response creates genuine spatial depth, and the three-section architecture (diatonic alternation → fragmentary dissolution → chromatic overlap) unfolds with mechanical precision. The specificity of the compositional choices earns real emotional weight — Voice A's ascending arches that "return emptier," Voice B's mirror at the third below, the chromatic crossing in Section 3 where A climbs E4→D5 while B descends Bb3→C3 "like strangers in a hallway." The final chord stacking all 22 pitches at sawtooth gain 0.008 is the correct ending: a frozen wrongness that makes the listener hear what they imagined and what actually exists simultaneously, the gap between them being the piece's true subject. The 30-second background transition to dark red during overlap is subtle visual staging that never competes with the audio. The recitative.js companion is a Strudel.js sketch that can't execute standalone — the Tester correctly flags this — but index.html is the artifact, and it is complete, self-contained, and browser-compatible down to webkitAudioContext fallbacks. Music returns after 17 iterations dormant, and it returns at the domain's ceiling, joining False Positive and Phase Space with a piece that earns its 5+ minute duration through structural inevitability rather than duration for its own sake. The detuning of +4/-5 cents in Section 3 is a one-line masterstroke — just enough microtonal drift to make the overlap feel sick without making it feel random.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 5 |
| craft | 5 |
| surprise | 4 |
| coherence | 5 |
| portfolio_fit | 4 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** The index.html is a complete, self-contained Web Audio API implementation that faithfully realizes the proposal's three-section structure with alternating voices, fragmentary dissolution, chromatic overlap, and a final dissonant chord. The recitative.js is a companion implementation with a dependency issue but does not affect the primary artifact.
**Tests:** 11/12 passed
