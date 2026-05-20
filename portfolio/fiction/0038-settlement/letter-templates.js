/**
 * letter-templates.js
 * Demand letter templates for Marsh Law, P.C.
 * Pure legal boilerplate. Multiple variations per section.
 * No emotional content. No references to the Atwater case.
 */

const LETTER_TEMPLATES = {

  salutations: [
    "Dear Claims Adjuster,",
    "To Whom It May Concern:",
    "Dear Sir or Madam:",
    "To the Claims Department:",
    "Attention: Claims Adjustment Division,",
    "Dear Claims Representative,",
    "To the attention of the assigned adjuster:",
    "Dear Underwriting Department,",
    "To the designated claims handler:",
    "Attention: Liability Claims Division,"
  ],

  introductions: [
    "Please accept this letter as formal notification that our office represents {clientName} with respect to personal injuries sustained on {incidentDate}. This correspondence constitutes our demand for settlement pursuant to applicable Virginia law and the terms of the applicable insurance policy.",

    "This law firm represents {clientName} in connection with injuries arising from an incident occurring on or about {incidentDate}. We have been retained to pursue all available remedies, and this letter serves as our formal demand for compensation.",

    "We write on behalf of {clientName} to present a demand for damages resulting from personal injuries sustained on {incidentDate}. Our client has authorized us to communicate directly with your office regarding this matter.",

    "Our office has been retained by {clientName} to pursue a claim for personal injuries arising from an event on {incidentDate}. This letter constitutes our initial demand for settlement. All future communications regarding this matter should be directed to this office.",

    "Please be advised that Daniel R. Marsh, Attorney at Law, represents {clientName} in a claim for personal injuries occurring on {incidentDate}. This correspondence is intended to set forth the basis of our client's claim and our demand for resolution.",

    "We are counsel for {clientName} and write to present a demand for damages stemming from an incident on {incidentDate}. Our client has suffered significant injuries as a result of the negligence described herein.",

    "This firm represents {clientName} in a personal injury claim arising from events of {incidentDate}. We submit this demand letter for your review and response within the timeframe specified below.",

    "Our client, {clientName}, has retained this office to pursue claims arising from injuries received on {incidentDate}. This letter serves as formal demand under Virginia Code Section 8.01 and applicable case law.",

    "Please accept this correspondence as formal demand on behalf of {clientName}, who sustained personal injuries on {incidentDate}. We request that this letter be forwarded to the appropriate adjuster and that confirmation of receipt be provided within ten (10) business days.",

    "We represent {clientName} in a claim for personal injuries resulting from an incident on {incidentDate}. This demand letter is submitted pursuant to the requirements of the applicable insurance policy and Virginia law."
  ],

  incidentDescriptions: [
    "On {incidentDate}, our client was lawfully present on the premises of {location} when, as a result of the negligence of the insured party, {incidentNarrative}. The incident was a direct and proximate result of the insured's failure to exercise reasonable care under the circumstances.",

    "On the date in question, our client was present at {location}. Through no fault of their own, {incidentNarrative}. The negligence of the insured party was the sole and proximate cause of this incident and the resulting injuries.",

    "Our client's injuries occurred on {incidentDate} at {location}. The facts establish that {incidentNarrative}. The insured owed a duty of care to our client, which duty was breached, resulting in the damages described herein.",

    "The incident giving rise to this claim occurred on {incidentDate} at approximately the time our client was present at {location}. The evidence will show that {incidentNarrative}. Liability is clearly established under the facts of this case.",

    "On or about {incidentDate}, our client sustained injuries at {location} when {incidentNarrative}. The insured's negligence was the direct and proximate cause of our client's injuries, and liability is not reasonably in dispute.",

    "The events of {incidentDate} form the basis of this claim. Our client was at {location} when, due to the careless and negligent conduct of the insured, {incidentNarrative}. We are confident that liability will be established should this matter proceed to litigation.",

    "Our client's claim arises from an incident on {incidentDate}. While present at {location}, our client was injured when {incidentNarrative}. The insured's failure to maintain safe conditions constitutes negligence per se under applicable Virginia statutes.",

    "On {incidentDate}, at {location}, our client was injured as follows: {incidentNarrative}. The negligence of the insured was the sole proximate cause of the incident and resulting injuries. This demand is made upon that basis.",

    "The claim herein arises from an incident on {incidentDate} at {location}. Our client, through no contributory negligence of their own, was injured when {incidentNarrative}. The facts support a finding of liability against the insured.",

    "On the date of {incidentDate}, while our client was lawfully present at {location}, the following occurred: {incidentNarrative}. The insured's negligence is established by the facts and applicable law, and we demand compensation accordingly."
  ],

  medicalSections: [
    "Following the incident, our client sought medical treatment and has continued to receive care. The treatment has included examination, diagnostic testing, and ongoing therapy. Medical records and bills are available upon request and will be provided during the discovery phase should litigation become necessary.",

    "Our client was transported from the scene and received emergency medical treatment. Subsequent care has included follow-up examinations, physical therapy, and specialist consultations. The total medical expenses to date exceed the amounts listed in the enclosed documentation.",

    "As a result of the injuries sustained, our client has required continuous medical treatment. Records from all treating physicians are enclosed. The prognosis for full recovery remains uncertain at this time, and further treatment may be required.",

    "Medical treatment was sought promptly following the incident. Our client's injuries were documented by attending medical personnel and have been treated through a course of therapy and intervention. All records are available for your review.",

    "The injuries sustained in this incident have necessitated ongoing medical care, including hospital visits, specialist referrals, and rehabilitative treatment. We anticipate that our client will continue to require medical attention for the foreseeable future.",

    "Our client received immediate medical attention following the incident and has since undergone extensive treatment. The enclosed medical documentation reflects the nature and extent of the injuries, as well as the costs incurred to date.",

    "Treatment for injuries resulting from this incident has been substantial. Our client has seen multiple providers and continues to experience symptoms consistent with the documented injuries. Prognosis remains guarded, and additional procedures may be warranted.",

    "The medical expenses associated with this claim arise directly from the incident described above. Our client has been diligent in seeking appropriate treatment and following all medical advice. Records from all providers are attached hereto.",

    "Our client's medical treatment has included emergency care, diagnostic imaging, specialist evaluation, and rehabilitative therapy. The necessity of such treatment is documented in the accompanying records and is not disputed by any medical professional.",

    "Injuries resulting from this incident have required our client to undergo significant medical treatment. The accompanying documentation reflects all treatment received to date. We reserve the right to supplement this demand with additional medical records as treatment continues."
  ],

  damagesSections: [
    "Our client has suffered both economic and non-economic damages as a result of this incident. Economic damages include past and future medical expenses, lost wages, and out-of-pocket costs. Non-economic damages include pain and suffering, loss of enjoyment of life, and emotional distress. The total demand for settlement is set forth below.",

    "The damages in this case are substantial and include past and anticipated medical expenses, lost earning capacity, and the diminished quality of life our client has experienced since the incident. We submit that the following demand fairly and adequately compensates our client for all losses.",

    "As a result of the insured's negligence, our client has incurred significant damages including medical costs, lost wages, loss of earning capacity, and pain and suffering. The demand herein reflects the full measure of compensable damages under Virginia law.",

    "Our client's damages are ongoing and include medical expenses already incurred, projected future medical costs, income lost during recovery, and non-economic losses including physical pain and mental anguish. The settlement demand is as follows:",

    "The claim for damages includes all economic losses sustained and anticipated, including but not limited to medical treatment costs and lost income, as well as full compensation for non-economic harm. The total demand is based on a careful review of all available evidence and medical documentation.",

    "Compensatory damages in this matter are significant. Our client has incurred substantial medical expenses, has lost income due to inability to work, and has suffered greatly as a result of the injuries. We believe the enclosed demand is reasonable under the circumstances.",

    "Our client seeks full and fair compensation for all damages proximately caused by the insured's negligence. This includes past and future medical costs, lost wages and diminished earning capacity, and appropriate compensation for pain, suffering, and loss of enjoyment of life.",

    "The damages sought herein reflect the totality of our client's losses. Medical expenses, both past and projected, are documented in the enclosed records. Additional damages for lost income, pain and suffering, and diminished quality of life are included in the demand below.",

    "Our client has been damaged in an amount that reflects the severity of the injuries and the negligence of the insured. Economic losses are documented and verifiable. Non-economic losses are supported by the nature and duration of our client's suffering.",

    "The demand herein encompasses all categories of damages recoverable under Virginia law. We have carefully calculated the amounts based on medical documentation, employment records, and the totality of the impact on our client's life and well-being."
  ],

  settlementDemands: [
    "Based on the foregoing, we demand the amount of $SETTLEMENT_AMOUNT for full and final settlement of all claims arising from this incident. This demand remains open for thirty (30) days from the date of this letter.",

    "Accordingly, our demand for settlement is in the amount of $SETTLEMENT_AMOUNT. We request your response within twenty (20) business days of the date of this correspondence.",

    "We therefore demand the sum of $SETTLEMENT_AMOUNT to resolve all claims our client has or may have against the insured. This offer will remain open for thirty (30) days.",

    "For full and final resolution of this matter, we demand payment in the amount of $SETTLEMENT_AMOUNT. Please respond within fifteen (15) business days of receipt of this letter.",

    "Our client's demand for settlement is $SETTLEMENT_AMOUNT, inclusive of all damages described above. We look forward to your timely response.",

    "We submit this demand in the amount of $SETTLEMENT_AMOUNT. Should we not receive a response within thirty (30) days, we will proceed with filing a complaint in the appropriate court.",

    "Based upon our review of the evidence and applicable law, we demand $SETTLEMENT_AMOUNT to fully and finally resolve this claim. This demand is time-sensitive and requires a response within twenty (20) days.",

    "The settlement demand in this matter is $SETTLEMENT_AMOUNT. This figure represents a reasonable assessment of liability and damages. We are prepared to discuss this matter further upon receipt of your response.",

    "We demand the amount of $SETTLEMENT_AMOUNT in full settlement of this claim. This offer will expire if not accepted within thirty (30) days of the date of this letter, after which we will pursue all available legal remedies.",

    "Our demand for settlement is set at $SETTLEMENT_AMOUNT. We believe this amount fairly compensates our client and reflects the strength of the liability and damages in this case. Please respond within the timeframe specified above."
  ],

  closings: [
    "We look forward to your prompt response and to resolving this matter without the need for litigation. However, we are prepared to file suit if a satisfactory resolution cannot be reached within the timeframe stated above.\n\nSincerely,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "Please contact this office at your earliest convenience to discuss this matter further. We are willing to engage in good-faith settlement negotiations and encourage your prompt response.\n\nRespectfully,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "This letter is submitted without prejudice to our client's right to pursue additional legal remedies. We anticipate your response and hope to resolve this claim amicably.\n\nVery truly yours,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "Nothing in this correspondence shall be construed as a waiver of any rights or remedies available to our client. We await your response.\n\nCordially,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "We reserve all rights on behalf of our client. Please direct all future communications to the undersigned.\n\nYours truly,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "Thank you for your attention to this matter. We look forward to hearing from you within the specified timeframe.\n\nRespectfully submitted,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "Please be advised that time is of the essence in this matter. We expect good-faith engagement within the period stated above.\n\nSincerely yours,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "We are hopeful this matter can be resolved without court intervention. The next step is yours.\n\nBest regards,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "This demand is submitted in accordance with applicable Virginia law. We await your timely response.\n\nRespectfully,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147",

    "Please govern yourselves accordingly. We look forward to your response within the timeframe specified.\n\nSincerely,\nDaniel R. Marsh, Esq.\nMarsh Law, P.C.\n102 E. Main Street, Suite 2\nElk Crossing, Virginia 22901\n(540) 555-0147"
  ]
};


/**
 * Case data — cycles with each generation.
 * Case index 9 (generation 10) is the Atwater case.
 */
const CASE_DATA = [
  {
    clientName: "Margaret Holbrook",
    incidentDate: "March 3, 2024",
    incidentType: "Slip and Fall",
    location: "Food Lion, 440 Shelbourne Drive, Elk Crossing, VA",
    incidentNarrative: "our client slipped and fell on a wet floor surface that had been recently mopped without proper warning signs or barriers, causing significant injury",
    settlementAmount: "$85,000"
  },
  {
    clientName: "David Chen",
    incidentDate: "January 17, 2024",
    incidentType: "Motor Vehicle Accident",
    location: "Route 29, mile marker 142, Albemarle County, VA",
    incidentNarrative: "our client's vehicle was struck from the rear by the insured's vehicle while stopped in traffic, causing a rear-end collision resulting in cervical and lumbar strain",
    settlementAmount: "$120,000"
  },
  {
    clientName: "Tanya Williams",
    incidentDate: "September 22, 2023",
    incidentType: "Workplace Injury",
    location: "Amazon Fulfillment Center BV-2, Charlottesville, VA",
    incidentNarrative: "our client sustained repetitive strain injuries to both wrists and the dominant shoulder as a result of inadequate ergonomic accommodations and excessive workload requirements",
    settlementAmount: "$95,000"
  },
  {
    clientName: "Robert Pine",
    incidentDate: "April 8, 2024",
    incidentType: "Dog Bite",
    location: "Piney Grove Dog Park, Elk Crossing, VA",
    incidentNarrative: "our client was bitten on the right forearm by the insured's dog, which had been previously cited for aggressive behavior and was not properly restrained",
    settlementAmount: "$60,000"
  },
  {
    clientName: "Sandra Kowalski",
    incidentDate: "November 14, 2023",
    incidentType: "Nursing Home Negligence",
    location: "Sunrise Living Facility, 88 Church Lane, Elk Crossing, VA",
    incidentNarrative: "our client was the victim of a medication error involving incorrect dosage of a prescribed cardiac medication, resulting in hospitalization and ongoing cardiac monitoring",
    settlementAmount: "$150,000"
  },
  {
    clientName: "Marcus Webb",
    incidentDate: "July 29, 2024",
    incidentType: "Construction Site Fall",
    location: "Residential construction site, Lot 14 Chestnut Hill Development, Elk Crossing, VA",
    incidentNarrative: "our client fell from an elevated platform due to the absence of required guardrails and fall protection equipment, in violation of OSHA regulations 29 CFR 1926.502",
    settlementAmount: "$275,000"
  },
  {
    clientName: "Janice Ferrell",
    incidentDate: "February 11, 2024",
    incidentType: "Motor Vehicle Accident — DUI",
    location: "Intersection of Main Street and Oak Avenue, Elk Crossing, VA",
    incidentNarrative: "our client was proceeding through a controlled intersection when her vehicle was struck by the insured's vehicle, which had failed to stop at a red traffic signal. The insured's blood alcohol content was subsequently measured at 0.14 percent",
    settlementAmount: "$180,000"
  },
  {
    clientName: "Timothy Burr",
    incidentDate: "October 6, 2023",
    incidentType: "Premises Liability",
    location: "Residential rental property, 77 Birch Lane, Apt. B, Elk Crossing, VA",
    incidentNarrative: "our client was injured when a stairway collapsed beneath him due to rotted structural supports that had not been inspected or maintained by the property owner despite written notice of deterioration",
    settlementAmount: "$110,000"
  },
  {
    clientName: "Angela Moss",
    incidentDate: "May 19, 2024",
    incidentType: "Medical Malpractice",
    location: "Elk Crossing Family Medicine, 15 Medical Park Drive, Elk Crossing, VA",
    incidentNarrative: "our client's distal radius fracture was misdiagnosed as a soft tissue contusion, resulting in improper immobilization and subsequent malunion requiring corrective surgical intervention",
    settlementAmount: "$200,000"
  },
  {
    clientName: "Atwater, L.",
    incidentDate: "June 14",
    incidentType: "Child Injury — Residential Swimming Pool — Negligence",
    location: "Private residence, Elk Crossing, VA",
    incidentNarrative: "the minor child sustained severe injury in a residential swimming pool due to the failure of the property owners and all present adults to provide adequate supervision and timely intervention",
    settlementAmount: "—"
  }
];


/**
 * Build a complete demand letter from template sections.
 * @param {number} caseIndex — which case data to use (0-9)
 * @returns {string} Complete formatted demand letter
 */
function buildDemandLetter(caseIndex) {
  const idx = caseIndex % CASE_DATA.length;
  const caseData = CASE_DATA[idx];

  const intro = LETTER_TEMPLATES.introductions[idx]
    .replace('{clientName}', caseData.clientName)
    .replace('{incidentDate}', caseData.incidentDate);

  const incident = LETTER_TEMPLATES.incidentDescriptions[idx]
    .replace('{incidentDate}', caseData.incidentDate)
    .replace('{location}', caseData.location)
    .replace('{incidentNarrative}', caseData.incidentNarrative);

  const medical = LETTER_TEMPLATES.medicalSections[idx];
  const damages = LETTER_TEMPLATES.damagesSections[idx];

  const settlement = LETTER_TEMPLATES.settlementDemands[idx]
    .replace('$SETTLEMENT_AMOUNT', caseData.settlementAmount);

  const closing = LETTER_TEMPLATES.closings[idx];

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    `MARSH LAW, P.C.\n` +
    `Daniel R. Marsh, Esq.\n` +
    `102 E. Main Street, Suite 2\n` +
    `Elk Crossing, Virginia 22901\n` +
    `(540) 555-0147 | marshlaw@elkcrossingva.net\n\n` +
    `${dateStr}\n\n` +
    `RE: Personal Injury Claim — ${caseData.clientName}\n` +
    `Date of Incident: ${caseData.incidentDate}\n` +
    `Type of Claim: ${caseData.incidentType}\n\n` +
    `${LETTER_TEMPLATES.salutations[idx]}\n\n` +
    `${intro}\n\n` +
    `${incident}\n\n` +
    `${medical}\n\n` +
    `${damages}\n\n` +
    `${settlement}\n\n` +
    `${closing}`
  );
}
