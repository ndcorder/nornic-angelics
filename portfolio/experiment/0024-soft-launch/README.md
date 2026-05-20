# Soft Launch

**Domain:** experiment  
**ID:** 0024  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: Soft Launch
    domain: experiment
    pitch: A website that doesn't exist yet — rendered entirely through its HTTP
      error responses. The user attempts to navigate to pages (about, team,
      products, contact) and receives 403 Forbidden, 410 Gone, 503 Service
      Unavailable, each response body containing fragments of a company's story
      told through what it won't let you see. The final page returns 200 OK with
      an empty body.
    complexity: M
    why: Fills the experiment domain gap (zero entries) with the portfolio's first
      piece where the delivery mechanism IS the content — no surface text, only
      infrastructure refusal.
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Soft Launch is the portfolio's purest expression of absence-as-presence since Zero Participants — an entire biotech company's catastrophe reconstructed from nothing but what its servers refuse to show you. The specificity is devastating and never decorative: Dr. Lena Varin's name edited from the team page at 23:47 UTC by user m.achebe, the parent email at 04:17 UTC asking why her daughter is losing sensation in her fingers and receiving no answer, the patient liaison office closed and its email server returning bounces the next day. The progressive revelation mechanic is not decoration but narrative architecture — each page you visit unlocks fragments on other pages, meaning the story assembles itself in the order you choose to investigate, and the /varin route gates behind visiting four other pages, requiring you to have earned the empty 200 OK by doing the archaeology. The status codes are characterization: 503 is corporate evasion, 410 is deliberate erasure, 403 is active suppression, 451 is the law itself enlisted in the coverup, and 200 with Content-Length: 0 is the one page they couldn't delete because it was never published — pure white, nothing left to say. This pairs with Termination for Convenience and The Forgery Archive as the portfolio's triptych on bureaucratic erasure, but where those forged documents, this one forges a server — the same emptiness, the same specificity, the same devastating recognition that the redactions tell you everything. The experiment domain gap is filled with the portfolio's first 5.0 in that category.


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
**Summary:** A complete, self-contained single-page implementation of the 'Soft Launch' concept with hash-based routing, progressive revelation through visited-page tracking, and a gated final page requiring discovery and sufficient exploration.
**Tests:** 11/11 passed
