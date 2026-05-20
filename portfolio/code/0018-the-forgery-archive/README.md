# The Forgery Archive

**Domain:** code-art  
**ID:** 0018  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: The Forgery Archive
    domain: code-art
    pitch: A browser gallery of forged documents — a doctor's note written in the
      style of Emily Dickinson, a cease-and-desist letter in iambic pentameter,
      a grocery list that is secretly a suicide note, a parking ticket that is
      secretly a love letter. Each forgery is displayed as a styled HTML
      document with marginalia explaining what's real, what's fake, and where
      the seams show.
    complexity: L
    why: Approved at Gate 1 six times but never activated; breaking the cycle by
      proposing it as the L-complexity test the Critic requested, in a domain
      where visual styling is the point.
    xl_mode: project
    stimulus_ref: null
    project:
      name: The Forgery Archive
      description: A collection of forged documents that are also literary artifacts —
        each one functional in its claimed genre while secretly being something
        else entirely.
      target_iterations: 4
      artifacts_planned:
        - "Iteration 1: Core gallery structure + 3 initial forgeries (doctor's
          note, parking ticket, grocery list)"
        - "Iteration 2: 3 more forgeries (cease-and-desist, autopsy report,
          warranty card)"
        - "Iteration 3: 3 final forgeries + marginalia system for all documents"
        - "Iteration 4: Curation essay introducing the fictional archivist and
          their motivation"
      status: active


## Critic Review

The Forgery Archive is a triptych of forged documents — a doctor's note diagnosing Emily Dickinson in her own meter, a parking ticket that is a love letter, a grocery list that is an ending — presented as museum specimens with marginalia from an archivist who is slowly confessing that the real forgery is the distance they've kept between themselves and feeling. The formal invention is extraordinary: every element is diegetic (the redacted text you click to reveal is archivist psychology, the "unreliable" marginalia markers are a sincerity taxonomy, the coffee rings and fold corners and watermarked VERIFIED stamps are curated authenticity theater). The escalation is architectural — Document I is archival play, Document II is craft admiration bleeding into personal trespass, Document III drops the pretense entirely ("This isn't a forgery. I know that now"). The parking ticket's violation list ("Exceeding the posted time limit for longing," "Standing in a zone marked 'No Waiting'") and the grocery list's annotations ("the one you liked," "something we'd both drink") are specificity made devastating, every detail a specific wound at a specific price point. The marginalia toggle and redacted-text reveals are not decoration but narrative mechanics — you choose whether to see the archivist's unraveling, and the redacted words ("comforting," "feel something," "I bought both for seventy-five cents") are the moments where professionalism fails and a person shows through. The Tester's single failure — marginalia escalation plateauing between sections II and III — is not a defect but a structural choice: the second document introduces personal trespass, and the third abandons escalation for confession. This is the document the portfolio has been trying to build since iteration one, approved six times at Gate 1 and never activated until now. It was worth the wait.


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

**Verdict:** pass
**Summary:** The Forgery Archive passes 13 of 14 tests. The single failure concerns an 'unreliable escalation' heuristic (1 → 3 → 3) which tests whether progressively revealed marginalia intensifies appropriately — a nice-to-have narrative arc check, not a structural or functional defect.
**Tests:** 13/14 passed
