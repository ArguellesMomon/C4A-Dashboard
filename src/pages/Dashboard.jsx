import React, { useState } from 'react'
import CalendarView from '../components/calendar/CalendarView.jsx'
import DayEventsModal from '../components/calendar/DayEventsModal.jsx'
import EventList from '../components/events/EventList.jsx'
import EventDetailsModal from '../components/events/EventDetailsModal.jsx'
import FeaturedEventCard from '../components/events/FeaturedEventCard.jsx'
import EventCardSkeleton from '../components/common/EventCardSkeleton.jsx'
import HeroPattern from '../components/common/HeroPattern.jsx'
import { useEvents } from '../context/EventsContext.jsx'
import { useEventReminders } from '../hooks/useEventReminders.js'
import { useMediaQuery } from '../hooks/Usemediaquery.js'
import { daysUntil, formatFriendlyDate } from '../lib/dateUtils.js'

const TODAY = new Date()
const TODAY_DAY = TODAY.getDate()
const TODAY_MONTH = TODAY.toLocaleDateString('en-US', { month: 'short' })

export default function Dashboard() {
  const { events, loading, error } = useEvents()
  useEventReminders(events)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDayModal, setShowDayModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mobileTab, setMobileTab] = useState('calendar') // 'calendar' | 'list'

  const nextEvent = events.filter((e) => daysUntil(e.date) >= 0)[0]

  // The layout goes side-by-side at the lg breakpoint (1024px) - see the
  // grid below. Below that, the calendar and agenda are stacked (or on
  // separate tabs on phones), so a popup genuinely helps. At lg+, the
  // filtered list is already sitting right next to the calendar, so the
  // popup would just be showing the same thing twice.
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)')

  // Clicking a day on the calendar always filters the agenda list (via
  // the persistent filter bar below), and additionally pops open a modal
  // on phones/tablets where that filtered list isn't already visible
  // alongside the calendar.
  function handleSelectDate(iso) {
    setSelectedDate(iso)
    if (iso && !isDesktopLayout) setShowDayModal(true)
  }

  function handleSelectEventFromDayModal(event) {
    setShowDayModal(false)
    setSelectedEvent(event)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-forest-800 px-6 py-8 text-cream-100 sm:px-10 sm:py-10">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full text-cream-100 opacity-[0.08]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-light">
              C4A Student Dashboard
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              Every seminar, workshop, and deadline in one place.
            </h1>
            {nextEvent && (
              <p className="mt-3 text-sm text-cream-100/80">
                Coming up next: <span className="font-semibold text-cream-100">{nextEvent.title}</span>
              </p>
            )}
          </div>

          {/* Poster-style date stamp - a small deliberate flourish instead
              of a flat banner with nothing but text in it. */}
          <div className="hidden shrink-0 flex-col items-center rounded-2xl bg-cream-100/10 px-6 py-4 text-center backdrop-blur-sm sm:flex">
            <span className="font-display text-4xl font-bold leading-none text-gold-light">{TODAY_DAY}</span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-cream-100/70">
              {TODAY_MONTH}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="mb-3 flex gap-2 sm:hidden">
        {['calendar', 'list'].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`relative flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-colors
              ${mobileTab === tab ? 'bg-forest-700 text-cream-100' : 'bg-cream-100 text-forest-800 border border-cream-300'}`}
          >
            {tab === 'calendar' ? 'Calendar' : 'Upcoming'}
            {tab === 'list' && selectedDate && (
              <span className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gold" />
            )}
          </button>
        ))}
      </div>

      {/* Persistent filter indicator. On phones it only makes sense on the
          Upcoming tab - the Calendar tab already shows the selection via
          the highlighted date (and the popup), so showing this bar there
          too is redundant. It stays visible on the Upcoming tab, and
          always visible at sm+ where there are no tabs at all (calendar
          and list are shown together, so the filter applies to both). */}
      {selectedDate && (
        <div
          className={`mb-4 flex-wrap items-center justify-between gap-2 rounded-lg border border-forest-300/40
            bg-sage-100 px-4 py-2.5 text-sm ${mobileTab === 'calendar' ? 'hidden sm:flex' : 'flex'}`}
        >
          <span className="text-forest-800">
            Showing events for <span className="font-semibold">{formatFriendlyDate(selectedDate)}</span>
          </span>
          <button
            onClick={() => setSelectedDate(null)}
            className="font-semibold text-forest-700 underline underline-offset-2 hover:text-forest-900"
          >
            Show all upcoming
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem,1fr]">
        <div className={mobileTab === 'calendar' ? 'block' : 'hidden sm:block'}>
          <CalendarView events={events} selectedDate={selectedDate} onSelectDate={handleSelectDate} />
        </div>

        <div className={mobileTab === 'list' ? 'block' : 'hidden sm:block'}>
          <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">
            {selectedDate ? 'Events on selected date' : 'Upcoming events'}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : (
            <>
              {!selectedDate && nextEvent && (
                <FeaturedEventCard event={nextEvent} onClick={() => setSelectedEvent(nextEvent)} />
              )}
              <EventList
                events={events}
                onSelectEvent={setSelectedEvent}
                selectedDate={selectedDate}
                hidePast={!selectedDate}
                excludeIds={!selectedDate && nextEvent ? [nextEvent.id] : []}
              />
            </>
          )}
        </div>
      </div>

      {showDayModal && selectedDate && (
        <DayEventsModal
          date={selectedDate}
          events={events.filter((e) => e.date === selectedDate)}
          onSelectEvent={handleSelectEventFromDayModal}
          onClose={() => setShowDayModal(false)}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}