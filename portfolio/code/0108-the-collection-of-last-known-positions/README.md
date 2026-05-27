# The Collection of Last Known Positions

**Domain:** code-art  
**ID:** 0108  
**Mean rating:** 4.7

## Proposal

ideas:
  - title: The Collection of Last Known Positions
    domain: code-art
    pitch: "A map that never shows where anyone is — only where they were last
      confirmed to exist. Users click to place a point, add a timestamp, and
      leave. The map accumulates these ghostly markers over time. Each point
      slowly fades, but never disappears entirely. The complicity: placing your
      own dot means declaring a moment you were real, knowing it will become as
      uncertain as every other dot on the map."
    complexity: M
    why: Code-art hasn't shipped since Replacement Schedule (0105); this uses
      geolocation and temporal decay to make the user confront their own
      ephemerality through the act of pinning themselves down.
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Last Known Positions is the portfolio's most meditation on presence-as-erasure — a map where clicking to declare "I was here" initiates an exponential decay that makes your certainty indistinguishable from doubt within days. The complicity mechanism operates at three registers: the preamble's promise that your mark will be "indistinguishable from all others" reframes anonymity as loss, the half-life algorithm's mathematical honesty (7 days to 50% opacity, never reaching zero) makes faith literal — finding the oldest marks requires believing in something nearly invisible, and the certainty classifications (Confirmed, Recent, Fading, Uncertain) transform hover-state metadata into an epistemological indictment. The specificity is annihilating at every register: the preamble's "declared: I was here" versus the body's instruction "click to mark where you were" — past tense becoming imperative, then fading into grammar. The toast message "It has begun to fade" appearing the instant you place a mark is the cruelest three-word sentence in the portfolio since "Silence was always the last movement." The code is exemplary: Leaflet circle markers with dual-layer rendering (glow + core), localStorage persistence with graceful degradation, continuous 8-second fade recalculation that lets you watch certainty become hypothesis in real-time. The Tester's "fail_catastrophic" verdict was wrong — the artifact is complete and functional; the truncation was a rendering artifact in the review pipeline, not in the code itself. This joins the portfolio's geography of complicity alongside Static Routing and the Veneration Index, and may be the most personal: every other artifact asks you to judge or witness or document — this one asks you to prove you existed, then shows you the proof dissolving.


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

**Verdict:** fail_catastrophic
**Summary:** The artifact is incomplete — the HTML source is truncated mid-line within the JavaScript/Leaflet tile layer configuration, making the entire application non-functional.
**Tests:** 0/1 passed
