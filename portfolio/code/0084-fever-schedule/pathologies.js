/**
 * pathologies.js — Disease profiles for calendar transformation
 *
 * Each pathology is a complete worldview. The flu reads differently
 * than chronic illness reads differently than a manic-depressive cycle.
 * The vocabulary, severity, and arc of transformation live here.
 *
 * Each pathology provides:
 *   - vocabulary: word pools keyed by event type
 *   - severity: time-of-day weightings
 *   - weekIntensity: day-of-week weightings
 *   - transform(event): produces the new title
 *
 * The same event always produces the same translation (deterministic hash).
 */

/**
 * Simple deterministic hash for consistent vocabulary assignment.
 * Same event title + UID always yields the same index.
 */
function hashString(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * FLU — Acute, peaking, breaking.
 *
 * Calendar becomes a fever that rises through the week and crashes
 * by Friday. Standups are morning nausea. All-hands are temperature
 * spikes. Recurring events are the reliable return of symptoms.
 */
const flu = {
  id: 'flu',
  name: 'The Flu',
  description: 'Acute. Peaking. Breaking. Your schedule is a fever that rises through the week.',
  icon: '🌡️',

  vocabulary: {
    standup: {
      primary: ['Morning Nausea', 'Gag Reflex', 'Daily Malaise', 'Early Retching', 'AM Discomfort'],
      modifier: ['Persistent', 'Grinding', 'Relentless', 'Dull'],
    },
    'one-on-one': {
      primary: ['Consultation', 'Examination', 'Palliative Care', 'Bedside Visit', 'Triage'],
      modifier: ['Routine', 'Follow-up', 'Urgent', 'Quiet'],
    },
    'small-meeting': {
      primary: ['Cluster Headache', 'Localized Pain', 'Pressure Point', 'Tender Lymph Node'],
      modifier: ['Throbbing', 'Sharp', 'Dull', 'Radiating'],
    },
    meeting: {
      primary: ['Fever Dream', 'Hot Flash', 'Temperature Spike', 'Inflammation', 'Heat Exhaustion'],
      modifier: ['Acute', 'Sudden', 'Deep', 'Widespread'],
    },
    'all-hands': {
      primary: ['Febrile Seizure', 'Thermal Crisis', 'Spiking Fever', 'Convulsion', 'Core Temperature Critical'],
      modifier: ['Severe', 'Alarming', 'Intense', 'Full-Body'],
    },
    focus: {
      primary: ['Remission', 'Moment of Clarity', 'Fever Break', 'Brief Respite', 'Lull'],
      modifier: ['Quiet', 'Temporary', 'Precious', 'Ephemeral'],
    },
    deadline: {
      primary: ['Crisis Point', 'Emergency', 'Acute Episode', 'Climax', 'Turning Point'],
      modifier: ['Critical', 'Imminent', 'Severe', 'Peak'],
    },
    social: {
      primary: ['Contagion Risk', 'Exposure Event', 'Infection Window', 'Transmission Opportunity'],
      modifier: ['Dangerous', 'Inadvisable', 'Reckless', 'Brave'],
    },
    absence: {
      primary: ['Quarantine', 'Isolation Ward', 'Sick Leave', 'Bed Rest', 'Recovery Bay'],
      modifier: ['Mandatory', 'Complete', 'Strict', 'Total'],
    },
    milestone: {
      primary: ['Incubation Complete', 'Contagion Peak', 'Day of Symptoms', 'Diagnostic Milestone'],
      modifier: ['Notable', 'Marked', 'Significant'],
    },
    event: {
      primary: ['Symptom', 'Discomfort', 'Onset', 'Episode', 'Affliction'],
      modifier: ['New', 'Familiar', 'Strange', 'Persistent'],
    },
  },

  severity: {
    'early-morning': 0.9,
    morning: 0.8,
    midday: 0.6,
    afternoon: 0.5,
    evening: 0.3,
    night: 0.4,
  },

  // Flu intensity: builds through the week, peaks Wednesday/Thursday, breaks Friday
  weekIntensity: {
    Monday: 0.4,
    Tuesday: 0.6,
    Wednesday: 0.8,
    Thursday: 0.95,
    Friday: 0.5,
    Saturday: 0.2,
    Sunday: 0.15,
  },

  transform(event) {
    const type = event.eventType;
    const vocab = this.vocabulary[type] || this.vocabulary.event;
    const timeSeverity = this.severity[event.timeOfDay] || 0.5;
    const dayIntensity = this.weekIntensity[event.dayOfWeek] || 0.5;

    const primaryIndex = hashString(event.uid + event.summary) % vocab.primary.length;
    let primary = vocab.primary[primaryIndex];

    // Recurring events get a relapsing prefix
    if (event.recurrence.isRecurring) {
      const chronicPrefixes = ['Relapsing', 'Recurring', 'Returning', 'Familiar'];
      const prefixIndex = hashString(event.uid) % chronicPrefixes.length;
      primary = `${chronicPrefixes[prefixIndex]} ${primary}`;
    }

    // High-intensity moments get severity modifiers
    const combinedIntensity = (timeSeverity + dayIntensity) / 2;
    if (combinedIntensity > 0.75 && vocab.modifier) {
      const modIndex = hashString(event.uid + 'mod') % vocab.modifier.length;
      primary = `${vocab.modifier[modIndex]} ${primary}`;
    }

    // Duration escalates
    if (event.durationMinutes > 90) {
      primary = `Prolonged ${primary}`;
    } else if (event.durationMinutes > 60) {
      primary = `Extended ${primary}`;
    }

    // All-day events are full systemic episodes
    if (event.isAllDay) {
      primary = primary.replace('Moment of', 'Day of').replace('Brief', 'Full-Day');
    }

    return primary;
  },
};

/**
 * CHRONIC — Grinding, persistent, flaring.
 *
 * The calendar is a body that has learned to live with pain.
 * Recurring events are conditions you manage, not cure.
 * Meetings are flare-ups. Focus time is the space between episodes.
 */
const chronic = {
  id: 'chronic',
  name: 'Chronic Illness',
  description: 'Grinding. Persistent. Flaring. You manage it. It does not go away.',
  icon: '🦴',

  vocabulary: {
    standup: {
      primary: ['Morning Stiffness', 'Joint Pain (AM)', 'Chronic Fatigue', 'Daily Limitation', 'Early Discomfort'],
      modifier: ['Manageable', 'Typical', 'Unyielding', 'Endemic'],
    },
    'one-on-one': {
      primary: ['Pain Assessment', 'Symptom Review', 'Condition Management', 'Care Plan Review', 'Monitoring Visit'],
      modifier: ['Scheduled', 'Routine', 'Biweekly', 'Quarterly'],
    },
    'small-meeting': {
      primary: ['Localized Flare-Up', 'Joint Inflammation', 'Soft Tissue Pain', 'Regional Discomfort'],
      modifier: ['Moderate', 'Typical', 'Expected', 'Notable'],
    },
    meeting: {
      primary: ['Systemic Flare', 'Widespread Pain', 'General Malaise', 'Chronic Episode', 'Symptom Surge'],
      modifier: ['Moderate', 'Severe', 'Fibromyalgic', 'Rheumatic'],
    },
    'all-hands': {
      primary: ['Full-Body Flare', 'Autoimmune Crisis', 'Systemic Eruption', 'Total Body Onset', 'Network Failure'],
      modifier: ['Acute-on-Chronic', 'Exacerbated', 'Critical', 'Debilitating'],
    },
    focus: {
      primary: ['Remission Window', 'Pain-Free Interval', 'Between Flares', 'Good Hours', 'Functional Period'],
      modifier: ['Brief', 'Unexpected', 'Grateful', 'Hard-Won'],
    },
    deadline: {
      primary: ['Flare-Up Trigger', 'Stress Response', 'Crisis Exacerbation', 'Condition Worsening'],
      modifier: ['Inevitable', 'Predictable', 'Dangerous', 'Feared'],
    },
    social: {
      primary: ['Spoon Deficit', 'Energy Debt', 'Social Tax', 'Recovery Debt', 'Pacing Violation'],
      modifier: ['Costly', 'Expensive', 'Taxing', 'Depleting'],
    },
    absence: {
      primary: ['Flare-Up Day', 'Bed Bound', 'Recovery Day', 'Rest Required', 'Symptom Management'],
      modifier: ['Complete', 'Necessary', 'Non-Negotiable', 'Mandatory'],
    },
    milestone: {
      primary: ['Condition Anniversary', 'Diagnostic Checkpoint', 'Treatment Milestone', 'Management Review'],
      modifier: ['Significant', 'Marked', 'Ongoing', 'Continuing'],
    },
    event: {
      primary: ['Symptom', 'Flare-Up', 'Pain Point', 'Episode', 'Setback'],
      modifier: ['New', 'Familiar', 'Worsening', 'Stable'],
    },
  },

  severity: {
    'early-morning': 0.85,
    morning: 0.8,
    midday: 0.6,
    afternoon: 0.5,
    evening: 0.4,
    night: 0.3,
  },

  // Chronic illness: steady grind, worse at week transitions
  weekIntensity: {
    Monday: 0.7,
    Tuesday: 0.5,
    Wednesday: 0.5,
    Thursday: 0.55,
    Friday: 0.65,
    Saturday: 0.3,
    Sunday: 0.25,
  },

  transform(event) {
    const type = event.eventType;
    const vocab = this.vocabulary[type] || this.vocabulary.event;

    const primaryIndex = hashString(event.uid + event.summary) % vocab.primary.length;
    let primary = vocab.primary[primaryIndex];

    // Recurring events are "managed conditions"
    if (event.recurrence.isRecurring) {
      const managedPrefixes = ['Managed', 'Ongoing', 'Known', 'Diagnosed'];
      const prefixIndex = hashString(event.uid) % managedPrefixes.length;
      primary = `${managedPrefixes[prefixIndex]} ${primary}`;
    }

    // Time-based severity modifiers
    const timeSeverity = this.severity[event.timeOfDay] || 0.5;
    if (timeSeverity > 0.7 && vocab.modifier) {
      const modIndex = hashString(event.uid + 'mod') % vocab.modifier.length;
      primary = `${vocab.modifier[modIndex]} ${primary}`;
    }

    // Duration: longer is harder
    if (event.durationMinutes > 60) {
      primary = `${primary} (Extended)`;
    }

    // High attendee count = systemic involvement
    if (event.attendeeCount > 10) {
      primary = `Widespread ${primary}`;
    }

    if (event.isAllDay) {
      primary = primary.replace('Window', 'Period').replace('Interval', 'Duration');
    }

    return primary;
  },
};

/**
 * MANIC-DEPRESSIVE — Cycling, euphoric, crashing.
 *
 * The calendar is a mood chart. Morning meetings are mania.
 * Afternoon deadlines are depressive episodes. The arc of the
 * week traces the cycle: build, peak, crash, stillness.
 */
const manicDepressive = {
  id: 'manic-depressive',
  name: 'Manic-Depressive Cycle',
  description: 'Cycling. Euphoric. Crashing. Your schedule is a mood chart that peaks and plummets.',
  icon: '🎭',

  vocabulary: {
    standup: {
      primary: ['Racing Thoughts (AM)', 'Hypomanic Morning', 'Flight of Ideas', 'Elevated Mood', 'Pressured Speech'],
      modifier: ['Accelerated', 'Heightened', 'Electric', 'Buzzing'],
    },
    'one-on-one': {
      primary: ['Therapy Session', 'Mood Check', 'Companion Visit', 'Emotional Labor', 'Mirror Moment'],
      modifier: ['Intimate', 'Tense', 'Cathartic', 'Necessary'],
    },
    'small-meeting': {
      primary: ['Group Therapy', 'Shared Delusion', 'Collective Mood', 'Emotional Contagion'],
      modifier: ['Intense', 'Focused', 'Dissociative', 'Connected'],
    },
    meeting: {
      primary: ['Grandiosity Episode', 'Manic Projection', 'Identity Performance', 'Self-Presentation', 'Ego Surge'],
      modifier: ['Brilliant', 'Unstoppable', 'Delusional', 'Iridescent'],
    },
    'all-hands': {
      primary: ['Manic Episode (Full)', 'Grandiosity Peak', 'Ego Explosion', 'Crescendo', 'Psychomotor Agitation'],
      modifier: ['Ecstatic', 'Omnipotent', 'Invincible', 'Transcendent'],
    },
    focus: {
      primary: ['Depressive Withdrawal', 'Flat Affect', 'Emotional Numbness', 'Stillness', 'The Void'],
      modifier: ['Quiet', 'Heavy', 'Merciful', 'Empty'],
    },
    deadline: {
      primary: ['Crash Point', 'Mood Collapse', 'Depressive Episode', 'Despair Event', 'The Drop'],
      modifier: ['Crushing', 'Inevitable', 'Total', 'Abyssal'],
    },
    social: {
      primary: ['Compulsive Socializing', 'Hypomanic Connection', 'Elation Burst', 'Love Bomb', 'Manic Charm Offensive'],
      modifier: ['Frantic', 'Desperate', 'Glowing', 'Burning'],
    },
    absence: {
      primary: ['Depressive Shutdown', 'Cannot Rise', 'Black Day', 'Anhedonia', 'The Weight'],
      modifier: ['Complete', 'Total', 'Heavy', 'Absolute'],
    },
    milestone: {
      primary: ['Mood Shift', 'Phase Transition', 'Cycle Turning', 'Polarity Reversal'],
      modifier: ['Sudden', 'Marked', 'Dramatic', 'Swift'],
    },
    event: {
      primary: ['Mood Episode', 'Affective Shift', 'State Change', 'Swing', 'Alteration'],
      modifier: ['Rapid', 'Gradual', 'Abrupt', 'Subtle'],
    },
  },

  severity: {
    'early-morning': 0.7,
    morning: 0.8,
    midday: 0.5,
    afternoon: 0.4,
    evening: 0.3,
    night: 0.2,
  },

  // The weekly mood cycle: build, peak, crash, stillness, stir
  weekIntensity: {
    Monday: 0.8,
    Tuesday: 0.9,
    Wednesday: 0.7,
    Thursday: 0.4,
    Friday: 0.2,
    Saturday: 0.15,
    Sunday: 0.5,
  },

  transform(event) {
    const type = event.eventType;
    const vocab = this.vocabulary[type] || this.vocabulary.event;
    const timeSeverity = this.severity[event.timeOfDay] || 0.5;
    const dayIntensity = this.weekIntensity[event.dayOfWeek] || 0.5;
    const combinedIntensity = (timeSeverity + dayIntensity) / 2;

    const primaryIndex = hashString(event.uid + event.summary) % vocab.primary.length;
    let primary = vocab.primary[primaryIndex];

    // Recurring events are cycles
    if (event.recurrence.isRecurring) {
      const cyclePrefixes = ['Cyclical', 'Repeating', 'Recurring', 'Oscillating'];
      const prefixIndex = hashString(event.uid) % cyclePrefixes.length;
      primary = `${cyclePrefixes[prefixIndex]} ${primary}`;
    }

    // Apply phase-appropriate modifiers
    if (vocab.modifier) {
      if (combinedIntensity > 0.75) {
        // Manic phase — elevated modifiers (even indices)
        const manicMods = vocab.modifier.filter((_, i) => i % 2 === 0);
        if (manicMods.length > 0) {
          const modIndex = hashString(event.uid + 'manic') % manicMods.length;
          primary = `${manicMods[modIndex]} ${primary}`;
        }
      } else if (combinedIntensity < 0.35) {
        // Depressive phase — heavy modifiers (odd indices)
        const depressMods = vocab.modifier.filter((_, i) => i % 2 === 1);
        if (depressMods.length > 0) {
          const modIndex = hashString(event.uid + 'dep') % depressMods.length;
          primary = `${depressMods[modIndex]} ${primary}`;
        }
      }
    }

    // Long events are extended episodes
    if (event.durationMinutes > 60) {
      primary = `${primary} (Extended Episode)`;
    }

    // Late-night events are particularly unstable
    if (event.timeOfDay === 'night' || event.timeOfDay === 'early-morning') {
      primary = `Sleepless ${primary}`;
    }

    if (event.isAllDay) {
      primary = primary.replace('Moment', 'Day').replace('Episode', 'Day');
    }

    return primary;
  },
};

/**
 * Get all available pathologies for selection.
 */
function getAllPathologies() {
  return [flu, chronic, manicDepressive];
}

/**
 * Get a pathology by ID.
 */
function getPathology(id) {
  const pathologies = { flu, chronic, 'manic-depressive': manicDepressive };
  return pathologies[id] || null;
}

/**
 * Get pathology display info for inquirer prompts.
 */
function getPathologyChoices() {
  return getAllPathologies().map(p => ({
    name: `${p.icon}  ${p.name} — ${p.description}`,
    value: p.id,
    short: p.name,
  }));
}

module.exports = {
  flu,
  chronic,
  manicDepressive,
  getAllPathologies,
  getPathology,
  getPathologyChoices,
  hashString,
};
