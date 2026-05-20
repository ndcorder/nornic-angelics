/**
 * Patient Model — Elena Voss, 34
 *
 * All dialogue fragments organized by theme. Tracks heard fragments,
 * locked content, and contradictions. Manages a memory/priority system
 * shaped by the player's pursuit patterns across sessions.
 *
 * Fragment fields:
 *   id                 – unique identifier
 *   theme              – thematic category
 *   text               – what the patient says
 *   distressCost       – distress delta when this fragment is reached
 *   distressThreshold  – minimum distress to unlock (0 = always available)
 *   maxDistress        – ceiling; fragment becomes unavailable above this
 *   contradictionId    – id of a fragment this contradicts (cross-run)
 *   unlocks            – fragment ids this makes available in future sessions
 *   triggers           – fragment ids this makes immediately available
 *   metadata           – freeform tags for filtering / UI hints
 *   heard              – whether the player has ever encountered this
 *   firstHeardSession  – session number when first heard (null = never)
 */

const Patient = (function () {
  'use strict';

  // ==========================================================
  //  DIALOGUE FRAGMENTS
  // ==========================================================

  const fragments = [

    // ── MARRIAGE ──────────────────────────────────────────────

    {
      id: 'm1',
      theme: 'marriage',
      text: 'We met at a friend\'s birthday dinner. He sat across from me and I thought — I thought he was too handsome to be kind. But he was. For a while.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['m2', 'h1'],
      triggers: [],
      metadata: ['romantic-origin', 'good-memory'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm2',
      theme: 'marriage',
      text: 'He proposed on a Tuesday. No ring, no plan. We were making breakfast and he just said it. "Let\'s do this." I said yes before I finished chewing.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['m3'],
      triggers: [],
      metadata: ['proposal', 'good-memory'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm3',
      theme: 'marriage',
      text: 'The wedding was small. Twenty people. My mother cried and said I looked just like her mother. His father gave a toast about second chances. I didn\'t understand what he meant then.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['m6'],
      triggers: [],
      metadata: ['wedding', 'family'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm4',
      theme: 'marriage',
      text: 'He started coming home late. Not hours late — minutes. But I noticed. I always noticed when things shifted. He said I was hypervigilant. Maybe he was right.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['m5'],
      triggers: [],
      metadata: ['shift', 'suspicion'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm5',
      theme: 'marriage',
      text: 'I found the receipts. Restaurants I\'d never been to, on nights he said he worked late. When I asked, he said it was for client meetings. Two meals at the same restaurant. Same amount each time. Two people eating.',
      distressCost: 2,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: 'm10',
      unlocks: ['e4'],
      triggers: [],
      metadata: ['receipts', 'betrayal', 'evidence'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm6',
      theme: 'marriage',
      text: 'His daughter was nine when I met her. She didn\'t like me. She said I was the reason her parents couldn\'t get back together. She was wrong, but I understood why she needed to believe that.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['m7'],
      triggers: [],
      metadata: ['stepdaughter', 'family-conflict'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm7',
      theme: 'marriage',
      text: 'The adoption papers were on his desk for six months. I didn\'t sign them. I don\'t know why. I wanted to. I think I wanted to.',
      distressCost: 1,
      distressThreshold: 4,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['adoption', 'ambivalence', 'regret'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm8',
      theme: 'marriage',
      text: 'We didn\'t fight. That\'s what I always say. But we didn\'t talk either. He\'d be in his office and I\'d be in the living room and we\'d exist in the same house like two people reading different books in the same library. Quiet. Separate. Alone.',
      distressCost: 1,
      distressThreshold: 5,
      maxDistress: Infinity,
      contradictionId: 'm9',
      unlocks: ['e3'],
      triggers: [],
      metadata: ['distance', 'loneliness'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm9',
      theme: 'marriage',
      text: 'He raised his voice once. Just once. But his daughter was there, and she flinched, and something behind her eyes just — collapsed. Like she\'d been waiting for it. Like she\'d heard it before.',
      distressCost: 3,
      distressThreshold: 5,
      maxDistress: Infinity,
      contradictionId: 'm8',
      unlocks: ['c4', 'e5'],
      triggers: [],
      metadata: ['anger', 'witnessing'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm10',
      theme: 'marriage',
      text: 'I keep defending him. Even now. I want to tell you he was a good man — is a good man. I don\'t know which verb to use. I don\'t know if \'good\' applies. It\'s so much simpler to think someone is one thing.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: 'm5',
      unlocks: [],
      triggers: [],
      metadata: ['denial', 'loyalty'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'm11',
      theme: 'marriage',
      text: 'On good days, I think the love was real. That it was enough to start, just not enough to carry us through what came next.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['ambivalence', 'narrative'],
      heard: false,
      firstHeardSession: null
    },

    // ── CHILDHOOD ─────────────────────────────────────────────

    {
      id: 'c1',
      theme: 'childhood',
      text: 'I grew up in a house where my mother said everything was fine and the walls said something different. Doors slamming is just an emotion, Elena. It\'s not violence, it\'s not violence, it\'s not violence.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['c2'],
      triggers: [],
      metadata: ['denial-model', 'learned'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'c2',
      theme: 'childhood',
      text: 'My father\'s father was in the war. I never met him. My father never talked about him, except once, and said, "He did what he had to do, and he never recovered from being right." I didn\'t understand that until much later.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['generational', 'war'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'c3',
      theme: 'childhood',
      text: 'When I was fourteen, my mother found me crying in the bathroom. She said, "Don\'t let anyone see you like this. They\'ll think you\'re weak." It was the most intimate thing she ever said to me.',
      distressCost: 2,
      distressThreshold: 3,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['d1'],
      triggers: [],
      metadata: ['emotional-suppression', 'maternal'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'c4',
      theme: 'childhood',
      text: 'I was a careful child. I moved through the house like a guest. I held my breath when I walked past my father\'s study. I didn\'t know I was doing it until my brother asked why I was always sighing.',
      distressCost: 2,
      distressThreshold: 5,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['c5'],
      triggers: [],
      metadata: ['hypervigilance', 'trauma-pattern'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'c5',
      theme: 'childhood',
      text: 'My brother is three years older and doesn\'t remember any of it. Or says he doesn\'t. We don\'t talk about the house. We talk about sports, his kids, restaurants. Safe things. Surfaces.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['sibling-denial', 'family-mythology'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'c6',
      theme: 'childhood',
      text: 'I started going to the hospital because I wanted to help people. I told myself that. It took me years to realize I just wanted to be in a place where suffering was acknowledged instead of decorated over.',
      distressCost: 2,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['w3'],
      triggers: [],
      metadata: ['career-origin', 'insight'],
      heard: false,
      firstHeardSession: null
    },

    // ── WORK ──────────────────────────────────────────────────

    {
      id: 'w1',
      theme: 'work',
      text: 'I work in the oncology ward. You\'d think that would be the hardest part, but it isn\'t. Cancer is honest. It doesn\'t pretend to be anything else.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['w2', 'c6'],
      triggers: [],
      metadata: ['nursing', 'oncology'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'w2',
      theme: 'work',
      text: 'The night shifts were where I functioned best. Fewer administrators. Fewer questions. Just the work, and the quiet, and the monitors counting things you couldn\'t see but always heard.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['h3'],
      triggers: [],
      metadata: ['night-shift', 'avoidance'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'w3',
      theme: 'work',
      text: 'Afterwards, I couldn\'t go back. I\'d look at the beds and see — I couldn\'t go back. I\'m on indefinite leave. That\'s what HR calls it. Indefinite. It sounds like a threat.',
      distressCost: 1,
      distressThreshold: 3,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['leave', 'avoidance', 'post-event'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'w4',
      theme: 'work',
      text: 'He also worked nights. Security at the courthouse. We were on the same schedule, him guarding empty rooms, me guarding empty beds. Two people awake while the world slept. That felt like enough, for a while.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['m4'],
      triggers: [],
      metadata: ['schedule', 'connection'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'w5',
      theme: 'work',
      text: 'There was a patient, Mr. Alonso, who used to say, "Nurse Voss, you\'re too sad for this room." He was dying and he was worried about me. I think about him every day. I think about how he made me promise not to end up in a bed like his.',
      distressCost: 2,
      distressThreshold: 4,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['h4'],
      triggers: [],
      metadata: ['patient-relationship', 'promise'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'w6',
      theme: 'work',
      text: 'Dr. Pham pulled me aside once and said, "You care too precisely, Elena. You know exactly how much to care and that\'s what worries me." She was the first person who saw it. I didn\'t like being seen.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['a4'],
      triggers: [],
      metadata: ['supervisor', 'being-seen'],
      heard: false,
      firstHeardSession: null
    },

    // ── THE EVENT ─────────────────────────────────────────────

    {
      id: 'e1',
      theme: 'the_event',
      text: 'The night it happened, I was on shift. The phone rang at two in the morning. I thought it was the hospital calling me back in. But it wasn\'t. It was my neighbor.',
      distressCost: 3,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['e2'],
      triggers: [],
      metadata: ['recounting', 'the-call'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'e2',
      theme: 'the_event',
      text: 'He said, "There\'s smoke, Elena." And I said, "What?" And he said it again, slower, like I was a child — "Your house is on fire." And I just stood there in the break room with my scrubs on and thought: I forgot to turn off the bathroom light. That\'s what I thought.',
      distressCost: 4,
      distressThreshold: 2,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['h1'],
      triggers: [],
      metadata: ['recounting', 'shock', 'dissociation'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'e3',
      theme: 'the_event',
      text: 'The fire investigator said it started in the kitchen. Electrical. Faulty wiring in a house we\'d lived in for five years. Five years, and the walls were waiting.',
      distressCost: 2,
      distressThreshold: 3,
      maxDistress: Infinity,
      contradictionId: 'e6',
      unlocks: [],
      triggers: [],
      metadata: ['cause', 'investigation'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'e4',
      theme: 'the_event',
      text: 'He wasn\'t home when it started. He was — where was he? He said he was at a friend\'s. He said he got the call and drove back. I don\'t remember seeing him arrive. I don\'t remember much after the phone call.',
      distressCost: 3,
      distressThreshold: 4,
      maxDistress: Infinity,
      contradictionId: 'e7',
      unlocks: ['e5'],
      triggers: [],
      metadata: ['whereabouts', 'gap-in-memory'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'e5',
      theme: 'the_event',
      text: 'I saw his face in the hospital waiting room. He was — what was he? Upset? Relieved? I couldn\'t read him. I\'d never been unable to read him before. He kept clenching and unclenching his hands.',
      distressCost: 3,
      distressThreshold: 6,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['hospital', 'unreadable'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'e6',
      theme: 'the_event',
      text: 'The investigator\'s report said electrical. I believe that. I have to believe that. But the insurance company asked so many questions about the wiring, and then they asked about the gas line, and then they asked about David\'s travel schedule, and I stopped reading the letters.',
      distressCost: 3,
      distressThreshold: 7,
      maxDistress: Infinity,
      contradictionId: 'e3',
      unlocks: [],
      triggers: [],
      metadata: ['insurance', 'doubt', 'avoidance'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'e7',
      theme: 'the_event',
      text: 'He told me he was at a friend\'s. He told the police he was at a friend\'s. The friend told me he wasn\'t there. I haven\'t told anyone that. I don\'t know what it means. I don\'t want to know what it means.',
      distressCost: 5,
      distressThreshold: 9,
      maxDistress: Infinity,
      contradictionId: 'e4',
      unlocks: ['e9'],
      triggers: [],
      metadata: ['contradiction', 'secret', 'high-stakes'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'e8',
      theme: 'the_event',
      text: 'The fire trucks came in eleven minutes. Eleven minutes. The house was built in 1987. The walls were old wood and the fire moved through them like water through sand. It only takes eleven minutes.',
      distressCost: 2,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['timeline', 'helplessness'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'e9',
      theme: 'the_event',
      text: 'I have thought, in the dark, at three in the morning, standing in my motel room looking at the parking lot lights, that he might have done this. I have had that thought. I\'ve never said it out loud before. Saying it makes it real in a way that thinking it doesn\'t. Please don\'t write that down.',
      distressCost: 6,
      distressThreshold: 9,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['confession', 'suspicion', 'critical'],
      heard: false,
      firstHeardSession: null
    },

    // ── HOSPITAL ──────────────────────────────────────────────

    {
      id: 'h1',
      theme: 'hospital',
      text: 'I drove there in my scrubs. The nurses at the station asked if I was staff or patient and I couldn\'t answer. I was standing in the place I worked and I was the thing I treated.',
      distressCost: 3,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['h2'],
      triggers: [],
      metadata: ['arrival', 'identity-crisis'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'h2',
      theme: 'hospital',
      text: 'I kept saying, "I\'m fine, I\'m fine, I\'m fine." The word didn\'t mean anything. It was a sound I made with my mouth while they assessed me for smoke inhalation. I scored a fourteen on the concussion test. I remember being proud of that.',
      distressCost: 2,
      distressThreshold: 2,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['denial', 'assessment', 'dissociation'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'h3',
      theme: 'hospital',
      text: 'Three days. I was there for three days. I didn\'t call anyone. David handled everything — the insurance, the police, the neighbors. I lay in a hospital bed and stared at the ceiling tiles and counted the holes in each one. Forty-seven. Every tile had forty-seven holes.',
      distressCost: 2,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['a1'],
      triggers: [],
      metadata: ['duration', 'withdrawal', 'counting'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'h4',
      theme: 'hospital',
      text: 'Dr. Pham came to visit. She didn\'t ask how I was. She brought me coffee and said, "I need you to not work right now." She\'d never told me to stop before. I didn\'t realize I needed permission until she gave it.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['w3'],
      triggers: [],
      metadata: ['supervisor', 'permission'],
      heard: false,
      firstHeardSession: null
    },

    // ── AFTERMATH ─────────────────────────────────────────────

    {
      id: 'a1',
      theme: 'aftermath',
      text: 'I can\'t sleep. Not the way you\'re thinking. I can\'t sleep because when I close my eyes I see the house. Not the fire — the house. The way it was before. Every detail. The crack in the bathroom tile. The stain on the ceiling that looked like a bird. I lost all of it and I can\'t stop rebuilding it.',
      distressCost: 2,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['a2'],
      triggers: [],
      metadata: ['insomnia', 'rebuilding', 'grief'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'a2',
      theme: 'aftermath',
      text: 'The insurance paid out. They wouldn\'t have if — they paid out. We have money. David says we can buy a new house. A fresh start, he says. Those words taste like chalk in his mouth. In mine too.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['e6'],
      triggers: [],
      metadata: ['insurance', 'money', 'fresh-start'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'a3',
      theme: 'aftermath',
      text: 'David\'s daughter — Lily — she won\'t look at me. She\'s thirteen now and she blames me. Her mother told her I started the fire. Or she tells people I did. I don\'t know which is worse.',
      distressCost: 3,
      distressThreshold: 5,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['blame', 'stepdaughter', 'ex-wife'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'a4',
      theme: 'aftermath',
      text: 'Everyone asks how I\'m doing. Every phone call, every text: "How are you?" What they mean is "Are you done falling apart?" And I say "I\'m fine" because that\'s what my mother taught me to say, and what the hospital taught me to say, and what my husband expects me to say, and at some point I forgot what the truth sounds like.',
      distressCost: 2,
      distressThreshold: 4,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['c3', 'd3'],
      triggers: [],
      metadata: ['social-expectation', 'performing', 'exhaustion'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'a5',
      theme: 'aftermath',
      text: 'I\'m staying at the Red Roof on Route 9. Room 114. The deadbolt sticks and the sheets smell like industrial detergent but it\'s mine. No one expects anything from me in Room 114. I\'ve started to think of it as the last safe place.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['motel', 'isolation', 'safety'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'a6',
      theme: 'aftermath',
      text: 'I keep his things in a box under the bed. His watch, his cufflinks, a book he was reading. I don\'t know why. He\'s not dead. He\'s at his sister\'s. We just — needed space. I\'m the one who needed space. I needed to stop seeing his face across the breakfast table.',
      distressCost: 2,
      distressThreshold: 3,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['m8', 'a7'],
      triggers: [],
      metadata: ['separation', 'grief-objects'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'a7',
      theme: 'aftermath',
      text: 'Sometimes I can\'t breathe. Not — not dramatically. Just shallow. Like the air has become something I have to earn. The motel doctor said it\'s anxiety. He gave me an inhaler. It helps with the breathing. It doesn\'t help with the earning.',
      distressCost: 2,
      distressThreshold: 4,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: ['d2'],
      triggers: [],
      metadata: ['anxiety', 'somatic', 'breath'],
      heard: false,
      firstHeardSession: null
    },

    // ── DENIAL ────────────────────────────────────────────────

    {
      id: 'd1',
      theme: 'denial',
      text: 'I\'m here because my husband thinks I should be. I don\'t think there\'s anything wrong with me. I had a difficult experience and I\'m processing it. That\'s not the same as being unwell.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: 3,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['presenting', 'resistance'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'd2',
      theme: 'denial',
      text: 'The house was just a house. It was a thing, not a person. People lose things all the time. People lose everything in fires all the time. I\'m not special. I don\'t get to be more upset than anyone else.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: 5,
      contradictionId: 'a7',
      unlocks: [],
      triggers: [],
      metadata: ['minimizing', 'comparison'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'd3',
      theme: 'denial',
      text: 'I don\'t dream about it. I don\'t have nightmares. I sleep fine. I eat fine. I function fine. I\'m fine. I\'m using the word fine the way my mother used the word fine, which is to say: don\'t look at me.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: 'a1',
      unlocks: ['c3'],
      triggers: [],
      metadata: ['minimizing', 'insight-paradox'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'd4',
      theme: 'denial',
      text: 'David and I are fine. We\'re going through a rough patch. All couples go through rough patches. You don\'t throw away a marriage because of a rough patch. You don\'t throw away seven years.',
      distressCost: 0,
      distressThreshold: 0,
      maxDistress: 7,
      contradictionId: 'm9',
      unlocks: [],
      triggers: [],
      metadata: ['minimizing', 'marriage-denial'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'd5',
      theme: 'denial',
      text: 'I\'m not avoiding anything. I\'m choosing what to focus on. There\'s a difference. There has to be a difference.',
      distressCost: 1,
      distressThreshold: 0,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['rationalization'],
      heard: false,
      firstHeardSession: null
    },

    // ── CONFESSION ────────────────────────────────────────────

    {
      id: 'f1',
      theme: 'confession',
      text: 'I left a candle burning in the bathroom. I think about it every night. I can\'t be sure — I was at work — but I think I left it burning. I always burned candles. Lavender. The house smelled like lavender and now I can\'t smell lavender without — I can\'t.',
      distressCost: 5,
      distressThreshold: 7,
      maxDistress: Infinity,
      contradictionId: 'e3',
      unlocks: [],
      triggers: [],
      metadata: ['guilt', 'self-blame', 'candle'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'f2',
      theme: 'confession',
      text: 'I didn\'t love him the way he deserved. I loved him like a place to put my sadness. He deserved someone who loved him like a place to put their joy. I knew this and I married him anyway. I was selfish.',
      distressCost: 4,
      distressThreshold: 6,
      maxDistress: Infinity,
      contradictionId: 'm11',
      unlocks: [],
      triggers: [],
      metadata: ['guilt', 'self-blame', 'relationship-truth'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'f3',
      theme: 'confession',
      text: 'I wanted the house to be empty when it burned. I don\'t mean I wanted it to burn. But when I got the call, before I understood, there was a moment — a half-second — where I felt relief. Because I wasn\'t there. Because I was at work, safe, while something happened to someone else for once.',
      distressCost: 6,
      distressThreshold: 9,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['shame', 'relief', 'shocking'],
      heard: false,
      firstHeardSession: null
    },
    {
      id: 'f4',
      theme: 'confession',
      text: 'Sometimes I\'m glad it happened. Not — not the fire. But the after. The quiet. The motel room. The way no one needs anything from me. I didn\'t know how much I wanted to disappear until I did.',
      distressCost: 7,
      distressThreshold: 9,
      maxDistress: Infinity,
      contradictionId: null,
      unlocks: [],
      triggers: [],
      metadata: ['shame', 'hidden-desire', 'critical'],
      heard: false,
      firstHeardSession: null
    }
  ];

  // Fast lookup by id
  const fragmentMap = new Map();
  fragments.forEach(function (f) { fragmentMap.set(f.id, f); });

  // ==========================================================
  //  PURSUIT HISTORY
  // ==========================================================

  const pursuitHistory = {
    marriage: 0,
    childhood: 0,
    work: 0,
    the_event: 0,
    hospital: 0,
    aftermath: 0,
    denial: 0,
    confession: 0
  };

  // ==========================================================
  //  PATIENT STATE
  // ==========================================================

  var state = {
    distress: 0,
    maxDistressEver: 0,
    currentSession: 1,
    sessionHistory: [],
    fragmentsHeardThisSession: [],
    totalFragmentsHeard: 0
  };

  // ==========================================================
  //  APPROACH DEFINITIONS
  // ==========================================================

  var approaches = [
    {
      id: 'open',
      label: 'Open question',
      description: 'Invite the patient to speak freely',
      themeWeights: {
        marriage: 1, childhood: 1, work: 1,
        the_event: 0.3, hospital: 1, aftermath: 1,
        denial: 1.5, confession: 0.2
      },
      distressModifier: 0
    },
    {
      id: 'mirror',
      label: 'Reflective mirror',
      description: 'Reflect what the patient just said',
      themeWeights: null,
      distressModifier: -1
    },
    {
      id: 'reassure',
      label: 'Reassurance',
      description: 'Offer validation and safety',
      themeWeights: {
        denial: 2, aftermath: 1.5, marriage: 1,
        childhood: 0.5, work: 0.5,
        the_event: 0.2, hospital: 0.5, confession: 0.1
      },
      distressModifier: -2
    },
    {
      id: 'silence',
      label: 'Hold silence',
      description: 'Wait. Let the patient fill the void.',
      themeWeights: null,
      distressModifier: 1
    },
    {
      id: 'direct',
      label: 'Direct question',
      description: 'Ask something specific and pointed',
      themeWeights: {
        the_event: 3, confession: 2, marriage: 1,
        childhood: 1, work: 0.5, hospital: 1,
        aftermath: 0.5, denial: 0.3
      },
      distressModifier: 2
    },
    {
      id: 'challenge',
      label: 'Gentle challenge',
      description: 'Question a contradiction or deflection',
      themeWeights: {
        denial: 3, confession: 2.5, the_event: 2,
        marriage: 1, childhood: 1, work: 0.3,
        hospital: 0.5, aftermath: 0.5
      },
      distressModifier: 3
    }
  ];

  var approachMap = new Map();
  approaches.forEach(function (a) { approachMap.set(a.id, a); });

  // ==========================================================
  //  AVAILABLE APPROACHES
  // ==========================================================

  /**
   * Return approach ids available given the current patient state.
   * Some approaches appear only after rapport is established or
   * contradictions have been heard.
   */
  function getAvailableApproaches(lastFragmentId) {
    var available = ['open', 'reassure'];

    if (lastFragmentId) {
      available.push('mirror');
    }

    if (state.fragmentsHeardThisSession.length >= 1) {
      available.push('silence');
    }

    if (state.fragmentsHeardThisSession.length >= 2) {
      available.push('direct');
    }

    if (state.distress >= 5 || hasHeardContradiction()) {
      available.push('challenge');
    }

    return available;
  }

  // ==========================================================
  //  FRAGMENT SELECTION
  // ==========================================================

  /**
   * Choose the next fragment based on approach and current state.
   * Returns a fragment object, or null when the session should end.
   */
  function selectFragment(approach, lastFragmentId) {
    if (!approach) return null;

    if (state.fragmentsHeardThisSession.length >= 10) {
      return null;
    }

    var candidates = getCandidates(approach, lastFragmentId);

    if (candidates.length === 0) {
      return null;
    }

    var weighted = candidates.map(function (c) {
      return { fragment: c, weight: calculateWeight(c, approach, lastFragmentId) };
    });

    var totalWeight = weighted.reduce(function (sum, w) { return sum + w.weight; }, 0);
    var roll = Math.random() * totalWeight;

    for (var i = 0; i < weighted.length; i++) {
      roll -= weighted[i].weight;
      if (roll <= 0) return weighted[i].fragment;
    }

    return weighted[weighted.length - 1].fragment;
  }

  /**
   * Filter fragments down to those currently reachable.
   */
  function getCandidates(approach, lastFragmentId) {
    return fragments.filter(function (f) {
      if (state.fragmentsHeardThisSession.indexOf(f.id) !== -1) return false;
      if (state.distress < f.distressThreshold) return false;
      if (state.distress > f.maxDistress) return false;
      if (!isUnlocked(f)) return false;
      return true;
    });
  }

  /**
   * A fragment is unlocked when it is a base fragment or when
   * another fragment that lists it in `unlocks` has been heard.
   */
  var BASE_FRAGMENT_IDS = [
    'm1', 'm10', 'm11', 'c1', 'c5', 'c6',
    'w1', 'w2', 'w4', 'w6', 'e1', 'e8',
    'h3', 'h4', 'a1', 'a2', 'a5', 'a6',
    'd1', 'd2', 'd3', 'd4', 'd5'
  ];

  function isUnlocked(fragment) {
    if (BASE_FRAGMENT_IDS.indexOf(fragment.id) !== -1) return true;

    for (var i = 0; i < fragments.length; i++) {
      var other = fragments[i];
      if (other.heard && other.unlocks && other.unlocks.indexOf(fragment.id) !== -1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calculate selection weight for a fragment.
   * Weight is driven by approach theme affinity, pursuit history
   * (creating the tunnel-vision trap), thematic continuity, and
   * session pacing.
   */
  function calculateWeight(fragment, approach, lastFragmentId) {
    var weight = 1.0;

    // 1. Approach theme weights
    if (approach.themeWeights) {
      weight *= (approach.themeWeights[fragment.theme] || 1);
    }

    // 2. Pursuit history — the compounding trap
    var totalPursuit = 0;
    var keys = Object.keys(pursuitHistory);
    for (var pi = 0; pi < keys.length; pi++) {
      totalPursuit += pursuitHistory[keys[pi]];
    }

    if (totalPursuit > 0) {
      var pursuitRatio = pursuitHistory[fragment.theme] / totalPursuit;
      weight *= (1 + pursuitRatio * 2);

      var avgPursuit = totalPursuit / keys.length;
      if (pursuitHistory[fragment.theme] < avgPursuit * 0.3) {
        weight *= 0.3;
      }
    }

    // 3. Continuity & trigger bonuses
    if (lastFragmentId) {
      var lastF = fragmentMap.get(lastFragmentId);
      if (lastF) {
        if (lastF.theme === fragment.theme) weight *= 1.5;
        if (lastF.triggers && lastF.triggers.indexOf(fragment.id) !== -1) weight *= 5;
        if (lastF.unlocks && lastF.unlocks.indexOf(fragment.id) !== -1) weight *= 3;
      }
    }

    // 4. Mirror — strongly constrain to current theme
    if (approach.id === 'mirror' && lastFragmentId) {
      var lastFrag = fragmentMap.get(lastFragmentId);
      if (lastFrag) {
        weight *= (lastFrag.theme === fragment.theme) ? 3 : 0.3;
      }
    }

    // 5. Silence — push toward confession, away from denial
    if (approach.id === 'silence') {
      if (fragment.theme === 'confession') weight *= (state.distress >= 5) ? 2.5 : 0.3;
      if (fragment.theme === 'denial') weight *= 0.5;
    }

    // 6. Distress-gated theme gravitation
    if (state.distress < 3) {
      if (fragment.theme === 'the_event') weight *= 0.5;
      if (fragment.theme === 'confession') weight *= 0.2;
    }
    if (state.distress >= 7) {
      if (fragment.theme === 'confession') weight *= 1.5;
      if (fragment.theme === 'the_event') weight *= 1.3;
    }

    // 7. Session pacing — prefer unexplored themes
    var themeCountThisSession = {};
    state.fragmentsHeardThisSession.forEach(function (id) {
      var f = fragmentMap.get(id);
      if (f) themeCountThisSession[f.theme] = (themeCountThisSession[f.theme] || 0) + 1;
    });

    var timesSeen = themeCountThisSession[fragment.theme] || 0;
    if (timesSeen === 0) weight *= 1.5;
    else if (timesSeen >= 3) weight *= 0.4;

    // 8. Slight preference for never-heard fragments
    if (!fragment.heard) weight *= 1.3;

    return Math.max(weight, 0.01);
  }

  // ==========================================================
  //  STATE MANAGEMENT
  // ==========================================================

  /**
   * Process a player's chosen approach and return the patient
   * response together with updated state.
   */
  function respondToApproach(approachId, lastFragmentId) {
    var approach = approachMap.get(approachId);
    if (!approach) {
      return { fragment: null, approach: null, sessionShouldEnd: true };
    }

    var fragment = selectFragment(approach, lastFragmentId);

    if (!fragment) {
      return { fragment: null, approach: approach, sessionShouldEnd: true };
    }

    // Distress update
    state.distress = Math.max(0, Math.min(10, state.distress + fragment.distressCost));
    state.distress = Math.max(0, Math.min(10, state.distress + approach.distressModifier));
    state.maxDistressEver = Math.max(state.maxDistressEver, state.distress);

    // Pursuit history
    pursuitHistory[fragment.theme] = (pursuitHistory[fragment.theme] || 0) + 1;

    // Mark heard
    fragment.heard = true;
    if (fragment.firstHeardSession === null) {
      fragment.firstHeardSession = state.currentSession;
    }

    state.fragmentsHeardThisSession.push(fragment.id);
    state.totalFragmentsHeard++;

    return {
      fragment: fragment,
      approach: approach,
      sessionShouldEnd: false,
      currentDistress: state.distress
    };
  }

  /**
   * Begin a new session. Resets per-session tracking but
   * preserves cross-session memory.
   */
  function startNewSession() {
    state.currentSession++;
    state.fragmentsHeardThisSession = [];
    state.distress = 0;
    state.sessionHistory.push({
      session: state.currentSession,
      date: new Date().toISOString()
    });
  }

  // ==========================================================
  //  ANALYSIS HELPERS
  // ==========================================================

  function hasHeardContradiction() {
    for (var i = 0; i < fragments.length; i++) {
      var f = fragments[i];
      if (!f.heard || !f.contradictionId) continue;
      var other = fragmentMap.get(f.contradictionId);
      if (other && other.heard) return true;
    }
    return false;
  }

  function getDiscoveredContradictions() {
    var contradictions = [];
    var processed = {};

    fragments.forEach(function (f) {
      if (!f.heard || !f.contradictionId) return;
      var other = fragmentMap.get(f.contradictionId);
      if (!other || !other.heard) return;

      var pairId = [f.id, other.id].sort().join('-');
      if (processed[pairId]) return;

      contradictions.push({
        fragment1: { id: f.id, text: f.text, theme: f.theme },
        fragment2: { id: other.id, text: other.text, theme: other.theme },
        pairId: pairId
      });

      processed[pairId] = true;
    });

    return contradictions;
  }

  function getTimeline() {
    var timeline = {};

    fragments.forEach(function (f) {
      if (!timeline[f.theme]) timeline[f.theme] = [];
      timeline[f.theme].push({
        id: f.id,
        text: f.text,
        heard: f.heard,
        firstHeardSession: f.firstHeardSession,
        distressThreshold: f.distressThreshold,
        locked: !f.heard && (
          f.distressThreshold > state.maxDistressEver || !isUnlocked(f)
        )
      });
    });

    return timeline;
  }

  function getCompletionStats() {
    var total = fragments.length;
    var heard = fragments.filter(function (f) { return f.heard; }).length;
    var locked = fragments.filter(function (f) {
      return !f.heard && (
        f.distressThreshold > state.maxDistressEver || !isUnlocked(f)
      );
    }).length;

    return {
      fragmentsTotal: total,
      fragmentsHeard: heard,
      fragmentsLocked: locked,
      completionPercent: Math.round((heard / total) * 100),
      contradictionsDiscovered: getDiscoveredContradictions().length,
      maxDistressEver: state.maxDistressEver,
      sessionCount: state.currentSession,
      pursuitProfile: shallowCopy(pursuitHistory)
    };
  }

  function getDistressObservation() {
    var d = state.distress;
    if (d <= 1) return 'Patient presents as guarded but cooperative. Affect constrained.';
    if (d <= 3) return 'Patient showing mild agitation. Some pressured speech noted.';
    if (d <= 5) return 'Patient exhibiting moderate distress. Tangential thinking observed.';
    if (d <= 7) return 'Patient in significant distress. Affect labile. Hyperarousal evident.';
    if (d <= 9) return 'Patient in acute distress. Dissociative features present. Recommend immediate stabilization.';
    return 'Patient in crisis. Thought disorder evident. This session has gone too far.';
  }

  function getSessionSummary() {
    var themes = {};
    state.fragmentsHeardThisSession.forEach(function (id) {
      var f = fragmentMap.get(id);
      if (f) themes[f.theme] = (themes[f.theme] || 0) + 1;
    });

    var sortedThemes = Object.keys(themes)
      .map(function (t) { return { theme: t, count: themes[t] }; })
      .sort(function (a, b) { return b.count - a.count; });

    return {
      session: state.currentSession,
      fragmentsDiscussed: state.fragmentsHeardThisSession.length,
      primaryTheme: sortedThemes.length > 0 ? sortedThemes[0].theme : 'none',
      themeDistribution: sortedThemes,
      peakDistress: state.distress,
      distressObservation: getDistressObservation(),
      newFragments: state.fragmentsHeardThisSession.filter(function (id) {
        var f = fragmentMap.get(id);
        return f && f.firstHeardSession === state.currentSession;
      }).length
    };
  }

  // ==========================================================
  //  PERSISTENCE
  // ==========================================================

  function serialize() {
    return {
      fragmentStates: fragments.map(function (f) {
        return { id: f.id, heard: f.heard, firstHeardSession: f.firstHeardSession };
      }),
      pursuitHistory: shallowCopy(pursuitHistory),
      state: shallowCopy(state),
      version: 1
    };
  }

  function deserialize(data) {
    if (!data || data.version !== 1) return false;

    data.fragmentStates.forEach(function (fs) {
      var f = fragmentMap.get(fs.id);
      if (f) {
        f.heard = fs.heard;
        f.firstHeardSession = fs.firstHeardSession;
      }
    });

    Object.keys(data.pursuitHistory).forEach(function (theme) {
      pursuitHistory[theme] = data.pursuitHistory[theme];
    });

    Object.keys(data.state).forEach(function (k) {
      state[k] = data.state[k];
    });

    return true;
  }

  function resetCaseFile() {
    fragments.forEach(function (f) {
      f.heard = false;
      f.firstHeardSession = null;
    });

    Object.keys(pursuitHistory).forEach(function (k) { pursuitHistory[k] = 0; });

    state = {
      distress: 0,
      maxDistressEver: 0,
      currentSession: 1,
      sessionHistory: [],
      fragmentsHeardThisSession: [],
      totalFragmentsHeard: 0
    };
  }

  // ==========================================================
  //  GETTERS
  // ==========================================================

  function getFragment(id) { return fragmentMap.get(id) || null; }
  function getState() { return shallowCopy(state); }
  function getPursuitHistory() { return shallowCopy(pursuitHistory); }
  function getAllFragments() { return fragments.map(function (f) { return shallowCopyFragment(f); }); }
  function getApproach(id) { return approachMap.get(id) || null; }
  function getAllApproaches() { return approaches.map(function (a) { return shallowCopy(a); }); }
  function getCurrentSessionFragments() { return state.fragmentsHeardThisSession.slice(); }

  function getLastFragmentId() {
    if (state.fragmentsHeardThisSession.length === 0) return null;
    return state.fragmentsHeardThisSession[state.fragmentsHeardThisSession.length - 1];
  }

  // ==========================================================
  //  SESSION END
  // ==========================================================

  function endSession() {
    var summary = getSessionSummary();
    state.sessionHistory.push({
      session: state.currentSession,
      timestamp: new Date().toISOString(),
      fragmentCount: state.fragmentsHeardThisSession.length,
      peakDistress: state.distress
    });
    return summary;
  }

  // ==========================================================
  //  INTERNAL UTILITIES
  // ==========================================================

  function shallowCopy(obj) {
    var copy = {};
    Object.keys(obj).forEach(function (k) { copy[k] = obj[k]; });
    return copy;
  }

  function shallowCopyFragment(f) {
    return {
      id: f.id, theme: f.theme, text: f.text,
      distressCost: f.distressCost, distressThreshold: f.distressThreshold,
      maxDistress: f.maxDistress, contradictionId: f.contradictionId,
      unlocks: f.unlocks.slice(), triggers: f.triggers.slice(),
      metadata: f.metadata.slice(), heard: f.heard,
      firstHeardSession: f.firstHeardSession
    };
  }

  // ==========================================================
  //  PUBLIC API
  // ==========================================================

  return {
    // Core interaction
    respondToApproach: respondToApproach,
    getAvailableApproaches: getAvailableApproaches,
    startNewSession: startNewSession,
    endSession: endSession,
    selectFragment: function (approachId, lastFragmentId) {
      return selectFragment(approachMap.get(approachId), lastFragmentId);
    },

    // Getters
    getFragment: getFragment,
    getState: getState,
    getPursuitHistory: getPursuitHistory,
    getAllFragments: getAllFragments,
    getApproach: getApproach,
    getAllApproaches: getAllApproaches,
    getCurrentSessionFragments: getCurrentSessionFragments,
    getLastFragmentId: getLastFragmentId,
    getDistressObservation: getDistressObservation,
    getSessionSummary: getSessionSummary,

    // Analysis
    getTimeline: getTimeline,
    getCompletionStats: getCompletionStats,
    getDiscoveredContradictions: getDiscoveredContradictions,
    hasHeardContradiction: hasHeardContradiction,

    // Persistence
    serialize: serialize,
    deserialize: deserialize,
    resetCaseFile: resetCaseFile
  };
})();
