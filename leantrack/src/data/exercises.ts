// LeanTrack – Complete Exercise Catalog (v1.2)
// Every exercise used in the 4 workout templates, combining machines and free weights.

export type ExerciseCategory = 'Machine' | 'Dumbbell' | 'Cable' | 'Bodyweight' | 'Cardio';

export interface ExerciseData {
  id: string;
  name: string;
  equipment: string;
  category: ExerciseCategory;
  type: 'strength' | 'cardio' | 'core' | 'bodyweight';
  muscleGroups: string[];
  loadMode:
    | 'stack_display'
    | 'per_dumbbell'
    | 'per_side'
    | 'total_added_plates'
    | 'bodyweight';
  setup: string;
  howToPerform: string;
  breathing: string;
  commonMistakes: string[];
  beginnerAdjustments: string;
  safetyFlags: string[];
  alternatives: string[];
  firstTestRange: string;
}

export const exercises: ExerciseData[] = [
  // ──────────────────────────────────────────────
  // 1. Lat Pulldown (Machine)
  // ──────────────────────────────────────────────
  {
    id: 'ex-lat-pulldown',
    name: 'Lat Pulldown (Machine)',
    equipment: 'Cable machine – lat pulldown station',
    category: 'Machine',
    type: 'strength',
    muscleGroups: ['lats', 'biceps', 'rear delts', 'rhomboids'],
    loadMode: 'stack_display',
    setup:
      'Adjust the thigh pad so your knees are snug underneath with feet flat on the floor. Select the pin at the desired weight on the stack. Grip the wide bar slightly wider than shoulder-width with palms facing away from you.',
    howToPerform:
      '1. Sit tall with a slight backward lean (roughly 15-20°) and chest lifted.\n2. Pull the bar down toward the upper chest, leading with your elbows and squeezing your shoulder blades together at the bottom.\n3. Pause briefly when the bar reaches collarbone height.\n4. Slowly return the bar up under control until your arms are fully extended but shoulders stay packed (not shrugging up).\n5. Repeat for the prescribed reps without swinging your torso.',
    breathing:
      'Exhale as you pull the bar down. Inhale as you control the bar back up.',
    commonMistakes: [
      'Leaning too far back and turning it into a row',
      'Pulling the bar behind the neck, which stresses the shoulder joint',
      'Using momentum by swinging the torso',
      'Gripping too narrow, which shifts load away from lats',
    ],
    beginnerAdjustments:
      'Start with the lightest comfortable weight and focus on feeling the lats engage. Use a controlled 2-second pull, 1-second pause, 3-second return tempo.',
    safetyFlags: [
      'Stop if you feel sharp pain in the shoulder joint',
      'Do not pull behind the neck',
    ],
    alternatives: ['Assisted pull-up machine', 'Resistance band pulldown'],
    firstTestRange: '25-45 lb stack',
  },

  // ──────────────────────────────────────────────
  // 2. Seated Cable Row (Machine)
  // ──────────────────────────────────────────────
  {
    id: 'ex-cable-row',
    name: 'Seated Cable Row (Machine)',
    equipment: 'Cable machine – low row station with V-handle or straight bar',
    category: 'Machine',
    type: 'strength',
    muscleGroups: ['mid-back', 'lats', 'biceps', 'rear delts'],
    loadMode: 'stack_display',
    setup:
      'Sit on the bench with feet on the foot plates, knees slightly bent. Select your weight on the stack. Grab the V-handle with both hands and sit upright so the cable is taut at arm\'s length.',
    howToPerform:
      '1. Begin with arms extended and torso upright, chest out.\n2. Pull the handle toward your lower ribcage by driving your elbows straight back.\n3. Squeeze your shoulder blades together at the end of the pull and hold for one count.\n4. Slowly extend your arms back to the start position without letting your back round.\n5. Keep a tall posture throughout—do not rock forward and back.',
    breathing:
      'Exhale as you pull toward your body. Inhale as you extend your arms forward.',
    commonMistakes: [
      'Rocking the torso excessively to generate momentum',
      'Rounding the lower back when reaching forward',
      'Shrugging the shoulders instead of retracting the scapulae',
      'Using arms only without engaging the mid-back',
    ],
    beginnerAdjustments:
      'Use a lighter weight that lets you hold the squeezed position for a full second. Think "chest to handle" rather than "hands to chest."',
    safetyFlags: [
      'Stop if you feel lower-back strain',
      'Avoid jerking the weight',
    ],
    alternatives: ['Chest-supported machine row', 'One-Arm Dumbbell Rows'],
    firstTestRange: '25-45 lb stack',
  },

  // ──────────────────────────────────────────────
  // 3. Chest Press (Machine)
  // ──────────────────────────────────────────────
  {
    id: 'ex-chest-press',
    name: 'Chest Press (Machine)',
    equipment: 'Selectorized chest press machine',
    category: 'Machine',
    type: 'strength',
    muscleGroups: ['chest', 'front delts', 'triceps'],
    loadMode: 'stack_display',
    setup:
      'Adjust the seat height so the handles are level with mid-chest (nipple line). Sit with your back fully against the pad and feet flat on the floor. Select your weight on the stack.',
    howToPerform:
      '1. Grip the handles at chest height with palms facing forward.\n2. Press the handles forward until your arms are nearly straight (keep a slight bend at the elbow—do not lock out).\n3. Pause briefly at full extension and squeeze your chest.\n4. Slowly return the handles until you feel a comfortable stretch across the chest.\n5. Repeat smoothly without bouncing the stack at the bottom.',
    breathing:
      'Exhale as you press outward. Inhale as you bring the handles back.',
    commonMistakes: [
      'Flaring elbows out to 90°—keep them at about 45-60°',
      'Arching the lower back off the pad',
      'Locking the elbows violently at full extension',
      'Seat too high or too low, shifting stress to shoulders',
    ],
    beginnerAdjustments:
      'Start light and confirm the handle path feels natural. Moderate chest work (2x10) preserves lean tissue without aggressive hypertrophy.',
    safetyFlags: [
      'Stop if you feel shoulder impingement or pinching',
      'Ensure the seat is adjusted before loading heavy',
    ],
    alternatives: ['Push-ups on bench', 'Dumbbell flat bench press'],
    firstTestRange: '20-40 lb stack',
  },

  // ──────────────────────────────────────────────
  // 4. Dumbbell Shoulder Press
  // ──────────────────────────────────────────────
  {
    id: 'ex-db-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    equipment: 'Pair of dumbbells, adjustable bench set to 85-90°',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['front delts', 'lateral delts', 'triceps', 'upper traps'],
    loadMode: 'per_dumbbell',
    setup:
      'Set an adjustable bench to nearly upright (85-90°). Sit with your back flat against the pad and feet firmly on the floor. Hold a dumbbell in each hand at shoulder height with palms facing forward or neutral.',
    howToPerform:
      '1. Start with the dumbbells at shoulder level, elbows slightly forward in the scapular plane.\n2. Press both dumbbells upward in a slight arc until arms are nearly straight.\n3. Pause at the top and squeeze your shoulders.\n4. Lower the dumbbells slowly back to ear height over 2-3 seconds.\n5. Note: Logged weight is PER DUMBBELL (e.g. 15 lb means a 15 lb dumbbell in each hand).',
    breathing:
      'Exhale as you press the dumbbells overhead. Inhale as you lower them back to shoulder level.',
    commonMistakes: [
      'Arching the lower back excessively to push more weight',
      'Flaring elbows too far back behind the body',
      'Using momentum to bounce dumbbells off shoulders',
      'Pressing unevenly with one arm leading the other',
    ],
    beginnerAdjustments:
      'Start with 8-15 lb per dumbbell. Neutral grip (palms facing each other) is especially comfortable for shoulders.',
    safetyFlags: [
      'Stop if you feel pinching at the top of the shoulder',
      'Keep back firmly against the pad',
    ],
    alternatives: ['Machine shoulder press', 'Resistance band overhead press'],
    firstTestRange: '8-15 lb per dumbbell',
  },

  // ──────────────────────────────────────────────
  // 5. Dumbbell Lateral Raises
  // ──────────────────────────────────────────────
  {
    id: 'ex-lateral-raise',
    name: 'Dumbbell Lateral Raises',
    equipment: 'Pair of light dumbbells',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['lateral delts', 'upper traps'],
    loadMode: 'per_dumbbell',
    setup:
      'Stand upright with feet hip-width apart, holding a light dumbbell in each hand at your sides with palms facing in. Keep a slight bend in your elbows and shoulders relaxed down.',
    howToPerform:
      '1. Raise both dumbbells out to your sides in a wide arc until arms reach roughly shoulder height.\n2. Lead with your elbows, keeping palms facing down at the top.\n3. Pause for a one-count at the top.\n4. Slowly lower the dumbbells back to sides over 2-3 seconds.\n5. Note: Logged weight is PER DUMBBELL (e.g. 5 lb means 5 lb in each hand).',
    breathing:
      'Exhale as you raise the dumbbells. Inhale as you lower them.',
    commonMistakes: [
      'Using too much weight and swinging the torso',
      'Shrugging traps instead of using the side delts',
      'Raising arms higher than shoulder level',
      'Keeping elbows locked completely straight',
    ],
    beginnerAdjustments:
      'Start with 3-8 lb per dumbbell. Strict form with light weights isolates the side delts without neck strain.',
    safetyFlags: [
      'Do not raise above shoulder height',
      'Stop on any sharp pinching sensation in rotator cuff',
    ],
    alternatives: ['Cable lateral raise', 'Resistance band lateral raise'],
    firstTestRange: '3-8 lb per dumbbell',
  },

  // ──────────────────────────────────────────────
  // 6. Rope Triceps Pushdown (Cable)
  // ──────────────────────────────────────────────
  {
    id: 'ex-tricep-pushdown',
    name: 'Rope Triceps Pushdown (Cable)',
    equipment: 'Cable machine – high pulley with rope attachment',
    category: 'Cable',
    type: 'strength',
    muscleGroups: ['triceps'],
    loadMode: 'stack_display',
    setup:
      'Attach the rope handle to the high pulley. Select your weight on the stack. Stand facing the machine with feet shoulder-width apart, slight hip hinge, elbows pinned at sides.',
    howToPerform:
      '1. Grab each end of the rope with a neutral grip.\n2. Keeping your upper arms locked at your sides, push the rope downward by straightening elbows.\n3. At the bottom, flare the rope ends apart and squeeze triceps hard for one count.\n4. Slowly return until forearms are at 90°.\n5. Keep upper arms completely stationary throughout.',
    breathing:
      'Exhale as you push down. Inhale as you control the rope back up.',
    commonMistakes: [
      'Flaring elbows forward and swinging',
      'Leaning body weight over the cable',
      'Letting the rope rise too high, losing tension',
      'Rushing the return phase',
    ],
    beginnerAdjustments:
      'Start at 10-15 lb. Think "elbows glued to ribs" for pure triceps isolation.',
    safetyFlags: [
      'Stop if you feel elbow tendon strain',
    ],
    alternatives: ['Straight bar pushdown', 'Bench dips'],
    firstTestRange: '10-20 lb stack',
  },

  // ──────────────────────────────────────────────
  // 7. Dumbbell Biceps Curls
  // ──────────────────────────────────────────────
  {
    id: 'ex-db-bicep-curl',
    name: 'Dumbbell Biceps Curls',
    equipment: 'Pair of dumbbells',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['biceps', 'brachialis', 'forearms'],
    loadMode: 'per_dumbbell',
    setup:
      'Stand upright with feet hip-width apart or sit tall on bench. Hold a dumbbell in each hand at sides, palms facing forward or neutral.',
    howToPerform:
      '1. Keep your elbows pinned closely against your ribs.\n2. Curl the dumbbells upward by contracting your biceps, rotating palms up as you lift (supination).\n3. Squeeze your biceps hard at the top near shoulder height for 1 count.\n4. Lower the dumbbells slowly under full 2-3s control back to complete arm extension.\n5. Note: Logged weight is PER DUMBBELL.',
    breathing:
      'Exhale as you curl the dumbbells upward. Inhale as you lower them down.',
    commonMistakes: [
      'Swinging hips or leaning back to heave the weights up',
      'Allowing elbows to drift forward in front of ribs',
      'Dropping the weights quickly without eccentric control',
      'Curling wrists aggressively inward',
    ],
    beginnerAdjustments:
      'Start with 10-15 lb per dumbbell. Keep shoulders relaxed down and away from ears.',
    safetyFlags: [
      'Do not hyperextend elbows under load',
      'Avoid swinging lower back',
    ],
    alternatives: ['Hammer curls', 'Cable bicep curl', 'EZ-bar curl'],
    firstTestRange: '10-15 lb per dumbbell',
  },

  // ──────────────────────────────────────────────
  // 8. Leg Press (Machine)
  // ──────────────────────────────────────────────
  {
    id: 'ex-leg-press',
    name: 'Leg Press (Machine)',
    equipment: 'Selectorized or 45° sled leg press machine',
    category: 'Machine',
    type: 'strength',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    loadMode: 'stack_display',
    setup:
      'Adjust the back rest so your knees form about a 90° angle when the footplate is seated. Place feet hip-width apart in middle of platform, toes angled slightly out.',
    howToPerform:
      '1. Sit firmly with back and hips glued against pad.\n2. Press platform away until legs are almost straight (never lock knees straight).\n3. Pause briefly at top.\n4. Slowly lower platform until thighs reach 90°.\n5. Drive through midfoot and heels back to start position.',
    breathing:
      'Inhale as platform lowers. Exhale forcefully as you press away.',
    commonMistakes: [
      'Locking knees straight at full extension',
      'Letting hips curl off the seat at the bottom',
      'Pushing solely through toes and lifting heels',
      'Forcing excessive depth that strains knee joints',
    ],
    beginnerAdjustments:
      'Selectorized: start with 40-80 lb stack. 45° plate-loaded sled: start with EMPTY sled (0 added plates).',
    safetyFlags: [
      'NEVER lock knees at the top',
      'Stop if you feel kneecap pain or clicking',
      'Keep lower back supported at all times',
    ],
    alternatives: ['Goblet Squats (Dumbbell)', 'Bodyweight squat to bench'],
    firstTestRange: '40-80 lb stack / 0 added plates on sled',
  },

  // ──────────────────────────────────────────────
  // 9. Seated Leg Curl (Machine)
  // ──────────────────────────────────────────────
  {
    id: 'ex-leg-curl',
    name: 'Seated Leg Curl (Machine)',
    equipment: 'Selectorized seated leg curl machine',
    category: 'Machine',
    type: 'strength',
    muscleGroups: ['hamstrings'],
    loadMode: 'stack_display',
    setup:
      'Align machine pivot with your knee joint. Lower pad rests just above Achilles tendon. Lock upper thigh pad down snugly.',
    howToPerform:
      '1. Start with legs extended in front, grip side handles.\n2. Curl heels back and down under seat by bending knees.\n3. Squeeze hamstrings hard at bottom for 1 count.\n4. Slowly straighten legs back over 3 seconds under full control.\n5. Maintain continuous tension without letting stack crash.',
    breathing:
      'Exhale as you curl the weight down. Inhale as you extend back.',
    commonMistakes: [
      'Using momentum to kick weight down',
      'Lifting hips off the seat during the curl',
      'Thigh pad too loose allowing knees to shift',
    ],
    beginnerAdjustments:
      'Start at 15-25 lb. Focus on slow, controlled squeeze behind thighs.',
    safetyFlags: [
      'Stop if you feel sharp pull behind the knee',
      'Keep hips planted firmly on pad',
    ],
    alternatives: ['Lying leg curl', 'Dumbbell Romanian Deadlifts'],
    firstTestRange: '15-35 lb stack',
  },

  // ──────────────────────────────────────────────
  // 10. Goblet Squats (Dumbbell)
  // ──────────────────────────────────────────────
  {
    id: 'ex-goblet-squat',
    name: 'Goblet Squats (Dumbbell)',
    equipment: 'Single dumbbell, optional bench for depth check',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['quads', 'glutes', 'core', 'upper back'],
    loadMode: 'per_dumbbell',
    setup:
      'Stand with feet shoulder-width apart, toes turned out 15-20°. Hold one dumbbell vertically against your chest with both hands cupping the top bell.',
    howToPerform:
      '1. Inhale and brace your core.\n2. Push hips back and bend knees to squat down until thighs are roughly parallel to floor.\n3. Keep chest proud and elbows inside knees.\n4. Drive through full foot to stand back up, squeezing glutes at top.\n5. Note: Weight is the single dumbbell held at chest.',
    breathing:
      'Inhale on the way down, exhale as you stand up.',
    commonMistakes: [
      'Collapsing chest forward and rounding back',
      'Knees caving inward',
      'Lifting heels off the floor',
    ],
    beginnerAdjustments:
      'Start with a 10-15 lb dumbbell. Squat to a bench behind you to gauge safe depth.',
    safetyFlags: [
      'Maintain neutral spine throughout',
      'Stop if knee joint discomfort occurs',
    ],
    alternatives: ['Leg Press (Machine)', 'Bodyweight box squat'],
    firstTestRange: '10-20 lb dumbbell',
  },

  // ──────────────────────────────────────────────
  // 11. Dumbbell Romanian Deadlifts
  // ──────────────────────────────────────────────
  {
    id: 'ex-romanian-deadlift',
    name: 'Dumbbell Romanian Deadlifts',
    equipment: 'Pair of dumbbells',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['hamstrings', 'glutes', 'erector spinae'],
    loadMode: 'per_dumbbell',
    setup:
      'Stand tall, feet hip-width apart. Hold a dumbbell in each hand in front of your thighs, palms facing you, knees slightly soft (not locked).',
    howToPerform:
      '1. Push your hips straight back as if touching a wall behind you.\n2. Slide dumbbells down along the front of your thighs and shins until you feel a deep hamstring stretch (around mid-shin).\n3. Keep back flat as a tabletop and neck neutral.\n4. Drive hips forward to stand tall, squeezing glutes at top.\n5. Note: Logged weight is PER DUMBBELL.',
    breathing:
      'Inhale as hips hinge back, exhale as you drive hips forward to standing.',
    commonMistakes: [
      'Rounding lower back into flexion',
      'Squatting down instead of hinging hips back',
      'Letting dumbbells drift far away from legs',
    ],
    beginnerAdjustments:
      'Start with 10-15 lb per dumbbell. Only hinge as far as hamstrings permit without rounding back.',
    safetyFlags: [
      'Stop immediately if lower back rounds or aches',
      'Keep core rigid and dumbbells close to shins',
    ],
    alternatives: ['Seated Leg Curl (Machine)', 'Glute Bridge'],
    firstTestRange: '10-20 lb per dumbbell',
  },

  // ──────────────────────────────────────────────
  // 12. Standing Calf Raises
  // ──────────────────────────────────────────────
  {
    id: 'ex-calf-raise',
    name: 'Standing Calf Raises',
    equipment: 'Calf block, step edge, or flat floor with support',
    category: 'Bodyweight',
    type: 'bodyweight',
    muscleGroups: ['calves', 'soleus'],
    loadMode: 'bodyweight',
    setup:
      'Stand tall with balls of feet on step edge or floor, holding a wall or railing for balance.',
    howToPerform:
      '1. Lower heels below step level for a comfortable calf stretch.\n2. Press through balls of feet and big toes to rise as high as possible.\n3. Hold top contraction for 1 count.\n4. Lower slowly over 2 seconds into the stretch.\n5. Avoid bouncing at the bottom.',
    breathing:
      'Exhale rising onto toes, inhale lowering heels.',
    commonMistakes: [
      'Bouncing on Achilles tendon using rebound',
      'Rolling ankles outward over pinky toes',
      'Bending knees to assist',
    ],
    beginnerAdjustments:
      'Start on flat floor with bodyweight. Add a light dumbbell in one hand later once balance is effortless.',
    safetyFlags: [
      'Use hand support for balance',
      'Avoid ballistic bouncing',
    ],
    alternatives: ['Seated calf raise machine', 'Single-leg calf raise'],
    firstTestRange: 'Bodyweight first',
  },

  // ──────────────────────────────────────────────
  // 13. Dead Bugs
  // ──────────────────────────────────────────────
  {
    id: 'ex-dead-bug',
    name: 'Dead Bugs',
    equipment: 'Exercise mat',
    category: 'Bodyweight',
    type: 'core',
    muscleGroups: ['deep core', 'transverse abdominis', 'obliques'],
    loadMode: 'bodyweight',
    setup:
      'Lie face-up on mat. Extend arms toward ceiling, bend knees 90° into tabletop directly over hips. Glue lower back firmly to mat.',
    howToPerform:
      '1. Brace abdominal wall so lower back is pinned flat.\n2. Slowly lower right arm overhead while extending left leg straight hovering above floor.\n3. Ensure lower back NEVER arches off the mat.\n4. Return to center and repeat with left arm and right leg.\n5. Target: 8 reps per side (16 total reps).',
    breathing:
      'Exhale as limbs extend outward, inhale returning to center.',
    commonMistakes: [
      'Allowing lower back to arch off the floor',
      'Moving too fast without core tension',
      'Holding breath',
    ],
    beginnerAdjustments:
      'Tap heel with a bent knee if straightening the leg causes your lower back to lift.',
    safetyFlags: [
      'Stop if lower back lifts off mat',
    ],
    alternatives: ['Bird-dog', 'Plank'],
    firstTestRange: 'Bodyweight (8 per side)',
  },

  // ──────────────────────────────────────────────
  // 14. One-Arm Dumbbell Rows
  // ──────────────────────────────────────────────
  {
    id: 'ex-one-arm-db-row',
    name: 'One-Arm Dumbbell Rows',
    equipment: 'Flat bench and single dumbbell',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['lats', 'rhomboids', 'biceps', 'rear delts'],
    loadMode: 'per_dumbbell',
    setup:
      'Place your left knee and left hand firmly on a flat bench. Keep your back flat and parallel to floor. Hold dumbbell in right hand with arm extended.',
    howToPerform:
      '1. Keep torso square and core braced.\n2. Pull dumbbell up toward your hip pocket, driving your elbow toward ceiling.\n3. Squeeze your lat and middle back at the top for 1 count.\n4. Lower dumbbell smoothly back down to full stretch over 2 seconds.\n5. Complete 12 reps, then switch to left arm.\n6. Note: Logged weight is PER DUMBBELL.',
    breathing:
      'Exhale as you row up to your hip, inhale on the controlled descent.',
    commonMistakes: [
      'Twisting torso and rotating chest open to heave weight up',
      'Pulling dumbbell to shoulder instead of hip pocket',
      'Rounding lower spine',
    ],
    beginnerAdjustments:
      'Start with 15-25 lb per dumbbell. Keep supporting hand under shoulder for maximum spinal support.',
    safetyFlags: [
      'Maintain flat back; do not jerk the dumbbell',
    ],
    alternatives: ['Seated Cable Row (Machine)', 'Chest-supported dumbbell row'],
    firstTestRange: '15-25 lb per dumbbell',
  },

  // ──────────────────────────────────────────────
  // 15. Dumbbell Rear-Delt Fly
  // ──────────────────────────────────────────────
  {
    id: 'ex-db-rear-delt-fly',
    name: 'Dumbbell Rear-Delt Fly',
    equipment: 'Pair of light dumbbells, flat bench',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['rear delts', 'rhomboids', 'upper back'],
    loadMode: 'per_dumbbell',
    setup:
      'Sit on edge of a bench and hinge forward until your chest rests near your thighs, or stand in a 45° bent-over hip hinge. Hold light dumbbells below knees with palms facing inward.',
    howToPerform:
      '1. Keep a soft, fixed bend in your elbows.\n2. Raise dumbbells out to the sides in a wide arc until arms are parallel to floor.\n3. Squeeze the back of your shoulders (posterior delts) at the top for 1 count.\n4. Lower dumbbells under 2-second control.\n5. Note: Logged weight is PER DUMBBELL (e.g. 5 lb means 5 lb in each hand).',
    breathing:
      'Exhale as you raise dumbbells outward. Inhale as you lower them.',
    commonMistakes: [
      'Using heavy dumbbells and violently swinging hips',
      'Shrugging traps instead of using rear delts',
      'Leading with wrists rather than elbows',
    ],
    beginnerAdjustments:
      'Start with 5-10 lb per dumbbell. The rear deltoid is small; strict form with light load is essential.',
    safetyFlags: [
      'Maintain neutral neck; keep lower back braced',
    ],
    alternatives: ['Face pulls on cable', 'Reverse pec deck machine'],
    firstTestRange: '5-10 lb per dumbbell',
  },

  // ──────────────────────────────────────────────
  // 16. Dumbbell Hammer Curls
  // ──────────────────────────────────────────────
  {
    id: 'ex-db-hammer-curl',
    name: 'Dumbbell Hammer Curls',
    equipment: 'Pair of dumbbells',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['brachialis', 'biceps', 'forearms'],
    loadMode: 'per_dumbbell',
    setup:
      'Stand upright with feet hip-width apart or sit tall on bench. Hold dumbbells at sides with palms facing inward (neutral grip) throughout.',
    howToPerform:
      '1. Keep upper arms glued to your ribs.\n2. Curl dumbbells upward with palms facing each other the whole time.\n3. Lift until dumbbells reach shoulder level and squeeze forearms/biceps.\n4. Lower under control over 2-3 seconds back to arms-length.\n5. Note: Logged weight is PER DUMBBELL.',
    breathing:
      'Exhale curling dumbbells up, inhale lowering down.',
    commonMistakes: [
      'Elbows drifting forward during the curl',
      'Swinging hips or leaning back',
      'Flaring elbows out to sides',
    ],
    beginnerAdjustments:
      'Neutral hammer grip is very comfortable on wrists and elbows. Start with 10-15 lb per dumbbell.',
    safetyFlags: [
      'Do not lean back to complete repetitions',
    ],
    alternatives: ['Dumbbell Biceps Curls', 'Cable rope hammer curl'],
    firstTestRange: '10-15 lb per dumbbell',
  },

  // ──────────────────────────────────────────────
  // 17. Pallof Press (Cable)
  // ──────────────────────────────────────────────
  {
    id: 'ex-pallof-press',
    name: 'Pallof Press (Cable)',
    equipment: 'Cable machine – chest height with D-handle',
    category: 'Cable',
    type: 'core',
    muscleGroups: ['obliques', 'transverse abdominis', 'anti-rotation'],
    loadMode: 'stack_display',
    setup:
      'Set cable to chest height. Stand perpendicular to machine with feet shoulder-width apart. Hold handle at center of chest with both hands. Step out to create cable tension.',
    howToPerform:
      '1. Brace core and soften knees.\n2. Press handle straight out in front of chest until arms are fully extended.\n3. Resist the rotational pull—keep torso and hips square.\n4. Hold extended position for 2 seconds.\n5. Draw hands slowly back to chest. Complete 10 reps, then switch sides.',
    breathing:
      'Exhale pressing forward, inhale returning to chest.',
    commonMistakes: [
      'Allowing torso or hips to twist toward machine',
      'Locking knees stiffly',
      'Rushing repetitions without holding',
    ],
    beginnerAdjustments:
      'Start at 5-10 lb. The goal is anti-rotation stability, not heavy pressing.',
    safetyFlags: [
      'Stop if lower back twists or pinches',
    ],
    alternatives: ['Band anti-rotation press', 'Plank'],
    firstTestRange: '5-15 lb stack',
  },

  // ──────────────────────────────────────────────
  // 18. Leg Extension (Machine)
  // ──────────────────────────────────────────────
  {
    id: 'ex-leg-extension',
    name: 'Leg Extension (Machine)',
    equipment: 'Selectorized leg extension machine',
    category: 'Machine',
    type: 'strength',
    muscleGroups: ['quads'],
    loadMode: 'stack_display',
    setup:
      'Align machine pivot directly with knee joints. Shin pad sits comfortably above ankles. Back pad supports lower spine.',
    howToPerform:
      '1. Extend legs upward until almost straight.\n2. Squeeze quads for 1 count at top.\n3. Lower slowly over 2-3 seconds back to start.\n4. Maintain steady tempo without kicking or dropping weight.',
    breathing:
      'Exhale extending legs up, inhale lowering down.',
    commonMistakes: [
      'Kicking weight up with ballistic momentum',
      'Violently slamming knees into full lockout',
      'Lifting buttocks off seat',
    ],
    beginnerAdjustments:
      'Start at 15-25 lb. Slow 2s up, 3s down protects patellar tendon.',
    safetyFlags: [
      'Stop if patellar grinding or sharp kneecap pain occurs',
    ],
    alternatives: ['Goblet Squats (Dumbbell)', 'Dumbbell Step-Ups'],
    firstTestRange: '15-35 lb stack',
  },

  // ──────────────────────────────────────────────
  // 19. Dumbbell Step-Ups
  // ──────────────────────────────────────────────
  {
    id: 'ex-step-ups',
    name: 'Dumbbell Step-Ups',
    equipment: 'Low bench or 8-12 inch box, optional light dumbbells',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['quads', 'glutes', 'balance'],
    loadMode: 'per_dumbbell',
    setup:
      'Stand facing an 8-12 inch sturdy bench or aerobic step. Hold light dumbbells at sides (or start with bodyweight).',
    howToPerform:
      '1. Place full right foot firmly on top of step.\n2. Drive through right heel to step up, standing tall on top.\n3. Lower left foot back to floor with slow 2-second control.\n4. Complete 8 reps on right leg, then 8 reps on left leg.\n5. Note: Logged weight is PER DUMBBELL (0 for bodyweight).',
    breathing:
      'Exhale as you step up, inhale as you step down.',
    commonMistakes: [
      'Pushing off back foot instead of using lead leg',
      'Using a box that is too high, stressing knees',
      'Leaning torso excessively forward',
    ],
    beginnerAdjustments:
      'Start with bodyweight only on a lower 8-inch step. Add 5-10 lb dumbbells only when balance is steady.',
    safetyFlags: [
      'Ensure bench is completely non-slip and stable',
      'Stop if knee joint discomfort occurs',
    ],
    alternatives: ['Leg Press (Machine)', 'Bodyweight lunges'],
    firstTestRange: 'Bodyweight first / 5-10 lb per dumbbell',
  },

  // ──────────────────────────────────────────────
  // 20. Dumbbell Glute Bridges
  // ──────────────────────────────────────────────
  {
    id: 'ex-db-glute-bridge',
    name: 'Dumbbell Glute Bridges',
    equipment: 'Exercise mat and single dumbbell',
    category: 'Dumbbell',
    type: 'strength',
    muscleGroups: ['glutes', 'hamstrings', 'core'],
    loadMode: 'per_dumbbell',
    setup:
      'Lie face-up on mat with knees bent, feet flat on floor hip-width apart. Rest a dumbbell horizontally across hips, holding it securely with both hands.',
    howToPerform:
      '1. Brace core so lower back touches mat.\n2. Drive through heels to lift hips until knees, hips, and shoulders form a straight line.\n3. Squeeze glutes hard at top for 2 full seconds against dumbbell.\n4. Lower hips slowly until glutes lightly brush mat.\n5. Note: Logged weight is the dumbbell resting across hips.',
    breathing:
      'Exhale driving hips up, inhale lowering down.',
    commonMistakes: [
      'Overarching lower back at top instead of squeezing glutes',
      'Pushing through toes instead of heels',
      'Letting dumbbell slide',
    ],
    beginnerAdjustments:
      'Start with 10-20 lb dumbbell on hips (or bodyweight if needed). Place a small towel under dumbbell for hip cushioning.',
    safetyFlags: [
      'Hold dumbbell securely with both hands at all times',
      'Do not hyperextend lumbar spine',
    ],
    alternatives: ['Bodyweight glute bridge', 'Barbell hip thrust'],
    firstTestRange: '10-25 lb dumbbell on hips',
  },

  // ──────────────────────────────────────────────
  // 21. Plank
  // ──────────────────────────────────────────────
  {
    id: 'ex-plank',
    name: 'Plank',
    equipment: 'Exercise mat',
    category: 'Bodyweight',
    type: 'core',
    muscleGroups: ['core', 'abs', 'shoulders', 'glutes'],
    loadMode: 'bodyweight',
    setup:
      'Place forearms on mat with elbows under shoulders. Extend legs back on balls of feet. Body forms a rigid straight line.',
    howToPerform:
      '1. Brace abdominal wall, squeeze glutes, press floor away with forearms.\n2. Keep head neutral by looking at floor between hands.\n3. Hold rigid position for 20 seconds.\n4. Take shallow, steady breaths—never hold your breath.\n5. Note: Time-based set (20 seconds).',
    breathing:
      'Breathe steadily throughout the hold. Do not hold breath.',
    commonMistakes: [
      'Hips sagging toward floor, compressing lumbar spine',
      'Piking hips into the air',
      'Looking up and straining neck',
    ],
    beginnerAdjustments:
      'Drop knees to mat if maintaining a straight back on toes is difficult past 10 seconds.',
    safetyFlags: [
      'Stop if lower back begins sagging or aching',
    ],
    alternatives: ['Kneeling plank', 'Dead Bugs'],
    firstTestRange: 'Bodyweight (20 seconds)',
  },

  // ──────────────────────────────────────────────
  // 22. Treadmill Walking
  // ──────────────────────────────────────────────
  {
    id: 'ex-treadmill',
    name: 'Treadmill Walking',
    equipment: 'Treadmill',
    category: 'Cardio',
    type: 'cardio',
    muscleGroups: ['cardiovascular', 'quads', 'hamstrings', 'calves'],
    loadMode: 'bodyweight',
    setup:
      'Clip safety lanyard to waistband. Straddle belt, select Quick Start, then step on belt once moving slowly.',
    howToPerform:
      '1. Walk with upright posture and natural arm swing.\n2. Target: 15-minute cardio block post-lifting.\n3. Follow the 8-week speed/incline progression.\n4. Include 2-3 min easy warmup and cool-down within the 15 minutes.',
    breathing:
      'Conversational talk-test breathing.',
    commonMistakes: [
      'Holding tightly to side handrails',
      'Jumping to steep 12% incline or sprinting',
      'Looking down at feet',
    ],
    beginnerAdjustments:
      'If knees or feet feel tired, keep incline at 0% or swap to stationary bike.',
    safetyFlags: [
      'Always clip safety lanyard',
      'Stop on joint pain or dizziness',
    ],
    alternatives: ['Stationary Bike', 'Elliptical'],
    firstTestRange: '15 min, 0-2% incline, ~2.0-2.5 mph',
  },

  // ──────────────────────────────────────────────
  // 23. Stationary Bike
  // ──────────────────────────────────────────────
  {
    id: 'ex-stationary-bike',
    name: 'Stationary Bike',
    equipment: 'Upright or recumbent exercise bike',
    category: 'Cardio',
    type: 'cardio',
    muscleGroups: ['cardiovascular', 'quads', 'calves'],
    loadMode: 'bodyweight',
    setup:
      'Adjust seat height so knee has a slight 25° bend at lowest pedal position. Feet snug in pedal straps.',
    howToPerform:
      '1. Warm up with easy pedaling for 2 minutes.\n2. Maintain steady cadence of 65-80 RPM at moderate resistance.\n3. Great knee-friendly alternative to treadmill walking.\n4. Complete 15 minutes total.',
    breathing:
      'Conversational pace.',
    commonMistakes: [
      'Seat too low causing knee strain',
      'Grinding with heavy resistance at slow cadence',
      'Hunching neck and shoulders',
    ],
    beginnerAdjustments:
      'Use recumbent bike for extra back support and minimal knee impact.',
    safetyFlags: [
      'Lock seat securely before riding',
    ],
    alternatives: ['Treadmill Walking', 'Rowing machine'],
    firstTestRange: '15 min, low-to-moderate resistance',
  },
];

export default exercises;
