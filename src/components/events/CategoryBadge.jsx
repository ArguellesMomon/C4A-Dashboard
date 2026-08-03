import React from 'react'

// Single source of truth for event categories and their colors.
// Keeping this in one file means the dropdown, badges, and calendar
// dots all stay in sync automatically.
export const CATEGORIES = ['Seminar', 'Workshop', 'Meeting', 'Deadline', 'Other']

const STYLES = {
  Seminar: 'bg-forest-700 text-cream-100',
  Workshop: 'bg-forest-500 text-cream-100',
  Meeting: 'bg-sage-300 text-forest-900',
  Deadline: 'bg-gold text-forest-950',
  Other: 'bg-cream-300 text-forest-800',
}

const DOT_STYLES = {
  Seminar: 'bg-forest-700',
  Workshop: 'bg-forest-500',
  Meeting: 'bg-sage-300',
  Deadline: 'bg-gold',
  Other: 'bg-cream-300',
}

export function CategoryDot({ category }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[category] || DOT_STYLES.Other}`} />
}

export default function CategoryBadge({ category }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide
        ${STYLES[category] || STYLES.Other}`}
    >
      {category}
    </span>
  )
}
