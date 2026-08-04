// Turns an event into calendar-importable formats, entirely client-side.
//
// Two options are offered because there's no single "add to calendar"
// standard that works everywhere:
// - downloadICS(): a .ics file, understood by Apple Calendar, Outlook,
//   and Google Calendar's "import" option. Works for anyone.
// - googleCalendarUrl(): a direct link that opens Google Calendar with
//   the event pre-filled, for the common case of a Google-account phone.
//
// Assumes the event's date/time represents the visitor's own local time,
// which is a safe assumption here since the whole audience is on one
// campus/timezone.

const DEFAULT_DURATION_MINUTES = 60

function pad(n) {
  return String(n).padStart(2, '0')
}

function toICSDateTime(date) {
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    '00'
  )
}

function toICSDateTimeUTC(date) {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    '00Z'
  )
}

function toICSDateOnly(date) {
  return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate())
}

function escapeICS(text = '') {
  return text.replace(/[\\,;]/g, (match) => '\\' + match).replace(/\n/g, '\\n')
}

// Events without a time become an all-day entry. Events with a time get
// a 1-hour default duration, since we don't collect an end time.
function getStartEnd(event) {
  if (!event.time) {
    const start = new Date(`${event.date}T00:00:00`)
    const end = new Date(start)
    end.setDate(end.getDate() + 1)
    return { start, end, allDay: true }
  }
  const start = new Date(`${event.date}T${event.time}:00`)
  const end = new Date(start.getTime() + DEFAULT_DURATION_MINUTES * 60000)
  return { start, end, allDay: false }
}

export function downloadICS(event) {
  const { start, end, allDay } = getStartEnd(event)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//C4A Dashboard//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@c4a-dashboard`,
    allDay ? `DTSTART;VALUE=DATE:${toICSDateOnly(start)}` : `DTSTART:${toICSDateTime(start)}`,
    allDay ? `DTEND;VALUE=DATE:${toICSDateOnly(end)}` : `DTEND:${toICSDateTime(end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    event.location ? `LOCATION:${escapeICS(event.location)}` : '',
    event.description ? `DESCRIPTION:${escapeICS(event.description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function googleCalendarUrl(event) {
  const { start, end, allDay } = getStartEnd(event)
  const dates = allDay
    ? `${toICSDateOnly(start)}/${toICSDateOnly(end)}`
    : `${toICSDateTimeUTC(start)}/${toICSDateTimeUTC(end)}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates,
  })
  if (event.location) params.set('location', event.location)
  if (event.description) params.set('details', event.description)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
