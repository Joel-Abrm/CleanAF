# ⚔️ ShadowRise — Gamified Habit Tracker

A Solo Leveling–inspired habit tracking app. Complete quests, gain XP, level up, and resist urges.

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd shadowrise
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the **SQL Editor**, paste and run the contents of `supabase_schema.sql`
3. In **Authentication → Providers**, enable **Google** (optional, for OAuth)
4. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx        # Login screen
│   │   ├── signup/page.tsx       # Signup screen
│   │   └── callback/route.ts     # OAuth callback
│   ├── dashboard/page.tsx        # Main dashboard (quests, XP, stats)
│   ├── battle/page.tsx           # Urge battle screen
│   ├── progress/page.tsx         # Heatmap + streak tracking
│   ├── profile/page.tsx          # User profile + achievements
│   ├── layout.tsx                # Root layout + fonts
│   └── globals.css               # Global styles
├── components/
│   ├── ui/
│   │   ├── Card.tsx              # Reusable card wrapper
│   │   ├── XpBar.tsx             # Animated XP progress bar
│   │   ├── HabitItem.tsx         # Individual habit row
│   │   ├── StatDisplay.tsx       # Strength/Int/Disc/Will display
│   │   └── XpFloater.tsx         # Floating +XP animations
│   ├── layout/
│   │   ├── Navbar.tsx            # Bottom navigation bar
│   │   └── PageWrapper.tsx       # Page layout + background
│   └── features/
│       ├── LevelUpModal.tsx      # Level-up celebration
│       └── CreateHabitModal.tsx  # Add new habit form
├── hooks/
│   ├── useUser.ts                # User state + refresh
│   └── useXpEffect.ts            # XP float animation state
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── middleware.ts         # Session refresh middleware
│   ├── actions.ts                # All database queries
│   └── utils.ts                  # XP/level math, helpers
├── middleware.ts                  # Route protection
└── types/index.ts                 # TypeScript types
```

---

## 🎮 Features

| Feature | Description |
|---|---|
| **Auth** | Email/password + Google OAuth via Supabase |
| **Dashboard** | Today's quests, XP bar, streak, stats |
| **Habits** | Create/complete/delete daily habits |
| **XP System** | Gain XP on completion, auto level-up |
| **Urge Battle** | 5-min timer, +20 XP resist / −10 XP relapse |
| **Progress** | 5-week heatmap, battle win rate |
| **Profile** | Rank, achievements, sign out |
| **Animations** | Framer Motion XP floaters, level-up modal, glow effects |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#080C14` |
| Card | `#0D1220` |
| Border | `#1A2540` |
| Neon Blue | `#4F9FFF` |
| Neon Purple | `#9B6FFF` |
| Neon Green | `#00FF88` |
| Neon Red | `#FF4444` |
| Gold | `#FFB800` |

Fonts: **Rajdhani** (body) · **Orbitron** (mono/display) · **Cinzel** (titles)

---

## 🗄️ Database Schema

```
users      — id, email, username, level, xp, streak
habits     — id, user_id, name, xp_reward, stat_type
logs       — id, habit_id, date, completed
urges      — id, user_id, date, result
```

All tables have **Row Level Security** — users can only access their own data.

---

## 🔧 Deploy

```bash
npm run build
# Deploy to Vercel, Railway, or any Node host
# Add env vars in your hosting dashboard
```
