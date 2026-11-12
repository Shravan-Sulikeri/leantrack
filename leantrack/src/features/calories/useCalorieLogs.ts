import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb, CachedCalorieLog } from '@/db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthProvider';
import { useSync } from '@/features/sync/SyncProvider';
import { v4 as uuidv4 } from 'uuid';

export function useCalorieLogs() {
  const { user } = useAuth();
  const userId = user?.id || 'local-athlete-uuid';

  return useQuery({
    queryKey: ['calorie_logs', userId],
    queryFn: async () => {
      // 1. Fetch from local cache first
      const localLogs = await localDb.cachedCalorieLogs
        .where('user_id')
        .equals(userId)
        .sortBy('local_date');

      // 2. Fetch remote if online
      if (isSupabaseConfigured && navigator.onLine) {
        try {
          const { data, error } = await supabase
            .from('calorie_logs')
            .select('*')
            .eq('user_id', userId)
            .order('local_date', { ascending: true });

          if (data && !error) {
            for (const item of data) {
              await localDb.cachedCalorieLogs.put({
                id: item.id,
                user_id: item.user_id,
                local_date: item.local_date,
                calories_consumed: item.calories_consumed,
                daily_goal_kcal: item.daily_goal_kcal,
                notes: item.notes,
                created_at: item.created_at,
                updated_at: item.updated_at,
              });
            }
            return data as CachedCalorieLog[];
          }
        } catch (e) {
          console.warn('Could not fetch remote calorie logs, using local cache:', e);
        }
      }

      return localLogs;
    },
  });
}

export function useTodayCalories(date: string) {
  const { data: logs, isLoading } = useCalorieLogs();
  const entry = logs?.find((l) => l.local_date === date) ?? null;
  return { calorieEntry: entry, isLoading };
}

export function useUpsertCalories() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  const { queueOperation } = useSync();
  const userId = user?.id || 'local-athlete-uuid';

  return useMutation({
    mutationFn: async ({
      local_date,
      calories_consumed,
      mode = 'set',
      amount_to_add = 0,
      notes,
    }: {
      local_date: string;
      calories_consumed?: number | null;
      mode?: 'set' | 'add';
      amount_to_add?: number;
      notes?: string;
    }) => {
      const now = new Date().toISOString();

      // Get existing entry if any
      const existing = await localDb.cachedCalorieLogs
        .where('[user_id+local_date]')
        .equals([userId, local_date])
        .first();

      let finalCalories: number | null = null;

      if (mode === 'add') {
        const current = existing?.calories_consumed ?? 0;
        finalCalories = current + amount_to_add;
      } else {
        finalCalories = calories_consumed !== undefined ? calories_consumed : null;
      }

      const recordId = existing ? existing.id : uuidv4();

      const record: CachedCalorieLog = {
        id: recordId,
        user_id: userId,
        local_date,
        calories_consumed: finalCalories,
        daily_goal_kcal: profile?.daily_calorie_goal ?? existing?.daily_goal_kcal ?? null,
        notes: notes ?? existing?.notes ?? null,
        created_at: existing ? existing.created_at : now,
        updated_at: now,
      };

      // 1. Immediately write to local IndexedDB
      await localDb.cachedCalorieLogs.put(record);

      // 2. Queue for cloud sync
      await queueOperation({
        operationId: uuidv4(),
        table: 'calorie_logs',
        recordId: record.id,
        operation: 'upsert',
        payload: {
          id: record.id,
          user_id: record.user_id,
          local_date: record.local_date,
          calories_consumed: record.calories_consumed,
          daily_goal_kcal: record.daily_goal_kcal,
          notes: record.notes,
          created_at: record.created_at,
          updated_at: record.updated_at,
        },
      });

      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calorie_logs', userId] });
    },
  });
}
