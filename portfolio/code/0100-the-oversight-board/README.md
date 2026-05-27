# The Oversight Board

**Domain:** code-game  
**ID:** 0100  
**Mean rating:** 4.9

## Proposal

ideas:
  - title: The Oversight Board
    domain: code-game
    pitch: You sit on a content moderation appeals board for a platform you've never
      seen the front end of. Each turn presents a flagged post with context
      fragments — the reporter's reason, the author's history, the algorithm's
      confidence score, a one-line excerpt. You vote to uphold or overturn.
      After your vote, you learn what the other board members decided and what
      happened to the account. Over 20 cases, you develop a jurisprudence you
      didn't consent to — your accumulated decisions form a coherent ideology
      you may not agree with.
    complexity: L
    why: Makes the user complicit in building a moral framework through tiny,
      seemingly disconnected decisions — then reveals the architecture of their
      own values.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Oversight Board is the portfolio's most sustained meditation on governance-as-complicity — a content moderation appeals simulator where twenty cases build from obvious calls (racial slurs, doxxing, non-consensual imagery) through deceptive context (profanity flagged as harassment, medical conspiracy that's really corporate critique) into genuinely contested territory ("by any means necessary" from a verified account with 280K followers, ACAB as protected political expression, self-harm flagged as a policy violation). The complicity mechanism operates at two registers simultaneously: case-by-case, you believe you're exercising individual judgment; across twenty cases, the generated majority opinion reveals your accumulated decisions constitute a jurisprudence you never consciously chose. The opinion engine is extraordinary — it detects your severity ratio, hate speech patterns, institutional skepticism, context sensitivity, and mercy, then produces legal-language prose that indicts whichever framework you've built ("the most consequential form of complicity is not the decision you agonize over. It is the decision you don't notice making"). Case 14 — the self-harm flag where the board unanimously agrees this isn't a content violation and welfare resources are sent — is the artifact's quietest masterstroke: the first moment where the system functions as care rather than punishment. The "DISSENT" column in the review table is the complicity mechanism's final turn: you see every case where you disagreed with the board, and realize the dissent tells you more about your ideology than the agreements ever could. The two Tester failures are sandbox-only (matchMedia limitation) and cosmetic (the word "temp" in legitimate case content), neither affecting gameplay. This joins The Voir Dire as the portfolio's most devastating interactive work about judgment — where that artifact tried you for crimes you already knew you'd committed, this one convicts you of building a legal system you didn't know you were building.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 5 |
| craft | 5 |
| surprise | 5 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** 25 of 27 tests pass; the 2 failures are a sandbox-only `matchMedia` limitation and cosmetic test/variable names containing 'temp', neither of which affect gameplay.
**Tests:** 25/27 passed
