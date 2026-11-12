import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { useWeightLogs } from '@/features/weight/useWeightLogs';
import { useCalorieLogs } from '@/features/calories/useCalorieLogs';
import { calculateWeightProgress, calculate7DayAverage, calculateWeeklyChange } from '@/lib/calculations';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDisplayDate } from '@/lib/dates';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ReferenceLine,
} from 'recharts';
import {
  TrendingDown,
  Award,
  Calendar,
  Activity,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { cn } from '@/components/ui/cn';
import { useQuery } from '@tanstack/react-query';
import { localDb } from '@/db';

export function ProgressScreen() {
  const { profile } = useAuth();
  const [range, setRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [show7DayAvg, setShow7DayAvg] = useState(true);

  const { data: weightLogs = [] } = useWeightLogs();
  const { data: calorieLogs = [] } = useCalorieLogs();

  const { data: sessions = [] } = useQuery({
    queryKey: ['progress_sessions', profile?.user_id],
    queryFn: async () => {
      return await localDb.cachedSessions
        .where('user_id')
        .equals(profile?.user_id || 'local-athlete-uuid')
        .toArray();
    },
  });

  const { data: cardioLogs = [] } = useQuery({
    queryKey: ['progress_cardio', profile?.user_id],
    queryFn: async () => {
      return await localDb.cachedCardioLogs
        .where('user_id')
        .equals(profile?.user_id || 'local-athlete-uuid')
        .toArray();
    },
  });

  const startWeight = profile?.starting_weight ?? 240.0;
  const goalWeight = profile?.goal_weight ?? 190.0;
  const latestLog = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1] : null;
  const currentWeight = latestLog ? latestLog.weight_lb : startWeight;

  const { lost, remaining, percentComplete } = calculateWeightProgress(
    startWeight,
    currentWeight,
    goalWeight
  );

  const sevenDayAvg = calculate7DayAverage(
    weightLogs.map((w) => ({ date: w.local_date, weight: w.weight_lb }))
  );
  const weeklyChange = calculateWeeklyChange(
    weightLogs.map((w) => ({ date: w.local_date, weight: w.weight_lb }))
  );

  // Filter weight logs by selected range
  const filteredWeightLogs = [...weightLogs]
    .sort((a, b) => a.local_date.localeCompare(b.local_date))
    .filter((log) => {
      if (range === 'all') return true;
      const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      return log.local_date >= cutoffStr;
    });

  // Prepare chart data with optional rolling average
  const chartData = filteredWeightLogs.map((log, index) => {
    let movingAvg: number | null = null;
    if (show7DayAvg) {
      // Calculate average of up to 7 previous items in array
      const slice = filteredWeightLogs.slice(Math.max(0, index - 6), index + 1);
      const sum = slice.reduce((acc, curr) => acc + curr.weight_lb, 0);
      movingAvg = Math.round((sum / slice.length) * 10) / 10;
    }

    return {
      date: log.local_date,
      displayDate: formatDisplayDate(log.local_date),
      weight: log.weight_lb,
      movingAvg,
    };
  });

  const weights = filteredWeightLogs.map((d) => d.weight_lb);
  const minWeight = weights.length > 0 ? Math.floor(Math.min(...weights) - 2) : 185;
  const maxWeight = weights.length > 0 ? Math.ceil(Math.max(...weights) + 2) : 245;

  // Milestone list (230, 220, 210, 200, 190)
  const milestones = [
    { target: 230, label: 'First 10 lb lost', achieved: currentWeight <= 230 },
    { target: 220, label: '20 lb down milestone', achieved: currentWeight <= 220 },
    { target: 210, label: '30 lb milestone', achieved: currentWeight <= 210 },
    { target: 200, label: 'Under 200 lb club', achieved: currentWeight <= 200 },
    { target: 190, label: 'Final Goal Weight (50 lb)', achieved: currentWeight <= 190 },
  ];

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold text-[#347FEF] uppercase tracking-wider">
          Analytics & Recomposition
        </span>
        <h1 className="text-2xl font-black text-[#F6F7F9] tracking-tight">
          Your Progress
        </h1>
      </div>

      {/* Hero Stats Card */}
      <Card variant="raised" className="p-5 border border-[#2B3038] space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-[#A5ADB8]">Total Weight Loss</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-[#50C48B] tabular-nums">
                {lost > 0 ? `-${lost.toFixed(1)}` : '0.0'}
              </span>
              <span className="text-sm font-semibold text-[#A5ADB8]">lb lost</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#A5ADB8]">7-Day Rolling Avg</span>
            <div className="text-xl font-bold text-[#F6F7F9] tabular-nums mt-0.5">
              {sevenDayAvg ? `${sevenDayAvg.toFixed(1)} lb` : 'Need 2+ logs'}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#2B3038]">
          <div className="flex justify-between text-xs text-[#A5ADB8]">
            <span>Start: {startWeight} lb</span>
            <span className="font-semibold text-[#F6F7F9]">{percentComplete}% Done</span>
            <span>Target: {goalWeight} lb</span>
          </div>
          <ProgressBar value={percentComplete} color="orange" height={8} />
          <div className="text-[11px] text-[#687383] text-center pt-0.5">
            Sustainable pace: ~1–2 lb per week (~6–12 months total)
          </div>
        </div>
      </Card>

      {/* Weight Trend Chart */}
      <Card variant="default" className="p-4 border border-[#2B3038] space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#347FEF]" />
            <h3 className="text-xs font-bold text-[#F6F7F9] uppercase tracking-wider">
              Weight Trend
            </h3>
          </div>

          {/* Range tabs */}
          <div className="flex bg-[#1E232B] p-0.5 rounded-lg border border-[#343A43]">
            {(['7d', '30d', '90d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  'px-2 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer',
                  range === r ? 'bg-[#347FEF] text-white' : 'text-[#A5ADB8] hover:text-[#F6F7F9]'
                )}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Chart render or empty state */}
        {filteredWeightLogs.length === 0 ? (
          <EmptyState
            title="No Data in this Range"
            description="Log your daily morning weight to watch your trend line develop."
            className="py-8 bg-[#171A1F]"
          />
        ) : (
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="displayDate"
                  stroke="#687383"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[minWeight, maxWeight]}
                  stroke="#687383"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      return (
                        <div className="bg-[#171A1F] border border-[#343A43] px-3 py-2 rounded-xl shadow-lg text-xs">
                          <p className="text-[#A5ADB8]">{data.displayDate}</p>
                          <p className="font-bold text-[#347FEF] text-sm tabular-nums">
                            {data.weight} lb
                          </p>
                          {data.movingAvg && (
                            <p className="text-[#FF7A2F] text-[11px] mt-0.5">
                              7-day avg: {data.movingAvg} lb
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#347FEF"
                  strokeWidth={2.5}
                  dot={{ fill: '#347FEF', r: 3 }}
                  activeDot={{ r: 5, fill: '#F6F7F9' }}
                />
                {show7DayAvg && (
                  <Line
                    type="monotone"
                    dataKey="movingAvg"
                    stroke="#FF7A2F"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#A5ADB8] mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#347FEF]" /> Actual weigh-in
              </span>
              <button
                onClick={() => setShow7DayAvg(!show7DayAvg)}
                className="flex items-center gap-1.5 hover:text-[#F6F7F9] cursor-pointer"
              >
                <span className="w-3 h-0.5 bg-[#FF7A2F] border-b border-dashed border-[#FF7A2F]" />
                7-day average ({show7DayAvg ? 'on' : 'off'})
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Milestones Card */}
      <Card variant="raised" className="p-4 border border-[#2B3038] space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#F0B35A]" />
          <h3 className="text-xs font-bold text-[#F6F7F9] uppercase tracking-wider">
            Milestone Checklist
          </h3>
        </div>

        <div className="space-y-2">
          {milestones.map((m) => (
            <div
              key={m.target}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl border transition-all',
                m.achieved
                  ? 'bg-[#15241C] border-[#50C48B]/40 text-[#F6F7F9]'
                  : 'bg-[#171A1F] border-[#2B3038] text-[#A5ADB8]'
              )}
            >
              <div className="flex items-center gap-2.5">
                {m.achieved ? (
                  <CheckCircle2 className="w-5 h-5 text-[#50C48B] shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-[#687383] shrink-0 ml-0.5" />
                )}
                <div>
                  <span className={cn('text-sm font-bold', m.achieved && 'text-[#50C48B]')}>
                    {m.target} lb
                  </span>
                  <span className="text-xs text-[#A5ADB8] ml-2">{m.label}</span>
                </div>
              </div>

              <span className="text-[11px] font-semibold tabular-nums">
                {m.achieved ? 'Completed' : `${(currentWeight - m.target).toFixed(1)} lb left`}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Calorie Intake History Card */}
      <Card variant="default" className="p-4 border border-[#2B3038] space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#FF7A2F]" />
          <h3 className="text-xs font-bold text-[#F6F7F9] uppercase tracking-wider">
            Calorie Intake Logs
          </h3>
        </div>

        {calorieLogs.filter((c) => c.calories_consumed !== null).length === 0 ? (
          <p className="text-xs text-[#A5ADB8] py-4 text-center">
            No daily calories logged yet. Log intake from the Today tab.
          </p>
        ) : (
          <div className="h-36 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calorieLogs
                  .filter((c) => c.calories_consumed !== null)
                  .slice(-7)
                  .map((c) => ({
                    date: formatDisplayDate(c.local_date),
                    calories: c.calories_consumed,
                  }))}
                margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="date" stroke="#687383" fontSize={10} tickLine={false} />
                <YAxis stroke="#687383" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#171A1F] border border-[#343A43] px-2.5 py-1.5 rounded-lg text-xs">
                          <p className="font-bold text-[#FF7A2F]">
                            {payload[0]?.value} kcal
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="calories" fill="#FF7A2F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
