import React, { useState } from 'react'
import Button from '../common/Button.jsx'
import NotificationBell from './NotificationBell.jsx'
import { UserIcon } from '../common/icons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import logo from '../../assets/logo.png'

export default function Navbar({ view, onChangeView, onRequestLogin }) {
  const { isAdmin, admin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleNav(nextView) {
    setMenuOpen(false)
    onChangeView(nextView)
  }

  function handleLogout() {
    setMenuOpen(false)
    logout()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-forest-900/10 bg-forest-800 text-cream-100 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={() => handleNav('dashboard')}
          className="flex min-w-0 items-center gap-2 text-left"
        >
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl sm:h-10 sm:w-10">
            <img src={logo} alt="C4A Dashboard" className="h-full w-full object-cover" />
          </div>
          {/* Shows on every screen size now, not just sm+ - just truncates
              instead of disappearing, so portrait phones still get a title. */}
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-sm font-semibold sm:text-base">
              Events &amp; Seminars
            </span>
            <span className="hidden text-xs text-cream-100/60 sm:block">De La Salle Lipa</span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NotificationBell />

          {isAdmin ? (
            <>
              {/* Desktop/tablet: full inline controls */}
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  onClick={() => handleNav(view === 'admin' ? 'dashboard' : 'admin')}
                  className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-forest-700"
                >
                  {view === 'admin' ? 'View dashboard' : 'Manage events'}
                </button>
                <span className="hidden text-xs text-cream-100/60 md:inline">{admin.name}</span>
                <Button variant="secondary" onClick={handleLogout}>Log out</Button>
              </div>

              {/* Mobile: everything collapses into one dropdown menu */}
              <div className="relative sm:hidden">
                <button
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-label="Officer menu"
                  aria-expanded={menuOpen}
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-forest-700"
                >
                  <UserIcon />
                </button>

                {menuOpen && (
                  <>
                    {/* Invisible backdrop so tapping outside closes the menu */}
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-cream-300 bg-cream-100 text-forest-900 shadow-card">
                      <p className="border-b border-cream-300 px-4 py-2 text-xs text-forest-700/70">
                        {admin.name} · {admin.role}
                      </p>
                      <button
                        onClick={() => handleNav(view === 'admin' ? 'dashboard' : 'admin')}
                        className="block w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-sage-100"
                      >
                        {view === 'admin' ? 'View dashboard' : 'Manage events'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Button variant="secondary" onClick={onRequestLogin}>Officer login</Button>
          )}
        </div>
      </div>
    </header>
  )
}
