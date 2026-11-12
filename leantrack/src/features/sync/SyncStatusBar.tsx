import React from 'react';
import { useSync } from './SyncProvider';
import { WifiOff, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/components/ui/cn';

export function SyncStatusBar() {
  const { isOnline, syncState, pendingCount, errorMessage, syncNow } = useSync();

  if (isOnline && syncState === 'idle' && pendingCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'w-full px-3 py-1.5 flex items-center justify-between text-xs font-medium transition-all select-none z-30',
        !isOnline && 'bg-[#292014] text-[#F0B35A] border-b border-[#4A381F]',
        isOnline && syncState === 'syncing' && 'bg-[#152338] text-[#347FEF] border-b border-[#1D3559]',
        isOnline && syncState === 'error' && 'bg-[#2C1818] text-[#EF7272] border-b border-[#4A2424]',
        isOnline && syncState === 'idle' && pendingCount > 0 && 'bg-[#22262C] text-[#A5ADB8] border-b border-[#343A43]'
      )}
    >
      <div className="flex items-center gap-1.5 truncate">
        {!isOnline && (
          <>
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Saved on this iPhone · Sync pending</span>
          </>
        )}
        {isOnline && syncState === 'syncing' && (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Syncing {pendingCount} item{pendingCount > 1 ? 's' : ''} to cloud…</span>
          </>
        )}
        {isOnline && syncState === 'error' && (
          <>
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{errorMessage || 'Cloud sync failed'}</span>
          </>
        )}
        {isOnline && syncState === 'idle' && pendingCount > 0 && (
          <>
            <span className="w-2 h-2 rounded-full bg-[#F0B35A]" />
            <span>{pendingCount} unsynced change{pendingCount > 1 ? 's' : ''}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {syncState === 'error' && (
          <button
            onClick={() => syncNow()}
            className="text-[11px] underline font-semibold text-[#EF7272] hover:text-white cursor-pointer"
          >
            Retry now
          </button>
        )}
        {isOnline && syncState === 'idle' && pendingCount > 0 && (
          <button
            onClick={() => syncNow()}
            className="text-[11px] text-[#FF7A2F] font-medium hover:underline cursor-pointer"
          >
            Sync
          </button>
        )}
      </div>
    </div>
  );
}
