import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { localDb, PendingOperation } from '@/db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthProvider';

export type SyncState = 'idle' | 'syncing' | 'offline' | 'error';

interface SyncContextValue {
  isOnline: boolean;
  syncState: SyncState;
  pendingCount: number;
  lastSyncAt: Date | null;
  errorMessage: string | null;
  syncNow: () => Promise<void>;
  queueOperation: (op: Omit<PendingOperation, 'id' | 'createdAt' | 'status' | 'retryCount'>) => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncState, setSyncState] = useState<SyncState>(navigator.onLine ? 'idle' : 'offline');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  // Update pending count
  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await localDb.pendingOperations
        .where('status')
        .equals('pending')
        .count();
      setPendingCount(count);
    } catch {
      // Ignore in unsupported environments
    }
  }, []);

  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  // Online / Offline handlers
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncState('idle');
      // Attempt immediate sync when connection returns
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('offline');
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        triggerSync();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Main sync function
  const triggerSync = useCallback(async () => {
    if (!navigator.onLine || !isSupabaseConfigured || isSyncingRef.current || !user) {
      if (!navigator.onLine) setSyncState('offline');
      return;
    }

    try {
      isSyncingRef.current = true;
      setSyncState('syncing');
      setErrorMessage(null);

      const pending = await localDb.pendingOperations
        .where('status')
        .equals('pending')
        .toArray();

      if (pending.length === 0) {
        setSyncState('idle');
        setLastSyncAt(new Date());
        isSyncingRef.current = false;
        return;
      }

      for (const op of pending) {
        if (!op.id) continue;

        try {
          // Attempt push to Supabase
          let error = null;

          if (op.table === 'weight_logs') {
            const { error: err } = await supabase
              .from('weight_logs')
              .upsert(op.payload as any, { onConflict: 'user_id,local_date' });
            error = err;
          } else if (op.table === 'calorie_logs') {
            const { error: err } = await supabase
              .from('calorie_logs')
              .upsert(op.payload as any, { onConflict: 'user_id,local_date' });
            error = err;
          } else if (op.table === 'workout_sessions') {
            const { error: err } = await supabase
              .from('workout_sessions')
              .upsert(op.payload as any);
            error = err;
          } else if (op.table === 'set_logs') {
            const { error: err } = await supabase
              .from('set_logs')
              .upsert(op.payload as any);
            error = err;
          } else if (op.table === 'cardio_logs') {
            const { error: err } = await supabase
              .from('cardio_logs')
              .upsert(op.payload as any);
            error = err;
          } else if (op.table === 'profiles') {
            const { error: err } = await supabase
              .from('profiles')
              .upsert(op.payload as any);
            error = err;
          }

          if (error) {
            console.error('Sync push error:', error);
            await localDb.pendingOperations.update(op.id, {
              status: 'failed',
              retryCount: op.retryCount + 1,
              lastAttemptAt: new Date().toISOString(),
              error: error.message,
            });
          } else {
            // Success: mark completed or remove
            await localDb.pendingOperations.delete(op.id);
          }
        } catch (err: any) {
          console.error('Sync item exception:', err);
          await localDb.pendingOperations.update(op.id, {
            status: 'failed',
            retryCount: op.retryCount + 1,
            lastAttemptAt: new Date().toISOString(),
            error: err.message || 'Unknown error',
          });
        }
      }

      await refreshPendingCount();
      const remainingFailed = await localDb.pendingOperations
        .where('status')
        .equals('failed')
        .count();

      if (remainingFailed > 0) {
        setSyncState('error');
        setErrorMessage(`${remainingFailed} item(s) pending sync`);
      } else {
        setSyncState('idle');
        setLastSyncAt(new Date());
      }
    } catch (err: any) {
      console.error('Fatal sync failure:', err);
      setSyncState('error');
      setErrorMessage(err.message || 'Sync failed');
    } finally {
      isSyncingRef.current = false;
    }
  }, [user, refreshPendingCount]);

  // Queue a new operation to local IndexedDB and trigger sync if online
  const queueOperation = useCallback(
    async (op: Omit<PendingOperation, 'id' | 'createdAt' | 'status' | 'retryCount'>) => {
      const fullOp: PendingOperation = {
        ...op,
        createdAt: new Date().toISOString(),
        status: 'pending',
        retryCount: 0,
      };

      await localDb.pendingOperations.add(fullOp);
      await refreshPendingCount();

      if (navigator.onLine && isSupabaseConfigured) {
        triggerSync();
      }
    },
    [refreshPendingCount, triggerSync]
  );

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        syncState,
        pendingCount,
        lastSyncAt,
        errorMessage,
        syncNow: triggerSync,
        queueOperation,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
