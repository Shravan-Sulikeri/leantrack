# COPY THIS ENTIRE PROMPT INTO GOOGLE ANTIGRAVITY

You are acting as my **senior full-stack engineer, staff product designer, database architect, accessibility engineer, QA lead, and deployment engineer**. Build a **real, end-to-end, production-ready iPhone-first fitness tracking Progressive Web App (PWA)** called **LeanTrack**. This is an **implementation request**. Do not stop at a proposal, design-only prototype, screenshots, Figma mockup, static HTML, pseudocode, or an incomplete scaffold.

**Required project inputs** (I have put them in the workspace):

- `README.md`: the complete product, workout, safety, data, UX, and acceptance-test specification. **Read every section first.**
- `assets/design-reference.png`: my supplied visual inspiration. **Inspect it directly.** Adapt its polished charcoal-black background, orange and blue metric cards, rounded shapes, oversized numbers, and premium fitness aesthetic to an **original** interface. Do not use the pictured model's portrait as a user asset or copy the design pixel-for-pixel.

**Important constraints:** The app is primarily used on an **iPhone, installed from Safari using Add to Home Screen**, and must **actually save all user-entered data** to authenticated persistent cloud storage, while supporting offline on-device capture and safe later synchronization. The whole app must be usable with one hand. It must be extremely easy to log a workout and one day's weight/calories. Build genuine functionality before declaring completion.

---

## A. Product mission, initial user, and scope

I am **26, male, 5'11", starting weight 240 lb, final target 190 lb**, returning to the gym after a long break. I want to train **four days a week**, lose overall body fat, and keep/build lean muscle without prioritizing a bulky chest. My belly and chest are major aesthetic priorities, but the product must never falsely promise local fat reduction.

My starter schedule begins **Thursday, November 12, 2026**, timezone `America/New_York`:

- **Thursday:** `UPPER_A` / Upper Body A
- **Saturday:** `LOWER_A` / Lower Body A + Core
- **Monday:** `UPPER_B` / Upper Body B
- **Wednesday:** `LOWER_B` / Lower Body B + Core
- **Tuesday, Friday, Sunday:** recovery days with optional walking, not fake gym sessions

**Weight goal:** 50 lb total, 240 → 190. Display the goal attractively, including 230/220/210/200/190 milestones, but use a sustainable rather than extreme pace. Do not promise a deadline. No dieting feature, recipes, or food planning in v1. I do want a **simple calories consumed today** logger and weight logger.

The UI should tell me precisely what to do on the current day, what I did last time, what I lifted, and how my weight is trending. My **saved workouts and health logs are more important than animations**.

---

## B. Build the actual application, not a mockup

Use this opinionated architecture unless an implementation constraint forces a documented alternative:

- **React + TypeScript + Vite**, React Router
- **Tailwind CSS + reusable accessible UI components** (shadcn/ui or equivalent), Lucide icons
- **Recharts** (or equivalent) with real data only
- **Supabase Auth + Postgres**, user-scoped Row Level Security
- **IndexedDB** via Dexie or equivalent for offline drafts and an idempotent pending-write queue
- **TanStack Query** for server state/mutations (or an equivalent well-defined data access abstraction)
- **Zod + React Hook Form** for robust inputs
- **vite-plugin-pwa / Workbox**, install manifest, correct iOS touch icons
- **Vitest + Testing Library + Playwright** for automated checks
- Hosting via **Vercel** or similar static HTTPS hosting with SPA rewrites

Use package versions compatible at the time you implement, lock them with a package manager lockfile, and explain any justified stack deviations. Keep the project structured, maintainable, and type-safe with **no TypeScript compile errors or console errors in core flows**.

### Expected repository layout (adapt as appropriate)

```text
leantrack/
  README.md
  ANTIGRAVITY_BUILD_PROMPT.md
  assets/design-reference.png
  index.html
  public/
    manifest.webmanifest
    icons/
    apple-touch-icon.png
  src/
    app/             # app shell, routes, providers
    components/      # design system, cards, forms, navigation
    features/
      dashboard/
      workouts/
      weight/
      calories/
      progress/
      history/
      settings/
      auth/
      sync/
    data/            # exercise + four-plan template seeds
    lib/             # supabase, dates, validation, calculations
    db/              # indexeddb/cache/queue
    styles/
    test/
  supabase/
    migrations/     # schema and RLS policies
    seed.sql         # exercise catalog + workout templates ONLY
  .env.example
  package.json
  vite.config.ts
  playwright.config.ts
  deployment.md
```

Do not create sample completed workouts, fabricated logged weight, sample calories, or health scores as if they belong to my account. Initial profile presets may be shown during onboarding, but actual user data must be deliberately entered.

---

## C. Visual design requirements

Inspect `assets/design-reference.png` carefully. Make an original high-end UI inspired by its **dark charcoal / orange / blue** design language.

Suggested tokens:

- Background `#0B0D10`
- Surfaces `#171A1F`, raised `#22262C`, borders `#343A43`
- Text primary `#F6F7F9`, secondary `#A5ADB8`
- Orange accent `#FF7A2F` for today's activity, cards, CTA and calories
- Blue accent `#347FEF` for weight trend and selected analytics
- Success `#50C48B`, warning `#F0B35A`, error `#EF7272`
- 20–28 px card radii; system/Inter font with oversized tabular numerals
- Distinct charts with meaningful axis labels, carefully padded tooltips

**Design with iPhone as the source of truth**. Test 375px, 393px, and 430px widths, portrait mode, small Safari viewport, standalone mode, iOS status bar, Dynamic Island, safe-area insets, touch input, and iOS keyboard. Use a 44px minimum hit target. Bottom navigation should be thumb-accessible and not overlap the home indicator or sheets. Do not allow horizontal scroll on the Dashboard or during set logging.

Implement polished design states for empty, loading, saving, saved, offline, syncing, failed sync, error, completed workout, and rest day. Use meaningful motion only when reduced motion is not requested. Prefer polished consistency to excessive decorative cards. No generic lorem ipsum and no meaningless “health score 88” from the screenshot.

**Navigation tabs:** Today, Workout, Progress, History, Settings. The calories logger is in Today, not a separate meal/diet app.

---

## D. Exact screens and interactions

### D1. Onboarding/authentication

- Good-looking welcome panel; short 3-step overview.
- Supabase email one-time-code sign-in; login must work from standalone iPhone PWA, avoiding dependencies on a magic link opening the wrong browser/app context.
- Prefill editable **height 5'11", starting weight 240 lb, goal weight 190 lb, units lb/mph, four days/week, timezone America/New_York**.
- Ask the user to confirm the initial schedule; support initial start date of Nov 12, 2026 and customization for future installs.
- Never write a fake actual weigh-in until user submits it.
- Clearly indicate whether user is signed in and cloud backup is active.

### D2. Today tab

- Date-aware greeting with local weekday/date.
- Large **current weight** card: last actual entry or `No weigh-in yet`, start 240, target 190, loss so far, true percent of goal achieved.
- Big **Today's Workout** orange panel with exact workout name, exercise count, and prominent **Start / Resume** action.
- Rest day state (`Recovery Day`) on Tue/Fri/Sun, upcoming day shown correctly.
- Fast **Log Weight** sheet with lbs numeric keyboard and actual date; primary save, visible confirmation.
- Fast **Log Calories** sheet showing calories eaten today; supports **Set daily total** and optional **Add to daily total** as explicitly different operations.
- Calories goal optional and configurable. Missing entry shows `Not logged`, NOT `0`.
- Weight chart using 7/30/90-day real weigh-ins; empty state when no records.
- Small actual stats cards: completed gym sessions this week, cardio minutes this week, next scheduled session.
- Display data sync status unobtrusively but clearly.

### D3. Workout tab / active session

- Show current-date assigned routine; can manually browse all four routines.
- `Start workout` creates unique session and a **snapshot of routine contents** for future historical integrity.
- `Resume` an in-progress session after refresh/close/reopen.
- Exercise cards display: **name**, equipment, intended reps/sets, correct setup, numbered steps for form, major mistakes, machine diagram/photo only if usage licensed, last real logged weight (if any), and conservative first-time test range with a warning that it's not personalized.
- Per set: editable numeric actual `weight`, `reps`, completed toggle, optional RPE, and small rest timer. For bodyweight exercises record bodyweight rather than false pounds.
- Keep load modes distinct: stack displayed, each dumbbell, per-side plate, sled added plates, bodyweight.
- Add/reorder/remove set when needed, use controlled confirmation for destructive actions.
- Prepopulate a **suggestion** based on previous safe performance only, never pre-mark a set complete.
- Cardio section: treadmill/bike, **actual** duration, incline, speed, optional distance and estimated machine calories. These must not be confused with calories eaten.
- `Finish workout` validates session, permits partial completion with confirmation, persists everything, and displays genuine session summary.
- Allow editing completed sessions from History; never delete past history merely due to a schedule change.

### D4. Progress tab

- Weight trend line chart with 7/30/90/all; only actual weigh-ins plotted. An optional 7-day average must handle dates with missing measurements correctly.
- Goal 240 → 190, milestone markers 230/220/210/200/190, true change since start, weekly actual average and delta.
- A monthly workout frequency calendar, weekly cardio minutes, and (if real entries exist) per-exercise strength progress.
- Calories consumed chart optional and based only on daily logs; target line only when a user-entered target exists.
- Avoid fabricated body-fat percentages, health scores, or guaranteed goal date predictions.

### D5. History tab

- Month calendar and chronological list of **actual completed or in-progress workouts**, with accurate date, title, total sets, duration and cardio info.
- Tap session for detailed actual exercises, weights, reps, durations, notes, editing.
- Inspect prior daily weight/calorie logs, edit/backfill by date.
- Filter workout type, completed/in-progress, month; still clear on 375px screens.

### D6. Settings

- Change profile data, target, initial weight, time zone, units.
- Edit future workout schedule and custom session assignments without rewriting completed history.
- Set optional daily calorie target; **no meal plan**.
- Toggle reduced motion as appropriate.
- See sync status, last successful cloud sync, offline pending count.
- Export **JSON and CSV** personal data, plus confirm-to-delete account and personal records.
- Sign out with correct cache isolation between users.

---

## E. Seed four workout templates exactly

Start with **2 sets per exercise**; 60–90 seconds rest. Five minutes gentle warmup before lifting. Optional gradual progression only after good adaptation. First 2 weeks should not auto-push extra volume.

**Thursday, UPPER_A:**
1. Lat pulldown, 2×12
2. Seated cable row, 2×12
3. Machine chest press, 2×10
4. Machine shoulder press, 2×10
5. Rope triceps pushdown, 2×12
6. Treadmill, duration/incline according to Section F

**Saturday, LOWER_A:**
1. Leg press, 2×12
2. Seated leg curl, 2×12
3. Calf raises, 2×15
4. Glute bridge, 2×12
5. Dead bug, 2×8 per side
6. Treadmill or bike, Section F

**Monday, UPPER_B:**
1. Seated cable row, 2×12
2. Lat pulldown, 2×12
3. Machine chest press, 2×10
4. Light dumbbell lateral raise, 2×12
5. Pallof press, 2×10 per side
6. Treadmill, Section F

**Wednesday, LOWER_B:**
1. Leg press, 2×12
2. Leg extension, 2×12
3. Seated leg curl, 2×12
4. Glute bridge, 2×12
5. Plank, 2×15–20 sec
6. Treadmill or bike, Section F

For each exercise, seed full plain-English form guidance (setup, movement, breathing, common errors, alternatives) from the README. Support optional exercise library entries for goblet squat, Romanian deadlift, step-ups, and dumbbell shoulder press but **do not force advanced substitutions** into Week 1.

**Chest-specific requirement:** keep chest work modest at 2×10 twice per week; avoid a bodybuilding chest specialization. Do not promise training will remove chest fat specifically.

---

## F. First-time starting loads and knee-friendly cardio

**Never calculate working weight from 240 lb body weight alone.** Show these values only as conservatively tentative **first-test ranges**, not medical instructions or automatically logged weights:

| Exercise | First-test suggestion |
|---|---|
| Lat pulldown | ~25–45 lb stack |
| Seated cable row | ~25–45 lb stack |
| Chest press machine | ~20–40 lb stack |
| Shoulder press machine | ~10–25 lb stack |
| Triceps rope pushdown | ~10–20 lb stack |
| Selectorized seated leg press | ~40–80 lb stack |
| 45-degree plate-loaded leg press | **empty sled, no added plates**; its carriage already has mass |
| Seated leg curl | ~15–35 lb stack |
| Leg extension | ~15–35 lb stack |
| Calf raise | bodyweight or lowest workable machine setting |
| Lateral raise | ~3–8 lb PER HAND |
| Pallof press | ~5–15 lb stack |
| Core/glute bridge | bodyweight |

After an easy practice set, choose a load permitting all target reps with controlled technique and ~2–3 reps in reserve. If form breaks, reduce weight. If very easy, use smallest machine increment. Store actual performed sets, never presumed performance. After two comparable successful sessions, optionally offer a tiny weight increase, not an automatic one.

**Eight-week beginner treadmill progression (post-lifting):**

| Week | Minutes total/session | Incline suggestion |
|---:|---:|---|
| 1 | 12–15 | 0% |
| 2 | 15–18 | 0–1% |
| 3 | 18–20 | 0–1% |
| 4 | 20–22 | 0–2% |
| 5 | 22–25 | 0–2% |
| 6 | 25–27 | 0–3% |
| 7 | 27–30 | 0–3% |
| 8 | ~30 | 0–4%, only if comfortable |

Warm up 3–5 min and cool down 2–3 min **within** total minutes, begin at a naturally comfortable walk (often ~2.0–2.5 mph, not mandatory), use talk-test intensity, and never jump into a mandatory 12% incline or intense intervals. The guidance must explicitly mention **knees**: slow/flatten/reduce duration, swap to stationary bike if sore, stop for sharp pain and other warning symptoms. Suggestions should be editable. Actual duration, speed and incline saved per session. Optional gentle non-gym walks can gradually build total weekly activity.

**No extreme calorie-burn goals** and do not automatically deduct estimated burned calories from logged intake.

---

## G. Persistence and data model: the real engineering core

Implement actual Supabase Postgres schema, migrations, seed and **Row Level Security**. Minimum tables:

`profiles`, `exercises`, `workout_templates`, `template_exercises`, `workout_schedule`, `workout_sessions`, `session_exercises`, `set_logs`, `cardio_logs`, `weight_logs`, `calorie_logs`. Add schedule overrides and idempotency/sync metadata tables where appropriate.

Invariants:

1. `profiles.id = auth.users.id`; all private rows user-scoped.
2. A session has UUID PK, user ID, scheduled local date, actual date, started/ended UTC times, status, **immutable plan snapshot** and optional notes.
3. Each logged set stores UUID, session exercise ID, `set_index`, actual reps, actual weight and **weight mode**; distinguish empty from 0 and bodyweight from stack.
4. Daily weigh-ins enforce **unique(user_id, local_date)**, are mutable/upsertable for corrections, and preserve `updated_at`.
5. Daily calories enforce **unique(user_id, local_date)**; `calories_consumed NULL` means unlogged, not zero. `add calories` operations are idempotent with unique mutation IDs.
6. All table queries/updates must enforce ownership, including nested rows via parent session ownership.
7. User cannot see or mutate anyone else's data even if a malicious client guesses an ID.
8. Never leak service-role credentials or personal logs in frontend/public cache/error analytics.
9. Handle partial network failure, duplicate retry, dropped session on app close, date changes at midnight, and two-device activity.
10. On app reinstall/login, cloud-synced information must be reloaded.

### Offline-write design

- Cache initial app shell/assets for offline launch and read cached user-specific data from IndexedDB.
- Store committed changes in IndexedDB first with UUID operation ID and version, show status such as `Saved on iPhone · Sync pending` rather than falsely claiming cloud success.
- Replay idempotent queued writes on reconnect/foreground/auth restoration. Never rely on iOS background sync running when app closed.
- De-duplicate operations, update statuses, retry exponential backoff, expose errors and `Retry now`.
- Resolve concurrent updates deliberately: timestamp/version checks and conflict state where necessary; never silently overwrite sets with another device's changes.
- On sign-out, isolate/delete local private caches appropriately and prevent cross-account data display.
- Test reconnect and refresh thoroughly.

**Cloud data must be the source of truth for cross-device continuity.** Never present `localStorage` alone as satisfactory persistent storage.

---

## H. iPhone PWA implementation details

Create a valid web app manifest with `display: standalone`, app name and icon set; `apple-touch-icon`, status/theme coloring, `viewport-fit=cover`, appropriate Safari/Apple meta tags; HTTPS; service worker; deep-link fallback; update process that does not erase an in-progress workout. Standalone behavior should feel native, with safe-area-aware bottom navigation and robust touch keyboard behavior.

Implement an unobtrusive “**Install on iPhone**” help panel that explains: Safari → Share → Add to Home Screen → Add. Do **not** rely on the Android `beforeinstallprompt` event for iOS. Browser and installed-PWA storage contexts may differ; cloud account synchronization is the bridge.

Use `env(safe-area-inset-bottom)` for bottom navigation and action bars, and test iOS standalone app display mode. Never claim access to Apple Health data, system-wide step count, device sensors, or native background recording unless genuinely implemented with consent and tested. The app must remain useful without any wearable.

---

## I. Test the product as a real user

Implement automated unit/integration/e2e tests and manually verify the following behavior:

- `2026-11-12` in `America/New_York` → **Upper Body A**
- `2026-11-14` → **Lower Body A**
- `2026-11-16` → **Upper Body B**
- `2026-11-18` → **Lower Body B**
- Tuesday/Friday/Sunday → Recovery Day (no auto-completion)
- Weight `239.6 lb` saved, refreshed, still there; same-date update does **not** create duplicate
- Calories consumed entry for today persisted; empty days remain empty; atomic add operation cannot double-add on retry
- Set `35 lb × 12` marked completed, refresh and resume, still there; finish, verify full history
- Offline edit / refresh → locally available; regain connection → exact single cloud record
- Sign in on second device → synced historical records present
- Two distinct users cannot read/change each other's weight, calories, or session logs
- Change schedule → future assignments update, completed workout history unchanged
- Weight progress math is accurate (240 to 239.6 means **0.4 lb progress**, not 1 lb)
- Empty account → no fake chart or fabricated exercise burn data
- 375px, 393px, 430px screenshots show clean, unclipped app and usable tab bar
- Login and account state work in **installed iPhone Home Screen** context
- JSON/CSV export accurately includes actual metrics, sets, cardio, and timestamps

Create tests specifically for IANA local dates, DST boundaries, midnight crossover, missing days, workout rescheduling, safe cloud writes, and optimistic mutation rollback. Confirm the bundle builds and deploys. If a test is blocked by missing external services/credentials, **say exactly which test could not be executed and why**, and provide concrete steps to run it. Never claim passing tests without running them.

---

## J. Delivery and build-execution sequence

**Execute and finish in phases; do not stop after writing a plan:**

**Phase 1: Foundation and visual system**  
Read README + image; create project, components, routing, design tokens, icons, responsive layout, Today/Workout/Progress/History/Settings. Use mock *structural* data only during UI development, clearly marked as such.

**Phase 2: Real database and auth**  
Set up Supabase migrations, reference exercise catalog, four workout templates, schedule rules, RLS tests, sign-in and initial profile flow. Add `.env.example` with placeholders. If credentials are missing, build the fully wired code/migration and ask me only for the **public configuration fields** needed to connect, not the secret service role key.

**Phase 3: Daily logs and workout logging**  
Implement actual weight/calorie CRUD, responsive quick-entry sheets, session lifecycle, set logs, cardio logs, form guides, and real history. Prove data persists on refresh.

**Phase 4: PWA and offline queue**  
Implement manifest, icons, caching, IndexedDB, mutation replay, recovery UI, iOS Home Screen-specific layout and install instructions; verify sync idempotency.

**Phase 5: Progress analytics and refinements**  
Implement actual trend charts and milestones, cardio progression by selected week, last logged set suggestions, calendar and schedule settings, export/delete.

**Phase 6: QA and deployment**  
Run typecheck, lint, unit tests, Playwright mobile tests, RLS tests, production build, and screenshots. Fix blockers and do a real production deployment if credentials/deployment access are supplied. Document the deployed HTTPS URL or precise deployment blocker. Write deployment setup instructions with Vercel SPA fallback and Supabase redirect/auth settings.

### Required final delivery from you, the building agent

1. **Working repository** with all source code, not only design files.
2. **SQL migrations and tested RLS policies**; clear Supabase setup.
3. **Usable iPhone-first PWA** and icons that can be added to Home Screen.
4. **Working account-backed logs** for weight, daily calories, sessions, sets, and cardio with offline-safe state and resync.
5. **Four fully seeded workout plans** with first-test load guidance and eight-week treadmill progression.
6. **Visual screenshots** of Today, active Workout, Weight/Progress, History on an iPhone-size viewport.
7. **Tests and evidence of passing behavior**; explicitly state untested real-device areas.
8. **Instructions** for local run, credentials, deploy, iPhone installation, data export and backup/sync behavior.
9. **Technical explanation** of how sync avoids duplicate sets/calorie additions and how RLS protects user data.
10. A **feature-completion checklist** mapping each README requirement and acceptance criterion to its implementation status.

**Nonnegotiable:** No fake “saved successfully” notifications for unsaved changes, no fake charts, no placeholder buttons, no invisible data loss, no hardcoded workouts that show the wrong local day, and no skipping security because this is a personal app.

**When you need to prioritize, optimize in this order:** (1) data safety and correctness, (2) workout usability, (3) iPhone layout, (4) design polish and animation.

Read `README.md` fully, inspect `assets/design-reference.png`, then **begin implementing the application now**. Make reasonable engineering decisions autonomously, report blockers precisely, and continue through implementation, validation, and documentation rather than stopping after the first screen.
