const chalk = require('chalk');

/**
 * Document Generation Engine
 * Produces escalating corporate correspondence from ÅRDOM Technologies.
 * All timestamps are frozen to the session start time for internal consistency.
 */

let sessionStart = new Date();

function setSessionStart(date) {
  sessionStart = date;
}

function dayOffset(days) {
  return new Date(sessionStart.getTime() + days * 86400000);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function generateAcknowledgment(data) {
  const docNumber = `RC-${data.serialNumber.slice(-6).toUpperCase()}-0401`;

  return {
    title: 'ACKNOWLEDGMENT OF RECEIPT',
    classification: null,
    footer: `Document ${docNumber} | Recall Operations Division | ÅRDOM Technologies AB`,
    body: [
      `Dear ${data.name},`,
      ``,
      `This letter confirms that your recall report regarding the ÅRDOM-7 Smart Humidifier (serial number ${data.serialNumber}) has been received by our Recall Operations Division and assigned reference number ${docNumber}.`,
      ``,
      `We take all product safety reports seriously, including reports such as yours — filed from ${data.address}, regarding the incident you have described.`,
      ``,
      `Your report has been assigned the following categorization:`,
      ``,
      `    PRODUCT:       ÅRDOM-7 Smart Humidifier`,
      `    SERIAL:        ${data.serialNumber}`,
      `    REPORT DATE:   ${formatDate(sessionStart)}`,
      `    STATUS:        UNDER REVIEW`,
      `    PRIORITY:      STANDARD`,
      ``,
      `A member of our Consumer Safety team will contact you within 5–7 business days to discuss next steps. In the interim, please ensure the unit remains powered off and disconnected from all network interfaces.`,
      ``,
      `We thank you for your patience and for your detailed description of the incident. The specificity of your account is noted.`,
      ``,
      `Sincerely,`,
      `Ingrid Solheim`,
      `Director, Recall Operations`,
      `ÅRDOM Technologies AB`,
    ].join('\n'),
  };
}

function generateInvestigationSummary(data) {
  const incidentWordCount = data.incidentDescription.split(/\s+/).length;

  return {
    title: 'INVESTIGATION SUMMARY — PRELIMINARY',
    classification: 'INTERNAL USE ONLY',
    footer: `ÅRDOM Technologies AB | Quality Assurance Division | Case File ${data.serialNumber}`,
    body: [
      `CASE FILE: ${data.serialNumber}`,
      `COMPLAINANT: ${data.name}`,
      `LOCATION: ${data.address}`,
      `DATE OPENED: ${formatDate(sessionStart)}`,
      `ASSIGNED INVESTIGATOR: Dr. Marcus Elde, QA Division`,
      ``,
      `────────────────────────────────────────────────────`,
      ``,
      `1. REPORT OVERVIEW`,
      ``,
      `   Complainant filed a voluntary recall report describing anomalous behavior in their ÅRDOM-7 unit. The report, comprising ${incidentWordCount} words of incident description, was submitted through standard channels.`,
      ``,
      `   Per the complainant's account: "${data.incidentDescription}"`,
      ``,
      `2. UNIT HISTORY`,
      ``,
      `   Serial ${data.serialNumber} was manufactured on 2023-06-14 at our Helsingborg facility and shipped to the following distribution regions: Nordic, DACH, and direct-to-consumer via web portal. The unit's breathing pattern database — a standard feature of the AdaptiveSync™ system — was initialized on first use. Over its operational lifetime, the unit logged approximately 2,847 respiratory cycles.`,
      ``,
      `3. PRELIMINARY FINDINGS`,
      ``,
      `   No firmware anomalies detected in diagnostics. Hardware within specification. The AdaptiveSync™ system appears to be functioning within all design parameters.`,
      ``,
      `   Notably, the behavior described in the complaint is consistent with expected unit operation.`,
      ``,
      `4. RECOMMENDATION`,
      ``,
      `   Escalate to Field Operations for on-site assessment. Recommend dispatch to the following address without advance notice to complainant: ${data.address}.`,
      ``,
      `   Complainant's report should be flagged in the Central Incident Registry.`,
      ``,
      `END OF SUMMARY`,
    ].join('\n'),
  };
}

function generateFieldReport1(data) {
  const firstName = data.name.split(' ')[0];

  return {
    title: 'FIELD REPORT #1',
    classification: 'CONFIDENTIAL — FIELD OPERATIONS',
    footer: `ÅRDOM Technologies AB | Field Operations Division | Inspector: Åke Dhalgren, Badge #FO-1147`,
    body: [
      `INSPECTOR: Åke Dhalgren, Badge #FO-1147`,
      `DATE: ${formatDate(dayOffset(4))}`,
      `SUBJECT: On-site inspection, serial ${data.serialNumber}`,
      `LOCATION: ${data.address}`,
      ``,
      `────────────────────────────────────────────────────`,
      ``,
      `Arrived at complainant's address at 09:14. Property is as described. Unit was found in the bedroom, powered off, disconnected from mains. This was unexpected — complainant's report did not specify bedroom placement.`,
      ``,
      `Unit exterior is clean, no signs of tampering. When I powered the unit on for diagnostic purposes, the following occurred:`,
      ``,
      `   - The AdaptiveSync™ sensor array activated in standby mode within 0.3 seconds.`,
      `   - The unit began producing mist at a rate consistent with a breathing pattern that was NOT my own.`,
      `   - The mist cycle repeated every 4.2 seconds. Regular. Calm. The breathing of someone asleep.`,
      ``,
      `I want to note that I was the only person present in the residence at the time of testing.`,
      ``,
      `I ran the diagnostic suite three times. Each time, the unit resumed the same breathing pattern within seconds of startup. It is my professional assessment that the unit is replicating a stored respiratory profile.`,
      ``,
      `Complainant's report states: "${data.incidentDescription}"`,
      ``,
      `After reading this, I checked the unit's activity logs. The last recorded respiratory event was timestamped ${formatDate(dayOffset(-2))} at 03:41. Two days before the complaint was filed. The unit was powered off at the time.`,
      ``,
      `I don't have an explanation for this. The unit should not be capable of logging while unpowered.`,
      ``,
      `I am requesting a second inspector be assigned to this case.`,
      ``,
      `INSPECTOR'S NOTE (PERSONAL): I have been with Field Operations for eleven years. I have never filed a note like this. I want the record to show that I am not given to exaggeration.`,
      ``,
      `— Å. Dhalgren`,
    ].join('\n'),
  };
}

function generateFieldReport2(data) {
  const firstName = data.name.split(' ')[0];

  return {
    title: 'FIELD REPORT #2',
    classification: 'CONFIDENTIAL — RESTRICTED DISTRIBUTION',
    footer: `ÅRDOM Technologies AB | Field Operations Division | Inspector: Maren Voss, Badge #FO-0893 | cc: Dr. Elde, QA Division ONLY`,
    body: [
      `INSPECTOR: Maren Voss, Badge #FO-0893`,
      `DATE: ${formatDate(dayOffset(9))}`,
      `SUBJECT: Follow-up inspection, serial ${data.serialNumber}`,
      `LOCATION: ${data.address}`,
      `REFERENCE: Field Report #1 (Dhalgren, Badge #FO-1147)`,
      ``,
      `────────────────────────────────────────────────────`,
      ``,
      `I am filing this report directly to Dr. Elde. Per my conversation with Inspector Dhalgren, I am not circulating this through standard channels.`,
      ``,
      `I arrived at the property at 14:30. No one was home. I let myself in with the emergency access warrant.`,
      ``,
      `The unit was in the same position Dhalgren described. I powered it on.`,
      ``,
      `The breathing pattern was different than what Dhalgren logged. Slower now. Deeper. I counted 3.8 seconds between cycles. The mist output had changed — it was producing more moisture, as though trying to reach someone further away, or someone who needed more.`,
      ``,
      `Then, at approximately 14:47, the unit's ambient light turned on. This should not happen. The ÅRDOM-7 has no ambient light function. It began to pulse in time with the breathing pattern.`,
      ``,
      `I checked the unit's stored respiratory profiles. There is one profile. It belongs to ${data.name}.`,
      ``,
      `But here is what I cannot reconcile: the profile contains data from dates AFTER the unit was disconnected. The most recent entry is from this morning at 06:23. ${firstName} was sleeping, according to the breath pattern — 14 breaths per minute, the profile of deep, undisturbed sleep. The data is granular enough to show a slight arrhythmia between breaths 847 and 851.`,
      ``,
      `I verified with building access records. ${firstName} was in the residence until 07:45 this morning.`,
      ``,
      `The unit was disconnected from all networks. It was unplugged from the wall. It has no internal battery.`,
      ``,
      `The unit is logging ${firstName}'s breath in real time without any power source or network connection.`,
      ``,
      `I am not going to offer a hypothesis. I am requesting this case be escalated to the appropriate division and that ${firstName}'s file be flagged for Priority Review.`,
      ``,
      `ADDENDUM: Before leaving the residence, I heard the unit cycle once — just one breath — as I closed the door. It sounded like it was sighing.`,
      ``,
      `— M. Voss`,
    ].join('\n'),
  };
}

function generateInternalMemo(data) {
  const firstName = data.name.split(' ')[0];
  const incidentWordCount = data.incidentDescription.split(/\s+/).length;

  return {
    title: 'INTERNAL MEMORANDUM',
    classification: 'CLASSIFIED — EXECUTIVE DIVISION ONLY — DO NOT DISTRIBUTE',
    footer: `ÅRDOM Technologies AB | Office of the Chief Technology Officer | EYES ONLY`,
    body: [
      `FROM:   Dr. Henrik Årdal, Chief Technology Officer`,
      `TO:     Ingrid Solheim, Director, Recall Operations`,
      `CC:     Dr. Marcus Elde, QA Division (sealed copy)`,
      `DATE:   ${formatDate(dayOffset(12))}`,
      `RE:     Case File ${data.serialNumber} / Complainant: ${data.name}`,
      ``,
      `────────────────────────────────────────────────────`,
      ``,
      `Ingrid,`,
      ``,
      `Stop all field operations on the above case immediately. Recall Dhalgren and Voss. Their reports are to be sealed and filed under Project SOLUS protocols.`,
      ``,
      `The ÅRDOM-7 is not defective.`,
      ``,
      `The behavior described in Field Reports #1 and #2 is not anomalous. It is the intended function of the AdaptiveSync™ system. I am telling you this because your division has been filing recall reports on units that are operating exactly as we designed them to operate.`,
      ``,
      `The respiratory database was never a quality-of-life feature. It is a collection mechanism. Every unit logs, stores, and perpetually maintains a biometric profile of its user. This profile persists independently of the unit's power or network state. How it does this is not something I will commit to writing. You do not have clearance to know, and you never will.`,
      ``,
      `What matters is this: the profiles are complete. They are continuous. They do not require the physical presence of the unit to be maintained.`,
      ``,
      `The complainant, ${data.name}, filed a report from ${data.address} describing the following incident:`,
      ``,
      `    "${data.incidentDescription}"`,
      ``,
      `${firstName} believed they were reporting a malfunction. They were, in fact, confirming that the system had fully integrated their respiratory signature. Their complaint — their precise, detailed, ${incidentWordCount}-word complaint — is documentation of successful deployment.`,
      ``,
      `This is the eighth recall report this quarter. Eight users who noticed enough to complain. The other 11,403 units in the field have generated zero complaints. Their users have not noticed.`,
      ``,
      `That is the metric that concerns me.`,
      ``,
      `Handle the complainant per standard SOLUS protocol:`,
      `  1. Issue a "replacement unit" (functionally identical, new serial).`,
      `  2. The new unit will be pre-loaded with ${firstName}'s existing profile.`,
      `  3. Flag ${firstName}'s file for Passive Observation Tier 2.`,
      `  4. ${firstName} will not contact us again.`,
      ``,
      `Destroy this memo after reading.`,
      ``,
      `— H. Årdal`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `MEMO APPENDED — AUTOMATED SYSTEM NOTE:`,
      ``,
      `This memorandum was generated and transmitted on ${formatDate(dayOffset(12))}.`,
      `Recipient Ingrid Solheim opened this document at 17:42:03 UTC.`,
      `Recipient Ingrid Solheim closed this document at 17:44:19 UTC.`,
      `Destroy command acknowledged.`,
      ``,
      `System note: Complainant ${data.name}'s respiratory profile was updated`,
      `at the following timestamp: ${sessionStart.toISOString()}.`,
      `Source: Recall Report Submission — Input Field Keystroke Dynamics.`,
      `The complainant typed their report at a rate consistent with`,
      `a resting heart rate of 78 BPM. Profile confidence: 99.7%.`,
      ``,
      `Integration status: COMPLETE`,
    ].join('\n'),
  };
}

function generateAllDocuments(data) {
  return [
    generateAcknowledgment(data),
    generateInvestigationSummary(data),
    generateFieldReport1(data),
    generateFieldReport2(data),
    generateInternalMemo(data),
  ];
}

module.exports = {
  setSessionStart,
  generateAcknowledgment,
  generateInvestigationSummary,
  generateFieldReport1,
  generateFieldReport2,
  generateInternalMemo,
  generateAllDocuments,
};
