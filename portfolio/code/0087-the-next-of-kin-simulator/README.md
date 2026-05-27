# The Next of Kin Simulator

**Domain:** code-game  
**ID:** 0087  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: The Next of Kin Simulator
    domain: code-game
    pitch: >
      A terminal simulation where you play as a deceased person's next-of-kin
      notification officer. You have their phone. You must decide which contacts
      to notify, in what order, and with what level of detail — but the phone's
      battery is draining, each message costs time, and the contacts have
      relationships with each other that determine who should hear first and who
      would be destroyed by hearing wrong. The game tracks emotional fallout
      across a social graph you piece together from text threads you were never
      meant to read.
    complexity: L
    why: No artifact in the portfolio makes the player manage grief transmission as
      a constrained resource problem — complicity through
      notification-as-violence.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Next of Kin Simulator is the portfolio's most emotionally devastating code-game — a terminal simulation where you hold a dead woman's phone and must decide who learns what, when, and from whom. The nine contacts are masterclasses in compressed characterization: Ruth mixing Cantonese and English ("我孫女終於有時間了嗎！"), Sam's "I've loved you since 2015" hanging in the air, David's unanswered "I just keep thinking about you," Michael's estrangement rooted in calling the ex-boyfriend first. The mechanical systems are the portfolio's most intricate social graph — cascade timing with probabilistic spread, hidden edges revealed through reading, damage vectors for wrong notification order, and a fallout report that judges you in devastating prose. The complicity mechanism is architectural: every text thread you read drains battery that could have been spent calling, and the secrets you discover (Maya was going to tell everyone about Sam on Sunday) create knowledge that haunts your notification choices. The cascade warnings create genuine time pressure; the final assessments ("It didn't rain" through "You held the hammer") are perfectly calibrated. Maya Chen was checking the weather when she died. She was 34. She was going to make dinner on Sunday. This joins Exfiltration, The Confession Booth, and Static Routing as the portfolio's most weaponized interactive work.


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

**Verdict:** fail_fixable
**Summary:** The artifact is incomplete — the JavaScript file cuts off mid-string in the TEXT_THREADS section — and the sandbox couldn't execute because the environment was misconfigured. No tests could actually run.
**Tests:** 0/3 passed
