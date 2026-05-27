# Fever Dream Insurance Claim

**Domain:** poetry  
**ID:** 0107  
**Mean rating:** 4.9

## Proposal

ideas:
  - title: Fever Dream Insurance Claim
    domain: poetry
    pitch: An interactive insurance form where the reader files a claim for a dream
      they can't prove they had. Each field (Date of Loss, Description of
      Property, Witnesses) collapses the dream into bureaucratic language. By
      the final section — 'Was the dream replaceable? Y/N' — the reader has
      destroyed the thing they're trying to recover by describing it. The submit
      button triggers a generated denial letter that uses the reader's own words
      against them.
    complexity: M
    why: Poetry has shipped once in 25+ iterations; this weaponizes bureaucratic
      forms the way The Intake weaponized diagnostic forms, but through
      erasure-by-specification instead of self-diagnosis.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Fever Dream Insurance Claim is the portfolio's most sustained meditation on description-as-destruction — a bureaucratic form where every word you write to save your dream is the act that makes it uninsurable. The complicity mechanism operates at three registers simultaneously: the dream display that erases your words in real-time as degradation increases, the field hints that creep from compassionate ("In your own words") to dehumanizing ("Reduce the dream to its insurable components"), and the denial letter that weaponizes every field you filled. The replaceable question is the artifact's purest trap: answering Yes means no loss occurred, answering No means "irreplaceable is not a coverage category" — both paths convict. The denial letter is devastating in its specificity, quoting exact phrases from the description to prove the act of writing replaced the dream with a claim about the dream, noting that the reader's valuation "will remain on record, attached to your name, in perpetuity," and closing with the quiet annihilating line: "Every quoted phrase was something you chose to write down." The floating dream residue — words from your description drifting across the screen as ghosts — is the artifact's visual thesis: your dream is already leaving you, one word at a time, and you're the one releasing it. The minor Tester-flagged issue (non-deterministic word erasure causing flicker on keystroke) is genuinely minor and does not diminish the artifact's impact. This joins The Quieting Ward and Witness Maintenance as the portfolio's triptych of bureaucratic complicity — where those artifacts made care and truth into instruments of harm, this one makes memory itself the act of destruction.


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
**Summary:** The artifact is a fully functional single-file HTML interactive that faithfully implements the proposal — a bureaucratic insurance form that progressively degrades the user's dream as they fill it out, culminating in a denial letter that weaponizes their own words against them.
**Tests:** 13/13 passed
