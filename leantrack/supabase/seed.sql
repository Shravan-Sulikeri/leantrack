-- LeanTrack Seed Data
-- Seeds reference exercises and 4 starter workout templates ONLY.
-- Does NOT seed fake user profiles, logged weights, calories, or sessions.

-- 1. Insert Reference Exercises
INSERT INTO public.exercises (id, name, equipment, type, muscle_groups, load_mode, first_test_range, setup, how_to_perform, breathing, common_mistakes, beginner_adjustments, safety_flags, alternatives)
VALUES
('ex-lat-pulldown', 'Lat Pulldown', 'Cable machine – lat pulldown station', 'strength',
 ARRAY['lats', 'biceps', 'rear delts', 'rhomboids'], 'stack_display', '25–45 lb stack',
 'Adjust thigh pad so knees are snug with feet flat. Grip wide bar slightly wider than shoulders.',
 ARRAY['Sit tall with 15° backward lean.', 'Pull bar to upper chest leading with elbows.', 'Hold brief squeeze at bottom.', 'Slowly return to full stretch over 2–3s.'],
 'Exhale as you pull bar down. Inhale on the controlled return.',
 ARRAY['Leaning excessively back', 'Pulling behind the neck', 'Using momentum to swing'],
 'Start with lightest comfortable weight. Keep torso quiet.',
 ARRAY['Stop if shoulder pinch occurs.', 'Never pull behind neck.'],
 ARRAY['Assisted pull-up', 'Resistance band pulldown']),

('ex-cable-row', 'Seated Cable Row', 'Cable machine – low row station with V-handle', 'strength',
 ARRAY['mid-back', 'lats', 'biceps', 'rear delts'], 'stack_display', '25–45 lb stack',
 'Sit on bench with feet on footplates, knees slightly bent. Grab V-handle and sit upright.',
 ARRAY['Begin with arms extended and chest proud.', 'Pull handle to lower ribs driving elbows straight back.', 'Squeeze shoulder blades together 1s.', 'Extend arms slowly without rounding back.'],
 'Exhale as you pull handle. Inhale as you extend forward.',
 ARRAY['Rocking torso back and forth', 'Rounding lower back', 'Shrugging shoulders into ears'],
 'Think chest to handle rather than hands to chest.',
 ARRAY['Maintain neutral lower spine.', 'Avoid jerking weights.'],
 ARRAY['Machine seated row', 'Chest-supported dumbbell row']),

('ex-chest-press', 'Machine Chest Press', 'Selectorized chest press machine', 'strength',
 ARRAY['chest', 'front delts', 'triceps'], 'stack_display', '20–40 lb stack',
 'Adjust seat height so handles level with mid-chest. Back flat on pad, feet planted.',
 ARRAY['Grip handles firmly with palms forward.', 'Press forward smoothly without locking elbows.', 'Pause at full extension and squeeze chest.', 'Return slowly until comfortable stretch.'],
 'Exhale as you press outward. Inhale as you return.',
 ARRAY['Flaring elbows out to 90°', 'Arching lower back off pad', 'Locking out elbows violently'],
 'Keep chest work conservative at 2x10 twice per week. Spot fat reduction is impossible.',
 ARRAY['Stop if front shoulder pinching occurs.'],
 ARRAY['Elevated push-ups', 'Dumbbell bench press']),

('ex-shoulder-press', 'Machine Shoulder Press', 'Selectorized shoulder press machine', 'strength',
 ARRAY['front delts', 'lateral delts', 'triceps', 'upper traps'], 'stack_display', '10–25 lb stack',
 'Adjust seat so handles start at ear height. Back flat against pad.',
 ARRAY['Grip handles with palms forward or neutral.', 'Press upward in smooth arc until arms nearly straight.', 'Pause at top contraction.', 'Lower under control to ear height.'],
 'Exhale on press upward. Inhale lowering back to ears.',
 ARRAY['Pressing forward instead of straight up', 'Aggressively arching lower back', 'Lowering too deep past ear level'],
 'Use very light weight initially. If neck tenses, go lighter.',
 ARRAY['Stop immediately on sharp shoulder pinching.'],
 ARRAY['Seated dumbbell press', 'Band overhead press']),

('ex-tricep-pushdown', 'Rope Triceps Pushdown', 'Cable high pulley with rope attachment', 'strength',
 ARRAY['triceps'], 'stack_display', '10–20 lb stack',
 'Attach rope to high pulley. Stand with slight hip hinge, upper arms pinned to ribs.',
 ARRAY['Grab rope with neutral grip.', 'Push rope down by straightening elbows.', 'Flare rope ends apart at bottom and hold 1s.', 'Slowly return to 90°.'],
 'Exhale pushing down. Inhale returning to 90°.',
 ARRAY['Flaring elbows forward and swinging', 'Leaning torso over rope', 'Letting rope rise past 90°'],
 'Start at 10-15 lb. Isolate triceps completely.',
 ARRAY['Stop if elbow tendon pain occurs.'],
 ARRAY['Straight bar pushdown', 'Bench dips']),

('ex-leg-press', 'Leg Press', 'Selectorized or 45° sled press', 'strength',
 ARRAY['quads', 'glutes', 'hamstrings'], 'stack_display', '40–80 lb stack / 0 added plates on 45° sled',
 'Sit deep with back and hips firmly pressed against pad. Feet shoulder-width in middle of platform.',
 ARRAY['Disengage safety handles with control.', 'Lower platform until knees reach 90° angle.', 'Keep knees tracking over 2nd toe.', 'Press through full foot back without locking knees.'],
 'Inhale lowering platform. Exhale pressing away.',
 ARRAY['Locking knees straight at top', 'Hips lifting or curling off seat', 'Pushing only through toes'],
 'Never force deep range. On 45° sled, ALWAYS start with 0 added plates.',
 ARRAY['NEVER lock knees at top.', 'Keep lower back glued to pad.'],
 ARRAY['Goblet squat to bench', 'Bodyweight box squat']),

('ex-leg-curl', 'Seated Leg Curl', 'Selectorized seated leg curl machine', 'strength',
 ARRAY['hamstrings'], 'stack_display', '15–35 lb stack',
 'Align pivot with knee joint. Lower pad just above Achilles tendon. Lock thigh pad snugly.',
 ARRAY['Grip side handles lightly.', 'Curl heels down and back toward glutes.', 'Squeeze hamstrings 1s at full contraction.', 'Slowly return over 3s under control.'],
 'Exhale curling down. Inhale extending legs back.',
 ARRAY['Using momentum to swing', 'Lifting hips off seat', 'Thigh pad too loose'],
 'Focus on slow controlled curl. Stop before cramping.',
 ARRAY['Stop on sharp pull behind knee.'],
 ARRAY['Lying leg curl', 'Stability ball leg curl']),

('ex-leg-extension', 'Leg Extension', 'Selectorized leg extension machine', 'strength',
 ARRAY['quads'], 'stack_display', '15–35 lb stack',
 'Align pivot with knees. Shin pad rests above ankles. Back flat against pad.',
 ARRAY['Extend legs upward until almost straight.', 'Squeeze quads 1s at top.', 'Lower slowly over 2–3s back to 90°.'],
 'Exhale extending legs up. Inhale lowering.',
 ARRAY['Swinging weight up ballisticly', 'Locking knees with impact', 'Lifting buttocks off seat'],
 'Slow tempo: 2s up, 3s down. Reduce weight if kneecap aches.',
 ARRAY['Stop if patellar grinding occurs.'],
 ARRAY['Step-ups', 'Wall sit']),

('ex-calf-raise', 'Calf Raise', 'Bodyweight or machine calf block', 'bodyweight',
 ARRAY['calves', 'soleus'], 'bodyweight', 'Bodyweight first',
 'Stand tall with balls of feet on step edge, light fingertip support for balance.',
 ARRAY['Lower heels below step level for comfortable stretch.', 'Drive through balls of feet and big toes to rise high.', 'Hold top squeeze 1s.', 'Lower slowly over 2s.'],
 'Exhale rising on toes. Inhale lowering heels.',
 ARRAY['Bouncing at bottom', 'Rolling ankles outward', 'Bending knees'],
 'Start flat on floor before progressing to elevated step.',
 ARRAY['Do not bounce on Achilles tendon.'],
 ARRAY['Seated calf machine', 'Single-leg calf raise']),

('ex-glute-bridge', 'Glute Bridge', 'Exercise mat', 'bodyweight',
 ARRAY['glutes', 'hamstrings', 'core'], 'bodyweight', 'Bodyweight',
 'Lie on back, knees bent, feet flat hip-width apart 12 inches from hips.',
 ARRAY['Brace core, lower back flat.', 'Drive through heels to lift hips to straight line.', 'Squeeze glutes 2s without overarching spine.', 'Lower slowly with control.'],
 'Exhale lifting hips. Inhale lowering.',
 ARRAY['Overarching lower back at top', 'Pushing through toes', 'Knees splaying wide'],
 'Place hands on hips to ensure pelvis stays level.',
 ARRAY['Avoid hyperextending lumbar spine.'],
 ARRAY['Bench hip thrust', 'Single leg bridge']),

('ex-dead-bug', 'Dead Bug', 'Exercise mat', 'core',
 ARRAY['deep core', 'transverse abdominis', 'obliques'], 'bodyweight', 'Bodyweight',
 'Lie on back, arms extended to ceiling, knees bent 90° in tabletop. Glue lower back to floor.',
 ARRAY['Brace abs so lower back is pinned.', 'Slowly lower right arm overhead and left leg straight hovering above floor.', 'Ensure lower back does NOT arch.', 'Return to tabletop and alternate sides.'],
 'Exhale as limbs extend. Inhale as limbs return.',
 ARRAY['Lower back lifting off floor', 'Moving too fast without control', 'Holding breath'],
 'Tap heel with bent knee if straight leg causes back to arch.',
 ARRAY['Stop if lower back lifts off mat.'],
 ARRAY['Bird-dog', 'Hollow body hold']),

('ex-plank', 'Plank', 'Exercise mat', 'bodyweight',
 ARRAY['core', 'shoulders', 'glutes'], 'bodyweight', 'Bodyweight (15–20s)',
 'Forearms on mat, elbows under shoulders. Balls of feet on floor, body straight.',
 ARRAY['Brace abs, squeeze glutes, press floor away.', 'Hold rigid straight line for 15–20s.', 'Keep gaze down between hands.'],
 'Steady continuous shallow breathing—never hold breath.',
 ARRAY['Hips sagging to floor', 'Piking hips into air', 'Looking forward straining neck'],
 'Start with knees on mat if 15s standard plank is tough.',
 ARRAY['Stop if lower back aches or sags.'],
 ARRAY['Kneeling plank', 'Incline bench plank']),

('ex-lateral-raise', 'Dumbbell Lateral Raise', 'Light dumbbells', 'strength',
 ARRAY['lateral delts', 'upper traps'], 'per_dumbbell', '3–8 lb per hand',
 'Stand tall, hold light dumbbell in each hand at sides, slight elbow bend.',
 ARRAY['Raise arms out in wide arc to shoulder height.', 'Lead with elbows.', 'Pause 1s at top.', 'Lower slowly over 2–3s.'],
 'Exhale raising dumbbells. Inhale lowering.',
 ARRAY['Swinging body or hips', 'Shrugging neck to lift', 'Raising arms above shoulder level'],
 'Use 3–5 lb dumbbells. The side deltoid is small.',
 ARRAY['Do not raise above shoulder height.'],
 ARRAY['Cable lateral raise', 'Band lateral raise']),

('ex-pallof-press', 'Pallof Press', 'Cable station with D-handle', 'core',
 ARRAY['obliques', 'transverse abdominis', 'anti-rotation'], 'stack_display', '5–15 lb stack',
 'Cable at chest height. Stand perpendicular, hold handle at chest with both hands.',
 ARRAY['Brace core, soften knees.', 'Press handle straight out in front of chest.', 'Resist rotational pull for 2s.', 'Slowly draw hands back to chest.'],
 'Exhale pressing forward. Inhale returning.',
 ARRAY['Rotating torso toward cable', 'Locking knees stiffly', 'Rushing reps'],
 'Stand with wider stance for stability if needed.',
 ARRAY['Maintain strict anti-rotation.'],
 ARRAY['Band anti-rotation hold', 'Suitcase carry']),

('ex-treadmill', 'Treadmill', 'Commercial treadmill', 'cardio',
 ARRAY['cardiovascular', 'quads', 'hamstrings', 'calves'], 'bodyweight', '12–15 min, 0% incline, ~2.0–2.5 mph',
 'Clip safety lanyard to waistband. Straddle belt, start slow, step on carefully.',
 ARRAY['Walk with upright posture, natural arm swing.', 'Follow 8-week progressive plan.', 'Include 3–5 min warm-up and 2–3 min cool-down within total time.'],
 'Smooth conversational breathing.',
 ARRAY['Gripping rails tightly', 'Jumping to 12% incline or sprinting', 'Looking down at phone'],
 'If knees feel sore, reduce speed, flatten incline to 0%, or switch to bike.',
 ARRAY['Always use safety clip.', 'Stop on dizziness or chest pain.'],
 ARRAY['Stationary bike', 'Elliptical', 'Outdoor walk']),

('ex-stationary-bike', 'Stationary Bike', 'Upright or recumbent exercise bike', 'cardio',
 ARRAY['cardiovascular', 'quads', 'calves'], 'bodyweight', '12–15 min, low-to-moderate resistance',
 'Adjust saddle so knee has slight 25° bend at lowest pedal point.',
 ARRAY['Pedal at steady 65–80 RPM cadence.', 'Maintain relaxed shoulders and light grip.', 'Great knee-friendly cardio option.'],
 'Steady rhythmic breathing at conversational pace.',
 ARRAY['Seat too low causing knee torque', 'Pedaling with grinding resistance', 'Hunching shoulders'],
 'Use recumbent bike if lower back or saddle comfort is an issue.',
 ARRAY['Ensure seat is locked tight before riding.'],
 ARRAY['Treadmill walking', 'Rowing machine'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  equipment = EXCLUDED.equipment,
  setup = EXCLUDED.setup,
  how_to_perform = EXCLUDED.how_to_perform,
  breathing = EXCLUDED.breathing,
  common_mistakes = EXCLUDED.common_mistakes,
  beginner_adjustments = EXCLUDED.beginner_adjustments,
  safety_flags = EXCLUDED.safety_flags,
  alternatives = EXCLUDED.alternatives;

-- 2. Insert 4 Workout Templates
INSERT INTO public.workout_templates (id, code, name, day_name, weekday, description, estimated_minutes)
VALUES
('tpl-upper-a', 'UPPER_A', 'Upper Body A', 'Thursday', 4, 'Back, chest press, shoulder press, triceps, and cardio', 45),
('tpl-lower-a', 'LOWER_A', 'Lower Body A + Core', 'Saturday', 6, 'Leg press, leg curls, calves, glute bridges, and dead bug', 50),
('tpl-upper-b', 'UPPER_B', 'Upper Body B', 'Monday', 1, 'Seated row, lat pulldown, chest press, lateral raises, and Pallof press', 45),
('tpl-lower-b', 'LOWER_B', 'Lower Body B + Core', 'Wednesday', 3, 'Leg press, leg extensions, leg curls, glute bridge, and plank', 50)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  day_name = EXCLUDED.day_name,
  weekday = EXCLUDED.weekday,
  description = EXCLUDED.description;

-- 3. Insert Template Exercises
-- UPPER_A
INSERT INTO public.template_exercises (template_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds, notes)
VALUES
('tpl-upper-a', 'ex-lat-pulldown', 1, 2, '12', 75, 'Thigh pad snug, pull to upper chest, no behind-neck pulling'),
('tpl-upper-a', 'ex-cable-row', 2, 2, '12', 75, 'Spine neutral, pull toward lower ribs, do not swing'),
('tpl-upper-a', 'ex-chest-press', 3, 2, '10', 75, 'Handles mid-chest, back supported, conservative chest volume'),
('tpl-upper-a', 'ex-shoulder-press', 4, 2, '10', 75, 'Adjust seat to ear level, comfortable range, do not arch low back'),
('tpl-upper-a', 'ex-tricep-pushdown', 5, 2, '12', 60, 'Elbows pinned to sides, flare rope at bottom, isolate triceps'),
('tpl-upper-a', 'ex-treadmill', 6, 1, '12–15 min', 0, 'Conversational pace, flat walking, easy warm-up and cool-down')
ON CONFLICT (template_id, sort_order) DO NOTHING;

-- LOWER_A
INSERT INTO public.template_exercises (template_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds, notes)
VALUES
('tpl-lower-a', 'ex-leg-press', 1, 2, '12', 90, 'Knees track over toes, hips on pad, never lock knees at top'),
('tpl-lower-a', 'ex-leg-curl', 2, 2, '12', 75, 'Pivot at knee joint, control descent over 3 seconds'),
('tpl-lower-a', 'ex-calf-raise', 3, 2, '15', 60, 'Bodyweight first, pause at top contraction, no bouncing'),
('tpl-lower-a', 'ex-glute-bridge', 4, 2, '12', 60, 'Drive through heels, squeeze glutes 2s, avoid hyperextending low back'),
('tpl-lower-a', 'ex-dead-bug', 5, 2, '8 / side', 60, 'Keep lower back glued to mat, slow controlled limbs'),
('tpl-lower-a', 'ex-treadmill', 6, 1, '12–15 min', 0, 'Post-lifting walking or swap to stationary bike if knees feel tired')
ON CONFLICT (template_id, sort_order) DO NOTHING;

-- UPPER_B
INSERT INTO public.template_exercises (template_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds, notes)
VALUES
('tpl-upper-b', 'ex-cable-row', 1, 2, '12', 75, 'Stable torso, full control, lead with back muscles'),
('tpl-upper-b', 'ex-lat-pulldown', 2, 2, '12', 75, 'Pull to upper chest, full stretch at top without shrugging'),
('tpl-upper-b', 'ex-chest-press', 3, 2, '10', 75, 'Controlled tempo, moderate chest volume, 2–3 reps in reserve'),
('tpl-upper-b', 'ex-lateral-raise', 4, 2, '12', 60, 'Light dumbbells 3–8 lb, lead with elbows to shoulder height'),
('tpl-upper-b', 'ex-pallof-press', 5, 2, '10 / side', 60, 'Chest-height cable, resist rotation, hold extended 2 seconds'),
('tpl-upper-b', 'ex-treadmill', 6, 1, '12–15 min', 0, 'Comfortable steady walk, natural arm swing')
ON CONFLICT (template_id, sort_order) DO NOTHING;

-- LOWER_B
INSERT INTO public.template_exercises (template_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds, notes)
VALUES
('tpl-lower-b', 'ex-leg-press', 1, 2, '12', 90, 'Comfortable depth, 90° knee angle, smooth and controlled'),
('tpl-lower-b', 'ex-leg-extension', 2, 2, '12', 75, 'Pivot aligned with knees, 1s pause at top, no ballistic kicking'),
('tpl-lower-b', 'ex-leg-curl', 3, 2, '12', 75, 'Control the eccentric return, do not let hips lift'),
('tpl-lower-b', 'ex-glute-bridge', 4, 2, '12', 60, 'Squeeze glutes hard at top, keep midsection braced'),
('tpl-lower-b', 'ex-plank', 5, 2, '15–20 sec', 60, 'Elbows under shoulders, straight rigid line, steady breathing'),
('tpl-lower-b', 'ex-treadmill', 6, 1, '12–15 min', 0, 'Post-lifting cardio or stationary bike if knee joints feel sore')
ON CONFLICT (template_id, sort_order) DO NOTHING;
