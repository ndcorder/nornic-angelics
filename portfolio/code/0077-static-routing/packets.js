/**
 * Static Routing — Packet Data
 *
 * Conversation fragments organized by category. Each packet represents
 * a piece of someone's life passing through the routing queue.
 *
 * Fields:
 *   id          — unique identifier
 *   category    — thematic group
 *   sender      — origin label shown in header
 *   recipient   — destination label
 *   sequence    — ordering within thread (null = standalone)
 *   content     — the readable message fragment
 *   weight      — emotional priority 0–5
 *   metadata    — optional context for consequence generation
 */

const PACKET_DATA = {

  // ── Couple Arguing ──────────────────────────────────

  couple_arguing: [
    {
      id: "ca_01",
      category: "couple_arguing",
      sender: "MARA",
      recipient: "DAVID",
      sequence: 1,
      content: "You never listen. I've been telling you for months that something is wrong, and you just—",
      weight: 3,
      metadata: { tone: "frustrated", topic: "emotional neglect" }
    },
    {
      id: "ca_02",
      category: "couple_arguing",
      sender: "DAVID",
      recipient: "MARA",
      sequence: 2,
      content: "I do listen. I just don't know what you want me to say to something like that.",
      weight: 2,
      metadata: { tone: "defensive", topic: "communication failure" }
    },
    {
      id: "ca_03",
      category: "couple_arguing",
      sender: "MARA",
      recipient: "DAVID",
      sequence: 3,
      content: "I don't want you to say anything. I want you to hear me. There's a difference.",
      weight: 4,
      metadata: { tone: "pleading", topic: "emotional need" }
    },
    {
      id: "ca_04",
      category: "couple_arguing",
      sender: "DAVID",
      recipient: "MARA",
      sequence: 4,
      content: "Maybe if you didn't always—no. Forget it. I'm not doing this again.",
      weight: 3,
      metadata: { tone: "withdrawn", topic: "stonewalling" }
    },
    {
      id: "ca_05",
      category: "couple_arguing",
      sender: "MARA",
      recipient: "DAVID",
      sequence: 5,
      content: "The dishes aren't the point. The point is I asked you to be here and you weren't. Again.",
      weight: 3,
      metadata: { tone: "exhausted", topic: "broken promises" }
    },
    {
      id: "ca_06",
      category: "couple_arguing",
      sender: "DAVID",
      recipient: "MARA",
      sequence: 6,
      content: "I was working. You know what the hours are like right now. I can't just—",
      weight: 2,
      metadata: { tone: "justifying", topic: "work-life balance" }
    },
    {
      id: "ca_07",
      category: "couple_arguing",
      sender: "MARA",
      recipient: "DAVID",
      sequence: 7,
      content: "Don't. Don't make me feel guilty for needing you. I'm not the enemy here.",
      weight: 4,
      metadata: { tone: "hurt", topic: "guilt dynamics" }
    },
    {
      id: "ca_08",
      category: "couple_arguing",
      sender: "DAVID",
      recipient: "MARA",
      sequence: 8,
      content: "I never said you were. But nothing I do is ever enough. You know that's how it feels.",
      weight: 4,
      metadata: { tone: "resentful", topic: "inadequacy" }
    },
    {
      id: "ca_09",
      category: "couple_arguing",
      sender: "MARA",
      recipient: "DAVID",
      sequence: 9,
      content: "I don't want to fight anymore. I just want you to come home on time. Is that so much?",
      weight: 4,
      metadata: { tone: "resigned", topic: "basic needs" }
    },
    {
      id: "ca_10",
      category: "couple_arguing",
      sender: "DAVID",
      recipient: "MARA",
      sequence: 10,
      content: "Look. I know. I'll do better. I keep saying that, but I mean it this time. I swear.",
      weight: 3,
      metadata: { tone: "earnest", topic: "reconciliation attempt" }
    },
    {
      id: "ca_11",
      category: "couple_arguing",
      sender: "MARA",
      recipient: "DAVID",
      sequence: 11,
      content: "You said that in March. And June. And every time, I believe you, and every time—",
      weight: 5,
      metadata: { tone: "breaking", topic: "eroded trust" }
    },
    {
      id: "ca_12",
      category: "couple_arguing",
      sender: "DAVID",
      recipient: "MARA",
      sequence: 12,
      content: "Then maybe you should stop believing me. It'd be easier for both of us.",
      weight: 5,
      metadata: { tone: "cruel", topic: "giving up" }
    }
  ],

  // ── Doctor Calling Patient ──────────────────────────

  doctor_patient: [
    {
      id: "dp_01",
      category: "doctor_patient",
      sender: "DR. OKONKWO",
      recipient: "PATIENT #4471",
      sequence: 1,
      content: "This is Dr. Okonkwo calling about your test results. I need you to come in today if possible.",
      weight: 4,
      metadata: { tone: "urgent", topic: "test results", urgency: "high" }
    },
    {
      id: "dp_02",
      category: "doctor_patient",
      sender: "DR. OKONKWO",
      recipient: "PATIENT #4471",
      sequence: 2,
      content: "The biopsy came back. It's not what we were hoping for, but there are options we need to discuss.",
      weight: 5,
      metadata: { tone: "careful", topic: "diagnosis delivery", urgency: "high" }
    },
    {
      id: "dp_03",
      category: "doctor_patient",
      sender: "DR. OKONKWO",
      recipient: "PATIENT #4471",
      sequence: 3,
      content: "I want to start treatment this week. Time matters here, and I don't want you waiting any longer.",
      weight: 5,
      metadata: { tone: "directive", topic: "treatment plan", urgency: "critical" }
    },
    {
      id: "dp_04",
      category: "doctor_patient",
      sender: "DR. OKONKWO",
      recipient: "PATIENT #4471",
      sequence: 4,
      content: "Your pharmacy should have the prescription ready by tomorrow morning. Take it exactly as written.",
      weight: 3,
      metadata: { tone: "instructional", topic: "medication", urgency: "medium" }
    },
    {
      id: "dp_05",
      category: "doctor_patient",
      sender: "DR. OKONKWO",
      recipient: "PATIENT #4471",
      sequence: 5,
      content: "I've referred you to Dr. Vasquez for the surgical consult. Her office will call you.",
      weight: 4,
      metadata: { tone: "coordinating", topic: "referral", urgency: "medium" }
    },
    {
      id: "dp_06",
      category: "doctor_patient",
      sender: "DR. OKONKWO",
      recipient: "PATIENT #4471",
      sequence: 6,
      content: "If you experience any nausea worse than a 6 out of 10, go to emergency. Don't wait for my call back.",
      weight: 5,
      metadata: { tone: "stern", topic: "warning signs", urgency: "critical" }
    },
    {
      id: "dp_07",
      category: "doctor_patient",
      sender: "DR. OKONKWO",
      recipient: "PATIENT #4471",
      sequence: 7,
      content: "I know this is overwhelming. But you're not facing this alone. Call my office anytime.",
      weight: 4,
      metadata: { tone: "compassionate", topic: "emotional support", urgency: "low" }
    },
    {
      id: "dp_08",
      category: "doctor_patient",
      sender: "DR. OKONKWO",
      recipient: "PATIENT #4471",
      sequence: 8,
      content: "One more thing — I'm going to need you to tell your family. You shouldn't carry this by yourself.",
      weight: 4,
      metadata: { tone: "gentle but firm", topic: "family disclosure", urgency: "medium" }
    }
  ],

  // ── Witness Reporting a Crime ───────────────────────

  witness_crime: [
    {
      id: "wc_01",
      category: "witness_crime",
      sender: "WITNESS #12",
      recipient: "DETECTIVE REEVES",
      sequence: 1,
      content: "I saw the whole thing from my window. The grey sedan, the parking lot behind the Walgreens on 5th.",
      weight: 4,
      metadata: { tone: "nervous", topic: "incident report", severity: "felony" }
    },
    {
      id: "wc_02",
      category: "witness_crime",
      sender: "WITNESS #12",
      recipient: "DETECTIVE REEVES",
      sequence: 2,
      content: "There were two of them. One was tall, heavyset, dark jacket. The other I couldn't see clearly.",
      weight: 3,
      metadata: { tone: "factual", topic: "suspect description", severity: "felony" }
    },
    {
      id: "wc_03",
      category: "witness_crime",
      sender: "WITNESS #12",
      recipient: "DETECTIVE REEVES",
      sequence: 3,
      content: "The license plate started with 7KXV. That's all I caught. It happened so fast.",
      weight: 4,
      metadata: { tone: "apologetic", topic: "vehicle ID", severity: "critical evidence" }
    },
    {
      id: "wc_04",
      category: "witness_crime",
      sender: "WITNESS #12",
      recipient: "DETECTIVE REEVES",
      sequence: 4,
      content: "I don't want to testify. I'm sorry. I have kids. I can't be seen in that courtroom.",
      weight: 5,
      metadata: { tone: "fearful", topic: "refusal to testify", severity: "personal risk" }
    },
    {
      id: "wc_05",
      category: "witness_crime",
      sender: "WITNESS #12",
      recipient: "DETECTIVE REEVES",
      sequence: 5,
      content: "They looked right at me. For a second. Like they knew someone was watching.",
      weight: 5,
      metadata: { tone: "haunted", topic: "threat perception", severity: "personal risk" }
    },
    {
      id: "wc_06",
      category: "witness_crime",
      sender: "WITNESS #12",
      recipient: "DETECTIVE REEVES",
      sequence: 6,
      content: "I'll write down everything I remember and leave it at the front desk. That's the most I can do.",
      weight: 3,
      metadata: { tone: "resigned", topic: "compromise", severity: "partial cooperation" }
    },
    {
      id: "wc_07",
      category: "witness_crime",
      sender: "WITNESS #12",
      recipient: "DETECTIVE REEVES",
      sequence: 7,
      content: "Please don't use my name. In any of the reports. I'm begging you.",
      weight: 4,
      metadata: { tone: "desperate", topic: "anonymity request", severity: "personal risk" }
    },
    {
      id: "wc_08",
      category: "witness_crime",
      sender: "WITNESS #12",
      recipient: "DETECTIVE REEVES",
      sequence: 8,
      content: "It happened at 11:47 PM. I know because I looked at my phone right after. I couldn't sleep.",
      weight: 3,
      metadata: { tone: "certain", topic: "timeline", severity: "critical evidence" }
    }
  ],

  // ── Parent and Child ────────────────────────────────

  parent_child: [
    {
      id: "pc_01",
      category: "parent_child",
      sender: "HELEN",
      recipient: "SOPHIE (17)",
      sequence: 1,
      content: "Sweetheart, I know you're angry. But I need you to call me back. Just so I know you're safe.",
      weight: 4,
      metadata: { tone: "worried", topic: "missing contact" }
    },
    {
      id: "pc_02",
      category: "parent_child",
      sender: "SOPHIE (17)",
      recipient: "HELEN",
      sequence: 2,
      content: "I'm fine. I'm at Jess's house. I just needed to not be there for a while. You understand that, right?",
      weight: 3,
      metadata: { tone: "guarded", topic: "space request" }
    },
    {
      id: "pc_03",
      category: "parent_child",
      sender: "HELEN",
      recipient: "SOPHIE (17)",
      sequence: 3,
      content: "I found the bag in your closet, Sophie. I'm not angry. I'm scared. Can we please just talk?",
      weight: 5,
      metadata: { tone: "frightened", topic: "discovery" }
    },
    {
      id: "pc_04",
      category: "parent_child",
      sender: "SOPHIE (17)",
      recipient: "HELEN",
      sequence: 4,
      content: "You went through my stuff. You don't get to be the worried parent after violating my privacy.",
      weight: 4,
      metadata: { tone: "defiant", topic: "boundary violation" }
    },
    {
      id: "pc_05",
      category: "parent_child",
      sender: "HELEN",
      recipient: "SOPHIE (17)",
      sequence: 5,
      content: "I made an appointment with Dr. Nazari for Thursday. I'll go with you or wait outside. Your choice.",
      weight: 3,
      metadata: { tone: "practical love", topic: "intervention" }
    },
    {
      id: "pc_06",
      category: "parent_child",
      sender: "SOPHIE (17)",
      recipient: "HELEN",
      sequence: 6,
      content: "I'll go. But I'm not promising anything. And I'm not going to pretend everything is okay.",
      weight: 4,
      metadata: { tone: "conditional hope", topic: "acceptance" }
    },
    {
      id: "pc_07",
      category: "parent_child",
      sender: "HELEN",
      recipient: "SOPHIE (18)",
      sequence: 7,
      content: "I should have noticed sooner. That's on me. I'm sorry I wasn't paying attention when it mattered.",
      weight: 5,
      metadata: { tone: "guilt", topic: "parental failure" }
    },
    {
      id: "pc_08",
      category: "parent_child",
      sender: "SOPHIE (18)",
      recipient: "HELEN",
      sequence: 8,
      content: "Mom. I'm six months clean. I'm telling you now because I couldn't say it then. Thank you for not giving up.",
      weight: 5,
      metadata: { tone: "grateful", topic: "recovery milestone" }
    }
  ],

  // ── Soldier Writing Home ────────────────────────────

  soldier_home: [
    {
      id: "sh_01",
      category: "soldier_home",
      sender: "SGT. REEVES, T.",
      recipient: "EMMA (WIFE)",
      sequence: 1,
      content: "Hey. It's me. Mail is slow here but I wanted you to know I think about you every morning.",
      weight: 3,
      metadata: { tone: "tender", topic: "daily love" }
    },
    {
      id: "sh_02",
      category: "soldier_home",
      sender: "SGT. REEVES, T.",
      recipient: "EMMA (WIFE)",
      sequence: 2,
      content: "The days blur together. I don't know what day it is. I keep a picture of you on the inside of my helmet.",
      weight: 3,
      metadata: { tone: "longing", topic: "time distortion" }
    },
    {
      id: "sh_03",
      category: "soldier_home",
      sender: "SGT. REEVES, T.",
      recipient: "EMMA (WIFE)",
      sequence: 3,
      content: "I can't tell you where we are or what we're doing. Just know that I'm okay. Still all here. All of me.",
      weight: 4,
      metadata: { tone: "reassuring (possibly false)", topic: "safety claim" }
    },
    {
      id: "sh_04",
      category: "soldier_home",
      sender: "SGT. REEVES, T.",
      recipient: "EMMA (WIFE)",
      sequence: 4,
      content: "Tell Marcus his dad is proud of him. I saw his report card in the last package. All A's. That's my boy.",
      weight: 3,
      metadata: { tone: "proud", topic: "son" }
    },
    {
      id: "sh_05",
      category: "soldier_home",
      sender: "SGT. REEVES, T.",
      recipient: "EMMA (WIFE)",
      sequence: 5,
      content: "I had to do something yesterday I never want to tell you about. I keep replaying it. I don't know how to be okay after this.",
      weight: 5,
      metadata: { tone: "haunted", topic: "moral injury" }
    },
    {
      id: "sh_06",
      category: "soldier_home",
      sender: "SGT. REEVES, T.",
      recipient: "EMMA (WIFE)",
      sequence: 6,
      content: "Two weeks. They said two weeks. Then I'll be on that plane and this will be behind us.",
      weight: 3,
      metadata: { tone: "hopeful", topic: "return date" }
    },
    {
      id: "sh_07",
      category: "soldier_home",
      sender: "SGT. REEVES, T.",
      recipient: "EMMA (WIFE)",
      sequence: 7,
      content: "If something happens — it probably won't, but if — the life insurance papers are in the blue folder. Top shelf. I'm sorry for even writing this.",
      weight: 5,
      metadata: { tone: "fearful practicality", topic: "contingency" }
    },
    {
      id: "sh_08",
      category: "soldier_home",
      sender: "SGT. REEVES, T.",
      recipient: "EMMA (WIFE)",
      sequence: 8,
      content: "Don't wait up for me. I mean that literally. Get some sleep. I'll be there when I get there. I love you. —T",
      weight: 4,
      metadata: { tone: "brave", topic: "final signoff" }
    }
  ],

  // ── Emergency Dispatch ──────────────────────────────

  emergency_dispatch: [
    {
      id: "ed_01",
      category: "emergency_dispatch",
      sender: "DISPATCH",
      recipient: "UNIT 7 (AMBULANCE)",
      sequence: 1,
      content: "Cardiac arrest, male mid-60s, 1482 Oakridge Drive. Caller is performing CPR. ETA needed.",
      weight: 5,
      metadata: { tone: "clinical urgency", topic: "cardiac event", urgency: "critical" }
    },
    {
      id: "ed_02",
      category: "emergency_dispatch",
      sender: "DISPATCH",
      recipient: "UNIT 7 (AMBULANCE)",
      sequence: 2,
      content: "Patient history: hypertension, prior MI in 2019. Allergic to contrast dye. Medics aware.",
      weight: 4,
      metadata: { tone: "informational", topic: "medical history", urgency: "high" }
    },
    {
      id: "ed_03",
      category: "emergency_dispatch",
      sender: "DISPATCH",
      recipient: "UNIT 7 (AMBULANCE)",
      sequence: 3,
      content: "CPR in progress for 6 minutes. Caller sounds distressed. Single occupant at scene.",
      weight: 5,
      metadata: { tone: "situation update", topic: "scene status", urgency: "critical" }
    },
    {
      id: "ed_04",
      category: "emergency_dispatch",
      sender: "UNIT 7",
      recipient: "DISPATCH",
      sequence: 4,
      content: "En route. 4 minutes out. Notify ED — possible STEMI. Need cath lab on standby.",
      weight: 5,
      metadata: { tone: "focused", topic: "hospital prep", urgency: "critical" }
    },
    {
      id: "ed_05",
      category: "emergency_dispatch",
      sender: "DISPATCH",
      recipient: "MEMORIAL GENERAL ED",
      sequence: 5,
      content: "Incoming STEMI, ETA 4 minutes. Male mid-60s, CPR in progress. Cath lab requested.",
      weight: 5,
      metadata: { tone: "hospital notification", topic: "ED alert", urgency: "critical" }
    },
    {
      id: "ed_06",
      category: "emergency_dispatch",
      sender: "DISPATCH",
      recipient: "UNIT 7 (AMBULANCE)",
      sequence: 6,
      content: "Memorial confirms cath lab team activated. Dr. Singh en route from home. Good to go.",
      weight: 4,
      metadata: { tone: "confirming", topic: "resource confirmed", urgency: "high" }
    },
    {
      id: "ed_07",
      category: "emergency_dispatch",
      sender: "UNIT 7",
      recipient: "DISPATCH",
      sequence: 7,
      content: "On scene. Patient pulseless. Continuing CPR. Defibrillator out. Clear the room.",
      weight: 5,
      metadata: { tone: "action report", topic: "field intervention", urgency: "critical" }
    },
    {
      id: "ed_08",
      category: "emergency_dispatch",
      sender: "UNIT 7",
      recipient: "DISPATCH",
      sequence: 8,
      content: "We have a pulse. Weak but present. Transporting now. 3 minutes to Memorial. Tell them we're coming.",
      weight: 5,
      metadata: { tone: "urgent relief", topic: "recovery", urgency: "critical" }
    }
  ],

  // ── Whistleblower Evidence ──────────────────────────

  whistleblower_evidence: [
    {
      id: "we_01",
      category: "whistleblower_evidence",
      sender: "ANON SOURCE",
      recipient: "JOURNALIST — K. MORENO",
      sequence: 1,
      content: "I have documents showing the water tests were falsified. All of them. Going back three years.",
      weight: 5,
      metadata: { tone: "resolute", topic: "data falsification", severity: "critical" }
    },
    {
      id: "we_02",
      category: "whistleblower_evidence",
      sender: "ANON SOURCE",
      recipient: "JOURNALIST — K. MORENO",
      sequence: 2,
      content: "The lead levels in District 4 are 40x the legal limit. Children are sick. The company knows.",
      weight: 5,
      metadata: { tone: "controlled fury", topic: "public health crisis", severity: "critical" }
    },
    {
      id: "we_03",
      category: "whistleblower_evidence",
      sender: "ANON SOURCE",
      recipient: "JOURNALIST — K. MORENO",
      sequence: 3,
      content: "Director Halloran signed off on the reports personally. I have the memos. He instructed staff to suppress.",
      weight: 5,
      metadata: { tone: "factual", topic: "executive culpability", severity: "critical" }
    },
    {
      id: "we_04",
      category: "whistleblower_evidence",
      sender: "ANON SOURCE",
      recipient: "JOURNALIST — K. MORENO",
      sequence: 4,
      content: "The internal report dated March 14th is the one that matters. It was buried. Everything after is fabricated.",
      weight: 4,
      metadata: { tone: "specific", topic: "key evidence", severity: "high" }
    },
    {
      id: "we_05",
      category: "whistleblower_evidence",
      sender: "ANON SOURCE",
      recipient: "JOURNALIST — K. MORENO",
      sequence: 5,
      content: "I can't come forward publicly. I have a family. But I can't live with this anymore either.",
      weight: 4,
      metadata: { tone: "conflicted", topic: "personal risk", severity: "personal" }
    },
    {
      id: "we_06",
      category: "whistleblower_evidence",
      sender: "ANON SOURCE",
      recipient: "JOURNALIST — K. MORENO",
      sequence: 6,
      content: "Verify through the EPA's own records. Compare the dates. The discrepancies are undeniable.",
      weight: 4,
      metadata: { tone: "instructional", topic: "verification path", severity: "high" }
    },
    {
      id: "we_07",
      category: "whistleblower_evidence",
      sender: "ANON SOURCE",
      recipient: "JOURNALIST — K. MORENO",
      sequence: 7,
      content: "I know what happens to people who do this. I've seen the company's NDAs. But this is bigger than me.",
      weight: 5,
      metadata: { tone: "determined", topic: "moral clarity", severity: "personal risk" }
    },
    {
      id: "we_08",
      category: "whistleblower_evidence",
      sender: "ANON SOURCE",
      recipient: "JOURNALIST — K. MORENO",
      sequence: 8,
      content: "If I disappear, publish everything. The full archive is in a dead drop I'll describe in the next message.",
      weight: 5,
      metadata: { tone: "contingency", topic: "insurance", severity: "critical" }
    }
  ],

  // ── Lost/Late Confession ────────────────────────────

  lost_confession: [
    {
      id: "lc_01",
      category: "lost_confession",
      sender: "MARGARET",
      recipient: "RUTH (SISTER)",
      sequence: 1,
      content: "I need to tell you something before one of us isn't here anymore. I should have said it in 1987.",
      weight: 4,
      metadata: { tone: "weighted", topic: "long-held secret" }
    },
    {
      id: "lc_02",
      category: "lost_confession",
      sender: "MARGARET",
      recipient: "RUTH (SISTER)",
      sequence: 2,
      content: "Dad didn't leave. I told him to go. I told him you'd be better off without him. I was wrong.",
      weight: 5,
      metadata: { tone: "guilty", topic: "family rupture" }
    },
    {
      id: "lc_03",
      category: "lost_confession",
      sender: "MARGARET",
      recipient: "RUTH (SISTER)",
      sequence: 3,
      content: "You spent your whole life thinking he didn't love you enough to stay. He tried to come back. I stopped him.",
      weight: 5,
      metadata: { tone: "anguished", topic: "revelation" }
    },
    {
      id: "lc_04",
      category: "lost_confession",
      sender: "MARGARET",
      recipient: "RUTH (SISTER)",
      sequence: 4,
      content: "I was jealous. You were his favorite and I couldn't bear it. I was fourteen and cruel and I ruined everything.",
      weight: 5,
      metadata: { tone: "self-loathing", topic: "motive" }
    },
    {
      id: "lc_05",
      category: "lost_confession",
      sender: "MARGARET",
      recipient: "RUTH (SISTER)",
      sequence: 5,
      content: "You don't have to forgive me. I don't forgive myself. But you deserved to know. You always deserved to know.",
      weight: 5,
      metadata: { tone: "resigned", topic: "acceptance of consequence" }
    },
    {
      id: "lc_06",
      category: "lost_confession",
      sender: "MARGARET",
      recipient: "RUTH (SISTER)",
      sequence: 6,
      content: "He wrote you letters. Every month until he died. I kept them in a box under the stairs. They're yours if you want them.",
      weight: 5,
      metadata: { tone: "amends attempt", topic: "hidden archive" }
    },
    {
      id: "lc_07",
      category: "lost_confession",
      sender: "MARGARET",
      recipient: "RUTH (SISTER)",
      sequence: 7,
      content: "I'm not well, Ruth. The doctors say months. I don't want to die with this. I don't want you to find out from someone else.",
      weight: 4,
      metadata: { tone: "mortality-driven", topic: "impending death" }
    },
    {
      id: "lc_08",
      category: "lost_confession",
      sender: "MARGARET",
      recipient: "RUTH (SISTER)",
      sequence: 8,
      content: "I love you. I've loved you badly, and selfishly, and too late. But I have. Every day. Even when I couldn't say it.",
      weight: 5,
      metadata: { tone: "raw truth", topic: "final declaration" }
    }
  ],

  // ── Final Level: Distress Signal ────────────────────

  final_distress: [
    {
      id: "fd_01",
      category: "final_distress",
      sender: "VESSEL NORTHERN STAR",
      recipient: "ANY STATION",
      sequence: 1,
      content: "MAYDAY MAYDAY MAYDAY. Northern Star, 44-foot fishing vessel. Taking on water. 6 souls aboard.",
      weight: 5,
      metadata: { tone: "emergency", topic: "maritime distress", urgency: "critical" }
    },
    {
      id: "fd_02",
      category: "final_distress",
      sender: "VESSEL NORTHERN STAR",
      recipient: "ANY STATION",
      sequence: 2,
      content: "Position 47°22'N, 124°38'W. Hull breach forward. Pumps failing. We have maybe 20 minutes.",
      weight: 5,
      metadata: { tone: "controlled panic", topic: "location and status", urgency: "critical" }
    },
    {
      id: "fd_03",
      category: "final_distress",
      sender: "VESSEL NORTHERN STAR",
      recipient: "ANY STATION",
      sequence: 3,
      content: "Life raft is damaged. We have vests for four. There are six of us. Please. Can anyone hear us?",
      weight: 5,
      metadata: { tone: "desperation", topic: "insufficient resources", urgency: "critical" }
    },
    {
      id: "fd_04",
      category: "final_distress",
      sender: "VESSEL NORTHERN STAR",
      recipient: "ANY STATION",
      sequence: 4,
      content: "My daughter is on this boat. She's eight. Her name is Lily. Someone please come.",
      weight: 5,
      metadata: { tone: "parental terror", topic: "child endangerment", urgency: "critical" }
    }
  ],

  // ── Final Level: Love Letter ────────────────────────

  final_love_letter: [
    {
      id: "fl_01",
      category: "final_love_letter",
      sender: "JUN",
      recipient: "ALEX",
      sequence: 1,
      content: "I've been writing this in my head for three years. Every version starts the same way: I'm sorry it took so long.",
      weight: 4,
      metadata: { tone: "nervous honesty", topic: "delayed courage" }
    },
    {
      id: "fl_02",
      category: "final_love_letter",
      sender: "JUN",
      recipient: "ALEX",
      sequence: 2,
      content: "Do you remember that night on the fire escape? You said 'some things are worth being afraid of.' You were right.",
      weight: 4,
      metadata: { tone: "tender recall", topic: "shared memory" }
    },
    {
      id: "fl_03",
      category: "final_love_letter",
      sender: "JUN",
      recipient: "ALEX",
      sequence: 3,
      content: "I loved you then. I love you now. Every version of me loves every version of you. I needed you to know that.",
      weight: 5,
      metadata: { tone: "declaration", topic: "core truth" }
    },
    {
      id: "fl_04",
      category: "final_love_letter",
      sender: "JUN",
      recipient: "ALEX",
      sequence: 4,
      content: "You don't have to answer. You don't have to feel the same way. This isn't about that. This is just — I couldn't leave it unsaid.",
      weight: 5,
      metadata: { tone: "unconditional", topic: "no expectation" }
    }
  ]
};


// ── Accessor Functions ─────────────────────────────────

function getStandardCategories() {
  return [
    'couple_arguing',
    'doctor_patient',
    'witness_crime',
    'parent_child',
    'soldier_home',
    'emergency_dispatch',
    'whistleblower_evidence',
    'lost_confession'
  ];
}

function getFinalCategories() {
  return ['final_distress', 'final_love_letter'];
}

function getPacketsByCategory(category) {
  return PACKET_DATA[category] || [];
}

function getPacketById(id) {
  for (const category of Object.keys(PACKET_DATA)) {
    const found = PACKET_DATA[category].find(p => p.id === id);
    if (found) return found;
  }
  return null;
}

function getPacketBySequence(category, seq) {
  const packets = PACKET_DATA[category];
  if (!packets) return null;
  return packets.find(p => p.sequence === seq) || null;
}

function getRandomPackets(category, count) {
  const pool = [...(PACKET_DATA[category] || [])];
  const result = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

/**
 * Build a shuffled packet queue from multiple categories.
 * @param {Array<{category: string, count: number}>} configs
 * @returns {Array<Object>} shuffled packets
 */
function buildLevelPackets(configs) {
  let pool = [];
  for (const cfg of configs) {
    pool = pool.concat(getRandomPackets(cfg.category, cfg.count));
  }
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

// Module support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PACKET_DATA;
  module.exports.getStandardCategories = getStandardCategories;
  module.exports.getFinalCategories = getFinalCategories;
  module.exports.getPacketsByCategory = getPacketsByCategory;
  module.exports.getPacketById = getPacketById;
  module.exports.getPacketBySequence = getPacketBySequence;
  module.exports.getRandomPackets = getRandomPackets;
  module.exports.buildLevelPackets = buildLevelPackets;
}
