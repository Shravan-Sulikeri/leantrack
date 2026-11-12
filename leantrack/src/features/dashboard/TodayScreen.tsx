import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';
import { getLocalDate, formatDisplayDate, getGreeting } from '@/lib/dates';
import { getScheduledWorkout, getWorkoutDisplayName, isRestDay, getNextWorkoutDate } from '@/lib/schedule';
import { calculateWeightProgress } from '@/lib/calculations';
import { useWeightLogs, useLatestWeight } from '@/features/weight/useWeightLogs';
import { useCalorieLogs } from '@/features/calories/useCalorieLogs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WeightMiniChart } from './WeightMiniChart';
import { WeightLogSheet } from '@/features/weight/WeightLogSheet';
import { CalorieLogSheet } from '@/features/calories/CalorieLogSheet';
import { getTemplateByCode } from '@/data/workoutTemplates';
import {
  Dumbbell,
  Scale,
  Flame,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Calendar,
  Clock,
  HeartPulse,
  CheckCircle2,
  Play,
  RotateCcw,
  Activity,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { localDb } from '@/db';
import { cn } from '@/components/ui/cn';

export function TodayScreen() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const timezone = profile?.timezone || 'America/New_York';
  const today = getLocalDate(timezone);

  const [weightSheetOpen, setWeightSheetOpen] = useState(false);
  const [calorieSheetOpen, setCalorieSheetOpen] = useState(false);

  // Queries
  const { data: weightLogs = [] } = useWeightLogs();
  const { latestLog } = useLatestWeight();
  const { data: calorieLogs = [] } = useCalorieLogs();

  // Completed sessions this week
  const { data: recentSessions = [] } = useQuery({
    queryKey: ['recent_sessions', profile?.user_id],
    queryFn: async () => {
      return await localDb.cachedSessions
        .where('user_id')
        .equals(profile?.user_id || 'local-athlete-uuid')
        .toArray();
    },
  });

  // Calculate cardio minutes
  const { data: cardioLogs = [] } = useQuery({
    queryKey: ['cardio_logs_today', profile?.user_id],
    queryFn: async () => {
      return await localDb.cachedCardioLogs
        .where('user_id')
        .equals(profile?.user_id || 'local-athlete-uuid')
        .toArray();
    },
  });

  const scheduledCode = getScheduledWorkout(today, timezone);
  const isRest = isRestDay(scheduledCode);
  const workoutName = getWorkoutDisplayName(scheduledCode);
  const template = !isRest ? getTemplateByCode(scheduledCode) : null;
  const nextWorkout = isRest ? getNextWorkoutDate(today, timezone) : null;

  // Check today's session status from local database
  const { data: todaySession } = useQuery({
    queryKey: ['today_session', profile?.user_id, today],
    queryFn: async () => {
      const session = await localDb.cachedSessions
        .where('user_id')
        .equals(profile?.user_id || 'local-athlete-uuid')
        .and((s) => s.scheduled_date === today || s.actual_date === today)
        .first();
      return session ?? null;
    },
  });

  // Set logs for today's session if active or finished
  const { data: todaySets = [] } = useQuery({
    queryKey: ['today_session_sets', todaySession?.id],
    enabled: !!todaySession?.id,
    queryFn: async () => {
      return await localDb.cachedSetLogs
        .filter((l) => l.session_exercise_id.startsWith(`${todaySession!.id}_`))
        .toArray();
    },
  });

  // Today's specific logs
  const todayWeight = weightLogs.find((l) => l.local_date === today);
  const todayCalories = calorieLogs.find((l) => l.local_date === today);

  // Weight progress calculations (190 lb goal)
  const startWeight = profile?.starting_weight ?? 240.0;
  const goalWeight = profile?.goal_weight ?? 190.0;
  const currentWeight = latestLog ? latestLog.weight_lb : startWeight;

  const { lost, remaining, percentComplete } = calculateWeightProgress(
    startWeight,
    currentWeight,
    goalWeight
  );

  const completedSessionsThisWeek = recentSessions.filter((s) => s.status === 'completed').length;
  const totalCardioMinutes = cardioLogs.reduce((acc, c) => acc + (c.duration_minutes || 0), 0);

  // Compute today's workout stats
  const resistanceExercises = template?.exercises.filter(
    (te) => te.exerciseId !== 'ex-treadmill' && te.exerciseId !== 'ex-stationary-bike'
  ) || [];
  const totalExerciseCount = resistanceExercises.length;
  const totalTargetSets = resistanceExercises.reduce((sum, te) => sum + te.targetSets, 0);

  let completedSetsCount = 0;
  let completedExercisesCount = 0;

  if (todaySets.length > 0) {
    completedSetsCount = todaySets.filter((s) => s.completed_at !== null).length;
    for (const te of resistanceExercises) {
      const exSets = todaySets.filter((s) => s.session_exercise_id === `${todaySession?.id}_${te.exerciseId}`);
      if (exSets.length > 0 && exSets.every((s) => s.completed_at !== null)) {
        completedExercisesCount += 1;
      }
    }
  }

  // Session completion status
  const isSessionCompleted = todaySession?.status === 'completed';
  const isSessionInProgress = todaySession?.status === 'in_progress';

  // Overall session progress percent
  let sessionProgressPercent = 0;
  if (isSessionCompleted) {
    sessionProgressPercent = 100;
  } else if (isSessionInProgress && totalTargetSets > 0) {
    const strengthPart = Math.round((completedSetsCount / totalTargetSets) * 80);
    sessionProgressPercent = Math.min(95, strengthPart);
  }

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-[#FF7A2F] uppercase tracking-wider">
            {getGreeting()}
          </span>
          <h1 className="text-2xl font-extrabold text-[#F6F7F9] tracking-tight">
            Today, {formatDisplayDate(today)}
          </h1>
        </div>
      </div>

      {/* 1. Primary Weight Progress Hero Card */}
      <Card
        variant="raised"
        onClick={() => setWeightSheetOpen(true)}
        className="p-5 border border-[#2B3038] hover:border-[#347FEF]/50 transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#347FEF]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs font-medium text-[#A5ADB8]">Current Weight</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-[#F6F7F9] tabular-nums tracking-tight">
                {latestLog ? `${latestLog.weight_lb.toFixed(1)}` : '240.0'}
              </span>
              <span className="text-sm font-semibold text-[#A5ADB8]">lb</span>
              {!latestLog && (
                <span className="text-[11px] font-medium text-[#F0B35A] bg-[#292014] px-2 py-0.5 rounded-full border border-[#4A381F]">
                  Starting baseline
                </span>
              )}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#172D50] text-[#347FEF] border border-[#347FEF]/30">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Milestone & Target Bar */}
        <div className="space-y-2 mt-4 pt-3 border-t border-[#2B3038]">
          <div className="flex justify-between text-xs text-[#A5ADB8]">
            <span>Start: <b className="text-[#F6F7F9]">{startWeight} lb</b></span>
            <span>Progress: <b className="text-[#50C48B]">{lost > 0 ? `-${lost.toFixed(1)} lb` : '0.0 lb'}</b></span>
            <span>Target: <b className="text-[#347FEF]">{goalWeight} lb</b></span>
          </div>

          <ProgressBar value={percentComplete} color="orange" height={8} />

          <div className="flex justify-between items-center text-[11px] text-[#687383] pt-0.5">
            <span>{percentComplete}% of 50 lb goal</span>
            <span>{remaining > 0 ? `${remaining.toFixed(1)} lb to go` : 'Goal reached! 🎉'}</span>
          </div>
        </div>
      </Card>

      {/* 2. Today's Workout Card */}
      {!isRest && template ? (
        <Card
          variant="default"
          className={cn(
            'p-5 transition-all relative overflow-hidden',
            isSessionCompleted
              ? 'bg-[#121E17] border border-[#50C48B]/40'
              : 'bg-gradient-to-br from-[#1F1915] via-[#171A1F] to-[#171A1F] border border-[#FF7A2F]/40 shadow-[0_4px_24px_rgba(255,122,47,0.12)]'
          )}
        >
          {/* Header & Status Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  isSessionCompleted
                    ? 'bg-[#50C48B]'
                    : isSessionInProgress
                    ? 'bg-[#FF7A2F] animate-pulse'
                    : 'bg-[#FF7A2F]'
                )}
              />
              <span className="text-xs font-bold text-[#FF7A2F] tracking-wide uppercase">
                {template.dayName} Workout
              </span>
            </div>

            {/* Workout completion status badge */}
            <span
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                isSessionCompleted
                  ? 'bg-[#50C48B]/20 text-[#50C48B] border-[#50C48B]/40'
                  : isSessionInProgress
                  ? 'bg-[#FF7A2F]/20 text-[#FF7A2F] border-[#FF7A2F]/40'
                  : 'bg-[#347FEF]/20 text-[#347FEF] border-[#347FEF]/40'
              )}
            >
              {isSessionCompleted
                ? 'Completed ✓'
                : isSessionInProgress
                ? 'In Progress'
                : 'Ready to Start'}
            </span>
          </div>

          <h2 className="text-xl font-black text-[#F6F7F9] tracking-tight">
            {template.name}
          </h2>

          <p className="text-xs text-[#A5ADB8] mt-1 mb-3.5 leading-relaxed">
            {template.focus || template.description}
          </p>

          {/* 60m Strength + 15m Cardio = 75m Planned Breakdown */}
          <div className="p-3 bg-[#111317] rounded-xl border border-[#2B3038] space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#F6F7F9]">Session Structure</span>
              <span className="font-extrabold text-[#FF7A2F]">75 min total</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[#181C22] border border-[#2B3038] flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#FF7A2F] shrink-0" />
                <div>
                  <div className="font-bold text-[#F6F7F9]">60 min Strength</div>
                  <div className="text-[10px] text-[#A5ADB8]">
                    {isSessionCompleted
                      ? `${totalExerciseCount} done`
                      : `${completedExercisesCount}/${totalExerciseCount} exercises`}
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#181C22] border border-[#2B3038] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#347FEF] shrink-0" />
                <div>
                  <div className="font-bold text-[#F6F7F9]">15 min Cardio</div>
                  <div className="text-[10px] text-[#A5ADB8]">Treadmill / Bike</div>
                </div>
              </div>
            </div>

            {/* Completed sets & Session Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[11px] text-[#A5ADB8]">
                <span>
                  Sets: <b className="text-[#F6F7F9]">{completedSetsCount} / {totalTargetSets} completed</b>
                </span>
                <span className="font-bold text-[#50C48B]">{sessionProgressPercent}%</span>
              </div>
              <ProgressBar
                value={sessionProgressPercent}
                color={isSessionCompleted ? 'success' : 'orange'}
                height={6}
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <Button
            size="lg"
            className={cn(
              'w-full text-base font-bold shadow-md cursor-pointer',
              isSessionCompleted ? 'bg-[#50C48B] hover:bg-[#43a675] text-[#0B0D10]' : ''
            )}
            onClick={() => navigate('/workout')}
          >
            {isSessionCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" /> View Completed Workout
              </>
            ) : isSessionInProgress ? (
              <>
                <Play className="w-5 h-5 fill-current mr-2" /> Resume Today's Workout
              </>
            ) : (
              <>
                Start Today's Workout <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </Card>
      ) : (
        /* Recovery Day Card */
        <Card
          variant="raised"
          className="p-5 border border-[#2B3038] bg-gradient-to-br from-[#171A1F] to-[#1B221E] space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#50C48B]" />
              <span className="text-xs font-bold text-[#50C48B] tracking-wide uppercase">
                Recovery Day
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#50C48B] bg-[#50C48B]/10 px-2 py-0.5 rounded-full border border-[#50C48B]/20">
              Joint Rest & Mobility
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#F6F7F9] tracking-tight">
              Rest & Optional Walking
            </h2>
            <p className="text-xs text-[#A5ADB8] mt-1 leading-relaxed">
              No mandatory gym lifting today. Take an optional easy 15–20 min outdoor walk or gentle treadmill walk to support joint recovery and active circulation.
            </p>
          </div>

          {nextWorkout && (
            <div className="flex items-center justify-between p-3 rounded-[14px] bg-[#12151A] border border-[#2B3038] text-xs">
              <span className="text-[#A5ADB8]">Next scheduled gym session:</span>
              <span className="font-semibold text-[#FF7A2F]">
                {getWorkoutDisplayName(nextWorkout.workout)} · {formatDisplayDate(nextWorkout.date)}
              </span>
            </div>
          )}

          {/* Manual Workout Access (if user missed a workout or wants to train) */}
          <div className="pt-1">
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs font-semibold text-[#A5ADB8] hover:text-[#F6F7F9] border-[#343A43] cursor-pointer"
              onClick={() => navigate('/workout')}
            >
              Missed a workout or want to train today? Choose Workout
            </Button>
          </div>
        </Card>
      )}

      {/* 3. Quick Log Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weight Tile */}
        <button
          type="button"
          onClick={() => setWeightSheetOpen(true)}
          className="flex flex-col p-4 rounded-[20px] bg-[#171A1F] border border-[#2B3038] hover:border-[#347FEF]/40 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[11px] font-semibold text-[#A5ADB8] uppercase tracking-wider">
              Weight
            </span>
            <Scale className="w-4 h-4 text-[#347FEF]" />
          </div>

          <div className="text-lg font-bold text-[#F6F7F9] tabular-nums">
            {todayWeight ? `${todayWeight.weight_lb} lb` : 'Log Today'}
          </div>
          <span className="text-[10px] text-[#687383] mt-0.5">
            {todayWeight ? 'Recorded ✓' : 'Tap to log'}
          </span>
        </button>

        {/* Calories Tile */}
        <button
          type="button"
          onClick={() => setCalorieSheetOpen(true)}
          className="flex flex-col p-4 rounded-[20px] bg-[#171A1F] border border-[#2B3038] hover:border-[#FF7A2F]/40 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[11px] font-semibold text-[#A5ADB8] uppercase tracking-wider">
              Calories
            </span>
            <Flame className="w-4 h-4 text-[#FF7A2F]" />
          </div>

          <div className="text-lg font-bold text-[#F6F7F9] tabular-nums truncate">
            {todayCalories && todayCalories.calories_consumed !== null
              ? `${todayCalories.calories_consumed} kcal`
              : 'Log Intake'}
          </div>
          <span className="text-[10px] text-[#687383] mt-0.5">
            {todayCalories && todayCalories.calories_consumed !== null
              ? 'Recorded ✓'
              : 'Not logged'}
          </span>
        </button>
      </div>

      {/* 4. Weight Trend Mini-Chart (Real Data Only) */}
      <Card variant="raised" className="p-4 border border-[#2B3038]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#347FEF]" />
            <h3 className="text-xs font-bold text-[#F6F7F9] uppercase tracking-wider">
              Recent Weight Trend
            </h3>
          </div>
          <button
            onClick={() => navigate('/progress')}
            className="text-[11px] font-semibold text-[#347FEF] hover:underline cursor-pointer"
          >
            See all
          </button>
        </div>

        <WeightMiniChart logs={weightLogs} />
      </Card>

      {/* 5. Weekly Activity Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-[18px] bg-[#171A1F] border border-[#2B3038]">
          <span className="text-[10px] font-semibold text-[#A5ADB8] uppercase tracking-wider">
            Gym Sessions
          </span>
          <div className="text-xl font-bold text-[#F6F7F9] tabular-nums mt-1">
            {completedSessionsThisWeek} <span className="text-xs font-normal text-[#687383]">/ 4 days</span>
          </div>
        </div>

        <div className="p-3.5 rounded-[18px] bg-[#171A1F] border border-[#2B3038]">
          <span className="text-[10px] font-semibold text-[#A5ADB8] uppercase tracking-wider">
            Cardio Time
          </span>
          <div className="text-xl font-bold text-[#F6F7F9] tabular-nums mt-1">
            {Math.round(totalCardioMinutes)} <span className="text-xs font-normal text-[#687383]">mins</span>
          </div>
        </div>
      </div>

      {/* Sheets */}
      <WeightLogSheet
        isOpen={weightSheetOpen}
        onClose={() => setWeightSheetOpen(false)}
        initialDate={today}
      />
      <CalorieLogSheet
        isOpen={calorieSheetOpen}
        onClose={() => setCalorieSheetOpen(false)}
        initialDate={today}
      />
    </div>
  );
}
