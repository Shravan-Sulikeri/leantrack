import Dexie, { type EntityTable } from 'dexie';

export interface PendingOperation {
  id?: number;
  operationId: string;
  table: string;
  recordId: string;
  operation: 'insert' | 'update' | 'upsert' | 'delete';
  payload: Record<string, unknown>;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  retryCount: number;
  createdAt: string;
  lastAttemptAt?: string;
  error?: string;
}

export interface CachedProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  height_inches: number;
  starting_weight: number;
  goal_weight: number;
  timezone: string;
  units: 'imperial' | 'metric';
  daily_calorie_goal?: number | null;
  schedule_start_date?: string;
  default_sets_per_exercise?: number;
  updated_at: string;
}

export interface CachedWeightLog {
  id: string;
  user_id: string;
  local_date: string;
  weight_lb: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CachedCalorieLog {
  id: string;
  user_id: string;
  local_date: string;
  calories_consumed: number | null;
  daily_goal_kcal?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CachedSession {
  id: string;
  user_id: string;
  template_id?: string;
  scheduled_date: string;
  actual_date?: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  started_at?: string | null;
  finished_at?: string | null;
  duration_minutes?: number | null;
  template_snapshot: any;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CachedSetLog {
  id: string;
  session_exercise_id: string;
  set_index: number;
  weight_lb: number | null;
  reps: number;
  rpe?: number | null;
  load_mode: string;
  is_warmup?: boolean;
  completed_at?: string | null;
  created_at: string;
}

export interface CachedCardioLog {
  id: string;
  user_id: string;
  session_id?: string | null;
  local_date: string;
  equipment: string;
  duration_minutes: number;
  speed_mph?: number | null;
  incline_pct?: number | null;
  distance_miles?: number | null;
  machine_kcal_estimate?: number | null;
  knee_comfort?: string | null;
  notes?: string | null;
  created_at: string;
}

class LeanTrackDexieDB extends Dexie {
  pendingOperations!: EntityTable<PendingOperation, 'id'>;
  cachedProfiles!: EntityTable<CachedProfile, 'id'>;
  cachedWeightLogs!: EntityTable<CachedWeightLog, 'id'>;
  cachedCalorieLogs!: EntityTable<CachedCalorieLog, 'id'>;
  cachedSessions!: EntityTable<CachedSession, 'id'>;
  cachedSetLogs!: EntityTable<CachedSetLog, 'id'>;
  cachedCardioLogs!: EntityTable<CachedCardioLog, 'id'>;

  constructor() {
    super('LeanTrackDB');
    this.version(1).stores({
      pendingOperations: '++id, operationId, table, recordId, status, createdAt',
      cachedProfiles: 'id, user_id',
      cachedWeightLogs: 'id, user_id, local_date, [user_id+local_date]',
      cachedCalorieLogs: 'id, user_id, local_date, [user_id+local_date]',
      cachedSessions: 'id, user_id, scheduled_date, status',
      cachedSetLogs: 'id, session_exercise_id, [session_exercise_id+set_index]',
      cachedCardioLogs: 'id, user_id, local_date, session_id',
    });
  }
}

export const localDb = new LeanTrackDexieDB();
