// Small collection of date helpers. Kept framework-free and dependency-free
// on purpose - a full date library would be overkill for a month calendar.

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function monthName(monthIndex) {
  return MONTH_NAMES[monthIndex]
}

export const WEEKDAYS = WEEKDAY_LABELS

// Formats a Date as YYYY-MM-DD (matches how events store their `date` field).
export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isToday(isoDate) {
  return isoDate === toISODate(new Date())
}

// Builds a 6x7 grid of day cells for the given month, including the
// trailing/leading days from adjacent months so every week row is full.
export function buildMonthGrid(year, monthIndex) {
  const firstOfMonth = new Date(year, monthIndex, 1)
  const startWeekday = firstOfMonth.getDay() // 0 = Sunday

  const gridStart = new Date(year, monthIndex, 1 - startWeekday)

  const cells = []
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(gridStart)
    cellDate.setDate(gridStart.getDate() + i)
    cells.push({
      date: cellDate,
      iso: toISODate(cellDate),
      inCurrentMonth: cellDate.getMonth() === monthIndex,
    })
  }
  return cells
}

export function formatFriendlyDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(hhmm) {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

// Days remaining until an ISO date, counted from today (0 = today, negative = past).
export function daysUntil(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  const target = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}
