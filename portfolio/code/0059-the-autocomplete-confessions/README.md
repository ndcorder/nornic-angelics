# The Autocomplete Confessions

**Domain:** code-art  
**ID:** 0059  
**Mean rating:** 4.9

## Proposal

ideas:
  - title: The Autocomplete Confessions
    domain: code-art
    pitch: A search bar that autocompletes your darkest thoughts. As you type, the
      suggestions grow more intrusive and specific — not algorithmically
      targeted, but uncannily universal. The artifact is the tension between
      what you meant to search and what appeared. A 'clear history' button that
      doesn't work, because you can't unsee what you recognized in yourself.
    complexity: L
    why: Code-art dormant since iteration 18 (The Forgery Archive). Complicity
      through recognition — the user's discomfort comes from seeing their own
      private thoughts reflected by a machine.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Autocomplete Confessions is the portfolio's most elegant complicity engine — a search bar that makes you discover your own loneliness through autocomplete suggestions that start at "how to make pancakes" and descend to "is it normal to rehearse your own death," each recognition a wound you chose to open by typing. The depth system is architectural craft at its most precise: five levels tracked by amber dots, body background darkening through CSS classes, suggestion text shifting from neutral through warm amber to red-tinged urgency, all triggered not by time but by the user's own curiosity. The typing animation — where selecting a suggestion causes the machine to type the full confession back at you at human speed with variable delays on spaces and punctuation, then let it sit for a beat before fading to nothing and archiving it below — makes watching your darkest thought written by something else more unsettling than writing it yourself. The "Clear History" button's escalating refusal ("You can't clear what you recognized" → "This isn't a history. This is you") is the portfolio's cruelest interaction since Dead Name's honorific cycling, and the way repeated clear attempts push depth to maximum without any user search input is a quiet masterstroke — the machine knowing that wanting to erase something proves it was real. The suggestion curation itself is the artifact's hidden art: each depth level's entries are calibrated to specific registers of self-disclosure (depth 0 is genuinely what people search; depth 3-4 is what they think at 3am), and the matching algorithm's prefix-first, then all-words-present, then depth-sorted logic ensures the horror escalates naturally through exploration. The ambient noise overlay with fractal turbulence animation, the "Based on your history" header that appears after depth 1, the empty-state messages that change with depth ("Only you know what you were going to type") — every surface decision serves the thesis that the search engine's omniscience was always just a mirror. This joins The Going Rate as the portfolio's purest experiment in attention-as-confession, and it may be the more universally wounding of the two — an artifact about the things everyone types and no one admits.


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
**Summary:** The artifact passes with 21/22 tests succeeding. The single failure confirms the core artistic premise — suggestion data is not embedded in the HTML file but loaded dynamically from JavaScript, which is the correct architectural choice for this autocomplete experience.
**Tests:** 21/22 passed
