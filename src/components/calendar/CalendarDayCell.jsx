import React from 'react'
import { CategoryDot } from '../events/CategoryBadge.jsx'
import { isToday } from '../../lib/dateUtils.js'

export default function CalendarDayCell({ cell, eventsOnDay, isSelected, onSelect }) {
  const today = isToday(cell.iso)

  return (
    <button
      onClick={() => onSelect(cell.iso)}
      className={`flex min-h-[3.25rem] flex-col items-center gap-1 rounded-lg p-1.5 text-sm transition-colors
        sm:min-h-[4rem] sm:items-start sm:p-2
        ${cell.inCurrentMonth ? 'text-forest-900' : 'text-forest-900/30'}
        ${isSelected ? 'bg-forest-700 text-cream-100' : 'hover:bg-sage-100'}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:text-sm
          ${today && !isSelected ? 'bg-gold text-forest-950' : ''}`}
      >
        {cell.date.getDate()}
      </span>
      {eventsOnDay.length > 0 && (
        <div className="flex gap-0.5">
          {eventsOnDay.slice(0, 3).map((e) => (
            <CategoryDot key={e.id} category={e.category} />
          ))}
        </div>
      )}
    </button>
  )
}
