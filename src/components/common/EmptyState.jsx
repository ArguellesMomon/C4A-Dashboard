import React from 'react'
import { CalendarSearchIcon } from './icons.jsx'

export default function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-forest-300/50 bg-cream-100 px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-forest-600">
        <CalendarSearchIcon className="h-8 w-8" />
      </div>
      <p className="font-display text-lg font-semibold text-forest-900">{title}</p>
      <p className="max-w-xs text-sm text-forest-700/70">{message}</p>
    </div>
  )
}
