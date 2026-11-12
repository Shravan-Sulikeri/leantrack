import { describe, it, expect } from 'vitest';
import { calculateWeightProgress, calculate7DayAverage, calculateWeeklyChange } from '../lib/calculations';

describe('Weight & Recomposition Calculations', () => {
  it('calculates true progress from 240.0 lb to 239.6 lb as 0.4 lb', () => {
    const result = calculateWeightProgress(240.0, 239.6, 190.0);
    expect(result.lost).toBe(0.4);
    expect(result.remaining).toBe(49.6);
    // 0.4 / 50 = 0.8%
    expect(result.percentComplete).toBe(0.8);
  });

  it('clamps progress to 0% when starting or if temporary weight increase occurs', () => {
    const baseline = calculateWeightProgress(240.0, 240.0, 190.0);
    expect(baseline.lost).toBe(0.0);
    expect(baseline.percentComplete).toBe(0.0);

    const gain = calculateWeightProgress(240.0, 241.5, 190.0);
    expect(gain.lost).toBe(-1.5);
    expect(gain.percentComplete).toBe(0.0); // Clamped, does not show negative progress
    expect(gain.remaining).toBe(51.5);
  });

  it('reports 100% when goal weight of 190 lb is achieved', () => {
    const goal = calculateWeightProgress(240.0, 190.0, 190.0);
    expect(goal.lost).toBe(50.0);
    expect(goal.remaining).toBe(0.0);
    expect(goal.percentComplete).toBe(100.0);
  });

  it('calculates 7-day average using only real logged observations', () => {
    const logs = [
      { date: '2026-11-12', weight: 240.0 },
      { date: '2026-11-14', weight: 239.0 },
      { date: '2026-11-16', weight: 238.0 },
    ];
    // (240 + 239 + 238) / 3 = 239.0
    expect(calculate7DayAverage(logs)).toBe(239.0);
  });

  it('returns null for 7-day average when fewer than 2 entries exist', () => {
    expect(calculate7DayAverage([])).toBeNull();
    expect(calculate7DayAverage([{ date: '2026-11-12', weight: 240.0 }])).toBeNull();
  });

  it('calculates weekly rate of change safely', () => {
    const entries = [
      // Recent window (7 items)
      { date: '2026-11-20', weight: 237.0 },
      { date: '2026-11-19', weight: 237.2 },
      { date: '2026-11-18', weight: 237.4 },
      { date: '2026-11-17', weight: 237.6 },
      { date: '2026-11-16', weight: 237.8 },
      { date: '2026-11-15', weight: 238.0 },
      { date: '2026-11-14', weight: 238.2 },
      // Previous window (7 items)
      { date: '2026-11-13', weight: 239.0 },
      { date: '2026-11-12', weight: 239.2 },
      { date: '2026-11-11', weight: 239.4 },
      { date: '2026-11-10', weight: 239.6 },
      { date: '2026-11-09', weight: 239.8 },
      { date: '2026-11-08', weight: 240.0 },
      { date: '2026-11-07', weight: 240.2 },
    ];

    const change = calculateWeeklyChange(entries);
    expect(change).not.toBeNull();
    expect(change).toBeLessThan(0); // Negative indicates loss
  });
});
