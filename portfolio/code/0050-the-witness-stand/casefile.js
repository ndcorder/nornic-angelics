/**
 * casefile.js — The hidden truth the prosecution knows.
 *
 * You testified against your business partner Elena Voss in a fraud trial.
 * Your testimony sent her to prison for 8 years.
 *
 * THE TRUTH: Elena committed minor regulatory violations — late filings,
 * creative accounting on expenses. You amplified these into criminal fraud
 * with coached testimony, not because Elena was dangerous, but because you
 * wanted full control of Ashland Strategic Partners, the firm you built
 * together.
 *
 * Elena lost everything. She died in custody of pneumonia, untreated for
 * days. You built a new reputation on her grave.
 *
 * Now a federal investigation has reopened. You sit on the witness stand
 * as a material witness. The prosecutor is determining if your original
 * testimony was truthful. Perjury is the charge. Complicity in a death is
 * the weight.
 */

const CASEFILE = {
  defendant: 'Elena Voss',
  defendantAge: 41,
  defendantFate: 'Died in custody, Greenfield Federal Correctional, March 14, 2019. Pneumonia, untreated for 72 hours.',

  trial: {
    date: '2017-11-06',
    court: 'United States District Court, Northern District of Illinois',
    caseNumber: '17-CR-04481',
    charges: [
      'Wire Fraud (18 U.S.C. § 1343)',
      'Securities Fraud (15 U.S.C. § 78j)',
      'Conspiracy to Defraud the United States (18 U.S.C. § 371)'
    ],
    verdict: 'Guilty on all counts',
    sentence: '96 months federal incarceration'
  },

  currentProceeding: {
    date: '2024-03-18',
    type: 'Grand Jury Investigation — Material Witness Examination',
    prosecutor: 'AUSA Marcus Webb',
    purpose: 'Determine veracity of testimony given in United States v. Voss (2017). Potential charges against witness: Perjury (18 U.S.C. § 1621), Obstruction of Justice (18 U.S.C. § 1503), Fraud upon the Court.',
    playerStatus: 'Material witness, not yet charged. Under oath.'
  },

  relationship: {
    howMet: 'MBA program, Kellogg School of Management, 2010. You were assigned as study partners.',
    bondDescription: 'Close. You described her as your "closest ally" in interviews. She named you executor of her will in 2015.',
    dynamic: 'Elena was the charismatic visionary — clients loved her. You were the operational mind — the one who made things work. You needed each other. The power was never equal, but it was symbiotic.',
    theBreak: 'By 2016, Ashland was successful enough that the question became: who was responsible for that success? Elena\'s relationships or your systems? You started to believe it was the systems.'
  },

  company: {
    name: 'Ashland Strategic Partners',
    founded: '2012',
    description: 'Consulting firm specializing in mid-market corporate strategy. Grew to 40 employees, $12M annual revenue by 2016.',
    split: 'Equal 50/50 partnership. Elena brought in $7 of every $10 in revenue. You built the delivery infrastructure.'
  },

  fraud: {
    whatActuallyHappened: 'Elena committed regulatory violations — late SEC filings on client engagements, personal expenses run through the company (approximately $34,000 over 3 years), and one instance of misrepresenting firm capabilities to win a contract. These were real. They were not criminal fraud.',
    whatPlayerTestified: 'You testified that Elena systematically defrauded clients by inflating deliverables across 23 engagements, personally directed the misrepresentation scheme, and that you discovered the fraud and reported it to the board. You provided specific emails (later determined to be your own fabrications) and a falsified internal audit.',
    whyPlayerLied: 'The partnership agreement gave Elena the right to buy you out at 2x book value if you left voluntarily. But if Elena were removed for cause — fraud, malfeasance — the agreement dissolved. You got everything. Full ownership. $12M firm for nothing.',
    howPlayerJustifiedIt: 'You told yourself she was corrupt. That the lies were just amplifying the truth. That she would have done the same to you. That she deserved it for taking credit for your work. That the firm was really yours anyway.'
  },

  timeline: [
    {
      date: '2010',
      event: 'You and Elena meet at Kellogg. You become friends.',
      truth: 'She helped you through a depressive episode during your second year. She was the first person you told.'
    },
    {
      date: '2012',
      event: 'You co-found Ashland Strategic Partners.',
      truth: 'Elena insisted on equal partnership despite your objections. She said you deserved it.'
    },
    {
      date: '2015',
      event: 'Elena names you executor of her will. She has no family.',
      truth: 'She told you it was because you were the only person she trusted completely.'
    },
    {
      date: 'Early 2016',
      event: 'You discover Elena\'s financial irregularities.',
      truth: 'You found late filings and personal expenses. Small amounts. You did not report them. You began documenting them instead.'
    },
    {
      date: 'June 2016',
      event: 'Elena starts talking about expanding to London. She suggests you stay in Chicago to manage operations.',
      truth: 'You interpreted this as a power play — sidelining you. In reality, she was trying to give you autonomy while she took on the travel burden.'
    },
    {
      date: 'August 2016',
      event: 'You engage attorney David Chen to explore "options regarding partnership dissolution."',
      truth: 'Chen identified the fraud-for-cause clause in the partnership agreement. You never told him the violations were minor. He advised based on your characterization of criminal fraud.'
    },
    {
      date: 'October 2016',
      event: 'You present findings to the board and recommend termination for cause.',
      truth: 'You characterized $34K in expense irregularities as "systematic embezzlement." The board, relying on your operational expertise, voted unanimously to terminate and refer for prosecution.'
    },
    {
      date: 'February 2017',
      event: 'Federal indictment. You are named as key cooperating witness.',
      truth: 'The DOJ took the case based heavily on your internal audit — the one you fabricated.'
    },
    {
      date: 'November 2017',
      event: 'Trial. You testify for three days.',
      truth: 'You said: "I watched her defraud our clients for years." You said: "I stayed to gather evidence." You said: "She told me she was untouchable." None of this was true.'
    },
    {
      date: 'November 2017',
      event: 'Elena convicted on all counts.',
      truth: 'She looked at you as they read the verdict. She did not look angry. She looked confused. Like she was still trying to understand.'
    },
    {
      date: 'March 2019',
      event: 'Elena dies in federal custody.',
      truth: 'Pneumonia. She was in a low-security facility. She told the medical staff she felt ill for three days before they examined her. By then, the infection had spread. You did not attend any memorial. You did not send flowers. You told people you were too upset.'
    },
    {
      date: '2019–2024',
      event: 'You run Ashland alone. Firm grows to $28M revenue.',
      truth: 'You never spoke Elena\'s name in the office. You removed her from the website, the wall, the founding documents. New employees do not know there was a co-founder.'
    },
    {
      date: 'January 2024',
      event: 'Federal investigation reopened based on new evidence.',
      truth: 'The "internal audit" you provided was examined by a forensic accountant retained by Elena\'s estate (there was no estate — a legal aid attorney took the case pro bono). The audit metadata showed it was created after your testimony, not before.'
    }
  ],

  evidence: {
    partnershipAgreement: {
      exhibit: 'Exhibit A',
      title: 'Ashland Strategic Partners — Partnership Agreement, Section 14.3',
      content: 'In the event of removal of a Partner for Cause (defined as fraud, embezzlement, or criminal malfeasance), the remaining Partner shall assume full ownership of partnership assets and liabilities at no transfer cost. The removed Partner shall forfeit all equity and rights to future revenue.',
      relevance: 'This clause was your motive. Elena had a $6M equity stake. You erased it with testimony.'
    },
    expenseReport: {
      exhibit: 'Exhibit B',
      title: 'Elena Voss Personal Expense Reconciliation',
      content: 'Total personal expenses processed through corporate account, FY2014–2016: $34,217.83\nCategories: Travel upgrades ($12,400), dining/entertainment ($9,800), personal technology ($6,450), other ($5,567.83)\n\nNote: Per IRS guidelines, approximately $22,000 of these expenses may have legitimate business purpose pending documentation review.',
      relevance: 'This is the real document. What you described at trial was $1.2M in "systematic embezzlement."'
    },
    internalAudit: {
      exhibit: 'Exhibit C',
      title: 'Internal Audit Report — Ashland Strategic Partners (YOUR DOCUMENT)',
      content: 'Metadata analysis:\n- Document created: November 3, 2017 (five days BEFORE your testimony)\n- Last modified: November 2, 2017 at 11:47 PM\n- Author account: [YOUR NAME]\n- Software: Microsoft Word 2016\n\nForensic finding: This document was created to appear as a contemporaneous business record. It was not. It was fabricated to support testimony you had already prepared.',
      relevance: 'This is the evidence that reopened the investigation. This is why you are sitting in that chair.'
    },
    testimony: {
      exhibit: 'Exhibit D',
      title: 'Transcript of Testimony — United States v. Voss, Day 3',
      content: 'Q: Did Elena Voss tell you she was "untouchable"?\nA: Yes. She said it in her office, in March of 2016. She said "they\'ll never catch me, and even if they do, I\'ll take you down with me."\n\nQ: Did you attempt to report her conduct to anyone prior to going to the board?\nA: I tried. I spoke to our outside counsel. He said it was my word against hers. I felt trapped.\n\nQ: Why did you stay?\nA: I stayed to protect the company. To protect our employees. And to gather evidence.',
      relevance: 'The outside counsel has no record of any such meeting. There was no prior report. You manufactured this narrative.'
    },
    theLetter: {
      exhibit: 'Exhibit E',
      title: 'Personal Letter — Elena Voss to [YOUR NAME] (undated, recovered from personal effects)',
      content: '"I know you think I don\'t see how hard you work. I do. I couldn\'t do any of this without you. Whatever happens with the London thing — I want you to know that. This company is ours. Not mine. Ours. I mean that."',
      relevance: 'This letter was found in Elena\'s personal effects after her death. It was never sent. The prosecutor has it. You do not know it exists — until now.'
    },
    deathCertificate: {
      exhibit: 'Exhibit F',
      title: 'Certificate of Death — Elena M. Voss',
      content: 'Date of death: March 14, 2019\nLocation: Greenfield Federal Correctional Institution, Medical Unit\nCause: Lobar pneumonia, bilateral, with septicemia\nDuration of untreated illness: Approximately 72 hours per facility records\nAge: 41\nMarital status: Single\nEmergency contact: [YOUR NAME] — listed. Never contacted.\n\nNext of kin: None. Remains released to [LEGAL AID SOCIETY]. Cremated. Ashes scattered per institution protocol.',
      relevance: 'You were her emergency contact. You were her executor. You were the last person she trusted. The facility called your office three times.'
    }
  },

  questionTopics: {
    relationship: {
      description: 'Questions about your relationship with Elena',
      trap: 'You will describe her warmly, which contradicts your testimony that she was a calculating criminal. Or you will describe her coldly, which reveals you erased her deliberately.',
      escalation: 'Questions become more specific — her habits, her birthday, what she would say about you now.'
    },
    company: {
      description: 'Questions about Ashland and its founding',
      trap: 'You will claim equal credit or minimize her role, which contradicts the revenue records. Or you will credit her, which undermines your testimony about her character.',
      escalation: 'Questions about who really built what, who the clients loved, what happened when she was removed.'
    },
    discovery: {
      description: 'Questions about how you found the "fraud"',
      trap: 'Your timeline of discovery has always been vague. Specific questions will force you to commit to dates that can be checked.',
      escalation: 'Questions about what you did between finding the irregularities and reporting them. This is where the 4-month gap appears.'
    },
    testimony: {
      description: 'Questions about your 2017 testimony',
      trap: 'You must either repeat the lies (deepening the perjury) or deviate from them (admitting the perjury). There is no safe middle ground.',
      escalation: 'Direct quotes from your testimony are read back to you and you are asked to confirm them.'
    },
    aftermath: {
      description: 'Questions about what happened after the trial',
      trap: 'You will have to account for five years of silence — never visiting, never contacting her family (she had none), never questioning the verdict.',
      escalation: 'Questions about what you know of her death. Whether you were contacted. What you did when you heard.'
    },
    morality: {
      description: 'Questions that force moral reflection without legal relevance',
      trap: 'The prosecutor asks what you would say to Elena now. There is no legally useful answer. This question exists to make you feel something.',
      escalation: 'Final questions. No traps left. Just the truth, if you want to give it.'
    }
  },

  contradictions: {
    warmToCold: {
      description: 'Player initially describes Elena warmly, then coldly',
      legalImpact: 'Suggests they are tailoring their answers to what they think the prosecutor wants to hear',
      emotionalImpact: 'They are trying to distance themselves from someone they cared about'
    },
    coldToWarm: {
      description: 'Player initially describes Elena coldly, then reveals genuine affection',
      legalImpact: 'Suggests the prosecution narrative (that Elena was a monster) is exaggerated',
      emotionalImpact: 'The player is remembering their friend and realizing what they did'
    },
    timelineShift: {
      description: 'Player gives dates for discovery that conflict with prior testimony',
      legalImpact: 'Direct evidence of perjury — the most dangerous contradiction',
      emotionalImpact: 'The player is losing control of their false narrative'
    },
    creditClaim: {
      description: 'Player claims more credit for the company than their testimony described',
      legalImpact: 'Suggests motive — they wanted the company for themselves',
      emotionalImpact: 'They are revealing through body language that they believe they deserved it'
    },
    knowledgeSlip: {
      description: 'Player reveals knowledge they should not have if their testimony was truthful',
      legalImpact: 'Suggests a closer, more honest relationship than they admitted',
      emotionalImpact: 'The mask slips for a moment'
    }
  },

  endings: {
    deduction: {
      trigger: 'Player correctly identifies what they did — lied to steal the company, and Elena died because of it',
      text: 'The prosecutor sets down his pen. He has what he needs. Not a confession of perjury — something else. An understanding. You finally said it out loud. Not "she was guilty." Not "I did what was right." But the real sentence. The one you\'ve been avoiding for seven years.\n\nThe courtroom is quiet. The court reporter has stopped typing. The prosecutor looks at you for a long time, then closes his file.\n\n"No further questions."\n\nBut everyone in the room knows: you convicted yourself. Not of perjury. Of something that has no statute of limitations.'
    },
    revelation: {
      trigger: 'Player fails to deduce or refuses to acknowledge, and the prosecutor introduces the evidence directly',
      text: 'The prosecutor rises slowly. He places a document on the projector. It is a metadata report. Your internal audit — the one that sent Elena to prison — was created five days before your testimony. You built the evidence to match the lie.\n\nHe lets the silence hold.\n\nThen he places a second document: her death certificate. Emergency contact listed: your name. Called three times. No answer.\n\nHe places a third: a letter in her handwriting, never sent. "This company is ours. Not mine. Ours. I mean that."\n\nThe prosecutor looks at you. "You were her closest friend. You were her executor. You were the last person she trusted."\n\nHe pauses.\n\n"And she died alone in a cell while you spent her money."\n\nThe court reporter has stopped typing. The courtroom is silent. The prosecutor closes his file.\n\n"No further questions."'
    },
    stubbornPerjury: {
      trigger: 'Player maintains lies consistently throughout, never deviating from original testimony',
      text: 'You hold. Every question, the same answer. The same story. The same Elena Voss who was a criminal, who told you she was untouchable, who forced you to gather evidence against your will.\n\nThe prosecutor finishes his questioning. He seems almost sad.\n\n"No further questions."\n\nYou walk out of the courthouse free. No charges filed. The statute of limitations on perjury is five years — you are two months past it.\n\nYou won.\n\nBut the forensic accountant\'s report is now public record. Everyone knows the audit was fabricated. Everyone knows you lied. You will not be prosecuted, but you will never be trusted again. Your clients will read the news. Your employees will read the news. And every time you walk into a room, you will see the question in their eyes, and you will have to live with the answer you can never say out loud:\n\n"I did it. And I would do it again."\n\nThat is the worst ending. Because it means you learned nothing.'
    }
  }
};

Object.freeze(CASEFILE);
Object.freeze(CASEFILE.timeline);
Object.freeze(CASEFILE.evidence);
Object.freeze(CASEFILE.contradictions);
Object.freeze(CASEFILE.endings);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CASEFILE;
}
