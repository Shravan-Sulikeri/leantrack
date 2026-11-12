import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDisplayDate, formatFullDate } from '@/lib/dates';
import { useQuery } from '@tanstack/react-query';
import { localDb, CachedSession } from '@/db';
import { useWeightLogs } from '@/features/weight/useWeightLogs';
import { useCalorieLogs } from '@/features/calories/useCalorieLogs';
import { SessionDetailSheet } from './SessionDetailSheet';
import { WeightLogSheet } from '@/features/weight/WeightLogSheet';
import { CalorieLogSheet } from '@/features/calories/CalorieLogSheet';
import {
  Calendar,
  Dumbbell,
  Clock,
  Scale,
  Flame,
  ChevronRight,
  Filter,
  Plus,
} from 'lucide-react';
import { cn } from '@/components/ui/cn';

export function HistoryScreen() {
  const { profile } = useAuth();
  const userId = profile?.user_id || 'local-athlete-uuid';

  const [activeTab, setActiveTab] = useState<'workouts' | 'daily_metrics'>('workouts');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [selectedSession, setSelectedSession] = useState<CachedSession | null>(null);

  // Sheets for backfill/edit
  const [editDate, setEditDate] = useState<string | undefined>(undefined);
  const [weightSheetOpen, setWeightSheetOpen] = useState(false);
  const [calorieSheetOpen, setCalorieSheetOpen] = useState(false);

  // Queries
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['history_sessions', userId],
    queryFn: async () => {
      return await localDb.cachedSessions
        .where('user_id')
        .equals(userId)
        .reverse()
        .sortBy('scheduled_date');
    },
  });

  const { data: weightLogs = [] } = useWeightLogs();
  const { data: calorieLogs = [] } = useCalorieLogs();

  const filteredSessions = sessions.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  // Group daily logs by date
  const allDates = Array.from(
    new Set([
      ...weightLogs.map((w) => w.local_date),
      ...calorieLogs.map((c) => c.local_date),
    ])
  ).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold text-[#A5ADB8] uppercase tracking-wider">
          Audit & Records
        </span>
        <h1 className="text-2xl font-black text-[#F6F7F9] tracking-tight">
          Training History
        </h1>
      </div>

      {/* Top Tab Switcher */}
      <div className="flex bg-[#1E232B] p-1 rounded-2xl border border-[#343A43]">
        <button
          onClick={() => setActiveTab('workouts')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5',
            activeTab === 'workouts'
              ? 'bg-[#FF7A2F] text-[#0B0D10] shadow-sm'
              : 'text-[#A5ADB8] hover:text-[#F6F7F9]'
          )}
        >
          <Dumbbell className="w-3.5 h-3.5" /> Workouts ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('daily_metrics')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5',
            activeTab === 'daily_metrics'
              ? 'bg-[#FF7A2F] text-[#0B0D10] shadow-sm'
              : 'text-[#A5ADB8] hover:text-[#F6F7F9]'
          )}
        >
          <Calendar className="w-3.5 h-3.5" /> Weight & Calories
        </button>
      </div>

      {activeTab === 'workouts' && (
        <div className="flex flex-col gap-3">
          {/* Filter Pills */}
          <div className="flex gap-2">
            {(['all', 'completed', 'in_progress'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer capitalize',
                  filterStatus === status
                    ? 'bg-[#22262C] text-[#F6F7F9] border border-[#FF7A2F]/50'
                    : 'text-[#A5ADB8] bg-[#171A1F] border border-[#2B3038]'
                )}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Session Cards */}
          {filteredSessions.length === 0 ? (
            <EmptyState
              title="No workout records yet"
              description="Completed and active workout sessions will appear here with full exercise and cardio logs."
              className="py-12 bg-[#171A1F]"
            />
          ) : (
            filteredSessions.map((session) => {
              const snapshot = session.template_snapshot || {};
              const isCompleted = session.status === 'completed';

              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="p-4 rounded-2xl bg-[#171A1F] border border-[#2B3038] hover:border-[#FF7A2F]/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#A5ADB8]">
                        {formatDisplayDate(session.actual_date || session.scheduled_date)}
                      </span>
                      <span
                        className={cn(
                          'text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider',
                          isCompleted
                            ? 'bg-[#50C48B]/15 text-[#50C48B]'
                            : 'bg-[#F0B35A]/15 text-[#F0B35A]'
                        )}
                      >
                        {session.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#F6F7F9]">
                      {snapshot.templateName || 'Workout Session'}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-[#687383]">
                      <span>{snapshot.exercises?.length || 0} exercises</span>
                      {session.duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {session.duration_minutes} min
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#687383]" />
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'daily_metrics' && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#A5ADB8]">Tap any day to edit or backfill</span>
            <button
              onClick={() => {
                setEditDate(undefined);
                setWeightSheetOpen(true);
              }}
              className="text-xs font-semibold text-[#FF7A2F] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Backfill date
            </button>
          </div>

          {allDates.length === 0 ? (
            <EmptyState
              title="No daily logs yet"
              description="Recorded weights and calories will be neatly organized by date here."
              className="py-12 bg-[#171A1F]"
            />
          ) : (
            allDates.map((dateStr) => {
              const weightEntry = weightLogs.find((w) => w.local_date === dateStr);
              const calorieEntry = calorieLogs.find((c) => c.local_date === dateStr);

              return (
                <div
                  key={dateStr}
                  className="p-4 rounded-2xl bg-[#171A1F] border border-[#2B3038] flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#F6F7F9]">
                      {formatFullDate(dateStr)}
                    </span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-[#347FEF]">
                        <Scale className="w-3.5 h-3.5" />
                        {weightEntry ? `${weightEntry.weight_lb} lb` : 'No weigh-in'}
                      </span>
                      <span className="flex items-center gap-1 text-[#FF7A2F]">
                        <Flame className="w-3.5 h-3.5" />
                        {calorieEntry && calorieEntry.calories_consumed !== null
                          ? `${calorieEntry.calories_consumed} kcal`
                          : 'Not logged'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditDate(dateStr);
                        setWeightSheetOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#22262C] text-[#347FEF] hover:bg-[#2B3038] cursor-pointer"
                    >
                      Weight
                    </button>
                    <button
                      onClick={() => {
                        setEditDate(dateStr);
                        setCalorieSheetOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#22262C] text-[#FF7A2F] hover:bg-[#2B3038] cursor-pointer"
                    >
                      Calories
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Sheets */}
      <SessionDetailSheet
        session={selectedSession}
        isOpen={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
      />
      <WeightLogSheet
        isOpen={weightSheetOpen}
        onClose={() => setWeightSheetOpen(false)}
        initialDate={editDate}
      />
      <CalorieLogSheet
        isOpen={calorieSheetOpen}
        onClose={() => setCalorieSheetOpen(false)}
        initialDate={editDate}
      />
    </div>
  );
}
