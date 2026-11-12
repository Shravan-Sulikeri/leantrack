-- LeanTrack Initial Schema Migration
-- Enables UUID generation and creates all tables with proper constraints

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    height_inches NUMERIC(4,1) DEFAULT 71.0,
    starting_weight_lb NUMERIC(5,1) DEFAULT 240.0,
    goal_weight_lb NUMERIC(5,1) DEFAULT 190.0,
    timezone TEXT DEFAULT 'America/New_York',
    units TEXT DEFAULT 'imperial' CHECK (units IN ('imperial', 'metric')),
    daily_calorie_goal INTEGER DEFAULT NULL,
    schedule_start_date DATE DEFAULT '2026-11-12',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Exercises Catalog Table (Global Reference)
CREATE TABLE IF NOT EXISTS public.exercises (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    equipment TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('strength', 'cardio', 'core', 'bodyweight')),
    muscle_groups TEXT[] NOT NULL DEFAULT '{}',
    load_mode TEXT NOT NULL CHECK (load_mode IN ('stack_display', 'per_dumbbell', 'per_side', 'total_added_plates', 'bodyweight')),
    first_test_range TEXT,
    setup TEXT NOT NULL,
    how_to_perform TEXT[] NOT NULL DEFAULT '{}',
    breathing TEXT NOT NULL,
    common_mistakes TEXT[] NOT NULL DEFAULT '{}',
    beginner_adjustments TEXT,
    safety_flags TEXT[] NOT NULL DEFAULT '{}',
    alternatives TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workout Templates (Global Reference)
CREATE TABLE IF NOT EXISTS public.workout_templates (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    day_name TEXT NOT NULL,
    weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    description TEXT,
    estimated_minutes INTEGER DEFAULT 45,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Template Exercises (Junction)
CREATE TABLE IF NOT EXISTS public.template_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id TEXT NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    target_sets INTEGER NOT NULL DEFAULT 2,
    target_reps TEXT NOT NULL DEFAULT '12',
    rest_seconds INTEGER NOT NULL DEFAULT 75,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(template_id, sort_order)
);

-- 5. User Workout Schedule Overrides (Per-User)
CREATE TABLE IF NOT EXISTS public.workout_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    template_id TEXT REFERENCES public.workout_templates(id) ON DELETE SET NULL,
    active_from DATE DEFAULT CURRENT_DATE,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, weekday)
);

-- 6. Workout Sessions
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id TEXT REFERENCES public.workout_templates(id),
    scheduled_date DATE NOT NULL,
    actual_date DATE,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped')),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    template_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON public.workout_sessions(user_id, scheduled_date);

-- 7. Session Exercises
CREATE TABLE IF NOT EXISTS public.session_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES public.exercises(id),
    position INTEGER NOT NULL,
    target_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, position)
);

-- 8. Set Logs
CREATE TABLE IF NOT EXISTS public.set_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_exercise_id UUID NOT NULL REFERENCES public.session_exercises(id) ON DELETE CASCADE,
    set_index INTEGER NOT NULL,
    weight_lb NUMERIC(5,1),
    reps INTEGER NOT NULL CHECK (reps >= 0),
    rpe NUMERIC(3,1) CHECK (rpe IS NULL OR (rpe >= 1.0 AND rpe <= 10.0)),
    load_mode TEXT NOT NULL CHECK (load_mode IN ('stack_display', 'per_dumbbell', 'per_side', 'total_added_plates', 'bodyweight')),
    is_warmup BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_exercise_id, set_index)
);

-- 9. Cardio Logs
CREATE TABLE IF NOT EXISTS public.cardio_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.workout_sessions(id) ON DELETE SET NULL,
    local_date DATE NOT NULL,
    equipment TEXT NOT NULL CHECK (equipment IN ('treadmill', 'stationary_bike', 'elliptical', 'outdoor_walk', 'other')),
    duration_minutes NUMERIC(4,1) NOT NULL CHECK (duration_minutes > 0),
    speed_mph NUMERIC(3,1),
    incline_pct NUMERIC(3,1),
    distance_miles NUMERIC(4,2),
    machine_kcal_estimate INTEGER,
    knee_comfort TEXT CHECK (knee_comfort IN ('great', 'comfortable', 'mild_tightness', 'pain_stopped')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cardio_user_date ON public.cardio_logs(user_id, local_date);

-- 10. Weight Logs (Single source of truth, unique per user + local date)
CREATE TABLE IF NOT EXISTS public.weight_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    local_date DATE NOT NULL,
    weight_lb NUMERIC(5,1) NOT NULL CHECK (weight_lb > 50.0 AND weight_lb < 800.0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_weight_user_date UNIQUE(user_id, local_date)
);

CREATE INDEX IF NOT EXISTS idx_weight_user_date ON public.weight_logs(user_id, local_date);

-- 11. Calorie Logs (Single source of truth, unique per user + local date)
CREATE TABLE IF NOT EXISTS public.calorie_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    local_date DATE NOT NULL,
    calories_consumed INTEGER CHECK (calories_consumed IS NULL OR calories_consumed >= 0),
    daily_goal_kcal INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_calories_user_date UNIQUE(user_id, local_date)
);

CREATE INDEX IF NOT EXISTS idx_calories_user_date ON public.calorie_logs(user_id, local_date);

-- 12. Idempotent Sync Operations Queue
CREATE TABLE IF NOT EXISTS public.sync_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    operation_id TEXT NOT NULL UNIQUE,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('insert', 'update', 'upsert', 'delete')),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sync_user_status ON public.sync_operations(user_id, status);
