const forensic = {
  headers: [
    'REPUDIATION — FINAL AND IRREVOCABLE',
    'STATEMENT OF SEVERANCE',
    'THIS IS WHAT HAPPENED AND THIS IS WHAT IT MEANS',
    'RECORD OF TERMINATION',
    'DOCUMENT OF DISAVOWAL'
  ],

  identifications: [
    'Subject of repudiation: {subject}',
    'What is being renounced: {subject}',
    'The matter: {subject}',
    'Addressed herein: {subject}',
    'Item under severance: {subject}'
  ],

  openings: [
    'This is not a letter. This is not an explanation. This is the record of a conclusion reached in silence and now stated aloud because silence has been mistaken for consent.',
    'There is a version of this that would be measured and professional. That version would be a lie. What follows is accurate, and that matters more than diplomacy.',
    'I have written this because unwritten renunciations get rewritten by memory into something softer. This exists so the softening cannot happen.',
    'The purpose of this statement is not to inform. It is to fix a position so permanently that future attempts to revise it will collide with this text and fail.',
    'The specificity of this document may cause discomfort. I considered making it less specific. I decided the discomfort was the point.'
  ],

  detailPatterns: [
    'Let me be precise. {specifics}. These are not approximations. They are what happened.',
    'The details matter because without them this becomes the kind of vague disavowal that can be walked back. So: {specifics}. Recorded, dated, not subject to reinterpretation.',
    'Specifically: {specifics}. Not alleged. Not characterized. Stated.',
    'To be exact: {specifics}. Stated plainly because the truth does not require padding.',
    'The record should reflect: {specifics}. These facts are not in dispute because they are not presented for dispute.'
  ],

  accusationClauses: [
    'This was not a misunderstanding. Misunderstandings are accidental. This was a pattern that continued for as long as it was permitted, and it was permitted too long.',
    'There is no generous interpretation available. I have looked. The generous interpretations require omitting facts, and the facts refuse to be omitted.',
    'The responsibility is not shared. There are situations where blame distributes evenly. This is not one of them.',
    'What was done was done with full knowledge of what it was. The question of intent is answered by the consistency of the actions.',
    'There were opportunities to alter course. They were visible and they were declined. Declined repeatedly, deliberately, with an awareness that makes mitigation impossible.'
  ],

  contextClauses: [
    'I am aware that context is supposed to matter. I have considered the context. The context does not help.',
    'The circumstances do not excuse what occurred within them. They explain nothing that reduces the weight of what happened.',
    'Every relevant factor has been accounted for. The accounting does not produce a different result.',
    'There is no version of events in which {context_ref} alters the conclusion. The conclusion stands regardless of the angle.',
    'I have been told to consider the broader picture. I have. The broader picture contains the same details, just further away.'
  ],

  renunciationClauses: [
    'I repudiate it completely. Not partially, not with exceptions, not with a clause for future reconsideration. Completely.',
    'The break is total. There is no remnant of the previous position that survives this statement. It is not suspended — it is annihilated.',
    'Whatever was believed, owed, assumed, or implied is nullified. Not renegotiated. Nullified.',
    'This is not a distancing. This is an excision. What is being removed is not being relocated — it is being eliminated.',
    'The renunciation applies to the stated subject and to every adjacent assumption, implication, and informal understanding that attached itself to that subject. All of it. Gone.'
  ],

  irrevocabilityClauses: [
    'This is not a threat or a bargaining position. It is the closing of a door and the bricking-up of the doorway.',
    'There is no pathway from this statement back to the position it terminates. That pathway has been identified and destroyed.',
    'I will not be revisiting this. Not tomorrow, not after reflection, not after time has softened anything. Time does not soften facts. It only obscures them, and that is why this document exists.',
    'Any attempt to reopen this matter will be taken as evidence that the repudiation was necessary and insufficiently thorough.',
    'This is final in the way that death is final — not because nothing follows, but because what follows cannot alter what happened here.'
  ],

  finalDeclarations: [
    'Let the record show this was stated clearly, on {date}, without coercion and without ambiguity. Whatever happened after this point happened in full knowledge that this position had been taken.',
    'This is the last statement on this matter. Not the last for now — the last. There is nothing more to be said that would not dilute what has already been said.',
    'Consider this the fixed point. Everything before it led here. Everything after it proceeds from a place where this has been said and cannot be unsaid.',
    'There is nothing after this paragraph. Not because there is more to say — there is always more to say — but because saying more would imply the repudiation requires elaboration. It does not.',
    'This ends here. Not gracefully. Endings that matter never are.'
  ],

  signatures: [
    'Filed: {date}\nWitness: The record itself',
    'Stated: {date}\nAttested by: No one. It does not require a witness.',
    'Recorded: {date}\nStatus: Final',
    'Declared: {date}\nMethod: Written, permanent, deliberately unretractable',
    'Sealed: {date}\nThere is no appeal process.'
  ],

  generate(subject, date, specifics, contextRef) {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    specifics = specifics || 'the details are known to the relevant parties and will not be restated here for the sake of their comfort';
    contextRef = contextRef || 'any contextual factor';

    return [
      pick(this.headers),
      '',
      pick(this.identifications).replace('{subject}', subject),
      '',
      pick(this.openings),
      '',
      pick(this.detailPatterns).replace('{specifics}', specifics),
      '',
      pick(this.accusationClauses),
      '',
      pick(this.contextClauses).replace('{context_ref}', contextRef),
      '',
      pick(this.renunciationClauses),
      '',
      pick(this.irrevocabilityClauses),
      '',
      pick(this.finalDeclarations).replace('{date}', date),
      '',
      pick(this.signatures).replace('{date}', date)
    ].join('\n');
  }
};

module.exports = forensic;
