import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDb, CachedWeightLog } from '@/db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthProvider';
import { useSync } from '@/features/sync/SyncProvider';
import { v4 as uuidv4 } from 'uuid';

export function useWeightLogs() {
  const { user } = useAuth();
  const userId = user?.id || 'local-athlete-uuid';

  return useQuery({
    queryKey: ['weight_logs', userId],
    queryFn: async () => {
      // 1. Fetch from local IndexedDB first
      const localLogs = await localDb.cachedWeightLogs
        .where('user_id')
        .equals(userId)
        .sortBy('local_date');

      // 2. If online and Supabase is configured, fetch remote and merge
      if (isSupabaseConfigured && navigator.onLine) {
        try {
          const { data, error } = await supabase
            .from('weight_logs')
            .select('*')
            .eq('user_id', userId)
            .order('local_date', { ascending: true });

          if (data && !error) {
            // Upsert into local cache
            for (const item of data) {
              await localDb.cachedWeightLogs.put({
                id: item.id,
                user_id: item.user_id,
                local_date: item.local_date,
                weight_lb: Number(item.weight_lb),
                notes: item.notes,
                created_at: item.created_at,
                updated_at: item.updated_at,
              });
            }
            return data.map((d) => ({
              ...d,
              weight_lb: Number(d.weight_lb),
            })) as CachedWeightLog[];
          }
        } catch (e) {
          console.warn('Could not fetch remote weight logs, using local cache:', e);
        }
      }

      return localLogs;
    },
  });
}

export function useLatestWeight() {
  const { data: logs, isLoading } = useWeightLogs();

  if (!logs || logs.length === 0) {
    return { latestLog: null, isLoading };
  }

  // Sorted ascending, so last item is newest
  const latestLog = logs[logs.length - 1] ?? null;
  return { latestLog, isLoading };
}

export function useUpsertWeight() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { queueOperation, isOnline } = useSync();
  const userId = user?.id || 'local-athlete-uuid';

  return useMutation({
    mutationFn: async ({
      weight_lb,
      local_date,
      notes,
    }: {
      weight_lb: number;
      local_date: string;
      notes?: string;
    }) => {
      const now = new Date().toISOString();

      // Check if entry already exists for this date
      const existing = await localDb.cachedWeightLogs
        .where('[user_id+local_date]')
        .equals([userId, local_date])
        .first();

      const recordId = existing ? existing.id : uuidv4();

      const record: CachedWeightLog = {
        id: recordId,
        user_id: userId,
        local_date,
        weight_lb: Number(weight_lb),
        notes: notes ?? existing?.notes ?? null,
        created_at: existing ? existing.created_at : now,
        updated_at: now,
      };

      // 1. Immediately persist to local IndexedDB
      await localDb.cachedWeightLogs.put(record);

      // 2. Queue for cloud sync (idempotent upsert by user_id + local_date)
      await queueOperation({
        operationId: uuidv4(),
        table: 'weight_logs',
        recordId: record.id,
        operation: 'upsert',
        payload: {
          id: record.id,
          user_id: record.user_id,
          local_date: record.local_date,
          weight_lb: record.weight_lb,
          notes: record.notes,
          created_at: record.created_at,
          updated_at: record.updated_at,
        },
      });

      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight_logs', userId] });
    },
  });
}

export function useDeleteWeight() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { queueOperation } = useSync();
  const userId = user?.id || 'local-athlete-uuid';

  return useMutation({
    mutationFn: async (recordId: string) => {
      await localDb.cachedWeightLogs.delete(recordId);

      await queueOperation({
        operationId: uuidv4(),
        table: 'weight_logs',
        recordId,
        operation: 'delete',
        payload: { id: recordId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight_logs', userId] });
    },
  });
}
