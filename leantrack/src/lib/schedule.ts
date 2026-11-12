import { getLocalWeekday } from './dates';
import { format, parse, addDays } from 'date-fns';

/** The four workout splits plus rest */
export type WorkoutDay = 'UPPER_A' | 'LOWER_A' | 'UPPER_B' | 'LOWER_B' | 'REST';

/**
 * Weekday-to-workout mapping:
 *   0 = Sunday  → REST
 *   1 = Monday  → UPPER_B
 *   2 = Tuesday → REST
 *   3 = Wednesday → LOWER_B
 *   4 = Thursday → UPPER_A
 *   5 = Friday  → REST
 *   6 = Saturday → LOWER_A
 */
const WEEKDAY_MAP: Record<number, WorkoutDay> = {
  0: 'REST',
  1: 'UPPER_B',
  2: 'REST',
  3: 'LOWER_B',
  4: 'UPPER_A',
  5: 'REST',
  6: 'LOWER_A',
};

const DISPLAY_NAMES: Record<WorkoutDay, string> = {
  UPPER_A: 'Upper Body A',
  LOWER_A: 'Lower Body A',
  UPPER_B: 'Upper Body B',
  LOWER_B: 'Lower Body B',
  REST: 'Recovery Day',
};

/**
 * Returns the scheduled workout for a given YYYY-MM-DD date
 * in the user's timezone.
 */
export function getScheduledWorkout(date: string, timezone: string): WorkoutDay {
  const weekday = getLocalWeekday(date, timezone);
  return WEEKDAY_MAP[weekday] ?? 'REST';
}

/**
 * Returns the full display name for a workout code.
 */
export function getWorkoutDisplayName(code: WorkoutDay): string {
  return DISPLAY_NAMES[code];
}

/**
 * Whether the given workout code is a rest day.
 */
export function isRestDay(code: WorkoutDay): boolean {
  return code === 'REST';
}

/**
 * Finds the next scheduled workout day (not REST) starting from
 * the day after `fromDate`. Returns the date and workout code.
 */
export function getNextWorkoutDate(
  fromDate: string,
  timezone: string
): { date: string; workout: WorkoutDay } {
  const parsed = parse(fromDate, 'yyyy-MM-dd', new Date());
  // Look up to 7 days ahead (guaranteed to find a workout day in a weekly cycle)
  for (let i = 1; i <= 7; i++) {
    const nextDate = addDays(parsed, i);
    const nextDateStr = format(nextDate, 'yyyy-MM-dd');
    const workout = getScheduledWorkout(nextDateStr, timezone);
    if (!isRestDay(workout)) {
      return { date: nextDateStr, workout };
    }
  }
  // Fallback — should never reach here with the 4-day split
  const fallbackDate = format(addDays(parsed, 1), 'yyyy-MM-dd');
  return { date: fallbackDate, workout: 'UPPER_A' };
}
