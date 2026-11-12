import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { useSync } from '@/features/sync/SyncProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { localDb } from '@/db';
import {
  Settings2,
  User,
  Scale,
  Calendar,
  Cloud,
  Download,
  Trash2,
  LogOut,
  RefreshCw,
  Check,
  ShieldAlert,
} from 'lucide-react';

export function SettingsScreen() {
  const { profile, updateProfile, signOut, user, isConfigured } = useAuth();
  const { syncState, pendingCount, lastSyncAt, syncNow, isOnline } = useSync();
  const { showToast } = useToast();

  const [startingWeight, setStartingWeight] = useState(
    profile?.starting_weight ? profile.starting_weight.toString() : '240.0'
  );
  const [goalWeight, setGoalWeight] = useState(
    profile?.goal_weight ? profile.goal_weight.toString() : '190.0'
  );
  const [calorieGoal, setCalorieGoal] = useState(
    profile?.daily_calorie_goal ? profile.daily_calorie_goal.toString() : ''
  );
  const [defaultSets, setDefaultSets] = useState<number>(
    profile?.default_sets_per_exercise || 2
  );
  const [timezone, setTimezone] = useState(profile?.timezone || 'America/New_York');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const sw = parseFloat(startingWeight) || 240;
    const gw = parseFloat(goalWeight) || 190;
    const cg = calorieGoal ? parseInt(calorieGoal, 10) : null;

    const { error } = await updateProfile({
      starting_weight: sw,
      goal_weight: gw,
      daily_calorie_goal: cg,
      default_sets_per_exercise: defaultSets,
      timezone,
    });

    setIsSaving(false);
    if (error) {
      showToast({ type: 'error', message: error.message });
    } else {
      showToast({ type: 'success', message: 'Settings saved successfully' });
    }
  };

  const exportData = async (format: 'json' | 'csv') => {
    try {
      const weights = await localDb.cachedWeightLogs.toArray();
      const calories = await localDb.cachedCalorieLogs.toArray();
      const sessions = await localDb.cachedSessions.toArray();
      const cardio = await localDb.cachedCardioLogs.toArray();

      if (format === 'json') {
        const payload = {
          exportDate: new Date().toISOString(),
          profile,
          weights,
          calories,
          sessions,
          cardio,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leantrack-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast({ type: 'success', message: 'Exported JSON data' });
      } else {
        // CSV export for weigh-ins
        let csvContent = 'Date,Weight_lb,Notes\n';
        weights.forEach((w) => {
          csvContent += `"${w.local_date}",${w.weight_lb},"${w.notes || ''}"\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leantrack-weights-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast({ type: 'success', message: 'Exported CSV data' });
      }
    } catch (e: any) {
      showToast({ type: 'error', message: 'Export failed: ' + e.message });
    }
  };

  const handleClearData = async () => {
    if (
      window.confirm(
        'WARNING: This will delete all local weight, workout, and calorie logs on this device. Proceed?'
      )
    ) {
      await localDb.cachedWeightLogs.clear();
      await localDb.cachedCalorieLogs.clear();
      await localDb.cachedSessions.clear();
      await localDb.cachedSetLogs.clear();
      await localDb.cachedCardioLogs.clear();
      await localDb.pendingOperations.clear();
      showToast({ type: 'success', message: 'Local data wiped successfully' });
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-28 px-4 pt-4 max-w-md mx-auto">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold text-[#A5ADB8] uppercase tracking-wider">
          Preferences & Account
        </span>
        <h1 className="text-2xl font-black text-[#F6F7F9] tracking-tight">
          Settings
        </h1>
      </div>

      {/* Profile & Target Goals */}
      <Card variant="raised" className="p-5 border border-[#2B3038] space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#FF7A2F]" />
          <h3 className="text-xs font-bold text-[#F6F7F9] uppercase tracking-wider">
            Recomposition Profile
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              step="0.1"
              label="Starting Weight"
              suffix="lb"
              value={startingWeight}
              onChange={(e) => setStartingWeight(e.target.value)}
            />
            <Input
              type="number"
              step="0.1"
              label="Goal Weight"
              suffix="lb"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
            />
          </div>

          <Input
            type="number"
            label="Optional Calorie Goal"
            placeholder="e.g. 2150"
            suffix="kcal"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            hint="No meal planning — target line only"
          />

          <div>
            <label className="text-xs font-medium text-[#A5ADB8] block mb-1.5">
              Default Sets per Exercise
            </label>
            <select
              value={defaultSets}
              onChange={(e) => setDefaultSets(parseInt(e.target.value, 10))}
              className="w-full min-h-[48px] px-3 py-2 rounded-[14px] bg-[#1E232B] text-[#F6F7F9] border border-[#343A43] text-sm focus:border-[#FF7A2F] focus:outline-none"
            >
              <option value="1">1 working set</option>
              <option value="2">2 working sets (Starter Recommended)</option>
              <option value="3">3 working sets (Progressed Volume)</option>
              <option value="4">4 working sets</option>
            </select>
            <span className="text-[11px] text-[#687383] mt-1 block">
              You can also add or remove sets on the fly for any exercise during your workout.
            </span>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A5ADB8] block mb-1.5">
              Local Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full min-h-[48px] px-3 py-2 rounded-[14px] bg-[#1E232B] text-[#F6F7F9] border border-[#343A43] text-sm focus:border-[#FF7A2F] focus:outline-none"
            >
              <option value="America/New_York">America/New_York (Eastern)</option>
              <option value="America/Chicago">America/Chicago (Central)</option>
              <option value="America/Denver">America/Denver (Mountain)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (Pacific)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <Button type="submit" size="md" className="w-full mt-2" loading={isSaving}>
            Save Preferences
          </Button>
        </form>
      </Card>

      {/* Cloud Sync Status */}
      <Card variant="default" className="p-5 border border-[#2B3038] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-[#347FEF]" />
            <h3 className="text-xs font-bold text-[#F6F7F9] uppercase tracking-wider">
              Cloud Sync & Storage
            </h3>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              isOnline ? 'bg-[#50C48B]/15 text-[#50C48B]' : 'bg-[#F0B35A]/15 text-[#F0B35A]'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="p-3 bg-[#171A1F] rounded-xl border border-[#2B3038] space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#A5ADB8]">Backend Config:</span>
            <span className="font-semibold text-[#F6F7F9]">
              {isConfigured ? 'Supabase Connected' : 'Local IndexedDB Active'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A5ADB8]">Pending offline writes:</span>
            <span className="font-semibold text-[#F6F7F9] tabular-nums">
              {pendingCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A5ADB8]">Last cloud sync:</span>
            <span className="text-[#A5ADB8]">
              {lastSyncAt ? lastSyncAt.toLocaleTimeString() : 'Not yet'}
            </span>
          </div>
        </div>

        {isConfigured && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => syncNow()}
            disabled={syncState === 'syncing'}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
            Sync Now
          </Button>
        )}
      </Card>

      {/* 4-Day Starter Split Preview */}
      <Card variant="raised" className="p-4 border border-[#2B3038] space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#50C48B]" />
          <h3 className="text-xs font-bold text-[#F6F7F9] uppercase tracking-wider">
            Active Weekly Routine
          </h3>
        </div>
        <div className="space-y-1.5 text-xs text-[#A5ADB8] pt-1">
          <div className="flex justify-between p-2 rounded-lg bg-[#171A1F]">
            <span className="font-semibold text-[#F6F7F9]">Thursday</span>
            <span className="text-[#FF7A2F]">Upper Body A</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-[#171A1F]">
            <span className="font-semibold text-[#F6F7F9]">Saturday</span>
            <span className="text-[#FF7A2F]">Lower Body A + Core</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-[#171A1F]">
            <span className="font-semibold text-[#F6F7F9]">Monday</span>
            <span className="text-[#FF7A2F]">Upper Body B</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-[#171A1F]">
            <span className="font-semibold text-[#F6F7F9]">Wednesday</span>
            <span className="text-[#FF7A2F]">Lower Body B + Core</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-[#171A1F]">
            <span className="font-semibold text-[#F6F7F9]">Tue / Fri / Sun</span>
            <span className="text-[#50C48B]">Recovery (Walk / Stretch)</span>
          </div>
        </div>
      </Card>

      {/* Data Export & Backup */}
      <Card variant="default" className="p-4 border border-[#2B3038] space-y-3">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-[#A5ADB8]" />
          <h3 className="text-xs font-bold text-[#F6F7F9] uppercase tracking-wider">
            Data Backup & Export
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={() => exportData('json')}>
            Export JSON
          </Button>
          <Button variant="secondary" size="sm" onClick={() => exportData('csv')}>
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Danger Zone & Sign Out */}
      <div className="flex flex-col gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={signOut} className="text-[#A5ADB8]">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClearData} className="text-[#EF7272]">
          <Trash2 className="w-4 h-4 mr-2" /> Wipe Local Cache
        </Button>
      </div>
    </div>
  );
}
