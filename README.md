# LEANTRACK | iPhone-First Fitness & Weight-Loss Tracker

> **Product requirements document + implementation handoff for Google Antigravity**  
> Version: 1.0 • Prepared: November 12, 2026  
> **Status:** Build specification, not an already implemented or deployed application.

![Reference UI: dark, orange and blue fitness dashboard](assets/design-reference.png)

**Build instruction:** Open `ANTIGRAVITY_BUILD_PROMPT.md` in this package and give its full contents to Google Antigravity. Keep `README.md` and `assets/design-reference.png` in the project so the builder can inspect them. The prompt is also summarized in Section 16 below.

---

## 1. Product vision

Build **LeanTrack**, a production-quality, mobile-first **Progressive Web App (PWA)** primarily used as a standalone app from an **iPhone Home Screen**. This is a personal training and weight-tracking app, not a generic health dashboard or diet-planning app.

The central loop is:

1. Open the app on the iPhone, see **today's actual date and assigned workout**.
2. Log **today's weight** and, optionally, **calories consumed today**, in seconds.
3. Start the assigned session, see each specific exercise and safe technique instructions.
4. Record every actual set (weight, reps, completed state), treadmill/bike session, and notes.
5. Save immediately to reliable device storage and securely synchronize to the signed-in user's cloud database.
6. Open tomorrow, next week, or on another device and see the **same saved history**.
7. Track progress from **240 lb** to **190 lb**, including trend rather than daily fluctuations.

**Primary job to be done:** “Make it impossible for me to forget what to do at the gym, and make tracking today's workout, weight, and calories fast enough that I actually do it.”

### Owner profile and preferences

| Setting | Initial value / behavior |
|---|---|
| Age at setup | 26, male (display only if useful, not a medical assessment) |
| Height | 5 ft 11 in / 71 in |
| Starting weight | **240 lb** |
| Goal weight | **190 lb**, final goal |
| Total intended loss | **50 lb** |
| Gym schedule | **4 days/week** |
| Main appearance goals | Reduce overall body fat, especially apparent at belly, chest, face, neck, thighs; preserve lean muscle; **do not emphasize chest hypertrophy** |
| Starting date | Thursday, **2026-11-12** |
| Default time zone | `America/New_York`, customizable |
| Preferred units | lb, mph, miles, minutes; optionally kg/km later |
| Calories | A **single daily calories-consumed log**, with optional editable daily target. **No meal planner** in v1. |
| Training experience | Returning after extended time off; prioritize easy-to-learn machines and controlled progression |

**Do not promise belly-targeted fat loss.** Explain in friendly, non-alarmist language that spot reduction is not reliable. Ab/core movements strengthen the core, while overall fat loss changes belly and chest appearance. Chest programming is conservative, not entirely eliminated.

### Sustainable pace, not crash dieting

A reasonable general weight-loss pace is about **1–2 lb/week**, making 50 lb roughly **25–50 weeks** in an idealized calculation; real-world progress can take longer due to stalls, recovery, adherence, and falling energy requirements. Surface this as an **approximate 6–12+ month range**, never a countdown promise or an invitation to overtrain. The app should reward completing sessions, sustainable trends, and recovery, not extreme exercise-calorie targets. See [CDC: Steps for Losing Weight](https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html).

---

## 2. Exact UI direction: the supplied screenshot is the visual reference

The included image `assets/design-reference.png` is the **primary aesthetic brief**. Study the visual language, **do not trace/copy every screen** or reuse the pictured person's photo without rights. Create an original polished design inspired by:

- Almost-black/graphite background, charcoal elevated panels, subtle border layers.
- **Vivid orange** for activity, completion, and calories; **electric blue** for progress/weight charts and hydration-style data cards.
- Large, heavy numeric typography and compact supporting labels.
- Asymmetric but intentional dashboard card composition; elegant line and bar charts.
- Rounded 20–28px cards, restrained shadows, high-contrast light text.
- Strong hierarchy: one primary action per screen; generous whitespace; no visual clutter.
- iPhone-native-feeling app shell with bottom tab navigation, sticky session controls, safe-area support.
- Friendly visual polish similar to a premium fitness app, **not a generic AI-made dashboard**.

### Design tokens (starting point, tune after visual review)

```css
:root {
  --background: #0B0D10;
  --surface: #171A1F;
  --surface-raised: #22262C;
  --surface-interactive: #2B3038;
  --border: #343A43;
  --text-primary: #F6F7F9;
  --text-secondary: #A5ADB8;
  --orange: #FF7A2F;
  --orange-soft: #3B251D;
  --blue: #347FEF;
  --blue-soft: #172D50;
  --success: #50C48B;
  --warning: #F0B35A;
  --danger: #EF7272;
  --radius-card: 24px;
  --radius-control: 14px;
  --touch-target: 44px;
}
```

Font: `Inter`, `SF Pro`-like system stack (`-apple-system, BlinkMacSystemFont, Inter, sans-serif`) with tabular numeric digits. Do **not** bundle Apple's proprietary system fonts. Use accessible contrast and honor `prefers-reduced-motion`.

### Responsive constraints

- **Primary targets:** iPhone widths around **375, 390/393, and 430 CSS px**.
- Use `viewport-fit=cover`, `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`; handle Dynamic Island/notch, home indicator, and iOS keyboard.
- 44×44 CSS pixel minimum touch targets. Never hide save controls behind the iOS keyboard.
- Support one-handed use, thumb-friendly bottom nav, swipe-free essential actions, scrolling exercise cards.
- Tablet/desktop usable via a narrow centered content region or appropriately extended grid.
- Charts must not overflow at 320–375px; no horizontal scrolling for key screens.

### Deliberate exclusions from the screenshot

Do not invent a medical “health score,” blood-pressure, oxygen, hydration, heart-rate, or BMI assessment merely because the reference shows them. Display **real logged facts only**. No fake 88% health score, fake calories burned, sample medical values, or fabricated workouts in production user data. Examples may live behind an explicit demo mode.

---

## 3. Information architecture and main navigation

Five tabs, with short readable labels:

| Tab | Purpose | Primary CTA |
|---|---|---|
| **Today** | Weight and calorie quick log, assigned workout, goal ring, highlights, recent trend | `Start today's workout` |
| **Workout** | Today's exercise list, start/resume session, individual set logging | `Finish workout` |
| **Progress** | Weight line chart, 7-day averages, goals/milestones, workout frequency, cardio minutes | `Log weight` |
| **History** | Calendar/list of completed sessions, individual exercises/sets, daily metrics | `View session` |
| **Settings** | Profile, schedule, goals, units, notifications if supported, export, account | `Save preferences` |

Avoid a sixth nav item for calories. Daily calories should be logged prominently from Today and edited from the dated History day-detail screen.

### Today dashboard: top-to-bottom layout

1. Header: **“Today, Thu Nov 12”** and small profile/avatar button; correct locale and time zone.
2. Weight card: **240.0 lb** (latest recorded), difference vs baseline, **190 lb goal**, progress bar with a transparent calculation. Tapping opens quick log.
3. Orange **Today's workout** card: e.g., “Upper Body A,” “5 exercises,” “~45–60 min,” scheduled date, large `Start / Resume` button. On rest days show **Recovery Day** with walk/stretch suggestion; never invent a workout.
4. Two quick-log tiles: **Weight** (`Log` or today's logged figure) and **Calories eaten** (`Log` or today's total). Display “Not logged” rather than `0` until data exists.
5. Blue trend panel: 7/30/90-day weight chart, optional toggle for weekly average; true data only.
6. Small stats cards: `Sessions completed this week`, `Cardio minutes this week`, `Consistency` (clearly defined; no secret scoring).
7. Upcoming schedule preview and recent activity. Bottom navigation remains available.

**Critical UX requirement:** A user's logged data must still be shown after browser refresh, app restart, closing the iPhone PWA, device restart, and login on another device.

---

## 4. Day-aware schedule (precise behavior)

Initial four-session rotation starts on **Thursday, November 12, 2026**:

| Day / weekday | Workout | Code |
|---|---|---|
| Thu Nov 12 and every Thursday | Upper Body A | `UPPER_A` |
| Sat Nov 14 and every Saturday | Lower Body A + Core | `LOWER_A` |
| Mon Nov 16 and every Monday | Upper Body B | `UPPER_B` |
| Wed Nov 18 and every Wednesday | Lower Body B + Core | `LOWER_B` |
| Tuesday, Friday, Sunday | Recovery / optional easy walk | `REST` |

**Important:** Scheduling is based on the user's **local calendar date** in their selected time zone, not hardcoded UTC timestamps or naive `new Date().toISOString().slice(0,10)`. The schedule recurs weekly and is fully editable in Settings. Handle daylight saving time, leap days, local midnight, and traveling.

**Missed workout logic:** Missing Thursday must **not silently mark Upper A complete** or skip its history. Let the user `Start scheduled workout`, `Move to another date`, `Skip with reason` (optional), or `Choose another template`. A session is completed only on explicit finish. Users can resume incomplete sessions. The Today screen should always explain scheduled vs performed workouts. Past session exercise details must remain as originally performed even if a template is edited later.

---

## 5. Four exact workout templates

All exercises default to **2 working sets** during Weeks 1–2. Set rest default **60–90 seconds**. Begin each session with about **5 minutes easy warmup**. Use an achievable effort with **2–3 clean reps still in reserve**, never train to failure as a default. After 2+ weeks of good recovery, optionally progress major movements to 3 sets. Actual weight, repetitions, effort, and adaptations are recorded per set.

### A. Thursday: Upper Body A (`UPPER_A`)

| Order | Exercise | Sets × reps | Equipment | Technique cues |
|---:|---|---|---|---|
| 1 | Lat pulldown | 2 × 12 | Pulldown machine | Thigh pad snug, pull toward upper chest, elbows downward, no behind-neck pulling |
| 2 | Seated cable row | 2 × 12 | Cable row | Spine neutral, pull toward lower ribs, do not swing or round back |
| 3 | Machine chest press | 2 × 10 | Chest press | Handles around mid-chest, back supported, smooth reps; moderate chest work only |
| 4 | Machine shoulder press | 2 × 10 | Selectorized shoulder press | Adjust seat, comfortable range, don't arch low back |
| 5 | Rope triceps pushdown | 2 × 12 | Cable high pulley | Elbows near sides, extend forearms only, do not swing |
| 6 | Treadmill | See Week 1–8 schedule | Treadmill | Comfortable pace, easy incline, use stop clip |

### B. Saturday: Lower Body A + Core (`LOWER_A`)

| Order | Exercise | Sets × reps | Equipment | Technique cues |
|---:|---|---|---|---|
| 1 | Leg press | 2 × 12 | Selectorized or sled press | Knees track over toes, hips stay supported, do not force deep range |
| 2 | Seated leg curl | 2 × 12 | Leg curl machine | Knee lines up with pivot, pad near lower leg, control both directions |
| 3 | Calf raise | 2 × 15 | Machine or bodyweight | Move through comfortable ankle range, avoid bouncing |
| 4 | Glute bridge | 2 × 12 | Mat/bodyweight | Drive through feet, lift hips without overarching spine |
| 5 | Dead bug | 2 × 8 / side | Mat | Keep back stable, alternate arm/leg slowly |
| 6 | Treadmill OR bike | See Week 1–8 schedule | Cardio | Choose bike if knees/feet feel irritated |

### C. Monday: Upper Body B (`UPPER_B`)

| Order | Exercise | Sets × reps | Equipment | Technique cues |
|---:|---|---|---|---|
| 1 | Seated cable row | 2 × 12 | Cable row | Stable torso, full control |
| 2 | Lat pulldown | 2 × 12 | Pulldown machine | Pulldown to upper chest, don't yank neck |
| 3 | Machine chest press | 2 × 10 | Chest press | Light-to-moderate, no high-volume chest specialization |
| 4 | Dumbbell lateral raise | 2 × 12 | Light dumbbells | Raise to near shoulder level, no shrug or swing |
| 5 | Pallof press | 2 × 10 / side | Cable at chest height | Brace core, resist rotation, press forward |
| 6 | Treadmill | See Week 1–8 schedule | Treadmill | Comfortable steady walk |

### D. Wednesday: Lower Body B + Core (`LOWER_B`)

| Order | Exercise | Sets × reps | Equipment | Technique cues |
|---:|---|---|---|---|
| 1 | Leg press | 2 × 12 | Selectorized or sled press | Use comfortable depth and slow, controlled reps |
| 2 | Leg extension | 2 × 12 | Extension machine | Knee aligned with pivot, gentle controlled extension |
| 3 | Seated leg curl | 2 × 12 | Leg curl | Control weight; don't lift hips |
| 4 | Glute bridge | 2 × 12 | Mat/bodyweight | Brace midsection, no low-back arch |
| 5 | Plank | 2 × 15–20 seconds | Mat | Elbows under shoulders, maintain steady breathing |
| 6 | Treadmill OR bike | See Week 1–8 schedule | Cardio | Lower-impact alternative permitted |

**Optional advanced substitutions, not in beginner seed:** goblet squat to bench, dumbbell Romanian deadlift, low step-ups, and dumbbell shoulder press. Include these in the searchable exercise library, but do not force them into the default first-week schedule. Each exercise detail must have starting setup, performance steps, breathing cue, common mistakes, and safety flags.

---

## 6. Starting machine weights: safe estimates, NOT prescriptions

**Body weight (240 lb) cannot determine the right starting gym weight.** Machines have different leverages and stack calibrations. These numbers are **very tentative first-test selections only**; the first set must be evaluated by feel and proper form. If the minimum stack/empty sled is too difficult, change machine or use bodyweight.

| Movement | Tentative **first-test** load | Important measurement note |
|---|---:|---|
| Lat pulldown | 25–45 lb | Selectorized stack displayed load |
| Seated cable row | 25–45 lb | Selectorized stack displayed load |
| Machine chest press | 20–40 lb | **Displayed stack**, not each arm |
| Machine shoulder press | 10–25 lb | Displayed stack; go lighter if difficult |
| Rope triceps pushdown | 10–20 lb | Cable stack may feel different with pulley ratio |
| Leg press, **selectorized/seated** | 40–80 lb | Only if the machine actually displays this resistance |
| Leg press, **45° plate-loaded sled** | **Empty sled / 0 added plates** | The carriage itself has weight. **Not** the same as a 40–80 lb selectorized press. Learn sled safety locks. |
| Seated leg curl | 15–35 lb | Selectorized stack |
| Leg extension | 15–35 lb | Selectorized stack |
| Calf raise | Bodyweight first | If on machine, use lowest controllable setting |
| Dumbbell lateral raise | 3–8 lb **per hand** | Not total of both hands |
| Pallof press | 5–15 lb | Cable displayed stack; prioritize no rotation |
| Glute bridge / dead bug / plank | Bodyweight | Record `bodyweight` rather than inventing a pound value |

### First-session load-finding algorithm

1. Set up machine correctly; perform a light **practice set of 8–10** at the easiest practical resistance.
2. Check ability to complete each repetition with stable posture, controlled movement, and no sharp pain.
3. Choose a working load that allows the prescribed repetitions while feeling that **2–3 more quality repetitions** would remain (roughly RPE 7–8; many first sessions may be easier).
4. If form breaks or 8–10 clean reps are not possible, lower the load or choose an alternative.
5. If far too easy, increase only the **smallest available increment** and retest.
6. Save actual completed `weight_lb`, `reps`, `set_index`, and optional `RPE` **per set**. Never use an estimate as an automatic completed set.
7. When all prescribed sets meet the top of the rep range with good form in **two consecutive sessions**, suggest *one small increment* (commonly 2.5–5 lb upper, 5–10 lb lower, but machine increments vary). This is a **suggestion**, not automatic forced progression.

Track both a machine's **unit and resistance mode** (`stack_display`, `per_dumbbell`, `per_side`, `total_added_plates`, `bodyweight`) to avoid confusing sled loads, per-hand weights, and stack displays. On 45° sleds record **added plate weight** and optionally the machine's unlabeled sled resistance separately, never pretend the sled is zero total mass.

Reference: [ACSM resistance-training update (2026)](https://acsm.org/resistance-training-guidelines-update-2026/) and [ACSM Resistance Training for Health](https://www.acsm.org/docs/default-source/files-for-resource-library/resistance-training-for-health.pdf).

---

## 7. Knee-friendly treadmill progression: 8-week default

**Goal:** Build walking volume, then speed/incline gradually, without chasing calorie-burn screens or aggravating knees. Start with gentle flat walking and increase **only one variable at a time**; no obligation to hit the top of any range.

| Week | Post-lift cardio/session | Incline target | Speed guidance | Progression |
|---:|---|---|---|---|
| 1 | 12–15 min | 0% | Comfortable, often ~2.0–2.5 mph | Learn controls and maintain natural stride |
| 2 | 15–18 min | 0–1% | Same/easy | Add only a few minutes if Week 1 felt fine |
| 3 | 18–20 min | 0–1% | Conversational | Extend time, not pace |
| 4 | 20–22 min | 0–2% | Conversational | Optional slight incline, not required |
| 5 | 22–25 min | 0–2% | Conversational | Add time first |
| 6 | 25–27 min | 0–3% | Comfortable | Optional modest incline if knees tolerate |
| 7 | 27–30 min | 0–3% | Comfortable | Sustain easy effort |
| 8 | 30 min | 0–4% **maximum optional** | Comfortable | Maintain or ease off; no 12-3-30 requirement |

- Each duration includes **3–5 minutes easy warm-up and 2–3 minutes cool-down**; exercise may be shorter than total session time.
- Avoid starting with 12% incline, sprint intervals, running, or 12-3-30. Incline is **optional**, not a mandate, and flat walking is effective.
- Use talk-test intensity: able to speak in sentences. Select a speed by comfort, not by body weight.
- Know the stop button/safety clip, wear supportive shoes, avoid leaning on rails as a walking technique.
- If joint pain rises above mild levels, gait changes, swelling occurs, or pain persists afterward, shorten, flatten, slow down, or use the **stationary bike**. Stop for sharp pain, dizziness, chest pain, or unusual breathlessness; address persistent/worsening symptoms before resuming.
- On non-gym days add optional gentle walks; gradually work toward **150 min/week** of moderate aerobic movement, as tolerated. Your program starts below that and builds up.
- Do not automatically inflate calories burned based on treadmill estimates or subtract them from the food-log number. If collected, label burns **estimates**.
- App shows today's recommended duration/speed/incline as **editable suggestions**, and saves **actual** values independently.

Sources: [CDC Physical Activity and Weight](https://www.cdc.gov/healthy-weight-growth/physical-activity/index.html), [Arthritis Foundation: treadmill safety](https://www.arthritis.org/health-wellness/healthy-living/physical-activity/walking/how-to-choose-and-use-a-treadmill), [walking progression](https://www.arthritis.org/health-wellness/healthy-living/physical-activity/walking/building-a-walking-workout).

---

## 8. Workouts: exact interaction behavior

**Session lifecycle:** `scheduled` (derived from rule) → `in_progress` → `completed`; alternatively `skipped`/`rescheduled`. An incomplete active workout can resume after refresh, iPhone lock, or app relaunch.

### Workout view

- Title + date + expected duration + exercise count + optional week number.
- Each exercise card: equipment icon/photo (licensed asset or original illustration), exact name, target sets/reps, form tips, usual starting test range, `Last time: 35 lb × 12` **only if actually logged**, `Replace exercise` button.
- Tap `Start Workout`: create session row with a **snapshot** of the assigned template/exercises.
- For each working set, show target, **editable actual weight**, reps stepper or numeric input, optional RPE, checkmark completion, remove/edit set; prefill *suggested weight* based on last good workout but never treat a prefill as an actual completed log.
- Easy `+ Add Set`, `Rest timer` (optional), `Mark exercise done` controls.
- Cardio logging: modality treadmill/bike, **actual** minutes, optional speed mph, incline %, distance miles, optional machine estimate calories, perceived difficulty, knee comfort note.
- When finishing: confirm if target exercises incomplete; show summary (duration, sets logged, exercises completed, cardio), allow note and `Save & Finish`.
- Session remains fully editable later from History (with audit-friendly `updated_at`).
- If screen closes mid-set, committed entries still persist. Unsubmitted form field drafts can be restored locally.

### Exercise detail / form library

Every default movement includes: `muscle groups`, `machine image or clean illustration`, `setup`, `how to perform`, `breathing`, `common mistakes`, `beginner adjustments`, `how to know the load is appropriate`, `alternative if unavailable`. If image licensing is unclear, use original vector diagrams or neutral equipment illustrations; **do not hotlink copyrighted images**. Include bodyweight core movements and cardio instruction cards too. Never turn illustrative weights into claims about what the user can safely lift.

### Training progression feature

On opening an exercise, display last successfully logged working weight, best recent set, and simple history chart. After two successful comparable sessions, offer a **nonbinding +small-increment suggestion**. Allow manual overrides and lighter recovery weeks. Do **not** auto-increase weights or manufacture personal records.

---

## 9. Weight and calorie logging, fully persisted

### Weight log

- Daily input: weight in **lb** (decimals allowed, e.g., `239.6`) with date picker defaulting to today.
- If one measurement already exists for the date, edit/upsert **that date's entry** rather than duplicate it. Keep `created_at` and `updated_at`.
- User can edit past logs, delete with confirmation, and log after missing a day. Gaps appear as gaps, **not zero**.
- Show **latest measurement**, difference since 240 lb, percent of 50-lb goal achieved, **7-day rolling average** (only real entries), weekly change, 30-/90-day charts.
- If current weight rises, show the true negative/positive change, no invented “progress.”
- Milestone markers: **230, 220, 210, 200, 190 lb**. Celebrate real milestone reach without guaranteeing a date.
- If weight drops below the starting weight, loss-to-goal percent = `(240 - latest_weight) / (240 - 190) * 100`, clamped visually to 0–100%; don't overwrite actual weight or conceal gain.
- Add an optional waist measurement later, but not required in v1.

### Calories log (minimal, no food planning)

- One simple **calories consumed** numeric field for each local date (e.g., `2150 kcal`).
- **Daily calorie goal optional**, editable in Settings; do not automatically prescribe 2,300 or treat exercise-machine calorie burns as an accurate offset.
- Fields: `date`, `calories_consumed`, `goal_kcal` optional/snapshot or derived from goal history, `note` optional.
- Empty means **not logged**, distinct from actual 0; no prefilled or fake intake.
- If user adds calories in parts, support **“Add 250 kcal”** and **“Set total 2150 kcal”** as clearly separate actions, with immediate correct totals. Prevent accidental double-add on network retry via idempotent mutation identifiers.
- Store `calories_burned_estimate` separately on optional cardio logs; do not subtract automatically from daily intake.
- Show 7/30-day calorie trend only if actual values exist; do not shame missing logs.

### Other optional day metrics

Steps manually entered (or a future authorized integration), sleep hours and waist circumference are **Phase 2**, not prerequisites. Don't pretend a web app automatically reads Apple Health or the watch without an actual supported integration and user permission.

---

## 10. Data persistence and security: non-negotiable

**Architecture:** A real authenticated cloud database as source of durable cross-device history **plus** local offline cache/queue for reliable iPhone use. `localStorage` alone is inadequate for long-term persistence and multi-device recovery.

**Recommended stack:**

- Frontend: **React + TypeScript + Vite**, PWA.
- Styles/UI: Tailwind CSS, accessible component primitives (e.g., shadcn/ui), Lucide icons.
- Visualizations: Recharts or an equally accessible chart library with real stored data.
- Routing: React Router.
- Form validation: Zod and React Hook Form (or equivalent).
- Cloud: **Supabase Postgres + Auth**, email one-time code authentication; don't require unreliable cross-context email magic-link redirects to make iPhone Home Screen login work.
- Client data: TanStack Query or equivalent plus explicit mutation status; use **IndexedDB** (e.g., Dexie) for offline cache/drafts/pending mutations.
- PWA: `vite-plugin-pwa` / Workbox service worker, web app manifest, iOS Home Screen icon.
- Deploy: Vercel (static SPA rewrite), Netlify, or equivalent HTTPS host.
- Testing: Vitest + React Testing Library + Playwright mobile emulation, with real-device iPhone Safari/PWA test checklist.

### Minimum database entities

| Entity | Fields / constraints |
|---|---|
| `profiles` | `id` = `auth.users.id`, height/starting_weight/goal_weight, units/timezone, preference timestamps |
| `workout_templates` | template ID/code/name/version/is_active; optionally user-owned custom templates |
| `template_exercises` | template ID, exercise ID, position, recommended sets/reps/rest, optional note; versioned behavior |
| `exercises` | ID, canonical name, equipment, type, muscle groups, load mode, safe form content, illustration URL (if licensed) |
| `workout_schedule` | user ID, weekday (0–6), template ID, active_from, enabled; user-specific overrides/reschedules |
| `workout_sessions` | UUID, user ID, scheduled date, actual local date/time, status, started/finished times, `template_snapshot` JSONB, notes |
| `session_exercises` | UUID, session ID, exercise ID, position, target snapshot, optional user substitutions |
| `set_logs` | UUID, session_exercise ID, set number, `weight_lb` nullable, `reps` integer, `rpe` optional, `load_mode`, completion timestamp |
| `cardio_logs` | UUID, user ID, session ID nullable, local date, equipment, minutes, speed_mph optional, incline_pct optional, distance_mi optional, machine_kcal_estimate optional, knee discomfort optional |
| `weight_logs` | UUID, user ID, **unique(user_id, local_date)**, numeric weight_lb, created_at, updated_at |
| `calorie_logs` | UUID, user ID, **unique(user_id, local_date)**, calories_consumed nullable, daily_goal_kcal nullable, updated_at |
| `sync_operations` (optional) | idempotent client mutation IDs/replay protections; logs must not duplicate on retry |

All user data tables enforce **Supabase Row-Level Security** policies checking `auth.uid() = user_id`. Nested `session_exercises` and `set_logs` enforce ownership via their parent session. Never grant anonymous public read/write of health or workout logs. Never expose the Supabase service-role key in client code; `.env.example` may contain placeholders for public URL/anon or publishable key only. Use security-definer functions sparingly and carefully.

### Persistence requirements

1. On saving a weight, calorie, completed set, or session, show `Saving…`, then only show `Saved` when committed to the local queue/database with an explicit cloud-sync state.
2. On flaky Wi-Fi/offline, **store locally in IndexedDB immediately**, show `Saved on this iPhone · Pending sync`, and queue an idempotent write for later reconciliation.
3. Resume sync at foreground and connectivity restoration (iOS background sync cannot be assumed). Show stale/pending/sync-error states; offer `Retry now`.
4. With network connectivity, send writes to Supabase and reconcile remote IDs. Use UUIDs generated client-side, `updated_at`, and conflict-aware per-record merge/update. Never blindly duplicate completed sets/calorie additions after retry.
5. Fetch persisted data after fresh login/app reinstall. Clearly explain that **unsynced local changes might be lost if the app is removed**; never promise permanent device-only storage.
6. Date-only entries use local `YYYY-MM-DD` with configured IANA time zone. Timestamps stored as UTC with local date maintained for grouping.
7. App refresh, close/reopen, 3G/offline, sign-out/sign-in, another device, and cross-midnight must be tested explicitly.
8. Provide `Export my data` in **JSON + CSV**, account deletion with confirmation, privacy-friendly error logs, and a clear offline sync indicator.
9. Use reasonable value validation: weight >0 and within a permissive human plausible range, reps nonnegative within bounds, cardio minutes positive, calories nonnegative. Reject NaN, decimals in integer fields, and empty-as-zero coercion.
10. Seed examples into **templates and exercise library only**. Never seed fabricated personalized completed logs, body weight history, or intake history into production accounts.

**Security caution:** These are sensitive fitness records. Minimize telemetry and avoid exposing logs to third-party analytics. Authenticate before enabling cloud syncing, and give clear sync/unsynced feedback.

---

## 11. iPhone Home Screen PWA specifics

Install user journey (prefer Safari): **open secure HTTPS URL → Share → Add to Home Screen → Add → open the new icon**. The standalone version should resemble a native app without Safari browser chrome. Exact Share menu text can vary by iOS version.

Mandatory technical checklist:

- Valid `manifest.webmanifest` with `name`, `short_name`, `description`, `start_url`, `scope`, `display: "standalone"`, `background_color`, `theme_color`, 192px and 512px icons including maskable as appropriate.
- `apple-touch-icon` (180×180), favicon, and suitable iOS meta tags where relevant.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Workbox service worker caches **app shell and static assets**; offline navigations work; do not cache sensitive API responses publicly or serve another user's private content after sign-out.
- Web app launches correctly after install and when navigating to deep links. Auth one-time code flow works in standalone mode.
- Safe-area insets around bottom nav and form actions; correct scrolling/keyboard behavior.
- Persistent app data comes from **cloud sync + IndexedDB**, not from assuming Safari and the installed PWA share identical browser storage. iOS installed app contexts may have separate storage.
- App handles service-worker updates gracefully without dropping an active session.
- Do not claim Apple Health integration, native background tracking, push notifications, Apple Watch sync, or automatic calorie calculation unless explicitly implemented and verified.

References: [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html), [web.dev PWA installation](https://web.dev/learn/pwa/installation), [MDN PWA installability](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

---

## 12. Progress dashboard and calculations

**Core charts:**

- **Weight trend chart**: `7 days`, `30 days`, `90 days`, `All`. Plot only logged observations. Support 7-day moving average that uses real entries and labels sample size.
- **Goal progress**: `start 240`, `latest actual`, `goal 190`; progress percentage explained in tooltip.
- **Workout consistency**: completed sessions / scheduled sessions in a selected period; skipped/rescheduled handled honestly.
- **Cardio minutes**: actual logged minutes, weekly bar chart vs optional activity goal.
- **Strength history**: per-exercise trend of last successfully completed working sets, differentiated by load mode; don't compare incomparable machines.
- **Calorie intake history**: only actual logged totals; goal line only if goal set.

**No misleading metrics:** Avoid extrapolating exact goal dates from short-term fluctuations. If offering a forecast later, show broad, uncertainty-aware range based on a sufficiently long trend. Never label training-estimated `kcal burned` as precise. Never infer body-fat percentage or spot-reduction rate from scale weight alone.

### Helpful dashboard states

- Empty account: motivating onboarding with action to log first weight; no synthetic chart.
- Data partially logged today: weight displayed, calories `Not logged`.
- Rest day: `Recovery Day`, optional walk, next workout preview.
- Completed today's workout: `Workout complete` and link to recorded details.
- Offline: subtle banner `Offline · Your logs are saved on this iPhone; sync pending`.
- Cloud sync error: retriable error state, not silent data loss.
- Goal reached: celebrate **190 lb**; offer **maintenance mode** rather than continuing aggressive deficit prompts.

---

## 13. Onboarding and settings

First run:

1. Brief splash: “Train consistently. Track honestly. Stay on course.”
2. Email + one-time code sign-in and clear explanation of cloud-sync benefits; optional demo mode separated from real data.
3. Prefilled editable profile: 240 lb starting weight, 190 lb goal, 5'11", 4 training days, New York time zone. **Do not pre-create a fake actual weigh-in**. The first weigh-in is a deliberate user action.
4. Verify schedule (Thu/Sat/Mon/Wed) and confirm Start date November 12, 2026 or use a new personal start date if installing later. The starter dates are initial defaults, not forever hardcoded into the UI.
5. Explain: `Record each set` / `Log morning weight` / `View progress` in 3 short cards, then land on Today.

Settings: edit starting weight and goal, schedule weekdays/templates, units, time zone, session rest defaults, accessibility and reduced motion preference, optional calorie target, export, sync status, account deletion, sign-out. When the goal changes, recompute progress using current selected baseline and transparently mark new target.

---

## 14. Release scope and delivery phases

**Phase 1, MVP (must be fully functional):**

- React/Vite/TypeScript PWA installed on iPhone, production-like design and app shell.
- Real Supabase login and RLS-enabled database.
- Today dashboard assigned workout based on local date.
- All four seeded workout templates and machine/exercise form guides.
- Start/resume/finish session; set logging weight/reps, cardio logs.
- Daily weight and daily calories consumed; edit/history; immediate persisted writes.
- Weight/goal progress, 7-/30-day trend, session history.
- Offline IndexedDB queue for critical writes, sync state and recovery.
- Deployed HTTPS environment and clear docs.

**Phase 2, improvements after MVP works:**

- Exercise substitutions, template editor, optional waist/steps, more detailed lift progression suggestions.
- Interactive charts and side-by-side strength trends, export options.
- Friendly rest timers, workout badges/streaks if accurate, advanced schedule overrides.
- Optional integrations only if the underlying browser/platform and privacy flows are genuinely supported.

**Out of scope:** meal plans, calorie/macro food databases, community/social features, paid subscriptions, invented “health scores,” wearables integration requiring native privileges, aggressive auto-coaching, unsupported medical diagnoses.

---

## 15. Acceptance criteria and verification suite

Ask the builder to verify each item on **iPhone-sized viewport and a real iPhone PWA** where possible. A UI screenshot alone is not a passing test.

| # | Scenario | Pass condition |
|---|---|---|
| 1 | Open Thursday 2026-11-12 in America/New_York | Shows `Upper Body A`, not wrong day from UTC conversion |
| 2 | Open Saturday 2026-11-14 | Shows `Lower Body A` |
| 3 | Open Monday 2026-11-16 | Shows `Upper Body B` |
| 4 | Open Wednesday 2026-11-18 | Shows `Lower Body B` |
| 5 | Open Tuesday / Friday / Sunday | Shows `Recovery Day`, next valid session preview |
| 6 | Log 239.6 lb for a local date, refresh | Entry persists, dashboard shows real latest reading |
| 7 | Log a second weight for same date | Existing entry updated; no duplicate row |
| 8 | Log calories for same date | Correct total persists; empty previous dates remain `Not logged` |
| 9 | Start workout, complete a 35 lb × 12 set, force close, reopen | In-progress session and completed set remain recorded |
| 10 | Finish workout and open History | All actual sets, cardio duration, date, notes persist |
| 11 | Offline logging, then regain connection | Visible pending status resolves and data syncs without duplication |
| 12 | Sign in from second device | Cloud-synced weight, calories, and sessions appear correctly |
| 13 | Sign in as user B | User B cannot read or mutate user A's data (RLS test) |
| 14 | Screen 375px wide with iPhone home indicator | No clipped inputs, charts, tabs, or action buttons |
| 15 | PWA installed via Home Screen | Opens in standalone mode and retains authenticated session appropriately |
| 16 | Change weight goal and schedule | Progress and future schedule update; past workout history does not mutate |
| 17 | No logged measurements | No fabricated values or empty chart presented as a real trend |
| 18 | Dumbbell 10 lb/hand vs machine 40 lb stack | Load mode recorded; histories are not falsely combined |
| 19 | App offline and opened fresh after initial install | Cached app shell opens and presents locally available data with clear sync state |
| 20 | Export JSON/CSV and request account deletion | Export complete; authenticated deletion flow removes owned personal data |

Tests: unit tests for date/schedule/weight-progress/merge logic; integration tests for CRUD/auth/RLS; Playwright flows for Today → Workout → History; offline/online recovery; automated lint/type-check/build; iPhone Safari standalone smoke testing.

### Definition of done

**Do not call the product complete because it looks good.** It is complete only when logged weight, calories, sets, and workouts survive reloads/restarts, remain scoped to the user, round-trip across devices, and render correctly as an installed iPhone Home Screen PWA.

---

## 16. Instructions to hand this project to Antigravity

1. Create a new empty coding project (folder name suggestion: `leantrack`).
2. Place **this README**, `ANTIGRAVITY_BUILD_PROMPT.md`, and `assets/design-reference.png` in the project root/asset folder (retain the paths).
3. Copy the **entire contents** of `ANTIGRAVITY_BUILD_PROMPT.md` into Antigravity's software-engineering agent chat.
4. Let it build the app with real persistence. Supply your Supabase project URL and **publishable/anon** key through an environment file once it asks. **Never paste a service-role secret into browser code.**
5. Review its browser/mobile screenshots, data persistence tests, and deployment URL. Then open the deployed HTTPS URL on your iPhone and select **Share → Add to Home Screen**.

The accompanying prompt directs Antigravity to implement this spec, run tests, show evidence of actual writes, and avoid stopping at wireframes or static pages.

### External references

- [CDC: Losing weight](https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html)
- [CDC: Physical activity guidance](https://www.cdc.gov/healthy-weight-growth/physical-activity/index.html)
- [ACSM 2026 resistance-training guideline summary](https://acsm.org/resistance-training-guidelines-update-2026/)
- [Arthritis Foundation: treadmill safety](https://www.arthritis.org/health-wellness/healthy-living/physical-activity/walking/how-to-choose-and-use-a-treadmill)
- [Apple: web applications on iOS](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [web.dev: PWA installation and iOS caveats](https://web.dev/learn/pwa/installation)

---

**End of requirements.** Use `ANTIGRAVITY_BUILD_PROMPT.md` for the detailed executable agent prompt.
