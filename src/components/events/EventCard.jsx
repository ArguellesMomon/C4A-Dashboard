import React from 'react'
import CategoryBadge from './CategoryBadge.jsx'
import { ClockIcon, PinIcon } from '../common/icons.jsx'
import Symbol from '../common/Symbol.jsx'
import { usePreferences } from '../../context/PreferencesContext.jsx'
import { formatTime, daysUntil } from '../../lib/dateUtils.js'
export default function EventCard({ event, onClick }) {
  const { saved, toggleSaved } = usePreferences()
  const bookmarked = saved.includes(event.id)
  const days = daysUntil(event.date)
  const date = new Date(event.date+'T00:00:00')
  return <article data-category={event.category} className={'event-card '+(days < 0 ? 'past-event' : '')}>
    <div className="event-card-top"><CategoryBadge category={event.category}/><button className={'bookmark-button '+(bookmarked ? 'is-saved' : '')} aria-label={(bookmarked ? 'Unsave ' : 'Save ')+event.title} aria-pressed={bookmarked} onClick={() => toggleSaved(event.id)}><Symbol name="saved"/></button></div>
    <button className="event-card-main" onClick={onClick}><div className="event-card-body"><div className="event-date"><strong>{date.getDate()}</strong><span>{date.toLocaleDateString('en-US',{month:'short'})}<br/>{date.getFullYear()}</span></div><div className="event-card-copy"><h3>{event.title}</h3><div className="event-meta"><span><ClockIcon className="h-4 w-4"/>{event.time ? formatTime(event.time) : 'Time to be announced'}</span><span><PinIcon className="h-4 w-4"/>{event.location || 'Venue to be announced'}</span></div></div></div><div className="event-card-bottom"><span>{days < 0 ? 'IN THE ARCHIVE' : days === 0 ? 'HAPPENING TODAY' : days === 1 ? 'TOMORROW' : 'IN '+days+' DAYS'}</span><span className="event-view-label">View details <Symbol name="arrow"/></span></div></button>
  </article>
}
