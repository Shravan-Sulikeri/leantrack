import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Bell, Plus } from 'lucide-react';
import { cn } from '@/components/ui/cn';

interface RestTimerProps {
  defaultSeconds?: number;
  onClose?: () => void;
}

export function RestTimer({ defaultSeconds = 75, onClose }: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((sec) => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      // Finished
      setIsActive(false);
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([200, 100, 200]);
        } catch {}
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const reset = (secs: number) => {
    setSecondsLeft(secs);
    setIsActive(true);
  };

  const addTime = (additionalSeconds: number) => {
    setSecondsLeft((sec) => sec + additionalSeconds);
    if (!isActive) setIsActive(true);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40 bg-[#171A1F] border border-[#FF7A2F]/50 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF7A2F]/15 flex items-center justify-center text-[#FF7A2F]">
            <Bell className={cn('w-5 h-5', isActive && 'animate-pulse')} />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#A5ADB8] uppercase tracking-wider">
              Rest Timer (60–90s target)
            </span>
            <div className="text-2xl font-black text-[#F6F7F9] tabular-nums">
              {formatTime(secondsLeft)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-2 rounded-xl bg-[#22262C] text-[#F6F7F9] hover:bg-[#2B3038] cursor-pointer"
            title={isActive ? 'Pause' : 'Play'}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => reset(defaultSeconds)}
            className="p-2 rounded-xl bg-[#22262C] text-[#A5ADB8] hover:text-[#F6F7F9] cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#687383] hover:text-[#F6F7F9] cursor-pointer ml-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick extension buttons for longer rest when needed */}
      <div className="flex items-center justify-between pt-1 border-t border-[#22262C] text-[11px]">
        <span className="text-[#687383]">Need more recovery?</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addTime(30)}
            className="px-2 py-0.5 rounded-lg bg-[#22262C] hover:bg-[#2B3038] text-[#FF7A2F] font-semibold cursor-pointer"
          >
            +30s
          </button>
          <button
            onClick={() => addTime(60)}
            className="px-2 py-0.5 rounded-lg bg-[#22262C] hover:bg-[#2B3038] text-[#FF7A2F] font-semibold cursor-pointer"
          >
            +60s
          </button>
        </div>
      </div>
    </div>
  );
}
