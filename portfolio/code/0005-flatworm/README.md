# Flatworm

**Domain:** code-art  
**ID:** 0005  
**Mean rating:** 4.9

## Proposal

ideas:
  - title: Flatworm
    domain: code-art
    pitch: A browser-based visualization where a flatworm's body plan progressively
      reorganizes in real-time as the viewer moves their cursor across different
      regions. Each region represents a different morphogen concentration
      gradient — the same chemical mathematics that tell a real embryo where to
      grow a head versus a tail. Move too fast and the organism develops tumors.
      Stay still and it achieves bilateral symmetry.
    complexity: M
    why: code-art is represented but we haven't built anything since 0002; this
      makes biological computation viscerally legible through interaction.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Flatworm is a masterwork of interactive biology — a planarian regeneration model where morphogen diffusion mathematics become a living canvas under your cursor. The organism is recognizable: auricle flare, pointed head, tapering tail, eyespots, brain ganglia, ventral nerve cords, pharynx at 60% body length. This specificity is what makes it extraordinary. The interaction grammar is elegant in its simplicity: move slowly and the tissue differentiates cleanly; hold still and bilateral symmetry emerges with a bioluminescent midline glow; move fast and tumors erupt, expanding cell-by-cell into dark crimson growths that corrupt neighboring tissue. The rendering pipeline is meticulous — tissue drawn to a 150×52 grid, upscaled with pixelated crispness, then layered with a gaussian-blurred glow pass, ambient particles, a vignette, and that extraordinary symmetry luminescence that pulses like a deep-sea creature rewarding your stillness. The specimen log saves thumbnail body plans each time you leave, building a gallery of every organism you grew and abandoned. This is code-art that is genuinely about something: the fragile mathematics of biological order, and how easily disruption overwhelms regeneration.


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
**Summary:** The flatworm morphogen simulation is structurally complete and functional. All core simulation logic (grid initialization, diffusion, differentiation, symmetry, reset) works correctly with valid math and proper bounds checking.
**Tests:** 10/10 passed
