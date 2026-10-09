import { daysUntil } from './dateUtils.js'
export function selectEvents(events, { page = 'events', saved = [], date = null, period = 'upcoming', category = 'All', search = '', sort = 'soonest' } = {}) {
  const query = search.trim().toLowerCase()
  return events.filter(event => {
    if(page === 'saved' && !saved.includes(event.id)) return false
    if(page === 'calendar' && date && event.date !== date) return false
    if(page !== 'calendar' && period !== 'all' && (period === 'past' ? daysUntil(event.date) >= 0 : daysUntil(event.date) < 0)) return false
    if(category !== 'All' && event.category !== category) return false
    return [event.title,event.description,event.location,event.organizer].filter(Boolean).join(' ').toLowerCase().includes(query)
  }).sort((a,b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'latest' ? (b.date+(b.time || '')).localeCompare(a.date+(a.time || '')) : (a.date+(a.time || '')).localeCompare(b.date+(b.time || '')))
}
