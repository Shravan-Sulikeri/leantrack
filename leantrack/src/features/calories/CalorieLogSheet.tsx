import React, { useState, useEffect } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUpsertCalories, useCalorieLogs } from './useCalorieLogs';
import { useAuth } from '@/features/auth/AuthProvider';
import { getLocalDate } from '@/lib/dates';
import { useToast } from '@/components/ui/Toast';
import { Flame, Plus, Check } from 'lucide-react';
import { cn } from '@/components/ui/cn';

interface CalorieLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export function CalorieLogSheet({ isOpen, onClose, initialDate }: CalorieLogSheetProps) {
  const { profile } = useAuth();
  const timezone = profile?.timezone || 'America/New_York';
  const defaultDate = initialDate || getLocalDate(timezone);

  const [date, setDate] = useState<string>(defaultDate);
  const [tab, setTab] = useState<'set' | 'add'>('set');
  const [totalValue, setTotalValue] = useState<string>('');
  const [addValue, setAddValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { data: logs } = useCalorieLogs();
  const upsertMutation = useUpsertCalories();
  const { showToast } = useToast();

  const currentEntry = logs?.find((l) => l.local_date === date);
  const currentTotal = currentEntry?.calories_consumed ?? null;

  useEffect(() => {
    if (isOpen) {
      const targetDate = initialDate || getLocalDate(timezone);
      setDate(targetDate);
      const existing = logs?.find((l) => l.local_date === targetDate);
      if (existing && existing.calories_consumed !== null) {
        setTotalValue(existing.calories_consumed.toString());
        setNotes(existing.notes || '');
      } else {
        setTotalValue('');
        setNotes('');
      }
      setAddValue('');
      setSaveStatus('idle');
    }
  }, [isOpen, initialDate, logs, timezone]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const existing = logs?.find((l) => l.local_date === newDate);
    if (existing && existing.calories_consumed !== null) {
      setTotalValue(existing.calories_consumed.toString());
      setNotes(existing.notes || '');
    } else {
      setTotalValue('');
      setNotes('');
    }
    setAddValue('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'set') {
      const parsed = totalValue === '' ? null : parseInt(totalValue, 10);
      if (parsed !== null && (isNaN(parsed) || parsed < 0 || parsed > 15000)) {
        showToast({ type: 'error', message: 'Please enter a valid calorie total (0–15000 kcal)' });
        return;
      }

      setSaveStatus('saving');
      try {
        await upsertMutation.mutateAsync({
          local_date: date,
          calories_consumed: parsed,
          mode: 'set',
          notes: notes.trim() || undefined,
        });

        setSaveStatus('saved');
        showToast({
          type: 'success',
          message: parsed !== null ? `Daily calories set to ${parsed} kcal` : 'Calories cleared',
        });
        setTimeout(() => {
          onClose();
          setSaveStatus('idle');
        }, 500);
      } catch (err: any) {
        setSaveStatus('idle');
        showToast({ type: 'error', message: err.message || 'Failed to save calories' });
      }
    } else {
      const parsedAdd = parseInt(addValue, 10);
      if (isNaN(parsedAdd) || parsedAdd <= 0 || parsedAdd > 5000) {
        showToast({ type: 'error', message: 'Enter a valid amount to add (1–5000 kcal)' });
        return;
      }

      setSaveStatus('saving');
      try {
        await upsertMutation.mutateAsync({
          local_date: date,
          mode: 'add',
          amount_to_add: parsedAdd,
          notes: notes.trim() || undefined,
        });

        setSaveStatus('saved');
        const newTotal = (currentTotal ?? 0) + parsedAdd;
        showToast({
          type: 'success',
          message: `Added +${parsedAdd} kcal (New total: ${newTotal} kcal)`,
        });
        setTimeout(() => {
          onClose();
          setSaveStatus('idle');
        }, 500);
      } catch (err: any) {
        setSaveStatus('idle');
        showToast({ type: 'error', message: err.message || 'Failed to add calories' });
      }
    }
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Log Daily Calories">
      <form onSubmit={handleSave} className="flex flex-col gap-4 pt-2">
        {/* Current status banner */}
        <div className="flex items-center justify-between p-3.5 bg-[#22262C] rounded-[18px] border border-[#343A43]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A2F]/15 flex items-center justify-center text-[#FF7A2F] shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#A5ADB8]">Currently Logged Today</span>
              <p className="text-base font-bold text-[#F6F7F9] tabular-nums">
                {currentTotal !== null ? `${currentTotal} kcal` : 'Not logged'}
              </p>
            </div>
          </div>
          {profile?.daily_calorie_goal && (
            <div className="text-right">
              <span className="text-[10px] text-[#A5ADB8] uppercase tracking-wider">Goal</span>
              <p className="text-xs font-semibold text-[#A5ADB8] tabular-nums">
                {profile.daily_calorie_goal} kcal
              </p>
            </div>
          )}
        </div>

        {/* Date Selector */}
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          required
        />

        {/* Mode Selector Tabs */}
        <div className="flex bg-[#1E232B] p-1 rounded-[14px] border border-[#343A43]">
          <button
            type="button"
            onClick={() => setTab('set')}
            className={cn(
              'flex-1 py-2 text-xs font-semibold rounded-[10px] transition-all cursor-pointer',
              tab === 'set'
                ? 'bg-[#FF7A2F] text-[#0B0D10] shadow-sm'
                : 'text-[#A5ADB8] hover:text-[#F6F7F9]'
            )}
          >
            Set Daily Total
          </button>
          <button
            type="button"
            onClick={() => setTab('add')}
            className={cn(
              'flex-1 py-2 text-xs font-semibold rounded-[10px] transition-all cursor-pointer flex items-center justify-center gap-1',
              tab === 'add'
                ? 'bg-[#FF7A2F] text-[#0B0D10] shadow-sm'
                : 'text-[#A5ADB8] hover:text-[#F6F7F9]'
            )}
          >
            <Plus className="w-3.5 h-3.5" /> Add to Total
          </button>
        </div>

        {tab === 'set' ? (
          <div>
            <Input
              type="number"
              min="0"
              max="15000"
              inputMode="numeric"
              label="Total Calories Eaten Today"
              placeholder="e.g. 2150"
              suffix="kcal"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              autoFocus
              className="text-2xl font-bold tracking-tight h-14"
            />
            <p className="text-[11px] text-[#687383] mt-1.5 ml-1">
              Leave blank to keep unlogged. Missing entries show as "Not logged", not 0.
            </p>
          </div>
        ) : (
          <div>
            <Input
              type="number"
              min="1"
              max="5000"
              inputMode="numeric"
              label="Calories to Add"
              placeholder="e.g. 350"
              suffix="kcal"
              value={addValue}
              onChange={(e) => setAddValue(e.target.value)}
              autoFocus
              className="text-2xl font-bold tracking-tight h-14"
            />
            <p className="text-[11px] text-[#687383] mt-1.5 ml-1">
              Will be added to existing {currentTotal ?? 0} kcal.
            </p>
          </div>
        )}

        <Input
          type="text"
          label="Note (optional)"
          placeholder="e.g. High protein dinner, post-workout shake"
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
            {saveStatus === 'idle' && (tab === 'set' ? 'Save Total' : 'Add Calories')}
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
