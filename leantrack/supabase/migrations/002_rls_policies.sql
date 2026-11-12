-- LeanTrack Row Level Security (RLS) Policies
-- Strict isolation: users can never view or mutate data belonging to other users

-- 1. Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Exercises Catalog (Public readable for authenticated users, read-only)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read exercises catalog"
    ON public.exercises FOR SELECT
    TO authenticated
    USING (true);

-- 3. Workout Templates (Public readable for authenticated users)
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read workout templates"
    ON public.workout_templates FOR SELECT
    TO authenticated
    USING (true);

-- 4. Template Exercises (Public readable for authenticated users)
ALTER TABLE public.template_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read template exercises"
    ON public.template_exercises FOR SELECT
    TO authenticated
    USING (true);

-- 5. Workout Schedule Overrides
ALTER TABLE public.workout_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own schedule"
    ON public.workout_schedule FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Workout Sessions
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout sessions"
    ON public.workout_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions"
    ON public.workout_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions"
    ON public.workout_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions"
    ON public.workout_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Session Exercises (Enforce ownership through parent session)
ALTER TABLE public.session_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view session exercises for their own sessions"
    ON public.session_exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_sessions s
            WHERE s.id = session_exercises.session_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert session exercises for their own sessions"
    ON public.session_exercises FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_sessions s
            WHERE s.id = session_exercises.session_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update session exercises for their own sessions"
    ON public.session_exercises FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_sessions s
            WHERE s.id = session_exercises.session_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete session exercises for their own sessions"
    ON public.session_exercises FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_sessions s
            WHERE s.id = session_exercises.session_id
            AND s.user_id = auth.uid()
        )
    );

-- 8. Set Logs (Enforce ownership through session_exercise -> session)
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sets for their own sessions"
    ON public.set_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.session_exercises se
            JOIN public.workout_sessions s ON s.id = se.session_id
            WHERE se.id = set_logs.session_exercise_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert sets for their own sessions"
    ON public.set_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.session_exercises se
            JOIN public.workout_sessions s ON s.id = se.session_id
            WHERE se.id = set_logs.session_exercise_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update sets for their own sessions"
    ON public.set_logs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.session_exercises se
            JOIN public.workout_sessions s ON s.id = se.session_id
            WHERE se.id = set_logs.session_exercise_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete sets for their own sessions"
    ON public.set_logs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.session_exercises se
            JOIN public.workout_sessions s ON s.id = se.session_id
            WHERE se.id = set_logs.session_exercise_id
            AND s.user_id = auth.uid()
        )
    );

-- 9. Cardio Logs
ALTER TABLE public.cardio_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own cardio logs"
    ON public.cardio_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 10. Weight Logs
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own weight logs"
    ON public.weight_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 11. Calorie Logs
ALTER TABLE public.calorie_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own calorie logs"
    ON public.calorie_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 12. Sync Operations
ALTER TABLE public.sync_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own sync operations"
    ON public.sync_operations FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
