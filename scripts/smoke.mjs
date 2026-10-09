import assert from 'node:assert/strict'
import { eventErrorMessage } from '../src/lib/eventErrors.js'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { eventICS, googleCalendarUrl } from '../src/lib/calendarExport.js'
import { selectEvents } from '../src/lib/eventFilters.js'
import { buildMonthGrid } from '../src/lib/dateUtils.js'
assert.match(eventErrorMessage(new Error('Failed to fetch')), /event service could not be reached/)
assert.match(eventErrorMessage({code:'PGRST205'}), /not been set up/)
assert.match(eventErrorMessage({status:401}), /authorize/)
assert.match(eventErrorMessage({name:'AbortError'}), /too long/)
console.log('PASS event service error classification')
const memory = new Map()
globalThis.localStorage = { getItem: k => memory.get(k) || null, setItem: (k,v) => memory.set(k,v) }
globalThis.window = { location: {hash: '#overview'}, matchMedia: () => ({matches:false}) }
const server = await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
 const {default: App} = await server.ssrLoadModule('/src/App.jsx')
 for(const [page,title] of [['overview','Your section, in one place.'],['events','The noticeboard'],['calendar','Section planner'],['saved','Made for your shortlist'],['guide','Find your way around'],['admin','Your section, in one place.']]) { window.location.hash = '#'+page; const html = renderToString(React.createElement(App)); assert.ok(html.includes(title),page); assert.ok(html.includes('Switch to dark mode')); assert.ok(html.includes('Officer sign in')); console.log('PASS render '+page) }
 window.matchMedia = query => ({matches: query === '(max-width: 640px)'})
 window.location.hash = '#calendar'
 const mobilePlanner = renderToString(React.createElement(App))
 assert.ok(mobilePlanner.includes('Section planner'))
 assert.ok(mobilePlanner.includes('Previous week'))
 assert.ok(mobilePlanner.includes('Next week'))
 assert.ok(mobilePlanner.includes('Tap a day for its events'))
 assert.ok(!mobilePlanner.includes('Previous month'))
 assert.ok(mobilePlanner.includes('Search &amp; filters'))
 assert.equal((mobilePlanner.match(/class="week-day/g) || []).length, 7)
 console.log('PASS compact phone planner, seven-day strip, and collapsed month view')
 window.matchMedia = () => ({matches:false})
 memory.set('c4a_theme',JSON.stringify('dark'))
 assert.ok(renderToString(React.createElement(App)).includes('Switch to light mode'))
 const {default: Card} = await server.ssrLoadModule('/src/components/events/EventCard.jsx')
 const {PreferencesProvider} = await server.ssrLoadModule('/src/context/PreferencesContext.jsx')
 const event = {id:'test',title:'Test workshop',category:'Workshop',date:'2026-10-09',time:'08:30:00',location:'Lipa'}
 memory.set('c4a_saved',JSON.stringify(['test']))
 const card = renderToString(React.createElement(PreferencesProvider,null,React.createElement(Card,{event})))
 assert.ok(card.includes('Unsave Test workshop')); assert.ok(card.includes('8:30 AM')); console.log('PASS saved card and database time')
 const ics = eventICS(event); assert.ok(ics.includes('DTSTART:20261009T003000Z')); assert.ok(ics.includes('DTEND:20261009T013000Z'))
 const allDay = eventICS({...event,time:'',date:'2026-12-31'}); assert.ok(allDay.includes('DTEND;VALUE=DATE:20270101'))
 assert.ok(new URL(googleCalendarUrl(event)).searchParams.get('ctz') === 'Asia/Manila')
 for(let month=0;month<12;month++){ const grid = buildMonthGrid(2026,month); assert.equal(grid.length,42); assert.equal(new Set(grid.map(d=>d.iso)).size,42) }
 const sample = [{...event,id:'future',date:'2099-01-01',title:'Zeta',organizer:'Section Council'}, {...event,id:'archive',date:'2000-01-01',title:'Alpha',category:'Deadline'}]
 assert.deepEqual(selectEvents(sample,{search:'council'}).map(e=>e.id),['future'])
 assert.deepEqual(selectEvents(sample,{period:'past',category:'Deadline'}).map(e=>e.id),['archive'])
 assert.deepEqual(selectEvents(sample,{page:'saved',saved:['archive'],period:'all'}).map(e=>e.id),['archive'])
 assert.deepEqual(selectEvents(sample,{page:'calendar',date:'2000-01-01'}).map(e=>e.id),['archive'])
 assert.deepEqual(selectEvents(sample,{period:'all',sort:'latest'}).map(e=>e.id),['future','archive'])
 assert.deepEqual(selectEvents(sample,{period:'all',sort:'title'}).map(e=>e.id),['archive','future'])
 const folded = eventICS({...event,title:'✳'.repeat(100)})
 for(const line of folded.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75)
 console.log('PASS discovery filters, sorting, campus timezone, ICS folding, all-day boundary, and calendar grids')
} finally { await server.close() }
