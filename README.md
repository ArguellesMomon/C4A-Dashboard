# C4A Events & Seminars Dashboard

A mobile- and desktop-friendly dashboard for De La Salle Lipa C4A students to
see upcoming events and seminars in real time, with an admin panel for
officers to manage them. Backed by Supabase (Postgres + Auth + Realtime).

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com), create a free project.
2. In the Dashboard, go to **SQL Editor > New query**, paste in the full
   contents of `supabase/schema.sql`, and run it. This creates the
   `events` and `officers` tables, sets up permissions, turns on realtime,
   and adds a few sample events.
3. Go to **Authentication > Users > Add user** to create a login for each
   officer:
   - Email: `<student_number>@c4a.dlsl.local` (e.g. `12345678@c4a.dlsl.local`)
   - Password: whatever they'll log in with
   - Copy the generated **User UID**.
4. Back in **SQL Editor**, insert a matching profile row for each officer
   (swap in the real UID, student number, name, and role):
   ```sql
   insert into public.officers (id, student_number, name, role)
   values ('paste-user-uid-here', '12345678', 'Juan Dela Cruz', 'President');
   ```
5. Go to **Project Settings > API** and copy your **Project URL** and
   **anon public key** - you'll need these next.

## 2. Run the app

```bash
cp .env.example .env
# then paste your Project URL and anon key into .env

npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). Students
can view the dashboard right away with no login. Officers log in with their
student number + password from step 1.3 above.

To build a production version: `npm run build`, then `npm run preview` to
test it locally.

## How it works

- **Public dashboard** (`src/pages/Dashboard.jsx`) - anyone can view the
  month calendar and upcoming events. Updates live: if an officer adds or
  edits an event while a student has the page open, it appears with no
  refresh needed, via Supabase Realtime.
- **Admin panel** (`src/pages/AdminPanel.jsx`) - officers log in to add,
  edit, or delete events. Protected by `AuthContext`, which uses Supabase
  Auth.
- **Database** (`src/lib/database.js`) - talks to the Supabase `events`
  table. Every function returns a Promise, so the rest of the app doesn't
  need to know or care that Supabase is behind it.
- **Officer accounts** - stored in Supabase, not in the codebase. Each
  officer has a real login (Supabase Auth) plus a row in the `officers`
  table holding their student number, name, and role. Add or remove
  officers at any time from the Supabase dashboard - no code changes or
  redeploys needed.
- **Security** - only signed-in officers can add/edit/delete events
  (enforced server-side by Postgres Row Level Security, not just hidden in
  the UI). Everyone can read events, nobody can write without logging in.
  See `supabase/schema.sql` for the exact policies.

## Folder structure

```
src/
  components/
    layout/    Navbar, Footer
    calendar/  Month grid + day cells
    events/    Event cards, list, badges, create/edit form, details modal
    auth/      Login modal
    common/    Button, Modal, EmptyState - shared UI primitives
  context/     AuthContext (Supabase auth/session), EventsContext (data + realtime)
  lib/         supabaseClient.js, database.js (Supabase queries), dateUtils.js
  pages/       Dashboard.jsx (public), AdminPanel.jsx (officers only)
supabase/
  schema.sql   Tables, RLS policies, realtime setup, seed data
```

## Customizing

- **Add/remove officers:** Supabase Dashboard > Authentication > Users,
  plus a matching row in the `officers` table. No code changes needed.
- **Change event categories:** edit the `CATEGORIES` array and color maps
  in `src/components/events/CategoryBadge.jsx`.
- **Theme colors:** all green/cream/gold values are defined once in
  `tailwind.config.js` under `theme.extend.colors`.
