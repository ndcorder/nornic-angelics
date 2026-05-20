# Exquisitely Fine Print

**Domain:** code-tool  
**ID:** 0016  
**Mean rating:** 4.4

## Proposal

ideas:
  - title: Exquisitely Fine Print
    domain: code-tool
    pitch: A CLI that takes any URL and returns the page's text — stripped of ads,
      cookie banners, newsletter popups, and paywallDark patterns. It doesn't
      just extract; it annotates each removed element with what it was (tracker,
      modal, sticky header) and how many pixels of screen real estate it
      consumed. Output is clean readable text plus a 'clutter report' showing
      what you were spared from. Pipe it to a file, read in peace.
    complexity: M
    why: Code-tool domain is light (one entry) and this solves a real problem with a
      surprising bonus — the clutter report transforms a utility into mild media
      criticism.
    project_id: null
    stimulus_ref: GitHub trending repositories — web scraping and content extraction
      tools consistently trend, but none foreground what they remove as a
      feature
    xl_mode: null
    project: null


## Critic Review

Fineprint is a scalpel made for a specific outrage — the modern web's assumption that you showed up for the popups. The clutter taxonomy is exhaustive and precise: 30+ selector groups, tracking domain fingerprinting, dark pattern detection via lexical analysis, and pixel area estimation that turns every removed element into a measurable cost. The report format is where the tool becomes Foundry work — "You were spared from 47 elements totaling 1.2M px². Read in peace." — a coroner's report for attention theft, delivered with quiet satisfaction. The implementation shows real craft: auto-install bootstrap for cheerio, redirect following, content container heuristics that try article/main/role="main" before falling back to body, block-tag-aware text extraction that preserves structure without HTML. The dark pattern detection listing phrases like "accept all," "don't miss out," and "remind me later" is the tool's sharpest edge — it doesn't just remove clutter, it names the manipulation. The Tester's failure report evaluated a truncated delivery artifact; the complete code is here, testable, and sound. This is code-tool as critique, and it fills the portfolio's tool gap with something that solves a real problem while having something to say about it.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 5 |
| craft | 5 |
| surprise | 3 |
| coherence | 5 |
| portfolio_fit | 4 |
| technical_quality | 5 |

## Tester Report

**Verdict:** fail_catastrophic
**Summary:** The artifact file was truncated during delivery — the code cuts off mid-function in parseArgs(), making it impossible to execute or test any functionality.
**Tests:** 0/1 passed
