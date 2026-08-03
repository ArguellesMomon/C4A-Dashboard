import { useEffect, useState } from 'react'
import { daysUntil } from '../lib/dateUtils.js'

// NOTE ON HOW THIS WORKS (please read before relying on it):
// This uses the browser's built-in Notification API, checked while the
// dashboard tab is open. It is NOT a true background push notification -
// if the student's browser/tab is closed, no notification will fire.
// A real "notify me even when the app is closed" system needs a service
// worker + a push server (e.g. web-push with VAPID keys, or a Supabase
// Edge Function on a cron schedule) - that's a bigger project. This is
// the simple version: remind students of events coming up soon, for as
// long as they have the dashboard open somewhere.
//
// Two separate on/off switches are involved, and it's worth knowing the
// difference:
// 1. Browser permission (Notification.permission) - granted once, and a
//    website can never programmatically turn this back off. Only the
//    student can revoke it, from their browser's own site settings.
// 2. App-level preference (below) - our own on/off switch, stored in
//    localStorage, that this app respects on top of browser permission.
//    This is what lets someone "turn notifications off" from inside the
//    dashboard without having to dig through browser settings.

const NOTIFIED_KEY = 'c4a_notified_events'
const ENABLED_KEY = 'c4a_reminders_enabled'
const CHECK_INTERVAL_MS = 5 * 60 * 1000 // re-check every 5 minutes
const REMINDER_WINDOW_DAYS = 1 // notify for events happening today or tomorrow

function getNotifiedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY)) || [])
  } catch {
    return new Set()
  }
}

function saveNotifiedIds(ids) {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]))
}

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function requestNotificationPermission() {
  if (!isNotificationSupported()) return Promise.resolve('unsupported')
  return Notification.requestPermission()
}

// The app-level on/off switch. Defaults to "on" the first time someone
// grants browser permission (see NotificationBell), then persists here.
export function getRemindersEnabled() {
  return localStorage.getItem(ENABLED_KEY) !== 'false' // default: enabled
}

export function setRemindersEnabled(enabled) {
  localStorage.setItem(ENABLED_KEY, String(enabled))
}

// Small hook so the bell button re-renders when the preference changes,
// even though the value itself lives in localStorage.
export function useRemindersEnabled() {
  const [enabled, setEnabled] = useState(getRemindersEnabled)

  function toggle() {
    const next = !enabled
    setRemindersEnabled(next)
    setEnabled(next)
  }

  return [enabled, toggle]
}

// Call this once near the top of the app with the current events list.
// It checks immediately, then on an interval, and notifies once per
// event (tracked in localStorage so reminders don't repeat every check).
// Respects both browser permission AND the app-level on/off switch.
export function useEventReminders(events) {
  useEffect(() => {
    if (!isNotificationSupported()) return
    if (Notification.permission !== 'granted') return

    function checkAndNotify() {
      if (!getRemindersEnabled()) return // turned off from inside the app

      const notified = getNotifiedIds()
      let changed = false

      for (const event of events) {
        const days = daysUntil(event.date)
        if (days < 0 || days > REMINDER_WINDOW_DAYS) continue
        if (notified.has(event.id)) continue

        new Notification(event.title, {
          body:
            days === 0
              ? `Happening today${event.time ? ` at ${event.time}` : ''}${event.location ? ` · ${event.location}` : ''}`
              : `Happening tomorrow${event.location ? ` · ${event.location}` : ''}`,
          tag: event.id, // avoids duplicate OS-level notifications for the same event
        })
        notified.add(event.id)
        changed = true
      }

      if (changed) saveNotifiedIds(notified)
    }

    checkAndNotify()
    const interval = setInterval(checkAndNotify, CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [events])
}