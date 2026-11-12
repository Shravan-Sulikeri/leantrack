import React from 'react';
import { ExerciseData } from '@/data/exercises';
import { TemplateExerciseItem } from '@/data/workoutTemplates';
import { useExerciseProgression } from './useExerciseProgression';
import { Card } from '@/components/ui/Card';
import {
  Info,
  CheckCircle2,
  Trash2,
  Plus,
  Sparkles,
  Dumbbell,
  Clock,
  Layers,
} from 'lucide-react';
import { cn } from '@/components/ui/cn';

interface ExerciseCardProps {
  exerciseItem: TemplateExerciseItem;
  exerciseData: ExerciseData;
  sets: Array<{ weight: string; reps: number; completed: boolean; rpe: number | null }>;
  exerciseIndex: number;
  isSessionActive: boolean;
  currentSessionId: string | null;
  trainingWeek: number;
  onToggleComplete: (setIndex: number, restSeconds: number) => void;
  onUpdateWeight: (setIndex: number, val: string) => void;
  onUpdateReps: (setIndex: number, delta: number) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  onViewFormGuide: (exercise: ExerciseData) => void;
}

export function ExerciseCard({
  exerciseItem,
  exerciseData,
  sets,
  exerciseIndex,
  isSessionActive,
  currentSessionId,
  trainingWeek,
  onToggleComplete,
  onUpdateWeight,
  onUpdateReps,
  onAddSet,
  onRemoveSet,
  onViewFormGuide,
}: ExerciseCardProps) {
  const { data: progression } = useExerciseProgression(exerciseItem.exerciseId, currentSessionId);

  const category = exerciseData.category || 'Machine';
  const isDumbbell = category === 'Dumbbell' || exerciseData.loadMode === 'per_dumbbell';
  const isBodyweight = category === 'Bodyweight' || exerciseData.loadMode === 'bodyweight';
  const isTimeBased = exerciseItem.targetReps.includes('sec');

  // Category badge color styling
  const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
    Machine: { bg: 'bg-[#FF7A2F]/15', text: 'text-[#FF7A2F]', border: 'border-[#FF7A2F]/30' },
    Dumbbell: { bg: 'bg-[#347FEF]/15', text: 'text-[#347FEF]', border: 'border-[#347FEF]/30' },
    Cable: { bg: 'bg-[#9E77ED]/15', text: 'text-[#9E77ED]', border: 'border-[#9E77ED]/30' },
    Bodyweight: { bg: 'bg-[#50C48B]/15', text: 'text-[#50C48B]', border: 'border-[#50C48B]/30' },
    Cardio: { bg: 'bg-[#347FEF]/15', text: 'text-[#347FEF]', border: 'border-[#347FEF]/30' },
  };

  const currentCatStyle = categoryStyles[category] || categoryStyles.Machine!;

  // Handle applying suggested progressive overload weight
  const handleApplySuggestion = () => {
    if (progression?.suggestedWeight !== null && progression?.suggestedWeight !== undefined) {
      sets.forEach((_, idx) => {
        onUpdateWeight(idx, progression.suggestedWeight!.toString());
      });
    }
  };

  return (
    <Card variant="default" className="p-4 border border-[#2B3038] hover:border-[#3A414D] transition-all">
      {/* Exercise Card Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 mr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-5 h-5 rounded-full bg-[#22262C] text-[#FF7A2F] text-xs font-bold flex items-center justify-center shrink-0">
              {exerciseIndex + 1}
            </span>
            <h4 className="text-base font-bold text-[#F6F7F9] tracking-tight">
              {exerciseData.name}
            </h4>
            {/* Category Badge */}
            <span
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                currentCatStyle.bg,
                currentCatStyle.text,
                currentCatStyle.border
              )}
            >
              {category}
            </span>
          </div>

          {/* Subtitle / Equipment info */}
          <div className="flex items-center gap-2.5 mt-1 ml-7 flex-wrap">
            <span className="text-[11px] text-[#A5ADB8]">
              Target: <b className="text-[#F6F7F9]">{sets.length} sets × {exerciseItem.targetReps}</b>
            </span>

            {/* Sets counter & stepper */}
            <div className="flex items-center bg-[#111317] border border-[#343A43] rounded-lg px-1.5 py-0.5">
              <span className="text-[10px] text-[#A5ADB8] mr-1">Sets:</span>
              <button
                type="button"
                onClick={() => onRemoveSet(sets.length - 1)}
                disabled={sets.length <= 1}
                className="w-4 h-4 flex items-center justify-center text-xs text-[#A5ADB8] hover:text-[#F6F7F9] disabled:opacity-30 cursor-pointer"
                title="Remove set"
              >
                -
              </button>
              <span className="text-xs font-bold text-[#FF7A2F] px-1.5 tabular-nums">
                {sets.length}
              </span>
              <button
                type="button"
                onClick={onAddSet}
                className="w-4 h-4 flex items-center justify-center text-xs text-[#A5ADB8] hover:text-[#F6F7F9] cursor-pointer"
                title="Add set"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Info / Form Guide Button */}
        <button
          onClick={() => onViewFormGuide(exerciseData)}
          className="p-2 rounded-xl text-[#A5ADB8] hover:text-[#FF7A2F] hover:bg-[#22262C] transition-colors cursor-pointer shrink-0"
          title="View Form Guide & Setup"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Dumbbell Per-Dumbbell Clarification */}
      {isDumbbell && (
        <div className="ml-7 mb-2 flex items-center gap-1.5 text-[11px] text-[#347FEF] bg-[#172D50]/50 px-2.5 py-1 rounded-lg border border-[#347FEF]/30">
          <Dumbbell className="w-3.5 h-3.5 shrink-0" />
          <span><b>Logged weight is per dumbbell</b> (each hand, not combined)</span>
        </div>
      )}

      {/* Previous Session & Progressive Overload Suggestion Bar */}
      <div className="ml-7 mb-3 flex flex-wrap items-center gap-2 text-[11px]">
        {/* Previous session record */}
        <div className="text-[#A5ADB8] bg-[#1B1F26] px-2.5 py-1 rounded-lg border border-[#2B3038] flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#A5ADB8]" />
          <span>{progression?.previousSummary || 'First session'}</span>
        </div>

        {/* Suggestion Badge (Non-binding, requires user approval) */}
        {progression?.suggestionBadge && (
          <button
            type="button"
            onClick={handleApplySuggestion}
            className="text-[#50C48B] bg-[#14281E] hover:bg-[#1A3828] px-2.5 py-1 rounded-lg border border-[#50C48B]/40 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
            title={progression.suggestionReason || 'Tap to apply suggested progression'}
          >
            <Sparkles className="w-3 h-3 text-[#50C48B]" />
            <span>{progression.suggestionBadge}</span>
            <span className="text-[9px] text-[#50C48B]/70 underline ml-0.5">Apply</span>
          </button>
        )}

        {/* First test hint if no previous log */}
        {!progression?.lastWeight && exerciseData.firstTestRange && (
          <div className="text-[#F0B35A] bg-[#292014] px-2.5 py-1 rounded-lg border border-[#4A381F]">
            First-test load: {exerciseData.firstTestRange}
          </div>
        )}
      </div>

      {/* Week 3+ Volume Recommendation Banner */}
      {trainingWeek >= 3 && sets.length < 3 && !isBodyweight && (
        <div className="ml-7 mb-3 p-2 bg-[#1C1814] rounded-lg border border-[#FF7A2F]/30 flex items-center justify-between text-[11px]">
          <span className="text-[#FF7A2F] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Week 3+: Ready for 3 sets if well-recovered?
          </span>
          <button
            type="button"
            onClick={onAddSet}
            className="text-[10px] font-bold text-[#0B0D10] bg-[#FF7A2F] px-2 py-0.5 rounded-md hover:bg-[#E56A24] cursor-pointer"
          >
            + Set 3
          </button>
        </div>
      )}

      {/* Sets Rows */}
      <div className="flex flex-col gap-2 ml-1 mt-1">
        {sets.map((set, setIdx) => (
          <div
            key={setIdx}
            className={cn(
              'flex items-center justify-between p-2.5 rounded-xl border transition-all',
              set.completed
                ? 'bg-[#15241C] border-[#50C48B]/40 text-[#F6F7F9]'
                : 'bg-[#1A1E24] border-[#2B3038]'
            )}
          >
            {/* Left: Set number & weight input */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#A5ADB8] w-6 tabular-nums">
                #{setIdx + 1}
              </span>

              {/* Weight input or Bodyweight badge */}
              {!isBodyweight ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step={isDumbbell ? '2.5' : '5'}
                    placeholder={progression?.lastWeight ? `${progression.lastWeight}` : 'lbs'}
                    value={set.weight}
                    onChange={(e) => onUpdateWeight(setIdx, e.target.value)}
                    className="w-16 h-8 text-center text-sm font-bold bg-[#111317] border border-[#343A43] rounded-lg text-[#F6F7F9] focus:border-[#FF7A2F] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#687383]">
                    {isDumbbell ? 'lb/hand' : 'lb'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#50C48B] px-2 py-1 rounded bg-[#50C48B]/10 border border-[#50C48B]/20">
                    BW
                  </span>
                  <input
                    type="number"
                    placeholder="+0 lb"
                    value={set.weight === 'BW' ? '' : set.weight}
                    onChange={(e) => onUpdateWeight(setIdx, e.target.value)}
                    className="w-14 h-8 text-center text-xs font-medium bg-[#111317] border border-[#343A43] rounded-lg text-[#A5ADB8] focus:border-[#50C48B] focus:outline-none"
                    title="Optional added load (default 0)"
                  />
                </div>
              )}
            </div>

            {/* Right: Reps / Time stepper + Completed Check + Delete */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#111317] border border-[#343A43] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => onUpdateReps(setIdx, isTimeBased ? -5 : -1)}
                  className="px-2 py-1 text-xs text-[#A5ADB8] hover:text-[#F6F7F9] hover:bg-[#22262C] cursor-pointer"
                  title={isTimeBased ? '-5 sec' : '-1 rep'}
                >
                  -
                </button>
                <span className="px-2 text-xs font-bold tabular-nums text-[#F6F7F9] min-w-[32px] text-center">
                  {set.reps}{isTimeBased ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateReps(setIdx, isTimeBased ? 5 : 1)}
                  className="px-2 py-1 text-xs text-[#A5ADB8] hover:text-[#F6F7F9] hover:bg-[#22262C] cursor-pointer"
                  title={isTimeBased ? '+5 sec' : '+1 rep'}
                >
                  +
                </button>
              </div>

              {/* Completed checkmark button */}
              <button
                type="button"
                onClick={() => onToggleComplete(setIdx, exerciseItem.restSeconds)}
                className={cn(
                  'p-1.5 rounded-lg border transition-all cursor-pointer',
                  set.completed
                    ? 'bg-[#50C48B] text-[#0B0D10] border-[#50C48B]'
                    : 'bg-[#22262C] text-[#687383] border-[#343A43] hover:text-[#F6F7F9]'
                )}
                title={set.completed ? 'Mark incomplete' : 'Mark completed'}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>

              {/* Remove set button */}
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveSet(setIdx)}
                  className="p-1 text-[#687383] hover:text-[#EF7272] transition-colors cursor-pointer"
                  title="Delete set"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Set Button */}
        <button
          type="button"
          onClick={onAddSet}
          className="flex items-center justify-center gap-1.5 py-1.5 mt-1 rounded-xl text-xs font-medium text-[#A5ADB8] bg-[#171A1F] border border-dashed border-[#343A43] hover:text-[#FF7A2F] hover:border-[#FF7A2F]/50 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Set #{sets.length + 1}
        </button>
      </div>
    </Card>
  );
}
