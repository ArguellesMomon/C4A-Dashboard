import React from 'react'
import CategoryBadge from './CategoryBadge.jsx'
import { formatFriendlyDate, formatTime, daysUntil } from '../../lib/dateUtils.js'

function countdownLabel(days) {
  if (days < 0) return 'Past'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

export default function EventCard({ event, onClick }) {
  const days = daysUntil(event.date)
  const isPast = days < 0

  return (
    <button
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border border-cream-300 bg-cream-100
        text-left shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-lg
        ${isPast ? 'opacity-60' : ''}`}
    >
      {/* Signature ribbon: days-until countdown, folded corner style */}
      <div
        className={`absolute right-0 top-0 rounded-bl-2xl px-3 py-1 text-xs font-bold tracking-wide
          ${isPast ? 'bg-cream-300 text-forest-700' : 'bg-forest-800 text-gold-light'}`}
      >
        {countdownLabel(days)}
      </div>

      <div className="flex flex-col gap-2 p-5 pr-24">
        <CategoryBadge category={event.category} />
        <h3 className="font-display text-lg font-semibold text-forest-900 group-hover:text-forest-700">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-forest-700/80">
          <span>📅 {formatFriendlyDate(event.date)}</span>
          {event.time && <span>🕐 {formatTime(event.time)}</span>}
          {event.location && <span>📍 {event.location}</span>}
        </div>
      </div>
    </button>
  )
}
