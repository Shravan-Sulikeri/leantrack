/**
 * Weight progress toward a goal.
 *
 * Works whether the user is losing or gaining:
 * - `lost`  is always the absolute change from start (positive = moved toward goal).
 * - `remaining` is the absolute distance still to go.
 * - `percentComplete` is clamped 0–100.
 */
export function calculateWeightProgress(
  startWeight: number,
  currentWeight: number,
  goalWeight: number
): { lost: number; remaining: number; percentComplete: number } {
  const totalChange = Math.abs(startWeight - goalWeight);

  if (totalChange === 0) {
    return { lost: 0, remaining: 0, percentComplete: 100 };
  }

  const isLosing = startWeight > goalWeight;

  const lost = isLosing
    ? startWeight - currentWeight
    : currentWeight - startWeight;

  const remaining = isLosing
    ? currentWeight - goalWeight
    : goalWeight - currentWeight;

  const percent = (lost / totalChange) * 100;
  const percentComplete = Math.min(100, Math.max(0, percent));

  return {
    lost: Math.round(lost * 10) / 10,
    remaining: Math.round(Math.max(0, remaining) * 10) / 10,
    percentComplete: Math.round(percentComplete * 10) / 10,
  };
}

/**
 * Calculates the 7-day simple moving average from the most recent entries.
 * Returns `null` if fewer than 2 entries are provided.
 *
 * Entries are sorted by date descending internally so callers can pass
 * in any order. Only the most recent 7 entries are used.
 */
export function calculate7DayAverage(
  entries: Array<{ date: string; weight: number }>
): number | null {
  if (entries.length < 2) return null;

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const recent = sorted.slice(0, 7);
  const sum = recent.reduce((acc, e) => acc + e.weight, 0);
  return Math.round((sum / recent.length) * 10) / 10;
}

/**
 * Calculates the week-over-week weight change.
 *
 * Compares the average of the most recent 7 entries to the average of
 * the preceding 7 entries. Returns `null` if there aren't enough entries
 * for both windows (at least 2 in each).
 *
 * A negative result means weight decreased (loss). Positive means gain.
 */
export function calculateWeeklyChange(
  entries: Array<{ date: string; weight: number }>
): number | null {
  if (entries.length < 4) return null;

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  const recentWindow = sorted.slice(0, 7);
  const previousWindow = sorted.slice(7, 14);

  if (recentWindow.length < 2 || previousWindow.length < 2) return null;

  const recentAvg =
    recentWindow.reduce((acc, e) => acc + e.weight, 0) / recentWindow.length;
  const previousAvg =
    previousWindow.reduce((acc, e) => acc + e.weight, 0) / previousWindow.length;

  return Math.round((recentAvg - previousAvg) * 10) / 10;
}
