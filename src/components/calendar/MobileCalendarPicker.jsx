import React, { useEffect, useState } from 'react'
import CalendarView from './CalendarView.jsx'
import Modal from '../common/Modal.jsx'
import Symbol from '../common/Symbol.jsx'
import { isToday, toISODate } from '../../lib/dateUtils.js'
function weekStart(iso) {
  const date = iso ? new Date(iso + 'T00:00:00') : new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - date.getDay())
  return date
}
export default function MobileCalendarPicker({ events, selectedDate, onSelectDate }) {
  const [start, setStart] = useState(() => weekStart(selectedDate))
  const [expanded, setExpanded] = useState(false)
  useEffect(() => { if (selectedDate) setStart(weekStart(selectedDate)) }, [selectedDate])
  const days = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(start)
    day.setDate(day.getDate() + offset)
    return { day, iso: toISODate(day) }
  })
  function shiftWeek(delta) {
    setStart(previous => { const next = new Date(previous); next.setDate(next.getDate() + delta * 7); return next })
  }
  function selectDate(iso) {
    if (!iso) { setStart(weekStart()); return }
    setExpanded(false)
    onSelectDate(iso)
  }
  return <div className="mobile-calendar-picker">
    <div className="week-toolbar">
      <button className="month-expand" onClick={() => setExpanded(true)} aria-haspopup="dialog"><Symbol name="calendar"/><span>{start.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</span><span aria-hidden="true">⌄</span></button>
      <button className="week-today" onClick={() => { setStart(weekStart()); onSelectDate(toISODate(new Date())) }}>Today</button>
    </div>
    <div className="week-range"><button className="icon-button" aria-label="Previous week" onClick={() => shiftWeek(-1)}>‹</button><span aria-live="polite">{days[0].day.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} – {days[6].day.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</span><button className="icon-button" aria-label="Next week" onClick={() => shiftWeek(1)}>›</button></div>
    <div className="week-strip">{days.map(({ day, iso }) => {
      const count = events.filter(event => event.date === iso).length
      return <button key={iso} onClick={() => onSelectDate(iso)} aria-pressed={selectedDate === iso} aria-current={isToday(iso) ? 'date' : undefined} aria-label={day.toLocaleDateString('en-PH', { dateStyle: 'full' }) + ', ' + count + ' events'} className={'week-day' + (selectedDate === iso ? ' selected' : '') + (isToday(iso) ? ' today' : '')}><small>{day.toLocaleDateString('en-PH', { weekday: 'short' }).slice(0, 1)}</small><strong>{day.getDate()}</strong><span className={'week-dot' + (count ? ' has-events' : '')} aria-hidden="true"/></button>
    })}</div>
    <p className="week-hint">Tap a day for its events · Tap the month to expand</p>
    {expanded && <Modal title="Choose a date" onClose={() => setExpanded(false)} maxWidth="max-w-lg"><div className="expanded-calendar"><CalendarView events={events} selectedDate={selectedDate} initialDate={toISODate(start)} onSelectDate={selectDate}/></div><p className="calendar-hint">Choose a date to open its agenda.</p></Modal>}
  </div>
}
