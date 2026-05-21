const bureaucratic = {
  headers: [
    'DOCUMENT OF FORMAL SEPARATION\nREFERENCE: {ref}\nSTATUS: EXECUTED',
    'INSTRUMENT OF DISENDORSEMENT\nFILE: {ref}\nDISPOSITION: COMPLETE',
    'NOTICE OF TERMINATED AFFILIATION\nDOCKET: {ref}\nCLASSIFICATION: FINAL',
    'CERTIFICATE OF NON-ASSOCIATION\nSERIAL: {ref}\nRECORD TYPE: IRREVOCABLE',
    'DECLARATION OF CESSATION\nREGISTRY: {ref}\nACTION: PERMANENT'
  ],

  openings: [
    'The party of the first part hereby notifies all relevant parties that the following position has been reviewed and found to be without further basis for continuation.',
    'Pursuant to internal review, this document serves as formal notice that the below-stated matter is considered closed with no possibility of reinstatement.',
    'This instrument certifies that the previously held position described herein has been evaluated, catalogued, and permanently archived with no option for retrieval.',
    'Let it be recorded that the subscribing party has completed all necessary processes regarding the below-referenced subject and has determined that no further engagement is warranted.',
    'Formal notice is hereby given that the position identified below has been processed through appropriate channels and marked as terminated in full.'
  ],

  bodyTemplates: [
    'The subject matter in question, specifically: {subject}',
    'Regarding the previously documented item described as: {subject}',
    'With reference to the matter classified under the general heading of: {subject}',
    'The file item herein designated for termination, to wit: {subject}',
    'The formerly maintained position categorized as: {subject}'
  ],

  rationaleClauses: [
    'is found to be incompatible with current operational parameters and is stricken from all active records.',
    'has been assessed as no longer viable under any applicable framework and is discontinued without prejudice to future determinations on unrelated matters.',
    'is determined to constitute a classification error, having been maintained past the point of relevance, and is now reclassified as null and void.',
    'fails to meet minimum thresholds for continued recognition and is hereby removed from all registries and informal records alike.',
    'has been reviewed and found to contain insufficient grounds for perpetuation. All associated obligations, expressed or implied, are dissolved.'
  ],

  declarations: [
    'Effective immediately, all endorsements, tacit or explicit, are withdrawn.',
    'As of the date of this instrument, no statement of support shall be attributed to the subscribing party.',
    'No future communication, representation, or implication of continued association shall be authorized.',
    'This termination applies retroactively and prospectively. No period of prior association shall be construed as an ongoing obligation.',
    'All duties, courtesies, and considerations formerly extended are revoked in full and without exception.'
  ],

  temporalClauses: [
    'This determination is final and applies without temporal limitation.',
    'No review period is established or implied. This action is permanent.',
    'The effective date is irrevocable and applies to all past and future contexts.',
    'There is no expiration date on this instrument. It remains in force indefinitely.',
    'Time shall not diminish the force of this declaration.'
  ],

  finalities: [
    'No further correspondence regarding this matter will be received or acknowledged.',
    'Requests for clarification will be treated as null submissions.',
    'Any attempt to reopen this matter will be documented and dismissed without response.',
    'This document constitutes the entirety of the subscribing party\'s position. There is nothing further to add.',
    'The file is closed. The record is sealed. The matter is concluded.'
  ],

  closings: [
    'SUBSCRIBED AND ATTESTED\nAUTOMATED REPUDIATION SERVICE\n{date}',
    'EXECUTED IN ACCORDANCE WITH STANDARD PROCEDURES\nREPUDIATION ENGINE v1.0\n{date}',
    'PROCESSED AND FILED\nNO FURTHER ACTION REQUIRED\n{date}',
    'RECORDED WITHOUT OBJECTION\nTHIS INSTRUMENT IS COMPLETE\n{date}',
    'APPROVED AS SUBMITTED\nDOCUMENT LOCKED AGAINST MODIFICATION\n{date}'
  ],

  generate(subject, date, ref) {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    return [
      pick(this.headers).replace('{ref}', ref),
      '',
      pick(this.openings),
      '',
      pick(this.bodyTemplates).replace('{subject}', subject) + ' ' + pick(this.rationaleClauses),
      '',
      pick(this.declarations),
      '',
      pick(this.temporalClauses),
      '',
      pick(this.finalities),
      '',
      pick(this.closings).replace('{date}', date)
    ].join('\n');
  }
};

module.exports = bureaucratic;
