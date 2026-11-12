import { differenceInCalendarDays, parseISO } from 'date-fns';

export interface TreadmillWeek {
  week: number;
  durationMin: number; // Fixed at 15 minutes
  durationMax: number; // Fixed at 15 minutes
  targetMinutes: number; // 15
  inclineMin: number;
  inclineMax: number;
  suggestedSpeed: string;
  focus: string;
  intensityLabel: string;
  warmupMinutes: number;
  cooldownMinutes: number;
  kneeSafetyNote: string;
}

export const TREADMILL_PROGRESSION: TreadmillWeek[] = [
  {
    week: 1,
    durationMin: 15,
    durationMax: 15,
    targetMinutes: 15,
    inclineMin: 0,
    inclineMax: 2,
    suggestedSpeed: '2.0–2.5 mph',
    intensityLabel: 'Comfortable Walking (0–2% incline)',
    focus: 'Comfortable walking, 0–2% incline. Establish baseline rhythm and joint comfort.',
    warmupMinutes: 3,
    cooldownMinutes: 2,
    kneeSafetyNote: 'Keep pace conversational. If knees feel tight, lower to 0% incline or switch to stationary bike.',
  },
  {
    week: 2,
    durationMin: 15,
    durationMax: 15,
    targetMinutes: 15,
    inclineMin: 0,
    inclineMax: 2,
    suggestedSpeed: '2.0–2.5 mph',
    intensityLabel: 'Comfortable Walking (0–2% incline)',
    focus: 'Comfortable walking, 0–2% incline. Smooth cadence and natural arm swing.',
    warmupMinutes: 3,
    cooldownMinutes: 2,
    kneeSafetyNote: 'Stay relaxed through shoulders. Incline is optional—never push through knee or ankle twinges.',
  },
  {
    week: 3,
    durationMin: 15,
    durationMax: 15,
    targetMinutes: 15,
    inclineMin: 1,
    inclineMax: 3,
    suggestedSpeed: '2.2–2.8 mph',
    intensityLabel: 'Comfortable-to-Brisk Walking (1–3% incline)',
    focus: 'Comfortable-to-brisk walking, 1–3% incline. Gentle aerobic progression with fixed 15-min duration.',
    warmupMinutes: 3,
    cooldownMinutes: 2,
    kneeSafetyNote: 'Try 1% or 2% incline. If any knee tenderness arises, drop back down to flat 0% immediately.',
  },
  {
    week: 4,
    durationMin: 15,
    durationMax: 15,
    targetMinutes: 15,
    inclineMin: 1,
    inclineMax: 3,
    suggestedSpeed: '2.2–2.8 mph',
    intensityLabel: 'Comfortable-to-Brisk Walking (1–3% incline)',
    focus: 'Comfortable-to-brisk walking, 1–3% incline. Maintain steady talk-test aerobic pace.',
    warmupMinutes: 3,
    cooldownMinutes: 2,
    kneeSafetyNote: 'Optional intensity ranges only. Bike option always available on lower body days.',
  },
  {
    week: 5,
    durationMin: 15,
    durationMax: 15,
    targetMinutes: 15,
    inclineMin: 2,
    inclineMax: 4,
    suggestedSpeed: '2.4–3.0 mph',
    intensityLabel: 'Brisk Walking (2–4% incline if tolerated)',
    focus: 'Brisk walking, 2–4% incline if tolerated. Moderate aerobic conditioning.',
    warmupMinutes: 3,
    cooldownMinutes: 2,
    kneeSafetyNote: 'Step lightly without pounding heels. Reduce incline if calf or knee tension develops.',
  },
  {
    week: 6,
    durationMin: 15,
    durationMax: 15,
    targetMinutes: 15,
    inclineMin: 2,
    inclineMax: 4,
    suggestedSpeed: '2.4–3.0 mph',
    intensityLabel: 'Brisk Walking (2–4% incline if tolerated)',
    focus: 'Brisk walking, 2–4% incline if tolerated. Maintain continuous smooth output.',
    warmupMinutes: 3,
    cooldownMinutes: 2,
    kneeSafetyNote: 'Do not hold tightly to console handrails. Allow upright posture and free arm movement.',
  },
  {
    week: 7,
    durationMin: 15,
    durationMax: 15,
    targetMinutes: 15,
    inclineMin: 3,
    inclineMax: 5,
    suggestedSpeed: '2.5–3.2 mph',
    intensityLabel: 'Brisk Walking (3–5% incline if tolerated)',
    focus: 'Brisk walking, 3–5% incline if tolerated. Higher incline aerobic conditioning.',
    warmupMinutes: 3,
    cooldownMinutes: 2,
    kneeSafetyNote: 'Incline is strictly as tolerated. 3% is plenty of stimulus—never compromise joint health.',
  },
  {
    week: 8,
    durationMin: 15,
    durationMax: 15,
    targetMinutes: 15,
    inclineMin: 3,
    inclineMax: 5,
    suggestedSpeed: '2.5–3.2 mph',
    intensityLabel: 'Brisk Walking (3–5% incline if tolerated)',
    focus: 'Brisk walking, 3–5% incline if tolerated. Sustainable, joint-safe cardio habit established.',
    warmupMinutes: 3,
    cooldownMinutes: 2,
    kneeSafetyNote: 'Maintain a 15-minute post-lift routine. Focus on consistency over extreme speeds.',
  },
];

/**
 * Calculates the current progression week based on user start date.
 * Default starter start date is 2026-11-12.
 */
export function getCurrentTreadmillWeek(startDateStr: string, currentDateStr: string): TreadmillWeek {
  try {
    const start = parseISO(startDateStr);
    const current = parseISO(currentDateStr);
    const days = differenceInCalendarDays(current, start);
    if (days < 0) return TREADMILL_PROGRESSION[0]!;
    const weekNumber = Math.min(8, Math.max(1, Math.floor(days / 7) + 1));
    return TREADMILL_PROGRESSION[weekNumber - 1] ?? TREADMILL_PROGRESSION[0]!;
  } catch {
    return TREADMILL_PROGRESSION[0]!;
  }
}
