import re
from collections import Counter
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass, field


@dataclass
class HedgingMatch:
    phrase: str
    start: int
    end: int
    sentence_index: int
    evasion_weight: float

@dataclass
class PassiveMatch:
    full_match: str
    verb_phrase: str
    start: int
    end: int
    sentence_index: int
    has_agent: bool
    agent_text: Optional[str]

@dataclass
class PronounAnalysis:
    total_first_person: int
    first_singular: int
    first_plural: int
    second_person: int
    third_person: int
    total_pronouns: int
    avoidance_ratio: float

@dataclass
class AdverbMatch:
    word: str
    category: str
    start: int
    end: int
    sentence_index: int
    intensity_modifier: float

@dataclass
class Sentence:
    text: str
    start: int
    end: int
    index: int
    evasion_score: float = 0.0
    evasion_factors: List[str] = field(default_factory=list)

@dataclass
class AnalysisResult:
    raw_text: str
    sentence_count: int
    word_count: int
    avg_sentence_length: float
    sentences: List[Sentence]
    hedging_instances: List[HedgingMatch]
    passive_instances: List[PassiveMatch]
    pronoun_analysis: PronounAnalysis
    adverb_instances: List[AdverbMatch]
    hedging_rate: float
    passive_rate: float
    agentless_passive_rate: float
    adverb_density: float
    first_person_rate: float
    first_person_singular_rate: float
    overall_evasion_index: float
    evasion_summary: Dict[str, float]


HEDGING_PHRASES = [
    # Modal hedging
    r'\bI(?:\s+just)?\s+(?:think|believe|feel|guess|suppose)\b',
    r'\bI\s+(?:sort\s+of|kind\s+of|kinda|sorta)\b',
    r'\bperhaps\b', r'\bmaybe\b', r'\bpossibly\b',
    r'\bit(?:\s+might|may|could)\s+(?:be|seem|appear)\b',
    r'\bseems?\s+like?\b', r'\bappears?\s+to\b',
    r'\bin\s+a\s+(?:way|sense)\b', r'\bto\s+some\s+(?:extent|degree)\b',
    # Diminishment
    r'\ba?\s*little\s+(?:bit\s+)?(?:bit)?\b',
    r'\bsomewhat\b', r'\bkind\s+of\b', r'\bsort\s+of\b',
    r'\bnot\s+(?:really|exactly|entirely|necessarily)\b',
    r'\bonly\s+(?:just|merely)\b',
    # Probabilistic hedging
    r'\bprobably\b', r'\blikely\b', r'\bpresumably\b',
    r'\bapparently\b', r'\barguably\b', r'\bsupposedly\b',
    r'\ballegedly\b', r'\bostensibly\b', r'\bputatively\b',
    # Statement softening
    r'\bI\s+(?:mean|guess)\b', r'\byou\s+know\b',
    r'\bas\s+(?:if|though)\b', r'\bso\s+to\s+speak\b',
    r'\bmore\s+or\s+less\b', r'\bat\s+least\b',
]

PASSIVE_PATTERNS = [
    r'\b(\w+ed)\s+by\s+(?:\w+\s*)+',
    r'\bwas\s+(\w+ed)\b',
    r'\bwere\s+(\w+ed)\b',
    r'\bis\s+being\s+(\w+ed)\b',
    r'\bare\s+being\s+(\w+ed)\b',
    r'\bhas\s+been\s+(\w+ed)\b',
    r'\bhave\s+been\s+(\w+ed)\b',
    r'\bhad\s+been\s+(\w+ed)\b',
    r'\bwill\s+be\s+(\w+ed)\b',
    r'\bwould\s+be\s+(\w+ed)\b',
    r'\bcould\s+be\s+(\w+ed)\b',
    r'\bshould\s+be\s+(\w+ed)\b',
    r'\bgot\s+(\w+ed)\b',
    r'\bgets\s+(\w+ed)\b',
    r'\bended\s+up\s+being\s+(\w+ed)\b',
]

FIRST_PERSON_SINGULAR = [
    r'\bI\b', r'\bme\b', r'\bmy\b', r'\bmine\b', r'\bmyself\b'
]

FIRST_PERSON_PLURAL = [
    r'\bwe\b', r'\bus\b', r'\bour\b', r'\bours\b', r'\bourselves\b'
]

SECOND_PERSON = [
    r'\byou\b', r'\byour\b', r'\byours\b', r'\byourself\b', r'\byourselves\b'
]

THIRD_PERSON = [
    r'\bhe\b', r'\bhim\b', r'\bhis\b', r'\bhimself\b',
    r'\bshe\b', r'\bher\b', r'\bhers\b', r'\bherself\b',
    r'\bit\b', r'\bits\b', r'\bitself\b',
    r'\bthey\b', r'\bthem\b', r'\btheir\b', r'\btheirs\b', r'\bthemselves\b'
]

QUALIFYING_ADVERBS = {
    'diminishers': [
        (r'\bonly\b', 0.7), (r'\bjust\b', 0.7), (r'\bmerely\b', 0.6),
        (r'\bsimply\b', 0.6), (r'\bbarely\b', 0.7), (r'\bscarcely\b', 0.7),
        (r'\bhardly\b', 0.7), (r'\bpartially\b', 0.5), (r'\bpartly\b', 0.5),
    ],
    'mitigators': [
        (r'\balmost\b', 0.4), (r'\bnearly\b', 0.4), (r'\bpractically\b', 0.5),
        (r'\bvirtually\b', 0.5), (r'\bessentially\b', 0.3), (r'\bbasically\b', 0.3),
        (r'\brelatively\b', 0.4), (r'\bcomparatively\b', 0.4),
    ],
    'doubt_markers': [
        (r'\bmaybe\b', 0.8), (r'\bperhaps\b', 0.8), (r'\bpossibly\b', 0.7),
        (r'\bpresumably\b', 0.6), (r'\bsupposedly\b', 0.8), (r'\ballegedly\b', 0.9),
        (r'\bapparently\b', 0.6), (r'\bostensibly\b', 0.8),
    ],
    'shielding': [
        (r'\bsomehow\b', 0.7), (r'\bsomewhat\b', 0.6), (r'\banyway\b', 0.5),
        (r'\banyways\b', 0.5), (r'\btechnically\b', 0.5), (r'\bfrankly\b', 0.3),
        (r'\bhonestly\b', 0.4), (r'\btruthfully\b', 0.4), (r'\bliterally\b', 0.5),
        (r'\bactually\b', 0.3), (r'\breally\b', 0.3), (r'\bquite\b', 0.3),
    ],
}


def _split_sentences(text: str) -> List[Sentence]:
    """Split text into sentences, preserving position information."""
    sentences = []
    # Match sentence boundaries: punctuation followed by whitespace
    pattern = re.compile(r'(?<=[.!?])\s+')
    last_end = 0
    idx = 0

    for match in pattern.finditer(text):
        sentence_text = text[last_end:match.start()].strip()
        if sentence_text:
            sentences.append(Sentence(
                text=sentence_text,
                start=last_end,
                end=match.start(),
                index=idx
            ))
            idx += 1
        last_end = match.end()

    # Capture remaining text after last sentence boundary
    if last_end < len(text):
        remaining = text[last_end:].strip()
        if remaining:
            sentences.append(Sentence(
                text=remaining,
                start=last_end,
                end=len(text),
                index=idx
            ))

    # Fallback: treat entire text as one sentence
    if not sentences and text.strip():
        sentences.append(Sentence(
            text=text.strip(),
            start=0,
            end=len(text),
            index=0
        ))

    return sentences


def _get_sentence_index(char_pos: int, sentences: List[Sentence]) -> int:
    """Map a character position to its sentence index."""
    for sent in sentences:
        if sent.start <= char_pos < sent.end:
            return sent.index
    # If position is at or past the end, return last sentence
    if sentences:
        return sentences[-1].index
    return 0


def _detect_hedging(text: str, sentences: List[Sentence]) -> List[HedgingMatch]:
    """Detect hedging phrases and their evasion weight."""
    matches = []
    for pattern_str in HEDGING_PHRASES:
        try:
            pattern = re.compile(pattern_str, re.IGNORECASE)
        except re.error:
            continue
        for match in pattern.finditer(text):
            sent_idx = _get_sentence_index(match.start(), sentences)
            matches.append(HedgingMatch(
                phrase=match.group(),
                start=match.start(),
                end=match.end(),
                sentence_index=sent_idx,
                evasion_weight=0.6
            ))
    return matches


def _detect_passive_voice(text: str, sentences: List[Sentence]) -> List[PassiveMatch]:
    """Detect passive voice constructions, distinguishing agented vs agentless."""
    matches = []
    for pattern_str in PASSIVE_PATTERNS:
        try:
            pattern = re.compile(pattern_str, re.IGNORECASE)
        except re.error:
            continue
        for match in pattern.finditer(text):
            sent_idx = _get_sentence_index(match.start(), sentences)
            full = match.group()
            verb_phrase = match.group(1) if match.lastindex else ''

            # Look ahead up to 80 characters for "by [agent]"
            window_after = text[match.end():match.end() + 80]
            agent_present = bool(re.search(r'\bby\b', window_after, re.IGNORECASE))
            agent_text = None
            if agent_present:
                agent_match = re.search(
                    r'\bby\s+(\w+(?:\s+\w+){0,3})', window_after, re.IGNORECASE
                )
                if agent_match:
                    agent_text = agent_match.group(0)

            matches.append(PassiveMatch(
                full_match=full,
                verb_phrase=verb_phrase,
                start=match.start(),
                end=match.end(),
                sentence_index=sent_idx,
                has_agent=agent_present,
                agent_text=agent_text
            ))
    return matches


def _analyze_pronouns(text: str) -> PronounAnalysis:
    """Analyze pronoun distribution for first-person avoidance detection."""
    first_sg = sum(
        len(re.findall(p, text, re.IGNORECASE)) for p in FIRST_PERSON_SINGULAR
    )
    first_pl = sum(
        len(re.findall(p, text, re.IGNORECASE)) for p in FIRST_PERSON_PLURAL
    )
    second = sum(
        len(re.findall(p, text, re.IGNORECASE)) for p in SECOND_PERSON
    )
    third = sum(
        len(re.findall(p, text, re.IGNORECASE)) for p in THIRD_PERSON
    )

    total = first_sg + first_pl + second + third

    if total == 0:
        return PronounAnalysis(
            total_first_person=0,
            first_singular=0,
            first_plural=0,
            second_person=0,
            third_person=0,
            total_pronouns=0,
            avoidance_ratio=0.0
        )

    avoidance_ratio = 1.0 - (first_sg / total)

    return PronounAnalysis(
        total_first_person=first_sg + first_pl,
        first_singular=first_sg,
        first_plural=first_pl,
        second_person=second,
        third_person=third,
        total_pronouns=total,
        avoidance_ratio=avoidance_ratio
    )


def _detect_qualifying_adverbs(
    text: str, sentences: List[Sentence]
) -> List[AdverbMatch]:
    """Detect qualifying adverbs that soften or distance."""
    matches = []
    for category, entries in QUALIFYING_ADVERBS.items():
        for pattern_str, intensity in entries:
            try:
                pattern = re.compile(pattern_str, re.IGNORECASE)
            except re.error:
                continue
            for match in pattern.finditer(text):
                sent_idx = _get_sentence_index(match.start(), sentences)
                matches.append(AdverbMatch(
                    word=match.group(),
                    category=category,
                    start=match.start(),
                    end=match.end(),
                    sentence_index=sent_idx,
                    intensity_modifier=intensity
                ))
    return matches


def _compute_sentence_evasion(
    sentences: List[Sentence],
    hedging: List[HedgingMatch],
    passive: List[PassiveMatch],
    adverbs: List[AdverbMatch]
) -> None:
    """Compute evasion score per sentence and identify contributing factors."""
    for sent in sentences:
        score = 0.0
        factors = []

        h_count = sum(1 for h in hedging if h.sentence_index == sent.index)
        if h_count > 0:
            score += h_count * 0.25
            plural = 's' if h_count > 1 else ''
            factors.append(f"{h_count} hedging phrase{plural}")

        p_matches = [p for p in passive if p.sentence_index == sent.index]
        p_count = len(p_matches)
        if p_count > 0:
            agentless = sum(1 for p in p_matches if not p.has_agent)
            score += p_count * 0.2
            if agentless > 0:
                score += agentless * 0.15
                plural = 's' if agentless > 1 else ''
                factors.append(
                    f"{agentless} agentless passive construction{plural}"
                )
            else:
                plural = 's' if p_count > 1 else ''
                factors.append(f"{p_count} passive construction{plural}")

        a_count = sum(1 for a in adverbs if a.sentence_index == sent.index)
        if a_count > 0:
            score += a_count * 0.15
            plural = 's' if a_count > 1 else ''
            factors.append(f"{a_count} qualifying adverb{plural}")

        sent.evasion_score = min(score, 1.0)
        sent.evasion_factors = factors


def analyze(text: str) -> AnalysisResult:
    """
    Perform comprehensive forensic linguistic analysis on confession text.

    Returns an AnalysisResult containing all detected evasion patterns,
    statistical measures, and sentence-level scoring.
    """
    text = text.strip()
    if not text:
        return AnalysisResult(
            raw_text=text, sentence_count=0, word_count=0,
            avg_sentence_length=0.0, sentences=[],
            hedging_instances=[], passive_instances=[],
            pronoun_analysis=_analyze_pronouns(text),
            adverb_instances=[], hedging_rate=0.0, passive_rate=0.0,
            agentless_passive_rate=0.0, adverb_density=0.0,
            first_person_rate=0.0, first_person_singular_rate=0.0,
            overall_evasion_index=0.0, evasion_summary={}
        )

    sentences = _split_sentences(text)
    word_count = len(text.split())
    sent_count = len(sentences)
    avg_sent_len = word_count / sent_count if sent_count else 0.0

    hedging = _detect_hedging(text, sentences)
    passive = _detect_passive_voice(text, sentences)
    pronouns = _analyze_pronouns(text)
    adverbs = _detect_qualifying_adverbs(text, sentences)

    _compute_sentence_evasion(sentences, hedging, passive, adverbs)

    # Compute per-sentence rates
    hedging_rate = len(hedging) / sent_count if sent_count else 0.0
    passive_rate = len(passive) / sent_count if sent_count else 0.0
    agentless_passives = sum(1 for p in passive if not p.has_agent)
    agentless_passive_rate = (
        agentless_passives / len(passive) if passive else 0.0
    )
    adverb_density = len(adverbs) / (word_count / 100.0) if word_count else 0.0
    first_person_rate = (
        pronouns.total_first_person / pronouns.total_pronouns
        if pronouns.total_pronouns else 0.0
    )
    first_singular_rate = (
        pronouns.first_singular / pronouns.total_pronouns
        if pronouns.total_pronouns else 0.0
    )

    # Composite evasion weights — each dimension contributes proportionally
    evasion_weights = {
        'hedging': hedging_rate * 0.3,
        'passive': passive_rate * 0.25,
        'agentless_passive': agentless_passive_rate * passive_rate * 0.2,
        'adverbial_qualification': adverb_density * 0.05,
        'first_person_avoidance': pronouns.avoidance_ratio * 0.2,
    }
    if sent_count:
        avg_evasion = sum(s.evasion_score for s in sentences) / sent_count
        evasion_weights['sentence_level'] = avg_evasion * 0.3

    overall = min(sum(evasion_weights.values()), 1.0)

    return AnalysisResult(
        raw_text=text,
        sentence_count=sent_count,
        word_count=word_count,
        avg_sentence_length=round(avg_sent_len, 1),
        sentences=sentences,
        hedging_instances=hedging,
        passive_instances=passive,
        pronoun_analysis=pronouns,
        adverb_instances=adverbs,
        hedging_rate=round(hedging_rate, 3),
        passive_rate=round(passive_rate, 3),
        agentless_passive_rate=round(agentless_passive_rate, 3),
        adverb_density=round(adverb_density, 3),
        first_person_rate=round(first_person_rate, 3),
        first_person_singular_rate=round(first_singular_rate, 3),
        overall_evasion_index=round(overall, 3),
        evasion_summary={k: round(v, 3) for k, v in evasion_weights.items()}
    )
