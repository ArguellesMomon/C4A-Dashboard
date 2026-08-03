import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-cream-300 py-6 text-center text-xs text-forest-700/60">
      Built for C4A students · De La Salle Lipa · {new Date().getFullYear()}
    </footer>
  )
}
