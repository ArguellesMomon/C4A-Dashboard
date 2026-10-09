import React from 'react'
import { usePreferences } from '../../context/PreferencesContext.jsx'
import Modal from '../common/Modal.jsx'
import Button from '../common/Button.jsx'
import CategoryBadge from './CategoryBadge.jsx'
import { CalendarIcon, ClockIcon, PinIcon, UsersIcon } from '../common/icons.jsx'
import { downloadICS, googleCalendarUrl } from '../../lib/calendarExport.js'
import { formatFriendlyDate, formatTime } from '../../lib/dateUtils.js'

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
      <div>
        <dt className="text-xs uppercase tracking-wide text-forest-700/80">{label}</dt>
        <dd className="text-sm text-forest-900">{value}</dd>
      </div>
    </div>
  )
}

export default function EventDetailsModal({ event, onClose }) {
  const { saved, toggleSaved } = usePreferences()
  if (!event) return null

  return (
    <Modal title="Event details" onClose={onClose}>
      <div className="event-details flex flex-col gap-4">
        <div className="flex items-center justify-between"><CategoryBadge category={event.category} /><button className="text-button" aria-pressed={saved.includes(event.id)} onClick={() => toggleSaved(event.id)}>{saved.includes(event.id) ? 'Saved ✓' : 'Save event +'}</button></div>
        <h3 className="font-display text-2xl font-semibold text-forest-900">{event.title}</h3>

        <dl className="event-details-meta">
          <DetailRow icon={CalendarIcon} label="Date" value={formatFriendlyDate(event.date)} />
          {event.time && <DetailRow icon={ClockIcon} label="Time" value={formatTime(event.time)} />}
          {event.location && <DetailRow icon={PinIcon} label="Location" value={event.location} />}
          {event.organizer && <DetailRow icon={UsersIcon} label="Organizer" value={event.organizer} />}
        </dl>

        {event.description && (
          <p className="border-t border-cream-300 pt-4 whitespace-pre-wrap text-sm leading-relaxed text-forest-800">
            {event.description}
          </p>
        )}

        <div className="flex flex-col gap-2 border-t border-cream-300 pt-4 sm:flex-row">
          <Button
            variant="secondary"
            className="flex-1 justify-center"
            onClick={() => window.open(googleCalendarUrl(event), '_blank', 'noopener')}
          >
            Add to Google Calendar
          </Button>
          <Button
            variant="ghost"
            className="flex-1 justify-center"
            onClick={() => downloadICS(event)}
          >
            Download .ics (Apple/Outlook)
          </Button>
        </div>
      </div>
    </Modal>
  )
}
