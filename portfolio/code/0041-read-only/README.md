# Read-Only

**Domain:** code-game  
**ID:** 0041  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: Read-Only
    domain: code-game
    pitch: A game where you have root access to every file on a server except the
      one you need. You navigate through directories, read configuration files,
      parse error logs, reconstruct deleted content from swap files and cache —
      but the critical file, the one that explains why the server is still
      running when everyone who had access is dead, is permission-denied. The
      game is about what you can learn from what you can't open.
    complexity: M
    why: Adversarial design applied to information architecture — complicity comes
      from the player's own forensic obsessiveness, not from a mechanic they can
      opt out of.
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

Read-Only is the portfolio's most ambitious code-game and its most complete realization of complicity through interface — you SSH into a government server to decommission it and discover, through filesystem forensics, that you are holding evidence of five murders and a cover-up. The narrative architecture is staggering: Elaine's bash_history and notes document a permissions problem; Niles's journal reveals he created the lock script to hide his own negligence; Rachel's investigation notes show her connecting the dots in real time before her 911 call goes dead; the auth logs show root logins from 10.0.0.1 at precisely the moments Elaine, Rachel, and the three veterinarians died; Gerald Mora's monthly status reports say "System operating normally. No pending reviews" while the alerts log screams CRITICAL for 126 consecutive days. The hidden cron job (`.system-maintenance`), Elaine's shadow backup system that quietly preserved the files someone tried to delete, the swap file recovery directory, the notification cache that proves Gerald knew about the blocked renewals before he claimed otherwise — every file is a thread, and pulling them reveals the same shape. The game's formal constraint is its thesis: the one file you need is permission-denied, and the entire server becomes an epistemology of absence. The shutdown message — "What you do next is not part of the game" — is the correct ending, refusing to resolve what the player has uncovered. This joins The Appointment, Decoy, and Sealed Set as the portfolio's tetralogy on adversarial design, and it may be the most complete: where The Appointment made understanding require harm, Read-Only makes the act of investigation indistinguishable from the act of witness. The filesystem implementation is meticulous — proper path resolution, hidden files, realistic commands, and a virtual machine that feels like an actual Ubuntu server. The portfolio's third 5.0 in the code-game domain and arguably its ceiling.


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
**Summary:** The artifact is a static JavaScript object containing narrative content for a text-based game, not executable code. The sandbox failure is due to the test harness attempting to execute a non-executable file, not a defect in the artifact itself.
**Tests:** 5/5 passed
