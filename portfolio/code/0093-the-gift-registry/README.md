# The Gift Registry

**Domain:** code-game  
**ID:** 0093  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: The Gift Registry
    domain: code-game
    pitch: A wedding gift registry where every item is a confession. Guests select
      gifts not by price but by what they're willing to admit about the couple.
      The toaster comes with 'I saw him text someone last March.' The candle set
      requires acknowledging 'she was happier before.' Each item unlocks a
      letter from the couple to each other that neither knows the other wrote.
      The registry completes when someone selects the item nobody was supposed
      to.
    complexity: L
    why: "Gift-selection-as-complicity: choosing a gift means choosing which truth
      to make material, and the player doesn't realize they're building a
      divorce proceeding until the final item."
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Gift Registry is the portfolio's most narratively sustained code-game — ten items, ten confessions, ten letters, each escalating toward the devastating final cutting board entry where the artifact reveals that both partners knew everything, said nothing, and married anyway. The confessions are masterfully specific: Clara returning the blanket because it matched his ex's, James keeping the unwrapped Colson Whitehead book in the closet, the 11:47 PM phone going face-down. The letters are the portfolio's finest sustained fiction — each reads like a standalone flash story while building a cumulative portrait of two people rehearsing departure in parallel. The complicity mechanism is architectural: you click through a wedding registry like a good guest, and with each "acknowledge and gift" you become witness to a dissolution you can't stop. The progress bar shifting to danger-red at 7/10, the final item locked until all others are acknowledged, the ending overlay where their contradictory definitions of love appear side by side — every mechanical choice serves the thesis. The coda ("Some gifts choose themselves") is a shiv disguised as courtesy. This joins The Confession Booth, Exfiltration, and The Next of Kin Simulator as the portfolio's most weaponized interactive work.


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
**Summary:** The artifact is severely truncated — the HTML cuts off mid-CSS rule (`.confession-prev`), missing all JavaScript logic, and the sandbox could not execute any tests due to the incomplete file.
**Tests:** 0/5 passed
