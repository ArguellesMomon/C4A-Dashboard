import React from 'react'
import CategoryBadge from './CategoryBadge.jsx'
import { CalendarIcon, ClockIcon, PinIcon } from '../common/icons.jsx'
import { formatFriendlyDate, formatTime, daysUntil } from '../../lib/dateUtils.js'

function countdownText(days) {
  if (days === 0) return { big: 'Today', small: '' }
  if (days === 1) return { big: '1', small: 'day left' }
  return { big: String(days), small: 'days left' }
}

export default function FeaturedEventCard({ event, onClick }) {
  const days = daysUntil(event.date)
  const countdown = countdownText(days)

  return (
    <button
      onClick={onClick}
      className="group relative mb-5 flex w-full flex-col gap-5 overflow-hidden rounded-2xl
        border border-cream-300 bg-cream-100 p-6 text-left shadow-card transition-transform
        hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest-500">Up next</span>
        <CategoryBadge category={event.category} />
        <h3 className="font-display text-xl font-semibold text-forest-900 group-hover:text-forest-700 sm:text-2xl">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-forest-700/80">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4 shrink-0" />
            {formatFriendlyDate(event.date)}
          </span>
          {event.time && (
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4 shrink-0" />
              {formatTime(event.time)}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1.5">
              <PinIcon className="h-4 w-4 shrink-0" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-forest-800 px-6 py-4 text-cream-100">
        <span className="font-display text-3xl font-bold leading-none">{countdown.big}</span>
        {countdown.small && (
          <span className="mt-1 text-xs uppercase tracking-widest text-cream-100/70">{countdown.small}</span>
        )}
      </div>
    </button>
  )
}
