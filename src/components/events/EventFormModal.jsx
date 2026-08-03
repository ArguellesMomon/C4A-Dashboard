import React, { useState } from 'react'
import Modal from '../common/Modal.jsx'
import Button from '../common/Button.jsx'
import { CATEGORIES } from './CategoryBadge.jsx'
import { toISODate } from '../../lib/dateUtils.js'

const EMPTY_FORM = {
  title: '',
  category: 'Seminar',
  date: toISODate(new Date()),
  time: '',
  location: '',
  organizer: '',
  description: '',
}

export default function EventFormModal({ initialEvent, onSave, onDelete, onClose }) {
  const isEditing = !!initialEvent
  const [form, setForm] = useState(initialEvent ? { ...initialEvent } : EMPTY_FORM)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.date) {
      setError('Title and date are required.')
      return
    }
    onSave(form)
  }

  return (
    <Modal title={isEditing ? 'Edit event' : 'Add new event'} onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <Field label="Event title">
          <input
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="input"
            placeholder="e.g. UI/UX Design Seminar"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Time (optional)">
            <input
              type="time"
              value={form.time}
              onChange={(e) => updateField('time', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Location (optional)">
            <input
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="input"
              placeholder="e.g. RTL 301"
            />
          </Field>
        </div>

        <Field label="Organizer (optional)">
          <input
            value={form.organizer}
            onChange={(e) => updateField('organizer', e.target.value)}
            className="input"
            placeholder="e.g. C4A Officers"
          />
        </Field>

        <Field label="Description (optional)">
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="input min-h-[90px] resize-y"
            placeholder="Add any details students should know..."
          />
        </Field>

        <div className="flex items-center justify-between border-t border-cream-300 pt-4">
          <div>
            {isEditing && (
              <Button variant="danger" type="button" onClick={() => onDelete(form.id)}>
                Delete event
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Save changes' : 'Add event'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-forest-800">{label}</span>
      {children}
    </label>
  )
}
