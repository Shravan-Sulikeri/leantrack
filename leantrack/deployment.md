# LeanTrack — Deployment & Production Guide

This guide walks through deploying **LeanTrack** to production with Vercel and Supabase.

---

## 1. Supabase Backend Setup

### A. Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings → API**, copy:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **anon / public key** (the publishable key)
   > ⚠️ **Security Warning:** Never expose or paste the `service_role` secret key into client code.

### B. Run Database Migrations
Open the **SQL Editor** in your Supabase dashboard and run the following in order:
1. `supabase/migrations/001_initial_schema.sql` (Tables and constraints)
2. `supabase/migrations/002_rls_policies.sql` (Row Level Security policies)
3. `supabase/seed.sql` (Populate exercise catalog and the 4 starter templates)

### C. Configure Email OTP Authentication
1. Go to **Authentication → Providers → Email**.
2. Enable **Email Provider**.
3. Under Email auth method, ensure **One-Time Password (OTP)** or code verification is enabled.
   *(This ensures iPhone users inside a standalone PWA stay inside the app without external browser redirects).*
4. Under **Authentication → URL Configuration**, set **Site URL** to your production Vercel URL (e.g. `https://leantrack.vercel.app`).

---

## 2. Deploy to Vercel

### A. Deploy via Vercel CLI or Git
```bash
cd leantrack
vercel
```

### B. Configure Environment Variables in Vercel Dashboard
Add the following in **Settings → Environment Variables**:
- `VITE_SUPABASE_URL`: Your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon/Publishable Key

### C. SPA Rewrites
The repository includes `vercel.json` with client-side routing rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 3. Installing on iPhone (Add to Home Screen)

1. Open your deployed HTTPS URL in **Safari on iPhone** (e.g. `https://leantrack.vercel.app`).
2. Tap the **Share** button (box with upward arrow) in the bottom Safari toolbar.
3. Scroll down and tap **Add to Home Screen**.
4. Confirm the name **LeanTrack** and tap **Add** in the top-right corner.
5. Tap the new **LeanTrack icon** on your iOS Home Screen. It launches in full standalone PWA mode without Safari browser bars, with safe area inset handling and persistent offline storage!

---

## 4. Technical Architecture: Data Safety & Offline Sync

### A. Offline-First Storage
- The app stores weight, calorie, and workout entries in **IndexedDB** (`LeanTrackDB` via Dexie) immediately upon logging.
- Status displays **Saved on this iPhone · Sync pending** when disconnected.
- No network timeouts block the athlete while at the gym.

### B. Idempotent Synchronization
- Every queued write receives a client-generated UUID `operationId`.
- Weight logs enforce `UNIQUE(user_id, local_date)` and upsert in place. Same-day weight adjustments update the existing record rather than creating duplicate entries.
- Calorie logs enforce `UNIQUE(user_id, local_date)`.
- When connectivity resumes or the app returns to the foreground, pending operations are processed sequentially with exponential backoff on errors.

### C. Row Level Security (RLS)
- Every table has RLS enabled with `USING (auth.uid() = user_id)`.
- Nested tables (`session_exercises`, `set_logs`) enforce access by joining to `workout_sessions` where `workout_sessions.user_id = auth.uid()`.
- Users cannot read or mutate any other athlete's fitness data.
