import React, { useEffect, useState } from 'react'
import {
  isNotificationSupported,
  requestNotificationPermission,
  useRemindersEnabled,
} from '../../hooks/useEventReminders.js'

export default function NotificationBell() {
  const [permission, setPermission] = useState('default')
  const [enabled, toggleEnabled] = useRemindersEnabled()

  useEffect(() => {
    if (isNotificationSupported()) setPermission(Notification.permission)
  }, [])

  if (!isNotificationSupported()) return null

  // Browser-level permission was never granted yet - ask for it. Turning
  // reminders "on" here is what starts them; there's nothing to toggle
  // until permission exists.
  if (permission !== 'granted') {
    async function handleRequest() {
      const result = await requestNotificationPermission()
      setPermission(result)
    }

    return (
      <button
        onClick={handleRequest}
        disabled={permission === 'denied'}
        className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-forest-700 disabled:opacity-50"
        title={
          permission === 'denied'
            ? 'Notifications are blocked in your browser settings for this site.'
            : 'Get a browser reminder when an event is coming up'
        }
      >
        {permission === 'denied' ? '🔕 Notifications blocked' : '🔔 Get reminders'}
      </button>
    )
  }

  // Permission is granted - this is our own on/off switch, layered on top,
  // since a website can never revoke browser permission once granted.
  return (
    <button
      onClick={toggleEnabled}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-forest-700"
      title={enabled ? 'Turn off event reminders' : 'Turn on event reminders'}
    >
      {enabled ? '🔔 Reminders on' : '🔕 Reminders off'}
    </button>
  )
}