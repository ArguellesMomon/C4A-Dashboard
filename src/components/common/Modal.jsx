import React, { useEffect } from 'react'
import { XIcon } from './icons.jsx'

export default function Modal({ title, onClose, children, maxWidth = 'max-w-md' }) {
  // Let people close the modal with Escape, a small usability win.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/50 p-4"
      onClick={onClose}
    >
      <div
        className={`animate-modal-in w-full ${maxWidth} rounded-2xl bg-cream-100 shadow-card
          max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-cream-300 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-forest-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1 text-forest-700 hover:bg-sage-100"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
