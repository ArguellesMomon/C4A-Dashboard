import React, { useMemo, useState } from 'react'
import CalendarDayCell from './CalendarDayCell.jsx'
import { buildMonthGrid, monthName, WEEKDAYS } from '../../lib/dateUtils.js'

export default function CalendarView({ events, selectedDate, onSelectDate }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
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
    <div className="rounded-2xl border border-cream-300 bg-cream-100 p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-forest-900">
          {monthName(cursor.month)} {cursor.year}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={() => shiftMonth(-1)} aria-label="Previous month" className="rounded-lg p-2 hover:bg-sage-100">‹</button>
          <button onClick={goToToday} className="rounded-lg px-2 py-1 text-xs font-semibold text-forest-700 hover:bg-sage-100">
            Today
          </button>
          <button onClick={() => shiftMonth(1)} aria-label="Next month" className="rounded-lg p-2 hover:bg-sage-100">›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-forest-700/60">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell) => (
          <CalendarDayCell
            key={cell.iso}
            cell={cell}
            eventsOnDay={eventsByDate[cell.iso] || []}
            isSelected={selectedDate === cell.iso}
            onSelect={(iso) => onSelectDate(selectedDate === iso ? null : iso)}
          />
        ))}
      </div>

      {selectedDate && (
        <button
          onClick={() => onSelectDate(null)}
          className="mt-3 text-xs font-semibold text-forest-700 underline underline-offset-2"
        >
          Clear date filter
        </button>
      )}
    </div>
  )
}
