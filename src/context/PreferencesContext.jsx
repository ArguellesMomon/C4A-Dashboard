import React, { createContext, useContext, useEffect, useState } from 'react'
const Context = createContext(null)
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState(() => ['light','dark'].includes(read('c4a_theme', null)) ? read('c4a_theme', null) : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [saved, setSaved] = useState(() => { const value = read('c4a_saved', []); return Array.isArray(value) ? value : [] })
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('c4a_theme', JSON.stringify(theme)) } catch {} }, [theme])
  useEffect(() => { try { localStorage.setItem('c4a_saved', JSON.stringify(saved)) } catch {} }, [saved])
  function toggleSaved(id) { setSaved(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]) }
  return <Context.Provider value={{ theme, setTheme, saved, toggleSaved }}>{children}</Context.Provider>
}
export const usePreferences = () => useContext(Context)
