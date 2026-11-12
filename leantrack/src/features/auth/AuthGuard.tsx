import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * Route guard that redirects unauthenticated users to /auth.
 * Shows nothing while the auth state is loading to prevent flash.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
