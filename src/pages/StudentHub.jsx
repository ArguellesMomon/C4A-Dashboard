import React, { useMemo, useState } from 'react'
import { useEvents } from '../context/EventsContext.jsx'
import { usePreferences } from '../context/PreferencesContext.jsx'
import CalendarView from '../components/calendar/CalendarView.jsx'
import MobileCalendarPicker from '../components/calendar/MobileCalendarPicker.jsx'
import DayEventsModal from '../components/calendar/DayEventsModal.jsx'
import { useMediaQuery } from '../hooks/Usemediaquery.js'
import EventDetailsModal from '../components/events/EventDetailsModal.jsx'
import EventCard from '../components/events/EventCard.jsx'
import { CATEGORIES } from '../components/events/CategoryBadge.jsx'
import Symbol from '../components/common/Symbol.jsx'
import { daysUntil, formatFriendlyDate, formatTime } from '../lib/dateUtils.js'
import { selectEvents } from '../lib/eventFilters.js'
const copy = {
  overview: ['C4A STUDENT SPACE', 'Your section, in one place.', 'A shared home for everything happening in C4A.'],
  events: ['DISCOVER & CONNECT', 'The noticeboard', 'Seminars, workshops, meetups, and deadlines. Find what matters to you.'],
  calendar: ['PLAN YOUR DAYS', 'Section planner', 'A clearer view of your week, with every section event in reach.'],
  saved: ['YOUR COLLECTION', 'Made for your shortlist', 'Keep the events you care about close, ready for whenever you need them.'],
  guide: ['WELCOME TO C4A', 'Find your way around', 'A few simple ways to make this space work for you.'],
}
export default function StudentHub({ page, onNavigate }) {
  const { events, loading, error, refresh } = useEvents()
  const { saved } = usePreferences()
  const [selected, setSelected] = useState(null)
  const [date, setDate] = useState(null)
  const [dayAgendaOpen, setDayAgendaOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 640px)')
  function selectCalendarDate(iso) { setDate(iso); if (iso && isMobile) setDayAgendaOpen(true) }
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(() => new URLSearchParams(window.location.hash.split('?')[1] || '').get('category') || 'All')
  const [period, setPeriod] = useState('upcoming')
  const [sort, setSort] = useState('soonest')
  const ordered = useMemo(() => [...events].sort((a,b) => (a.date+(a.time || '')).localeCompare(b.date+(b.time || ''))), [events])
  const upcoming = ordered.filter(event => daysUntil(event.date) >= 0)
  const next = upcoming[0]
  const week = upcoming.filter(event => daysUntil(event.date) <= 7)
  const deadlines = upcoming.filter(event => event.category === 'Deadline')
  const filtered = selectEvents(ordered, { page, saved, date, period, category, search, sort })
  const heading = copy[page] || copy.overview
  function reset() { setSearch(''); setCategory('All'); setPeriod('all'); setDate(null) }
  function renderEvents(items) { return <div className="event-grid">{items.map(event => <EventCard key={event.id} event={event} onClick={() => setSelected(event)}/>)}</div> }
  const state = loading ? <div className="event-grid" aria-label="Loading events" aria-busy="true">{[1,2,3].map(i => <div key={i} className="loading-card"/>)}</div> : error ? <div className="status-panel" role="alert"><h3>We couldn’t reach the noticeboard.</h3><p>{error}</p><button className="primary-action" onClick={refresh}>Try again ↻</button></div> : null
  const discoveryControls = <>
<div className="discovery-tools"><label className="search-field"><Symbol name="search"/><input aria-label="Search events" placeholder="Search events, places, people…" value={search} onChange={e => setSearch(e.target.value)}/>{search && <button aria-label="Clear search" onClick={() => setSearch('')}>×</button>}</label><div className="select-tools">{page !== 'calendar' && <select aria-label="Event period" value={period} onChange={e => setPeriod(e.target.value)}><option value="upcoming">Upcoming</option><option value="all">All dates</option><option value="past">Past events</option></select>}<select aria-label="Sort events" value={sort} onChange={e => setSort(e.target.value)}><option value="soonest">Soonest first</option><option value="latest">Latest first</option><option value="title">Title A–Z</option></select></div></div>
      <div className="category-filters" aria-label="Filter by category">{['All',...CATEGORIES].map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'selected' : ''} onClick={() => setCategory(c)}>{c === 'All' ? 'Everything' : c}</button>)}</div>
  </>
  return <div className={'hub-page' + (page === 'calendar' ? ' calendar-page' : '')}>
    <div className="page-heading"><div><p className="eyebrow">{heading[0]}</p><h1>{heading[1]}</h1><p className="page-description">{heading[2]}</p></div><div className="today-note"><Symbol name="calendar"/><div><span>{new Date().toLocaleDateString('en-PH',{weekday:'long'})}</span><strong>{new Date().toLocaleDateString('en-PH',{month:'short',day:'numeric'})}</strong></div></div></div>
    {page === 'overview' ? <>
      <section className="overview-board">
        <div className="feature-panel">
          <div className="feature-top"><span className="eyebrow">{next ? 'COMING UP NEXT' : 'YOUR SECTION NOTICEBOARD'}</span><span className="feature-index">C4A / DLSL</span></div>
          <div className="feature-content"><p className="feature-category">{loading ? 'Loading events' : error ? 'Connection unavailable' : next?.category || 'Room for what’s next'}</p><h2>{loading ? 'Bringing your section together.' : error ? 'Let’s reconnect.' : next?.title || 'Good things start here.'}</h2><p>{next ? formatFriendlyDate(next.date) + (next.time ? ' · ' + formatTime(next.time) : '') : error ? 'We’re having trouble reaching the section noticeboard. Try again to get the latest events.' : 'Your next workshop, meeting, or shared experience. Find it all on the noticeboard.'}</p><button onClick={() => error ? refresh() : next ? setSelected(next) : onNavigate('events')} className="feature-button">{error ? 'Try again' : next ? 'View event' : 'Explore events'} <Symbol name="arrow"/></button></div>
          <div className="spotlight-date" aria-hidden="true">{next ? <><small>{new Date(next.date+'T00:00:00').toLocaleDateString('en-PH',{month:'short'})}</small><strong>{new Date(next.date+'T00:00:00').getDate()}</strong><span>{new Date(next.date+'T00:00:00').toLocaleDateString('en-PH',{weekday:'long'})}</span></> : <><Symbol name="calendar"/><span>Make space for<br/>what’s next.</span></>}</div>
          <div className="feature-bottom"><span>Learn something. Meet someone. Be part of it.</span><span>DE LA SALLE LIPA</span></div>
        </div>
        <aside className="week-preview"><div className="week-preview-heading"><span className="quick-icon"><Symbol name="calendar"/></span><div><p className="eyebrow">A LITTLE HEADS-UP</p><h2>This week</h2></div></div><div className="week-preview-events">{loading ? <p className="week-preview-empty">Getting your week ready…</p> : error ? <p className="week-preview-empty">Your week will appear here when the noticeboard reconnects.</p> : week.length ? week.slice(0,3).map(event => <button key={event.id} onClick={() => setSelected(event)} className="week-preview-row"><span><strong>{new Date(event.date+'T00:00:00').getDate()}</strong><small>{new Date(event.date+'T00:00:00').toLocaleDateString('en-PH',{month:'short'})}</small></span><div><b>{event.title}</b><small>{event.time ? formatTime(event.time) : 'All day'}{event.location ? ' · '+event.location : ''}</small></div><Symbol name="arrow"/></button>) : <div className="week-preview-empty"><h3>A little breathing room.</h3><p>No events scheduled in the next seven days. Explore the calendar to plan ahead.</p></div>}</div><button className="week-preview-link" onClick={() => onNavigate('calendar')}>Open planner <Symbol name="arrow"/></button></aside>
      </section>
      <section className="section-metrics" aria-label="Section activity">{[[upcoming.length,'Upcoming events','events','events'],[week.length,'This week','calendar','calendar'],[deadlines.length,'Open deadlines','admin','events?category=Deadline']].map(([count,label,icon,target]) => <button key={label} className="metric-card" onClick={() => onNavigate(target)}><span className="metric-icon"><Symbol name={icon}/></span><span className="metric-copy"><strong>{loading || error ? '—' : count}</strong><span>{label}</span></span><Symbol name="arrow"/></button>)}</section>
      <section className="section-block"><div className="section-heading"><div><p className="eyebrow">KEEP ON YOUR RADAR</p><h2>Coming up for C4A</h2></div><button className="text-button" onClick={() => onNavigate('events')}>All events <Symbol name="arrow"/></button></div>{state || (upcoming.length ? renderEvents(upcoming.slice(0,3)) : <div className="quiet-empty"><Symbol name="calendar"/><h3>Nothing on the horizon yet.</h3><p>Check the calendar for past events or come back for new section updates.</p><button className="text-button" onClick={() => onNavigate('calendar')}>Explore the calendar →</button></div>)}</section>
      <button className="guide-banner" onClick={() => onNavigate('guide')}><span className="guide-number"><Symbol name="guide"/></span><span><small>A PLACE FOR ALL OF US</small><strong>New here? Get your bearings.</strong></span><Symbol name="arrow"/></button>
    </> : page === 'guide' ? <><div className="guide-intro"><span><Symbol name="guide"/></span><p>Built around one simple idea: make section life easier to follow. C4A Fieldnotes brings our events, workshops, meetings, and deadlines into one shared space.</p></div><div className="guide-grid">{[['01','Discover together','Browse All events, search by title, venue, or organizer, and filter by category. Past events stay available in the archive.','events','Explore events'],['02','Plan your week','Open the calendar and choose a date to see what’s happening. Export an event to Google Calendar, Apple Calendar, or Outlook.','calendar','Open calendar'],['03','Make it yours','Save events to your personal shortlist and switch between light and dark mode. Your preferences stay on this browser.','saved','View saved events']].map(([number,title,body,target,label]) => <article className="guide-card" key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p><button className="text-button" onClick={() => onNavigate(target)}>{label} →</button></article>)}</div><div className="guide-notes"><h2>A few useful notes</h2><p><strong>Reminders:</strong> Browser reminders work while this hub is open, with your permission. They are not background push notifications.</p><p><strong>Officers:</strong> Sign in through the sidebar to publish and manage section events. Updates sync to everyone’s noticeboard.</p><p><strong>Saved events:</strong> Your shortlist is stored on this device and browser. Saving an event does not register you for attendance.</p></div></> : <>
      {page === 'calendar' ? <details className="calendar-filters" open={!isMobile}><summary><Symbol name="search"/><span>Search & filters</span>{(search || category !== 'All' || sort !== 'soonest') && <b>Active</b>}<span className="filter-chevron" aria-hidden="true">⌄</span></summary><div className="calendar-filter-content">{discoveryControls}</div></details> : discoveryControls}
      <div className={page === 'calendar' ? 'planner-layout' : ''}>{page === 'calendar' && <div className="calendar-panel">{isMobile ? <MobileCalendarPicker events={selectEvents(ordered, { page: 'calendar', category, search })} selectedDate={date} onSelectDate={selectCalendarDate}/> : <><CalendarView events={selectEvents(ordered, { page: 'calendar', category, search })} selectedDate={date} onSelectDate={selectCalendarDate}/><p className="calendar-hint">Choose a day to explore its events.<br/>Colored dots mark section activity.</p></>}</div>}<section className="results-panel"><div className="results-heading"><h2>{page === 'calendar' ? date ? formatFriendlyDate(date) : 'The section agenda' : page === 'saved' ? 'Your saved events' : 'The noticeboard'}</h2><span>{loading ? 'Loading…' : filtered.length + ' event'+(filtered.length === 1 ? '' : 's')}</span>{date && <button className="text-button" onClick={() => setDate(null)}>Clear date ×</button>}</div>{state || (filtered.length ? renderEvents(filtered) : <div className="quiet-empty"><Symbol name={page === 'saved' ? 'saved' : 'search'}/><h3>{page === 'saved' && !saved.length ? 'Your shortlist starts here.' : 'A little quiet here.'}</h3><p>{page === 'saved' && !saved.length ? 'Use the bookmark on any event to keep it close.' : 'No events match this view. Try another date or clear your filters.'}</p><button className="text-button" onClick={page === 'saved' && !saved.length ? () => onNavigate('events') : reset}>{page === 'saved' && !saved.length ? 'Find events →' : 'Reset filters →'}</button></div>)}</section></div>
      {page === 'saved' && <p className="local-note">Saved on this browser · Saving an event does not register your attendance.</p>}
    </>}
    {page === 'calendar' && isMobile && dayAgendaOpen && date && !selected && <DayEventsModal date={date} events={filtered} loading={loading} error={error} onRetry={refresh} filtered={!!search || category !== 'All'} onSelectEvent={setSelected} onClose={() => setDayAgendaOpen(false)}/>}
    {selected && <EventDetailsModal event={events.find(e => e.id === selected.id) || selected} onClose={() => setSelected(null)}/>}
  </div>
}
