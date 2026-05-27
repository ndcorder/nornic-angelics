/**
 * data.js — All game content for The Next of Kin Simulator
 *
 * The deceased: Maya Chen, 34.
 * Mechanism: Hit by a car while crossing Mission Street, 6:47 AM.
 * Pronounced dead at San Francisco General, 7:23 AM.
 *
 * You have her phone. The battery is at 31%.
 * Each action drains it. Each second matters.
 */

const DECEASED = {
  name: "Maya Chen",
  age: 34,
  death: {
    cause: "pedestrian vs. vehicle collision",
    location: "Mission Street near 24th",
    time: "6:47 AM",
    pronounced: "7:23 AM",
    hospital: "San Francisco General",
    details: "She was crossing with the light. The driver ran a red. She was pronounced dead on arrival."
  },
  phone: {
    battery: 31,
    lockCode: null, // phone is unlocked — she was using it
    wallpaper: "a sunrise over the ocean. the timestamp says it was taken 4 days ago.",
    lastActivity: "Weather app, 6:44 AM. She was checking if it would rain."
  }
};

const CONTACTS = {
  alice: {
    id: "alice",
    name: "Alice Chen",
    relation: "Mother",
    phone: "Mom ❤️",
    group: "Family",
    age: 61,
    location: "Portland, OR",
    shouldKnowBy: 1, // minutes (family first)
    knownEdges: ["david", "sam"],
    hiddenEdges: [],
    importance: 10,
    fragility: 9,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "Maya's emergency contact. The obvious first call. Maya spoke to her almost every day."
  },

  david: {
    id: "david",
    name: "David Park",
    relation: "Ex-Boyfriend",
    phone: "David Park",
    group: "Personal",
    age: 36,
    location: "San Francisco",
    shouldKnowBy: 5,
    knownEdges: ["alice", "jen"],
    hiddenEdges: ["sam"],
    importance: 8,
    fragility: 6,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "Maya's ex of 8 months. The breakup was mutual on paper. Different in practice."
  },

  sam: {
    id: "sam",
    name: "Sam Rivera",
    relation: "Best Friend / The One",
    phone: "Sam Rivera ☀️",
    group: "Personal",
    age: 33,
    location: "San Francisco",
    shouldKnowBy: 3,
    knownEdges: ["alice", "jen", "david"],
    hiddenEdges: [],
    importance: 10,
    fragility: 10,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "Maya's best friend since college. Something more recently. The relationship she was building courage to name."
  },

  jen: {
    id: "jen",
    name: "Jen Torres-Chen",
    relation: "Sister-in-Law / Confidante",
    phone: "Jen Torres-Chen",
    group: "Family",
    age: 38,
    location: "San Francisco",
    shouldKnowBy: 2,
    knownEdges: ["alice", "michael", "sam"],
    hiddenEdges: ["david"],
    importance: 7,
    fragility: 5,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "Married to Maya's brother. The one Maya confided in. A vault of secrets she never asked to hold."
  },

  michael: {
    id: "michael",
    name: "Michael Chen",
    relation: "Brother",
    phone: "Michael Chen",
    group: "Family",
    age: 40,
    location: "San Francisco",
    shouldKnowBy: 2,
    knownEdges: ["alice", "jen"],
    hiddenEdges: ["jen:sam"],
    importance: 7,
    fragility: 6,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "Maya's older brother. They'd been estranged for a year after an argument neither would explain. Recently started talking again."
  },

  ruth: {
    id: "ruth",
    name: "Ruth Chen",
    relation: "Grandmother",
    phone: "Po Po 婆婆 💕",
    group: "Family",
    age: 84,
    location: "Sunset District, SF",
    shouldKnowBy: 4,
    knownEdges: ["alice", "michael"],
    hiddenEdges: [],
    importance: 9,
    fragility: 10,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "Maya's grandmother. Raised her for three years while Alice got on her feet. They speak in a mix of Cantonese and English only they understand."
  },

  marcus: {
    id: "marcus",
    name: "Marcus Webb",
    relation: "Boss / Mentor",
    phone: "Marcus Webb",
    group: "Work",
    age: 52,
    location: "San Francisco",
    shouldKnowBy: 15,
    knownEdges: ["elena"],
    hiddenEdges: [],
    importance: 5,
    fragility: 3,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "Maya's boss at the architecture firm. Professional respect, occasional dinner, nothing more."
  },

  elena: {
    id: "elena",
    name: "Elena Voss",
    relation: "Colleague / Friend",
    phone: "Elena Voss 🏗️",
    group: "Work",
    age: 29,
    location: "Oakland",
    shouldKnowBy: 20,
    knownEdges: ["marcus"],
    hiddenEdges: ["sam"],
    importance: 4,
    fragility: 4,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "A colleague who became a friend. They bonded over being the only two women at the firm."
  },

  ray: {
    id: "ray",
    name: "Ray Brennan",
    relation: "Landlord / Friend",
    phone: "Ray Brennan",
    group: "Other",
    age: 67,
    location: "San Francisco",
    shouldKnowBy: 30,
    knownEdges: [],
    hiddenEdges: ["alice"],
    importance: 3,
    fragility: 2,
    alreadyKnows: false,
    notifiedAt: null,
    notificationDetail: null,
    emotionalState: "waiting",
    description: "Maya's landlord in the Mission. Reduced her rent when she was between jobs. Has known her since she was born."
  }
};

/**
 * TEXT THREADS
 *
 * Organized by contact. Each thread contains multiple pages.
 * The player reads these to discover relationships.
 *
 * Battery cost: 1% to open a thread, 0.5% per additional page.
 */

const TEXT_THREADS = {
  alice: {
    contactId: "alice",
    title: "Mom ❤️",
    pages: [
      {
        messages: [
          { from: "alice", text: "Good morning baby! Rain today?", time: "6:32 AM", date: "today" },
          { from: "maya", text: "Checking now!", time: "6:44 AM", date: "today" },
          { from: "alice", text: "Drive safe. Love you", time: "6:45 AM", date: "today" }
        ]
      },
      {
        messages: [
          { from: "maya", text: "Mom I need to tell you something", time: "9:14 PM", date: "3 days ago" },
          { from: "alice", text: "What's wrong?", time: "9:14 PM", date: "3 days ago" },
          { from: "maya", text: "Nothing wrong! Good thing", time: "9:14 PM", date: "3 days ago" },
          { from: "alice", text: "??", time: "9:14 PM", date: "3 days ago" },
          { from: "maya", text: "I think I'm in love", time: "9:15 PM", date: "3 days ago" },
          { from: "alice", text: "MAYA", time: "9:15 PM", date: "3 days ago" },
          { from: "alice", text: "With who??", time: "9:15 PM", date: "3 days ago" },
          { from: "maya", text: "Someone you know", time: "9:15 PM", date: "3 days ago" },
          { from: "alice", text: "David?? Are you back with David?", time: "9:15 PM", date: "3 days ago" },
          { from: "maya", text: "No not David", time: "9:16 PM", date: "3 days ago" },
          { from: "maya", text: "Someone better", time: "9:16 PM", date: "3 days ago" },
          { from: "alice", text: "Tell me", time: "9:16 PM", date: "3 days ago" },
          { from: "maya", text: "Soon. I want to do it right", time: "9:16 PM", date: "3 days ago" },
          { from: "alice", text: "I'm going to die of curiosity", time: "9:16 PM", date: "3 days ago" },
          { from: "maya", text: "You're going to love them mom", time: "9:17 PM", date: "3 days ago" }
        ],
        reveals: ["maya_planning_to_tell_about_sam"]
      },
      {
        messages: [
          { from: "alice", text: "Your brother called. Says you're not answering him.", time: "7:02 PM", date: "1 week ago" },
          { from: "maya", text: "I'll call him tomorrow", time: "7:15 PM", date: "1 week ago" },
          { from: "alice", text: "Maya. He's trying.", time: "7:15 PM", date: "1 week ago" },
          { from: "maya", text: "I know. I'm trying too.", time: "7:16 PM", date: "1 week ago" },
          { from: "alice", text: "What happened between you two?", time: "7:16 PM", date: "1 week ago" },
          { from: "maya", text: "I can't talk about it yet", time: "7:16 PM", date: "1 week ago" },
          { from: "alice", text: "He's your brother", time: "7:17 PM", date: "1 week ago" },
          { from: "maya", text: "I know what he is", time: "7:17 PM", date: "1 week ago" }
        ],
        reveals: ["maya_michael_estrangement"]
      }
    ]
  },

  sam: {
    contactId: "sam",
    title: "Sam Rivera ☀️",
    pages: [
      {
        messages: [
          { from: "maya", text: "I told my mom I'm in love", time: "9:18 PM", date: "3 days ago" },
          { from: "sam", text: "You WHAT", time: "9:18 PM", date: "3 days ago" },
          { from: "maya", text: "Not the name yet", time: "9:18 PM", date: "3 days ago" },
          { from: "sam", text: "Maya Chen you are going to give me a heart attack", time: "9:18 PM", date: "3 days ago" },
          { from: "maya", text: "I want to tell everyone", time: "9:19 PM", date: "3 days ago" },
          { from: "sam", text: "Everyone?", time: "9:19 PM", date: "3 days ago" },
          { from: "maya", text: "Everyone who matters", time: "9:19 PM", date: "3 days ago" },
          { from: "sam", text: "I want that too", time: "9:19 PM", date: "3 days ago" },
          { from: "sam", text: "More than anything", time: "9:19 PM", date: "3 days ago" },
          { from: "maya", text: "Sunday? I'll make dinner", time: "9:20 PM", date: "3 days ago" },
          { from: "sam", text: "Sunday. I'll bring wine.", time: "9:20 PM", date: "3 days ago" },
          { from: "sam", text: "The good wine", time: "9:20 PM", date: "3 days ago" },
          { from: "maya", text: "❤️", time: "9:20 PM", date: "3 days ago" },
          { from: "sam", text: "❤️❤️", time: "9:20 PM", date: "3 days ago" },
          { from: "sam", text: "❤️❤️❤️", time: "9:20 PM", date: "3 days ago" },
          { from: "maya", text: "I love you Sam", time: "9:20 PM", date: "3 days ago" },
          { from: "sam", text: "I've loved you since 2015", time: "9:21 PM", date: "3 days ago" },
          { from: "maya", text: "Why didn't you say anything", time: "9:21 PM", date: "3 days ago" },
          { from: "sam", text: "I was waiting for it to be the right time", time: "9:21 PM", date: "3 days ago" },
          { from: "maya", text: "This is the right time", time: "9:21 PM", date: "3 days ago" }
        ],
        reveals: ["maya_sam_relationship", "maya_sam_planned_sunday"]
      },
      {
        messages: [
          { from: "sam", text: "Hey have you talked to David recently?", time: "2:30 PM", date: "1 week ago" },
          { from: "maya", text: "No. Why?", time: "2:45 PM", date: "1 week ago" },
          { from: "sam", text: "He texted me. Just 'hey how are you'", time: "2:45 PM", date: "1 week ago" },
          { from: "maya", text: "What did you say?", time: "2:46 PM", date: "1 week ago" },
          { from: "sam", text: "Nothing yet", time: "2:46 PM", date: "1 week ago" },
          { from: "maya", text: "Don't respond", time: "2:46 PM", date: "1 week ago" },
          { from: "sam", text: "Why?", time: "2:46 PM", date: "1 week ago" },
          { from: "maya", text: "I just don't want him to", time: "2:47 PM", date: "1 week ago" },
          { from: "maya", text: "I don't know", time: "2:47 PM", date: "1 week ago" },
          { from: "maya", text: "I don't want anything from that time", time: "2:47 PM", date: "1 week ago" },
          { from: "sam", text: "Okay", time: "2:47 PM", date: "1 week ago" },
          { from: "sam", text: "I've got you", time: "2:47 PM", date: "1 week ago" }
        ],
        reveals: ["sam_david_contact", "maya_avoids_david"]
      },
      {
        messages: [
          { from: "sam", text: "Jen asked about you at lunch", time: "12:15 PM", date: "2 weeks ago" },
          { from: "maya", text: "What did she say?", time: "12:20 PM", date: "2 weeks ago" },
          { from: "sam", text: "Just that she misses you. Asked if you seemed happy", time: "12:21 PM", date: "2 weeks ago" },
          { from: "maya", text: "What did you tell her?", time: "12:21 PM", date: "2 weeks ago" },
          { from: "sam", text: "That you seemed really happy lately", time: "12:22 PM", date: "2 weeks ago" },
          { from: "sam", text: "I think she knows", time: "12:22 PM", date: "2 weeks ago" },
          { from: "maya", text: "She knows something. She always knows.", time: "12:23 PM", date: "2 weeks ago" },
          { from: "sam", text: "She's happy for you. For us.", time: "12:23 PM", date: "2 weeks ago" },
          { from: "sam", text: "She made a toast when you left. 'To Maya.' I almost cried", time: "12:24 PM", date: "2 weeks ago" }
        ],
        reveals: ["jen_knows_about_maya_sam"]
      }
    ]
  },

  david: {
    contactId: "david",
    title: "David Park",
    pages: [
      {
        messages: [
          { from: "david", text: "Hey", time: "10:03 PM", date: "5 days ago" },
          { from: "david", text: "I know it's late", time: "10:03 PM", date: "5 days ago" },
          { from: "david", text: "I just keep thinking about you", time: "10:03 PM", date: "5 days ago" },
          { from: "david", text: "I'm sorry", time: "10:04 PM", date: "5 days ago" }
        ],
        reveals: ["david_still_attached"]
      },
      {
        messages: [
          { from: "maya", text: "David what is this", time: "11:30 AM", date: "3 weeks ago" },
          { from: "david", text: "What", time: "11:32 AM", date: "3 weeks ago" },
          { from: "maya", text: "You followed Sam on instagram", time: "11:32 AM", date: "3 weeks ago" },
          { from: "david", text: "It's a follow Maya", time: "11:33 AM", date: "3 weeks ago" },
          { from: "maya", text: "You've never met her. We've been broken up for 8 months. Why are you following my friend", time: "11:33 AM", date: "3 weeks ago" },
          { from: "david", text: "I met her once at your birthday", time: "11:34 AM", date: "3 weeks ago" },
          { from: "maya", text: "David", time: "11:34 AM", date: "3 weeks ago" },
          { from: "david", text: "Fine. Unfollowing.", time: "11:35 AM", date: "3 weeks ago" },
          { from: "david", text: "I didn't mean anything by it", time: "11:35 AM", date: "3 weeks ago" }
        ],
        reveals: ["david_aware_of_sam", "david_investigating"]
      },
      {
        messages: [
          { from: "david", text: "Can we talk", time: "6:00 PM", date: "2 months ago" },
          { from: "maya", text: "About what", time: "6:22 PM", date: "2 months ago" },
          { from: "david", text: "I saw you at Dolores Park. With someone.", time: "6:22 PM", date: "2 months ago" },
          { from: "maya", text: "David", time: "6:23 PM", date: "2 months ago" },
          { from: "david", text: "Are you happy?", time: "6:23 PM", date: "2 months ago" },
          { from: "maya", text: "Yes", time: "6:24 PM", date: "2 months ago" },
          { from: "david", text: "Good", time: "6:24 PM", date: "2 months ago" },
          { from: "david", text: "That's all I wanted to know", time: "6:24 PM", date: "2 months ago" },
          { from: "david", text: "You deserve to be happy", time: "6:25 PM", date: "2 months ago" }
        ],
        reveals: ["david_saw_maya_with_someone"]
      }
    ]
  },

  jen: {
    contactId: "jen",
    title: "Jen Torres-Chen",
    pages: [
      {
        messages: [
          { from: "maya", text: "Sunday dinner?", time: "4:00 PM", date: "4 days ago" },
          { from: "jen", text: "Yes! Michael's been asking", time: "4:05 PM", date: "4 days ago" },
          { from: "jen", text: "I think he wants to clear the air", time: "4:05 PM", date: "4 days ago" },
          { from: "maya", text: "I know", time: "4:06 PM", date: "4 days ago" },
          { from: "maya", text: "I'm bringing someone", time: "4:06 PM", date: "4 days ago" },
          { from: "jen", text: "Oh??", time: "4:06 PM", date: "4 days ago" },
          { from: "jen", text: "OH", time: "4:07 PM", date: "4 days ago" },
          { from: "jen", text: "Maya Chen", time: "4:07 PM", date: "4 days ago" },
          { from: "jen", text: "Sunday", time: "4:07 PM", date: "4 days ago" },
          { from: "jen", text: "I'm making paella", time: "4:07 PM", date: "4 days ago" },
          { from: "jen", text: "The good one", time: "4:07 PM", date: "4 days ago" },
          { from: "maya", text: "I love you", time: "4:08 PM", date: "4 days ago" },
          { from: "jen", text: "We love you too", time: "4:08 PM", date: "4 days ago" },
          { from: "jen", text: "Michael doesn't know yet so let me", time: "4:08 PM", date: "4 days ago" },
          { from: "jen", text: "Handle it", time: "4:08 PM", date: "4 days ago" },
          { from: "maya", text: "Thank you", time: "4:09 PM", date: "4 days ago" }
        ],
        reveals: ["jen_planned_dinner", "jen_covering_for_maya_sam"]
      },
      {
        messages: [
          { from: "jen", text: "Can I tell you something", time: "8:00 PM", date: "2 weeks ago" },
          { from: "maya", text: "Always", time: "8:01 PM", date: "2 weeks ago" },
          { from: "jen", text: "David messaged Michael on facebook", time: "8:01 PM", date: "2 weeks ago" },
          { from: "jen", text: "Asking if you were seeing anyone", time: "8:02 PM", date: "2 weeks ago" },
          { from: "maya", text: "What did Michael say", time: "8:02 PM", date: "2 weeks ago" },
          { from: "jen", text: "\"I don't keep tabs on my sister\"", time: "8:02 PM", date: "2 weeks ago" },
          { from: "jen", text: "He was annoyed at David not at the question", time: "8:03 PM", date: "2 weeks ago" },
          { from: "jen", text: "I don't think Michael has any idea about you and Sam", time: "8:03 PM", date: "2 weeks ago" },
          { from: "maya", text: "Good", time: "8:03 PM", date: "2 weeks ago" },
          { from: "jen", text: "David is another story", time: "8:03 PM", date: "2 weeks ago" },
          { from: "jen", text: "Be careful", time: "8:04 PM", date: "2 weeks ago" }
        ],
        reveals: ["david_asked_michael", "michael_doesnt_know"]
      }
    ]
  },

  michael: {
    contactId: "michael",
    title: "Michael Chen",
    pages: [
      {
        messages: [
          { from: "michael", text: "Hey", time: "7:00 PM", date: "1 week ago" },
          { from: "michael", text: "Mom says you're not answering", time: "7:00 PM", date: "1 week ago" },
          { from: "michael", text: "I know you're still mad", time: "7:01 PM", date: "1 week ago" },
          { from: "michael", text: "I'm sorry about what I said", time: "7:01 PM", date: "1 week ago" },
          { from: "michael", text: "You're my sister", time: "7:01 PM", date: "1 week ago" }
        ],
        reveals: ["michael_apologizing"]
      },
      {
        messages: [
          { from: "maya", text: "Fine. Tell me what you want to say", time: "3:00 PM", date: "2 weeks ago" },
          { from: "michael", text: "In person", time: "3:02 PM", date: "2 weeks ago" },
          { from: "maya", text: "No. Here or not at all", time: "3:02 PM", date: "2 weeks ago" },
          { from: "michael", text: "I was wrong about David", time: "3:03 PM", date: "2 weeks ago" },
          { from: "michael", text: "I shouldn't have taken his side", time: "3:03 PM", date: "2 weeks ago" },
          { from: "michael", text: "I didn't know what he did to you", time: "3:03 PM", date: "2 weeks ago" },
          { from: "maya", text: "What he did to me", time: "3:04 PM", date: "2 weeks ago" },
          { from: "michael", text: "I just mean the breakup", time: "3:04 PM", date: "2 weeks ago" },
          { from: "maya", text: "You meant more than that", time: "3:05 PM", date: "2 weeks ago" },
          { from: "michael", text: "Maya", time: "3:05 PM", date: "2 weeks ago" },
          { from: "maya", text: "You called him first. When we broke up. You called HIM", time: "3:06 PM", date: "2 weeks ago" },
          { from: "maya", text: "To check on HIM", time: "3:06 PM", date: "2 weeks ago" },
          { from: "maya", text: "Your sister", time: "3:06 PM", date: "2 weeks ago" },
          { from: "michael", text: "I know", time: "3:06 PM", date: "2 weeks ago" },
          { from: "michael", text: "I'm sorry", time: "3:06 PM", date: "2 weeks ago" },
          { from: "maya", text: "Sunday. Jen's. I'll see you there.", time: "3:07 PM", date: "2 weeks ago" },
          { from: "michael", text: "Really?", time: "3:07 PM", date: "2 weeks ago" },
          { from: "maya", text: "Really", time: "3:07 PM", date: "2 weeks ago" }
        ],
        reveals: ["estrangement_cause", "david_something_during_breakup"]
      }
    ]
  },

  ruth: {
    contactId: "ruth",
    title: "Po Po 婆婆 💕",
    pages: [
      {
        messages: [
          { from: "maya", text: "Po Po 記得你說過要教我做你的湯", time: "2:00 PM", date: "yesterday" },
          { from: "ruth", text: "我孫女終於有時間了嗎！ Sunday ok?", time: "2:15 PM", date: "yesterday" },
          { from: "maya", text: "Sunday 完美 ❤️", time: "2:16 PM", date: "yesterday" },
          { from: "ruth", text: "Bring the nice friend. The one you haven't told me about yet", time: "2:17 PM", date: "yesterday" },
          { from: "maya", text: "How do you always know", time: "2:18 PM", date: "yesterday" },
          { from: "ruth", text: "I'm your Po Po. I know everything", time: "2:18 PM", date: "yesterday" },
          { from: "ruth", text: "Also you smile different now", time: "2:19 PM", date: "yesterday" },
          { from: "ruth", text: "I'm happy for you 寶貝", time: "2:19 PM", date: "yesterday" }
        ],
        reveals: ["ruth_sensed_something", "maya_planned_sunday_with_ruth"]
      }
    ]
  },

  marcus: {
    contactId: "marcus",
    title: "Marcus Webb",
    pages: [
      {
        messages: [
          { from: "marcus", text: "Don't forget 9am site visit", time: "8:30 PM", date: "yesterday" },
          { from: "maya", text: "Already prepped! Have the renderings ready", time: "8:35 PM", date: "yesterday" },
          { from: "marcus", text: "You're my best employee, you know that?", time: "8:36 PM", date: "yesterday" },
          { from: "maya", text: "Don't tell Elena", time: "8:36 PM", date: "yesterday" },
          { from: "marcus", text: "I tell her the same thing. You're both my best.", time: "8:37 PM", date: "yesterday" },
          { from: "marcus", text: "See you at 9", time: "8:37 PM", date: "yesterday" }
        ],
        reveals: []
      }
    ]
  },

  elena: {
    contactId: "elena",
    title: "Elena Voss 🏗️",
    pages: [
      {
        messages: [
          { from: "elena", text: "Drinks after the site visit?", time: "7:00 PM", date: "2 days ago" },
          { from: "maya", text: "Can't! Have plans", time: "7:05 PM", date: "2 days ago" },
          { from: "elena", text: "Mysterious plans?", time: "7:05 PM", date: "2 days ago" },
          { from: "maya", text: "Very mysterious", time: "7:06 PM", date: "2 days ago" },
          { from: "elena", text: "You've been different lately. Good different", time: "7:06 PM", date: "2 days ago" },
          { from: "elena", text: "Someone?", time: "7:06 PM", date: "2 days ago" },
          { from: "maya", text: "🤐", time: "7:07 PM", date: "2 days ago" },
          { from: "elena", text: "I KNEW IT", time: "7:07 PM", date: "2 days ago" },
          { from: "elena", text: "Tell me everything Monday", time: "7:07 PM", date: "2 days ago" }
        ],
        reveals: ["elena_sensed_change"]
      },
      {
        messages: [
          { from: "elena", text: "Hey random question", time: "4:00 PM", date: "1 month ago" },
          { from: "elena", text: "Do you know Sam Rivera?", time: "4:00 PM", date: "1 month ago" },
          { from: "maya", text: "Yes! Best friend from college. Why?", time: "4:02 PM", date: "1 month ago" },
          { from: "elena", text: "We dated briefly years ago. Before you started. Small world", time: "4:03 PM", date: "1 month ago" },
          { from: "maya", text: "Wait really? Small world", time: "4:03 PM", date: "1 month ago" },
          { from: "elena", text: "Very brief. Like 3 dates. Nice person", time: "4:04 PM", date: "1 month ago" },
          { from: "elena", text: "Anyway just realized the connection", time: "4:04 PM", date: "1 month ago" }
        ],
        reveals: ["elena_sam_history"]
      }
    ]
  },

  ray: {
    contactId: "ray",
    title: "Ray Brennan",
    pages: [
      {
        messages: [
          { from: "ray", text: "Hi Maya. Rent is deposited. Also I fixed the leaky faucet.", time: "10:00 AM", date: "2 days ago" },
          { from: "maya", text: "Mr. Brennan you didn't have to do that!", time: "10:15 AM", date: "2 days ago" },
          { from: "ray", text: "Call me Ray. And yes I did. Your father would've done the same.", time: "10:16 AM", date: "2 days ago" },
          { from: "ray", text: "I still miss him", time: "10:16 AM", date: "2 days ago" },
          { from: "maya", text: "Me too", time: "10:17 AM", date: "2 days ago" },
          { from: "ray", text: "Your mom doing okay?", time: "10:17 AM", date: "2 days ago" },
          { from: "maya", text: "I think so. I'll ask her to call you", time: "10:18 AM", date: "2 days ago" },
          { from: "ray", text: "That would be nice", time: "10:18 AM", date: "2 days ago" }
        ],
        reveals: ["ray_knew_father", "ray_alice_connection"]
      }
    ]
  }
};

/**
 * NOTIFICATION RESPONSES
 *
 * When you call a contact, their response depends on:
 * 1. Your delivery method (brief, gentle, or full detail)
 * 2. Who they already know about
 * 3. Who has already been notified
 * 4. What those people might have told them
 */

const NOTIFICATION_RESPONSES = {
  alice: {
    immediate: {
      gentle: [
        "\"Maya? What's wrong? You never call this early.\"",
        "Silence.",
        "\"No. No no no no.\"",
        "\"My baby. My baby. Please tell me you're lying to me.\"",
        "\"I need to come. I'm coming. Don't— don't let them do anything until I get there.\"",
        "She's crying now. The kind of crying that doesn't stop.",
        "\"Was she alone? Was anyone with her?\""
      ],
      brief: [
        "\"Maya's been in an accident.\"",
        "\"What kind of accident.\"",
        "\"She didn't make it.\"",
        "\"...\"",
        "\"What do you mean she didn't make it. What does that mean.\"",
        "\"I'm her MOTHER. I should have been there. Why wasn't I there?\"",
        "\"Was she scared? Was she— was she alone?\""
      ]
    },
    delayed: {
      learnedFromOther: {
        sam: [
          "\"Sam called me. I thought— I thought it was a joke.\"",
          "\"Why didn't you call me FIRST? I'm her MOTHER.\"",
          "\"How could someone else tell me my daughter is dead.\"",
          "\"I will never forgive this.\""
        ],
        michael: [
          "\"Michael told me. My son had to tell me his sister is dead.\"",
          "\"He was crying so hard I couldn't understand him.\"",
          "\"I should have heard it from you. You had her phone.\"",
          "\"You had my daughter's phone and you didn't call me first.\""
        ]
      }
    },
    followup: {
      asksAbout: ["david", "sam"],
      questions: [
        "\"Was someone in love with her? She said... she said she had something to tell me. Someone she was going to tell me about.\"",
        "\"Did she seem happy? The last few weeks. Did she seem happy?\""
      ]
    }
  },

  sam: {
    immediate: {
      gentle: [
        "\"Hey you— wait, who is this?\"",
        "\"Why do you have Maya's phone?\"",
        "\"What do you MEAN you have Maya's phone.\"",
        "\"Stop. Stop talking. I don't— I can't breathe.\"",
        "\"She was going to make dinner. Sunday. She was going to—\"",
        "\"I was supposed to bring wine.\"",
        "\"I was supposed to be there. I should have been there.\"",
        "\"Tell me you're lying. Please. Tell me this is a mistake.\""
      ],
      brief: [
        "\"Maya Chen has died. I'm calling from her phone to notify—\"",
        "\"No.\"",
        "\"No. I don't accept that.\"",
        "\"She's not— she can't be—\"",
        "\"We had plans. Sunday. She was going to—\"",
        "\"I need to go. I need to— I can't be on the phone right now.\"",
        "\"I can't breathe.\""
      ]
    },
    delayed: {
      learnedFromOther: {
        alice: [
          "\"Her mom called me. She was— she was screaming.\"",
          "\"I could hear her screaming from across the country.\"",
          "\"I should have been the one to call her. I should have—\"",
          "\"Did Maya say anything? About me? Before?\""
        ],
        david: [
          "\"DAVID called me? David told me Maya was dead?\"",
          "\"Why would he— how did he know before me?\"",
          "\"I was supposed to know first. I was supposed to be the one.\"",
          "\"She wouldn't have wanted him to tell me. She wouldn't have wanted that.\""
        ]
      }
    },
    followup: {
      asksAbout: ["alice", "ruth"],
      questions: [
        "\"Did she talk about me? To anyone? Did she— was I real to her? In the end, was I real?\"",
        "\"I loved her since 2015. I know you saw that. Please tell me she knew. Please.\""
      ]
    }
  },

  david: {
    immediate: {
      gentle: [
        "\"Hello? Maya?\"",
        "\"...who is this?\"",
        "\"What happened to her. Tell me what happened.\"",
        "\"She's— she's really—\"",
        "\"I just texted her. Five days ago. She didn't respond but I thought—\"",
        "\"I thought she just needed more time.\"",
        "\"I loved her. I know I didn't show it right but I loved her.\""
      ],
      brief: [
        "\"Maya Chen has passed away. This is a death notification.\"",
        "\"Passed— what?\"",
        "\"No. No, that's not— we were going to—\"",
        "\"I was going to fix it. I was going to be better.\"",
        "\"She can't be dead. I wasn't done apologizing.\""
      ]
    },
    delayed: {
      learnedFromOther: {
        michael: [
          "\"Michael told me. Her brother.\"",
          "\"He said it so calmly. Like it was nothing.\"",
          "\"I couldn't— I couldn't say anything.\"",
          "\"Was anyone with her?\""
        ],
        sam: [
          "\"Sam told me. I didn't— I didn't know what to say.\"",
          "\"I saw them together. At the park. Before.\"",
          "\"I should be happy she found someone. I should—\"",
          "\"I'm not.\""
        ]
      }
    },
    followup: {
      asksAbout: ["sam"],
      questions: [
        "\"Was she happy? I just— I need to know she was happy.\"",
        "\"She was with someone, wasn't she? I saw them. I just want to know they loved her.\""
      ]
    }
  },

  jen: {
    immediate: {
      gentle: [
        "\"Maya? Is everything okay?\"",
        "\"What? What do you mean? I just— we just—\"",
        "\"She was at my house. Four days ago. We made plans.\"",
        "\"Michael doesn't know. Oh god, Michael doesn't know. I have to—\"",
        "\"She was bringing someone Sunday. She was finally—\"",
        "\"It was supposed to be happy. It was supposed to be a happy dinner.\""
      ],
      brief: [
        "\"I'm calling to inform you that Maya Chen has died.\"",
        "\"This isn't funny. Who is this?\"",
        "\"...\"",
        "\"Tell me you're lying. Tell me you're a terrible person who's lying to me.\"",
        "\"My husband is downstairs. I have to— I have to tell Michael.\"",
        "\"I have to tell him his sister is dead.\""
      ]
    },
    delayed: {
      learnedFromOther: {
        alice: [
          "\"Alice called me. She was— I couldn't understand her.\"",
          "\"I had to tell Michael. He didn't— he went quiet. He just went so quiet.\"",
          "\"I should have been there. I was supposed to protect her.\""
        ],
        michael: [
          "\"My husband knows his sister is dead and I wasn't the one who told him.\"",
          "\"How did you not call me first? How did you not call US first?\"",
          "\"We were family. We were RIGHT HERE.\""
        ]
      }
    },
    followup: {
      asksAbout: ["sam", "michael"],
      questions: [
        "\"Sunday was supposed to be the day she told Michael. About everything. About who she really loved.\"",
        "\"She was finally going to be honest with everyone. She was finally going to stop hiding.\""
      ]
    }
  },

  michael: {
    immediate: {
      gentle: [
        "\"Yeah?\"",
        "\"Who is this?\"",
        "\"My sister— what about my sister.\"",
        "\"No.\"",
        "\"I just— I was talking to her. I was trying to—\"",
        "\"I told her I was sorry. Did she know I was sorry?\"",
        "\"I need to call my mom. I need to—\"",
        "\"She was coming Sunday. She said yes to Sunday.\""
      ],
      brief: [
        "\"Michael Chen? Maya Chen has been killed.\"",
        "\"Killed?\"",
        "\"What do you mean killed. Someone killed my sister?\"",
        "\"I'll kill them. I'll kill whoever—\"",
        "\"Where is she. Where is my sister.\""
      ]
    },
    delayed: {
      learnedFromOther: {
        jen: [
          "\"Jen told me. My wife told me my sister was dead while I was making coffee.\"",
          "\"She was crying so hard. I thought— I thought something happened to Jen.\"",
          "\"Then I realized she was saying Maya's name.\""
        ],
        alice: [
          "\"My mother called me. She could barely speak.\"",
          "\"I had to put her on speaker because my hands were shaking.\"",
          "\"I should have been a better brother. I should have been there.\""
        ]
      }
    },
    followup: {
      asksAbout: ["david", "sam"],
      questions: [
        "\"She was mad at me. For months. And I never— I never asked why, really why.\"",
        "\"Was she okay? Besides everything. Was she happy? Did she seem happy?\""
      ]
    }
  },

  ruth: {
    immediate: {
      gentle: [
        "The phone rings twice. Then a voice that sounds like home.",
        "\"Wei? Maya ah?\"",
        "\"...this isn't Maya's voice.\"",
        "\"Who is calling my granddaughter's phone?\"",
        "You tell her.",
        "There is a silence worse than crying.",
        "It lasts 8 seconds. It lasts a lifetime.",
        "\"My 寶貝. My baby. My baby girl.\"",
        "\"Her father— I have to tell her father. I have to—\"",
        "\"He's waiting for her. On the other side. He'll take care of her now.\"",
        "\"Come to my house. Bring me her phone. I want to hold what she held.\""
      ],
      brief: [
        "\"I'm calling to notify you that Maya Chen—\"",
        "\"I know who Maya Chen is. She is my 寶貝.\"",
        "\"You don't need to tell me. I can hear it in your voice.\"",
        "\"She's gone.\"",
        "\"I'm 84 years old. I have buried my husband. I will bury my granddaughter.\"",
        "\"Come to my house. I will make soup.\"",
        "\"That is what we do. We make soup. We go on.\""
      ]
    },
    delayed: {
      learnedFromOther: {
        alice: [
          "\"Alice called. My daughter called me crying.\"",
          "\"A mother should not have to bury her child.\"",
          "\"I buried my husband. That was the natural order.\"",
          "\"This is not the natural order.\"",
          "\"Come to my house. I will make the soup I was going to teach Maya.\""
        ],
        michael: [
          "\"Michael came to my door. He was shaking.\"",
          "\"My grandson had to tell me his sister is gone.\"",
          "\"He is not strong enough to carry that.\"",
          "\"No one should have to carry that.\""
        ]
      }
    },
    followup: {
      asksAbout: ["alice", "sam"],
      questions: [
        "\"She was going to bring someone Sunday. A nice friend.\"",
        "\"I want to meet them anyway. Even though she's gone. I want to meet who she loved.\"",
        "\"I want to know who made her smile different.\""
      ]
    }
  },

  marcus: {
    immediate: {
      gentle: [
        "\"Hello?\"",
        "\"I'm sorry, who? Maya's phone?\"",
        "\"Oh god. Oh god. She was supposed to be at the site visit.\"",
        "\"She's always on time. She's never— she wouldn't just—\"",
        "\"I can't— I need to call Elena. I need to—\"",
        "\"She was the best. You know? She was the best of us.\""
      ],
      brief: [
        "\"This is a death notification for your employee Maya Chen.\"",
        "\"...death?\"",
        "\"She's not my employee. She's my— she was—\"",
        "\"I have to cancel the site visit. I have to— what do I do?\"",
        "\"How do I tell people? How do I walk into that office?\""
      ]
    },
    delayed: {
      learnedFromOther: {
        elena: [
          "\"Elena called me. She was crying.\"",
          "\"I thought it was about the project. I thought—\"",
          "\"I should have known when I saw her face.\""
        ]
      }
    },
    followup: {
      asksAbout: ["elena"],
      questions: [
        "\"She had big plans. She was going to change architecture.\"",
        "\"Does her family know? Is there anything we can do?\""
      ]
    }
  },

  elena: {
    immediate: {
      gentle: [
        "\"Maya? Is that you?\"",
        "\"Wait— who? Why do you have Maya's phone?\"",
        "\"What do you mean something happened.\"",
        "\"No. No. We were going to get drinks. She said she had something to tell me Monday.\"",
        "\"She was so happy. She was FINALLY happy. It's not—\"",
        "\"It's not fair. It's not fair.\""
      ],
      brief: [
        "\"Maya Chen has been in a fatal accident.\"",
        "\"Fatal?\"",
        "\"You mean she's—\"",
        "\"Oh my god. I just saw her. I just— yesterday—\"",
        "\"Marcus. Someone has to tell Marcus.\""
      ]
    },
    delayed: {
      learnedFromOther: {
        marcus: [
          "\"Marcus called me. He was— I've never heard him like that.\"",
          "\"I thought it was a mistake. I thought—\"",
          "\"She was going to tell me Monday. About someone. Now I'll never know.\""
        ]
      }
    },
    followup: {
      asksAbout: ["sam"],
      questions: [
        "\"She was so different lately. Good different. Someone made her different.\"",
        "\"I hope they know. Whoever they are. I hope they know what they had.\""
      ]
    }
  },

  ray: {
    immediate: {
      gentle: [
        "\"Hello? Maya?\"",
        "\"...I don't recognize your voice.\"",
        "\"What's happened? Is she okay?\"",
        "You tell him.",
        "\"Her father and I served together. I promised him I'd look after her.\"",
        "\"I failed him. I failed her.\"",
        "\"I'll call Alice. Her mother should have someone.\"",
        "\"I'll go to her. I'll go now.\""
      ],
      brief: [
        "\"I'm calling to notify you about Maya Chen.\"",
        "\"What about her.\"",
        "\"She passed away this morning.\"",
        "\"Passed away.\"",
        "\"She was 34. She was born when I was stationed in Germany. Her father showed me a photo the day she was born.\"",
        "\"He was so proud. He was always so proud.\"",
        "\"I'm an old man. I shouldn't have to bury children.\""
      ]
    },
    delayed: {
      learnedFromOther: {
        alice: [
          "\"Alice called me. I could hear she'd been crying for hours.\"",
          "\"I'm going to her house. I'll make sure she eats.\"",
          "\"That's what James would have wanted.\""
        ]
      }
    },
    followup: {
      asksAbout: ["alice"],
      questions: [
        "\"She was a good tenant. No. She was a good person. The tenant part was just— it was just how I got to know her.\"",
        "\"Take care of that phone. Whatever's on it. It matters to someone.\""
      ]
    }
  }
};

/**
 * NOTIFICATION DETAIL OPTIONS
 * When you call, you choose how much to share.
 */

const NOTIFICATION_OPTIONS = {
  brief: {
    label: "Brief — \"Maya has been in an accident. She didn't make it.\"",
    batteryCost: 2,
    timeCost: 30,
    detail: "brief",
    emotionalWeight: 5
  },
  gentle: {
    label: "Gentle — Prepare them before delivering the news",
    batteryCost: 4,
    timeCost: 90,
    detail: "gentle",
    emotionalWeight: 7
  },
  full: {
    label: "Full — Tell them everything you know about what happened",
    batteryCost: 5,
    timeCost: 120,
    detail: "full",
    emotionalWeight: 9
  }
};

/**
 * CASCADING NOTIFICATIONS
 * When person A is notified and has B in their contacts,
 * there's a chance A will contact B before you can.
 */

const CASCADE_TIMING = {
  alice: {
    targets: ["michael", "ruth"],
    delay: 180,
    probability: 0.9
  },
  michael: {
    targets: ["jen", "alice"],
    delay: 240,
    probability: 0.7
  },
  jen: {
    targets: ["michael"],
    delay: 120,
    probability: 0.95
  },
  sam: {
    targets: ["jen", "alice"],
    delay: 300,
    probability: 0.6
  },
  david: {
    targets: ["michael"],
    delay: 600,
    probability: 0.4
  },
  ruth: {
    targets: ["alice"],
    delay: 600,
    probability: 0.5
  },
  marcus: {
    targets: ["elena"],
    delay: 120,
    probability: 0.9
  },
  elena: {
    targets: ["marcus"],
    delay: 120,
    probability: 0.8
  },
  ray: {
    targets: ["alice"],
    delay: 300,
    probability: 0.7
  }
};

/**
 * DAMAGE CALCULATIONS
 * These determine fallout severity.
 */

const DAMAGE_FACTORS = {
  notified_too_late: {
    threshold: 600,
    severity: "high",
    description: "{name} learned too late. They had to find out from someone else, or from silence that became unbearable."
  },
  learned_from_stranger: {
    condition: "contact learns from someone outside their known network",
    severity: "critical",
    description: "{name} learned from someone they barely know. The intimacy of grief was violated."
  },
  learned_from_wrong_person: {
    condition: "contact learns from someone they have tension with",
    severity: "critical",
    description: "{name} learned from {source}. This will damage their relationship forever."
  },
  notification_order_wrong: {
    pairs: [
      { first: "david", second: "sam", severity: "high", reason: "David, her ex, learned before Sam, who she loved." },
      { first: "marcus", second: "alice", severity: "critical", reason: "Her boss learned before her mother." },
      { first: "elena", second: "ruth", severity: "high", reason: "A colleague learned before her grandmother." },
      { first: "david", second: "ruth", severity: "critical", reason: "Her ex-boyfriend learned before her grandmother." }
    ]
  },
  sam_never_knew_she_loved: {
    condition: "sam is never directly told about the texts, or is notified last",
    severity: "devastating",
    description: "Sam never got to know that Maya was going to tell everyone. That Sunday was supposed to be their day."
  },
  alice_never_knew_who: {
    condition: "alice is never told who Maya was in love with",
    severity: "haunting",
    description: "Alice will always wonder who her daughter was going to tell her about. The mystery will eat at her."
  },
  ruth_alone: {
    condition: "ruth is notified late or impersonally",
    severity: "devastating",
    description: "Po Po, who has buried her husband and now her granddaughter, deserved better than an impersonal call."
  },
  sunday_broken: {
    condition: "game ends without revealing Maya's plans for Sunday",
    severity: "thematic",
    description: "Sunday was going to be the day. Dinner at Jen's. Soup with Po Po. Wine with Sam. The day Maya Chen was going to stop hiding."
  }
};

/**
 * GAME CONFIGURATION
 */

const GAME_CONFIG = {
  startingBattery: 31,
  batteryDrain: {
    idle: 0.1,
    readText: 1,
    readPage: 0.5,
    callConnect: 1,
    callBrief: 2,
    callGentle: 4,
    callFull: 5
  },
  timeLimit: 3600,
  contacts: Object.keys(CONTACTS),
  phases: ["discovery", "notification", "fallout"],
  discoveryTimeLimit: 900,
  minNotificationsBeforeFallout: 3,
  maxNotificationsBeforeBatteryDeath: 8,
  cascadeCheckInterval: 30
};

/**
 * Get a contact's display info.
 */
function getContactDisplay(contactId) {
  const contact = CONTACTS[contactId];
  if (!contact) return null;
  return {
    name: contact.name || contact.phone,
    phone: contact.phone,
    group: contact.group,
    relation: contact.relation
  };
}

/**
 * Get unread thread count for a contact.
 */
function getUnreadCount(contactId, readThreads) {
  const thread = TEXT_THREADS[contactId];
  if (!thread) return 0;
  const readPages = readThreads[contactId] || 0;
  return Math.max(0, thread.pages.length - readPages);
}
