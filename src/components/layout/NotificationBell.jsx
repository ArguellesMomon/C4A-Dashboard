import React, { useEffect, useState } from 'react'
import { BellIcon, BellOffIcon } from '../common/icons.jsx'
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

  if (permission !== 'granted') {
    async function handleRequest() {
      const result = await requestNotificationPermission()
      setPermission(result)
    }

    return (
      <button
        aria-label={permission === 'denied' ? 'Notifications blocked' : 'Enable event reminders'}
        onClick={handleRequest}
        disabled={permission === 'denied'}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold
          hover:bg-forest-700 disabled:opacity-50 sm:gap-2 sm:px-3"
        title={
          permission === 'denied'
            ? 'Notifications are blocked in your browser settings for this site.'
            : 'Get a browser reminder when an event is coming up'
        }
      >
        {permission === 'denied' ? <BellOffIcon /> : <BellIcon />}
        <span className="hidden sm:inline">
          {permission === 'denied' ? 'Notifications blocked' : 'Get reminders'}
        </span>
      </button>
    )
  }

  return (
    <button
      aria-label={enabled ? 'Turn off event reminders' : 'Turn on event reminders'}
      aria-pressed={enabled}
      onClick={toggleEnabled}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold
        hover:bg-forest-700 sm:gap-2 sm:px-3"
      title={enabled ? 'Turn off event reminders' : 'Turn on event reminders'}
    >
      {enabled ? <BellIcon /> : <BellOffIcon />}
      <span className="hidden sm:inline">{enabled ? 'Reminders on' : 'Reminders off'}</span>
    </button>
  )
}
