-- Run this whole file once in your Supabase project's SQL Editor
-- (Dashboard > SQL Editor > New query > paste > Run).

-- =========================================================
-- 1. EVENTS TABLE
--    Everyone (including anonymous visitors) can read events.
--    Only signed-in officers can insert, update, or delete.
-- =========================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Other',
  description text,
  date text not null,   -- 'YYYY-MM-DD'
  time text,            -- 'HH:MM', optional
  location text,
  organizer text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Anyone can view events"
  on public.events for select
  using (true);

create policy "Signed-in officers can add events"
  on public.events for insert
  to authenticated
  with check (true);

create policy "Signed-in officers can edit events"
  on public.events for update
  to authenticated
  using (true);

create policy "Signed-in officers can delete events"
  on public.events for delete
  to authenticated
  using (true);

-- Turns on realtime change broadcasts for this table, which is what lets
-- every student's dashboard update instantly without a page refresh.
alter publication supabase_realtime add table public.events;

-- =========================================================
-- 2. OFFICERS TABLE
--    Stores the display name/role for each officer account, linked
--    1-to-1 with a Supabase Auth user. An officer can only read their
--    own row (just enough to show their name after logging in).
-- =========================================================

create table if not exists public.officers (
  id uuid primary key references auth.users (id) on delete cascade,
  student_number text unique not null,
  name text not null,
  role text not null
);

alter table public.officers enable row level security;

create policy "Officers can view their own profile"
  on public.officers for select
  to authenticated
  using (auth.uid() = id);

-- =========================================================
-- 3. ADDING AN OFFICER (repeat for each officer)
-- =========================================================
-- Step A: Dashboard > Authentication > Users > Add user
--   Email:    <student_number>@c4a.dlsl.local   (e.g. 12345678@c4a.dlsl.local)
--   Password: whatever password that officer should log in with
--   Copy the generated User UID after creating it.
--
-- Step B: run this insert, filling in the UID from Step A:
--
-- insert into public.officers (id, student_number, name, role)
-- values ('paste-user-uid-here', '12345678', 'Juan Dela Cruz', 'President');

-- =========================================================
-- 4. SAMPLE EVENTS (optional - safe to delete or edit later
--    from the admin panel once it's running)
-- =========================================================

insert into public.events (title, category, description, date, time, location, organizer)
values
  ('Intro to UI/UX Design Seminar', 'Seminar',
   'A hands-on seminar covering the basics of user research, wireframing, and prototyping for beginners.',
   (current_date + 3)::text, '13:00', 'RTL 301', 'C4A Officers'),
  ('General Assembly', 'Meeting',
   'Mandatory attendance for all C4A members. Attendance sheet will be passed around.',
   (current_date + 7)::text, '17:30', 'St. La Salle Hall Auditorium', 'C4A Officers'),
  ('Web Dev Bootcamp: React Basics', 'Workshop',
   'Bring your laptop. We will build a small React app together from scratch.',
   (current_date + 12)::text, '09:00', 'Computer Lab 2', 'C4A Tech Committee'),
  ('Project Proposal Deadline', 'Deadline',
   'Final day to submit your capstone project proposal to the department.',
   (current_date + 18)::text, '23:59', 'Online submission', 'Department');
