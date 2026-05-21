const formal = {
  salutations: [
    'To Whom It Once Concerned',
    'For the Record',
    'To All Relevant Parties, Past and Present',
    'Let This Serve as Notice',
    'To Those Who May Reference This Document'
  ],

  acknowledgments: [
    'There was a time when the following position required no formal renunciation, because it was held without question. That time has passed.',
    'What follows is not a reconsideration but a conclusion. The matter has been settled internally, and this document exists only to record the fact.',
    'This letter requires no response. It is not the beginning of a correspondence. It is the end of one.',
    'The act of writing this is itself the final consideration owed. Nothing before or after carries further obligation.',
    'I am aware that a document such as this implies a gravity that the subject may or may not warrant. I have considered this and find the gravity appropriate.'
  ],

  subjectStatements: [
    'The subject of this repudiation is: {subject}.',
    'What is being renounced, specifically and without reservation, is: {subject}.',
    'This document concerns the following, stated plainly: {subject}.',
    'The matter addressed herein — {subject} — is addressed for the final time.',
    'I state without equivocation that the following is hereby renounced: {subject}.'
  ],

  deliberations: [
    'This is not a decision made in haste. It is the product of extended observation and the reluctant acknowledgment that some positions cannot be maintained without cost to the holder.',
    'The reasoning need not be enumerated here in full. Suffice to say that the evidence, accumulated over time and reviewed without sentiment, admits only one conclusion.',
    'There was a period during which counterarguments were entertained. That period has concluded. The remaining position is the one this document articulates.',
    'I have examined the foundations upon which this belief was constructed. I have found them insufficient. I am satisfied with this finding.',
    'No single event precipitated this determination. It is the aggregate that compels — the slow accumulation that, taken together, eliminates all alternative interpretations.'
  ],

  renunciations: [
    'I renounce it. Not in anger, not in sorrow, but in the plain recognition that what was once tenable no longer is.',
    'The association is terminated. The belief is surrendered. The position is abandoned. These actions are irreversible.',
    'Let there be no ambiguity: the relationship described above is severed, the endorsement withdrawn, and the obligation — perceived or actual — is released.',
    'This repudiation is offered without qualification. There is no version of events under which it would be retracted.',
    'What was given was given. What remains is this statement that what was given will not be given again.'
  ],

  boundaries: [
    'This is not a negotiation. It is a boundary, stated after the fact, for a line that should have been drawn earlier.',
    'There will be no revisiting of this matter. The door is not closed — it was never a door. There was never an opening.',
    'Any attempt to contest this repudiation will be understood as confirmation of the necessity of having made it.',
    'I request nothing and expect nothing. The purpose of this document is not to elicit a response but to ensure the record reflects what has occurred.',
    'This statement exists so that the silence that follows cannot be mistaken for continuation.'
  ],

  finalStatements: [
    'This is the last time I will address this. Not because I cannot, but because there is nothing left to say that deserves to be said.',
    'The matter is concluded. No further correspondence will be entered into.',
    'Consider this the terminal punctuation on a sentence that ran on far longer than it should have.',
    'There is no postscript. There is no "unless." This is complete.',
    'I have no closing sentiment to offer. The repudiation itself is the closing.'
  ],

  signOffs: [
    'Stated without reservation,\n{date}',
    'Recorded and final,\n{date}',
    'This document is complete.\n{date}',
    'No further communication.\n{date}',
    'Filed and closed,\n{date}'
  ],

  generate(subject, date) {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    return [
      pick(this.salutations),
      '',
      pick(this.acknowledgments),
      '',
      pick(this.subjectStatements).replace('{subject}', subject),
      '',
      pick(this.deliberations),
      '',
      pick(this.renunciations),
      '',
      pick(this.boundaries),
      '',
      pick(this.finalStatements),
      '',
      pick(this.signOffs).replace('{date}', date)
    ].join('\n');
  }
};

module.exports = formal;
