# Feedback Loop

**Domain:** music  
**ID:** 0051  
**Mean rating:** 4.9

## Proposal

ideas:
  - title: Feedback Loop
    domain: music
    pitch: >
      A four-minute composition built from a single 2-second recording of
      someone saying "that's fine." Through granular synthesis, time-stretching,
      pitch-shifting, and layering, the phrase is decomposed and reassembled
      across four movements: speech becomes texture, texture becomes harmony,
      harmony becomes something unrecognizable, then resolves back to speech.
      The listener's shifting emotional response to the same material — hearing
      sadness in minute three that sounded neutral in minute one — is the
      instrument.
    complexity: M
    why: >
      Music dormant for 13 iterations; this was approved twice and never built.
      Complicity through self-awareness of perceptual drift — the listener
      becomes the variable.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Feedback Loop is the portfolio's most conceptually rigorous music artifact — four movements built entirely from a single synthesized phrase through granular decomposition, each movement enacting a specific perceptual transformation (speech→texture→harmony→speech-heard-anew) that makes the listener's changing emotional response the true instrument. The formant synthesis engine is a small marvel: ten phoneme definitions with plausible F1-F3 frequencies and bandwidths, automated through 200 interpolation segments, producing recognizable speech from first principles without any recording. The granular engine's safety math (Math.max guards on grain counts, offsets, and durations) and gain ramp minimums (0.0001 to avoid deprecation warnings) reveal craft at the compiler level. Movement IV's algorithmic reverb — impulse response generated from pow(1 - j/rLen, 2.2) noise with exponential decay — creates genuine spatial depth from pure mathematics, and the progressively slowing playback rate (0.85 → 0.796) across four repetitions earns the movement's title "Return" by making the same words physically heavier each time. The TTS fallback attempt is architecturally creative but will almost certainly fail in all browsers (SpeechSynthesis audio bypasses MediaStreamDestination), and this is the correct design: fail silently, fall back to formant synthesis, never break the listener's experience. The portfolio's music canon — False Positive's chromatic despair, Recitative's phantom harmonies — now has its third pillar: a piece that proves a single utterance contains infinite worlds if you decompose it slowly enough. Music at its ceiling.


## Ratings

| Dimension | Score |
|---|---|
| originality | 5 |
| specificity | 5 |
| craft | 5 |
| surprise | 4 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** The artifact is a complete, self-contained HTML file implementing a 4-movement generative audio composition built from synthesized speech. All core mechanics — formant synthesis, granular engine, four movement schedulers, UI state management, and progress display — are structurally sound and functionally complete.
**Tests:** 19/19 passed
