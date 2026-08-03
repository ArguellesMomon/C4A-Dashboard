import React from 'react'

export default function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-forest-300/50 bg-cream-100 px-6 py-12 text-center">
      <div className="text-3xl">🗓️</div>
      <p className="font-display text-lg font-semibold text-forest-900">{title}</p>
      <p className="max-w-xs text-sm text-forest-700/70">{message}</p>
    </div>
  )
}
