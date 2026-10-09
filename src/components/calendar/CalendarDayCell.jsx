import React from 'react'
import { CategoryDot } from '../events/CategoryBadge.jsx'
import { isToday } from '../../lib/dateUtils.js'
export default function CalendarDayCell({ cell, eventsOnDay, isSelected, onSelect }) {
  const today = isToday(cell.iso)
  return <button
    onClick={() => onSelect(cell.iso)}
    aria-label={cell.date.toLocaleDateString('en-US', { dateStyle: 'full' }) + ', ' + eventsOnDay.length + ' events'}
    aria-pressed={isSelected}
    aria-current={today ? 'date' : undefined}
    className={'calendar-day' + (!cell.inCurrentMonth ? ' outside-month' : '') + (isSelected ? ' is-selected' : '') + (today ? ' is-today' : '')}
  >
    <span className="calendar-day-number">{cell.date.getDate()}</span>
    {eventsOnDay.length > 0 && <span className="calendar-day-dots">{eventsOnDay.slice(0,3).map(event => <CategoryDot key={event.id} category={event.category}/>)}</span>}
  </button>
}
