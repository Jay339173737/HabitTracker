-- HabitTracker backend schema
-- Paste this into the Supabase SQL Editor and run it.

create table if not exists habits (
  id text primary key,
  user_id uuid default auth.uid(),
  name text not null,
  description text,
  icon text default '🎯',
  color text default '#0066CC',
  routine_id text,
  frequency text default 'once' check (frequency in ('once', 'daily')),
  completed_dates text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists routines (
  id text primary key,
  title text not null,
  description text,
  category text,
  habit_count int default 0,
  premium boolean default false
);

-- Row Level Security: users can only touch their own habits.
alter table habits enable row level security;

create policy "Users can read their own habits"
  on habits for select using (auth.uid() = user_id);

create policy "Users can insert their own habits"
  on habits for insert with check (auth.uid() = user_id);

create policy "Users can update their own habits"
  on habits for update using (auth.uid() = user_id);

create policy "Users can delete their own habits"
  on habits for delete using (auth.uid() = user_id);

-- Routines are read-only shared data.
alter table routines enable row level security;

create policy "Anyone can read routines"
  on routines for select using (true);

-- Seed the default routines (matches src/store.ts).
insert into routines (id, title, description, category, habit_count, premium) values
  ('1', 'Simple Productive Day', 'A clear five-step routine for planning and focused work.', 'Productivity', 5, false),
  ('2', 'Deep Focus System', 'A complete premium routine for one deep work session.', 'Productivity', 5, true),
  ('3', 'Focus Starter', 'Three simple actions for a focused work session.', 'Productivity', 3, false),
  ('4', 'Mindful Productivity', 'A premium routine combining meditation and focused work.', 'Mental Wellbeing', 4, true)
on conflict (id) do nothing;
