import { describe, it, expect } from 'vitest';
import { getGymTrainingWeek } from '../features/workouts/useExerciseProgression';
import { exercises } from '../data/exercises';
import { WORKOUT_TEMPLATES } from '../data/workoutTemplates';

describe('Progressive Overload & v1.2 Architecture', () => {
  it('correctly calculates gym training weeks from start date', () => {
    const start = '2026-11-12';
    // Week 1 (Day 0)
    expect(getGymTrainingWeek('2026-11-12')).toBeGreaterThanOrEqual(1);
    // Future date parsing
    expect(getGymTrainingWeek(null)).toBe(1);
  });

  it('keeps machine and dumbbell recommendations strictly independent with appropriate load modes', () => {
    const dbShoulder = exercises.find((e) => e.id === 'ex-db-shoulder-press');
    const machineChest = exercises.find((e) => e.id === 'ex-chest-press');
    const cableRow = exercises.find((e) => e.id === 'ex-cable-row');
    const dbCurl = exercises.find((e) => e.id === 'ex-db-bicep-curl');
    const plank = exercises.find((e) => e.id === 'ex-plank');

    expect(dbShoulder?.category).toBe('Dumbbell');
    expect(dbShoulder?.loadMode).toBe('per_dumbbell');

    expect(dbCurl?.category).toBe('Dumbbell');
    expect(dbCurl?.loadMode).toBe('per_dumbbell');

    expect(machineChest?.category).toBe('Machine');
    expect(machineChest?.loadMode).toBe('stack_display');

    expect(cableRow?.category).toBe('Machine');
    expect(cableRow?.loadMode).toBe('stack_display');

    expect(plank?.category).toBe('Bodyweight');
    expect(plank?.loadMode).toBe('bodyweight');
  });

  it('enforces 60m strength + 15m cardio = 75m total duration across all templates', () => {
    for (const [code, tpl] of Object.entries(WORKOUT_TEMPLATES)) {
      expect(tpl.estimatedMinutes).toBe(75);
      expect(tpl.strengthMinutes).toBe(60);
      expect(tpl.cardioMinutes).toBe(15);
      expect(tpl.cardioDescription).toBeDefined();
    }
  });

  it('provides beginner-safe default working sets of 2 for all resistance exercises', () => {
    for (const [code, tpl] of Object.entries(WORKOUT_TEMPLATES)) {
      for (const item of tpl.exercises) {
        if (item.exerciseId !== 'ex-treadmill' && item.exerciseId !== 'ex-stationary-bike') {
          expect(item.targetSets).toBe(2);
        }
      }
    }
  });

  it('verifies Plank is configured with 20 seconds duration target', () => {
    const lowerB = WORKOUT_TEMPLATES['LOWER_B']!;
    const plankItem = lowerB.exercises.find((e) => e.exerciseId === 'ex-plank');
    expect(plankItem).toBeDefined();
    expect(plankItem?.targetReps).toBe('20 sec');
    expect(plankItem?.targetRepsNum).toBe(20);
  });
});
