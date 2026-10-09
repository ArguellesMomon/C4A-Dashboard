import React, { useState } from 'react'
import Modal from '../common/Modal.jsx'
import Button from '../common/Button.jsx'
import CategoryBadge, { CATEGORIES } from './CategoryBadge.jsx'
import { formatFriendlyDate, formatTime } from '../../lib/dateUtils.js'
import { eventFormValues, eventPayload } from '../../lib/eventEditor.js'
export default function EventFormModal({ initialEvent, onSave, onClose }) {
  const isEditing = !!initialEvent?.id
  const [form, setForm] = useState(() => eventFormValues(initialEvent))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  function updateField(field, value) { setForm(previous => ({ ...previous, [field]: value })) }
  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return
    if (!form.title.trim() || !form.date) { setError('Add an event title and date to continue.'); return }
    setSubmitting(true); setError('')
    const data = eventPayload(form, isEditing ? initialEvent.id : null)
    try { await onSave(data) }
    catch { setError('Could not save this event. Your changes are still here. Please try again.') }
    finally { setSubmitting(false) }
  }
  return <Modal title={isEditing ? 'Edit section event' : 'Create section event'} onClose={() => { if (!submitting) onClose() }} maxWidth="max-w-xl">
    <form className="event-editor" onSubmit={handleSubmit}>
      <p className="editor-intro">{isEditing ? 'Keep the details accurate for your section.' : 'Give your section something to look forward to.'} Required fields are marked with *.</p>
      {error && <p role="alert" className="login-error">{error}</p>}
      <fieldset disabled={submitting} className="editor-section"><legend>01 / The essentials</legend>
        <Field label="Event title *"><input required value={form.title} onChange={event => updateField('title',event.target.value)} className="input" placeholder="e.g. UI/UX Design Seminar"/></Field>
        <div className="editor-field-grid"><Field label="Category"><select className="input" value={form.category} onChange={event => updateField('category',event.target.value)}>{CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></Field><Field label="Date *"><input required type="date" value={form.date} onChange={event => updateField('date',event.target.value)} className="input"/></Field></div>
        <div className="editor-field-grid"><Field label="Time" hint="Optional · Philippine time"><input type="time" value={form.time} onChange={event => updateField('time',event.target.value)} className="input"/></Field><Field label="Venue" hint="Optional · room, link, or location"><input value={form.location} onChange={event => updateField('location',event.target.value)} className="input" placeholder="e.g. RTL 301"/></Field></div>
      </fieldset>
      <fieldset disabled={submitting} className="editor-section"><legend>02 / A little more context</legend>
        <Field label="Organizer" hint="Optional"><input value={form.organizer} onChange={event => updateField('organizer',event.target.value)} className="input" placeholder="e.g. C4A Officers"/></Field>
        <Field label="Description" hint="Optional · what should students know?"><textarea value={form.description} onChange={event => updateField('description',event.target.value)} className="input" rows="4" placeholder="What to bring, who should attend, and any important details…"/></Field>
      </fieldset>
      <details className="editor-preview"><summary>Student preview <span aria-hidden="true">⌄</span></summary><div><CategoryBadge category={form.category}/><h3>{form.title.trim() || 'Your event title'}</h3><p>{form.date ? formatFriendlyDate(form.date) : 'Choose a date'}{form.time ? ' · '+formatTime(form.time) : ' · Time to be announced'}</p><p>{form.location.trim() || 'Venue to be announced'}{form.organizer.trim() ? ' · '+form.organizer.trim() : ''}</p>{form.description && <p className="editor-preview-description">{form.description}</p>}</div></details>
      <div className="editor-footer"><p>Visible to all C4A students after saving.</p><div><Button variant="ghost" disabled={submitting} onClick={onClose}>Cancel</Button><Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Publish event'}</Button></div></div>
    </form>
  </Modal>
}
function Field({ label, hint, children }) { return <label className="editor-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label> }
