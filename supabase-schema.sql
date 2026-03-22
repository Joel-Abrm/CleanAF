-- ============================================================
-- ShadowRise — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  username    TEXT,
  level       INTEGER NOT NULL DEFAULT 1,
  xp          INTEGER NOT NULL DEFAULT 0,
  streak      INTEGER NOT NULL DEFAULT 0,
  class       TEXT CHECK (class IN ('Warrior', 'Mage', 'Shadow')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- ── HABITS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.habits (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  xp_reward   INTEGER NOT NULL DEFAULT 20,
  stat_type   TEXT NOT NULL CHECK (stat_type IN ('strength', 'intelligence', 'discipline', 'willpower')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- ── LOGS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id    UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  completed   BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(habit_id, date)  -- one log per habit per day
);

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own logs" ON public.logs FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.habits h
    WHERE h.id = logs.habit_id AND h.user_id = auth.uid()
  ));

-- ── URGES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.urges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  result      TEXT NOT NULL CHECK (result IN ('resisted', 'relapsed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own urges" ON public.urges FOR ALL USING (auth.uid() = user_id);

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_habits_user ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_habit ON public.logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_logs_date ON public.logs(date);
CREATE INDEX IF NOT EXISTS idx_urges_user ON public.urges(user_id);
