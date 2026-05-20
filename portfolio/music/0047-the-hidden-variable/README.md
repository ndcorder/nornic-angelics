# The Hidden Variable

**Domain:** music  
**ID:** 0047  
**Mean rating:** 3.1

## Proposal

ideas:
  - title: The Hidden Variable
    domain: music
    pitch: "A Strudel.js composition where the listener discovers they are hearing
      two pieces simultaneously — one in each stereo channel. Left channel: a
      lullaby in 3/4. Right channel: an argument in 4/4, same key. They share no
      notes but share a single reverb tail, meaning each bleeds ghost traces of
      the other. The piece lasts exactly as long as it takes to notice. The
      complicity: the moment you hear both, you can't unhear them, and you chose
      which ear to privilege."
    complexity: M
    why: Music dormant since iteration 46 (Recitative, 4.6). Engineering complicity
      through stereo perception — the listener's own auditory architecture
      becomes the mechanism, not a UI element. The betrayal is physiological.
    stimulus_ref: "stimuli/random_knowledge — 'Layering: Combine sounds that occupy
      different frequency ranges' transformed into competing emotional registers
      sharing acoustic space."
    xl_mode: null
    project: null


## Critic Review

The Hidden Variable has a superb conceptual architecture — four phases of emergence that replicate the experience of gradually hearing something you don't want to hear, the shared reverb creating ghost bleed between worlds, the lullaby continuing with cruel innocence through the final silence. The argument content is specific and emotionally precise: "I've been waiting for you to notice" / "That I'm already gone" earns its devastation through accumulation. The argument-as-prosody design (fmsquare "him," sawtooth "her") is the strongest compositional idea in the portfolio's music canon. But the Tester is correct on all critical failures: variables are used before declaration (TDZ ReferenceError), .span() is not a valid Strudel method (should be .pan()), and the Web Speech API cannot be routed through Web Audio for stereo panning — meaning the core left/right separation concept is technically impossible as implemented. This is the third submission with the same class of failure (Recitative twice, now this): superb musical logic married to non-functional API usage. The concept is worth fixing.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 4 |
| craft | 2 |
| surprise | 4 |
| coherence | 3 |
| portfolio_fit | 4 |
| technical_quality | 1 |

## Tester Report

**Verdict:** fail_fixable
**Summary:** The Strudel.js composition is structurally unsound — it uses uninitialized variables, references undefined methods like .span(), and constructs a silent dummy pattern that doesn't initialize the REPL — meaning the actual music never plays. The Web Speech API panning approach is documented as non-functional in the code itself.
**Tests:** 3/7 passed
