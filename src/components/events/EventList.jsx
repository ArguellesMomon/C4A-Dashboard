import React, { useMemo, useState } from 'react'
import EventCard from './EventCard.jsx'
import EmptyState from '../common/EmptyState.jsx'
import { CATEGORIES } from './CategoryBadge.jsx'
import { daysUntil } from '../../lib/dateUtils.js'

export default function EventList({ events, onSelectEvent, selectedDate, hidePast = true }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return events
      .filter((e) => !selectedDate || e.date === selectedDate)
      .filter((e) => (hidePast ? daysUntil(e.date) >= 0 : true))
      .filter((e) => category === 'All' || e.category === category)
      .filter((e) => e.title.toLowerCase().includes(search.trim().toLowerCase()))
  }, [events, search, category, selectedDate, hidePast])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          className="flex-1 rounded-lg border border-cream-300 bg-cream-100 px-3 py-2 text-sm
            text-forest-900 placeholder:text-forest-700/40 focus:border-forest-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-cream-300 bg-cream-100 px-3 py-2 text-sm text-forest-900 focus:border-forest-500"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No events found"
          message={selectedDate ? 'Nothing scheduled on this day yet.' : 'Try a different search or category.'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
          ))}
        </div>
      )}
    </div>
  )
}
