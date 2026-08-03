import React, { useState } from 'react'
import Button from '../components/common/Button.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import EventFormModal from '../components/events/EventFormModal.jsx'
import CategoryBadge from '../components/events/CategoryBadge.jsx'
import { useEvents } from '../context/EventsContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatFriendlyDate, formatTime } from '../lib/dateUtils.js'

export default function AdminPanel() {
  const { admin } = useAuth()
  const { events, loading, createEvent, editEvent, removeEvent } = useEvents()
  const [formEvent, setFormEvent] = useState(null) // null = closed, {} = new, {...} = editing
  const [showForm, setShowForm] = useState(false)

  function openNewEventForm() {
    setFormEvent(null)
    setShowForm(true)
  }

  function openEditForm(event) {
    setFormEvent(event)
    setShowForm(true)
  }

  async function handleSave(data) {
    try {
      if (data.id) {
        await editEvent(data.id, data)
      } else {
        await createEvent(data)
      }
      setShowForm(false)
    } catch (err) {
      alert('Could not save this event. Please try again.')
      console.error(err)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event? This cannot be undone.')) return
    try {
      await removeEvent(id)
      setShowForm(false)
    } catch (err) {
      alert('Could not delete this event. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-forest-500">
            Signed in as {admin.role}
          </p>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Manage events</h1>
        </div>
        <Button variant="primary" onClick={openNewEventForm}>+ Add event</Button>
      </div>

      {loading ? (
        <p className="text-sm text-forest-700/60">Loading events...</p>
      ) : events.length === 0 ? (
        <EmptyState title="No events yet" message="Click 'Add event' to schedule the first one." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-100 shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sage-100 text-xs uppercase tracking-wide text-forest-700/70">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                <th className="hidden px-4 py-3 md:table-cell">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-cream-300">
                  <td className="px-4 py-3">
                    <div className="font-medium text-forest-900">{event.title}</div>
                    <div className="text-xs text-forest-700/60 sm:hidden">
                      {formatFriendlyDate(event.date)}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <CategoryBadge category={event.category} />
                  </td>
                  <td className="hidden px-4 py-3 text-forest-800 md:table-cell">
                    {formatFriendlyDate(event.date)}
                    {event.time && ` · ${formatTime(event.time)}`}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditForm(event)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-forest-700 hover:bg-sage-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EventFormModal
          initialEvent={formEvent}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
