import { describe, it, expect } from 'vitest';
import { getScheduledWorkout, getWorkoutDisplayName, isRestDay, getNextWorkoutDate } from '../lib/schedule';

describe('Workout Schedule Engine', () => {
  const tz = 'America/New_York';

  it('correctly maps Thursday 2026-11-12 to Upper Body A', () => {
    const workout = getScheduledWorkout('2026-11-12', tz);
    expect(workout).toBe('UPPER_A');
    expect(getWorkoutDisplayName(workout)).toContain('Upper');
    expect(isRestDay(workout)).toBe(false);
  });

  it('correctly maps Saturday 2026-11-14 to Lower Body A', () => {
    const workout = getScheduledWorkout('2026-11-14', tz);
    expect(workout).toBe('LOWER_A');
    expect(getWorkoutDisplayName(workout)).toContain('Lower');
    expect(isRestDay(workout)).toBe(false);
  });

  it('correctly maps Monday 2026-11-16 to Upper Body B', () => {
    const workout = getScheduledWorkout('2026-11-16', tz);
    expect(workout).toBe('UPPER_B');
    expect(isRestDay(workout)).toBe(false);
  });

  it('correctly maps Wednesday 2026-11-18 to Lower Body B', () => {
    const workout = getScheduledWorkout('2026-11-18', tz);
    expect(workout).toBe('LOWER_B');
    expect(isRestDay(workout)).toBe(false);
  });

  it('correctly identifies Tuesday, Friday, Sunday as Recovery Days', () => {
    // 2026-11-13 is Friday
    expect(getScheduledWorkout('2026-11-13', tz)).toBe('REST');
    expect(isRestDay('REST')).toBe(true);

    // 2026-11-15 is Sunday
    expect(getScheduledWorkout('2026-11-15', tz)).toBe('REST');

    // 2026-11-17 is Tuesday
    expect(getScheduledWorkout('2026-11-17', tz)).toBe('REST');
  });

  it('correctly previews the next workout from a rest day', () => {
    // From Friday 2026-11-13, next workout is Saturday 2026-11-14 (LOWER_A)
    const next = getNextWorkoutDate('2026-11-13', tz);
    expect(next.workout).toBe('LOWER_A');
    expect(next.date).toBe('2026-11-14');
  });
});
