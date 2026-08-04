import React from 'react'

// A quiet, tiled line pattern for the hero background. Uses currentColor
// so it inherits whatever text color its parent sets - pair it with a
// low opacity className (e.g. "opacity-10 text-cream-100") so it reads
// as texture, not decoration competing with the headline.
export default function HeroPattern({ className = '' }) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id="c4a-topo" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M0 60 Q30 20 60 60 T120 60" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M0 95 Q30 55 60 95 T120 95" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M0 25 Q30 -15 60 25 T120 25" stroke="currentColor" strokeWidth="1" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#c4a-topo)" />
    </svg>
  )
}
