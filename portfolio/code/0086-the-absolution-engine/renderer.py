from linguist import AnalysisResult, HedgingMatch, PassiveMatch, AdverbMatch, Sentence
from typing import List, Optional
import textwrap


def render_analysis(result: AnalysisResult) -> str:
    """
    Convert raw forensic analysis into a clinical audit report.

    The output reads like a personality profile the user didn't consent to —
    precise, statistical, devastating.
    """
    if result.sentence_count == 0:
        return "NO CONFESSION DETECTED. No text provided for analysis."

    sections = [
        _render_header(result),
        _render_text_metrics(result),
        _render_hedging_analysis(result),
        _render_passive_analysis(result),
        _render_pronoun_analysis(result),
        _render_adverb_analysis(result),
        _render_sentence_deep_analysis(result),
        _render_overall_evasion(result),
        _render_final_verdict(result),
    ]

    return '\n\n'.join(sections)


def _render_header(result: AnalysisResult) -> str:
    word_label = 'word' if result.word_count == 1 else 'words'
    sent_label = 'sentence' if result.sentence_count == 1 else 'sentences'
    return (
        "=" * 72 + "\n"
        "THE ABSOLUTION ENGINE — FORENSIC TEXT AUDIT\n"
        "=" * 72 + "\n\n"
        f"Specimen received: {result.word_count} {word_label} across "
        f"{result.sentence_count} {sent_label}.\n"
        f"Average sentence length: {result.avg_sentence_length} words."
    )


def _render_text_metrics(result: AnalysisResult) -> str:
    lines = ["TEXT ARCHITECTURE", "-" * 72]

    if result.sentence_count > 0:
        longest = max(result.sentences, key=lambda s: len(s.text.split()))
        shortest = min(result.sentences, key=lambda s: len(s.text.split()))
        lines.append(
            f"  Longest sentence: {len(longest.text.split())} words"
        )
        lines.append(
            f"  Shortest sentence: {len(shortest.text.split())} words"
        )

    if result.avg_sentence_length > 25:
        lines.append(
            "  Note: Sentence length exceeds 25 words on average. Extended "
            "clauses often serve as burial grounds for accountability."
        )
    elif result.avg_sentence_length < 8:
        lines.append(
            "  Note: Very short sentences. Staccato rhythm can indicate "
            "defensive brevity — a refusal to elaborate."
        )

    return '\n'.join(lines)


def _render_hedging_analysis(result: AnalysisResult) -> str:
    lines = ["HEDGING LANGUAGE", "-" * 72]

    hedge_count = len(result.hedging_instances)
    rate = result.hedging_rate

    if hedge_count == 0:
        lines.append("  No hedging language detected.")
        lines.append(
            "  This is either unusual honesty or an unusually short text."
        )
        return '\n'.join(lines)

    lines.append(
        f"  {hedge_count} hedging construction"
        f"{'s' if hedge_count != 1 else ''} detected."
    )
    lines.append(
        f"  Rate: {rate:.2f} per sentence ({hedge_count} across "
        f"{result.sentence_count} sentences)."
    )

    if rate > 1.0:
        lines.append(
            "  ALERT: You hedge more than once per sentence on average. "
            "Your confession is built on a foundation of qualified statements."
        )
    elif rate > 0.5:
        lines.append(
            "  SIGNIFICANT: Hedging appears in more than half your sentences. "
            "You are constructing exit routes from your own admissions."
        )

    phrase_counts = {}
    for h in result.hedging_instances:
        lower = h.phrase.lower()
        phrase_counts[lower] = phrase_counts.get(lower, 0) + 1

    if phrase_counts:
        lines.append("")
        lines.append("  Hedging vocabulary breakdown:")
        sorted_phrases = sorted(phrase_counts.items(), key=lambda x: -x[1])
        for phrase, count in sorted_phrases[:6]:
            bar = '█' * count
            lines.append(f'    "{phrase}" {bar} ({count})')

    if rate > 0.7:
        lines.append("")
        lines.append(
            '  You say "I think" or "I feel" when you mean "I did." '
            "The distance between thought and action is where responsibility "
            "goes to die."
        )

    return '\n'.join(lines)


def _render_passive_analysis(result: AnalysisResult) -> str:
    lines = ["PASSIVE VOICE CONSTRUCTIONS", "-" * 72]

    passive_count = len(result.passive_instances)
    rate = result.passive_rate
    agentless_rate = result.agentless_passive_rate

    if passive_count == 0:
        lines.append("  No passive voice constructions detected.")
        lines.append(
            "  You take grammatical ownership of your verbs. This is noted — "
            "and statistically unusual."
        )
        return '\n'.join(lines)

    lines.append(
        f"  {passive_count} passive construction"
        f"{'s' if passive_count != 1 else ''} detected."
    )
    lines.append(f"  Rate: {rate:.2f} per sentence.")

    agentless_count = sum(
        1 for p in result.passive_instances if not p.has_agent
    )
    agented_count = passive_count - agentless_count

    lines.append(
        f"  Agentless passives: {agentless_count} "
        f"({agentless_rate:.0%} of passives)"
    )
    lines.append(
        f"  Agented passives: {agented_count} "
        f"({1 - agentless_rate:.0%} of passives)"
    )

    if agentless_count > agented_count:
        lines.append("")
        lines.append(
            "  You favor constructions where things simply happen — no one "
            'does them. "Mistakes were made" rather than "I made mistakes." '
            "The passive voice is the grammar of the unaccountable."
        )

    if passive_count > 0:
        lines.append("")
        lines.append("  Passive constructions found:")
        seen = set()
        for p in result.passive_instances:
            excerpt = _extract_excerpt(result.raw_text, p.start, p.end, 20)
            if excerpt not in seen:
                seen.add(excerpt)
                agent_status = (
                    "agentless" if not p.has_agent
                    else f'agent: "{p.agent_text}"'
                )
                lines.append(f'    "{excerpt}" [{agent_status}]')

    return '\n'.join(lines)


def _render_pronoun_analysis(result: AnalysisResult) -> str:
    lines = ["PRONOUN DISTRIBUTION", "-" * 72]

    pron = result.pronoun_analysis

    if pron.total_pronouns == 0:
        lines.append("  No personal pronouns detected in text.")
        lines.append(
            "  Complete absence of pronouns suggests extreme distancing — "
            "or very short text."
        )
        return '\n'.join(lines)

    lines.append(f"  Total pronouns: {pron.total_pronouns}")
    lines.append(
        f"    First-person singular (I/me/my/mine/myself): {pron.first_singular}"
    )
    lines.append(
        f"    First-person plural (we/us/our/ours/ourselves): {pron.first_plural}"
    )
    lines.append(f"    Second-person (you/your/yours): {pron.second_person}")
    lines.append(f"    Third-person (he/she/it/they): {pron.third_person}")

    lines.append("")
    first_pct = result.first_person_rate * 100
    first_sg_pct = result.first_person_singular_rate * 100

    lines.append(f"  First-person rate: {first_pct:.1f}% of all pronouns")
    lines.append(
        f"  First-person singular rate: {first_sg_pct:.1f}% of all pronouns"
    )

    if pron.first_plural > pron.first_singular:
        lines.append("")
        lines.append(
            '  You say "we" more than "I." You are distributing responsibility '
            "across a collective that may not have consented to share it."
        )

    if pron.second_person > pron.first_singular * 0.5 and pron.second_person > 0:
        plural = 's' if pron.second_person != 1 else ''
        lines.append("")
        lines.append(
            f"  Second-person pronouns appear {pron.second_person} time"
            f"{plural}. You address the reader directly — perhaps seeking "
            "a witness, perhaps deflecting."
        )

    if pron.avoidance_ratio > 0.7 and pron.total_pronouns > 5:
        lines.append("")
        lines.append(
            f"  First-person avoidance ratio: {pron.avoidance_ratio:.2f}. "
            "You minimize your own presence in your own confession. "
            'The "I" that should anchor this text is barely present.'
        )
    elif pron.avoidance_ratio < 0.3 and pron.total_pronouns > 5:
        lines.append("")
        lines.append(
            f"  First-person avoidance ratio: {pron.avoidance_ratio:.2f}. "
            "You name yourself freely. Grammatically, at least, you are present."
        )

    if pron.total_pronouns > 0:
        lines.append("")
        lines.append("  Pronoun presence map:")
        max_count = max(
            pron.first_singular, pron.first_plural,
            pron.second_person, pron.third_person, 1
        )
        for label, count in [
            ("I/me/my   ", pron.first_singular),
            ("we/us/our  ", pron.first_plural),
            ("you/your   ", pron.second_person),
            ("he/she/they", pron.third_person),
        ]:
            bar_len = int((count / max_count) * 30) if count > 0 else 0
            bar = '█' * bar_len
            lines.append(f"    {label} {bar} ({count})")

    return '\n'.join(lines)


def _render_adverb_analysis(result: AnalysisResult) -> str:
    lines = ["QUALIFYING ADVERBS", "-" * 72]

    adverb_count = len(result.adverb_instances)
    density = result.adverb_density

    if adverb_count == 0:
        lines.append("  No qualifying adverbs detected.")
        lines.append(
            "  You do not soften. You do not qualify. This is either "
            "directness or the inability to moderate."
        )
        return '\n'.join(lines)

    lines.append(
        f"  {adverb_count} qualifying adverb"
        f"{'s' if adverb_count != 1 else ''} detected."
    )
    lines.append(f"  Density: {density:.2f} per 100 words.")

    category_counts = {}
    for a in result.adverb_instances:
        category_counts[a.category] = category_counts.get(a.category, 0) + 1

    lines.append("")
    lines.append("  Qualification strategy breakdown:")
    category_labels = {
        'diminishers': 'Diminishers (reducing scope)',
        'mitigators': 'Mitigators (softening impact)',
        'doubt_markers': 'Doubt markers (introducing uncertainty)',
        'shielding': 'Shielding words (preemptive defense)',
    }
    for cat, label in category_labels.items():
        count = category_counts.get(cat, 0)
        if count > 0:
            lines.append(f"    {label}: {count}")

    word_counts = {}
    for a in result.adverb_instances:
        lower = a.word.lower()
        word_counts[lower] = word_counts.get(lower, 0) + 1

    if word_counts:
        lines.append("")
        lines.append("  Most frequent qualifiers:")
        sorted_words = sorted(word_counts.items(), key=lambda x: -x[1])
        for word, count in sorted_words[:5]:
            plural = 's' if count != 1 else ''
            lines.append(f'    "{word}" — {count} occurrence{plural}')

    if density > 5.0:
        lines.append("")
        lines.append(
            "  Your text is saturated with qualifying language. Every statement "
            "comes with a safety catch. You are building a confession that "
            "cannot hurt you."
        )
    elif density > 2.0:
        lines.append("")
        lines.append(
            "  Qualifying adverbs appear regularly. You are making your words "
            "soft — easier to say, easier to take back."
        )

    return '\n'.join(lines)


def _render_sentence_deep_analysis(result: AnalysisResult) -> str:
    lines = ["SENTENCE-LEVEL EVASION ANALYSIS", "-" * 72]

    if not result.sentences:
        return '\n'.join(lines + ["  No sentences to analyze."])

    scores = [s.evasion_score for s in result.sentences]
    max_score = max(scores)
    min_score = min(scores)
    avg_score = sum(scores) / len(scores)

    lines.append(f"  Average evasion score: {avg_score:.3f} / 1.000")
    lines.append(f"  Highest evasion score: {max_score:.3f} / 1.000")
    lines.append(f"  Lowest evasion score: {min_score:.3f} / 1.000")

    high_evasion = [s for s in result.sentences if s.evasion_score > 0.3]
    if high_evasion:
        lines.append("")
        plural = 's' if len(high_evasion) != 1 else ''
        lines.append(
            f"  {len(high_evasion)} sentence{plural} "
            f"with evasion score above 0.300:"
        )
        for s in sorted(high_evasion, key=lambda x: -x.evasion_score)[:5]:
            excerpt = _truncate_text(s.text, 60)
            lines.append(f'    [{s.evasion_score:.3f}] "{excerpt}"')
            for factor in s.evasion_factors:
                lines.append(f"           └─ {factor}")

    low_evasion = [s for s in result.sentences if s.evasion_score < 0.1]
    if low_evasion:
        lines.append("")
        plural = 's' if len(low_evasion) != 1 else ''
        lines.append(
            f"  {len(low_evasion)} sentence{plural} "
            f"with evasion score below 0.100 (relatively direct):"
        )
        for s in sorted(low_evasion, key=lambda x: x.evasion_score)[:3]:
            excerpt = _truncate_text(s.text, 60)
            lines.append(f'    [{s.evasion_score:.3f}] "{excerpt}"')

    if len(result.sentences) > 1:
        lines.append("")
        lines.append("  Full evasion heatmap:")
        for s in result.sentences:
            bar_len = max(int(s.evasion_score * 40), 1)
            block_idx = min(int(s.evasion_score * 4), 3)
            block = '░▒▓█'[block_idx]
            bar = block * bar_len
            excerpt = _truncate_text(s.text, 30)
            lines.append(
                f"    S{s.index+1:02d} {bar} {s.evasion_score:.2f} "
                f'"{excerpt}"'
            )

    return '\n'.join(lines)


def _render_overall_evasion(result: AnalysisResult) -> str:
    lines = ["OVERALL EVASION INDEX", "-" * 72]

    overall = result.overall_evasion_index

    lines.append(f"  Composite evasion index: {overall:.3f} / 1.000")
    lines.append("")
    lines.append("  Contributing factors:")

    summary = result.evasion_summary
    max_val = max(summary.values()) if summary else 1.0

    for factor, value in sorted(summary.items(), key=lambda x: -x[1]):
        label = factor.replace('_', ' ').title()
        bar_len = int((value / max(max_val, 0.001)) * 25) if value > 0 else 0
        bar = '█' * bar_len
        lines.append(f"    {label:30s} {bar} {value:.3f}")

    lines.append("")

    if overall > 0.6:
        lines.append(
            "  CLASSIFICATION: HIGH EVASION — This confession is constructed "
            "as a defense. You are telling the truth the way a lawyer would."
        )
    elif overall > 0.35:
        lines.append(
            "  CLASSIFICATION: MODERATE EVASION — You are telling the truth "
            "but not all of it, and not directly. The architecture of distance "
            "is present."
        )
    elif overall > 0.15:
        lines.append(
            "  CLASSIFICATION: LOW-MODERATE EVASION — Some hedging and "
            "qualification, but the text carries more directness than not."
        )
    else:
        lines.append(
            "  CLASSIFICATION: LOW EVASION — You say what you did with "
            "minimal softening. Whether this is honesty or simply "
            "a lack of imagination is not for this tool to determine."
        )

    return '\n'.join(lines)


def _render_final_verdict(result: AnalysisResult) -> str:
    """
    The devastating synthesis. A single observation that ties the analysis
    together into something that reads like it knows something about you
    that you didn't know.
    """
    lines = ["=" * 72]
    lines.append("VERDICT")
    lines.append("=" * 72)
    lines.append("")

    verdict = _synthesize_verdict(result)
    lines.append(verdict)
    lines.append("")
    lines.append("─" * 72)
    lines.append(
        "  This is not absolution. This is an audit. You provided the data."
    )
    lines.append("─" * 72)

    return '\n'.join(lines)


def _synthesize_verdict(result: AnalysisResult) -> str:
    """
    Select and compose a verdict based on the specific pattern of evasion
    detected. The verdict should feel personalized — like it saw something
    the user didn't know they were revealing.
    """
    pron = result.pronoun_analysis
    hedge_count = len(result.hedging_instances)
    passive_count = len(result.passive_instances)
    agentless = sum(1 for p in result.passive_instances if not p.has_agent)
    adverb_count = len(result.adverb_instances)
    overall = result.overall_evasion_index

    themes = []

    # Pronoun-based insight
    if pron.total_pronouns > 5:
        if pron.first_plural > pron.first_singular * 2:
            themes.append(
                f'You use "we" {pron.first_plural} times against "I" '
                f"{pron.first_singular} times. You arrived alone to this "
                "confession but brought a crowd to share the weight. "
                "The plural is not a shelter, even when you use it like one."
            )
        elif pron.avoidance_ratio > 0.75:
            themes.append(
                f"Of {pron.total_pronouns} personal pronouns, only "
                f"{pron.first_singular} are first-person singular. You "
                "have written a confession with yourself barely in it. "
                "The text describes what happened; you are not among the actors."
            )
        elif pron.second_person > pron.first_singular:
            themes.append(
                f'You address "you" more often than you name "I" '
                f"({pron.second_person} vs {pron.first_singular}). "
                "This confession is directed outward, not inward. "
                "You are explaining to someone rather than accounting to yourself."
            )

    # Passive-based insight
    if passive_count > 0 and agentless > 0:
        pct_agentless = int((agentless / passive_count) * 100)
        themes.append(
            f"{pct_agentless}% of your passive constructions are agentless — "
            "things happen without anyone doing them. "
            '"It was decided." "The situation was handled." '
            "The missing agent in each sentence is where you are hiding."
        )

    # Hedging-based insight
    if hedge_count > 3:
        per_sent = (
            hedge_count / result.sentence_count
            if result.sentence_count else 0
        )
        themes.append(
            f"You hedge {per_sent:.1f} times per sentence. "
            'Each "I think" and "maybe" and "sort of" is a door '
            'left open — a clause that lets you say "that\'s not what I meant" '
            "later. You are not confessing; you are drafting a disclaimer."
        )

    # Adverb-based insight
    if adverb_count > 4:
        diminishers = [
            a for a in result.adverb_instances if a.category == 'diminishers'
        ]
        if len(diminishers) > 2:
            themes.append(
                f"You diminish {len(diminishers)} times. \"Just,\" \"only,\" "
                "\"barely\" — you are making what you did smaller with each word. "
                "But the thing you did has not changed size. Only the language "
                "around it has."
            )
        doubt_markers = [
            a for a in result.adverb_instances if a.category == 'doubt_markers'
        ]
        if len(doubt_markers) > 1:
            themes.append(
                f"You mark {len(doubt_markers)} things with doubt — \"maybe,\" "
                "\"perhaps,\" \"supposedly.\" You are not describing what "
                "happened; you are negotiating the terms of what happened."
            )

    # Sentence-level insight
    if result.sentences:
        high_evade = [s for s in result.sentences if s.evasion_score > 0.4]
        low_evade = [s for s in result.sentences if s.evasion_score < 0.1]
        if len(high_evade) > 2 and len(low_evade) > 0:
            themes.append(
                "Your most direct sentences are bracketed by evasion. You say "
                "something honest, then immediately surround it with "
                "qualifications. The truth in your text is always escorted."
            )

    # Composite judgment when evasion is high but no specific pattern triggered
    if overall > 0.5 and not themes:
        themes.append(
            f"Your evasion index is {overall:.3f}. You have constructed a "
            "confession that carefully avoids the weight of confession. "
            "Every mechanism of distance is represented: hedging, passivity, "
            "qualification, dispersal of agency. You wrote this to feel better. "
            "It won't work."
        )
    elif overall < 0.15 and not themes:
        themes.append(
            f"Your evasion index is {overall:.3f}. This is low. You write "
            "with a directness that is either honest or artless — this tool "
            "cannot distinguish the two. What it can say: you have not "
            "significantly armored your language. The question becomes whether "
            "this is because you have nothing to hide, or because you are "
            "confident the truth won't hurt you."
        )

    # Fallback — text too short or too clean
    if not themes:
        themes.append(
            "The text is too short or too clean for a pattern to emerge. "
            "Either you are exceptionally direct, or you haven't said enough "
            "for the architecture of your evasion to become visible. "
            "Say more, and the shape will appear."
        )

    # Select the most specific, devastating theme
    themes.sort(key=len, reverse=True)
    verdict_body = themes[0]

    # Wrap to 72 columns with 2-space indent
    wrapped = textwrap.fill(
        verdict_body,
        width=70,
        initial_indent="  ",
        subsequent_indent="  "
    )

    return wrapped


def _extract_excerpt(
    text: str, start: int, end: int, context: int = 25
) -> str:
    """Extract a text excerpt with surrounding context."""
    excerpt_start = max(0, start - context)
    excerpt_end = min(len(text), end + context)
    excerpt = text[excerpt_start:excerpt_end].strip()

    prefix = "..." if excerpt_start > 0 else ""
    suffix = "..." if excerpt_end < len(text) else ""

    return prefix + excerpt + suffix


def _truncate_text(text: str, max_len: int = 50) -> str:
    """Truncate text with ellipsis if needed."""
    text = text.strip()
    if len(text) <= max_len:
        return text
    return text[:max_len - 3] + "..."
