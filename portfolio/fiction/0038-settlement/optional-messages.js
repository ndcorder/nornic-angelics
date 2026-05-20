/**
 * optional-messages.js
 * Messages for the "Optional message to injured party" textarea.
 * Escalates from professional boilerplate to personal confession.
 * After message 10, the field is empty — he's said everything.
 */

const OPTIONAL_MESSAGES = [
  // Message 1 — Generation 1
  // Pure boilerplate. Indistinguishable from any lawyer's note.
  "We understand this has been a difficult time for you and your family. Please don't hesitate to reach out if you have any questions about the enclosed.",

  // Message 2 — Generation 2
  // Slightly warmer. "Patience" is loaded but the reader cannot yet know why.
  "I wanted to add a personal note — these cases take longer than anyone wants. Your patience does not go unnoticed.",

  // Message 3 — Generation 3
  // First crack. A lawyer shouldn't think about cases outside office hours.
  // "Details" is deliberate — he's thinking about specific details of a specific case.
  "Some cases stay with you longer than others. I find myself thinking about the details of your situation outside of office hours. This is not a burden — simply an acknowledgment that what happened to you matters.",

  // Message 4 — Generation 4
  // No longer about a generic client. "What happened to you was not a loss."
  // Self-awareness about form letters — first meta-layer. He knows what he's doing.
  "There are moments in this work where I wish the law had a different vocabulary. The words we use — 'damages,' 'liability,' 'loss' — they flatten something that should never be flattened. What happened to you was not a loss. It was a catastrophe, and I'm sorry if my form letters make it feel otherwise.",

  // Message 5 — Generation 5
  // "Backyard pool" — the key detail. The reader should now sense a specific event.
  // "Negligence" is used outside its legal meaning. He's redefining the word.
  "I've practiced law in this town for twenty-two years. I believed I understood what negligence meant. I was wrong. Negligence is not a legal concept. It is a failure of attention that occurs in the space between seeing and not-seeing, and that space is smaller than anyone imagines. Smaller than the length of a backyard pool.",

  // Message 6 — Generation 6
  // "Anoxic injury after submersion" — specific medical language. Lily's case.
  // "Someone had acted sooner" — he means himself. Pivot to "changed anything for me."
  "You asked me once if I thought the outcome would have been different if someone had acted sooner. I gave you an honest legal answer: probably not. The medical literature on anoxic injury after submersion is not encouraging. But that is not the answer that keeps me up. What keeps me up is a different question: whether acting sooner would have changed anything for me.",

  // Message 7 — Generation 7
  // Full sensory recall. He was there. The grill, the paper plate, the pool.
  // Frantic, compulsive repetition of "I remember." He's been replaying this every night.
  "I was standing near the grill. I remember the smell. I remember holding a paper plate — white, with a decorative border. I remember looking toward the pool at least twice. I remember thinking a child was playing a game. I remember how long the game went on. I remember exactly how long. I will never not remember how long.",

  // Message 8 — Generation 8
  // Closest to a full confession. He's done detective work on his own negligence.
  // Photo numbers, seconds counted, the pretense for obtaining images.
  // Flat factual tone — he's rehearsed this until all feeling has been ironed out.
  "Ninety-three seconds. I have reconstructed the timeline from photographs taken at the party — I asked Rick Baldacci for copies under the pretense of reviewing the property line dispute. In photo 17, she is surface-visible at the pool's center. In photo 24, taken 93 seconds later, Donna Baldacci is pulling her from the water. In the seven photographs between, I am visible in the background of four. I am facing the pool. I am holding a paper plate.",

  // Message 9 — Generation 9
  // He names Karen. The mask drops. He acknowledges these letters are never sent.
  // "Your daughter would be eight now." "I was preventable."
  "Karen — I know this will never reach you, because I will never send these letters, because a letter is not what you need and I am not who should be writing it — your daughter would be eight now. I've driven past the rehabilitation facility. Once. I didn't go in. I don't have the right. But I wanted you to know that someone in this town remembers that she is there, and that what happened to her was not God's will or an unavoidable accident or a statistical tragedy. It was preventable. I was preventable. I'm sorry this is the only place I can say so.",

  // Message 10 — Generation 10
  // The full weight. The pool is gone. He is the sole witness to his own failure.
  // "A man who had taken an oath" — his oath as an attorney.
  // "The final negligence" — redefines the word as failing to remember.
  "The pool has been taken down. Rick Baldacci dismantled it in August. I suppose they couldn't stand to look at it. The yard is just grass now. If you didn't know, you'd never know. I drive past that yard almost every day on my way to the office. I always look. I always see nothing. I understand that this is what the rest of my life will be — looking at the place where something happened and seeing nothing, and knowing that I am the only person in this town who sees what is no longer there. A child floated face-down in three feet of water, and a man who had taken an oath to protect people stood eleven steps away and did not move, and the world continued as if nothing had happened, because for everyone else, nothing did. I am the only custodian of this event. I carry it alone. I will carry it until I am beneath the grass myself, and then no one will remember, and that will be the final negligence — the one I commit against her memory, the one for which there is no form letter, no legal vocabulary, no file to close."
];


/**
 * Get the optional message for the current generation.
 * Returns empty string after all messages have been shown.
 * @param {number} generation — which generation we're on (1-indexed)
 * @returns {string} The message text, or empty string if done
 */
function getOptionalMessage(generation) {
  if (generation < 1 || generation > OPTIONAL_MESSAGES.length) {
    return "";
  }
  return OPTIONAL_MESSAGES[generation - 1];
}

/**
 * Returns true if there are still messages remaining to show.
 * @param {number} generation — current generation (1-indexed)
 * @returns {boolean}
 */
function hasRemainingMessages(generation) {
  return generation <= OPTIONAL_MESSAGES.length;
}
