import { useQuery } from '@tanstack/react-query';
import { localDb, CachedSession, CachedSetLog } from '@/db';
import { exercises, ExerciseData } from '@/data/exercises';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export interface ExerciseProgressionInfo {
  lastSessionDate: string | null;
  lastWeight: number | null;
  lastReps: number | null;
  previousSummary: string; // e.g., "Last: 30 lb × 12" or "No previous log"
  allTargetMet: boolean;
  suggestedWeight: number | null;
  suggestedDelta: number | null; // e.g. +2.5 or +5
  suggestionBadge: string | null; // e.g. "+2.5 lb suggested"
  suggestionReason: string | null;
  loadMode: string;
  category: string;
}

/**
 * Calculates user's gym training week from schedule_start_date or profile creation.
 */
export function getGymTrainingWeek(startDateStr?: string | null): number {
  if (!startDateStr) return 1;
  try {
    const start = parseISO(startDateStr);
    const now = new Date();
    const days = differenceInCalendarDays(now, start);
    if (days < 0) return 1;
    return Math.floor(days / 7) + 1;
  } catch {
    return 1;
  }
}

/**
 * Hook to retrieve previous session data & progressive overload recommendations for an exercise.
 */
export function useExerciseProgression(exerciseId: string, currentSessionId?: string | null) {
  return useQuery({
    queryKey: ['exercise_progression', exerciseId, currentSessionId],
    queryFn: async (): Promise<ExerciseProgressionInfo> => {
      const exercise = exercises.find((e) => e.id === exerciseId);
      const category = exercise?.category || 'Machine';
      const loadMode = exercise?.loadMode || 'stack_display';

      // 1. Fetch completed sessions, newest first
      const completedSessions = await localDb.cachedSessions
        .where('status')
        .equals('completed')
        .toArray();

      // Filter out current active session if any, and sort by finished_at or actual_date desc
      const pastSessions = completedSessions
        .filter((s) => s.id !== currentSessionId)
        .sort((a, b) => {
          const dateA = a.finished_at || a.actual_date || a.scheduled_date;
          const dateB = b.finished_at || b.actual_date || b.scheduled_date;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

      if (pastSessions.length === 0) {
        return {
          lastSessionDate: null,
          lastWeight: null,
          lastReps: null,
          previousSummary: 'First session',
          allTargetMet: false,
          suggestedWeight: null,
          suggestedDelta: null,
          suggestionBadge: null,
          suggestionReason: null,
          loadMode,
          category,
        };
      }

      // 2. Find the most recent session containing logged sets for this exercise
      for (const session of pastSessions) {
        const sessionExKey = `${session.id}_${exerciseId}`;
        const sets = await localDb.cachedSetLogs
          .where('session_exercise_id')
          .equals(sessionExKey)
          .toArray();

        const completedSets = sets.filter((s) => s.completed_at !== null || (s.weight_lb !== null && s.reps > 0));

        if (completedSets.length > 0) {
          // Sort by set_index ascending
          completedSets.sort((a, b) => a.set_index - b.set_index);
          const topSet = completedSets[completedSets.length - 1]!;
          const lastWeight = topSet.weight_lb;
          const lastReps = topSet.reps;

          // Check if all completed sets hit the target reps (or >= 10-12)
          const allTargetMet = completedSets.every((s) => s.reps >= 10);

          let suggestedDelta: number | null = null;
          let suggestedWeight: number | null = null;
          let suggestionBadge: string | null = null;
          let suggestionReason: string | null = null;

          if (allTargetMet && lastWeight !== null && lastWeight > 0) {
            // Independent dumbbell vs machine progression rules:
            // Dumbbells: +2.5 lb / dumbbell (small micro-increase)
            // Machines/cables: +5 lb pin increase
            if (category === 'Dumbbell') {
              suggestedDelta = 2.5;
              suggestedWeight = lastWeight + 2.5;
              suggestionBadge = '+2.5 lb suggested';
              suggestionReason = 'All reps completed comfortably. Ready for +2.5 lb per dumbbell.';
            } else if (category === 'Machine' || category === 'Cable') {
              suggestedDelta = 5;
              suggestedWeight = lastWeight + 5;
              suggestionBadge = '+5 lb suggested';
              suggestionReason = 'All reps completed with good form. Ready for +5 lb on machine stack.';
            }
          }

          const weightLabel =
            loadMode === 'bodyweight'
              ? (lastWeight && lastWeight > 0 ? `+${lastWeight} lb` : 'BW')
              : category === 'Dumbbell'
              ? `${lastWeight} lb/hand`
              : `${lastWeight} lb`;

          return {
            lastSessionDate: session.actual_date || session.scheduled_date,
            lastWeight,
            lastReps,
            previousSummary: `Last: ${weightLabel} × ${lastReps}`,
            allTargetMet,
            suggestedWeight,
            suggestedDelta,
            suggestionBadge,
            suggestionReason,
            loadMode,
            category,
          };
        }
      }

      return {
        lastSessionDate: null,
        lastWeight: null,
        lastReps: null,
        previousSummary: 'First session',
        allTargetMet: false,
        suggestedWeight: null,
        suggestedDelta: null,
        suggestionBadge: null,
        suggestionReason: null,
        loadMode,
        category,
      };
    },
  });
}
