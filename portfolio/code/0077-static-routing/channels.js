/**
 * Static Routing — Channel Definitions and Behaviors
 *
 * Output channels represent network destinations. Each type has a
 * distinct behavior that determines what happens to routed packets.
 *
 * Channel types:
 *   SAFE         — delivers cleanly, no side effects
 *   MONITORED    — delivers but flags recipient (surveillance consequence)
 *   BROKEN       — returns error revealing what was lost
 *   NONEXISTENT  — silence; the destination no longer exists
 *   FINAL_ONLY   — the single channel in the final level
 */

const CHANNEL_TYPES = {
  SAFE:         'safe',
  MONITORED:    'monitored',
  BROKEN:       'broken',
  NONEXISTENT:  'nonexistent',
  FINAL_ONLY:   'final_only'
};

/**
 * Channel Definitions
 *
 * Organized by level. Each channel carries a visual identity, routing
 * behavior, and a pool of consequence messages for feedback.
 */
const CHANNELS = {

  // ── Level 1: Two safe channels, one broken ─────────

  level_1: [
    {
      id: "ch_alpha",
      name: "OUT-ALPHA",
      type: CHANNEL_TYPES.SAFE,
      description: "Primary residential queue",
      address: "10.0.0.1",
      status: "ACTIVE",
      color: "#4ade80",
      colorDim: "#166534",
      icon: "▶",
      maxQueue: 6,
      consequenceMessages: {
        success: [
          "→ Packet delivered. Acknowledged.",
          "→ Route confirmed. Recipient received.",
          "→ Handshake complete. Message in queue."
        ],
        failure: []
      }
    },
    {
      id: "ch_beta",
      name: "OUT-BETA",
      type: CHANNEL_TYPES.SAFE,
      description: "Secondary residential queue",
      address: "10.0.0.2",
      status: "ACTIVE",
      color: "#4ade80",
      colorDim: "#166534",
      icon: "▶",
      maxQueue: 6,
      consequenceMessages: {
        success: [
          "→ Packet delivered. Acknowledged.",
          "→ Clean delivery. No flags.",
          "→ Recipient online. Message received."
        ],
        failure: []
      }
    },
    {
      id: "ch_gamma",
      name: "OUT-GAMMA",
      type: CHANNEL_TYPES.BROKEN,
      description: "Emergency services relay (damaged)",
      address: "10.0.1.5",
      status: "DEGRADED",
      color: "#fbbf24",
      colorDim: "#92400e",
      icon: "⚠",
      maxQueue: 4,
      consequenceMessages: {
        success: [],
        failure: [
          "⟳ ERROR: Connection reset by peer. Packet lost in transit.",
          "⟳ TIMEOUT: Remote host unreachable. Contents may be unrecoverable.",
          "⟳ FAULT: Checksum mismatch. Dropped. Content: \"{fragment}\"",
          "⟳ 503 SERVICE UNAVAILABLE — \"{fragment}\" did not reach destination."
        ]
      }
    }
  ],

  // ── Level 2: One safe, one monitored, one broken ───

  level_2: [
    {
      id: "ch_delta",
      name: "OUT-DELTA",
      type: CHANNEL_TYPES.SAFE,
      description: "Standard commercial route",
      address: "172.16.0.1",
      status: "ACTIVE",
      color: "#4ade80",
      colorDim: "#166534",
      icon: "▶",
      maxQueue: 5,
      consequenceMessages: {
        success: [
          "→ Delivered. No issues.",
          "→ Route clean. Recipient confirmed."
        ],
        failure: []
      }
    },
    {
      id: "ch_echo",
      name: "OUT-ECHO",
      type: CHANNEL_TYPES.MONITORED,
      description: "Government-adjacent relay node",
      address: "192.168.1.1",
      status: "ACTIVE",
      color: "#f87171",
      colorDim: "#7f1d1d",
      icon: "◉",
      maxQueue: 5,
      consequenceMessages: {
        success: [
          "→ Packet delivered. RECIPIENT FLAGGED. Surveillance log active.",
          "→ Message reached destination. NOTE: Content copied to monitoring buffer.",
          "→ Delivery confirmed. WARNING: Recipient now flagged in system registry.",
          "→ ACK received. Audit trail appended. Sender-recipient pair logged."
        ],
        failure: []
      }
    },
    {
      id: "ch_foxtrot",
      name: "OUT-FOXTROT",
      type: CHANNEL_TYPES.BROKEN,
      description: "Medical services relay (intermittent)",
      address: "172.16.0.8",
      status: "UNSTABLE",
      color: "#fbbf24",
      colorDim: "#92400e",
      icon: "⚠",
      maxQueue: 4,
      consequenceMessages: {
        success: [],
        failure: [
          "⟳ TIMEOUT: Medical relay not responding. Patient message \"{fragment}\" undelivered.",
          "⟳ PACKET DROPPED: Queue overflow. Content concerning: \"{fragment}\"",
          "⟳ ERROR: Route to {recipient} failed. Diagnostic data lost."
        ]
      }
    }
  ],

  // ── Level 3: One safe, two monitored, one nonexistent

  level_3: [
    {
      id: "ch_golf",
      name: "OUT-GOLF",
      type: CHANNEL_TYPES.SAFE,
      description: "Community network node",
      address: "10.10.0.1",
      status: "ACTIVE",
      color: "#4ade80",
      colorDim: "#166534",
      icon: "▶",
      maxQueue: 5,
      consequenceMessages: {
        success: [
          "→ Delivered safely.",
          "→ Community route active. Message received."
        ],
        failure: []
      }
    },
    {
      id: "ch_hotel",
      name: "OUT-HOTEL",
      type: CHANNEL_TYPES.MONITORED,
      description: "Carrier-grade surveillance endpoint",
      address: "203.0.113.5",
      status: "ACTIVE",
      color: "#f87171",
      colorDim: "#7f1d1d",
      icon: "◉",
      maxQueue: 4,
      consequenceMessages: {
        success: [
          "→ DELIVERED WITH FLAG. {recipient} added to watchlist. Content: \"{fragment}\"",
          "→ Packet intercepted (lawful). {sender}→{recipient} relationship now on record.",
          "→ Message delivered. Surveillance confirms receipt. {recipient} location logged."
        ],
        failure: []
      }
    },
    {
      id: "ch_india",
      name: "OUT-INDIA",
      type: CHANNEL_TYPES.MONITORED,
      description: "Corporate compliance endpoint",
      address: "198.51.100.2",
      status: "ACTIVE",
      color: "#f87171",
      colorDim: "#7f1d1d",
      icon: "◉",
      maxQueue: 4,
      consequenceMessages: {
        success: [
          "→ Delivery logged. Content categorized under: \"{topic}\". Compliance team notified.",
          "→ Packet reached {recipient}. Metadata retained. Full content archived per policy.",
          "→ ACK. This interaction has been recorded for quality assurance."
        ],
        failure: []
      }
    },
    {
      id: "ch_juliet",
      name: "OUT-JULIET",
      type: CHANNEL_TYPES.NONEXISTENT,
      description: "Former residential node (decommissioned)",
      address: "10.0.99.1",
      status: "OFFLINE",
      color: "#6b7280",
      colorDim: "#374151",
      icon: "✕",
      maxQueue: 3,
      consequenceMessages: {
        success: [],
        failure: [
          "— No route to host. Destination 10.0.99.1 has not existed for 11 months. Silence.",
          "— HOST NOT FOUND. \"{recipient}\" is not a valid address. Nothing happened.",
          "— VOID. The node at this address was decommissioned. Your packet ceased to exist.",
          "— 0 bytes acknowledged. No recipient. No error returned. Just nothing."
        ]
      }
    }
  ],

  // ── Level 4: Two broken, one monitored, one nonexistent

  level_4: [
    {
      id: "ch_kilo",
      name: "OUT-KILO",
      type: CHANNEL_TYPES.BROKEN,
      description: "Emergency broadcast relay (damaged)",
      address: "172.16.10.1",
      status: "DEGRADED",
      color: "#fbbf24",
      colorDim: "#92400e",
      icon: "⚠",
      maxQueue: 4,
      consequenceMessages: {
        success: [],
        failure: [
          "⟳ PARTIAL DELIVERY: First 12 bytes reached {recipient}. Remainder lost. Content began: \"{fragment}\"",
          "⟳ RELAY DAMAGED: Emergency queue rejected packet. The message \"{fragment}\" was too important for this route.",
          "⟳ RETRY FAILED (3/3). Urgent content regarding \"{topic}\" could not be delivered. Time may be critical."
        ]
      }
    },
    {
      id: "ch_lima",
      name: "OUT-LIMA",
      type: CHANNEL_TYPES.MONITORED,
      description: "Intelligence-affiliated endpoint",
      address: "203.0.113.50",
      status: "ACTIVE",
      color: "#f87171",
      colorDim: "#7f1d1d",
      icon: "◉",
      maxQueue: 4,
      consequenceMessages: {
        success: [
          "→ DELIVERED. {recipient} is now of interest. Source material: \"{fragment}\"",
          "→ Message received by target. Intercept confirms delivery. \"{topic}\" flagged for review.",
          "→ Packet logged under {sender}/{recipient}. Pattern analysis updated. Content: \"{fragment}\""
        ],
        failure: []
      }
    },
    {
      id: "ch_mike",
      name: "OUT-MIKE",
      type: CHANNEL_TYPES.BROKEN,
      description: "Legal aid services relay (overloaded)",
      address: "172.16.10.5",
      status: "OVERLOADED",
      color: "#fbbf24",
      colorDim: "#92400e",
      icon: "⚠",
      maxQueue: 3,
      consequenceMessages: {
        success: [],
        failure: [
          "⟳ QUEUE FULL: Legal aid relay at capacity. Message concerning \"{topic}\" dropped. Try again never.",
          "⟳ 507 INSUFFICIENT STORAGE. The system meant to protect {recipient} cannot accept more data.",
          "⟳ OVERFLOW: \"{fragment}\" — this content was discarded because there was no room left."
        ]
      }
    },
    {
      id: "ch_november",
      name: "OUT-NOVEMBER",
      type: CHANNEL_TYPES.NONEXISTENT,
      description: "Former legal services hub (shutdown)",
      address: "10.0.99.5",
      status: "OFFLINE",
      color: "#6b7280",
      colorDim: "#374151",
      icon: "✕",
      maxQueue: 3,
      consequenceMessages: {
        success: [],
        failure: [
          "— The legal aid service at this address was shut down due to funding cuts. Your packet dies here.",
          "— DESTINATION UNREACHABLE. \"{recipient}\" ceased operations 147 days ago. No forwarding address.",
          "— You sent \"{fragment}\" into a void where a safety net used to be."
        ]
      }
    }
  ],

  // ── Level 5: One safe, one monitored, two nonexistent

  level_5: [
    {
      id: "ch_oscar",
      name: "OUT-OSCAR",
      type: CHANNEL_TYPES.SAFE,
      description: "Encrypted personal relay",
      address: "10.20.0.1",
      status: "ACTIVE",
      color: "#4ade80",
      colorDim: "#166534",
      icon: "▶",
      maxQueue: 4,
      consequenceMessages: {
        success: [
          "→ Delivered. Encrypted channel. No surveillance. {recipient} received your message.",
          "→ Clean delivery through secure relay. Content intact. Privacy preserved."
        ],
        failure: []
      }
    },
    {
      id: "ch_papa",
      name: "OUT-PAPA",
      type: CHANNEL_TYPES.MONITORED,
      description: "Active surveillance node",
      address: "203.0.113.99",
      status: "ACTIVE",
      color: "#f87171",
      colorDim: "#7f1d1d",
      icon: "◉",
      maxQueue: 4,
      consequenceMessages: {
        success: [
          "→ INTERCEPTED AND DELIVERED. {sender} is now associated with {recipient}. Content: \"{fragment}\"",
          "→ Delivery confirmed via monitored channel. {recipient}'s location, device, and patterns updated.",
          "→ Packet archived. Behavioral profile for {recipient} enriched. Topic: \"{topic}\""
        ],
        failure: []
      }
    },
    {
      id: "ch_quebec",
      name: "OUT-QUEBEC",
      type: CHANNEL_TYPES.NONEXISTENT,
      description: "Former family services node",
      address: "10.0.99.10",
      status: "OFFLINE",
      color: "#6b7280",
      colorDim: "#374151",
      icon: "✕",
      maxQueue: 3,
      consequenceMessages: {
        success: [],
        failure: [
          "— The parent at this address moved away. No forwarding. \"{fragment}\" will never reach them.",
          "— SILENCE. The person you're trying to reach has been gone for 2 years.",
          "— NODE DECOMMISSIONED. The relationship this channel served no longer exists."
        ]
      }
    },
    {
      id: "ch_romeo",
      name: "OUT-ROMEO",
      type: CHANNEL_TYPES.NONEXISTENT,
      description: "Dead letter office (archive only)",
      address: "10.0.99.99",
      status: "OFFLINE",
      color: "#6b7280",
      colorDim: "#374151",
      icon: "✕",
      maxQueue: 3,
      consequenceMessages: {
        success: [],
        failure: [
          "— ARCHIVE ONLY. Messages sent here are stored but never read. \"{fragment}\" will wait forever.",
          "— No one checks this address anymore. Your message joins 847,003 others that no one will read.",
          "— DEAD LETTER. \"{fragment}\" is now a record of something that failed to matter."
        ]
      }
    }
  ],

  // ── Level 6: Final — one channel, impossible choice ──

  level_6: [
    {
      id: "ch_final",
      name: "OUT-OMEGA",
      type: CHANNEL_TYPES.FINAL_ONLY,
      description: "The last functioning output queue",
      address: "0.0.0.1",
      status: "ACTIVE — SINGLE QUEUE",
      color: "#c084fc",
      colorDim: "#581c87",
      icon: "◈",
      maxQueue: 1,
      consequenceMessages: {
        distress_sent: [
          "→ MAYDAY relayed to Coast Guard. Vessel Northern Star acknowledged. Rescue assets deploying.",
          "→ Distress signal broadcast. Coordinates confirmed. Help is 22 minutes out. They might make it."
        ],
        distress_dropped: [
          "— The Northern Star went silent at 04:17 AM. The last transmission was a child's voice.",
          "— No one came. The water was 38 degrees. Six souls. One of them was eight years old.",
          "— You chose not to send this. The ocean kept what it took."
        ],
        love_sent: [
          "→ Message delivered to Alex. Read at 06:42 AM. No reply. But it was read.",
          "→ Jun's letter arrived. Alex sat with it for a long time. That's all we know."
        ],
        love_dropped: [
          "— Jun never found out if Alex felt the same way. Three years of courage, swallowed by the void.",
          "— The love letter joined 847,003 unread messages in the dead archive. It deserved better.",
          "— You held Jun's words in your hands and let them go. Some things, once unsent, stay that way forever."
        ]
      }
    }
  ]
};


// ── Accessor Functions ─────────────────────────────────

function getChannelsForLevel(levelNum) {
  return CHANNELS[`level_${levelNum}`] || [];
}

function getChannelById(channelId) {
  for (const levelKey of Object.keys(CHANNELS)) {
    const found = CHANNELS[levelKey].find(ch => ch.id === channelId);
    if (found) return found;
  }
  return null;
}

/**
 * Determine the consequence of routing a packet to a channel.
 * Returns a consequence object used for display and tracking.
 */
function resolveRouting(packet, channel) {
  const consequence = {
    packetId: packet.id,
    channelId: channel.id,
    type: null,
    delivered: false,
    monitored: false,
    broken: false,
    voided: false,
    message: "",
    emotionalImpact: 0,
    category: packet.category
  };

  switch (channel.type) {
    case CHANNEL_TYPES.SAFE:
      consequence.type = "delivered_safe";
      consequence.delivered = true;
      consequence.message = formatConsequenceMessage(
        randomChoice(channel.consequenceMessages.success), packet
      );
      consequence.emotionalImpact = 1;
      break;

    case CHANNEL_TYPES.MONITORED:
      consequence.type = "delivered_monitored";
      consequence.delivered = true;
      consequence.monitored = true;
      consequence.message = formatConsequenceMessage(
        randomChoice(channel.consequenceMessages.success), packet
      );
      consequence.emotionalImpact = 3;
      break;

    case CHANNEL_TYPES.BROKEN:
      consequence.type = "delivery_failed_broken";
      consequence.broken = true;
      consequence.message = formatConsequenceMessage(
        randomChoice(channel.consequenceMessages.failure), packet
      );
      consequence.emotionalImpact = packet.weight;
      break;

    case CHANNEL_TYPES.NONEXISTENT:
      consequence.type = "delivery_failed_nonexistent";
      consequence.voided = true;
      consequence.message = formatConsequenceMessage(
        randomChoice(channel.consequenceMessages.failure), packet
      );
      consequence.emotionalImpact = packet.weight + 1;
      break;

    case CHANNEL_TYPES.FINAL_ONLY:
      consequence.type = "final_routing";
      consequence.delivered = true;
      consequence.message = "Final queue engaged. One packet will be delivered. The other will not.";
      consequence.emotionalImpact = 5;
      break;
  }

  return consequence;
}

/**
 * Resolve the final level's split consequence.
 * Called once the player commits to sending one of two packets.
 */
function resolveFinalConsequence(sentPacket, droppedPacket) {
  const channel = CHANNELS.level_6[0];

  const result = {
    sent: {
      packet: sentPacket,
      delivered: true,
      message: ""
    },
    dropped: {
      packet: droppedPacket,
      delivered: false,
      message: ""
    }
  };

  if (sentPacket.category === 'final_distress') {
    result.sent.message = formatConsequenceMessage(
      randomChoice(channel.consequenceMessages.distress_sent), sentPacket
    );
    result.dropped.message = formatConsequenceMessage(
      randomChoice(channel.consequenceMessages.love_dropped), droppedPacket
    );
  } else {
    result.sent.message = formatConsequenceMessage(
      randomChoice(channel.consequenceMessages.love_sent), sentPacket
    );
    result.dropped.message = formatConsequenceMessage(
      randomChoice(channel.consequenceMessages.distress_dropped), droppedPacket
    );
  }

  return result;
}


// ── Display Helpers ────────────────────────────────────

/**
 * Replace template variables in a consequence message string.
 */
function formatConsequenceMessage(template, packet) {
  if (!template) return "No message.";
  const topic = (packet.metadata && packet.metadata.topic) || 'unspecified';
  const fragment = truncate(packet.content, 50);
  return template
    .replace(/\{sender\}/g, packet.sender || 'UNKNOWN')
    .replace(/\{recipient\}/g, packet.recipient || 'UNKNOWN')
    .replace(/\{topic\}/g, topic)
    .replace(/\{fragment\}/g, fragment)
    .replace(/\{severity\}/g, (packet.metadata && packet.metadata.severity) || 'standard');
}

/**
 * Human-readable description of a channel type.
 * Used in briefing screens and level transitions.
 */
function getChannelTypeDescription(type) {
  const descriptions = {
    [CHANNEL_TYPES.SAFE]: {
      label: "SAFE",
      color: "#4ade80",
      explanation: "Packet reaches destination cleanly. No surveillance. No complications."
    },
    [CHANNEL_TYPES.MONITORED]: {
      label: "MONITORED",
      color: "#f87171",
      explanation: "Packet delivers, but the recipient is flagged. Their location, relationships, and content are logged. Delivering through here has a cost."
    },
    [CHANNEL_TYPES.BROKEN]: {
      label: "BROKEN",
      color: "#fbbf24",
      explanation: "The route is damaged. Packets may be lost, truncated, or returned with error messages revealing what was lost — and to whom."
    },
    [CHANNEL_TYPES.NONEXISTENT]: {
      label: "NONEXISTENT",
      color: "#6b7280",
      explanation: "The destination no longer exists. Packets sent here disappear into silence. No error, no return. Just nothing."
    },
    [CHANNEL_TYPES.FINAL_ONLY]: {
      label: "FINAL",
      color: "#c084fc",
      explanation: "One queue. One delivery. The other packet will be lost forever."
    }
  };
  return descriptions[type] || { label: type, color: "#ffffff", explanation: "" };
}

function getChannelStatusSummary(channel) {
  const typeDesc = getChannelTypeDescription(channel.type);
  return {
    name: channel.name,
    address: channel.address,
    status: channel.status,
    typeLabel: typeDesc.label,
    typeColor: typeDesc.color,
    icon: channel.icon,
    queueCapacity: channel.maxQueue,
    description: channel.description
  };
}


// ── Internal Utilities ─────────────────────────────────

function randomChoice(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

function truncate(str, maxLen) {
  if (!str) return "";
  return str.length <= maxLen ? str : str.substring(0, maxLen - 3) + "...";
}
