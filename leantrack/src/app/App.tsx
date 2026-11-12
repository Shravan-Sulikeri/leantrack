import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';
import { AuthScreen } from '@/features/auth/AuthScreen';
import { TodayScreen } from '@/features/dashboard/TodayScreen';
import { WorkoutScreen } from '@/features/workouts/WorkoutScreen';
import { ProgressScreen } from '@/features/progress/ProgressScreen';
import { HistoryScreen } from '@/features/history/HistoryScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { BottomNav } from '@/components/BottomNav';
import { SyncStatusBar } from '@/features/sync/SyncStatusBar';
import { InstallPrompt } from '@/components/InstallPrompt';
import { Spinner } from '@/components/ui/Spinner';

export function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D10] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <span className="text-xs text-[#A5ADB8] mt-3 font-medium">Loading LeanTrack…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F6F7F9] flex flex-col selection:bg-[#FF7A2F] selection:text-[#0B0D10]">
      {/* Top Fixed Sync Status */}
      <SyncStatusBar />

      {/* iOS Install Prompt */}
      <InstallPrompt />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto">
        <Routes>
          <Route path="/" element={<TodayScreen />} />
          <Route path="/workout" element={<WorkoutScreen />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
