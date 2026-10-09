import React, { useEffect, useMemo, useState } from 'react'
import Button from '../components/common/Button.jsx'
import ConfirmModal from '../components/common/ConfirmModal.jsx'
import Symbol from '../components/common/Symbol.jsx'
import EventFormModal from '../components/events/EventFormModal.jsx'
import EventDetailsModal from '../components/events/EventDetailsModal.jsx'
import CategoryBadge, { CATEGORIES } from '../components/events/CategoryBadge.jsx'
import { useEvents } from '../context/EventsContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { daysUntil, formatFriendlyDate, formatTime } from '../lib/dateUtils.js'
import { selectEvents } from '../lib/eventFilters.js'
import { duplicateEvent } from '../lib/eventEditor.js'
const PAGE_SIZE = 8
function needsDetails(event) { return !event.time || !event.location?.trim() }
function statusLabel(event) { const days = daysUntil(event.date); return days < 0 ? 'Past' : days === 0 ? 'Today' : 'Upcoming' }
export default function AdminPanel({ onNavigate = id => { window.location.hash = id } }) {
  const { admin } = useAuth()
  const { events, loading, error, refresh, createEvent, editEvent, removeEvent } = useEvents()
  const [formEvent, setFormEvent] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [preview, setPreview] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [notice, setNotice] = useState('')
  const [openMenu, setOpenMenu] = useState(null)
  useEffect(() => {
    function outside(event) { if (!event.target.closest?.('.admin-row-menu')) setOpenMenu(null) }
    function escape(event) { if (event.key === 'Escape') setOpenMenu(null) }
    document.addEventListener('pointerdown',outside); document.addEventListener('keydown',escape)
    return () => { document.removeEventListener('pointerdown',outside); document.removeEventListener('keydown',escape) }
  }, [])
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState('all')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('soonest')
  const [page, setPage] = useState(1)
  const filtered = useMemo(() => selectEvents(events, { period: scope === 'upcoming' ? 'upcoming' : scope === 'past' ? 'past' : 'all', category, search, sort }).filter(event => scope === 'week' ? daysUntil(event.date) >= 0 && daysUntil(event.date) <= 7 : scope === 'attention' ? daysUntil(event.date) >= 0 && needsDetails(event) : true), [events,scope,category,search,sort])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const upcoming = events.filter(event => daysUntil(event.date) >= 0)
  const week = upcoming.filter(event => daysUntil(event.date) <= 7)
  const incomplete = upcoming.filter(needsDetails)
  const metrics = [[events.length,'All events','events','all'],[week.length,'In the next 7 days','calendar','week'],[incomplete.length,'Need time or venue','guide','attention']]
  function changeFilter(setter, value) { setter(value); setPage(1) }
  function resetFilters() { setSearch(''); setCategory('All'); setScope('all'); setSort('soonest'); setPage(1) }
  function openForm(event = null) { setFormEvent(event); setShowForm(true) }
  function duplicate(event) {
    openForm(duplicateEvent(event))
  }
  function closeMenu(event) { event.currentTarget.closest('details')?.querySelector('summary')?.focus(); setOpenMenu(null) }
  async function handleSave(data) {
    if (data.id) await editEvent(data.id, data)
    else await createEvent(data)
    setShowForm(false)
    setNotice(data.id ? 'Event updated. Your section will see the latest details.' : 'Event published to the section noticeboard.')
  }
  function requestDelete(event) { setDeleteError(''); setPendingDelete(event) }
  async function confirmDelete() {
    if (deleting || !pendingDelete) return
    setDeleting(true)
    try { await removeEvent(pendingDelete.id); setPendingDelete(null); setNotice('Event removed from the section noticeboard.') }
    catch { setDeleteError('Could not delete this event. Please try again.') }
    finally { setDeleting(false) }
  }
  return <div className="hub-page officer-page">
    <header className="admin-heading"><div><p className="eyebrow">C4A / OFFICER WORKSPACE</p><h1>Keep your section in sync.</h1><p className="page-description">Publish, organize, and fine-tune the moments that bring C4A together.</p></div><div className="admin-heading-actions"><button className="admin-student-link" onClick={() => onNavigate('overview')}>Student view <Symbol name="arrow"/></button><Button onClick={() => openForm()}><span aria-hidden="true">+</span> Create event</Button></div></header>
    <div className="admin-identity"><span className="admin-identity-icon"><Symbol name="admin"/></span><span><strong>{admin?.name || 'C4A officer'}</strong><small>{admin?.role || 'Officer'} · Section event management</small></span><span className="admin-access-label">Officer access</span></div>
    {notice && <div className="admin-notice" role="status"><span>{notice}</span><button className="icon-button" aria-label="Dismiss update" onClick={() => setNotice('')}>×</button></div>}
    <section className="section-metrics admin-metrics" aria-label="Event management summary">{metrics.map(([count,label,icon,target]) => <button key={target} className={'metric-card' + (scope === target ? ' metric-active' : '')} onClick={() => changeFilter(setScope,target)} aria-pressed={scope === target}><span className="metric-icon"><Symbol name={icon}/></span><span className="metric-copy"><strong>{loading || error ? '—' : count}</strong><span>{label}</span></span><Symbol name="arrow"/></button>)}</section>
    <section className="admin-manager" aria-labelledby="admin-events-title">
      <div className="admin-manager-heading"><div><h2 id="admin-events-title">Section events</h2><p>Changes here are shared with every student.</p></div><button className="admin-refresh" disabled={loading} onClick={refresh}><span aria-hidden="true">↻</span>{loading ? 'Refreshing…' : 'Refresh'}</button></div>
      <div className="admin-tools"><label className="search-field"><Symbol name="search"/><input aria-label="Search managed events" value={search} onChange={event => changeFilter(setSearch,event.target.value)} placeholder="Search title, venue, or organizer…"/>{search && <button aria-label="Clear search" onClick={() => changeFilter(setSearch,'')}>×</button>}</label><select aria-label="Filter event category" value={category} onChange={event => changeFilter(setCategory,event.target.value)}><option value="All">All categories</option>{CATEGORIES.map(value => <option key={value}>{value}</option>)}</select><select aria-label="Sort managed events" value={sort} onChange={event => changeFilter(setSort,event.target.value)}><option value="soonest">Soonest first</option><option value="latest">Latest first</option><option value="title">Title A–Z</option></select></div>
      <div className="admin-scope-tabs" aria-label="Event status filter">{[['all','All events'],['upcoming','Upcoming'],['past','Past'],['week','This week'],['attention','Needs details']].map(([value,label]) => <button key={value} className={scope === value ? 'selected' : ''} aria-pressed={scope === value} onClick={() => changeFilter(setScope,value)}>{label}</button>)}</div>
      {loading ? <div className="admin-loading" role="status" aria-busy="true"><p>Updating your noticeboard…</p>{[1,2,3].map(value => <div className="admin-loading-row" key={value}/>)}</div> : error ? <div className="admin-empty" role="alert"><Symbol name="events"/><h3>The noticeboard is unavailable.</h3><p>{error}</p><Button onClick={refresh}>Try again</Button></div> : !filtered.length ? <div className="admin-empty"><Symbol name="events"/><h3>{events.length ? 'No events match this view.' : 'Your first event starts here.'}</h3><p>{events.length ? 'Try another search or clear your filters to see everything.' : 'Create a workshop, meeting, seminar, or deadline for the section.'}</p><Button variant={events.length ? 'secondary' : 'primary'} onClick={events.length ? resetFilters : () => openForm()}>{events.length ? 'Reset filters' : '+ Create event'}</Button></div> : <>
        <table className="admin-table"><caption className="sr-only">C4A events with schedule, status, and management actions</caption><thead><tr><th scope="col">Event</th><th scope="col">Schedule</th><th scope="col">Status</th><th scope="col" className="admin-actions-heading">Manage</th></tr></thead><tbody>{visible.map(event => <tr key={event.id}>
          <td className="admin-event-cell"><CategoryBadge category={event.category}/><button className="admin-event-title" onClick={() => setPreview(event)}>{event.title}</button><p>{event.location || 'Venue not set'}{event.organizer ? ' · '+event.organizer : ''}</p>{daysUntil(event.date) >= 0 && needsDetails(event) && <span className="admin-detail-note">{!event.time && !event.location?.trim() ? 'Add time & venue' : !event.time ? 'Add a time' : 'Add a venue'}</span>}</td>
          <td className="admin-schedule-cell" data-label="Schedule"><strong>{formatFriendlyDate(event.date)}</strong><span>{event.time ? formatTime(event.time) : 'Time not set'}</span></td>
          <td className="admin-status-cell" data-label="Status"><span className="admin-event-status" data-status={statusLabel(event)}>{statusLabel(event)}</span></td>
          <td className="admin-actions-cell"><Button variant="secondary" onClick={() => openForm(event)}>Edit<span className="sr-only"> {event.title}</span></Button><details className="admin-row-menu" open={openMenu === event.id}><summary onClick={click => { click.preventDefault(); setOpenMenu(openMenu === event.id ? null : event.id) }} aria-label={'More actions for '+event.title}>•••</summary><div className="admin-row-actions"><button onClick={click => { closeMenu(click); setPreview(event) }}>View details</button><button onClick={click => { closeMenu(click); duplicate(event) }}>Duplicate event</button><button className="admin-delete-action" onClick={click => { closeMenu(click); requestDelete(event) }}>Delete event</button></div></details></td>
        </tr>)}</tbody></table>
        <div className="admin-pagination"><p>Showing {(currentPage-1)*PAGE_SIZE+1}–{Math.min(currentPage*PAGE_SIZE,filtered.length)} of {filtered.length} events</p><div><button aria-label="Previous events page" disabled={currentPage === 1} onClick={() => setPage(currentPage-1)}>‹</button><span>Page {currentPage} of {pages}</span><button aria-label="Next events page" disabled={currentPage === pages} onClick={() => setPage(currentPage+1)}>›</button></div></div>
      </>}
    </section>
    <p className="admin-bottom-note"><Symbol name="guide"/>Tip: use “Needs details” to catch upcoming events missing a time or venue before students ask.</p>
    {showForm && <EventFormModal initialEvent={formEvent} onSave={handleSave} onClose={() => setShowForm(false)}/>}
    {preview && <EventDetailsModal event={events.find(event => event.id === preview.id) || preview} onClose={() => setPreview(null)}/>}
    {pendingDelete && <ConfirmModal title="Delete this event?" message={'“'+pendingDelete.title+'” will be removed for every student. This cannot be undone.'} confirmLabel="Delete event" danger busy={deleting} error={deleteError} onConfirm={confirmDelete} onCancel={() => { if (!deleting) setPendingDelete(null) }}/>}
  </div>
}
