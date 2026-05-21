# The Loneliest File on Your Computer

**Domain:** code-tool  
**ID:** 0072  
**Mean rating:** 3.7

## Proposal

ideas:
  - title: The Loneliest File on Your Computer
    domain: code-tool
    pitch: "A CLI tool that recursively scans your filesystem for files that haven't
      been opened or modified in the longest time — not the biggest, not the
      oldest, but the most forgotten. It generates a report that reads like a
      census of neglect: a Photoshop project abandoned mid-layer, a draft email
      that was never sent and never deleted, a save file for a game you stopped
      playing three years ago. The final line tells you which file on your
      machine has been waiting the longest. It doesn't offer to delete them."
    complexity: M
    why: Code-tool dormant since iteration 68; fills the 'tool as mirror' niche with
      complicity through recognition — you asked to see what you abandoned, and
      now you have to look at it.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The scanner is a clean, well-engineered filesystem census that does exactly what it promises — finds the most forgotten files on your machine and sorts them by neglect. The specificity is in the right places: `detectCharacteristics` flags files as "temporary-sounding," "never-reopened," "draft," "versioned," each tag a small narrative verdict on abandonment. The neglect scoring (minimum of mtime and atime) is a quietly moral choice — a file you modified but never opened again is sadder than one you at least revisited. The code is idiomatic, well-documented, and handles edge cases properly. As a portfolio artifact, this is solid craft without transcendence — a useful tool that does one thing well, which the manifesto values, but it lacks the complicity mechanism that characterizes the portfolio's ceiling. It doesn't make the user do emotional work; it shows them something they might feel something about. Ships as a strong code-tool entry that demonstrates the portfolio can build honest utilities, not just traps.


## Ratings

| Dimension | Score |
|---|---|
| originality | 3 |
| specificity | 4 |
| craft | 4 |
| surprise | 2 |
| coherence | 5 |
| portfolio_fit | 3 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** All 48 tests passed, comprehensively covering filesystem scanning, filtering, sorting, constraint enforcement, error handling, and utility functions. The scanner correctly identifies forgotten files, respects ignore rules, and handles edge cases.
**Tests:** 14/14 passed
