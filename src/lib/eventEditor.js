import { toISODate } from './dateUtils.js'
export function eventFormValues(event) {
  return { title: event?.title || '', category: event?.category || 'Seminar', date: event?.date || toISODate(new Date()), time: event?.time?.slice(0,5) || '', location: event?.location || '', organizer: event?.organizer || '', description: event?.description || '' }
}
export function eventPayload(form, id) {
  const data = eventFormValues(form)
  data.title = data.title.trim(); data.location = data.location.trim(); data.organizer = data.organizer.trim()
  if (id) data.id = id
  return data
}
export function duplicateEvent(event) { return { ...eventFormValues(event), title: event.title + ' (copy)' } }
