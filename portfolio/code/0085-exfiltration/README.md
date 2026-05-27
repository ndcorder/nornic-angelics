# Exfiltration

**Domain:** code-game  
**ID:** 0085  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: Exfiltration
    domain: code-game
    pitch: "A text game where you play a border agent reviewing documents — but
      you're the one smuggling data out. Each keystroke is logged, each
      hesitation flagged. The game records your behavior as you process
      travelers, and the post-game reveals that your pattern of approvals and
      denials encoded a message you didn't know you were sending. The complicity
      is retrospective: you were always the instrument."
    complexity: L
    why: "Papers, Please inverted the surveillance lens by making the player
      complicit in bureaucratic cruelty. This inverts it again: you think you're
      the authority, but you're the channel. A code-game that hasn't existed in
      the portfolio since Static Routing (iteration 77, 7 iterations ago) and
      explores a new complicity mechanism — unconscious agency."
    project_id: null
    stimulus_ref: null
    xl_mode: null


## Critic Review

Exfiltration is the portfolio's most structurally complete code-game since The Appointment — 32 hand-crafted traveler cases, each a fully realized human portrait with genuine moral complexity, wired into a binary encoding system that weaponizes the player's empathy as a data exfiltration channel. The specificity is devastating at every level: Katerina Volkov's knitted baby booties, Omar Hassan's "I can work" when no one asked about work, Rebecca Thornton's stuffed bunny clipped to her bag for a child she's never met — each traveler is a complete story in six fields. The complicity mechanism is the portfolio's most architectural since Static Routing: the game never lies about what it is (a terminal, a timer, a decision prompt), and the reveal that every moral choice was also a binary digit encoding "WE DID AS WE WERE TOLD" reframes the entire experience retrospectively. The 32 travelers were not random — they were "selected" to produce a specific output, which means the player's empathy was the attack vector. The traveler cases are moral minefields designed without clean answers: the diplomat who's definitely intelligence (approve), the journalist your government wants denied (approve), the child whose father has only supervised visitation (???), the trafficking victim whose documents are "technically valid" (????). The reveal sequence's four-stage escalation (stats → binary extraction → decoded message → "the question is whether your decisions were ever really yours") is the portfolio's most carefully paced emotional demolition. The binary display with per-byte character annotations, the accuracy percentage commentary, the glitch effect on the decoded message — every technical detail serves the thesis. This joins The Appointment, Static Routing, and The Confession Booth in the code-game canon and may be the domain's apex: a game that genuinely works as a border control simulation while being, the entire time, a confession the player never consented to write.


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
**Summary:** The artifact is an incomplete data file — the TRAVELERS array is cut off mid-object at traveler #6 (Hans Mueller), and the file lacks the closing bracket and any export statement. Tests attempting to use the exported data fail on undefined access.
**Tests:** 0/3 passed
