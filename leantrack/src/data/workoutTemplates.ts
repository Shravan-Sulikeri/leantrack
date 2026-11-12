import { exercises, ExerciseData } from './exercises';

export interface TemplateExerciseItem {
  exerciseId: string;
  order: number;
  targetSets: number;
  targetReps: string; // e.g., "12", "10", "8 / side", "8 / leg", "20 sec"
  targetRepsNum?: number;
  restSeconds: number;
  notes?: string;
  exercise?: ExerciseData;
}

export interface WorkoutTemplateDefinition {
  id: string;
  code: 'UPPER_A' | 'LOWER_A' | 'UPPER_B' | 'LOWER_B';
  name: string;
  dayName: string;
  weekday: number; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  description: string;
  focus: string;
  estimatedMinutes: number; // 75
  strengthMinutes: number;  // 60
  cardioMinutes: number;    // 15
  cardioDescription: string;
  exercises: TemplateExerciseItem[];
}

export const WORKOUT_TEMPLATES: Record<string, WorkoutTemplateDefinition> = {
  UPPER_A: {
    id: 'tpl-upper-a',
    code: 'UPPER_A',
    name: 'Upper Body A',
    dayName: 'Thursday',
    weekday: 4,
    focus: 'Back, shoulders, arms, and moderate chest development',
    description: 'Back, shoulders, arms, and moderate chest development (60 min strength + 15 min cardio)',
    estimatedMinutes: 75,
    strengthMinutes: 60,
    cardioMinutes: 15,
    cardioDescription: '15-minute treadmill walk',
    exercises: [
      {
        exerciseId: 'ex-lat-pulldown',
        order: 1,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 75,
        notes: 'Thigh pad snug, pull to upper chest, no behind-neck pulling',
      },
      {
        exerciseId: 'ex-cable-row',
        order: 2,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 75,
        notes: 'Spine neutral, pull toward lower ribs, do not swing',
      },
      {
        exerciseId: 'ex-chest-press',
        order: 3,
        targetSets: 2,
        targetReps: '10',
        targetRepsNum: 10,
        restSeconds: 75,
        notes: 'Handles mid-chest, back supported, conservative chest volume',
      },
      {
        exerciseId: 'ex-db-shoulder-press',
        order: 4,
        targetSets: 2,
        targetReps: '10',
        targetRepsNum: 10,
        restSeconds: 75,
        notes: 'Logged weight is per dumbbell. Neutral to slight 45° angle, press smoothly without arching low back.',
      },
      {
        exerciseId: 'ex-lateral-raise',
        order: 5,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 60,
        notes: 'Logged weight is per dumbbell. Lead with elbows to parallel, slight forward lean.',
      },
      {
        exerciseId: 'ex-tricep-pushdown',
        order: 6,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 60,
        notes: 'Elbows pinned to sides, flare rope slightly at full lockout.',
      },
      {
        exerciseId: 'ex-db-bicep-curl',
        order: 7,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 60,
        notes: 'Logged weight is per dumbbell. Stand tall, curl with palms up, slow eccentric lowering.',
      },
      {
        exerciseId: 'ex-treadmill',
        order: 8,
        targetSets: 1,
        targetReps: '15 min',
        restSeconds: 0,
        notes: '15-minute treadmill walk. Conversational pace, flat or gentle incline.',
      },
    ],
  },

  LOWER_A: {
    id: 'tpl-lower-a',
    code: 'LOWER_A',
    name: 'Lower Body A',
    dayName: 'Saturday',
    weekday: 6,
    focus: 'Legs, thighs, glutes, hamstrings, and core',
    description: 'Legs, thighs, glutes, hamstrings, and core (60 min strength + 15 min cardio)',
    estimatedMinutes: 75,
    strengthMinutes: 60,
    cardioMinutes: 15,
    cardioDescription: '15-minute treadmill walk or stationary bike',
    exercises: [
      {
        exerciseId: 'ex-leg-press',
        order: 1,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 90,
        notes: 'Knees track over toes, hips stay glued to pad, never hyperextend or lock knees at top.',
      },
      {
        exerciseId: 'ex-leg-curl',
        order: 2,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 75,
        notes: 'Pivot aligned with knees, curl smoothly, control the return over 2–3 seconds.',
      },
      {
        exerciseId: 'ex-goblet-squat',
        order: 3,
        targetSets: 2,
        targetReps: '10',
        targetRepsNum: 10,
        restSeconds: 75,
        notes: 'Hold single dumbbell vertically against sternum, squat to comfortable depth keeping chest tall.',
      },
      {
        exerciseId: 'ex-romanian-deadlift',
        order: 4,
        targetSets: 2,
        targetReps: '10',
        targetRepsNum: 10,
        restSeconds: 75,
        notes: 'Logged weight is per dumbbell. Hinge at hips with soft knees, feel stretch in hamstrings.',
      },
      {
        exerciseId: 'ex-calf-raise',
        order: 5,
        targetSets: 2,
        targetReps: '15',
        targetRepsNum: 15,
        restSeconds: 60,
        notes: 'Elevate on ball of feet, 1s pause at peak contraction, controlled lowering.',
      },
      {
        exerciseId: 'ex-dead-bug',
        order: 6,
        targetSets: 2,
        targetReps: '8 / side',
        targetRepsNum: 8,
        restSeconds: 60,
        notes: 'Keep lower back pressed flat into mat. Extend opposite arm and leg slowly.',
      },
      {
        exerciseId: 'ex-treadmill',
        order: 7,
        targetSets: 1,
        targetReps: '15 min',
        restSeconds: 0,
        notes: '15-minute treadmill walk or stationary bike if knee joints feel fatigued.',
      },
    ],
  },

  UPPER_B: {
    id: 'tpl-upper-b',
    code: 'UPPER_B',
    name: 'Upper Body B',
    dayName: 'Monday',
    weekday: 1,
    focus: 'Back definition, shoulders, arms, and maintaining chest strength',
    description: 'Back definition, shoulders, arms, and maintaining chest strength (60 min strength + 15 min cardio)',
    estimatedMinutes: 75,
    strengthMinutes: 60,
    cardioMinutes: 15,
    cardioDescription: '15-minute treadmill walk',
    exercises: [
      {
        exerciseId: 'ex-lat-pulldown',
        order: 1,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 75,
        notes: 'Overhand grip, pull smoothly to collarbone, avoid leaning excessively backward.',
      },
      {
        exerciseId: 'ex-chest-press',
        order: 2,
        targetSets: 2,
        targetReps: '10',
        targetRepsNum: 10,
        restSeconds: 75,
        notes: 'Mid-chest handle alignment, controlled 3-second lowering, moderate chest volume.',
      },
      {
        exerciseId: 'ex-one-arm-db-row',
        order: 3,
        targetSets: 2,
        targetReps: '12 / side',
        targetRepsNum: 12,
        restSeconds: 75,
        notes: 'Logged weight is per dumbbell. Support knee and hand on flat bench, pull elbow toward hip pocket.',
      },
      {
        exerciseId: 'ex-db-rear-delt-fly',
        order: 4,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 60,
        notes: 'Logged weight is per dumbbell. Hinge forward 45°, raise dumbbells out laterally squeezing back of shoulders.',
      },
      {
        exerciseId: 'ex-tricep-pushdown',
        order: 5,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 60,
        notes: 'Keep elbows tucked tightly at sides, push rope down and separate handles.',
      },
      {
        exerciseId: 'ex-db-hammer-curl',
        order: 6,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 60,
        notes: 'Logged weight is per dumbbell. Palms facing each other throughout the curl, targets brachialis and forearms.',
      },
      {
        exerciseId: 'ex-pallof-press',
        order: 7,
        targetSets: 2,
        targetReps: '10 / side',
        targetRepsNum: 10,
        restSeconds: 60,
        notes: 'Athletic stance, press cable handle straight forward, resist rotational pull 2s.',
      },
      {
        exerciseId: 'ex-treadmill',
        order: 8,
        targetSets: 1,
        targetReps: '15 min',
        restSeconds: 0,
        notes: '15-minute treadmill walk. Natural posture and relaxed arm swing.',
      },
    ],
  },

  LOWER_B: {
    id: 'tpl-lower-b',
    code: 'LOWER_B',
    name: 'Lower Body B',
    dayName: 'Wednesday',
    weekday: 3,
    focus: 'Legs, glutes, hamstrings, and core',
    description: 'Legs, glutes, hamstrings, and core (60 min strength + 15 min cardio)',
    estimatedMinutes: 75,
    strengthMinutes: 60,
    cardioMinutes: 15,
    cardioDescription: '15-minute treadmill walk or stationary bike',
    exercises: [
      {
        exerciseId: 'ex-leg-press',
        order: 1,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 90,
        notes: 'Feet hip-width on sled, lower until 90° knee angle, press through mid-foot and heel.',
      },
      {
        exerciseId: 'ex-leg-extension',
        order: 2,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 75,
        notes: 'Align machine pivot with knees, extend with 1s pause at top, smooth controlled lowering.',
      },
      {
        exerciseId: 'ex-leg-curl',
        order: 3,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 75,
        notes: 'Thigh clamp snug, pull heels toward glutes, resist return slowly.',
      },
      {
        exerciseId: 'ex-step-ups',
        order: 4,
        targetSets: 2,
        targetReps: '8 / leg',
        targetRepsNum: 8,
        restSeconds: 75,
        notes: 'Logged weight is per dumbbell. Step firmly onto knee-height plyo box, drive through working heel.',
      },
      {
        exerciseId: 'ex-romanian-deadlift',
        order: 5,
        targetSets: 2,
        targetReps: '10',
        targetRepsNum: 10,
        restSeconds: 75,
        notes: 'Logged weight is per dumbbell. Hinge back keeping dumbbells skimming legs, neutral spine.',
      },
      {
        exerciseId: 'ex-db-glute-bridge',
        order: 6,
        targetSets: 2,
        targetReps: '12',
        targetRepsNum: 12,
        restSeconds: 60,
        notes: 'Rest dumbbell across hip crease with hands securing it. Drive hips up, squeeze glutes hard 2s.',
      },
      {
        exerciseId: 'ex-plank',
        order: 7,
        targetSets: 2,
        targetReps: '20 sec',
        targetRepsNum: 20,
        restSeconds: 60,
        notes: 'Elbows under shoulders, glutes and abs braced rigid, hold for 20 continuous seconds.',
      },
      {
        exerciseId: 'ex-treadmill',
        order: 8,
        targetSets: 1,
        targetReps: '15 min',
        restSeconds: 0,
        notes: '15-minute treadmill walk or stationary bike if knee joints feel sore.',
      },
    ],
  },
};

/** Get template by code */
export function getTemplateByCode(code: string): WorkoutTemplateDefinition | null {
  return WORKOUT_TEMPLATES[code] ?? null;
}

/** Get template with populated exercise details */
export function getHydratedTemplate(code: string): WorkoutTemplateDefinition | null {
  const template = WORKOUT_TEMPLATES[code];
  if (!template) return null;

  return {
    ...template,
    exercises: template.exercises.map((item) => ({
      ...item,
      exercise: exercises.find((e) => e.id === item.exerciseId),
    })),
  };
}
