import { describe, it, expect } from 'vitest';
import { WORKOUT_TEMPLATES, getTemplateByCode } from '../data/workoutTemplates';
import { exercises } from '../data/exercises';

describe('Workout Templates Integrity v1.2', () => {
  it('seeds all four splits with 75m total duration (60m strength + 15m cardio)', () => {
    const splits = ['UPPER_A', 'LOWER_A', 'UPPER_B', 'LOWER_B'] as const;

    for (const code of splits) {
      const template = getTemplateByCode(code);
      expect(template).toBeDefined();
      expect(template?.estimatedMinutes).toBe(75);
      expect(template?.strengthMinutes).toBe(60);
      expect(template?.cardioMinutes).toBe(15);
      expect(template?.cardioDescription).toBeDefined();

      // Verify each exercise references a valid exercise in catalog
      for (const item of template!.exercises) {
        const found = exercises.find((e) => e.id === item.exerciseId);
        expect(found).toBeDefined();
        // Working sets default is 2 (except cardio)
        if (item.exerciseId !== 'ex-treadmill' && item.exerciseId !== 'ex-stationary-bike') {
          expect(item.targetSets).toBe(2);
        }
      }
    }
  });

  it('configures Day 1 Thursday Upper Body A with 7 resistance exercises and 15m cardio', () => {
    const upperA = getTemplateByCode('UPPER_A')!;
    expect(upperA.exercises).toHaveLength(8); // 7 resistance + 1 cardio
    const exerciseIds = upperA.exercises.map((e) => e.exerciseId);
    expect(exerciseIds).toEqual([
      'ex-lat-pulldown',
      'ex-cable-row',
      'ex-chest-press',
      'ex-db-shoulder-press',
      'ex-lateral-raise',
      'ex-tricep-pushdown',
      'ex-db-bicep-curl',
      'ex-treadmill',
    ]);
  });

  it('configures Day 2 Saturday Lower Body A with 6 resistance exercises and 15m cardio', () => {
    const lowerA = getTemplateByCode('LOWER_A')!;
    expect(lowerA.exercises).toHaveLength(7); // 6 resistance + 1 cardio
    const exerciseIds = lowerA.exercises.map((e) => e.exerciseId);
    expect(exerciseIds).toEqual([
      'ex-leg-press',
      'ex-leg-curl',
      'ex-goblet-squat',
      'ex-romanian-deadlift',
      'ex-calf-raise',
      'ex-dead-bug',
      'ex-treadmill',
    ]);
  });

  it('configures Day 3 Monday Upper Body B with 7 resistance exercises and 15m cardio', () => {
    const upperB = getTemplateByCode('UPPER_B')!;
    expect(upperB.exercises).toHaveLength(8); // 7 resistance + 1 cardio
    const exerciseIds = upperB.exercises.map((e) => e.exerciseId);
    expect(exerciseIds).toEqual([
      'ex-lat-pulldown',
      'ex-chest-press',
      'ex-one-arm-db-row',
      'ex-db-rear-delt-fly',
      'ex-tricep-pushdown',
      'ex-db-hammer-curl',
      'ex-pallof-press',
      'ex-treadmill',
    ]);
  });

  it('configures Day 4 Wednesday Lower Body B with 7 resistance exercises and 15m cardio', () => {
    const lowerB = getTemplateByCode('LOWER_B')!;
    expect(lowerB.exercises).toHaveLength(8); // 7 resistance + 1 cardio
    const exerciseIds = lowerB.exercises.map((e) => e.exerciseId);
    expect(exerciseIds).toEqual([
      'ex-leg-press',
      'ex-leg-extension',
      'ex-leg-curl',
      'ex-step-ups',
      'ex-romanian-deadlift',
      'ex-db-glute-bridge',
      'ex-plank',
      'ex-treadmill',
    ]);
  });

  it('contains conservative starting first-test ranges and categories for all movements', () => {
    for (const ex of exercises) {
      expect(ex.firstTestRange).toBeDefined();
      expect(ex.firstTestRange.length).toBeGreaterThan(0);
      expect(ex.setup).toBeDefined();
      expect(ex.howToPerform).toBeDefined();
      expect(ex.breathing).toBeDefined();
      expect(ex.category).toBeDefined();
      expect(['Machine', 'Dumbbell', 'Cable', 'Bodyweight', 'Cardio']).toContain(ex.category);
    }
  });
});
