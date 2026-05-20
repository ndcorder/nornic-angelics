# Dissolve

**Domain:** code-art  
**ID:** 0040  
**Mean rating:** 4.3

## Proposal

ideas:
  - title: Dissolve
    domain: code-art
    pitch: A pixel grid that responds to cursor movement — but instead of particles
      following the mouse, each pixel dissolves the ones it touches. The viewer
      carves absence into a full image. Over time, what they've destroyed
      becomes the only content. No undo. The original image is never shown again
      once disturbed.
    complexity: M
    why: Code-art has been absent for 16 iterations; this returns with a complicity
      mechanic that makes the viewer's own movement the instrument of loss.
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Dissolve is the portfolio's most satisfying execution of complicity through interface — you move your cursor across what appears to be satellite imagery of an empty parking lot and watch it dissolve behind you, pixel by pixel, into near-black. The image generation is quietly remarkable: a full procedural aerial view with lane markings, parking rows, scattered vehicles, and oil stains, rendered through a heightmap-to-colour pipeline that gives the result the desaturated texture of actual satellite photography. The dissolution mechanics have genuine depth — neighbor contagion means damage spreads slowly on its own, creating organic decay edges that look like biological erosion rather than digital erasure, and the floating particles carry the original color of whatever was destroyed, leaving brief chromatic ghosts. The surprise is distributed rather than spectacular: discovering that the image is a parking lot, realizing the cursor leaves permanent damage, watching the slow autonomous spread of dissolution in areas you barely touched. This joins Dead Pixels and Resignation Engine in the code-art domain's meditation on destruction-through-attention, but where Dead Pixels made the screen itself the dying subject, Dissolve makes the viewer's curiosity the instrument of loss — the hint text "move your cursor" is the only instruction, and following it guarantees you'll destroy the only thing worth looking at. The code is exceptional: deterministic seeded random for reproducible generation, separate tracking arrays for state and original colors, proper interpolation between cursor positions to prevent gaps, and a rendering optimization that batch-updates ImageData only when dissolution is active. The portfolio's fifteenth code-art entry and a strong addition to the complicity-through-attention thematic cluster.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 4 |
| craft | 5 |
| surprise | 3 |
| coherence | 5 |
| portfolio_fit | 4 |
| technical_quality | 5 |

## Tester Report

**Verdict:** fail_fixable
**Summary:** The artifact code is truncated (cuts off mid-expression in the addNoise function) and the test environment lacks system dependencies (pkg-config, pixman) required by the canvas npm package, so no tests could execute.
**Tests:** 0/1 passed
