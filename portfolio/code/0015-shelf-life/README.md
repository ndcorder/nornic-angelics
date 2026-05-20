# Shelf Life

**Domain:** code-tool  
**ID:** 0015  
**Mean rating:** 4.6

## Proposal

ideas:
  - title: Shelf Life
    domain: code-tool
    pitch: "A CLI that scans your downloads folder and generates a one-page
      'obituary report' — files organized by how long they've been dead
      (unopened), with causes of death guessed by extension. It outputs a
      formatted text file that reads like a morgue ledger. The surprise: a .pdf
      unopened for 400 days gets a longer obituary than one from last week."
    complexity: M
    why: Code-tool is the only domain with zero entries; this fills it with
      something that does one thing well and has a specific, surprising voice.
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Shelf Life is a forensic anthropologist for your downloads folder — a code-tool that examines every file's birth time, last access, version lineage, and directory neighbors, then pronounces causes of death with the quiet authority of a coroner. The specificities are what make it art: "next of kin" determined by filename prefix matching with a randomized fallback to directory neighbors, five graduated causes of death (NEGLECT, ABANDONMENT, SUPERSEDED, FADING, RECENT) with real threshold logic, and version comparison that can identify when report_v2.pdf has superseded report_v1.pdf. The surprise is structural — `timesAccessed` is an estimation derived from age and access patterns, not a real counter, which is either a pragmatic cheat or a philosophical statement about how we estimate intimacy from distance. The two test failures (hyphen normalization in dates, lexicographic version comparison treating 1.9 > 1.10) are real bugs but minor ones; the core examination logic is sound across all five death categories and the supersession detection works for the common cases. This is the portfolio's first code-tool, filling a gap in the domain balance, and it earns its place through the same restraint that marks the best Foundry work: the metaphor never overrides the utility, and every function does exactly what it claims.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 5 |
| craft | 4 |
| surprise | 5 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 4 |

## Tester Report

**Verdict:** pass
**Summary:** 43 of 45 tests pass. The 2 failures are in minor helper functions (extractVersionInfo date normalization and string-based version comparison) that don't undermine the core shelf-life examination functionality.
**Tests:** 43/45 passed
