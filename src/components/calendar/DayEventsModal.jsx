import React from 'react'
import Modal from '../common/Modal.jsx'
import CategoryBadge from '../events/CategoryBadge.jsx'
import Symbol from '../common/Symbol.jsx'
import { usePreferences } from '../../context/PreferencesContext.jsx'
import { formatFriendlyDate, formatTime } from '../../lib/dateUtils.js'
export default function DayEventsModal({ date, events, loading = false, error = '', onRetry, onSelectEvent, onClose, filtered = false }) {
  const { saved, toggleSaved } = usePreferences()
  return <Modal title={formatFriendlyDate(date)} onClose={onClose} maxWidth="max-w-lg">
    <div className="day-agenda">
      {loading ? <p role="status">Loading this day’s events…</p> : error ? <div role="alert" className="day-agenda-empty"><h3>Events are unavailable.</h3><p>{error}</p><button className="primary-action" onClick={onRetry}>Try again</button></div> : <>
        <p className="day-agenda-count">{events.length} {events.length === 1 ? 'event' : 'events'}{filtered ? ' matching your filters' : ' on the section agenda'}</p>
        {events.length === 0 ? <div className="day-agenda-empty"><Symbol name="calendar"/><h3>A little breathing room.</h3><p>{filtered ? 'No events match your filters on this day.' : 'Nothing scheduled for this day.'}</p></div> : <div className="day-agenda-list">{events.map(event => <article className="day-agenda-row" key={event.id}>
          <button className="day-agenda-event" onClick={() => onSelectEvent(event)}><span className="day-agenda-time">{event.time ? formatTime(event.time) : 'All day'}</span><span className="day-agenda-info"><CategoryBadge category={event.category}/><strong>{event.title}</strong><small>{event.location || 'Venue to be announced'}</small></span><Symbol name="arrow"/></button>
          <button className="bookmark-button" aria-label={(saved.includes(event.id) ? 'Unsave ' : 'Save ') + event.title} aria-pressed={saved.includes(event.id)} onClick={() => toggleSaved(event.id)}><Symbol name="saved"/></button>
        </article>)}</div>}
        <button className="day-agenda-done text-button" onClick={onClose}>Back to planner</button>
      </>}
    </div>
  </Modal>
}
