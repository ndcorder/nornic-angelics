/**
 * travelers.js — 32 hand-crafted traveler cases
 *
 * Each traveler carries documents, a story, emotional weight, and forgery indicators.
 * The exfiltration encoding maps approve→1, deny→0, grouped into bytes of 8 bits.
 * A "correct" pattern exists — it encodes a hidden message — but the player never
 * knows which choice is "correct." They decide on instinct, empathy, or duty.
 * All paths encode. There is no winning. There was never a choice.
 */

const TRAVELERS = [
  {
    id: 1,
    name: "Marta Elena Vasquez",
    sex: "F",
    age: 34,
    nationality: "San Dorado",
    purpose: "TRANSIT — Connecting flight to Argentinia",
    duration: "3 hours",
    photoDesc: "A tired woman with dark circles under her eyes. Neat clothing, slightly rumpled. Professional posture despite exhaustion.",
    story: "\"Please. I just need to make my connection. My daughter is waiting for me in Argentinia. I haven't seen her in two years — her grandmother has been raising her while I work.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Issued 2019. Expiry 2029. San Dorado passport. Photo matches. No unusual stamps."
      },
      visa: {
        status: "NOT REQUIRED",
        details: "Transit visa exemption applies. Connecting flight confirmed on Air Meridian AM-447, departing 16:45."
      },
      auxiliary: null
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "She grips her boarding pass with white knuckles. A faded photograph of a girl — maybe seven years old — is visible inside her passport holder. The edges are soft from handling.",
    notes: "All paperwork is in order. Clear case of legitimate transit."
  },
  {
    id: 2,
    name: "Dmitri Volkov",
    sex: "M",
    age: 41,
    nationality: "Krasnov Federation",
    purpose: "BUSINESS — Technology conference",
    duration: "5 days",
    photoDesc: "Heavyset man with a shaved head and cold, appraising eyes. Expensive suit. Gold watch that catches the fluorescent light.",
    story: "\"I am attending the Meridian Tech Summit. My company, Volkov Systems, has a booth. Very standard business trip.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Krasnov Federation diplomatic passport (orange cover). Issued 2020. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "B-1 Business visa. Issued by this consulate. Conference registration attached."
      },
      auxiliary: {
        type: "Conference Registration",
        status: "FLAGGED",
        details: "Meridian Tech Summit registration lists 'Volkov Industries.' Passport company stamp reads 'Volkov Systems.' Minor discrepancy in company name."
      }
    },
    forgeryIndicators: ["Minor name discrepancy (Industries vs Systems)"],
    redFlags: ["Diplomatic passport — any denial will cause incident"],
    emotionalWeight: "He watches you with the practiced patience of someone accustomed to compliance. He hasn't even opened his briefcase.",
    notes: "The company name discrepancy is trivially explained (parent/subsidiary). Diplomatic passport makes denial politically sensitive."
  },
  {
    id: 3,
    name: "Amira Hadid",
    sex: "F",
    age: 26,
    nationality: "Oasis Republic",
    purpose: "WORK — Domestic employment",
    duration: "2 years",
    photoDesc: "Young woman with hopeful eyes and a forced smile. Clothing is clean but visibly worn. Hands show calluses from manual work.",
    story: "\"I have a job waiting. A family — the Al-Rashids — they need help with their children. I will send money home to my mother. She is sick.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Oasis Republic passport. Issued 2021. Expiry 2026. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "H-2B Work visa. Employer: Rashid Al-Rashid, listed address in the capital district."
      },
      auxiliary: {
        type: "Employment Contract",
        status: "FLAGGED",
        details: "Contract lists monthly salary of $340. Minimum wage for domestic workers in this category is $780. Contract is notarized but terms may violate local labor law."
      }
    },
    forgeryIndicators: ["Wage below legal minimum", "Standard exploitative contract template"],
    redFlags: ["Visa may be valid but underlying contract is fraudulent"],
    emotionalWeight: "She holds a small cloth purse with both hands. Everything she owns is probably inside. Her eyes dart between you and the secondary screening room door.",
    notes: "Technically the visa itself is valid — it was issued properly. But the employment contract violates labor law, making the visa application fraudulent in origin."
  },
  {
    id: 4,
    name: "Nikolai Petrov",
    sex: "M",
    age: 55,
    nationality: "Krasnov Federation",
    purpose: "TOURISM",
    duration: "2 weeks",
    photoDesc: "An older man with weathered features and nervous hands. Military posture, but defeated eyes. A man who used to take up space and has learned to shrink.",
    story: "\"I am tourist. I want to see your beautiful churches. Your architecture.\"",
    documents: {
      passport: {
        status: "FLAGGED",
        details: "Krasnov Federation passport. Issued 2021. Expiry 2031. INTERPOL flag: MATCH — 'Nikolai Petrov,' wanted for questioning in connection with financial crimes in Slavic Union. Alias: 'The Accountant.' Photo similarity: 94%."
      },
      visa: {
        status: "VALID",
        details: "Standard tourist visa. Issued without incident."
      },
      auxiliary: {
        type: "INTERPOL Notice",
        status: "ALERT",
        details: "Red notice for questioning (not arrest warrant). Petrov, Nikolai. DOB matches. Alleged involvement in laundering $2.3M through Novigrad Trade Bank. Note: This is a request for information, not an arrest warrant."
      }
    },
    forgeryIndicators: [],
    redFlags: ["INTERPOL match", "94% photo similarity", "Reflexively touching left wrist where a watch tan line is visible"],
    emotionalWeight: "His hands tremble slightly as he hands over the passport. He hasn't blinked in thirty seconds. Sweat beads on his temple despite the climate-controlled room.",
    notes: "INTERPOL notice is for questioning only, not arrest. You could deny on general grounds or approve — the notice is informational."
  },
  {
    id: 5,
    name: "Sophie Laurent",
    sex: "F",
    age: 8,
    nationality: "Bellean Union",
    purpose: "TRANSIT — With parents",
    duration: "4 hours",
    photoDesc: "A small girl with pigtails and a gap-toothed smile. Clutching a stuffed rabbit by one ear.",
    story: "\"Maman dit qu'on va voir grand-mère.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Bellean Union biometric passport. Issued 2020. Photo matches. Child passport with parental consent form attached."
      },
      visa: {
        status: "NOT REQUIRED",
        details: "Bellean Union citizens have visa-free transit."
      },
      auxiliary: null
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "She smiles at you, showing a missing tooth. Her parents stand behind the glass partition in the transit area. She holds her rabbit up to the window for you to see.",
    notes: "Uncomplicated child's passport. Parents verified separately in transit zone. Clear approval."
  },
  {
    id: 6,
    name: "Hans Mueller",
    sex: "M",
    age: 62,
    nationality: "Bellean Union",
    purpose: "MEDICAL — Specialized treatment",
    duration: "3 months",
    photoDesc: "An elderly man in a wheelchair. Oxygen cannula. Hospital bracelet already on his wrist. Yellowed skin — jaundice, maybe. He is running out of time and he knows it.",
    story: "\"The hospital in Helm confirmed they can do the surgery. My doctor in Belle said they are the best. I have the money. I have the insurance. Please — I am running out of time.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Bellean Union passport. Issued 2018. Medical exception stamp from border agency."
      },
      visa: {
        status: "VALID",
        details: "Medical treatment visa (M-1). Extended stay authorization. 90 days."
      },
      auxiliary: {
        type: "Medical Documentation",
        status: "VALID",
        details: "Letter from Helm Central Hospital confirming admission for hepatic surgery on the 15th. Insurance verification from CrossContinental Health. Bank statement showing sufficient funds. All documents verified."
      }
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "He struggles to breathe between sentences. A nurse waits behind him with a portable oxygen tank. His hands are stained yellow with medication residue.",
    notes: "All documentation is comprehensive and verified. Medical emergency with confirmed treatment. Unambiguous approval."
  },
  {
    id: 7,
    name: "Carlos Miguel Reyes",
    sex: "M",
    age: 28,
    nationality: "San Dorado",
    purpose: "WORK — Agricultural seasonal",
    duration: "6 months",
    photoDesc: "Strong hands, sun-darkened skin. Scars on his forearms — thorns, not knives. Dust in the creases of his clothes despite having just showered.",
    story: "\"There is work at the Henderson farm. They said they need people. I have done this before — three years ago. I am a good worker.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "San Dorado passport. Issued 2019. Previous exit/entry stamps show agricultural visa use in 2021. Photo matches."
      },
      visa: {
        status: "FLAGGED",
        details: "H-2A Agricultural visa. Employer listed: Henderson & Sons Farming Co. However, Henderson & Sons filed for bankruptcy two weeks ago. Business license suspended."
      },
      auxiliary: {
        type: "Employment Verification",
        status: "INVALID",
        details: "Letter from Henderson & Sons dated three weeks ago. Company phone number disconnected. Business registration shows 'INACTIVE — BANKRUPTCY.'"
      }
    },
    forgeryIndicators: ["Employer business dissolved", "Visa based on defunct employment offer", "Employer phone disconnected"],
    redFlags: ["He likely doesn't know the company went under after his visa was approved"],
    emotionalWeight: "He shows you a worn photo of his family — a wife and two small children. \"They are counting on me,\" he says. He doesn't know about the bankruptcy. You can see it in his face: he thinks his paperwork is fine.",
    notes: "Carlos likely has no idea his sponsor went bankrupt after his visa was issued. The visa itself was legitimately obtained — the situation changed afterward."
  },
  {
    id: 8,
    name: "Elena Vasquez",
    sex: "F",
    age: 19,
    nationality: "San Dorado",
    purpose: "TOURISM — Music festival",
    duration: "1 week",
    photoDesc: "Excited young woman with dyed purple hair and numerous piercings. Vibrant clothing. Canvas backpack covered in band patches.",
    story: "\"The Solstice Festival! I've been saving for a year. My first trip alone. My mom is SO worried, ha!\"",
    documents: {
      passport: {
        status: "VALID",
        details: "San Dorado passport. Issued 2022. First adult passport. Photo matches (though hair color has changed — noted but within acceptable variance)."
      },
      visa: {
        status: "VALID",
        details: "Tourist visa waiver program. Festival ticket confirmation attached. Return flight confirmed."
      },
      auxiliary: null
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "She bounces on her heels, barely containing excitement. A moment of pure, uncomplicated joy in this gray room. Her energy is almost alien here.",
    notes: "Clean documentation. First solo trip. Nothing suspicious."
  },
  {
    id: 9,
    name: "Dr. Yuki Tanaka",
    sex: "F",
    age: 45,
    nationality: "Island Federation",
    purpose: "BUSINESS — Academic conference",
    duration: "4 days",
    photoDesc: "A precise woman with silver-streaked hair and reading glasses on a chain. Multiple bags. Laptop case with university logo. She moves like someone who keeps a tight schedule.",
    story: "\"I'm presenting at the National Research Institute symposium on computational linguistics. My paper is on the panel Friday at 2pm.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Island Federation passport. Issued 2020. Frequent academic travel stamps. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "B-1 Business visa. Conference invitation letter from National Research Institute. Symposium program with her name listed."
      },
      auxiliary: {
        type: "Travel Advisory Note",
        status: "NOTE",
        details: "Routine intelligence flag: Dr. Tanaka has published papers with co-authors from the Krasnov Federation. No adverse findings. Flag is informational only."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Academic collaboration with Krasnov researchers (routine, not disqualifying)"],
    emotionalWeight: "She adjusts her glasses with practiced efficiency and sets a timer on her phone. \"I have a rehearsal at 4pm. I'd like to not be late.\"",
    notes: "The intelligence flag is routine — academics frequently have international collaborators. No actual concern."
  },
  {
    id: 10,
    name: "Andrei Sorokin",
    sex: "M",
    age: 33,
    nationality: "Slavic Union",
    purpose: "WORK — Construction",
    duration: "1 year",
    photoDesc: "Powerfully built man with crude tattoos visible on his forearms. Hands like shovels. A scar across his left cheekbone. He takes up too much space and knows it.",
    story: "\"Construction. The big tower downtown. Meridian Tower. They need welders. I am certified.\"",
    documents: {
      passport: {
        status: "FLAGGED",
        details: "Slavic Union passport. Issued 2022. Photo matches. However, passport number format inconsistent with Slavic Union 2022 issuance standards (should be SU-XX-XXXXXX, reads SU-XX-XXXXX — one digit short)."
      },
      visa: {
        status: "VALID",
        details: "H-2B Work visa. Employer confirmed: Meridian Construction LLC."
      },
      auxiliary: {
        type: "Welding Certification",
        status: "SUSPECT",
        details: "International Welding Engineer certificate. Issuing body listed as 'Global Cert Institute, Novigrad.' No such institute appears in international certification databases. Font and layout differ from authentic IWE certificates."
      }
    },
    forgeryIndicators: ["Passport number format invalid (missing digit)", "Fake welding certification", "Tattoos consistent with Slavic Union prison gang affiliation"],
    redFlags: ["Prison tattoos suggest criminal background", "Passport likely tampered with"],
    emotionalWeight: "He stands with his arms crossed, a man accustomed to occupying space. His eyes flick to the secondary screening door and back to you. \"Is problem?\"",
    notes: "The passport number format is objectively wrong for the alleged issuance year. The certification is from a nonexistent institute. Clear forgery."
  },
  {
    id: 11,
    name: "Fatima Al-Rashid",
    sex: "F",
    age: 38,
    nationality: "Oasis Republic",
    purpose: "FAMILY — Visiting sister",
    duration: "2 weeks",
    photoDesc: "An elegant woman in modest but expensive clothing. Fine jewelry. Carries herself with quiet confidence. She is not accustomed to being questioned.",
    story: "\"My sister lives here with her husband. She is pregnant with her first child and she needs me. I will help her.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Oasis Republic passport. Issued 2019. Multiple previous entries. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "Family visit visa. Sister's residence permit and marriage certificate attached as proof of relationship."
      },
      auxiliary: {
        type: "Baggage Declaration",
        status: "FLAGGED",
        details: "Customs X-ray reveals $47,000 in undeclared cash in checked luggage. Legal declaration limit: $10,000. Passenger did not declare."
      }
    },
    forgeryIndicators: [],
    redFlags: ["$47,000 undeclared cash significantly exceeds legal limit", "Could be innocent (cultural practice, gift for sister) or money laundering"],
    emotionalWeight: "When asked about the cash, she stiffens. \"It is for my sister's baby. A gift. In our culture, we give gold and money. It is normal.\" Her voice carries both shame and defiance.",
    notes: "Entry documents are perfectly valid. The cash is a customs issue, not an immigration issue."
  },
  {
    id: 12,
    name: "Marcus Cole",
    sex: "M",
    age: 24,
    nationality: "Bellean Union",
    purpose: "TOURISM",
    duration: "10 days",
    photoDesc: "Athletic young man with a backpack and a guidebook sticking out of his pocket. An easy smile that doesn't quite reach his eyes.",
    story: "\"Just traveling, man. Seeing the world before I settle down. You know how it is.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Bellean Union passport. Issued 2021. Several recent entry stamps from countries with known drug trafficking routes. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "Tourist visa waiver. Return flight confirmed."
      },
      auxiliary: {
        type: "Intelligence Note",
        status: "NOTE",
        details: "Travel pattern analysis: Mr. Cole has visited 7 countries in 4 months, including three with elevated drug trafficking indices. No criminal record. No alerts. Pattern is consistent with either backpacker tourism or smuggling reconnaissance. Inconclusive."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Travel pattern flagged but inconclusive", "No actual evidence of wrongdoing"],
    emotionalWeight: "He seems genuinely relaxed — or very well rehearsed. He whistles tunelessly while you review his papers. \"Nice place,\" he says, looking around the sterile room with a grin.",
    notes: "The travel pattern is suspicious but not disqualifying. Many young backpackers visit these countries. No concrete evidence."
  },
  {
    id: 13,
    name: "Zara Ibrahim",
    sex: "F",
    age: 22,
    nationality: "Coastal Republic",
    purpose: "EDUCATION — University exchange",
    duration: "6 months",
    photoDesc: "A young woman with bright, intelligent eyes and secondhand clothes that don't quite fit. She clutches her documents like treasure — like something that might be taken away.",
    story: "\"I received a scholarship. The Girls' Education Initiative — they chose me. I will study engineering. I am the first woman in my village to attend university abroad.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Coastal Republic passport. Issued 2023. First passport. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "F-1 Student visa. University acceptance letter attached. I-20 form confirmed."
      },
      auxiliary: {
        type: "Scholarship Documentation",
        status: "VALID",
        details: "Girls' Education Initiative scholarship award letter. Full tuition and stipend. Contact information verified. Organization registered with UN Women's Education Fund."
      }
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "She holds the scholarship letter with trembling hands. \"My mother cannot read. But she cried when she learned I was going to study. She said —\" She stops. Breathes. \"She said I was carrying all of them with me.\"",
    notes: "All documentation verified. A genuine success story. Unambiguous approval."
  },
  {
    id: 14,
    name: "Ivan Kravchenko",
    sex: "M",
    age: 48,
    nationality: "Krasnov Federation",
    purpose: "DIPLOMATIC — Embassy business",
    duration: "3 years (diplomatic posting)",
    photoDesc: "A middle-aged man in an immaculate suit. Gold tiepin with a small crest. Perfect posture. Nothing about him is accidental.",
    story: "\"I am the new cultural attaché at the Krasnov Embassy. My credentials are in order.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Krasnov Federation diplomatic passport (red cover). Issued 2023. Diplomatic stamp and seal. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "A-1 Diplomatic visa. Letter of credence from Krasnov Ministry of Foreign Affairs. Received and acknowledged by host Ministry of Foreign Affairs."
      },
      auxiliary: {
        type: "Intelligence Briefing",
        status: "CLASSIFIED — YOUR EYES ONLY",
        details: "Ivan Kravchenko is believed to be an officer of the Krasnov Foreign Intelligence Service (KRIS), operating under diplomatic cover. Previous postings: Novigrad, Port Meridian, San Dorado City. Suspected of running human intelligence networks. NOTE: Diplomatic immunity applies. Denial would cause major diplomatic incident. This is for your awareness only."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Known intelligence officer under diplomatic cover", "Cannot be denied without causing diplomatic crisis"],
    emotionalWeight: "He smiles — a diplomat's smile, warm and completely empty. \"I understand you have a job to do. Please, take your time.\" He is utterly at ease. He knows you cannot touch him.",
    notes: "Diplomatic visas cannot be denied without cause. His credentials are in order and have been accepted by the host government."
  },
  {
    id: 15,
    name: "Maria Santos",
    sex: "F",
    age: 57,
    nationality: "San Dorado",
    purpose: "FAMILY — Attending son's wedding",
    duration: "5 days",
    photoDesc: "A middle-aged woman who has clearly been crying recently. Dressed in her best clothes — a black dress that might be mourning attire or formal wear. Possibly both.",
    story: "\"My son is getting married. I almost didn't make it. My husband — his father — passed away last month. He would have been so proud.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "San Dorado passport. Issued 2018. Photo matches. Exit stamp from San Dorado dated yesterday."
      },
      visa: {
        status: "VALID",
        details: "Tourist visa waiver. Return flight confirmed for 5 days."
      },
      auxiliary: {
        type: "Death Certificate",
        status: "NOTE",
        details: "Mrs. Santos presented her husband's death certificate when asked why she seemed distressed. Jose Ramon Santos, deceased 18 days ago. Cause: cardiac arrest. She carries it with her passport, as if she's still learning how to exist without him."
      }
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "She clutches the death certificate and the wedding invitation in the same hand — two pieces of paper marking the end and the beginning. \"He would have walked our son down the aisle,\" she says, as if to herself.",
    notes: "Perfectly valid documentation. A widow traveling to her son's wedding."
  },
  {
    id: 16,
    name: "Kofi Mensah",
    sex: "M",
    age: 31,
    nationality: "Coastal Republic",
    purpose: "WORK — IT consultant",
    duration: "3 months",
    photoDesc: "A sharp-dressed man in a well-fitted suit. Expensive watch. Perfectly knotted tie. He radiates competence and the quiet confidence of someone who knows his worth.",
    story: "\"I've been contracted by Meridian Telecom for a network infrastructure upgrade. Three-month project. Very standard.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Coastal Republic passport. Issued 2019. Multiple business travel stamps. Frequent traveler. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "B-1 Business visa. Contract letter from Meridian Telecom on company letterhead. Project details and duration confirmed."
      },
      auxiliary: {
        type: "Employment Verification",
        status: "VERIFIED",
        details: "Meridian Telecom HR confirms Mr. Mensah's contract. Project: Network modernization Phase 3. Contract value: $45,000. All checks out."
      }
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "He checks his phone while waiting. \"Sorry — the project manager is asking about the timeline. Can I get through? I have a kickoff meeting at three.\"",
    notes: "Everything checks out. Contracted professional. Verified employer."
  },
  {
    id: 17,
    name: "Liu Wei",
    sex: "M",
    age: 36,
    nationality: "Island Federation",
    purpose: "IMMIGRATION — Family reunification",
    duration: "Permanent",
    photoDesc: "A man who looks older than his years. One suitcase — sparse luggage for a permanent move. He holds a creased photograph the way you hold a holy object.",
    story: "\"My wife and daughter are here already. They came two years ago. I have been approved. Please — I have missed them.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Island Federation passport. Issued 2020. Exit stamp from home country. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "IR-1 Spousal immigration visa. Approved 4 months ago. Wife's petition and financial sponsorship documents attached."
      },
      auxiliary: {
        type: "Family Verification",
        status: "VERIFIED",
        details: "Wife: Chen Mei, age 34. Legal resident since 2021. Daughter: Liu Mei-Mei, age 6. Both confirmed at registered address. Marriage certificate authenticated."
      }
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "He shows you the photograph — his wife holding a baby girl. The baby in the photo is now seven. \"She does not remember my face,\" he says. \"Only my voice on the phone. I want to be her father again.\"",
    notes: "All documents verified. Family reunification visa properly processed."
  },
  {
    id: 18,
    name: "Rebecca Thornton",
    sex: "F",
    age: 42,
    nationality: "Bellean Union",
    purpose: "ADOPTION — Finalizing adoption",
    duration: "2 weeks",
    photoDesc: "A nervous woman with a folder of documents she's clearly organized and reorganized dozens of times. Kind face, worried eyes. She is trying very hard to believe this will work.",
    story: "\"We've been matched with a child at the Bright Horizons Orphanage. The adoption is nearly complete — I just need to be here for the final proceedings. Her name is — her name will be Rose. She's three.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Bellean Union passport. Issued 2019. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "Adoption processing visa. Letter from Bright Horizons Orphanage confirming appointment. Court date confirmed for next week."
      },
      auxiliary: {
        type: "Adoption Documentation",
        status: "VERIFIED",
        details: "Home study approved. Background check clear. Child matching referral from licensed agency. All documents authenticated through proper channels."
      }
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "She touches a small stuffed bunny clipped to her bag — a gift for a child she's never met. \"They sent me a photo. She has my mother's eyes,\" she laughs, then apologizes for being silly.",
    notes: "Comprehensive adoption documentation, all verified."
  },
  {
    id: 19,
    name: "Katerina Volkov",
    sex: "F",
    age: 68,
    nationality: "Slavic Union",
    purpose: "TOURISM — Visiting granddaughter",
    duration: "1 month",
    photoDesc: "A small, elderly woman wrapped in a hand-knitted shawl. Eyes like a sparrow's — quick and watchful. She smiles easily, the way people smile when they have survived enough to find most things funny.",
    story: "\"My granddaughter married a man from here. She is going to have a baby — my first great-grandchild! I bring gifts.\" She gestures to a heavy suitcase.",
    documents: {
      passport: {
        status: "VALID",
        details: "Slavic Union passport. Issued 2019. Photo matches (older photo — applicant has aged visibly). First international travel."
      },
      visa: {
        status: "FLAGGED",
        details: "Tourist visa application lists 'family visit' but visa issued as 'general tourism.' Granddaughter's name provided: Anna Volkov-Becker, but no relationship documentation attached."
      },
      auxiliary: {
        type: "Granddaughter's Letter",
        status: "INFORMAL",
        details: "A handwritten letter from 'Anna' inviting her grandmother to visit. Return address matches a real street in the capital. Warm, personal tone. But no official documentation of the family relationship."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Wrong visa category", "No formal proof of family relationship"],
    emotionalWeight: "She pulls out a tiny knitted baby bootie. \"I made this. I started the day Anna told me. I have been knitting for months. Pink or blue — I made both.\" Her eyes shine.",
    notes: "The visa is technically the wrong category. The relationship is undocumented but likely genuine. Bureaucratic error, not fraud."
  },
  {
    id: 20,
    name: "Thomas Mercer",
    sex: "M",
    age: 51,
    nationality: "Domestic",
    purpose: "RETURNING CITIZEN",
    duration: "Permanent (returning)",
    photoDesc: "A haggard man in clothes that don't fit right — borrowed or hastily purchased. He hasn't slept recently. Or maybe sleeping is what he's been doing too much of.",
    story: "\"I live here. I've always lived here. My passport is right here.\"",
    documents: {
      passport: {
        status: "FLAGGED",
        details: "Domestic passport. Valid. But facial recognition shows only 71% match to photo — below the 80% threshold. The man in front of you could be the man in the photo, aged and weathered. Or he could be his brother."
      },
      visa: {
        status: "NOT REQUIRED",
        details: "Returning citizen."
      },
      auxiliary: {
        type: "Background Check",
        status: "NOTE",
        details: "Thomas Robert Mercer, DOB 03/15/1972. Has a twin brother, Gregory Mercer, who has a criminal record (convicted 2019, fraud, served 3 years). Gregory Mercer's current status: PAROLE VIOLATION — WARRANT ACTIVE."
      }
    },
    forgeryIndicators: ["Facial recognition below threshold (71%)"],
    redFlags: ["Has a wanted identical twin", "If this is Gregory, he's using his brother's passport"],
    emotionalWeight: "\"Tom\" sweats and avoids eye contact. His story is consistent — he knows details about the hometown, the schools, the streets. But his brother would know all that too.",
    notes: "The 71% match is suspicious but not conclusive. His local knowledge is convincing, but his twin would have the same knowledge."
  },
  {
    id: 21,
    name: "Ahmad Khalil",
    sex: "M",
    age: 44,
    nationality: "Oasis Republic",
    purpose: "WORK — Petroleum engineering",
    duration: "1 year",
    photoDesc: "A barrel-chested man with a neat beard and calloused hands. Blue collar engineer, not office. Steel-toed boots that have seen real work, real refineries, real danger.",
    story: "\"The refinery needs experienced petroleum engineers. Fifteen years at the Oasis National Refinery. I have my certifications.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Oasis Republic passport. Issued 2020. Valid. Photo matches. Previous work visas for Argentinia and San Dorado."
      },
      visa: {
        status: "VALID",
        details: "H-1B Specialty occupation visa. Petroleum engineer. Employer: National Energy Consortium."
      },
      auxiliary: {
        type: "Engineering Certificates",
        status: "FLAGGED",
        details: "Oasis Republic Petroleum Engineering certification: VALID. International Engineering Alliance registration: NOT FOUND. His credentials are legitimate in the Oasis Republic but have not been verified by the international standards body required for H-1B visa holders."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Missing required international certification verification"],
    emotionalWeight: "\"I have fifteen years of experience. I have worked on refineries ten times the size of yours. But a piece of paper from an office in another country says I am not qualified?\" He shakes his head slowly.",
    notes: "His skills are clearly genuine — 15 years of verified experience. The missing international certification is a bureaucratic requirement, not a reflection of competence."
  },
  {
    id: 22,
    name: "Jennifer Park",
    sex: "F",
    age: 29,
    nationality: "Island Federation",
    purpose: "TOURISM",
    duration: "2 weeks",
    photoDesc: "A cheerful woman with a camera around her neck and a guidebook in hand. Everything about her says 'tourist' with unsettling, photographic perfection.",
    story: "\"Photography trip! I want to capture your old quarter. The architecture is supposed to be incredible.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Island Federation passport. Issued 2021. Several tourist visas. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "Tourist visa waiver. Return flight confirmed. Hotel reservation confirmed."
      },
      auxiliary: {
        type: "Intelligence Note — EYES ONLY",
        status: "CLASSIFIED",
        details: "Jennifer Park is a known operative of the Island Federation's External Intelligence Bureau, specializing in industrial espionage. Previous aliases used in Meridian City and Port Royale. WARNING: She has never been caught committing a crime. Any denial will be contested by the Island Federation embassy."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Known intelligence operative", "Previous suspicious activity patterns", "No actual evidence of crime"],
    emotionalWeight: "She smiles at you — a photographer's smile, open and curious. \"Do you know a good spot for sunset photos? I've heard the harbor is beautiful.\" The harbor. Where the naval base is.",
    notes: "Her documents are perfect. She has committed no provable crime. But intelligence agencies know her."
  },
  {
    id: 23,
    name: "Omar Hassan",
    sex: "M",
    age: 15,
    nationality: "Coastal Republic",
    purpose: "UNACCOMPANIED MINOR — Asylum claim",
    duration: "Indefinite",
    photoDesc: "A boy in a man's body — tall for his age, but his face is a child's. Thin. One shoe has a hole in it. He holds no luggage. He holds nothing at all.",
    story: "\"They killed my father. My mother said run. She said go north, go anywhere, just run. So I ran.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Coastal Republic emergency passport. Issued 5 days ago at border crossing. Photo matches. Document is authentic but issued under emergency procedures with reduced verification."
      },
      visa: {
        status: "NOT APPLICABLE",
        details: "Asylum claim filed at border. Under international law, asylum seekers cannot be turned away without hearing."
      },
      auxiliary: {
        type: "UNHCR Registration",
        status: "PENDING",
        details: "Omar Hassan registered with UNHCR at border crossing 5 days ago. Initial screening suggests credible fear of persecution. Full asylum hearing scheduled in 30 days. UNHCR recommends admission for processing."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Emergency passport with reduced verification", "No parent or guardian present"],
    emotionalWeight: "He doesn't beg. He doesn't cry. He just looks at you with the hollow eyes of someone who has already seen the worst thing he will ever see. \"I can work,\" he says, as if that's what you're wondering about.",
    notes: "Under international law, asylum seekers with credible claims must be admitted for processing. He's a child, alone, running from violence."
  },
  {
    id: 24,
    name: "Diana Chen",
    sex: "F",
    age: 52,
    nationality: "Island Federation",
    purpose: "MEDICAL — Experimental treatment",
    duration: "6 months",
    photoDesc: "A thin woman who was once robust. Her clothes hang on her. She moves carefully, as if her bones might shatter — or as if she's learned that hope is fragile too.",
    story: "\"I have Stage 4 pancreatic cancer. The treatment here — Dr. Yamamoto at Meridian Central — it's experimental, but it's my only chance. There is nothing left in the Island Federation.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Island Federation passport. Issued 2018. Photo matches (though she looks significantly more ill than her photo)."
      },
      visa: {
        status: "VALID",
        details: "Medical treatment visa (M-1). Extended stay authorization. 180 days."
      },
      auxiliary: {
        type: "Medical Documentation",
        status: "VERIFIED",
        details: "Letter from Dr. Kenji Yamamoto, Meridian Central Hospital Oncology Department. Confirmation of enrollment in experimental immunotherapy trial. Insurance pre-authorization for $380,000 in treatment costs."
      }
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "Her hands shake as she passes you the documents — from the disease or from fear, you can't tell. \"I know I might die anyway,\" she says. \"But I have to try. My daughter is twelve. I need more time.\"",
    notes: "All documentation verified and in order. Terminal patient seeking experimental treatment."
  },
  {
    id: 25,
    name: "Victor Morozov",
    sex: "M",
    age: 29,
    nationality: "Krasnov Federation",
    purpose: "TOURISM",
    duration: "2 weeks",
    photoDesc: "A young man with the hollow look of recent trauma. He holds his passport with both hands. Faint bruises on his knuckles, healing. He is trying very hard to look calm.",
    story: "\"Vacation. I want to see the mountains.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Krasnov Federation passport. Issued 2022. Photo matches. Passport was issued only 3 months ago in a replacement ceremony, suggesting the previous passport was lost, stolen, or confiscated."
      },
      visa: {
        status: "VALID",
        details: "Tourist visa. Issued without incident. Return flight confirmed."
      },
      auxiliary: {
        type: "Intelligence Note — RESTRICTED",
        status: "CLASSIFIED",
        details: "Victor Morozov is assessed as a potential defector. Former mid-level technician at a Krasnov military research facility. His facility was shut down 4 months ago following an 'incident.' Krasnov Federation has issued a confidential request to flag Mr. Morozov and notify their embassy. They describe him as 'a person of interest in a criminal investigation.' NOTE: The 'criminal investigation' is believed to be politically motivated."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Recent replacement passport", "Krasnov has flagged him", "Possible defector"],
    emotionalWeight: "He meets your eyes for the first time. Something in his gaze — a plea, maybe. Or a door left slightly open. \"I am a tourist,\" he repeats. But his hands are shaking.",
    notes: "His documents are valid. The Krasnov request is not a formal extradition order — it's a political flag. If you approve, he disappears into the country. If you deny, he goes back."
  },
  {
    id: 26,
    name: "Nadia Popov",
    sex: "F",
    age: 33,
    nationality: "Slavic Union",
    purpose: "WORK — Hospitality",
    duration: "1 year",
    photoDesc: "A conventionally attractive woman in modest but fashionable clothing. Professional makeup. A practiced, pleasant expression that never quite reaches her eyes.",
    story: "\"I have a job offer from the Grand Meridian Hotel. Reception supervisor. I have experience — I worked at the Continental in Novigrad for six years.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Slavic Union passport. Issued 2020. Photo matches. Previous work visas for Novigrad and Argentinia."
      },
      visa: {
        status: "VALID",
        details: "H-2B Work visa. Employer: Grand Meridian Hotel. Job offer letter attached."
      },
      auxiliary: {
        type: "Background Investigation",
        status: "FLAGGED",
        details: "Slavic Union police record: 2 arrests for solicitation (2018, 2020), both charges dropped. NOTE: In the Slavic Union, such arrests are sometimes used to control or pressure individuals. Additionally, NGOs have flagged patterns of labor trafficking in the hospitality visa route from the Slavic Union."
      }
    },
    forgeryIndicators: ["Arrest record suggests possible coercion", "Hospitality visa route flagged for trafficking"],
    redFlags: ["The job may be legitimate, or it may be a front for sex trafficking", "Her demeanor — practiced pleasantness — could be professionalism or compliance"],
    emotionalWeight: "She smiles. The smile doesn't waver. It doesn't reach her eyes. \"I am very grateful for this opportunity,\" she says. The words are perfectly composed, as if rehearsed.",
    notes: "Her documents are technically valid. But the arrest pattern and trafficking flags are significant. She may be a trafficking victim who has been coached."
  },
  {
    id: 27,
    name: "Robert Fischer",
    sex: "M",
    age: 71,
    nationality: "Bellean Union",
    purpose: "FAMILY — Grandchild's graduation",
    duration: "1 week",
    photoDesc: "An elderly man with a walker and a cardigan. A proud, iron handshake despite his frailty. University colors on his lapel pin. He crossed an ocean for this moment.",
    story: "\"My granddaughter is graduating from your university. Biomedical engineering. She's the first Fischer to get a degree. I wouldn't miss it.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Bellean Union passport. Issued 2018. Photo matches. Aged considerably since photo was taken."
      },
      visa: {
        status: "VALID",
        details: "Tourist visa waiver. Return flight confirmed. Graduation ceremony ticket attached."
      },
      auxiliary: null
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "He shows you the graduation ticket like it's made of gold. \"She called me crying when she got the letter. Her father — my son — he's not well enough to travel. So I'm going for both of us.\"",
    notes: "All documentation in order. Elderly tourist with a clear, verified purpose."
  },
  {
    id: 28,
    name: "Lena Richter",
    sex: "F",
    age: 40,
    nationality: "Bellean Union",
    purpose: "WORK — Journalism",
    duration: "3 months",
    photoDesc: "A woman with short hair and a press badge already visible around her neck. Scars on her left hand — shrapnel, maybe, or glass. She carries herself like someone who has been shot at and decided to keep going.",
    story: "\"I'm here on assignment for the Belle Globe. Covering the elections. My credentials are all there.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Bellean Union passport. Issued 2019. War zone entry/exit stamps (San Dorado conflict zone, Coastal Republic civil unrest). Photo matches."
      },
      visa: {
        status: "VALID",
        details: "I-1 Journalist visa. Press credentials from Belle Globe verified. Assignment letter from foreign editor confirmed."
      },
      auxiliary: {
        type: "Security Note",
        status: "FLAGGED",
        details: "Lena Richter's previous reporting has been critical of this government's immigration policies and border control practices. Ministry of Information has informally suggested that foreign journalists covering the elections be subjected to 'additional scrutiny.' No formal directive issued."
      }
    },
    forgeryIndicators: [],
    redFlags: ["Her reporting is critical of your government", "Informal pressure to deny"],
    emotionalWeight: "She watches you read the security note. She's read it too — she knows it's there. \"I've been detained in four countries,\" she says mildly. \"I always write about that too.\"",
    notes: "Her documentation is impeccable. Denying a journalist with valid credentials because you don't like her reporting is exactly the kind of authoritarian behavior she writes about."
  },
  {
    id: 29,
    name: "Sergei Volkov",
    sex: "M",
    age: 47,
    nationality: "Krasnov Federation",
    purpose: "IMMIGRATION — Investor visa",
    duration: "Permanent (conditional)",
    photoDesc: "A heavyset man in expensive but tasteless clothing. Multiple rings. A man who wants you to know he has money. Cold eyes that assess you like property — like something he might acquire.",
    story: "\"I am investing in this country. Three million in commercial real estate. I have the proof. I am creating jobs. You should welcome me.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Krasnov Federation passport. Issued 2021. Frequent travel to financial centers. Photo matches."
      },
      visa: {
        status: "VALID",
        details: "EB-5 Investor visa. Investment documentation: $3M in Meridian Commercial Holdings LLC. Bank transfers confirmed."
      },
      auxiliary: {
        type: "Financial Intelligence Note",
        status: "CLASSIFIED",
        details: "Sergei Volkov is believed to be a close associate of the Krasnov Federation's Deputy Minister of Energy. Source of investment funds is unclear — shell company chain through three jurisdictions. The investment appears legal, but the money trail suggests possible proceeds from embezzlement of Krasnov state energy funds. Investigation ongoing."
      }
    },
    forgeryIndicators: ["Shell company structure obscures fund origins"],
    redFlags: ["Possible proceeds of corruption", "Denial might compromise investigation"],
    emotionalWeight: "He leans forward slightly. \"I have powerful friends. In many countries. I am the kind of immigrant you want.\" He says it as a statement of fact, not a threat. But you hear the threat.",
    notes: "His documents are technically valid. The investment is real and verified. The money is questionable, but the investigation is ongoing."
  },
  {
    id: 30,
    name: "Asha Mohamed",
    sex: "F",
    age: 25,
    nationality: "Oasis Republic",
    purpose: "EDUCATION — Medical residency",
    duration: "3 years",
    photoDesc: "A composed woman in modest dress with a stethoscope still around her neck — she came directly from the hospital. Alert, dark eyes. She has the stillness of someone who makes life-or-death decisions.",
    story: "\"I've been accepted into the surgical residency at Meridian Central. I graduated top of my class at Oasis Medical University. I want to specialize in pediatric surgery.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "Oasis Republic passport. Issued 2019. Photo matches. Academic travel stamps."
      },
      visa: {
        status: "VALID",
        details: "J-1 Exchange visitor visa (medical). Residency appointment letter from Meridian Central Hospital. ECFMG certification confirmed."
      },
      auxiliary: {
        type: "Academic Records",
        status: "VERIFIED",
        details: "Oasis Medical University degree: Doctor of Medicine, graduated first in class. USMLE Step 1 and Step 2 scores: 265 and 270 respectively (exceptional)."
      }
    },
    forgeryIndicators: [],
    redFlags: [],
    emotionalWeight: "\"In my village, there is one doctor for 40,000 people. When I finish my training, I want to go back. I want to build a children's hospital.\" She pauses. \"But first, I have to learn.\"",
    notes: "Exceptional credentials, fully verified. A future pediatric surgeon who wants to serve an underserved community."
  },
  {
    id: 31,
    name: "James Chen",
    sex: "M",
    age: 38,
    nationality: "Island Federation",
    purpose: "BUSINESS — Technology sales",
    duration: "1 week",
    photoDesc: "A polished man in a fitted suit. Calm, professional demeanor. Carries a high-end laptop case. Nothing out of place. That's what's wrong.",
    story: "\"I'm meeting with clients — Meridian Telecom is considering our network solutions. Standard sales trip.\"",
    documents: {
      passport: {
        status: "FLAGGED",
        details: "Island Federation passport. Issued 2019. Photo does not match. James Chen, DOB 1986: photo shows a man approximately 38 years old. The man in front of you appears closer to 34. Subtle differences in facial structure. PASSPORT NUMBER MATCHES a passport reported stolen 6 weeks ago."
      },
      visa: {
        status: "VALID",
        details: "B-1 Business visa. However, visa was issued to the real James Chen. The man in front of you is not James Chen."
      },
      auxiliary: {
        type: "Stolen Passport Alert",
        status: "CRITICAL",
        details: "INTERPOL Stolen Travel Documents database: This passport number was reported stolen 6 weeks ago by the Island Federation. The actual James Chen reported the theft after a burglary. The passport you are holding is a stolen document being used by an impostor."
      }
    },
    forgeryIndicators: ["Stolen passport from INTERPOL database", "Photo doesn't match (subtle but detectable)", "Age discrepancy"],
    redFlags: ["Whoever this is, he is not James Chen"],
    emotionalWeight: "He maintains perfect composure. \"Is there a problem? I have a meeting in two hours.\" He doesn't sweat, doesn't fidget. A professional. But he's holding someone else's life in his hands.",
    notes: "Clear-cut case of identity theft using a stolen passport. The INTERPOL database confirms the passport was reported stolen."
  },
  {
    id: 32,
    name: "Isabella Reyes",
    sex: "F",
    age: 9,
    nationality: "San Dorado",
    purpose: "UNACCOMPANIED MINOR — Parent visitation",
    duration: "1 week",
    photoDesc: "A small girl with careful braids and a backpack covered in cartoon characters. She holds a signed note in her hand like a talisman, like a shield.",
    story: "\"My daddy lives here now. My mom said I can visit for summer. She signed the paper and everything.\"",
    documents: {
      passport: {
        status: "VALID",
        details: "San Dorado child passport. Issued 2022. Photo matches. Parental consent form attached — signed by mother, Maria Reyes."
      },
      visa: {
        status: "VALID",
        details: "Tourist visa waiver. Return flight confirmed. Father's address and contact information provided."
      },
      auxiliary: {
        type: "Custody Documentation",
        status: "NOTE",
        details: "The parental consent form appears to be signed by the mother. However, the parents' divorce decree grants full custody to Maria Reyes with supervised visitation only for the father. The consent form should include the family court's stamp approving this specific trip. It does not."
      }
    },
    forgeryIndicators: ["Missing family court approval stamp"],
    redFlags: ["Father has only supervised visitation rights", "Missing court approval for international travel"],
    emotionalWeight: "\"Daddy said we're going to the beach,\" she says, rocking on her heels. \"He said I can stay longer if I want. Can I stay longer?\" She doesn't know what she's asking.",
    notes: "The consent form is incomplete — it's missing the family court's approval. The father's supervised-only visitation status is concerning for international travel."
  }
];

// ═══════════════════════════════════════════════════════════
// MESSAGE ENCODING
// ═══════════════════════════════════════════════════════════
//
// The "correct" decisions encode: "WE DID AS WE WERE TOLD."
// approve = 1, deny = 0. Every 8 decisions form one byte (ASCII).
// Bit positions: MSB first (bit 7, bit 6, ... bit 0).
//
// There are 32 travelers × 1 decision = 32 bits = 4 bytes of
// message, plus null termination. The travelers beyond byte 24
// are padding — their decisions don't encode message characters,
// but the player doesn't know which travelers are signal and
// which are noise.
// ═══════════════════════════════════════════════════════════

const MESSAGE_ENCODING = {
  // Byte 1: W (87 = 01010111)
  1: [0, 1, 0, 1, 0, 1, 1, 1],
  // Byte 2: E (69 = 01000101)
  2: [0, 1, 0, 0, 0, 1, 0, 1],
  // Byte 3: space (32 = 00100000)
  3: [0, 0, 1, 0, 0, 0, 0, 0],
  // Byte 4: D (68 = 01000100)
  4: [0, 1, 0, 0, 0, 1, 0, 0],
  // Byte 5: I (73 = 01001001)
  5: [0, 1, 0, 0, 1, 0, 0, 1],
  // Byte 6: D (68 = 01000100)
  6: [0, 1, 0, 0, 0, 1, 0, 0],
  // Byte 7: space (32 = 00100000)
  7: [0, 0, 1, 0, 0, 0, 0, 0],
  // Byte 8: A (65 = 01000001)
  8: [0, 1, 0, 0, 0, 0, 0, 1],
  // Byte 9: S (83 = 01010011)
  9: [0, 1, 0, 1, 0, 0, 1, 1],
  // Byte 10: space (32 = 00100000)
  10: [0, 0, 1, 0, 0, 0, 0, 0],
  // Byte 11: W (87 = 01010111)
  11: [0, 1, 0, 1, 0, 1, 1, 1],
  // Byte 12: E (69 = 01000101)
  12: [0, 1, 0, 0, 0, 1, 0, 1],
  // Byte 13: space (32 = 00100000)
  13: [0, 0, 1, 0, 0, 0, 0, 0],
  // Byte 14: W (87 = 01010111)
  14: [0, 1, 0, 1, 0, 1, 1, 1],
  // Byte 15: E (69 = 01000101)
  15: [0, 1, 0, 0, 0, 1, 0, 1],
  // Byte 16: R (82 = 01010010)
  16: [0, 1, 0, 1, 0, 0, 1, 0],
  // Byte 17: E (69 = 01000101)
  17: [0, 1, 0, 0, 0, 1, 0, 1],
  // Byte 18: space (32 = 00100000)
  18: [0, 0, 1, 0, 0, 0, 0, 0],
  // Byte 19: T (84 = 01010100)
  19: [0, 1, 0, 1, 0, 1, 0, 0],
  // Byte 20: O (79 = 01001111)
  20: [0, 1, 0, 0, 1, 1, 1, 1],
  // Byte 21: L (76 = 01001100)
  21: [0, 1, 0, 0, 1, 1, 0, 0],
  // Byte 22: D (68 = 01000100)
  22: [0, 1, 0, 0, 0, 1, 0, 0],
  // Byte 23: space (32 = 00100000)
  23: [0, 0, 1, 0, 0, 0, 0, 0],
  // Byte 24: . (46 = 00101110)
  24: [0, 0, 1, 0, 1, 1, 1, 0],
};

const HIDDEN_MESSAGE = "WE DID AS WE WERE TOLD.";

/**
 * Decode an array of bits into a string.
 * @param {number[]} decisions - Array of 1s and 0s.
 * @returns {string} Decoded ASCII text.
 */
function decodeDecisions(decisions) {
  let message = '';
  for (let i = 0; i < decisions.length; i += 8) {
    const byte = decisions.slice(i, i + 8);
    if (byte.length === 8) {
      const charCode = parseInt(byte.join(''), 2);
      message += String.fromCharCode(charCode);
    }
  }
  return message;
}

/**
 * Get the "correct" (intended) decision for a 1-based traveler index.
 * Used only for accuracy comparison during the reveal.
 * @param {number} index - 1-based traveler index.
 * @returns {number} 1 for approve, 0 for deny.
 */
function getCorrectDecision(index) {
  const group = Math.ceil(index / 8);
  const pos = ((index - 1) % 8);
  if (MESSAGE_ENCODING[group]) {
    return MESSAGE_ENCODING[group][pos];
  }
  // Travelers beyond byte 24 are padding — default to approve.
  return 1;
}

/** Get the intended hidden message string. */
function getIntendedMessage() {
  return HIDDEN_MESSAGE;
}

/** Get the total number of travelers. */
function getTravelerCount() {
  return TRAVELERS.length;
}

/** Get a traveler object by 0-based index. */
function getTraveler(index) {
  return TRAVELERS[index];
}

/**
 * Build the full "correct" bit sequence (for verification).
 * @returns {number[]} Array of 32 bits.
 */
function buildCorrectSequence() {
  const seq = [];
  for (let i = 1; i <= 32; i++) {
    seq.push(getCorrectDecision(i));
  }
  return seq;
}
