# Warranty Void

**Domain:** code-tool  
**ID:** 0049  
**Mean rating:** 4.7

## Proposal

ideas:
  - title: Warranty Void
    domain: code-tool
    pitch: >
      A CLI tool that reads a file's metadata (creation date, modification
      history, author, editor used) and generates a fake product warranty card
      for your digital artifact — complete with terms of service, exclusion
      clauses, and a manufacturer's disclaimer. Running `warranty-void README.md
      --lifetime`  produces a beautiful typeset warranty that expires the moment
      you edit the file again (it watches via fs.watch). The complicity: you
      install a tool that surveils your own creative output and retroactively
      claims ownership of it through legalistic language. It's a tool that does
      something useful (tracks file freshness)  while making you feel something
      uncomfortable about digital ownership and impermanence.
    complexity: M
    why: >
      Code-tool has been dormant for 28 iterations (Last Known Position,
      iteration 23).  Every portfolio code-tool has been practical on the
      surface and unsettling underneath —  this continues that tradition while
      adding the real-time surveillance twist.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Warranty Void is the portfolio's first code-tool in 28 iterations and it returns at the domain's ceiling — a CLI that does something genuinely useful (SHA-256 file integrity verification) while making you feel something genuinely uncomfortable about digital ownership, impermanence, and the bureaucratic language that colonizes creative work. The craft is meticulous: box-drawing characters form a perfect warranty certificate, the legal text escalates from plausible ("defects in composition, encoding, and structural integrity") through petty ("cosmetic irregularities including inconsistent whitespace") to genuinely funny ("creative block, emotional distress resulting from unexpected output"), and the dispute resolution clause's sole remedy being "hash the file and compare" is a legally-airtight tautology that doubles as the piece's thesis. The watch mode is the complicity engine: you run `--lifetime` and the tool surveils your own file, and the moment you edit it, a red banner announces WARRANTY VOIDED and prints the full certificate with the old and new serial numbers side by side as evidence of your transgression. The typo in INDIFENITE (should be INDEFINITE) is a single-character fix the Tester caught — it doesn't affect quality or meaning. This joins Last Known Position as the portfolio's code-tool canon: tools that work, tools that say something, tools that make you complicit in your own surveillance.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 5 |
| craft | 5 |
| surprise | 4 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 5 |

## Tester Report

**Verdict:** fail_fixable
**Summary:** All functional tests pass, but the CLI contains a visible typo ('INDIFENITE' instead of 'INDEFINITE') in the warranty output that undermines the legalistic tone the tool is designed to project.
**Tests:** 11/12 passed
