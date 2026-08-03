import React, { useState } from 'react'
import CalendarView from '../components/calendar/CalendarView.jsx'
import EventList from '../components/events/EventList.jsx'
import EventDetailsModal from '../components/events/EventDetailsModal.jsx'
import { useEvents } from '../context/EventsContext.jsx'
import { daysUntil } from '../lib/dateUtils.js'

export default function Dashboard() {
  const { events, loading, error } = useEvents()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mobileTab, setMobileTab] = useState('calendar') // 'calendar' | 'list'

  const nextEvent = events.filter((e) => daysUntil(e.date) >= 0)[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Hero */}
      <div className="mb-6 rounded-2xl bg-forest-800 px-6 py-8 text-cream-100 sm:px-10 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-light">C4A Student Dashboard</p>
        <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          Every seminar, workshop, and deadline in one place.
        </h1>
        {nextEvent && (
          <p className="mt-3 text-sm text-cream-100/80">
            Coming up next: <span className="font-semibold text-cream-100">{nextEvent.title}</span>
          </p>
        )}
      </div>

      {/* Mobile tab switcher */}
      <div className="mb-4 flex gap-2 sm:hidden">
        {['calendar', 'list'].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-colors
              ${mobileTab === tab ? 'bg-forest-700 text-cream-100' : 'bg-cream-100 text-forest-800 border border-cream-300'}`}
          >
            {tab === 'calendar' ? 'Calendar' : 'Upcoming'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem,1fr]">
        <div className={mobileTab === 'calendar' ? 'block' : 'hidden sm:block'}>
          <CalendarView events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        <div className={mobileTab === 'list' ? 'block' : 'hidden sm:block'}>
          <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">
            {selectedDate ? 'Events on selected date' : 'Upcoming events'}
          </h2>
          {loading ? (
            <p className="text-sm text-forest-700/60">Loading events...</p>
          ) : error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : (
            <EventList events={events} onSelectEvent={setSelectedEvent} selectedDate={selectedDate} />
          )}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
