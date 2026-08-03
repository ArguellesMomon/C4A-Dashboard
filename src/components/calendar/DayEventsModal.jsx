import React from 'react'
import Modal from '../common/Modal.jsx'
import EventCard from '../events/EventCard.jsx'
import { formatFriendlyDate } from '../../lib/dateUtils.js'

export default function DayEventsModal({ date, events, onSelectEvent, onClose }) {
  return (
    <Modal title={formatFriendlyDate(date)} onClose={onClose}>
      {events.length === 0 ? (
        <p className="py-4 text-center text-sm text-forest-700/60">
          Nothing scheduled for this day.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
          ))}
        </div>
      )}
    </Modal>
  )
}
