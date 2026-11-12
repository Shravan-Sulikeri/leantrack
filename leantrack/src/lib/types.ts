/** Core TypeScript types for LeanTrack */

/** UUID string type alias for clarity */
export type UUID = string;

/** Date string in YYYY-MM-DD format */
export type DateString = string;

/** Timestamp string in ISO 8601 format */
export type ISOTimestamp = string;

/** IANA timezone string (e.g. "America/New_York") */
export type Timezone = string;

/** Units preference */
export type Units = 'imperial' | 'metric';

/** User profile */
export interface Profile {
  id: UUID;
  user_id: string;
  display_name: string | null;
  height_inches: number;
  starting_weight: number;
  goal_weight: number;
  timezone: Timezone;
  units: Units;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

/** Exercise definition */
export interface Exercise {
  id: UUID;
  name: string;
  muscle_group: string;
  equipment: string;
  is_compound: boolean;
  notes: string | null;
  sort_order: number;
}

/** Workout template (e.g. UPPER_A, LOWER_B) */
export interface WorkoutTemplate {
  id: UUID;
  code: string;
  display_name: string;
  day_of_week: number;
  sort_order: number;
}

/** Exercise within a workout template */
export interface TemplateExercise {
  id: UUID;
  template_id: UUID;
  exercise_id: UUID;
  sets_target: number;
  reps_target_low: number;
  reps_target_high: number;
  rest_seconds: number;
  sort_order: number;
  exercise?: Exercise;
}

/** Workout session status */
export type WorkoutSessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped';

/** A single workout session */
export interface WorkoutSession {
  id: UUID;
  user_id: string;
  template_id: UUID;
  date: DateString;
  status: WorkoutSessionStatus;
  started_at: ISOTimestamp | null;
  completed_at: ISOTimestamp | null;
  duration_minutes: number | null;
  notes: string | null;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
  template?: WorkoutTemplate;
  session_exercises?: SessionExercise[];
}

/** Exercise within a session */
export interface SessionExercise {
  id: UUID;
  session_id: UUID;
  exercise_id: UUID;
  sort_order: number;
  notes: string | null;
  exercise?: Exercise;
  sets?: SetLog[];
}

/** Load mode for interpreting weight values */
export type LoadMode =
  | 'stack_display'
  | 'per_dumbbell'
  | 'per_side'
  | 'total_added_plates'
  | 'bodyweight';

/** Individual set log */
export interface SetLog {
  id: UUID;
  session_exercise_id: UUID;
  set_number: number;
  weight_lb: number | null;
  reps: number;
  rpe: number | null;
  load_mode: LoadMode;
  is_warmup: boolean;
  completed_at: ISOTimestamp | null;
  created_at: ISOTimestamp;
}

/** Cardio log entry */
export interface CardioLog {
  id: UUID;
  user_id: string;
  date: DateString;
  activity_type: string;
  duration_minutes: number;
  distance_miles: number | null;
  calories_burned: number | null;
  heart_rate_avg: number | null;
  notes: string | null;
  created_at: ISOTimestamp;
}

/** Weight log entry */
export interface WeightLog {
  id: UUID;
  user_id: string;
  date: DateString;
  weight_lb: number;
  notes: string | null;
  created_at: ISOTimestamp;
}

/** Calorie log entry */
export interface CalorieLog {
  id: UUID;
  user_id: string;
  date: DateString;
  calories_consumed: number | null;
  calories_target: number | null;
  protein_grams: number | null;
  notes: string | null;
  created_at: ISOTimestamp;
}

/** Sync operation status */
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

/** Sync operation for offline-first architecture */
export interface SyncOperation {
  id: UUID;
  table_name: string;
  record_id: UUID;
  operation: 'insert' | 'update' | 'delete';
  payload: Record<string, unknown>;
  status: SyncStatus;
  retry_count: number;
  error_message: string | null;
  created_at: ISOTimestamp;
  synced_at: ISOTimestamp | null;
}
