import React from 'react'
import Modal from '../common/Modal.jsx'
import CategoryBadge from './CategoryBadge.jsx'
import { formatFriendlyDate, formatTime } from '../../lib/dateUtils.js'

export default function EventDetailsModal({ event, onClose }) {
  if (!event) return null

  return (
    <Modal title="Event details" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <CategoryBadge category={event.category} />
        <h3 className="font-display text-2xl font-semibold text-forest-900">{event.title}</h3>

        <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-forest-700/60">Date</dt>
          <dd className="text-forest-900">{formatFriendlyDate(event.date)}</dd>

          {event.time && (
            <>
              <dt className="text-forest-700/60">Time</dt>
              <dd className="text-forest-900">{formatTime(event.time)}</dd>
            </>
          )}

          {event.location && (
            <>
              <dt className="text-forest-700/60">Location</dt>
              <dd className="text-forest-900">{event.location}</dd>
            </>
          )}

          {event.organizer && (
            <>
              <dt className="text-forest-700/60">Organizer</dt>
              <dd className="text-forest-900">{event.organizer}</dd>
            </>
          )}
        </dl>

        {event.description && (
          <p className="border-t border-cream-300 pt-4 text-sm leading-relaxed text-forest-800">
            {event.description}
          </p>
        )}
      </div>
    </Modal>
  )
}
