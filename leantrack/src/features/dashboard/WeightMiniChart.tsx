import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { formatDisplayDate } from '@/lib/dates';
import { CachedWeightLog } from '@/db';

interface WeightMiniChartProps {
  logs: CachedWeightLog[];
}

export function WeightMiniChart({ logs }: WeightMiniChartProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="h-32 flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs text-[#A5ADB8]">No weigh-ins recorded yet.</p>
        <p className="text-[11px] text-[#687383] mt-0.5">
          Tap "Log Weight" above to record your first entry.
        </p>
      </div>
    );
  }

  // Take the most recent 7 entries, sorted ascending by date
  const chartData = [...logs]
    .sort((a, b) => a.local_date.localeCompare(b.local_date))
    .slice(-7)
    .map((log) => ({
      date: log.local_date,
      displayDate: formatDisplayDate(log.local_date),
      weight: log.weight_lb,
    }));

  const weights = chartData.map((d) => d.weight);
  const minWeight = Math.floor(Math.min(...weights) - 1);
  const maxWeight = Math.ceil(Math.max(...weights) + 1);

  return (
    <div className="w-full h-36 pt-2">
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
                  <div className="bg-[#171A1F] border border-[#343A43] px-2.5 py-1.5 rounded-lg shadow-lg text-xs">
                    <p className="text-[#A5ADB8]">{data.displayDate}</p>
                    <p className="font-bold text-[#347FEF] text-sm tabular-nums">
                      {data.weight} lb
                    </p>
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
            dot={{ fill: '#347FEF', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#F6F7F9', stroke: '#347FEF', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
