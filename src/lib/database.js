// Data layer for events/seminars, backed by Supabase (Postgres).
//
// Every function here keeps the exact same name and shape as the old
// localStorage version, so nothing outside this file had to change.
// If you ever swap backends again, this is still the only file to touch.

import { supabase } from './supabaseClient.js'

const TABLE = 'events'

export async function getEvents() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const { data, error, status } = await supabase
      .from(TABLE)
      .select('*')
      .order('date', { ascending: true })
      .abortSignal(controller.signal)
    if (error) throw Object.assign(new Error(error.message), error, { status })
    return data || []
  } finally {
    clearTimeout(timeout)
  }
}

export async function addEvent(event) {
  const { id, ...rest } = event // let the database generate the id
  const { data, error } = await supabase.from(TABLE).insert(rest).select().single()
  if (error) throw error
  return data
}

export async function updateEvent(id, updates) {
  const { id: _ignored, ...rest } = updates
  const { data, error } = await supabase
    .from(TABLE)
    .update(rest)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEvent(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
  return true
}

// Subscribes to live inserts/updates/deletes on the events table so every
// student's dashboard updates the moment an officer changes something -
// no refresh needed. Returns an unsubscribe function.
export function subscribeToEvents(onChange) {
  const channel = supabase
    .channel('events-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, onChange)
    .subscribe()

  return () => supabase.removeChannel(channel)
}
