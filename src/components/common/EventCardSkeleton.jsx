import React from 'react'

export default function EventCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-cream-300 bg-cream-100 p-5">
      <div className="mb-3 h-5 w-20 rounded bg-cream-300" />
      <div className="mb-2 h-5 w-3/4 rounded bg-cream-300" />
      <div className="h-4 w-1/2 rounded bg-cream-300" />
    </div>
  )
}
