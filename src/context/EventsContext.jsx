import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as db from '../lib/database.js'

const EventsContext = createContext(null)

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const all = await db.getEvents()
      setEvents(all)
      setError('')
    } catch (err) {
      setError('Could not load events. Check your internet connection.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load, plus a live subscription so every open dashboard
  // (student or officer) reflects changes instantly - no refresh needed.
  useEffect(() => {
    refresh()
    const unsubscribe = db.subscribeToEvents(() => refresh())
    return unsubscribe
  }, [refresh])

  async function createEvent(event) {
    await db.addEvent(event)
    // No manual refresh() call needed here - the realtime subscription
    // above will pick up the insert and update everyone's view, including
    // the officer who just created it.
  }

  async function editEvent(id, updates) {
    await db.updateEvent(id, updates)
  }

  async function removeEvent(id) {
    await db.deleteEvent(id)
  }

  const value = { events, loading, error, createEvent, editEvent, removeEvent }
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used inside <EventsProvider>')
  return ctx
}
