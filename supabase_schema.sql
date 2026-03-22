-- =============================================
-- ShadowRise — Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text,
  level integer not null default 1,
  xp integer not null default 0,
  streak integer not null default 0,
  created_at timestamptz default now()
);

-- RLS
alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- ─── HABITS ──────────────────────────────────
create table if not exists public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  xp_reward integer not null default 20,
  stat_type text not null default 'discipline',
  created_at timestamptz default now()
);

alter table public.habits enable row level security;

create policy "Users manage own habits"
  on public.habits for all using (auth.uid() = user_id);

-- ─── LOGS ────────────────────────────────────
create table if not exists public.logs (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null default current_date,
  completed boolean not null default true,
  created_at timestamptz default now(),
  unique(habit_id, date)
);

alter table public.logs enable row level security;

-- Allow inserts/reads through habit ownership
create policy "Users manage own logs"
  on public.logs for all
  using (
    habit_id in (
      select id from public.habits where user_id = auth.uid()
    )
  );

-- ─── URGES ───────────────────────────────────
create table if not exists public.urges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null default current_date,
  result text not null check (result in ('resisted', 'relapsed')),
  created_at timestamptz default now()
);

alter table public.urges enable row level security;

create policy "Users manage own urges"
  on public.urges for all using (auth.uid() = user_id);

-- ─── SEED (optional sample habits) ──────────
-- Replace 'your-user-id' with actual UUID after signing up
-- insert into public.habits (user_id, name, xp_reward, stat_type) values
--   ('your-user-id', 'Meditate 10 min', 20, 'discipline'),
--   ('your-user-id', 'Read 30 min', 15, 'intelligence'),
--   ('your-user-id', 'Exercise', 20, 'strength'),
--   ('your-user-id', 'Cold shower', 15, 'willpower');
