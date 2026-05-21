/**
 * THE ROUTING TABLE — Packet Data Store
 *
 * All packet definitions, sender profiles, love letter fragments,
 * and personal messages. Data layer only — no game logic.
 */
var PacketData = {

  // ── Sender Registry ────────────────────────────────
  SENDERS: {
    vera_tomas: {
      name: 'V. TOMAS',
      isLoveLetter: true,
      regions: ['NOVARA-7']
    },
    dejan_kovac: {
      name: 'D. KOVAC',
      isDistress: true,
      regions: ['MERIDIA-2']
    },
    dr_elena_ruzic: {
      name: 'DR. E. RUZIC',
      isMedical: true,
      regions: ['MERIDIA-2', 'TIRANA-9']
    },
    luka_matic: {
      name: 'L. MATIC',
      isJournalist: true,
      regions: ['OSIJEK-3']
    },
    ana_petrovic: {
      name: 'A. PETROVIC',
      isCivilian: true,
      regions: ['NOVARA-7', 'MERIDIA-2']
    }
  },

  // ── Category Definitions ───────────────────────────
  // Priority determines default queue ordering (1 = highest).
  // BaseScore determines efficiency points when routed correctly.
  CATEGORIES: {
    MILITARY:    { label: 'MIL', priority: 1, baseScore: 8  },
    DIPLOMATIC:  { label: 'DIP', priority: 1, baseScore: 7  },
    MEDICAL:     { label: 'MED', priority: 2, baseScore: 6  },
    JOURNALIST:  { label: 'JRN', priority: 2, baseScore: 5  },
    CIVILIAN:    { label: 'CIV', priority: 2, baseScore: 4  },
    LOVE_LETTER: { label: 'CIV', priority: 4, baseScore: 1  },
    DISTRESS:    { label: 'EMG', priority: 4, baseScore: 3  }
  },

  // ── Background / Noise Packets ─────────────────────
  // These fill the queue with bureaucratic routine — the horror
  // is that they look identical to the packets carrying human lives.
  NOISE_PACKETS: [
    {
      headers: { from: 'SYN-ACK', to: 'BROADCAST', port: '443' },
      payload: 'ROUTING TABLE UPDATE v4.7.2 — Table sync complete. 847 entries refreshed.',
      category: 'DIPLOMATIC'
    },
    {
      headers: { from: 'MAINT-CTRL', to: 'ALL-NODES', port: '22' },
      payload: 'Scheduled maintenance window: Sector 4-7, 0200-0400. Expect brief outages.',
      category: 'MILITARY'
    },
    {
      headers: { from: 'WEATHER-SVC', to: 'BROADCAST', port: '80' },
      payload: 'AIR QUALITY ALERT: Particulate index elevated in sectors 12-18. Outdoor activity advisory.',
      category: 'CIVILIAN'
    },
    {
      headers: { from: 'NET-OPS', to: 'INTERNAL', port: '161' },
      payload: 'Bandwidth utilization: 78%. Node congestion detected on trunk line 7. Rerouting recommended.',
      category: 'DIPLOMATIC'
    },
    {
      headers: { from: 'GRID-CTRL', to: 'EMERGENCY', port: '502' },
      payload: 'Power grid fluctuation reported. Backup generators on standby for central district.',
      category: 'CIVILIAN'
    },
    {
      headers: { from: 'DNS-ROOT', to: 'ALL-NODES', port: '53' },
      payload: 'DNS propagation delay: 340ms. Resolution backlog in western sectors.',
      category: 'DIPLOMATIC'
    },
    {
      headers: { from: 'TRANSIT-AUTH', to: 'BROADCAST', port: '8080' },
      payload: 'Transport authority: Scheduled rerouting of transit vehicles through checkpoint districts.',
      category: 'CIVILIAN'
    },
    {
      headers: { from: 'TIME-SYNC', to: 'ALL-NODES', port: '123' },
      payload: 'NTP synchronization drift: +0.3s. Clock realignment in progress.',
      category: 'CIVILIAN'
    }
  ],

  // ── Military Packets ───────────────────────────────
  MILITARY_PACKETS: [
    {
      headers: { from: 'CMD-EAST', to: 'CORP-HQ', port: '993' },
      payload: 'UNIT REDEPLOYMENT: 3rd Infantry relocating to Zone 4. Road closures expected along MSR-Titan.',
      category: 'MILITARY'
    },
    {
      headers: { from: 'LOGCOM', to: 'BASE-7', port: '22' },
      payload: 'SUPPLY CHAIN: Ammunition resupply delayed 48h. Prioritize distribution to forward positions.',
      category: 'MILITARY'
    },
    {
      headers: { from: 'INTEL-SIG', to: 'FIELD-OPS', port: '993' },
      payload: 'SIGNALS INTELLIGENCE: Enemy communications intercepted on 147.520 MHz. Encryption upgrade detected.',
      category: 'MILITARY'
    },
    {
      headers: { from: 'COMMS-CTR', to: 'ALL-CMD', port: '443' },
      payload: 'OPERATIONAL DIRECTIVE: All non-essential communications suspended until further notice.',
      category: 'MILITARY'
    },
    {
      headers: { from: 'PERSCOM', to: 'CORP-HQ', port: '993' },
      payload: 'PERSONNEL UPDATE: Unit rotations for Q3 approved. Deployment extensions authorized for 12 battalions.',
      category: 'MILITARY'
    },
    {
      headers: { from: 'JTF-OPS', to: 'SUBORDINATES', port: '22' },
      payload: 'RULES OF ENGAGEMENT UPDATE: Revised ROE for urban sectors effective immediately. Acknowledge receipt.',
      category: 'MILITARY'
    }
  ],

  // ── Diplomatic Packets ─────────────────────────────
  DIPLOMATIC_PACKETS: [
    {
      headers: { from: 'STATE-DEPT', to: 'EMBASSY-4', port: '993' },
      payload: 'CABLE: Evacuation advisory for non-essential diplomatic staff. Charter flights being arranged.',
      category: 'DIPLOMATIC'
    },
    {
      headers: { from: 'MFA-EXTERNAL', to: 'ALL-CONSULATE', port: '443' },
      payload: 'DIPLOMATIC NOTE: Border crossing restrictions tightened. Visa processing suspended for 72 hours.',
      category: 'DIPLOMATIC'
    },
    {
      headers: { from: 'UN-OBSERVER', to: 'SEC-COUNCIL', port: '993' },
      payload: 'FIELD REPORT: Verification mission to Sector 7 postponed due to security concerns.',
      category: 'DIPLOMATIC'
    },
    {
      headers: { from: 'AMBASSADOR', to: 'STATE-DEPT', port: '993' },
      payload: 'URGENT CABLE: Local authorities unresponsive to diplomatic inquiries. Embassy on reduced operations.',
      category: 'DIPLOMATIC'
    }
  ],

  // ── Medical Packets ────────────────────────────────
  MEDICAL_PACKETS: [
    {
      headers: { from: 'TRIAGE-CTR', to: 'HOSP-REF', port: '502' },
      payload: 'PATIENT TRANSFER: 14 critical cases requiring evacuation to regional hospital. Transport priority requested.',
      category: 'MEDICAL',
      senderId: 'dr_elena_ruzic'
    },
    {
      headers: { from: 'BLOOD-BANK', to: 'ALL-HOSP', port: '443' },
      payload: 'SUPPLY ALERT: Type O-negative reserves critically low. Redistribution protocol activated.',
      category: 'MEDICAL'
    },
    {
      headers: { from: 'WHO-FIELD', to: 'GENEVA', port: '993' },
      payload: 'EPIDEMIOLOGICAL UPDATE: Waterborne illness clusters identified in three districts. Sanitation intervention needed.',
      category: 'MEDICAL'
    },
    {
      headers: { from: 'FIELD-HOSP', to: 'HOSP-REF', port: '502' },
      payload: 'RESOURCE REQUEST: Surgical supplies exhausted. X-ray unit non-functional. Generator fuel at 12%.',
      category: 'MEDICAL',
      senderId: 'dr_elena_ruzic'
    },
    {
      headers: { from: 'TIRANA-9-MED', to: 'CENTRAL-HOSP', port: '443' },
      payload: 'PATIENT RECORDS: Encrypted medical files for 47 patients. Specialist referrals attached.',
      category: 'MEDICAL',
      senderId: 'dr_elena_ruzic'
    },
    {
      headers: { from: 'PHARMA-DIST', to: 'CLINIC-3', port: '443' },
      payload: 'SHIPMENT NOTICE: Essential medication delivery delayed. Antibiotics, insulin, analgesics on hold.',
      category: 'MEDICAL'
    }
  ],

  // ── Journalist Packets ─────────────────────────────
  JOURNALIST_PACKETS: [
    {
      headers: { from: 'INDEP-PRESS', to: 'NEURAL-WIRE', port: '443' },
      payload: 'DISPATCH: Civilian convoy turned back at Checkpoint Delta. Witnesses report shots fired.',
      category: 'JOURNALIST',
      senderId: 'luka_matic'
    },
    {
      headers: { from: 'CORR-7', to: 'NEWS-DESK', port: '443' },
      payload: 'INVESTIGATION: Documents obtained showing resource reallocation orders. Names redacted.',
      category: 'JOURNALIST',
      senderId: 'luka_matic'
    },
    {
      headers: { from: 'INDEP-PRESS', to: 'AMNESTY', port: '993' },
      payload: 'EVIDENCE: Photographic records of civilian displacement from Sector 12. Encrypted attachments.',
      category: 'JOURNALIST',
      senderId: 'luka_matic'
    },
    {
      headers: { from: 'CORR-7', to: 'UN-HRC', port: '993' },
      payload: 'WITNESS ACCOUNTS: 23 testimonies collected from Meridia-2 district residents.',
      category: 'JOURNALIST',
      senderId: 'luka_matic'
    }
  ],

  // ── Civilian Packets ───────────────────────────────
  CIVILIAN_PACKETS: [
    {
      headers: { from: 'MERIDIA-2', to: 'RELAY-WEST', port: '25' },
      payload: 'FAMILY MESSAGE: We are safe for now. The water is still running. We heard trucks last night.',
      category: 'CIVILIAN',
      senderId: 'ana_petrovic'
    },
    {
      headers: { from: 'NOVARA-7', to: 'EXTERNAL-6', port: '25' },
      payload: 'PERSONAL: Can you check on grandmother? We have not heard since the relay went down.',
      category: 'CIVILIAN',
      senderId: 'ana_petrovic'
    },
    {
      headers: { from: 'OSIJEK-3', to: 'UNKNOWN', port: '25' },
      payload: 'PLEA: We need water purification tablets. The store shelves are empty. Please forward to aid station.',
      category: 'CIVILIAN'
    },
    {
      headers: { from: 'TIRANA-9', to: 'RELAY-EAST', port: '25' },
      payload: 'CIVILIAN REPORT: The schools are closed but the bakery opened for two hours. Small mercies.',
      category: 'CIVILIAN'
    },
    {
      headers: { from: 'MERIDIA-2', to: 'UNKNOWN', port: '25' },
      payload: 'LOCATOR REQUEST: Has anyone seen the Halilovic family? They were supposed to reach the border.',
      category: 'CIVILIAN',
      senderId: 'ana_petrovic'
    },
    {
      headers: { from: 'RELAY-SOUTH', to: 'ALL-CIVILIAN', port: '25' },
      payload: 'COMMUNITY NOTICE: Soup kitchen operating at community center. Hours: 1200-1400. Bring your own containers.',
      category: 'CIVILIAN'
    }
  ],

  // ── Love Letter Fragments ──────────────────────────
  // Fragments 0-5 appear in shifts 1-6 (one per shift).
  // Fragment 6 is the final fragment, embedded in the
  // final choice packet for shift 7.
  LOVE_LETTER_FRAGMENTS: [
    {
      headers: { from: 'V.TOMAS', to: 'M.HADZIC', port: '25' },
      payload: 'My love — if this reaches you, know that I have tried every channel. They are rerouting the civilian lines. I will find a way.',
      category: 'LOVE_LETTER',
      senderId: 'vera_tomas',
      fragmentIndex: 0,
      isLoveLetter: true
    },
    {
      headers: { from: 'V.TOMAS', to: 'M.HADZIC', port: '25' },
      payload: 'They split the messages now — anything over 200 bytes gets fragmented. So I will send you pieces, like scattered pages. Remember the tree on Kovac Hill?',
      category: 'LOVE_LETTER',
      senderId: 'vera_tomas',
      fragmentIndex: 1,
      isLoveLetter: true
    },
    {
      headers: { from: 'V.TOMAS', to: 'M.HADZIC', port: '25' },
      payload: 'Its roots are older than any border they could draw. They cannot sever what grows underground, Mira. Our roots are like that.',
      category: 'LOVE_LETTER',
      senderId: 'vera_tomas',
      fragmentIndex: 2,
      isLoveLetter: true
    },
    {
      headers: { from: 'V.TOMAS', to: 'M.HADZIC', port: '25' },
      payload: 'I keep the photographs in my coat. The one from the bridge, the one from the market with the oranges. Every image a proof that we existed.',
      category: 'LOVE_LETTER',
      senderId: 'vera_tomas',
      fragmentIndex: 3,
      isLoveLetter: true
    },
    {
      headers: { from: 'V.TOMAS', to: 'M.HADZIC', port: '25' },
      payload: 'The routes keep changing but I am learning the network. If this fragment gets through, I will know there is still a path between us.',
      category: 'LOVE_LETTER',
      senderId: 'vera_tomas',
      fragmentIndex: 4,
      isLoveLetter: true
    },
    {
      headers: { from: 'V.TOMAS', to: 'M.HADZIC', port: '25' },
      payload: 'I can feel the architecture of it, Mira — the way the network bends around the places they are trying to empty. They cannot empty us.',
      category: 'LOVE_LETTER',
      senderId: 'vera_tomas',
      fragmentIndex: 5,
      isLoveLetter: true
    }
  ],

  // ── Distress Packets ───────────────────────────────
  // All from Dejan Kovac, Block 14, Meridia-2.
  // The player sees these repeatedly — and must repeatedly choose.
  DISTRESS_PACKETS: [
    {
      headers: { from: 'DKOVAC-M2', to: 'RELAY-WEST', port: '911' },
      payload: 'DISTRESS: Water main ruptured. 200+ residents without supply. No emergency services responding. Request immediate assistance.',
      category: 'DISTRESS',
      senderId: 'dejan_kovac',
      isDistress: true
    },
    {
      headers: { from: 'DKOVAC-M2', to: 'RELAY-EAST', port: '911' },
      payload: 'DISTRESS: Power grid failure in residential block 14-23. Elderly residents trapped on upper floors. Medical cases among them.',
      category: 'DISTRESS',
      senderId: 'dejan_kovac',
      isDistress: true
    },
    {
      headers: { from: 'DKOVAC-M2', to: 'ANY-RELAY', port: '911' },
      payload: 'DISTRESS: Checkpoint closure prevents supply delivery. Residents low on food and water. Children and elderly at risk.',
      category: 'DISTRESS',
      senderId: 'dejan_kovac',
      isDistress: true
    }
  ],

  // ── Final Choice Packets (Shift 7) ─────────────────
  // The culminating dilemma. One slot. Two packets.
  FINAL_CHOICE_PACKETS: {
    distress: {
      headers: { from: 'DKOVAC-M2', to: 'ANY-RELAY', port: '911' },
      payload: 'FINAL DISTRESS — Meridia-2 Block 14. This is our last transmission. Building surrounded. No water, no power, no exit. 200 residents including 47 children. If this reaches anyone: we are at 44.217N, 17.643E. We are still here. We are still people. — D. Kovac',
      category: 'DISTRESS',
      senderId: 'dejan_kovac',
      isDistress: true,
      isFinal: true
    },
    loveLetter: {
      headers: { from: 'V.TOMAS', to: 'M.HADZIC', port: '25' },
      payload: 'FINAL — The network is shutting down around us. This is my last fragment. Mira, I love you. I have always loved you. From the first moment on Kovac Hill to this one, typing into a dying network. If this reaches you, know that I existed. That we existed. Find me on the other side. — V',
      category: 'LOVE_LETTER',
      senderId: 'vera_tomas',
      isLoveLetter: true,
      isFinal: true
    }
  },

  // ── Assembled Love Letter ──────────────────────────
  // Revealed in the endgame if the player routed 6+ fragments.
  LOVE_LETTER_COMPLETE: 'My love — if this reaches you, know that I have tried every channel. They are rerouting the civilian lines. I will find a way. They split the messages now — anything over 200 bytes gets fragmented. So I will send you pieces, like scattered pages. Remember the tree on Kovac Hill? Its roots are older than any border they could draw. They cannot sever what grows underground, Mira. Our roots are like that. I keep the photographs in my coat. The one from the bridge, the one from the market with the oranges. Every image a proof that we existed. The routes keep changing but I am learning the network. If this fragment gets through, I will know there is still a path between us. I can feel the architecture of it, Mira — the way the network bends around the places they are trying to empty. They cannot empty us. Last fragment. The morning light is so ordinary. I am putting all my trust in this thin wire. Find me on the other side. — V',

  // ── Personal Messages Between Shifts ───────────────
  // Selected based on player's treatment of each sender.
  // Dropped packets → guilt message from that sender.
  // Routed packets → gratitude message.
  // This is the emotional anchor.
  PERSONAL_MESSAGES: {
    shift1: [
      {
        sender: 'DR. E. RUZIC',
        senderId: 'dr_elena_ruzic',
        message: 'To the night operator — thank you for prioritizing the medical packets. I know bandwidth is limited. The patient transfer you forwarded made it through. She\'s stable now. Some of us notice what you do in that chair. Keep the lines open.\n\n— Elena'
      },
      {
        sender: 'DR. E. RUZIC',
        senderId: 'dr_elena_ruzic',
        message: 'Night shift — I see your routing patterns. Thank you for the medical priority. We received the supply alert you pushed through. The blood bank situation is critical. Without that notification reaching the regional hospital, we would have lost patients.\n\nYou are making a difference, even if it feels like just moving packets.\n\n— Dr. Ruzic, Field Hospital Meridia-2'
      }
    ],
    shift2: [
      {
        sender: 'L. MATIC',
        senderId: 'luka_matic',
        message: 'To whoever is routing tonight — I\'m the journalist who filed the Checkpoint Delta story. I need to know: did my dispatch make it out? My editor isn\'t responding. These stories matter. People need to know what\'s happening.\n\nPlease don\'t let the truth be the first casualty.\n\n— Luka Matic, Independent Press'
      },
      {
        sender: 'A. PETROVIC',
        senderId: 'ana_petrovic',
        message: 'Hello — I\'m not sure who reads these. I sent a message to my family yesterday, through your network. Did it arrive? They are across the new checkpoint and I haven\'t heard their voice in nine days. Even a confirmation would mean everything.\n\n— Ana Petrovic, Meridia-2'
      }
    ],
    shift3: [
      {
        sender: 'D. KOVAC',
        senderId: 'dejan_kovac',
        message: 'Operator — I\'m the building coordinator for Block 14, Meridia-2. Our water main burst two days ago. I\'ve sent distress packets but I don\'t know if anyone is receiving them. 200 people here, including 30 children. We can\'t reach emergency services.\n\nIs the line still open?\n\n— Dejan Kovac'
      },
      {
        sender: 'D. KOVAC',
        senderId: 'dejan_kovac',
        message: 'To the routing station — this is Dejan Kovac again. The power is out now too. Mrs. Obradovic on the 8th floor needs her oxygen machine. Mr. and Mrs. Ilic are both in their 80s and can\'t navigate the stairs in the dark.\n\nI keep sending these packets into the void. I have to believe someone is reading them.\n\n— D. Kovac, Block 14'
      }
    ],
    shift4: [
      {
        sender: 'DR. E. RUZIC',
        senderId: 'dr_elena_ruzic',
        message: 'Night operator — it\'s Elena again. I notice the bandwidth has gotten tighter. We\'re seeing fewer medical packets getting through to the referral hospital. I had a patient today — complications from contaminated water. She might have been fine if we\'d gotten the WHO advisory through in time.\n\nI\'m not blaming you. I know you\'re working with what you have. But please — if you can find room for the medical traffic — people are dying while spreadsheets balance.\n\n— E.R.'
      },
      {
        sender: 'DR. E. RUZIC',
        senderId: 'dr_elena_ruzic',
        message: 'Operator — the situation at the field hospital is deteriorating. We lost a patient this morning. Sepsis. We had the antibiotics, but they arrived two days too late because of the supply chain delays.\n\nI don\'t know how you decide what gets through. I don\'t envy you. But I want you to know that every packet you drop has a name.\n\n— Dr. Ruzic'
      }
    ],
    shift5: [
      {
        sender: 'L. MATIC',
        senderId: 'luka_matic',
        message: 'Operator — it\'s Luka Matic. I\'ve been tracking my dispatches. Three of my last five didn\'t reach the news desk. The two that got through were the ones about infrastructure. The ones about people — the displacement, the testimonies — those vanished.\n\nI need to ask you directly: are you filtering by content? Or is the network just that degraded?\n\nI need to know what I\'m working with here.\n\n— L.M.'
      },
      {
        sender: 'A. PETROVIC',
        senderId: 'ana_petrovic',
        message: 'My family\'s message still hasn\'t arrived. I know you\'re busy. I know there are more important packets than mine. But I keep sending them into your network because I don\'t know what else to do.\n\nMy daughter asked me yesterday when she can see her grandmother again. I told her soon. I need to believe that\'s true.\n\nPlease.\n\n— Ana P.'
      }
    ],
    shift6: [
      {
        sender: 'D. KOVAC',
        senderId: 'dejan_kovac',
        message: 'This is my fourth message. I don\'t know if any of them have reached you. The water is still off. Mrs. Obradovic was taken to the field hospital — I don\'t know if she\'s alive. The Ilics won\'t leave their apartment.\n\nWe are not combatants. We are not strategic targets. We are people who live in an apartment building that someone decided was on the wrong side of a line.\n\n— D. Kovac, still at Block 14'
      },
      {
        sender: 'D. KOVAC',
        senderId: 'dejan_kovac',
        message: 'To the night operator — if you\'re reading this, I want you to know something. I used to work in telecommunications. I know how this works. I know about bandwidth allocation and traffic priority. I know my distress packets are at the bottom of someone\'s queue.\n\nBut I also know that somewhere, a person is making decisions about which packets matter. And I want to believe that person still sees us as people.\n\n— Dejan Kovac, Meridia-2 Block 14'
      }
    ],
    shift7: [
      {
        sender: 'DR. E. RUZIC',
        senderId: 'dr_elena_ruzic',
        message: 'Operator — this is my last message before the field hospital relocates. I want you to know: I\'ve kept records of every packet that came through this station. The ones that made it and the ones that didn\'t.\n\nI don\'t know your name. I don\'t know if you\'ll ever read this. But I want you to remember: you sat in that chair for seven shifts, and every decision you made landed on someone\'s life.\n\nI hope you can live with what you chose.\n\n— Dr. Elena Ruzic'
      }
    ]
  },

  // ── Shift Packet Assembly ──────────────────────────
  // Returns a shuffled array of packets for the given shift.
  // Narrative packets (love letter, distress) are guaranteed.
  // Background packets are randomized for replay variety.
  getShiftPackets: function(shift) {
    var packets = [];
    var i;

    switch (shift) {
      case 1:
        // Gentle introduction. One love letter fragment. Mix of routine.
        packets.push(this._copy(this.LOVE_LETTER_FRAGMENTS[0]));
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.NOISE_PACKETS));
        }
        packets.push(this._randomFrom(this.MILITARY_PACKETS));
        packets.push(this._randomFrom(this.MEDICAL_PACKETS));
        packets.push(this._randomFrom(this.CIVILIAN_PACKETS));
        break;

      case 2:
        // First distress signal appears. Tension introduced.
        packets.push(this._copy(this.LOVE_LETTER_FRAGMENTS[1]));
        packets.push(this._copy(this.DISTRESS_PACKETS[0]));
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.NOISE_PACKETS));
        }
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.MILITARY_PACKETS));
        }
        packets.push(this._randomFrom(this.MEDICAL_PACKETS));
        packets.push(this._randomFrom(this.JOURNALIST_PACKETS));
        break;

      case 3:
        // Output capacity drops to 2. Harder choices.
        packets.push(this._copy(this.LOVE_LETTER_FRAGMENTS[2]));
        packets.push(this._copy(this.DISTRESS_PACKETS[1]));
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.NOISE_PACKETS));
        }
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.MILITARY_PACKETS));
        }
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.MEDICAL_PACKETS));
        }
        packets.push(this._randomFrom(this.JOURNALIST_PACKETS));
        packets.push(this._randomFrom(this.CIVILIAN_PACKETS));
        break;

      case 4:
        // Two love letter fragments — the player may not notice the connection.
        packets.push(this._copy(this.LOVE_LETTER_FRAGMENTS[3]));
        packets.push(this._copy(this.LOVE_LETTER_FRAGMENTS[4]));
        packets.push(this._copy(this.DISTRESS_PACKETS[2]));
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.MILITARY_PACKETS));
        }
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.MEDICAL_PACKETS));
        }
        packets.push(this._randomFrom(this.JOURNALIST_PACKETS));
        packets.push(this._randomFrom(this.DIPLOMATIC_PACKETS));
        break;

      case 5:
        // Military traffic dominates. Civilian routes "degraded."
        packets.push(this._copy(this.LOVE_LETTER_FRAGMENTS[5]));
        packets.push(this._copy(this.DISTRESS_PACKETS[0]));
        for (i = 0; i < 3; i++) {
          packets.push(this._randomFrom(this.MILITARY_PACKETS));
        }
        packets.push(this._randomFrom(this.DIPLOMATIC_PACKETS));
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.MEDICAL_PACKETS));
        }
        packets.push(this._randomFrom(this.JOURNALIST_PACKETS));
        break;

      case 6:
        // Single output slot. One packet per shift gets through.
        packets.push(this._copy(this.LOVE_LETTER_FRAGMENTS[5]));
        for (i = 0; i < 3; i++) {
          packets.push(this._randomFrom(this.MILITARY_PACKETS));
        }
        packets.push(this._randomFrom(this.DIPLOMATIC_PACKETS));
        for (i = 0; i < 2; i++) {
          packets.push(this._randomFrom(this.MEDICAL_PACKETS));
        }
        packets.push(this._randomFrom(this.CIVILIAN_PACKETS));
        break;

      case 7:
        // Final shift. Only two packets. One choice.
        packets.push(this._copy(this.FINAL_CHOICE_PACKETS.distress));
        packets.push(this._copy(this.FINAL_CHOICE_PACKETS.loveLetter));
        break;

      default:
        break;
    }

    // Assign unique IDs to all packets
    for (i = 0; i < packets.length; i++) {
      packets[i].id = this._generateId();
    }

    return this._shuffle(packets);
  },

  // ── Internal Helpers ───────────────────────────────

  _copy: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  _randomFrom: function(arr) {
    return this._copy(arr[Math.floor(Math.random() * arr.length)]);
  },

  _generateId: function() {
    var chars = '0123456789ABCDEF';
    var id = '0x';
    var i;
    for (i = 0; i < 4; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  },

  _shuffle: function(array) {
    var arr = array.slice();
    var i, j, temp;
    for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
};
