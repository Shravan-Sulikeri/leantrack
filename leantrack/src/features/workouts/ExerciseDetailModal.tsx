import React from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { ExerciseData } from '@/data/exercises';
import { AlertTriangle, CheckCircle2, Info, Wind, ShieldAlert, Sparkles } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: ExerciseData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, isOpen, onClose }: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title={exercise.name}>
      <div className="flex flex-col gap-5 pt-2 pb-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Equipment & Load Mode Tag */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#22262C] text-[#F6F7F9] border border-[#343A43]">
            {exercise.equipment}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#172D50] text-[#347FEF] border border-[#347FEF]/30">
            {exercise.loadMode.replace('_', ' ')}
          </span>
        </div>

        {/* Tentative First Test Notice */}
        <div className="p-3.5 rounded-2xl bg-[#292014] border border-[#4A381F] flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#F0B35A] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#F0B35A] uppercase tracking-wider">
              Tentative First-Test Suggestion: {exercise.firstTestRange}
            </h4>
            <p className="text-[11px] text-[#A5ADB8] mt-1 leading-relaxed">
              Body weight (240 lb) cannot predict machine leverage. Test an easy practice set first and adjust load so you finish with 2–3 clean reps in reserve.
            </p>
          </div>
        </div>

        {/* Setup */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-[#FF7A2F] uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Machine Setup
          </h4>
          <p className="text-xs text-[#F6F7F9] leading-relaxed bg-[#171A1F] p-3 rounded-xl border border-[#2B3038]">
            {exercise.setup}
          </p>
        </div>

        {/* How to Perform */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#50C48B] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Execution Steps
          </h4>
          <div className="text-xs text-[#F6F7F9] leading-relaxed whitespace-pre-line bg-[#171A1F] p-3 rounded-xl border border-[#2B3038]">
            {exercise.howToPerform}
          </div>
        </div>

        {/* Breathing */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-[#347FEF] uppercase tracking-wider flex items-center gap-1.5">
            <Wind className="w-4 h-4" /> Breathing Rhythm
          </h4>
          <p className="text-xs text-[#A5ADB8] leading-relaxed bg-[#171A1F] p-3 rounded-xl border border-[#2B3038]">
            {exercise.breathing}
          </p>
        </div>

        {/* Common Mistakes */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#EF7272] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Common Mistakes
            </h4>
            <ul className="space-y-1.5 bg-[#171A1F] p-3 rounded-xl border border-[#2B3038]">
              {exercise.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="text-xs text-[#A5ADB8] flex items-start gap-2">
                  <span className="text-[#EF7272] font-bold">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Flags */}
        {exercise.safetyFlags && exercise.safetyFlags.length > 0 && (
          <div className="p-3 rounded-xl bg-[#2C1818] border border-[#4A2424] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#EF7272] uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Safety Rules
            </div>
            {exercise.safetyFlags.map((flag, idx) => (
              <p key={idx} className="text-xs text-[#EF7272]/90">
                • {flag}
              </p>
            ))}
          </div>
        )}

        {/* Beginner Adjustments */}
        {exercise.beginnerAdjustments && (
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#A5ADB8] uppercase tracking-wider">
              Beginner Adaptation
            </h4>
            <p className="text-xs text-[#A5ADB8] leading-relaxed">
              {exercise.beginnerAdjustments}
            </p>
          </div>
        )}
      </div>
    </Sheet>
  );
}
