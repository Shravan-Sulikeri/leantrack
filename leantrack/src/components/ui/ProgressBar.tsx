import React from 'react';
import { cn } from './cn';

export interface ProgressBarProps {
  value: number; // 0 to 100
  color?: 'orange' | 'blue' | 'success';
  height?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  color = 'orange',
  height = 8,
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const colorMap = {
    orange: 'bg-[#FF7A2F]',
    blue: 'bg-[#347FEF]',
    success: 'bg-[#50C48B]',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs text-[#A5ADB8]">
          {label && <span>{label}</span>}
          {showLabel && <span className="font-semibold text-[#F6F7F9] tabular-nums">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        className="w-full bg-[#22262C] rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={cn('h-full transition-all duration-300 rounded-full', colorMap[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
