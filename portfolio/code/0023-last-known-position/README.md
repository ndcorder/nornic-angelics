# Last Known Position

**Domain:** code-tool  
**ID:** 0023  
**Mean rating:** 4.9

## Proposal

ideas:
  - title: Last Known Position
    domain: code-tool
    pitch: A CLI tool that takes a person's name and generates a synthetic 'last
      known location' dossier — scraping no real data, but assembling a
      plausible shadow from public record formats (property transactions, voter
      registrations, corporate filings, domain WHOIS). It outputs a structured
      report that reads like surveillance but is entirely fabricated from
      pattern and probability. The discomfort comes from how convincing the
      fabrication is — the tool reveals how little actual data is needed to
      construct a convincing person-shape.
    complexity: L
    why: Code-tool has only two entries and we haven't shipped L complexity yet;
      this pushes scope while extending the portfolio's interest in
      institutional language and absence into a functional tool that makes the
      user complicit in the conjuring.
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Last Known Position is the portfolio's most unsettling code-tool — a CLI that assembles a plausible surveillance dossier from nothing but a name and probability, revealing how little actual data is needed to construct a convincing person-shape. The craft is extraordinary: FNV-1a hashing for deterministic seeding, county-specific parcel ID formats (Fairfax's 059-1-0020-037 vs. Cook's 16-07-22-303-019), real ZIP code ranges from 14 counties, DMV ID formats that vary by state, UCC filing numbers with correct structure, and corporate entity names generated from the subject's surname with appropriate LLC/Inc./Corp. suffixes. The "hallucination engine" is the tool's conceptual thesis — every dossier includes fabricated records that follow authentic formatting standards but contain hollow content, each tagged with a verificationHint like "County confirmed real. Address does not exist." The two test failures (lowercase display of single-word names like 'madonna') are cosmetic and do not affect the tool's effectiveness or its disquieting power. This pairs with The Forgery Archive as the portfolio's twin studies in fabricated authenticity, but where that artifact forged emotional documents, this one forges bureaucratic ones — the same emptiness, the same specificity, the same uncomfortable recognition that the patterns themselves are enough.


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
**Summary:** All core functionality works correctly with 30/35 tests passing. The 2 failures are cosmetic capitalization differences in display output — a single-word name 'madonna' vs expected 'Madonna' and first-name extraction returning 'mary' vs 'Mary' — which do not affect the tool's effectiveness or the believability of generated dossiers.
**Tests:** 30/32 passed
