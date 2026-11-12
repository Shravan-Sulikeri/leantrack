-- LeanTrack Migration 003: v1.2 Workout System & Template Updates
-- Backward compatible: Does not modify historical workout_sessions or set_logs.

-- 1. Add category to exercises table if not exists
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS category TEXT;

-- 2. Add strength_minutes and cardio_minutes to workout_templates
ALTER TABLE public.workout_templates ADD COLUMN IF NOT EXISTS strength_minutes INTEGER DEFAULT 60;
ALTER TABLE public.workout_templates ADD COLUMN IF NOT EXISTS cardio_minutes INTEGER DEFAULT 15;

-- 3. Upsert reference exercises with category and load_mode
INSERT INTO public.exercises (id, name, category, equipment, type, muscle_groups, load_mode, first_test_range, setup, how_to_perform, breathing, common_mistakes, beginner_adjustments, safety_flags, alternatives)
VALUES
('ex-db-shoulder-press', 'Dumbbell Shoulder Press', 'Dumbbell', 'Pair of light-to-moderate dumbbells, seated flat bench', 'strength',
 ARRAY['shoulders', 'front delts', 'lateral delts', 'triceps'], 'per_dumbbell', '10–15 lb per dumbbell',
 'Sit upright with dumbbells at shoulder height, palms angled slightly inward (45°). Feet flat, core braced.',
 ARRAY['Press dumbbells straight overhead in smooth arc.', 'Stop just short of elbow lockout overhead.', 'Pause at top contraction.', 'Lower dumbbells slowly over 2–3s to ear level.'],
 'Exhale as you press dumbbells upward. Inhale as you lower.',
 ARRAY['Pressing forward instead of overhead', 'Excessively arching lower back off backrest', 'Using too heavy weight with jerky momentum'],
 'Logged weight is per dumbbell (each hand). Choose a weight where 10 reps are controlled with 2 reps in reserve.',
 ARRAY['Stop immediately if front shoulder pinching occurs.'],
 ARRAY['Machine shoulder press', 'Seated dumbbell neutral-grip press'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  equipment = EXCLUDED.equipment,
  load_mode = EXCLUDED.load_mode,
  first_test_range = EXCLUDED.first_test_range,
  setup = EXCLUDED.setup,
  how_to_perform = EXCLUDED.how_to_perform,
  breathing = EXCLUDED.breathing,
  common_mistakes = EXCLUDED.common_mistakes,
  beginner_adjustments = EXCLUDED.beginner_adjustments,
  safety_flags = EXCLUDED.safety_flags,
  alternatives = EXCLUDED.alternatives;

INSERT INTO public.exercises (id, name, category, equipment, type, muscle_groups, load_mode, first_test_range, setup, how_to_perform, breathing, common_mistakes, beginner_adjustments, safety_flags, alternatives)
VALUES
('ex-db-bicep-curl', 'Dumbbell Biceps Curls', 'Dumbbell', 'Pair of dumbbells', 'strength',
 ARRAY['biceps', 'brachialis', 'forearms'], 'per_dumbbell', '10–15 lb per dumbbell',
 'Stand tall with dumbbells hanging at arm length at sides. Core braced, chest proud.',
 ARRAY['Curl dumbbells upward while supinating palms toward shoulders.', 'Squeeze biceps firmly at top.', 'Lower under control over 3 full seconds.', 'Keep upper arms motionless pinned near ribs.'],
 'Exhale as you curl dumbbells upward. Inhale lowering under control.',
 ARRAY['Swinging elbows forward or backward', 'Using body sway to hoist dumbbells', 'Rushing the downward eccentric phase'],
 'Logged weight is per dumbbell (each hand). Keep reps strict.',
 ARRAY['Stop if sharp inner elbow pain occurs.'],
 ARRAY['Cable bicep curl', 'EZ-bar curl'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  equipment = EXCLUDED.equipment,
  load_mode = EXCLUDED.load_mode,
  first_test_range = EXCLUDED.first_test_range,
  setup = EXCLUDED.setup,
  how_to_perform = EXCLUDED.how_to_perform,
  breathing = EXCLUDED.breathing,
  common_mistakes = EXCLUDED.common_mistakes,
  beginner_adjustments = EXCLUDED.beginner_adjustments,
  safety_flags = EXCLUDED.safety_flags,
  alternatives = EXCLUDED.alternatives;

INSERT INTO public.exercises (id, name, category, equipment, type, muscle_groups, load_mode, first_test_range, setup, how_to_perform, breathing, common_mistakes, beginner_adjustments, safety_flags, alternatives)
VALUES
('ex-one-arm-db-row', 'One-Arm Dumbbell Rows', 'Dumbbell', 'Single dumbbell, flat exercise bench', 'strength',
 ARRAY['lats', 'upper back', 'rhomboids', 'rear delts', 'biceps'], 'per_dumbbell', '15–25 lb single dumbbell',
 'Place left knee and left hand on flat bench for solid torso support. Right foot flat on floor. Hold dumbbell in right hand.',
 ARRAY['Keep spine neutral and neck relaxed.', 'Pull dumbbell toward hip crease driving elbow straight back.', 'Squeeze lat and upper back 1 full second.', 'Lower dumbbell slowly with complete control.'],
 'Exhale pulling dumbbell up to hip. Inhale lowering slowly.',
 ARRAY['Rotating chest open aggressively toward ceiling', 'Pulling straight up into shoulder instead of back toward hip', 'Yanking dumbbell with momentum'],
 'Logged weight is per dumbbell. Bench support protects the lower back.',
 ARRAY['Maintain flat lower back; stop if lower back strains.'],
 ARRAY['Chest-supported incline dumbbell row', 'Cable single-arm row'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  equipment = EXCLUDED.equipment,
  load_mode = EXCLUDED.load_mode,
  first_test_range = EXCLUDED.first_test_range,
  setup = EXCLUDED.setup,
  how_to_perform = EXCLUDED.how_to_perform,
  breathing = EXCLUDED.breathing,
  common_mistakes = EXCLUDED.common_mistakes,
  beginner_adjustments = EXCLUDED.beginner_adjustments,
  safety_flags = EXCLUDED.safety_flags,
  alternatives = EXCLUDED.alternatives;

INSERT INTO public.exercises (id, name, category, equipment, type, muscle_groups, load_mode, first_test_range, setup, how_to_perform, breathing, common_mistakes, beginner_adjustments, safety_flags, alternatives)
VALUES
('ex-db-rear-delt-fly', 'Dumbbell Rear-Delt Fly', 'Dumbbell', 'Pair of light dumbbells', 'strength',
 ARRAY['rear delts', 'rhomboids', 'middle traps'], 'per_dumbbell', '5–10 lb per dumbbell',
 'Hinge hips backward 45° with flat back, or sit at end of flat bench bent over thighs. Palms facing each other.',
 ARRAY['Raise dumbbells laterally in wide arc with slight elbow bend.', 'Squeeze back of shoulders at peak.', 'Lower slowly under tension.'],
 'Exhale as you raise dumbbells laterally. Inhale returning to start.',
 ARRAY['Shrugging traps up to ears', 'Swinging torso upward to heave weight', 'Using too heavy weight'],
 'Logged weight is per dumbbell. Very light weights are standard.',
 ARRAY['Stop if shoulder joint grinds.'],
 ARRAY['Cable face pull', 'Reverse pec deck machine'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  equipment = EXCLUDED.equipment,
  load_mode = EXCLUDED.load_mode,
  first_test_range = EXCLUDED.first_test_range,
  setup = EXCLUDED.setup,
  how_to_perform = EXCLUDED.how_to_perform,
  breathing = EXCLUDED.breathing,
  common_mistakes = EXCLUDED.common_mistakes,
  beginner_adjustments = EXCLUDED.beginner_adjustments,
  safety_flags = EXCLUDED.safety_flags,
  alternatives = EXCLUDED.alternatives;

INSERT INTO public.exercises (id, name, category, equipment, type, muscle_groups, load_mode, first_test_range, setup, how_to_perform, breathing, common_mistakes, beginner_adjustments, safety_flags, alternatives)
VALUES
('ex-db-hammer-curl', 'Dumbbell Hammer Curls', 'Dumbbell', 'Pair of dumbbells', 'strength',
 ARRAY['brachialis', 'brachioradialis', 'biceps', 'forearms'], 'per_dumbbell', '10–15 lb per dumbbell',
 'Stand tall holding dumbbells with palms facing each other (neutral grip). Elbows pinned near ribs.',
 ARRAY['Curl dumbbells upward maintaining neutral palms.', 'Squeeze at top contraction.', 'Lower over 3 seconds to complete extension.'],
 'Exhale curling dumbbells up. Inhale lowering slowly.',
 ARRAY['Elbow drift backward or forward', 'Arching back', 'Swaying hips'],
 'Logged weight is per dumbbell. Neutral grip is gentle on wrists.',
 ARRAY['Stop on wrist or elbow twinge.'],
 ARRAY['Rope cable hammer curl', 'Cross-body hammer curl'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  equipment = EXCLUDED.equipment,
  load_mode = EXCLUDED.load_mode,
  first_test_range = EXCLUDED.first_test_range,
  setup = EXCLUDED.setup,
  how_to_perform = EXCLUDED.how_to_perform,
  breathing = EXCLUDED.breathing,
  common_mistakes = EXCLUDED.common_mistakes,
  beginner_adjustments = EXCLUDED.beginner_adjustments,
  safety_flags = EXCLUDED.safety_flags,
  alternatives = EXCLUDED.alternatives;

INSERT INTO public.exercises (id, name, category, equipment, type, muscle_groups, load_mode, first_test_range, setup, how_to_perform, breathing, common_mistakes, beginner_adjustments, safety_flags, alternatives)
VALUES
('ex-db-glute-bridge', 'Dumbbell Glute Bridges', 'Dumbbell', 'Single dumbbell, exercise mat', 'strength',
 ARRAY['glutes', 'hamstrings', 'core'], 'per_dumbbell', '15–25 lb single dumbbell',
 'Lie on back with knees bent at 90°, feet flat hip-width. Rest dumbbell horizontally across hip crease, holding it securely.',
 ARRAY['Brace abdominal wall.', 'Drive through heels to lift hips until thighs and torso align.', 'Hold 2-second hard glute contraction at top.', 'Lower slowly without dropping hips abruptly.'],
 'Exhale driving hips up into extension. Inhale lowering slowly to mat.',
 ARRAY['Hyperextending lower back at top', 'Pushing from toes instead of heels', 'Flaring ribs upward'],
 'Single dumbbell across pelvis. Never hyperextend lumbar spine.',
 ARRAY['Stop immediately if lower back pinches.'],
 ARRAY['Bodyweight glute bridge', 'Single-leg glute bridge'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  equipment = EXCLUDED.equipment,
  load_mode = EXCLUDED.load_mode,
  first_test_range = EXCLUDED.first_test_range,
  setup = EXCLUDED.setup,
  how_to_perform = EXCLUDED.how_to_perform,
  breathing = EXCLUDED.breathing,
  common_mistakes = EXCLUDED.common_mistakes,
  beginner_adjustments = EXCLUDED.beginner_adjustments,
  safety_flags = EXCLUDED.safety_flags,
  alternatives = EXCLUDED.alternatives;

-- Update categories on existing exercises
UPDATE public.exercises SET category = 'Machine' WHERE id IN ('ex-lat-pulldown', 'ex-cable-row', 'ex-chest-press', 'ex-shoulder-press', 'ex-leg-press', 'ex-leg-curl', 'ex-leg-extension');
UPDATE public.exercises SET category = 'Dumbbell' WHERE id IN ('ex-lateral-raise', 'ex-goblet-squat', 'ex-romanian-deadlift', 'ex-step-ups');
UPDATE public.exercises SET category = 'Cable' WHERE id IN ('ex-tricep-pushdown', 'ex-pallof-press');
UPDATE public.exercises SET category = 'Bodyweight' WHERE id IN ('ex-calf-raise', 'ex-dead-bug', 'ex-plank', 'ex-glute-bridge');
UPDATE public.exercises SET category = 'Cardio' WHERE id IN ('ex-treadmill', 'ex-stationary-bike');

-- 4. Update Workout Templates to v1.2 specifications (75 min, 60m strength + 15m cardio, version 2)
UPDATE public.workout_templates
SET
  name = 'Upper Body A',
  description = 'Back, shoulders, arms, and moderate chest development (60 min strength + 15 min cardio)',
  estimated_minutes = 75,
  strength_minutes = 60,
  cardio_minutes = 15,
  version = 2
WHERE code = 'UPPER_A';

UPDATE public.workout_templates
SET
  name = 'Lower Body A',
  description = 'Legs, thighs, glutes, hamstrings, and core (60 min strength + 15 min cardio)',
  estimated_minutes = 75,
  strength_minutes = 60,
  cardio_minutes = 15,
  version = 2
WHERE code = 'LOWER_A';

UPDATE public.workout_templates
SET
  name = 'Upper Body B',
  description = 'Back definition, shoulders, arms, and maintaining chest strength (60 min strength + 15 min cardio)',
  estimated_minutes = 75,
  strength_minutes = 60,
  cardio_minutes = 15,
  version = 2
WHERE code = 'UPPER_B';

UPDATE public.workout_templates
SET
  name = 'Lower Body B',
  description = 'Legs, glutes, hamstrings, and core (60 min strength + 15 min cardio)',
  estimated_minutes = 75,
  strength_minutes = 60,
  cardio_minutes = 15,
  version = 2
WHERE code = 'LOWER_B';
