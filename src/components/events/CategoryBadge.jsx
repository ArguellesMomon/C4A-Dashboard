import React from 'react'
import { GraduationCapIcon, WrenchIcon, UsersIcon, FlagIcon, TagIcon } from '../common/icons.jsx'

// Single source of truth for event categories, their colors, and their
// icons. Keeping this in one file means the dropdown, badges, and
// calendar dots all stay in sync automatically.
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

const ICONS = {
  Seminar: GraduationCapIcon,
  Workshop: WrenchIcon,
  Meeting: UsersIcon,
  Deadline: FlagIcon,
  Other: TagIcon,
}

export function CategoryDot({ category }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[category] || DOT_STYLES.Other}`} />
}

// A notched "tag" shape instead of a generic pill - a small deliberate
// touch that reads as designed rather than a default component.
const TAG_CLIP = 'polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)'

export default function CategoryBadge({ category }) {
  const Icon = ICONS[category] || TagIcon
  return (
    <span
      className={`inline-flex items-center gap-1.5 py-1 pl-3.5 pr-2.5 text-xs font-semibold tracking-wide
        ${STYLES[category] || STYLES.Other}`}
      style={{ clipPath: TAG_CLIP }}
    >
      <Icon className="h-3.5 w-3.5" />
      {category}
    </span>
  )
}
