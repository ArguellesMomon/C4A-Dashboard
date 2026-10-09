// Campus times are Asia/Manila (UTC+8), independent of the visitor's timezone.
const DURATION = 60 * 60 * 1000
function compact(date) { return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z') }
function dayAfter(date) { const value = new Date(date+'T00:00:00Z'); value.setUTCDate(value.getUTCDate()+1); return value.toISOString().slice(0,10).replaceAll('-','') }
function dates(event) {
  if (!event.time) return { start: event.date.replaceAll('-',''), end: dayAfter(event.date), allDay: true }
  const start = new Date(event.date+'T'+event.time.slice(0,5)+':00+08:00')
  return { start: compact(start), end: compact(new Date(start.getTime()+DURATION)), allDay: false }
}
function escapeICS(text = '') { return String(text).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;') }
function fold(line) {
  const encoder = new TextEncoder()
  let lines = [], part = '', size = 0
  for (const char of line) { const bytes = encoder.encode(char).length; if(size+bytes > 75) { lines.push(part); part = ' '; size = 1 } part += char; size += bytes }
  lines.push(part); return lines.join('\r\n')
}
export function eventICS(event) {
  const { start, end, allDay } = dates(event)
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//C4A Fieldnotes//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT', 'UID:'+escapeICS(event.id)+'@c4a-fieldnotes', 'DTSTAMP:'+compact(new Date()), 'DTSTART'+(allDay ? ';VALUE=DATE' : '')+':'+start, 'DTEND'+(allDay ? ';VALUE=DATE' : '')+':'+end, 'SUMMARY:'+escapeICS(event.title), event.location ? 'LOCATION:'+escapeICS(event.location) : '', event.description ? 'DESCRIPTION:'+escapeICS(event.description) : '', 'END:VEVENT','END:VCALENDAR'].filter(Boolean).map(fold).join('\r\n')+'\r\n'
}
export function downloadICS(event) {
  const url = URL.createObjectURL(new Blob([eventICS(event)], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = (event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'c4a-event')+'.ics'
  document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function googleCalendarUrl(event) {
  const { start, end } = dates(event)
  const params = new URLSearchParams({ action: 'TEMPLATE', text: event.title, dates: start+'/'+end, ctz: 'Asia/Manila' })
  if(event.location)params.set('location',event.location)
  if(event.description)params.set('details',event.description)
  return 'https://calendar.google.com/calendar/render?'+params.toString()
}
