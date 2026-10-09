import React from 'react'
import { GraduationCapIcon, WrenchIcon, UsersIcon, FlagIcon, TagIcon } from '../common/icons.jsx'

// Single source of truth for event categories, their colors, and their
// icons. Keeping this in one file means the dropdown, badges, and
// calendar dots all stay in sync automatically.
export const CATEGORIES = ['Seminar', 'Workshop', 'Meeting', 'Deadline', 'Other']

const ICONS = {
  Seminar: GraduationCapIcon,
  Workshop: WrenchIcon,
  Meeting: UsersIcon,
  Deadline: FlagIcon,
  Other: TagIcon,
}

export function CategoryDot({ category }) {
  return <span className="category-dot" data-category={category} aria-hidden="true" />
}

export default function CategoryBadge({ category }) {
  const Icon = ICONS[category] || TagIcon
  return <span className="category-chip" data-category={category}><Icon className="h-3.5 w-3.5"/>{category}</span>
}
