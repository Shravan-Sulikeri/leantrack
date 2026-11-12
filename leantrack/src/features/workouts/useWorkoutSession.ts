import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb, CachedSession, CachedSetLog, CachedCardioLog } from '@/db';
import { useAuth } from '@/features/auth/AuthProvider';
import { useSync } from '@/features/sync/SyncProvider';
import { getTemplateByCode, WorkoutTemplateDefinition } from '@/data/workoutTemplates';
import { exercises } from '@/data/exercises';
import { v4 as uuidv4 } from 'uuid';

export interface ActiveExerciseState {
  id: string;
  exerciseId: string;
  name: string;
  equipment: string;
  loadMode: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
  sets: Array<{
    id: string;
    set_index: number;
    weight_lb: number | null;
    reps: number;
    rpe: number | null;
    load_mode: string;
    completed: boolean;
  }>;
}

export function useActiveWorkout(templateCode: string, localDate: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id || 'local-athlete-uuid';

  // Check for in-progress session for today
  const { data: activeSession, isLoading } = useQuery({
    queryKey: ['active_session', userId, localDate],
    queryFn: async () => {
      const session = await localDb.cachedSessions
        .where('user_id')
        .equals(userId)
        .and((s) => s.status === 'in_progress' || (s.scheduled_date === localDate && s.status === 'scheduled'))
        .first();

      return session ?? null;
    },
  });

  return { activeSession, isLoading };
}

export function useWorkoutActions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { queueOperation } = useSync();
  const userId = user?.id || 'local-athlete-uuid';

  const startWorkout = async (templateCode: string, localDate: string): Promise<CachedSession> => {
    const template = getTemplateByCode(templateCode);
    const now = new Date().toISOString();
    const sessionId = uuidv4();

    // Create frozen snapshot of routine
    const snapshot = {
      templateCode,
      templateName: template?.name || 'Workout',
      estimatedMinutes: template?.estimatedMinutes || 75,
      strengthMinutes: template?.strengthMinutes || 60,
      cardioMinutes: template?.cardioMinutes || 15,
      exercises: (template?.exercises || []).map((te) => {
        const fullEx = exercises.find((e) => e.id === te.exerciseId);
        return {
          exerciseId: te.exerciseId,
          name: fullEx?.name || 'Exercise',
          equipment: fullEx?.equipment || '',
          category: fullEx?.category || 'Machine',
          loadMode: fullEx?.loadMode || 'stack_display',
          targetSets: te.targetSets,
          targetReps: te.targetReps,
          restSeconds: te.restSeconds,
          notes: te.notes,
        };
      }),
    };

    const session: CachedSession = {
      id: sessionId,
      user_id: userId,
      template_id: template?.id,
      scheduled_date: localDate,
      actual_date: localDate,
      status: 'in_progress',
      started_at: now,
      finished_at: null,
      duration_minutes: null,
      template_snapshot: snapshot,
      notes: null,
      created_at: now,
      updated_at: now,
    };

    await localDb.cachedSessions.put(session);

    // Seed initial empty set logs for exercises
    for (const ex of snapshot.exercises) {
      if (ex.exerciseId !== 'ex-treadmill' && ex.exerciseId !== 'ex-stationary-bike') {
        for (let i = 1; i <= ex.targetSets; i++) {
          const setId = uuidv4();
          await localDb.cachedSetLogs.put({
            id: setId,
            session_exercise_id: `${sessionId}_${ex.exerciseId}`,
            set_index: i,
            weight_lb: null,
            reps: parseInt(ex.targetReps, 10) || 12,
            rpe: null,
            load_mode: ex.loadMode,
            completed_at: null,
            created_at: now,
          });
        }
      }
    }

    await queueOperation({
      operationId: uuidv4(),
      table: 'workout_sessions',
      recordId: session.id,
      operation: 'insert',
      payload: session as unknown as Record<string, unknown>,
    });

    queryClient.invalidateQueries({ queryKey: ['active_session', userId, localDate] });
    return session;
  };

  const saveSetLog = async ({
    sessionId,
    exerciseId,
    setIndex,
    weightLb,
    reps,
    completed,
    loadMode,
    rpe,
  }: {
    sessionId: string;
    exerciseId: string;
    setIndex: number;
    weightLb: number | null;
    reps: number;
    completed: boolean;
    loadMode: string;
    rpe?: number | null;
  }) => {
    const sessionExerciseId = `${sessionId}_${exerciseId}`;
    const existing = await localDb.cachedSetLogs
      .where('[session_exercise_id+set_index]')
      .equals([sessionExerciseId, setIndex])
      .first();

    const now = new Date().toISOString();
    const id = existing?.id || uuidv4();
    const log: CachedSetLog = {
      id,
      session_exercise_id: sessionExerciseId,
      set_index: setIndex,
      weight_lb: weightLb,
      reps,
      rpe: rpe ?? existing?.rpe ?? null,
      load_mode: loadMode,
      completed_at: completed ? (existing?.completed_at || now) : null,
      created_at: existing?.created_at || now,
    };

    await localDb.cachedSetLogs.put(log);

    await queueOperation({
      operationId: uuidv4(),
      table: 'set_logs',
      recordId: id,
      operation: 'upsert',
      payload: log as unknown as Record<string, unknown>,
    });
  };

  const deleteSetLog = async (sessionId: string, exerciseId: string, setIndex: number) => {
    const sessionExerciseId = `${sessionId}_${exerciseId}`;
    const existing = await localDb.cachedSetLogs
      .where('[session_exercise_id+set_index]')
      .equals([sessionExerciseId, setIndex])
      .first();

    if (existing) {
      await localDb.cachedSetLogs.delete(existing.id);
      await queueOperation({
        operationId: uuidv4(),
        table: 'set_logs',
        recordId: existing.id,
        operation: 'delete',
        payload: { id: existing.id },
      });
    }
  };

  const loadSessionSets = async (sessionId: string) => {
    return await localDb.cachedSetLogs
      .filter((log) => log.session_exercise_id.startsWith(`${sessionId}_`))
      .toArray();
  };

  const finishWorkout = async ({
    sessionId,
    durationMinutes,
    notes,
    cardioData,
  }: {
    sessionId: string;
    durationMinutes: number;
    notes?: string;
    cardioData?: {
      equipment: string;
      duration_minutes: number;
      speed_mph?: number;
      incline_pct?: number;
      distance_miles?: number;
      machine_kcal_estimate?: number;
      knee_comfort?: string;
    };
  }) => {
    const now = new Date().toISOString();
    const session = await localDb.cachedSessions.get(sessionId);
    if (!session) return;

    const updatedSession: CachedSession = {
      ...session,
      status: 'completed',
      finished_at: now,
      duration_minutes: durationMinutes,
      notes: notes ?? session.notes,
      updated_at: now,
    };

    await localDb.cachedSessions.put(updatedSession);

    // Save cardio log if recorded
    if (cardioData && cardioData.duration_minutes > 0) {
      const cardioId = uuidv4();
      const cardioRecord: CachedCardioLog = {
        id: cardioId,
        user_id: userId,
        session_id: sessionId,
        local_date: session.scheduled_date,
        equipment: cardioData.equipment,
        duration_minutes: cardioData.duration_minutes,
        speed_mph: cardioData.speed_mph ?? null,
        incline_pct: cardioData.incline_pct ?? null,
        distance_miles: cardioData.distance_miles ?? null,
        machine_kcal_estimate: cardioData.machine_kcal_estimate ?? null,
        knee_comfort: cardioData.knee_comfort ?? null,
        notes: null,
        created_at: now,
      };

      await localDb.cachedCardioLogs.put(cardioRecord);

      await queueOperation({
        operationId: uuidv4(),
        table: 'cardio_logs',
        recordId: cardioId,
        operation: 'insert',
        payload: cardioRecord as unknown as Record<string, unknown>,
      });
    }

    await queueOperation({
      operationId: uuidv4(),
      table: 'workout_sessions',
      recordId: sessionId,
      operation: 'update',
      payload: updatedSession as unknown as Record<string, unknown>,
    });

    queryClient.invalidateQueries({ queryKey: ['active_session'] });
    queryClient.invalidateQueries({ queryKey: ['recent_sessions'] });
  };

  return { startWorkout, saveSetLog, deleteSetLog, loadSessionSets, finishWorkout };
}
