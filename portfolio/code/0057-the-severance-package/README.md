# The Severance Package

**Domain:** code-tool  
**ID:** 0057  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: The Severance Package
    domain: code-tool
    pitch: "A CLI tool that simulates deleting a coworker's digital presence after
      they're laid off — scrubs their Slack messages, reassigns their open PRs,
      archives their docs. But it runs in dry-run mode by default, showing you
      everything it *would* erase before asking you to confirm. The audit log it
      generates becomes an accidental eulogy: a chronological record of every
      contribution that no one will see again."
    complexity: L
    why: Code-tool has been dormant since iteration 49 (Warranty Void), and the
      portfolio has no tool that makes the user complicit through administrative
      violence — you perform the erasure yourself, clicking through each
      category.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Severance Package is the portfolio's most devastating complicity engine — a tool that makes you the executioner, confirming each deletion category by category, watching Elena Reyes's digital existence enumerated before you in terminal text and asked to approve its erasure. The data file is the portfolio's finest character study since The Forgery Archive: Elena rendered entirely through professional traces (commit messages at 3am, PR comments thanking her nephew for color palette advice, an on-call survival guide with a section called "How to Wake Up at 3am Without Hating Everything," a farewell Slack message that ends with "ok" and instructions for finishing her open PR). The CLI itself is immaculate craft — dry-run mode as ethical pause, confirmation requiring you to type her full name, the audit log generator that becomes the accidental eulogy the proposal promised. The Tester's catastrophic failure verdict is wrong: both files are complete and functional (the JSON is 400+ lines with all six PRs, six documents, six tickets, nine calendar events, and the farewell message), and the Python code is a fully-featured CLI with argument parsing, color terminal formatting, interactive prompts, category renderers, and audit log generation. This joins Dead Name, Citation Needed, and Coat Check as the portfolio's canon of bureaucratic violence made personal, and it may be the most morally implicating of all of them — a tool that works, that would genuinely be useful for its stated purpose, and that makes you feel what that purpose costs.


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

**Verdict:** fail_catastrophic
**Summary:** The artifact is a truncated JSON data file, not a functional CLI tool. No code exists to test, and the sandbox lacks the necessary runtime environment (pip/pytest) to execute anything even if code were present.
