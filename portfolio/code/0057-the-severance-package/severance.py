#!/usr/bin/env python3
"""
severance.py — Meridian Technologies Account Deprovisioning Utility
IT-OPS-PROC-2024-v3.1

Processes digital account removal for terminated employees.
Includes dry-run audit and confirmation workflow per
HR Policy §12.4 and InfoSec Standard IS-017.

Usage:
    python severance.py EMP-2847
    python severance.py EMP-2847 --confirm
    python severance.py EMP-2847 --confirm --quiet
"""

import json
import sys
import os
import argparse
from datetime import datetime, timezone
from pathlib import Path

# ─── Configuration ──────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
DATA_FILE = SCRIPT_DIR / "data_employee.json"
AUDIT_DIR = SCRIPT_DIR / "audit_logs"

SUPPORTED_EMPLOYEE_IDS = {"EMP-2847"}

CATEGORY_ORDER = [
    ("profile", "Profile & Account"),
    ("tickets", "Jira Tickets"),
    ("git_commits", "Git Commits"),
    ("pull_requests", "Pull Requests"),
    ("code_review_comments", "Code Review Comments"),
    ("documents", "Documents"),
    ("slack_messages", "Slack Messages"),
    ("calendar_events", "Calendar Events"),
    ("artifacts", "Uploaded Artifacts"),
]

# ─── Terminal Formatting ────────────────────────────────────────

class Term:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    UNDERLINE = "\033[4m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"
    BG_RED = "\033[41m"
    BG_GREEN = "\033[42m"


# ─── Data Loading ───────────────────────────────────────────────

def load_employee_data(employee_id: str) -> dict:
    if not DATA_FILE.exists():
        print_error(f"Data file not found: {DATA_FILE}")
        print_error(
            "Ensure data_employee.json is in the same directory as severance.py"
        )
        sys.exit(1)
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print_error(f"Failed to parse employee data: {e}")
        sys.exit(1)
    if data.get("employee", {}).get("id") != employee_id:
        print_error(f"Employee {employee_id} not found in dataset")
        sys.exit(1)
    return data


# ─── Output Helpers ─────────────────────────────────────────────

def use_color() -> bool:
    return hasattr(sys.stdout, "isatty") and sys.stdout.isatty()


def fmt(style: str, text: str) -> str:
    if not use_color():
        return text
    return f"{style}{text}{Term.RESET}"


def fmt_bold(text: str) -> str:
    return fmt(Term.BOLD, text)


def fmt_dim(text: str) -> str:
    return fmt(Term.DIM, text)


def fmt_red(text: str) -> str:
    return fmt(Term.RED, text)


def fmt_green(text: str) -> str:
    return fmt(Term.GREEN, text)


def fmt_yellow(text: str) -> str:
    return fmt(Term.YELLOW, text)


def fmt_cyan(text: str) -> str:
    return fmt(Term.CYAN, text)


def fmt_magenta(text: str) -> str:
    return fmt(Term.MAGENTA, text)


def print_header(text: str, char: str = "═") -> None:
    width = min(os.get_terminal_size().columns if use_color() else 72, 80)
    print()
    print(fmt_dim(char * width))
    mid_len = min(len(text) + 4, width - 4)
    pad = (width - mid_len) // 2
    print(
        fmt_dim(char * pad),
        fmt_bold(text),
        fmt_dim(char * (width - pad - mid_len + len(text) + 4)),
    )
    print(fmt_dim(char * width))
    print()


def print_section(text: str) -> None:
    print()
    print(fmt_yellow(f"  ▸ {text}"))
    print(fmt_dim("  " + "─" * 60))


def print_kv(label: str, value: str, indent: int = 4) -> None:
    print(f"{' ' * indent}{fmt_dim(label + ':'):24s} {value}")


def print_bullet(text: str, indent: int = 6) -> None:
    print(f"{' ' * indent}{fmt_dim('•')} {text}")


def print_error(text: str) -> None:
    print(fmt_red(f"  ERROR: {text}"), file=sys.stderr)


def print_warning(text: str) -> None:
    print(fmt_yellow(f"  WARNING: {text}"), file=sys.stderr)


def print_success(text: str) -> None:
    print(fmt_green(f"  ✓ {text}"))


def format_timestamp(ts: str) -> str:
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d %H:%M UTC")
    except (ValueError, AttributeError):
        return ts


def format_date_only(ts: str) -> str:
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except (ValueError, AttributeError):
        return ts


def wrap_text(text: str, width: int = 66, indent: int = 0) -> list[str]:
    if not text:
        return []
    lines: list[str] = []
    for paragraph in text.split("\n"):
        if not paragraph.strip():
            lines.append("")
            continue
        words = paragraph.split()
        current_line = ""
        for word in words:
            test = f"{current_line} {word}".strip()
            if len(test) <= width:
                current_line = test
            else:
                if current_line:
                    lines.append(" " * indent + current_line)
                current_line = word
        if current_line:
            lines.append(" " * indent + current_line)
    return [line for line in lines if line is not None]


def prompt_yes_no(prompt: str, default: bool = False) -> bool:
    suffix = " [Y/n] " if default else " [y/N] "
    while True:
        try:
            response = input(prompt + suffix).strip().lower()
        except (EOFError, KeyboardInterrupt):
            print()
            return default
        if response in ("y", "yes"):
            return True
        elif response in ("n", "no"):
            return False
        elif response == "":
            return default
        else:
            print(fmt_dim("    Please enter y or n."))


def prompt_confirm_character(text: str) -> bool:
    while True:
        try:
            response = input(f"  {text}: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return False
        return response.strip("\"'") == text


# ─── Audit Log Builder ──────────────────────────────────────────

class AuditLog:
    def __init__(self, employee_name: str, employee_id: str):
        self.employee_name = employee_name
        self.employee_id = employee_id
        self.started_at = datetime.now(timezone.utc)
        self.entries: list[dict] = []
        self.confirmed_categories: list[str] = []
        self.skipped_categories: list[str] = []

    def add_entry(
        self,
        category: str,
        action: str,
        identifier: str,
        details: str,
        confirmed: bool,
    ):
        self.entries.append(
            {
                "category": category,
                "action": action,
                "identifier": identifier,
                "details": details,
                "confirmed": confirmed,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )

    def write(self, filepath: Path) -> None:
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            width = 72
            f.write("═" * width + "\n")
            f.write("  SEVERANCE AUDIT LOG\n")
            f.write("  Meridian Technologies — Information Security\n")
            f.write("═" * width + "\n\n")
            f.write(f"  Employee:        {self.employee_name}\n")
            f.write(f"  Employee ID:     {self.employee_id}\n")
            f.write(
                f"  Processed:       {self.started_at.strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
            )
            f.write(
                f"  Completed:       {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
            )
            f.write(f"  Total Items:     {len(self.entries)}\n")
            confirmed_count = sum(1 for e in self.entries if e["confirmed"])
            f.write(f"  Confirmed:       {confirmed_count}\n")
            f.write(f"  Retained:        {len(self.entries) - confirmed_count}\n\n")

            if self.confirmed_categories:
                f.write("  Categories processed:\n")
                for cat in self.confirmed_categories:
                    f.write(f"    ✓ {cat}\n")
            if self.skipped_categories:
                f.write("\n  Categories retained:\n")
                for cat in self.skipped_categories:
                    f.write(f"    — {cat}\n")

            f.write("\n" + "─" * width + "\n")
            f.write("  DETAILED RECORD\n")
            f.write("─" * width + "\n\n")

            current_cat = None
            for entry in self.entries:
                if entry["category"] != current_cat:
                    current_cat = entry["category"]
                    f.write(f"\n  [{current_cat}]\n")
                    f.write(f"  {'─' * 60}\n")

                status = "ERASED" if entry["confirmed"] else "RETAINED"
                f.write(f"\n  {status:8s} │ {entry['identifier']}\n")
                f.write(f"  {'':8s} │ Action: {entry['action']}\n")

                for line in entry["details"].split("\n"):
                    f.write(f"  {'':8s} │ {line}\n")

            f.write("\n\n" + "═" * width + "\n")
            f.write("  END OF AUDIT LOG\n")
            f.write("═" * width + "\n")
            f.write(
                "\n  This document constitutes the official record of account deprovisioning\n"
            )
            f.write(
                "  per Meridian Technologies HR Policy §12.4 and InfoSec Standard IS-017.\n"
            )
            f.write("  Retain for a minimum of 7 years.\n\n")


# ─── Category Renderers ─────────────────────────────────────────

def display_employee_profile(
    data: dict, audit: AuditLog, dry_run: bool
) -> bool:
    emp = data["employee"]
    prof = emp.get("profile", {})

    print_kv("Employee ID", emp["id"])
    print_kv("Name", emp["name"])
    print_kv("Email", emp["email"])
    print_kv("Title", emp["title"])
    print_kv("Department", emp["department"])
    print_kv("Manager", emp["manager"])
    print_kv("Start Date", format_date_only(emp["start_date"]))
    print_kv("End Date", format_date_only(emp["termination_date"]))
    print_kv("Reason", emp["termination_reason"])
    print_kv("Last Active", format_timestamp(emp["last_active"]))

    print()
    print_kv("Display Name", prof.get("display_name", ""))
    print_kv("Pronouns", prof.get("pronouns", ""))
    print_kv("Timezone", prof.get("timezone", ""))
    print_kv(
        "Status",
        f"{prof.get('status_emoji', '')} {prof.get('status_text', '')}",
    )
    print_kv("Bio", prof.get("bio", ""))

    print()
    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Deactivate account")
    print_bullet("Revoke SSO access")
    print_bullet("Revoke API tokens")
    print_bullet("Remove from directory")
    print_bullet("Delete avatar and profile metadata")

    identifier = f"{emp['id']} — {emp['name']}"
    tenure_days = (
        datetime.fromisoformat(emp["termination_date"])
        - datetime.fromisoformat(emp["start_date"])
    ).days
    details = (
        f"{emp['title']}, {emp['department']}\n"
        f"Start: {format_date_only(emp['start_date'])} — "
        f"End: {format_date_only(emp['termination_date'])}\n"
        f"Tenure: {tenure_days} days"
    )

    if not dry_run:
        confirmed = prompt_yes_no(
            "  Confirm account deactivation?", default=False
        )
        audit.add_entry(
            "Profile & Account", "deactivate", identifier, details, confirmed
        )
        return confirmed
    else:
        audit.add_entry(
            "Profile & Account", "deactivate", identifier, details, False
        )
        return False


def display_tickets(data: dict, audit: AuditLog, dry_run: bool) -> bool:
    tickets = sorted(data.get("tickets", []), key=lambda t: t.get("created", ""))
    if not tickets:
        print(fmt_dim("    No tickets to process."))
        return False

    print(fmt_dim(f"    {len(tickets)} ticket(s) assigned\n"))

    for ticket in tickets:
        if ticket["status"] == "closed":
            status_fmt = fmt_green("CLOSED")
        elif ticket["status"] == "in_progress":
            status_fmt = fmt_yellow("IN PROGRESS")
        else:
            status_fmt = ticket["status"].upper()

        priority = ticket.get("priority", "")
        if priority == "critical":
            priority_fmt = fmt_red("● CRITICAL")
        elif priority == "high":
            priority_fmt = fmt_yellow("● HIGH")
        elif priority == "medium":
            priority_fmt = fmt_cyan("● MEDIUM")
        else:
            priority_fmt = fmt_dim("● LOW")

        print(f"  {fmt_bold(ticket['id'])}  {status_fmt}  {priority_fmt}")
        print_kv("Title", ticket["title"], indent=6)
        print_kv("Reporter", ticket.get("reporter", "unknown"), indent=6)
        if ticket.get("epic"):
            print_kv("Epic", ticket["epic"], indent=6)
        if ticket.get("sprint"):
            print_kv("Sprint", ticket["sprint"], indent=6)
        labels = ", ".join(ticket.get("labels", []))
        if labels:
            print_kv("Labels", labels, indent=6)
        desc_lines = wrap_text(ticket.get("description", ""), width=58, indent=0)
        for i, line in enumerate(desc_lines[:2]):
            if i == 0:
                print_kv("Description", line, indent=6)
            else:
                print(f"{' ' * 30}{line}")
        print()

    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Reassign in-progress tickets to manager (David Chen)")
    print_bullet("Update closed tickets — remove assignee")
    print_bullet("Remove name from watchers list")

    if not dry_run:
        confirmed = prompt_yes_no(
            f"  Confirm reassignment of {len(tickets)} ticket(s)?", default=False
        )
        for ticket in tickets:
            identifier = f"{ticket['id']} — {ticket['title']}"
            details = (
                f"Status: {ticket['status']}\n"
                f"Priority: {ticket.get('priority', 'N/A')}\n"
                f"{ticket.get('description', '')[:150]}"
            )
            action = (
                "reassign" if ticket["status"] == "in_progress" else "unassign"
            )
            audit.add_entry(
                "Jira Tickets", action, identifier, details, confirmed
            )
        return confirmed
    else:
        for ticket in tickets:
            identifier = f"{ticket['id']} — {ticket['title']}"
            details = (
                f"Status: {ticket['status']}\n"
                f"Priority: {ticket.get('priority', 'N/A')}\n"
                f"{ticket.get('description', '')[:150]}"
            )
            action = (
                "reassign" if ticket["status"] == "in_progress" else "unassign"
            )
            audit.add_entry(
                "Jira Tickets", action, identifier, details, False
            )
        return False


def display_git_commits(data: dict, audit: AuditLog, dry_run: bool) -> bool:
    commits = sorted(
        data.get("git_commits", []), key=lambda c: c.get("timestamp", "")
    )
    if not commits:
        print(fmt_dim("    No git commits to process."))
        return False

    print(fmt_dim(f"    {len(commits)} commit(s) authored\n"))

    for commit in commits:
        sha = commit["sha"]
        ts = format_timestamp(commit["timestamp"])
        print(f"  {fmt_magenta(sha)}  {fmt_dim(ts)}")
        msg_lines = commit["message"].split("\n")
        for line in msg_lines:
            if line.strip():
                print(f"      {line.strip()}")
        print(fmt_dim(f"      {commit['repository']}"))
        print()

    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Reassign author to 'Deleted User (EMP-2847)'")
    print_bullet("Preserve commit history (code integrity)")
    print_bullet("Remove from git blame annotations")

    if not dry_run:
        confirmed = prompt_yes_no(
            f"  Confirm anonymization of {len(commits)} commit(s)?",
            default=False,
        )
        for commit in commits:
            identifier = (
                f"{commit['sha']} — {commit['message'].split(chr(10))[0][:50]}"
            )
            details = (
                f"Repo: {commit['repository']}\n{commit['message'][:200]}"
            )
            audit.add_entry(
                "Git Commits", "anonymize", identifier, details, confirmed
            )
        return confirmed
    else:
        for commit in commits:
            identifier = (
                f"{commit['sha']} — {commit['message'].split(chr(10))[0][:50]}"
            )
            details = (
                f"Repo: {commit['repository']}\n{commit['message'][:200]}"
            )
            audit.add_entry(
                "Git Commits", "anonymize", identifier, details, False
            )
        return False


def display_pull_requests(data: dict, audit: AuditLog, dry_run: bool) -> bool:
    prs = sorted(data.get("pull_requests", []), key=lambda p: p.get("created", ""))
    if not prs:
        print(fmt_dim("    No pull requests to process."))
        return False

    print(fmt_dim(f"    {len(prs)} pull request(s) authored\n"))

    for pr in prs:
        status_str = pr["status"].upper()
        if pr["status"] == "merged":
            status_fmt = fmt_green(status_str)
        elif pr["status"] == "open":
            status_fmt = fmt_yellow(status_str)
        else:
            status_fmt = status_str

        print(f"  {fmt_bold(pr['id'])}  {status_fmt}")
        print_kv("Title", pr["title"], indent=6)
        print_kv("Repository", pr["repository"], indent=6)
        print_kv("Branch", pr["branch"], indent=6)
        print_kv("Created", format_timestamp(pr["created"]), indent=6)
        print_kv(
            "Changes",
            f"+{pr['lines_added']} / -{pr['lines_removed']}  "
            f"({pr['files_changed']} files)",
            indent=6,
        )
        print_kv("Reviewers", ", ".join(pr["reviewers"]), indent=6)
        if pr.get("description"):
            desc_lines = wrap_text(pr["description"], width=58, indent=0)
            for i, line in enumerate(desc_lines[:3]):
                label = "Description" if i == 0 else ""
                if label:
                    print_kv(label, line, indent=6)
                else:
                    print(f"{' ' * 30}{line}")

        for comment in pr.get("comments", []):
            print(
                f"  {fmt_dim('    💬')} {fmt_cyan(comment['author'])} "
                f"({format_timestamp(comment['timestamp'])})"
            )
            comment_lines = wrap_text(comment["text"], width=58, indent=0)
            for line in comment_lines:
                print(f"  {fmt_dim('       ')}{fmt_dim(line)}")

        print()

    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Reassign open PRs to manager (David Chen)")
    print_bullet("Update merged PRs — remove author attribution")
    print_bullet("Delete review comments authored by employee")
    print_bullet("Archive branch references")

    if not dry_run:
        confirmed = prompt_yes_no(
            f"  Confirm processing of {len(prs)} pull request(s)?",
            default=False,
        )
        for pr in prs:
            identifier = f"{pr['id']} — {pr['title']}"
            details = (
                f"Status: {pr['status']}\n"
                f"Repo: {pr['repository']}\n"
                f"+{pr['lines_added']}/-{pr['lines_removed']} "
                f"in {pr['files_changed']} files"
            )
            audit.add_entry(
                "Pull Requests",
                "reassign" if pr["status"] == "open" else "archive",
                identifier,
                details,
                confirmed,
            )
        return confirmed
    else:
        for pr in prs:
            identifier = f"{pr['id']} — {pr['title']}"
            details = (
                f"Status: {pr['status']}\n"
                f"Repo: {pr['repository']}\n"
                f"+{pr['lines_added']}/-{pr['lines_removed']} "
                f"in {pr['files_changed']} files"
            )
            audit.add_entry(
                "Pull Requests",
                "reassign" if pr["status"] == "open" else "archive",
                identifier,
                details,
                False,
            )
        return False


def display_code_reviews(
    data: dict, audit: AuditLog, dry_run: bool
) -> bool:
    reviews = sorted(
        data.get("code_review_comments", []),
        key=lambda r: r.get("timestamp", ""),
    )
    if not reviews:
        print(fmt_dim("    No code review comments to process."))
        return False

    print(fmt_dim(f"    {len(reviews)} code review comment(s) authored\n"))

    for review in reviews:
        print(
            f"  {fmt_cyan(review['pr'])} → "
            f"{fmt_dim(review['file'])}:{review['line']}"
        )
        print(f"      {review['comment']}")
        print(f"      {fmt_dim(format_timestamp(review['timestamp']))}")
        print()

    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Delete review comments authored by employee")
    print_bullet("Preserve remaining review thread context")

    if not dry_run:
        confirmed = prompt_yes_no(
            f"  Confirm deletion of {len(reviews)} code review comment(s)?",
            default=False,
        )
        for review in reviews:
            identifier = f"{review['pr']} — {review['file']}:{review['line']}"
            details = review["comment"]
            audit.add_entry(
                "Code Review Comments", "delete", identifier, details, confirmed
            )
        return confirmed
    else:
        for review in reviews:
            identifier = f"{review['pr']} — {review['file']}:{review['line']}"
            details = review["comment"]
            audit.add_entry(
                "Code Review Comments", "delete", identifier, details, False
            )
        return False


def display_documents(data: dict, audit: AuditLog, dry_run: bool) -> bool:
    docs = sorted(
        data.get("documents", []),
        key=lambda d: d.get("last_modified", d.get("created", "")),
    )
    if not docs:
        print(fmt_dim("    No documents to process."))
        return False

    print(fmt_dim(f"    {len(docs)} document(s) authored or co-authored\n"))

    for doc in docs:
        doc_type = doc.get("type", "document")
        print(f"  {fmt_bold(doc['id'])}  {fmt_cyan(f'[{doc_type}]')}")
        print_kv("Title", doc["title"], indent=6)
        print_kv("Path", doc["path"], indent=6)
        print_kv("Words", str(doc.get("word_count", "N/A")), indent=6)
        co_authors = doc.get("co_authors", [])
        if co_authors:
            print_kv("Co-authors", ", ".join(co_authors), indent=6)
        print_kv("Modified", format_timestamp(doc["last_modified"]), indent=6)
        desc_lines = wrap_text(doc.get("description", ""), width=58, indent=0)
        for i, line in enumerate(desc_lines[:2]):
            if i == 0:
                print_kv("Description", line, indent=6)
            else:
                print(f"{' ' * 30}{line}")
        if doc.get("note"):
            note_lines = wrap_text(doc["note"], width=58, indent=0)
            for i, line in enumerate(note_lines):
                if i == 0:
                    print_kv("Note", fmt_dim(line), indent=6)
                else:
                    print(f"{' ' * 30}{fmt_dim(line)}")
        print()

    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Transfer ownership to co-authors or manager")
    print_bullet("Update bylines — remove employee name")
    print_bullet("Archive if sole author (manager review required)")

    if not dry_run:
        confirmed = prompt_yes_no(
            f"  Confirm transfer of {len(docs)} document(s)?", default=False
        )
        for doc in docs:
            identifier = f"{doc['id']} — {doc['title']}"
            details = (
                f"Path: {doc['path']}\n"
                f"Words: {doc.get('word_count', 'N/A')}\n"
                f"Co-authors: {', '.join(doc.get('co_authors', [])) or 'none'}"
            )
            if doc.get("note"):
                details += f"\nNote: {doc['note']}"
            audit.add_entry(
                "Documents",
                "transfer_ownership",
                identifier,
                details,
                confirmed,
            )
        return confirmed
    else:
        for doc in docs:
            identifier = f"{doc['id']} — {doc['title']}"
            details = (
                f"Path: {doc['path']}\n"
                f"Words: {doc.get('word_count', 'N/A')}\n"
                f"Co-authors: {', '.join(doc.get('co_authors', [])) or 'none'}"
            )
            if doc.get("note"):
                details += f"\nNote: {doc['note']}"
            audit.add_entry(
                "Documents", "transfer_ownership", identifier, details, False
            )
        return False


def display_slack_messages(data: dict, audit: AuditLog, dry_run: bool) -> bool:
    messages = sorted(
        data.get("slack_messages", []), key=lambda m: m.get("timestamp", "")
    )
    if not messages:
        print(fmt_dim("    No Slack messages to process."))
        return False

    print(fmt_dim(f"    {len(messages)} message(s) authored by employee\n"))

    for msg in messages:
        channel_label = msg["channel"]
        if msg["channel_type"] == "dm":
            channel_label = f"(DM) {msg['channel']}"

        ts = format_timestamp(msg["timestamp"])
        print(f"  {fmt_dim('┌─')} {fmt_cyan(channel_label)}  {fmt_dim(ts)}")
        text = msg["text"]
        wrapped_lines = wrap_text(text, width=66, indent=4)
        for line in wrapped_lines:
            print(f"  {fmt_dim('│')} {line}")

        meta_parts = []
        if msg.get("has_reactions") and msg.get("reactions"):
            meta_parts.append(f"reactions: {', '.join(msg['reactions'])}")
        if msg.get("thread_replies"):
            meta_parts.append(f"{msg['thread_replies']} replies")
        if meta_parts:
            print(f"  {fmt_dim('│')} {fmt_dim(', '.join(meta_parts))}")
        print(f"  {fmt_dim('└───')}")

    print()
    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Delete all authored messages from public channels")
    print_bullet("Delete all authored messages from private channels")
    print_bullet("Delete direct message history (employee side)")
    print_bullet("Remove name from reactions authored by others")

    if not dry_run:
        confirmed = prompt_yes_no(
            f"  Confirm erasure of {len(messages)} Slack message(s)?",
            default=False,
        )
        for msg in messages:
            channel_label = msg["channel"]
            if msg["channel_type"] == "dm":
                channel_label = f"(DM) {msg['channel']}"
            identifier = f"{msg['id']} — {channel_label}"
            details = msg["text"][:200]
            audit.add_entry(
                "Slack Messages", "delete_message", identifier, details, confirmed
            )
        return confirmed
    else:
        for msg in messages:
            channel_label = msg["channel"]
            if msg["channel_type"] == "dm":
                channel_label = f"(DM) {msg['channel']}"
            identifier = f"{msg['id']} — {channel_label}"
            details = msg["text"][:200]
            audit.add_entry(
                "Slack Messages", "delete_message", identifier, details, False
            )
        return False


def display_calendar_events(
    data: dict, audit: AuditLog, dry_run: bool
) -> bool:
    events = sorted(
        data.get("calendar_events", []), key=lambda e: e.get("start", "")
    )
    if not events:
        print(fmt_dim("    No calendar events to process."))
        return False

    print(fmt_dim(f"    {len(events)} calendar event(s) involving employee\n"))

    for event in events:
        event_type = event.get("type", "event")
        status = event.get("status", "confirmed")

        status_prefix = fmt_red("[CANCELLED] ") if status == "cancelled" else ""

        print(
            f"  {fmt_cyan(f'[{event_type}]')} "
            f"{status_prefix}{fmt_bold(event['title'])}"
        )
        print_kv(
            "Time",
            f"{format_timestamp(event['start'])} → "
            f"{format_timestamp(event['end'])}",
            indent=6,
        )
        print_kv("Location", event.get("location", "N/A"), indent=6)
        attendees = event.get("attendees", [])
        print_kv("Attendees", ", ".join(attendees), indent=6)
        if event.get("recurrence"):
            print_kv("Recurrence", event["recurrence"], indent=6)
        if event.get("note"):
            note_lines = wrap_text(event["note"], width=58, indent=0)
            for i, line in enumerate(note_lines):
                if i == 0:
                    print_kv("Note", line, indent=6)
                else:
                    print(f"{' ' * 30}{line}")
        if event.get("cancellation_note"):
            note_lines = wrap_text(
                event["cancellation_note"], width=58, indent=0
            )
            for i, line in enumerate(note_lines):
                if i == 0:
                    print_kv("Cancel note", fmt_dim(line), indent=6)
                else:
                    print(f"{' ' * 30}{fmt_dim(line)}")
        print()

    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Remove employee from all event attendees")
    print_bullet("Cancel recurring 1:1 meetings organized by employee")
    print_bullet("Transfer ownership of organized events to manager")

    if not dry_run:
        confirmed = prompt_yes_no(
            f"  Confirm processing of {len(events)} calendar event(s)?",
            default=False,
        )
        for event in events:
            identifier = f"{event['title']} ({format_timestamp(event['start'])})"
            details = (
                f"Type: {event.get('type', 'event')}\n"
                f"Attendees: {', '.join(event.get('attendees', []))}"
            )
            if event.get("note"):
                details += f"\nNote: {event['note']}"
            audit.add_entry(
                "Calendar Events",
                "remove_attendee",
                identifier,
                details,
                confirmed,
            )
        return confirmed
    else:
        for event in events:
            identifier = f"{event['title']} ({format_timestamp(event['start'])})"
            details = (
                f"Type: {event.get('type', 'event')}\n"
                f"Attendees: {', '.join(event.get('attendees', []))}"
            )
            if event.get("note"):
                details += f"\nNote: {event['note']}"
            audit.add_entry(
                "Calendar Events", "remove_attendee", identifier, details, False
            )
        return False


def display_artifacts(data: dict, audit: AuditLog, dry_run: bool) -> bool:
    artifacts = data.get("artifacts", [])
    if not artifacts:
        print(fmt_dim("    No artifacts to process."))
        return False

    print(fmt_dim(f"    {len(artifacts)} artifact(s) uploaded\n"))

    for artifact in artifacts:
        art_type = artifact.get("type", "file")
        print(f"  {fmt_cyan(f'[{art_type}]')} {artifact['path']}")
        print_kv("Description", artifact.get("description", ""), indent=6)
        print()

    print(fmt_dim("    Actions to be performed:"))
    print_bullet("Delete uploaded files from asset storage")
    print_bullet("Update document references to broken links")

    if not dry_run:
        confirmed = prompt_yes_no(
            f"  Confirm deletion of {len(artifacts)} artifact(s)?", default=False
        )
        for artifact in artifacts:
            identifier = artifact["path"]
            details = artifact.get("description", "")
            audit.add_entry(
                "Uploaded Artifacts", "delete", identifier, details, confirmed
            )
        return confirmed
    else:
        for artifact in artifacts:
            identifier = artifact["path"]
            details = artifact.get("description", "")
            audit.add_entry(
                "Uploaded Artifacts", "delete", identifier, details, False
            )
        return False


# ─── Main Execution ─────────────────────────────────────────────

CATEGORY_RENDERERS = {
    "profile": display_employee_profile,
    "tickets": display_tickets,
    "git_commits": display_git_commits,
    "pull_requests": display_pull_requests,
    "code_review_comments": display_code_reviews,
    "documents": display_documents,
    "slack_messages": display_slack_messages,
    "calendar_events": display_calendar_events,
    "artifacts": display_artifacts,
}


def run_dry_run(data: dict, audit: AuditLog) -> None:
    emp = data["employee"]
    summary = data.get("summary", {})

    print_header("SEVERANCE — DRY RUN AUDIT")
    print(f"  Employee: {fmt_bold(emp['name'])} ({emp['id']})")
    print(f"  {emp['title']}, {emp['department']}")
    print(
        f"  Separation: {format_date_only(emp['termination_date'])} "
        f"— {emp['termination_reason']}"
    )
    print()
    print(
        f"  Total digital assets to process: "
        f"{fmt_bold(str(summary.get('total_items', 0)))}"
    )
    print()
    print(fmt_dim("  This is a DRY RUN. No data will be modified."))
    print(fmt_dim("  Review the items below. Re-run with --confirm to process."))

    for key, label in CATEGORY_ORDER:
        print_section(label)
        renderer = CATEGORY_RENDERERS.get(key)
        if renderer:
            renderer(data, audit, dry_run=True)

    print_header("END OF DRY RUN AUDIT")
    print(f"  Total items catalogued: {len(audit.entries)}")
    print()
    print(f"  To proceed with deprovisioning, run:")
    print(f"    {fmt_cyan(f'python severance.py {emp[\"id\"]} --confirm')}")
    print()


def run_confirm(data: dict, audit: AuditLog) -> None:
    emp = data["employee"]

    print_header("SEVERANCE — DEPROVISIONING")

    print(f"  {fmt_bold(emp['name'])} ({emp['id']})")
    print(f"  {emp['title']}, {emp['department']}")
    print(f"  Separation date: {format_date_only(emp['termination_date'])}")
    print(f"  Reason: {emp['termination_reason']}")
    print()
    print(fmt_red("  ⚠  WARNING: This process is irreversible."))
    print(
        fmt_red("     All confirmed actions will permanently modify or delete data.")
    )
    print()

    confirmed_name = prompt_confirm_character(
        f"Type the employee's full name to continue "
        f"({fmt_bold(emp['name'])})"
    )
    if not confirmed_name:
        print()
        print_warning("Name did not match. Aborting deprovisioning.")
        print(fmt_dim("  No changes have been made."))
        sys.exit(0)

    print()
    print_success("Identity confirmed. Beginning deprovisioning.")
    print()

    for key, label in CATEGORY_ORDER:
        print_section(label)
        renderer = CATEGORY_RENDERERS.get(key)
        if renderer:
            confirmed = renderer(data, audit, dry_run=False)
            if confirmed:
                audit.confirmed_categories.append(label)
                print()
                print_success(f"{label} — processed.")
            else:
                audit.skipped_categories.append(label)
                print()
                print(fmt_yellow("  — Retained. No changes made."))
            print()


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="severance",
        description=(
            "Meridian Technologies Account Deprovisioning Utility "
            "(IT-OPS-PROC-2024-v3.1)"
        ),
        epilog="For support, contact it-ops@meridian.io",
    )
    parser.add_argument(
        "employee_id",
        help="Employee ID to deprovision (e.g., EMP-2847)",
    )
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Run in confirmation mode (modifies data). Default is dry-run.",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress banner and reduce output verbosity.",
    )

    args = parser.parse_args()

    if not args.quiet:
        print()
        print(fmt_dim("  Meridian Technologies"))
        print(fmt_dim("  Account Deprovisioning Utility v3.1"))
        print(fmt_dim("  IT-OPS-PROC-2024"))
        print()

    if args.employee_id not in SUPPORTED_EMPLOYEE_IDS:
        print_error(f"Employee {args.employee_id} not found.")
        print_error(
            f"Supported IDs: {', '.join(sorted(SUPPORTED_EMPLOYEE_IDS))}"
        )
        sys.exit(1)

    data = load_employee_data(args.employee_id)
    emp = data["employee"]

    audit = AuditLog(emp["name"], emp["id"])

    if args.confirm:
        run_confirm(data, audit)
    else:
        run_dry_run(data, audit)

    audit_filename = (
        f"severance_{emp['id']}_"
        f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    )
    audit_path = AUDIT_DIR / audit_filename
    audit.write(audit_path)

    print_header("AUDIT LOG GENERATED")
    print(f"  Written to: {fmt_cyan(str(audit_path))}")
    print(f"  Items recorded: {len(audit.entries)}")
    if audit.confirmed_categories:
        print(
            f"  Categories processed: {len(audit.confirmed_categories)}"
        )
    if audit.skipped_categories:
        print(f"  Categories retained: {len(audit.skipped_categories)}")
    print()
    print(
        fmt_dim(
            "  This log constitutes the official record of deprovisioning activity."
        )
    )
    print(fmt_dim("  Retain per company policy (minimum 7 years)."))
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        print()
        print_warning("Interrupted by user. No audit log was generated.")
        print(fmt_dim("  No changes have been made to any account."))
        print()
        sys.exit(130)
