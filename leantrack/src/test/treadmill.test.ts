import { describe, it, expect } from 'vitest';
import { TREADMILL_PROGRESSION, getCurrentTreadmillWeek } from '../data/treadmillProgression';

describe('Treadmill Knee-Friendly Progression v1.2', () => {
  it('defines 8 full weeks with fixed 15-minute cardio duration', () => {
    expect(TREADMILL_PROGRESSION.length).toBe(8);

    for (const week of TREADMILL_PROGRESSION) {
      expect(week.durationMin).toBe(15);
      expect(week.durationMax).toBe(15);
      expect(week.targetMinutes).toBe(15);
    }

    // Week 1–2: 0–2% incline, 2.0–2.5 mph
    expect(TREADMILL_PROGRESSION[0]?.inclineMin).toBe(0);
    expect(TREADMILL_PROGRESSION[0]?.inclineMax).toBe(2);
    expect(TREADMILL_PROGRESSION[0]?.suggestedSpeed).toBe('2.0–2.5 mph');

    // Week 7–8: 3–5% incline, 2.5–3.2 mph
    expect(TREADMILL_PROGRESSION[7]?.inclineMin).toBe(3);
    expect(TREADMILL_PROGRESSION[7]?.inclineMax).toBe(5);
    expect(TREADMILL_PROGRESSION[7]?.suggestedSpeed).toBe('2.5–3.2 mph');
  });

  it('provides knee safety notes and bike alternative guidance', () => {
    for (const week of TREADMILL_PROGRESSION) {
      expect(week.kneeSafetyNote.length).toBeGreaterThan(10);
    }
    expect(TREADMILL_PROGRESSION[0]?.kneeSafetyNote).toContain('stationary bike');
  });

  it('determines the current progression week accurately from start date', () => {
    const start = '2026-11-12';
    // Day 0: Week 1
    expect(getCurrentTreadmillWeek(start, '2026-11-12').week).toBe(1);
    // Day 10: Week 2
    expect(getCurrentTreadmillWeek(start, '2026-11-22').week).toBe(2);
    // Day 50: Week 8
    expect(getCurrentTreadmillWeek(start, '2027-01-05').week).toBe(8);
  });
});
