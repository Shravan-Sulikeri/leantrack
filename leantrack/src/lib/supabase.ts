import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Whether Supabase is configured with real (non-placeholder) values.
 * Returns false if env vars are missing or still set to placeholder strings.
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your-supabase-url' &&
    supabaseAnonKey !== 'your-supabase-anon-key' &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
);

/**
 * Supabase client instance.
 * Falls back to empty strings if not configured so the app can still
 * run in offline / local-only mode without crashing at import time.
 */
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'leantrack-auth',
    },
  }
);
