import React from 'react'

const VARIANTS = {
  primary: 'bg-forest-700 text-cream-100 hover:bg-forest-800',
  secondary: 'bg-cream-100 text-forest-800 border border-forest-300/40 hover:bg-sage-100',
  danger: 'bg-red-700 text-cream-100 hover:bg-red-800',
  ghost: 'bg-transparent text-forest-800 hover:bg-sage-100',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
