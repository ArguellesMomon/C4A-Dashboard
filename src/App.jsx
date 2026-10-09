import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { EventsProvider, useEvents } from './context/EventsContext.jsx'
import { PreferencesProvider, usePreferences } from './context/PreferencesContext.jsx'
import StudentHub from './pages/StudentHub.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import LoginModal from './components/auth/LoginModal.jsx'
import NotificationBell from './components/layout/NotificationBell.jsx'
import Symbol from './components/common/Symbol.jsx'
import { useEventReminders } from './hooks/useEventReminders.js'
import logo from './assets/logo.png'
const links = [['overview','Overview'], ['events','All events'], ['calendar','Calendar'], ['saved','My saved'], ['guide','Section guide']]
function currentPage() { const value = window.location.hash.slice(1).split('?')[0]; return [...links.map(([id]) => id),'admin'].includes(value) ? value : 'overview' }
function AppShell() {
  const { isAdmin, admin, logout } = useAuth()
  const { events } = useEvents()
  const { theme, setTheme, saved } = usePreferences()
  useEventReminders(events)
  const [view, setView] = useState(currentPage)
  const [showLogin, setShowLogin] = useState(false)
  useEffect(() => { const update = () => setView(currentPage()); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])
  useEffect(() => { document.title = 'C4A Fieldnotes · ' + (links.find(([id]) => id === view)?.[1] || 'Officer workspace') }, [view])
  function navigate(id) { window.location.hash = id; setView(id.split('?')[0]); window.scrollTo({ top: 0, behavior: 'instant' }) }
  return <div className="app-shell">
    <a href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content').focus() }} className="skip-link">Skip to content</a>
    <aside className="sidebar">
      <a href="#overview" className="brand"><img src={logo} alt="C4A section emblem"/><span><strong>C4A<span className="brand-dot">.</span></strong><small>STUDENT SPACE</small></span></a>
      <div className="sidebar-label">YOUR SECTION, IN SYNC</div>
      <nav aria-label="Main navigation">{links.map(([id,label],index) => <a key={id} href={'#'+id} aria-current={view === id ? 'page' : undefined} className={'nav-item '+(view === id ? 'active' : '')}><Symbol name={id}/><span>{label}</span>{id === 'saved' && saved.length > 0 ? <b>{saved.length}</b> : <small>0{index+1}</small>}</a>)}</nav>
      <div className="sidebar-bottom"><div className="section-seal"><Symbol name="guide"/></div><p>Your section.<br/><strong>Your shared space.</strong></p><small>De La Salle Lipa</small><button aria-current={view === 'admin' && isAdmin ? 'page' : undefined} className={'officer-link'+(view === 'admin' && isAdmin ? ' active' : '')} onClick={() => isAdmin ? navigate('admin') : setShowLogin(true)}><Symbol name="admin"/>{isAdmin ? 'Officer workspace' : 'Officer sign in'}<span>↗</span></button></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><span className="topbar-context">DE LA SALLE LIPA <span>/</span> <strong>{view === 'admin' && isAdmin ? 'OFFICER WORKSPACE' : 'C4A STUDENT HUB'}</strong></span><div className="topbar-actions"><NotificationBell/><button className="icon-button officer-access" onClick={() => isAdmin ? navigate('admin') : setShowLogin(true)} aria-label={isAdmin ? 'Open officer workspace' : 'Officer sign in'}><Symbol name="admin"/></button><button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={'Switch to '+(theme === 'dark' ? 'light' : 'dark')+' mode'}><Symbol name={theme === 'dark' ? 'sun' : 'moon'}/></button>{isAdmin && <button className="text-button" onClick={logout}>Log out</button>}<span className="section-avatar" title={admin?.name || 'C4A section'}>C4A</span></div></header>
      <main id="main-content" tabIndex="-1" key={view} className="page-enter">{view === 'admin' && isAdmin ? <AdminPanel onNavigate={navigate}/> : <StudentHub page={view === 'admin' ? 'overview' : view} onNavigate={navigate}/>}</main>
      <footer className="hub-footer"><span>C4A FIELDNOTES <span>·</span> Made for our section.</span><span>ANIMO LA SALLE <span>·</span> {new Date().getFullYear()}</span></footer>
    </div>
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => { setShowLogin(false); navigate('admin') }}/>}
  </div>
}
export default function App() { return <AuthProvider><EventsProvider><PreferencesProvider><AppShell/></PreferencesProvider></EventsProvider></AuthProvider> }
