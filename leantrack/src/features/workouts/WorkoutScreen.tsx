import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { getLocalDate, formatDisplayDate } from '@/lib/dates';
import { getScheduledWorkout, isRestDay } from '@/lib/schedule';
import { WORKOUT_TEMPLATES, getTemplateByCode } from '@/data/workoutTemplates';
import { exercises, ExerciseData } from '@/data/exercises';
import { getCurrentTreadmillWeek } from '@/data/treadmillProgression';
import { getGymTrainingWeek } from './useExerciseProgression';
import { useActiveWorkout, useWorkoutActions } from './useWorkoutSession';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { RestTimer } from './RestTimer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';
import { localDb } from '@/db';
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Clock,
  Activity,
  HeartPulse,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/components/ui/cn';

export function WorkoutScreen() {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const timezone = profile?.timezone || 'America/New_York';
  const today = getLocalDate(timezone);

  // Scheduled code for today or selected
  const defaultCode = getScheduledWorkout(today, timezone);
  const [selectedTemplateCode, setSelectedTemplateCode] = useState<string>(
    isRestDay(defaultCode) ? 'UPPER_A' : defaultCode
  );

  const { activeSession, isLoading } = useActiveWorkout(selectedTemplateCode, today);
  const { startWorkout, saveSetLog, deleteSetLog, loadSessionSets, finishWorkout } = useWorkoutActions();

  // Active workout state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Exercise sets state: exerciseId -> array of sets
  const [activeSets, setActiveSets] = useState<Record<string, Array<{ weight: string; reps: number; completed: boolean; rpe: number | null }>>>({});

  // Training week calculation (for Week 3+ progression recommendations)
  const trainingWeek = getGymTrainingWeek(profile?.schedule_start_date || '2026-11-12');

  // Cardio state (fixed 15 minutes across all 8 weeks)
  const treadmillProg = getCurrentTreadmillWeek(profile?.schedule_start_date || '2026-11-12', today);
  const [cardioDuration, setCardioDuration] = useState<string>(treadmillProg.durationMin.toString());
  const [cardioIncline, setCardioIncline] = useState<string>(treadmillProg.inclineMin.toString());
  const [cardioSpeed, setCardioSpeed] = useState<string>('2.2');
  const [cardioKcal, setCardioKcal] = useState<string>('');
  const [kneeComfort, setKneeComfort] = useState<string>('comfortable');
  const [cardioEquipment, setCardioEquipment] = useState<'treadmill' | 'stationary_bike'>('treadmill');

  // Modal & rest timer
  const [selectedExercise, setSelectedExercise] = useState<ExerciseData | null>(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(75);

  const template = getTemplateByCode(selectedTemplateCode) || WORKOUT_TEMPLATES['UPPER_A']!;

  // 1. Resume active session if exists in DB and restore logged sets
  useEffect(() => {
    let isCancelled = false;

    async function restoreSession() {
      if (activeSession && activeSession.status === 'in_progress') {
        setIsSessionActive(true);
        setCurrentSessionId(activeSession.id);

        if (activeSession.started_at) {
          const startMs = new Date(activeSession.started_at).getTime();
          const diffSecs = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
          setElapsedSeconds(diffSecs);
        }

        // Load persisted set logs from Dexie
        const persistedLogs = await loadSessionSets(activeSession.id);
        if (isCancelled) return;

        if (persistedLogs && persistedLogs.length > 0) {
          const restored: Record<string, any[]> = {};
          for (const te of template.exercises) {
            if (te.exerciseId !== 'ex-treadmill' && te.exerciseId !== 'ex-stationary-bike') {
              const prefix = `${activeSession.id}_${te.exerciseId}`;
              const exLogs = persistedLogs
                .filter((l) => l.session_exercise_id === prefix)
                .sort((a, b) => a.set_index - b.set_index);

              if (exLogs.length > 0) {
                restored[te.exerciseId] = exLogs.map((l) => ({
                  weight: l.weight_lb !== null && l.weight_lb !== undefined ? l.weight_lb.toString() : (l.load_mode === 'bodyweight' ? 'BW' : ''),
                  reps: l.reps,
                  completed: l.completed_at !== null,
                  rpe: l.rpe ?? null,
                }));
              }
            }
          }

          if (Object.keys(restored).length > 0) {
            setActiveSets((prev) => ({ ...prev, ...restored }));
          }
        }
      }
    }

    restoreSession();
    return () => {
      isCancelled = true;
    };
  }, [activeSession, template]);

  // 2. Session elapsed timer ticker
  useEffect(() => {
    if (isSessionActive) {
      const interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSessionActive]);

  // 3. Initialize exercise sets with last session's prefilled weights when not yet populated
  useEffect(() => {
    let isCancelled = false;

    async function initializeSets() {
      if (isSessionActive && currentSessionId) return; // Managed by session restoration

      const initial: Record<string, any[]> = {};
      const defaultUserSets = profile?.default_sets_per_exercise || 2;

      // Find past completed sessions for weight prefilling
      const completedSessions = await localDb.cachedSessions
        .where('status')
        .equals('completed')
        .toArray();

      for (const te of template.exercises) {
        if (te.exerciseId !== 'ex-treadmill' && te.exerciseId !== 'ex-stationary-bike') {
          const ex = exercises.find((e) => e.id === te.exerciseId);
          const targetRepsNum = te.targetRepsNum || 12;
          const setCounts = profile?.default_sets_per_exercise ? defaultUserSets : te.targetSets;

          // Attempt to prefill suggested weight from last completed session
          let prefillWeight = ex?.loadMode === 'bodyweight' ? 'BW' : '';

          if (ex?.loadMode !== 'bodyweight' && completedSessions.length > 0) {
            // Find most recent completed session with this exercise
            for (const s of completedSessions.reverse()) {
              const prevSets = await localDb.cachedSetLogs
                .where('session_exercise_id')
                .equals(`${s.id}_${te.exerciseId}`)
                .toArray();
              const validPrev = prevSets.find((p) => p.weight_lb !== null && p.weight_lb > 0);
              if (validPrev && validPrev.weight_lb) {
                prefillWeight = validPrev.weight_lb.toString();
                break;
              }
            }
          }

          initial[te.exerciseId] = Array.from({ length: setCounts }, () => ({
            weight: prefillWeight,
            reps: targetRepsNum,
            completed: false,
            rpe: null,
          }));
        }
      }

      if (!isCancelled) {
        setActiveSets(initial);
      }
    }

    initializeSets();
    return () => {
      isCancelled = true;
    };
  }, [selectedTemplateCode, template, isSessionActive, currentSessionId, profile?.default_sets_per_exercise]);

  // Start workout session
  const handleStartWorkout = async () => {
    try {
      const session = await startWorkout(selectedTemplateCode, today);
      setCurrentSessionId(session.id);
      setIsSessionActive(true);
      setElapsedSeconds(0);

      // Persist whatever sets are currently initialized into DB
      for (const [exerciseId, sets] of Object.entries(activeSets)) {
        const ex = exercises.find((e) => e.id === exerciseId);
        for (let i = 0; i < sets.length; i++) {
          const s = sets[i]!;
          const parsedWeight = parseFloat(s.weight);
          await saveSetLog({
            sessionId: session.id,
            exerciseId,
            setIndex: i + 1,
            weightLb: isNaN(parsedWeight) ? null : parsedWeight,
            reps: s.reps,
            completed: s.completed,
            loadMode: ex?.loadMode || 'stack_display',
            rpe: s.rpe,
          });
        }
      }

      showToast({ type: 'success', message: `Started ${template.name}` });
    } catch (e: any) {
      showToast({ type: 'error', message: e.message || 'Could not start workout' });
    }
  };

  // Toggle set complete (saves immediately to Dexie)
  const toggleSetComplete = async (exerciseId: string, setIndex: number, restSecs: number) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    let newCompletedState = false;

    setActiveSets((prev) => {
      const exSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      if (!exSets[setIndex]) return prev;

      newCompletedState = !exSets[setIndex].completed;
      exSets[setIndex] = {
        ...exSets[setIndex],
        completed: newCompletedState,
      };

      return {
        ...prev,
        [exerciseId]: exSets,
      };
    });

    // Auto-open rest timer when checking set
    if (newCompletedState) {
      setRestDuration(restSecs || 75);
      setShowRestTimer(true);
    }

    // Persist immediately
    if (currentSessionId) {
      const set = activeSets[exerciseId]?.[setIndex];
      const parsedWeight = parseFloat(set?.weight || '');
      await saveSetLog({
        sessionId: currentSessionId,
        exerciseId,
        setIndex: setIndex + 1,
        weightLb: isNaN(parsedWeight) ? null : parsedWeight,
        reps: set?.reps || 12,
        completed: newCompletedState,
        loadMode: ex?.loadMode || 'stack_display',
        rpe: set?.rpe,
      });
    }
  };

  // Update set weight (persists immediately)
  const updateSetWeight = async (exerciseId: string, setIndex: number, val: string) => {
    const ex = exercises.find((e) => e.id === exerciseId);

    setActiveSets((prev) => {
      const exSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      if (!exSets[setIndex]) return prev;
      exSets[setIndex] = { ...exSets[setIndex], weight: val };
      return { ...prev, [exerciseId]: exSets };
    });

    if (currentSessionId) {
      const parsedWeight = parseFloat(val);
      const set = activeSets[exerciseId]?.[setIndex];
      await saveSetLog({
        sessionId: currentSessionId,
        exerciseId,
        setIndex: setIndex + 1,
        weightLb: isNaN(parsedWeight) ? null : parsedWeight,
        reps: set?.reps || 12,
        completed: set?.completed || false,
        loadMode: ex?.loadMode || 'stack_display',
        rpe: set?.rpe,
      });
    }
  };

  // Update set reps (persists immediately)
  const updateSetReps = async (exerciseId: string, setIndex: number, delta: number) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    let newReps = 12;

    setActiveSets((prev) => {
      const exSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      if (!exSets[setIndex]) return prev;
      newReps = Math.max(1, exSets[setIndex].reps + delta);
      exSets[setIndex] = { ...exSets[setIndex], reps: newReps };
      return { ...prev, [exerciseId]: exSets };
    });

    if (currentSessionId) {
      const set = activeSets[exerciseId]?.[setIndex];
      const parsedWeight = parseFloat(set?.weight || '');
      await saveSetLog({
        sessionId: currentSessionId,
        exerciseId,
        setIndex: setIndex + 1,
        weightLb: isNaN(parsedWeight) ? null : parsedWeight,
        reps: newReps,
        completed: set?.completed || false,
        loadMode: ex?.loadMode || 'stack_display',
        rpe: set?.rpe,
      });
    }
  };

  // Add set (persists immediately)
  const addSet = async (exerciseId: string) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    let newIndex = 1;

    setActiveSets((prev) => {
      const exSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      const lastSet = exSets[exSets.length - 1];
      newIndex = exSets.length + 1;
      exSets.push({
        weight: lastSet?.weight || (ex?.loadMode === 'bodyweight' ? 'BW' : ''),
        reps: lastSet?.reps || 12,
        completed: false,
        rpe: null,
      });
      return { ...prev, [exerciseId]: exSets };
    });

    if (currentSessionId) {
      const lastSet = activeSets[exerciseId]?.[activeSets[exerciseId].length - 1];
      const parsedWeight = parseFloat(lastSet?.weight || '');
      await saveSetLog({
        sessionId: currentSessionId,
        exerciseId,
        setIndex: newIndex,
        weightLb: isNaN(parsedWeight) ? null : parsedWeight,
        reps: lastSet?.reps || 12,
        completed: false,
        loadMode: ex?.loadMode || 'stack_display',
      });
    }
  };

  // Remove set (persists immediately)
  const removeSet = async (exerciseId: string, setIndex: number) => {
    setActiveSets((prev) => {
      const exSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      if (exSets.length <= 1) return prev;
      exSets.splice(setIndex, 1);
      return { ...prev, [exerciseId]: exSets };
    });

    if (currentSessionId) {
      await deleteSetLog(currentSessionId, exerciseId, setIndex + 1);
    }
  };

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Calculate session completion metrics
  const resistanceExercises = template.exercises.filter(
    (te) => te.exerciseId !== 'ex-treadmill' && te.exerciseId !== 'ex-stationary-bike'
  );
  const totalResistanceExercises = resistanceExercises.length;

  let completedExercisesCount = 0;
  let totalSetsCount = 0;
  let completedSetsCount = 0;

  for (const te of resistanceExercises) {
    const sets = activeSets[te.exerciseId] || [];
    totalSetsCount += sets.length;
    const completedSets = sets.filter((s) => s.completed).length;
    completedSetsCount += completedSets;
    if (sets.length > 0 && completedSets === sets.length) {
      completedExercisesCount += 1;
    }
  }

  const strengthPct = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 80) : 0;
  const cardioDone = (parseFloat(cardioDuration) || 0) >= 15;
  const overallProgressPct = Math.min(100, strengthPct + (cardioDone ? 20 : 0));

  // Finish Workout
  const handleFinish = async () => {
    if (!currentSessionId) return;

    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const cardioMins = parseFloat(cardioDuration) || 0;

    await finishWorkout({
      sessionId: currentSessionId,
      durationMinutes,
      cardioData: {
        equipment: cardioEquipment,
        duration_minutes: cardioMins,
        speed_mph: parseFloat(cardioSpeed) || undefined,
        incline_pct: parseFloat(cardioIncline) || undefined,
        machine_kcal_estimate: parseInt(cardioKcal, 10) || undefined,
        knee_comfort: kneeComfort,
      },
    });

    setIsSessionActive(false);
    setCurrentSessionId(null);
    setShowRestTimer(false);
    showToast({
      type: 'success',
      message: `Workout complete! Logged ${durationMinutes} min session.`,
    });
  };

  return (
    <div className="flex flex-col gap-5 pb-28 px-4 pt-4 max-w-md mx-auto">
      {/* Top Template Selector Tabs (if session not locked) */}
      {!isSessionActive && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
          {(['UPPER_A', 'LOWER_A', 'UPPER_B', 'LOWER_B'] as const).map((code) => {
            const t = WORKOUT_TEMPLATES[code];
            const isToday = getScheduledWorkout(today, timezone) === code;
            const isSelected = selectedTemplateCode === code;

            return (
              <button
                key={code}
                onClick={() => setSelectedTemplateCode(code)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5',
                  isSelected
                    ? 'bg-[#FF7A2F] text-[#0B0D10]'
                    : 'bg-[#171A1F] text-[#A5ADB8] border border-[#2B3038] hover:text-[#F6F7F9]'
                )}
              >
                <span>{t?.name ?? code}</span>
                {isToday && (
                  <span className={cn('text-[9px] px-1 py-0.2 rounded font-bold uppercase', isSelected ? 'bg-[#0B0D10] text-[#FF7A2F]' : 'bg-[#FF7A2F]/20 text-[#FF7A2F]')}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Routine Header Card */}
      <Card
        variant="raised"
        className={cn(
          'p-5 border transition-all relative overflow-hidden',
          isSessionActive ? 'border-[#FF7A2F] bg-[#1A1613]' : 'border-[#2B3038]'
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[11px] font-bold text-[#FF7A2F] uppercase tracking-wider">
              {template.dayName} Workout
            </span>
            <h1 className="text-2xl font-black text-[#F6F7F9] tracking-tight">
              {template.name}
            </h1>
          </div>

          {isSessionActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF7A2F]/20 border border-[#FF7A2F]/40 text-[#FF7A2F]">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-sm font-bold tabular-nums">
                {formatElapsed(elapsedSeconds)}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-[#A5ADB8] mb-4">{template.focus || template.description}</p>

        {/* 1. Workout Duration Breakdown (60 min strength + 15 min cardio = 75 min total) */}
        <div className="p-3.5 bg-[#12151A] rounded-xl border border-[#2B3038] space-y-2.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#F6F7F9]">Planned Session Breakdown</span>
            <span className="font-extrabold text-[#FF7A2F]">75 min total</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-[#1B1F26] border border-[#2B3038] flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#FF7A2F] shrink-0" />
              <div>
                <div className="font-bold text-[#F6F7F9]">60 min Strength</div>
                <div className="text-[10px] text-[#A5ADB8]">Machines & Weights</div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#1B1F26] border border-[#2B3038] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#347FEF] shrink-0" />
              <div>
                <div className="font-bold text-[#F6F7F9]">15 min Cardio</div>
                <div className="text-[10px] text-[#A5ADB8]">Treadmill / Bike</div>
              </div>
            </div>
          </div>

          {/* Session Progress Bar & Metrics */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px] text-[#A5ADB8]">
              <span>
                Strength: <b className="text-[#F6F7F9]">{completedExercisesCount}/{totalResistanceExercises} ex</b> ({completedSetsCount}/{totalSetsCount} sets)
              </span>
              <span className="font-bold text-[#50C48B]">{overallProgressPct}%</span>
            </div>
            <ProgressBar value={overallProgressPct} color="orange" height={6} />
          </div>

          <p className="text-[10px] text-[#687383] leading-tight">
            The 60-minute strength block includes warm-up, working sets, rest periods, and equipment transitions. Do not feel required to keep lifting simply to fill the entire hour.
          </p>
        </div>

        {!isSessionActive ? (
          <Button
            size="lg"
            className="w-full text-base font-bold shadow-lg cursor-pointer"
            onClick={handleStartWorkout}
          >
            <Play className="w-5 h-5 fill-current mr-2" /> Start Workout
          </Button>
        ) : (
          <Button
            size="lg"
            variant="primary"
            className="w-full text-base font-bold bg-[#50C48B] hover:bg-[#43a675] text-[#0B0D10] cursor-pointer"
            onClick={handleFinish}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" /> Finish Workout
          </Button>
        )}
      </Card>

      {/* Resistance Exercises List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#A5ADB8] uppercase tracking-wider flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#FF7A2F]" /> Resistance Exercises ({resistanceExercises.length})
          </h3>
          <span className="text-[11px] text-[#687383]">
            {completedSetsCount} of {totalSetsCount} sets completed
          </span>
        </div>

        {template.exercises.map((te, exIdx) => {
          if (te.exerciseId === 'ex-treadmill' || te.exerciseId === 'ex-stationary-bike') {
            return null; // Rendered in cardio section below
          }

          const ex = exercises.find((e) => e.id === te.exerciseId);
          if (!ex) return null;
          const sets = activeSets[te.exerciseId] || [];

          return (
            <ExerciseCard
              key={te.exerciseId}
              exerciseItem={te}
              exerciseData={ex}
              sets={sets}
              exerciseIndex={exIdx}
              isSessionActive={isSessionActive}
              currentSessionId={currentSessionId}
              trainingWeek={trainingWeek}
              onToggleComplete={(setIdx, restSecs) => toggleSetComplete(te.exerciseId, setIdx, restSecs)}
              onUpdateWeight={(setIdx, val) => updateSetWeight(te.exerciseId, setIdx, val)}
              onUpdateReps={(setIdx, delta) => updateSetReps(te.exerciseId, setIdx, delta)}
              onAddSet={() => addSet(te.exerciseId)}
              onRemoveSet={(setIdx) => removeSet(te.exerciseId, setIdx)}
              onViewFormGuide={(selected) => setSelectedExercise(selected)}
            />
          );
        })}
      </div>

      {/* Cardio Section (Fixed 15 Minutes Post-Lifting) */}
      <Card variant="raised" className="p-5 border border-[#2B3038] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#347FEF]" />
            <div>
              <h3 className="text-sm font-bold text-[#F6F7F9] uppercase tracking-wider">
                15-Min Post-Lifting Cardio
              </h3>
              <span className="text-[11px] text-[#A5ADB8]">
                Fixed 15-minute duration · Week {treadmillProg.week} of 8
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#347FEF] bg-[#172D50] px-2.5 py-1 rounded-full border border-[#347FEF]/30">
            {treadmillProg.intensityLabel.split('(')[0]?.trim()}
          </span>
        </div>

        {/* 8-Week Progression Target Banner */}
        <div className="p-3 bg-[#111620] rounded-xl border border-[#347FEF]/30 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#347FEF] font-bold">Week {treadmillProg.week} Suggested Intensity:</span>
            <span className="text-[#F6F7F9] font-extrabold">{treadmillProg.inclineMin}–{treadmillProg.inclineMax}% Incline · {treadmillProg.suggestedSpeed}</span>
          </div>
          <p className="text-[11px] text-[#A5ADB8] leading-tight">
            {treadmillProg.focus}
          </p>
        </div>

        {/* Equipment Selector (Treadmill vs Bike) */}
        <div className="flex bg-[#1E232B] p-1 rounded-[14px] border border-[#343A43]">
          <button
            type="button"
            onClick={() => setCardioEquipment('treadmill')}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-[10px] transition-all cursor-pointer',
              cardioEquipment === 'treadmill'
                ? 'bg-[#347FEF] text-white shadow-sm'
                : 'text-[#A5ADB8] hover:text-[#F6F7F9]'
            )}
          >
            Treadmill Walk
          </button>
          <button
            type="button"
            onClick={() => setCardioEquipment('stationary_bike')}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-[10px] transition-all cursor-pointer',
              cardioEquipment === 'stationary_bike'
                ? 'bg-[#347FEF] text-white shadow-sm'
                : 'text-[#A5ADB8] hover:text-[#F6F7F9]'
            )}
          >
            Stationary Bike
          </button>
        </div>

        {/* Knee Friendly Safety Reminder */}
        <div className="p-3 bg-[#172D50]/40 rounded-xl border border-[#347FEF]/30 flex items-start gap-2.5">
          <HeartPulse className="w-4 h-4 text-[#347FEF] shrink-0 mt-0.5" />
          <p className="text-xs text-[#A5ADB8] leading-relaxed">
            {treadmillProg.kneeSafetyNote}
          </p>
        </div>

        {/* Numeric inputs row */}
        <div className="grid grid-cols-3 gap-2.5">
          <Input
            type="number"
            label="Duration"
            suffix="min"
            value={cardioDuration}
            onChange={(e) => setCardioDuration(e.target.value)}
          />
          <Input
            type="number"
            label="Incline"
            suffix="%"
            step="0.5"
            value={cardioIncline}
            onChange={(e) => setCardioIncline(e.target.value)}
          />
          <Input
            type="number"
            label="Speed"
            suffix="mph"
            step="0.1"
            value={cardioSpeed}
            onChange={(e) => setCardioSpeed(e.target.value)}
          />
        </div>

        {/* Machine Kcal & Knee Comfort */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <Input
              type="number"
              label="Machine Calories"
              placeholder="e.g. 95"
              suffix="kcal"
              value={cardioKcal}
              onChange={(e) => setCardioKcal(e.target.value)}
            />
            <span className="text-[9px] text-[#687383] block mt-1 ml-0.5">
              Machine estimate only — not treated as exact.
            </span>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A5ADB8] block mb-1.5">
              Knee Comfort
            </label>
            <select
              value={kneeComfort}
              onChange={(e) => setKneeComfort(e.target.value)}
              className="w-full min-h-[48px] px-3 py-2 rounded-[14px] bg-[#1E232B] text-[#F6F7F9] border border-[#343A43] text-xs focus:border-[#347FEF] focus:outline-none cursor-pointer"
            >
              <option value="great">Great — No soreness</option>
              <option value="comfortable">Comfortable</option>
              <option value="mild_tightness">Mild tightness</option>
              <option value="pain_stopped">Joint discomfort (stopped)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Floating Rest Timer */}
      {showRestTimer && (
        <RestTimer
          defaultSeconds={restDuration}
          onClose={() => setShowRestTimer(false)}
        />
      )}

      {/* Exercise Detail Sheet */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={selectedExercise !== null}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}
