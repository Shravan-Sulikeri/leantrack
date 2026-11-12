import React, { useState } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { CachedSession, CachedSetLog, CachedCardioLog } from '@/db';
import { formatFullDate } from '@/lib/dates';
import { Dumbbell, Clock, Activity, Trash2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { localDb } from '@/db';
import { useSync } from '@/features/sync/SyncProvider';
import { useToast } from '@/components/ui/Toast';
import { v4 as uuidv4 } from 'uuid';

interface SessionDetailSheetProps {
  session: CachedSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SessionDetailSheet({ session, isOpen, onClose }: SessionDetailSheetProps) {
  const queryClient = useQueryClient();
  const { queueOperation } = useSync();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch logged sets for this session
  const { data: setLogs = [] } = useQuery({
    queryKey: ['session_detail_sets', session?.id],
    enabled: !!session?.id,
    queryFn: async () => {
      if (!session) return [];
      return await localDb.cachedSetLogs
        .filter((log) => log.session_exercise_id.startsWith(`${session.id}_`))
        .toArray();
    },
  });

  // Fetch logged cardio for this session
  const { data: cardioLog } = useQuery({
    queryKey: ['session_detail_cardio', session?.id],
    enabled: !!session?.id,
    queryFn: async () => {
      if (!session) return null;
      return (
        (await localDb.cachedCardioLogs
          .where('session_id')
          .equals(session.id)
          .first()) ?? null
      );
    },
  });

  if (!session) return null;

  const snapshot = session.template_snapshot || {};
  const exercises = snapshot.exercises || [];

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recorded session?')) return;

    setIsDeleting(true);
    try {
      await localDb.cachedSessions.delete(session.id);
      await queueOperation({
        operationId: uuidv4(),
        table: 'workout_sessions',
        recordId: session.id,
        operation: 'delete',
        payload: { id: session.id },
      });

      queryClient.invalidateQueries({ queryKey: ['history_sessions'] });
      queryClient.invalidateQueries({ queryKey: ['today_session'] });
      showToast({ type: 'success', message: 'Session deleted from history' });
      onClose();
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Could not delete session' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title={snapshot.templateName || 'Recorded Workout'}>
      <div className="flex flex-col gap-4 pt-2 pb-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Date and Duration Header */}
        <div className="flex items-center justify-between p-3.5 bg-[#22262C] rounded-2xl border border-[#343A43]">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#FF7A2F]" />
            <span className="text-xs font-semibold text-[#F6F7F9]">
              {formatFullDate(session.actual_date || session.scheduled_date)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#A5ADB8]">
            <Clock className="w-4 h-4" />
            <span className="font-semibold text-[#F6F7F9]">
              {session.duration_minutes ? `${session.duration_minutes} min` : 'In progress'}
            </span>
          </div>
        </div>

        {/* Exercises Snapshot & Logged Sets */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#A5ADB8] uppercase tracking-wider flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#FF7A2F]" /> Exercises & Sets
          </h4>

          {exercises.map((ex: any, idx: number) => {
            if (ex.exerciseId === 'ex-treadmill' || ex.exerciseId === 'ex-stationary-bike') {
              return null;
            }

            const prefix = `${session.id}_${ex.exerciseId}`;
            const exSets = setLogs
              .filter((l) => l.session_exercise_id === prefix)
              .sort((a, b) => a.set_index - b.set_index);

            return (
              <div
                key={idx}
                className="p-3 bg-[#171A1F] rounded-xl border border-[#2B3038] space-y-2"
              >
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-[#F6F7F9]">{ex.name}</span>
                  <span className="text-[11px] text-[#A5ADB8]">
                    {ex.targetSets} sets × {ex.targetReps}
                  </span>
                </div>

                {exSets.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#22262C]">
                    {exSets.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between px-2 py-1 bg-[#12151A] rounded-lg text-[11px]"
                      >
                        <span className="text-[#A5ADB8]">Set #{s.set_index}:</span>
                        <span className="font-bold text-[#F6F7F9]">
                          {s.weight_lb !== null
                            ? `${s.weight_lb} lb`
                            : s.load_mode === 'bodyweight'
                            ? 'BW'
                            : '—'}{' '}
                          × {s.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#687383] italic">No completed sets logged.</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Cardio Record */}
        {cardioLog && (
          <div className="p-3 bg-[#171A1F] rounded-xl border border-[#2B3038] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#347FEF]">
              <Activity className="w-4 h-4" />
              <span>Cardio ({cardioLog.equipment === 'treadmill' ? 'Treadmill Walk' : 'Stationary Bike'})</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="text-[#A5ADB8]">
                Duration: <b className="text-[#F6F7F9]">{cardioLog.duration_minutes} min</b>
              </div>
              {cardioLog.speed_mph && (
                <div className="text-[#A5ADB8]">
                  Speed: <b className="text-[#F6F7F9]">{cardioLog.speed_mph} mph</b>
                </div>
              )}
              {cardioLog.incline_pct !== null && cardioLog.incline_pct !== undefined && (
                <div className="text-[#A5ADB8]">
                  Incline: <b className="text-[#F6F7F9]">{cardioLog.incline_pct}%</b>
                </div>
              )}
              {cardioLog.machine_kcal_estimate && (
                <div className="text-[#A5ADB8]">
                  Estimate: <b className="text-[#F6F7F9]">{cardioLog.machine_kcal_estimate} kcal</b>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {session.notes && (
          <div className="p-3 bg-[#171A1F] rounded-xl border border-[#2B3038] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A5ADB8]">
              <FileText className="w-3.5 h-3.5" /> Notes
            </div>
            <p className="text-xs text-[#F6F7F9]">{session.notes}</p>
          </div>
        )}

        {/* Delete button */}
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            className="w-full"
            onClick={handleDelete}
            loading={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Session
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
