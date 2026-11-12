import React, { useState, useEffect } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUpsertWeight, useWeightLogs } from './useWeightLogs';
import { useAuth } from '@/features/auth/AuthProvider';
import { getLocalDate } from '@/lib/dates';
import { useToast } from '@/components/ui/Toast';
import { useSync } from '@/features/sync/SyncProvider';
import { Scale, Check } from 'lucide-react';

interface WeightLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export function WeightLogSheet({ isOpen, onClose, initialDate }: WeightLogSheetProps) {
  const { profile } = useAuth();
  const timezone = profile?.timezone || 'America/New_York';
  const defaultDate = initialDate || getLocalDate(timezone);

  const [date, setDate] = useState<string>(defaultDate);
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { data: logs } = useWeightLogs();
  const upsertMutation = useUpsertWeight();
  const { showToast } = useToast();
  const { isOnline } = useSync();

  // If entry exists for selected date, pre-fill with it
  useEffect(() => {
    if (isOpen) {
      const targetDate = initialDate || getLocalDate(timezone);
      setDate(targetDate);

      const existing = logs?.find((l) => l.local_date === targetDate);
      if (existing) {
        setWeight(existing.weight_lb.toString());
        setNotes(existing.notes || '');
      } else {
        setWeight('');
        setNotes('');
      }
      setSaveStatus('idle');
    }
  }, [isOpen, initialDate, logs, timezone]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const existing = logs?.find((l) => l.local_date === newDate);
    if (existing) {
      setWeight(existing.weight_lb.toString());
      setNotes(existing.notes || '');
    } else {
      setWeight('');
      setNotes('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weight);

    if (isNaN(parsedWeight) || parsedWeight < 50 || parsedWeight > 800) {
      showToast({ type: 'error', message: 'Please enter a plausible weight (50–800 lb)' });
      return;
    }

    setSaveStatus('saving');
    try {
      await upsertMutation.mutateAsync({
        weight_lb: parsedWeight,
        local_date: date,
        notes: notes.trim() || undefined,
      });

      setSaveStatus('saved');
      showToast({
        type: 'success',
        message: isOnline
          ? `Weight ${parsedWeight.toFixed(1)} lb saved`
          : `Saved locally on iPhone (${parsedWeight.toFixed(1)} lb) · Sync pending`,
      });

      setTimeout(() => {
        onClose();
        setSaveStatus('idle');
      }, 600);
    } catch (err: any) {
      setSaveStatus('idle');
      showToast({ type: 'error', message: err.message || 'Failed to save weight' });
    }
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Log Body Weight">
      <form onSubmit={handleSave} className="flex flex-col gap-5 pt-2">
        <div className="flex items-center gap-3 p-3.5 bg-[#22262C] rounded-[18px] border border-[#343A43]">
          <div className="w-10 h-10 rounded-xl bg-[#347FEF]/15 flex items-center justify-center text-[#347FEF] shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#F6F7F9]">Daily Morning Weigh-In</h4>
            <p className="text-xs text-[#A5ADB8]">
              Weigh right after waking up for the most consistent trend.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          required
        />

        {/* Weight Numeric Input */}
        <div>
          <Input
            type="number"
            step="0.1"
            min="50"
            max="800"
            inputMode="decimal"
            label="Weight"
            placeholder="e.g. 239.6"
            suffix="lb"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            autoFocus
            required
            className="text-2xl font-bold tracking-tight h-14"
          />
          <p className="text-[11px] text-[#687383] mt-1.5 ml-1">
            Baseline: 240.0 lb · Target: 190.0 lb
          </p>
        </div>

        {/* Optional Notes */}
        <Input
          type="text"
          label="Note (optional)"
          placeholder="e.g. After rest day, well hydrated"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="mt-2 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
            disabled={saveStatus === 'saving'}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            size="lg"
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' && 'Saving…'}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
            {saveStatus === 'idle' && 'Save Weight'}
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
