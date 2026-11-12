import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { localDb, CachedProfile } from '@/db';
import type { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  height_inches: number;
  starting_weight: number;
  goal_weight: number;
  timezone: string;
  units: 'imperial' | 'metric';
  daily_calorie_goal: number | null;
  schedule_start_date: string;
  default_sets_per_exercise?: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isConfigured: boolean;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  enableDemoMode: () => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const DEFAULT_PROFILE: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  display_name: 'Athlete',
  height_inches: 71, // 5'11"
  starting_weight: 240.0,
  goal_weight: 190.0,
  timezone: 'America/New_York',
  units: 'imperial',
  daily_calorie_goal: null,
  schedule_start_date: '2026-11-12',
  default_sets_per_exercise: 2,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('leantrack_demo_mode') === 'true' || !isSupabaseConfigured;
  });

  // Load profile from local DB or Supabase
  const loadProfile = useCallback(async (userId: string) => {
    try {
      // Check local cache first
      const cached = await localDb.cachedProfiles.get(userId);
      if (cached) {
        setProfile(cached as any);
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data && !error) {
          const loaded: UserProfile = {
            id: data.id,
            user_id: data.id,
            display_name: data.display_name,
            height_inches: data.height_inches || 71,
            starting_weight: Number(data.starting_weight_lb) || 240,
            goal_weight: Number(data.goal_weight_lb) || 190,
            timezone: data.timezone || 'America/New_York',
            units: data.units || 'imperial',
            daily_calorie_goal: data.daily_calorie_goal,
            schedule_start_date: data.schedule_start_date || '2026-11-12',
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
          setProfile(loaded);
          await localDb.cachedProfiles.put(loaded as any);
        } else if (error && error.code === 'PGRST116') {
          // Profile does not exist yet -> create initial starter profile
          const initial: UserProfile = {
            id: userId,
            user_id: userId,
            ...DEFAULT_PROFILE,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase.from('profiles').insert({
            id: userId,
            display_name: initial.display_name,
            height_inches: initial.height_inches,
            starting_weight_lb: initial.starting_weight,
            goal_weight_lb: initial.goal_weight,
            timezone: initial.timezone,
            units: initial.units,
            daily_calorie_goal: initial.daily_calorie_goal,
            schedule_start_date: initial.schedule_start_date,
          });
          setProfile(initial);
          await localDb.cachedProfiles.put(initial as any);
        }
      } else if (!cached) {
        // Local starter profile
        const localInitial: UserProfile = {
          id: userId,
          user_id: userId,
          ...DEFAULT_PROFILE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(localInitial);
        await localDb.cachedProfiles.put(localInitial as any);
      }
    } catch (e) {
      console.error('Error loading profile:', e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        // Fallback to local user
        const localUserId = localStorage.getItem('leantrack_local_uid') || 'local-athlete-uuid';
        localStorage.setItem('leantrack_local_uid', localUserId);
        setIsDemoMode(true);
        await loadProfile(localUserId);
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(s);
          if (s?.user) {
            await loadProfile(s.user.id);
          } else if (isDemoMode) {
            const localUserId = localStorage.getItem('leantrack_local_uid') || 'local-athlete-uuid';
            localStorage.setItem('leantrack_local_uid', localUserId);
            await loadProfile(localUserId);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
        setSession(s);
        if (s?.user) {
          setIsDemoMode(false);
          localStorage.removeItem('leantrack_demo_mode');
          await loadProfile(s.user.id);
        }
      });
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, [loadProfile, isDemoMode]);

  const signInWithOtp = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase credentials not configured in .env') };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    return { error: error as Error | null };
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase credentials not configured') };
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (data?.session) {
      setSession(data.session);
      setIsDemoMode(false);
      localStorage.removeItem('leantrack_demo_mode');
      if (data.user) {
        await loadProfile(data.user.id);
      }
    }
    return { error: error as Error | null };
  }, [loadProfile]);

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
    localStorage.setItem('leantrack_demo_mode', 'true');
    const localUserId = localStorage.getItem('leantrack_local_uid') || 'local-athlete-uuid';
    localStorage.setItem('leantrack_local_uid', localUserId);
    loadProfile(localUserId);
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setProfile(null);
    setIsDemoMode(false);
    localStorage.removeItem('leantrack_demo_mode');
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) return { error: new Error('No active profile') };

    const updated: UserProfile = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    setProfile(updated);
    await localDb.cachedProfiles.put(updated as any);

    if (isSupabaseConfigured && session?.user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: updated.display_name,
          height_inches: updated.height_inches,
          starting_weight_lb: updated.starting_weight,
          goal_weight_lb: updated.goal_weight,
          timezone: updated.timezone,
          units: updated.units,
          daily_calorie_goal: updated.daily_calorie_goal,
          schedule_start_date: updated.schedule_start_date,
          updated_at: updated.updated_at,
        })
        .eq('id', profile.user_id);

      return { error: error as Error | null };
    }

    return { error: null };
  }, [profile, session]);

  const effectiveUser: User | null = session?.user ?? (isDemoMode ? ({
    id: localStorage.getItem('leantrack_local_uid') || 'local-athlete-uuid',
    email: 'local@leantrack.app',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User) : null);

  const value: AuthContextValue = {
    session,
    user: effectiveUser,
    profile,
    isLoading,
    isAuthenticated: session !== null || isDemoMode,
    isDemoMode,
    isConfigured: isSupabaseConfigured,
    signInWithOtp,
    verifyOtp,
    enableDemoMode,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
