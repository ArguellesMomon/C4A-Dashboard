# C4A Fieldnotes

A mobile- and desktop-friendly dashboard for De La Salle Lipa C4A students to
see upcoming events and seminars in real time, with an admin panel for
officers to manage them. Backed by Supabase (Postgres + Auth + Realtime).

## Experience

A modern campus planner in Lasallian green and white, with dedicated
Overview, All events, Calendar, My saved, and Section guide views. Hash-based
navigation supports direct links and browser back/forward without server routing.

- Desktop sidebar and mobile bottom navigation.
- Light/dark themes with system preference on first visit and browser persistence.
- Search titles, descriptions, venues, and organizers; filter categories/dates and sort results.
- Bookmark events locally; saving does not register attendance or sync across devices.
- Accessible dialogs with focus trapping, Escape dismissal, scroll locking, and focus restoration.
- Calendar exports use Asia/Manila time; timed entries default to one hour.
- Officer mutations refresh explicitly in addition to realtime, with pending and error states.
- Browser reminders require permission and an open app tab; no background push.

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

- **Student hub** (`src/pages/StudentHub.jsx`) - anyone can view the
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
  pages/       StudentHub.jsx (public), AdminPanel.jsx (officers only)
supabase/
  schema.sql   Tables, RLS policies, realtime setup, seed data
```

## Customizing

- **Add/remove officers:** Supabase Dashboard > Authentication > Users,
  plus a matching row in the `officers` table. No code changes needed.
- **Change event categories:** edit the `CATEGORIES` array and color maps
  in `src/components/events/CategoryBadge.jsx`.
- **Theme colors:** light/dark tokens are defined in `src/index.css` and referenced
  by `tailwind.config.js`.

## Validation

Run `npm test` for route rendering, saved cards, discovery filters, date grids,
and calendar export checks. Run `npm run build` for the production build.
These checks do not replace visual browser QA or authenticated Supabase testing.

### Noticeboard connection troubleshooting

If events cannot load, confirm `VITE_SUPABASE_URL` points to the active project
and `VITE_SUPABASE_ANON_KEY` is its matching public/publishable key. Restart Vite
after editing `.env`, or rebuild for a deployed app. A hostname that does not
resolve prevents requests from reaching Supabase; check the project URL and
project status before changing table policies. Missing-table and authorization
errors are reported separately from connection failures. Never put a service-role
or secret key in a `VITE_` variable.

### Phone calendar

On phones, the planner starts with a compact seven-day strip. Use the week
arrows to move through dates, tap a day for an immediate agenda sheet, or tap
the month label to expand the full calendar. Search and filters are collapsible.
The full month opens at the week you are browsing, and event details return to
the day agenda when dismissed. Loading and connection failures also appear in
the day sheet so unavailable data is not mistaken for an empty day.

### Visual direction

The interface uses Manrope headings, a forest-green desktop navigation rail,
clean light/dark surfaces, date-led event cards, and consistent outline icons.
The overview pairs the next event with a practical seven-day preview and
separate activity cards. Phone navigation and the compact expandable planner
remain available. Decorative starburst glyphs have been removed.

### Officer workspace

Officers can search, filter by category/status, sort, and page through the event
list. Summary cards filter all events, the next seven days, or upcoming events
missing a time/venue. Edit opens the sectioned editor; the row menu offers
student details, duplication, and a named delete confirmation. Duplication opens
a new unsaved form and never changes the source event. The editor offers an
expandable student preview and submits only supported event fields. Desktop
management tables become stacked event rows on smaller screens. Workspace,
editor, preview, and confirmation colors follow the active theme.
