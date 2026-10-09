import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { eventFormValues, eventPayload, duplicateEvent } from '../src/lib/eventEditor.js'
import { toISODate } from '../src/lib/dateUtils.js'
const original = {id:'existing',title:'  Workshop  ',category:'Workshop',date:'2099-01-01',time:'08:30:00',location:null,organizer:' C4A ',description:'Bring a laptop.',created_at:'metadata'}
const copied = duplicateEvent(original)
assert.equal(copied.id,undefined)
assert.equal(copied.created_at,undefined)
assert.equal(copied.time,'08:30')
assert.equal(copied.location,'')
const create = eventPayload({...copied,id:'unwanted',created_at:'unwanted'})
assert.equal(create.id,undefined)
assert.equal(create.created_at,undefined)
assert.equal(create.organizer,'C4A')
assert.equal(eventPayload(eventFormValues(original),original.id).id,'existing')
assert.equal(eventPayload(eventFormValues(original),original.id).title,'Workshop')
assert.equal(original.title,'  Workshop  ')
console.log('PASS create/edit payloads, duplicate isolation, nullable fields, and database time normalization')
const noop = () => {}
globalThis.__adminFixture = {events:[],loading:false,error:'',refresh:noop,createEvent:noop,editEvent:noop,removeEvent:noop}
const server = await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',plugins:[{name:'admin-test-fixtures',enforce:'pre',transform(code,id){
  const file = id.replaceAll('\\','/')
  if(file.endsWith('/src/context/AuthContext.jsx')) return 'export function useAuth(){return {admin:{name:"Test officer",role:"President"}}}'
  if(file.endsWith('/src/context/EventsContext.jsx')) return 'export function useEvents(){return globalThis.__adminFixture}'
}}]})
try {
  const {default: AdminPanel} = await server.ssrLoadModule('/src/pages/AdminPanel.jsx')
  const render = () => renderToStaticMarkup(React.createElement(AdminPanel))
  assert.ok(render().includes('Your first event starts here.'))
  globalThis.__adminFixture.error='Test connection failure'
  assert.ok(render().includes('The noticeboard is unavailable.'))
  assert.ok(!render().includes('Your first event starts here.'))
  globalThis.__adminFixture.error=''
  globalThis.__adminFixture.events=Array.from({length:10},(_,index)=>({...original,id:'event-'+index,title:'Event '+index,date:index===0?'2000-01-01':index===1?toISODate(new Date()):'2099-01-'+String(index+1).padStart(2,'0')}))
  const html=render()
  assert.ok(html.includes('Test officer'))
  assert.ok(html.includes('President'))
  assert.ok(html.includes('Page 1 of 2'))
  assert.ok(html.includes('Showing 1–8 of 10 events'))
  assert.equal((html.match(/class="admin-event-title"/g)||[]).length,8)
  assert.ok(html.includes('data-status="Past"'))
  assert.ok(html.includes('data-status="Today"'))
  assert.ok(html.includes('Needs details'))
  assert.ok(html.includes('Duplicate event'))
  globalThis.__adminFixture.loading=true
  assert.ok(render().includes('Updating your noticeboard…'))
  console.log('PASS officer workspace rendering, paging, date statuses, management actions, and loading/error/empty states')
} finally {await server.close(); delete globalThis.__adminFixture}
