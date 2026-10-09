import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, studentNumberToEmail } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  // Loads the officer's profile (name, role) from the `officers` table
  // for the currently signed-in Supabase user.
  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('officers')
      .select('student_number, name, role')
      .eq('id', userId)
      .single()

    if (error || !data) {
      setAdmin(null)
      return false
    }
    setAdmin(data)
    return true
  }

  // Supabase Auth persists its own session in localStorage, so a page
  // refresh stays logged in automatically - we just need to read it once
  // on load, then keep listening for sign-in/sign-out events.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id)
      setCheckingSession(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setAdmin(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function login(studentNumber, password) {
    const email = studentNumberToEmail(studentNumber)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { success: false, message: 'Student number or password is incorrect.' }
    }
    const authorized = data.user && await loadProfile(data.user.id)
    if (!authorized) {
      await supabase.auth.signOut()
      return { success: false, message: 'This account does not have a C4A officer profile. Contact your section administrator.' }
    }
    return { success: true }
  }

  async function logout() {
    await supabase.auth.signOut()
    setAdmin(null)
  }

  const value = { admin, isAdmin: !!admin, checkingSession, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
