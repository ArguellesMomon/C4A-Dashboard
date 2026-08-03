import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly instead of silently breaking every data call - much
  // easier to debug than a wall of "fetch failed" errors later.
  throw new Error(
    'Missing Supabase env vars. Copy .env.example to .env and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Officer logins use a student number, but Supabase Auth needs an email.
// We map "12345678" -> "12345678@c4a.dlsl.local" consistently in both the
// login form and the seed SQL, so there's one obvious place this lives.
const EMAIL_DOMAIN = 'c4a.dlsl.local'

export function studentNumberToEmail(studentNumber) {
  return `${studentNumber.trim()}@${EMAIL_DOMAIN}`
}
