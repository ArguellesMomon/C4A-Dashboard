import React, { useMemo, useState } from 'react'
import CalendarDayCell from './CalendarDayCell.jsx'
import { buildMonthGrid, monthName, WEEKDAYS } from '../../lib/dateUtils.js'

export default function CalendarView({ events, selectedDate, onSelectDate, initialDate }) {
  const [cursor, setCursor] = useState(() => {
    const anchor = initialDate || selectedDate
    const now = anchor ? new Date(anchor + 'T00:00:00') : new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const grid = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor])

  const eventsByDate = useMemo(() => {
    const map = {}
    for (const e of events) {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    }
    return map
  }, [events])

  function shiftMonth(delta) {
    setCursor((prev) => {
      const newMonth = prev.month + delta
      const date = new Date(prev.year, newMonth, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  function goToToday() {
    const now = new Date()
    setCursor({ year: now.getFullYear(), month: now.getMonth() })
    onSelectDate(null)
  }

  return (
    <div className="month-calendar">
      <div className="month-calendar-heading">
        <h2 className="month-calendar-title">
          {monthName(cursor.month)} {cursor.year}
        </h2>
        <div className="calendar-nav">
          <button onClick={() => shiftMonth(-1)} aria-label="Previous month" className="calendar-month-arrow">‹</button>
          <button onClick={goToToday} className="calendar-today">
            Today
          </button>
          <button onClick={() => shiftMonth(1)} aria-label="Next month" className="calendar-month-arrow">›</button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {grid.map((cell) => (
          <CalendarDayCell
            key={cell.iso}
            cell={cell}
            eventsOnDay={eventsByDate[cell.iso] || []}
            isSelected={selectedDate === cell.iso}
            onSelect={onSelectDate}
          />
        ))}
      </div>
    </div>
  )
}