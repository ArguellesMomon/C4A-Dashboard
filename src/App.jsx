import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { EventsProvider } from './context/EventsContext.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import LoginModal from './components/auth/LoginModal.jsx'

function AppShell() {
  const { isAdmin } = useAuth()
  const [view, setView] = useState('dashboard') // 'dashboard' | 'admin'
  const [showLogin, setShowLogin] = useState(false)

  function handleChangeView(nextView) {
    if (nextView === 'admin' && !isAdmin) {
      setShowLogin(true)
      return
    }
    setView(nextView)
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-200">
      <Navbar view={view} onChangeView={handleChangeView} onRequestLogin={() => setShowLogin(true)} />

      <main className="flex-1">
        {view === 'admin' && isAdmin ? <AdminPanel /> : <Dashboard />}
      </main>

      <Footer />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false)
            setView('admin')
          }}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <AppShell />
      </EventsProvider>
    </AuthProvider>
  )
}
