import React from 'react';
import { WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from './cn';

export type StatusBannerType = 'offline' | 'syncing' | 'error' | 'synced' | null;

export interface StatusBannerProps {
  status: StatusBannerType;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function StatusBanner({ status, message, onRetry, className }: StatusBannerProps) {
  if (!status || status === 'synced') return null;

  return (
    <div
      className={cn(
        'w-full px-4 py-2 flex items-center justify-between text-xs font-medium border-b transition-colors',
        status === 'offline' && 'bg-[#292014] text-[#F0B35A] border-[#4A381F]',
        status === 'syncing' && 'bg-[#152338] text-[#347FEF] border-[#1D3559]',
        status === 'error' && 'bg-[#2C1818] text-[#EF7272] border-[#4A2424]',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {status === 'offline' && <WifiOff className="w-3.5 h-3.5 shrink-0" />}
        {status === 'syncing' && <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />}
        {status === 'error' && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
        <span>
          {message ||
            (status === 'offline' && 'Offline · Saved locally on iPhone') ||
            (status === 'syncing' && 'Syncing changes to cloud…') ||
            (status === 'error' && 'Sync failed')}
        </span>
      </div>
      {status === 'error' && onRetry && (
        <button
          onClick={onRetry}
          className="underline font-semibold hover:text-white cursor-pointer ml-2"
        >
          Retry
        </button>
      )}
    </div>
  );
}
