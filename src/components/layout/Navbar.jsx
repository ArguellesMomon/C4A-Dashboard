import React from 'react'
import Button from '../common/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar({ view, onChangeView, onRequestLogin }) {
  const { isAdmin, admin, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-forest-900/10 bg-forest-800 text-cream-100 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={() => onChangeView('dashboard')}
          className="flex items-center gap-2 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold font-display text-base font-bold text-forest-950">
            C4A
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-base font-semibold">Events &amp; Seminars</span>
            <span className="text-xs text-cream-100/60">De La Salle Lipa</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => onChangeView(view === 'admin' ? 'dashboard' : 'admin')}
                className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-forest-700"
              >
                {view === 'admin' ? 'View dashboard' : 'Manage events'}
              </button>
              <span className="hidden text-xs text-cream-100/60 md:inline">
                {admin.name}
              </span>
              <Button variant="secondary" onClick={logout}>Log out</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={onRequestLogin}>Officer login</Button>
          )}
        </div>
      </div>
    </header>
  )
}
