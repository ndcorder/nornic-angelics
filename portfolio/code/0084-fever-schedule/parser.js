/**
 * parser.js — Extracts structured event data from .ics files
 *
 * Normalizes calendar events into a consistent format for the
 * transformation engine. Every event becomes: title, duration,
 * recurrence pattern, attendee count, time of day, day of week,
 * location, organizer. The body mapped.
 */

const ICAL = require('ical.js');
const fs = require('fs');
const path = require('path');

/**
 * Parse an .ics file and return structured event data.
 * Throws descriptive errors for missing or malformed files.
 */
function parseICS(filePath) {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`);
  }

  const rawICS = fs.readFileSync(resolvedPath, 'utf-8');

  if (!rawICS || rawICS.trim().length === 0) {
    throw new Error('File is empty. Nothing to examine.');
  }

  let jcalData;
  try {
    jcalData = ICAL.parse(rawICS);
  } catch (err) {
    throw new Error(`Failed to parse .ics file: ${err.message}`);
  }

  const vcalendar = new ICAL.Component(jcalData);
  const vevents = vcalendar.getAllSubcomponents('vevent');

  if (vevents.length === 0) {
    throw new Error('No events found in calendar file. The schedule is empty.');
  }

  // Calendar-level metadata
  const calendarMeta = {
    name: vcalendar.getFirstPropertyValue('x-wr-calname') || null,
    timezone: vcalendar.getFirstPropertyValue('x-wr-timezone') || null,
    prodid: vcalendar.getFirstPropertyValue('prodid') || null,
  };

  // Group recurring events by UID; skip recurrence overrides
  // We transform the base event, not its exceptions
  const eventsById = new Map();
  for (const vevent of vevents) {
    const recurrenceId = vevent.getFirstPropertyValue('recurrence-id');
    if (!recurrenceId) {
      const uid = vevent.getFirstPropertyValue('uid');
      eventsById.set(uid, vevent);
    }
  }

  const events = [];
  for (const [, vevent] of eventsById) {
    try {
      const parsed = parseEvent(vevent);
      if (parsed) {
        events.push(parsed);
      }
    } catch {
      // The body tolerates imperfection
    }
  }

  const stats = computeStats(events);

  return {
    meta: calendarMeta,
    events,
    stats,
    parsedEventCount: events.length,
  };
}

/**
 * Parse a single VEVENT component into structured data.
 * Returns null for events without a start time (ghost signals).
 */
function parseEvent(vevent) {
  const summary = vevent.getFirstPropertyValue('summary') || 'Untitled Event';
  const uid = vevent.getFirstPropertyValue('uid');
  const description = vevent.getFirstPropertyValue('description') || null;
  const location = vevent.getFirstPropertyValue('location') || null;
  const organizer = vevent.getFirstPropertyValue('organizer') || null;
  const status = vevent.getFirstPropertyValue('status') || null;
  const transparency = vevent.getFirstPropertyValue('transp') || null;

  // Parse dates
  const dtstart = vevent.getFirstPropertyValue('dtstart');
  const dtend = vevent.getFirstPropertyValue('dtend');
  const duration = vevent.getFirstPropertyValue('duration');

  if (!dtstart) {
    return null;
  }

  const startDate = dtstart.toJSDate();
  const endDate = dtend ? dtend.toJSDate() : null;

  // Duration in minutes
  let durationMinutes = 0;
  if (startDate && endDate) {
    durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  } else if (duration) {
    durationMinutes = duration.toSeconds() / 60;
  }

  const isAllDay = dtstart.icaltype === 'date';

  // Recurrence
  const rrule = vevent.getFirstPropertyValue('rrule');
  const recurrence = parseRecurrence(rrule);

  // Attendees
  const attendees = vevent.getAllProperties('attendee');
  const attendeeCount = attendees ? attendees.length : 0;

  // Time classification
  const hour = startDate.getHours();
  const timeOfDay = getTimeOfDay(hour);
  const dayOfWeek = getDayOfWeek(startDate.getDay());

  // Event classification
  const eventType = classifyEvent({
    summary,
    attendeeCount,
    durationMinutes,
    recurrence,
    isAllDay,
    transparency,
  });

  const isMeeting = attendeeCount > 0 && hour >= 7 && hour <= 19;
  const isFocusTime = detectFocusTime(summary, attendeeCount, transparency);
  const isSocial = detectSocialEvent(summary, location);
  const isDeadline = detectDeadline(summary, isAllDay);

  return {
    uid,
    summary,
    description,
    location,
    organizer: organizer ? organizer.toString() : null,
    status,
    transparency,
    startDate,
    endDate,
    durationMinutes,
    isAllDay,
    recurrence,
    attendeeCount,
    timeOfDay,
    dayOfWeek,
    eventType,
    isMeeting,
    isFocusTime,
    isSocial,
    isDeadline,
    originalRrule: rrule ? rrule.toString() : null,
    _vevent: vevent,
  };
}

/**
 * Parse an RRULE into a structured recurrence description.
 */
function parseRecurrence(rrule) {
  if (!rrule) {
    return { isRecurring: false };
  }

  const freq = rrule.freq;
  const interval = rrule.interval || 1;
  const count = rrule.count;
  const until = rrule.until;
  const byDay = rrule.byDay;

  let frequency;
  switch (freq) {
    case 'DAILY':
      frequency = interval > 1 ? `Every ${interval} days` : 'Daily';
      break;
    case 'WEEKLY':
      frequency = interval > 1 ? `Every ${interval} weeks` : 'Weekly';
      break;
    case 'MONTHLY':
      frequency = interval > 1 ? `Every ${interval} months` : 'Monthly';
      break;
    case 'YEARLY':
      frequency = interval > 1 ? `Every ${interval} years` : 'Yearly';
      break;
    default:
      frequency = 'Recurring';
  }

  return {
    isRecurring: true,
    frequency,
    freq,
    interval,
    count,
    until: until ? until.toJSDate() : null,
    byDay: byDay || [],
  };
}

/**
 * Classify event into a broad type based on its characteristics.
 * Order matters: more specific patterns checked first.
 */
function classifyEvent({ summary, attendeeCount, durationMinutes, recurrence, isAllDay, transparency }) {
  const lower = summary.toLowerCase();

  if (isAllDay) {
    if (lower.includes('holiday') || lower.includes('pto') || lower.includes('vacation') ||
        lower.includes('ooo') || lower.includes('out of office')) {
      return 'absence';
    }
    if (lower.includes('deadline') || lower.includes('due') || lower.includes('launch') || lower.includes('release')) {
      return 'deadline';
    }
    return 'milestone';
  }

  // Standup / daily sync — by recurrence pattern or keywords
  if (
    recurrence?.freq === 'DAILY' ||
    (recurrence?.freq === 'WEEKLY' && recurrence?.byDay?.length >= 3) ||
    lower.includes('standup') ||
    lower.includes('daily') ||
    lower.includes('sync')
  ) {
    return 'standup';
  }

  // All-hands / company-wide
  if (
    lower.includes('all hands') || lower.includes('all-hands') ||
    lower.includes('town hall') || lower.includes('company') ||
    lower.includes('org meeting') || attendeeCount > 15
  ) {
    return 'all-hands';
  }

  // 1:1 / small meeting
  if (attendeeCount >= 1 && attendeeCount <= 3) {
    if (lower.includes('1:1') || lower.includes('1 on 1') || lower.includes('one on one') ||
        lower.includes('check-in') || lower.includes('checkin')) {
      return 'one-on-one';
    }
    return 'small-meeting';
  }

  // Medium meeting
  if (attendeeCount > 3 && attendeeCount <= 15) {
    return 'meeting';
  }

  // Focus / blocked time
  if (
    lower.includes('focus') || lower.includes('block') || lower.includes('deep work') ||
    lower.includes('no meeting') || lower.includes('do not schedule') || lower.includes('quiet time') ||
    (transparency === 'opaque' && attendeeCount === 0)
  ) {
    return 'focus';
  }

  // Generic — has attendees = meeting, else event
  return attendeeCount > 0 ? 'meeting' : 'event';
}

/**
 * Detect focus/blocked time by keywords or opaque transparency with no attendees.
 */
function detectFocusTime(summary, attendeeCount, transparency) {
  const lower = summary.toLowerCase();
  return (
    lower.includes('focus') || lower.includes('block') || lower.includes('deep work') ||
    lower.includes('no meeting') || lower.includes('do not schedule') || lower.includes('quiet time') ||
    (transparency === 'opaque' && attendeeCount === 0)
  );
}

/**
 * Detect social events by title or location keywords.
 */
function detectSocialEvent(summary, location) {
  const lower = summary.toLowerCase();
  const locLower = (location || '').toLowerCase();
  return (
    lower.includes('happy hour') || lower.includes('dinner') || lower.includes('lunch') ||
    lower.includes('party') || lower.includes('celebration') || lower.includes('drinks') ||
    lower.includes('coffee') || lower.includes('team outing') || lower.includes('social') ||
    locLower.includes('bar') || locLower.includes('restaurant') || locLower.includes('cafe')
  );
}

/**
 * Detect deadline events (all-day events with deadline keywords).
 */
function detectDeadline(summary, isAllDay) {
  const lower = summary.toLowerCase();
  return (
    isAllDay && (
      lower.includes('deadline') || lower.includes('due') || lower.includes('launch') ||
      lower.includes('release') || lower.includes('ship') || lower.includes('cut-off') || lower.includes('cutoff')
    )
  );
}

/**
 * Map hour to time-of-day category.
 */
function getTimeOfDay(hour) {
  if (hour < 6) return 'night';
  if (hour < 9) return 'early-morning';
  if (hour < 12) return 'morning';
  if (hour < 14) return 'midday';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

/**
 * Map JS day index (0=Sun) to day name.
 */
function getDayOfWeek(dayIndex) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
}

/**
 * Compute summary statistics across all parsed events.
 */
function computeStats(events) {
  const total = events.length;
  const recurring = events.filter(e => e.recurrence.isRecurring).length;

  const typeCounts = {};
  const dayCounts = {};
  const timeCounts = {};

  for (const event of events) {
    typeCounts[event.eventType] = (typeCounts[event.eventType] || 0) + 1;
    dayCounts[event.dayOfWeek] = (dayCounts[event.dayOfWeek] || 0) + 1;
    timeCounts[event.timeOfDay] = (timeCounts[event.timeOfDay] || 0) + 1;
  }

  const meetingTypes = ['meeting', 'small-meeting', 'one-on-one', 'all-hands', 'standup'];
  const totalMinutes = events.reduce((sum, e) => sum + e.durationMinutes, 0);
  const meetingMinutes = events
    .filter(e => e.isMeeting || meetingTypes.includes(e.eventType))
    .reduce((sum, e) => sum + e.durationMinutes, 0);

  // Busiest day
  let busiestDay = 'None';
  let busiestDayCount = 0;
  for (const [day, count] of Object.entries(dayCounts)) {
    if (count > busiestDayCount) {
      busiestDayCount = count;
      busiestDay = day;
    }
  }

  // Average meeting duration
  const meetingsWithDuration = events.filter(
    e => e.durationMinutes > 0 && meetingTypes.includes(e.eventType)
  );
  const avgMeetingDuration = meetingsWithDuration.length > 0
    ? Math.round(meetingsWithDuration.reduce((s, e) => s + e.durationMinutes, 0) / meetingsWithDuration.length)
    : 0;

  return {
    total,
    recurring,
    oneTime: total - recurring,
    types: typeCounts,
    days: dayCounts,
    times: timeCounts,
    totalMinutes,
    meetingMinutes,
    meetingHours: Math.round((meetingMinutes / 60) * 10) / 10,
    busiestDay,
    busiestDayCount,
    avgMeetingDuration,
    focusTimeEvents: events.filter(e => e.isFocusTime).length,
    socialEvents: events.filter(e => e.isSocial).length,
    deadlines: events.filter(e => e.isDeadline).length,
    absences: events.filter(e => e.eventType === 'absence').length,
  };
}

module.exports = {
  parseICS,
  parseEvent,
  classifyEvent,
  getTimeOfDay,
  getDayOfWeek,
};
