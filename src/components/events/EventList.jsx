import React, { useMemo, useState } from 'react'
import EventCard from './EventCard.jsx'
import EmptyState from '../common/EmptyState.jsx'
import { CATEGORIES } from './CategoryBadge.jsx'
import { daysUntil } from '../../lib/dateUtils.js'

export default function EventList({ events, onSelectEvent, selectedDate, hidePast = true, excludeIds = [] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return events
      .filter((e) => !excludeIds.includes(e.id))
      .filter((e) => !selectedDate || e.date === selectedDate)
      .filter((e) => (hidePast ? daysUntil(e.date) >= 0 : true))
      .filter((e) => category === 'All' || e.category === category)
      .filter((e) => e.title.toLowerCase().includes(search.trim().toLowerCase()))
  }, [events, search, category, selectedDate, hidePast, excludeIds])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          className="input flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
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
          {filtered.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <EventCard event={event} onClick={() => onSelectEvent(event)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
