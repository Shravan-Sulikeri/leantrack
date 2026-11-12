import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, TrendingUp, Calendar, Settings2 } from 'lucide-react';
import { cn } from './ui/cn';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Today', icon: Home },
  { to: '/workout', label: 'Workout', icon: Dumbbell },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/history', label: 'History', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings2 },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#171A1F]/90 backdrop-blur-md border-t border-[#2B3038] max-w-md mx-auto"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      <div className="flex items-center justify-around h-14 px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-xl transition-all duration-150',
                isActive
                  ? 'text-[#FF7A2F]'
                  : 'text-[#A5ADB8] hover:text-[#F6F7F9]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('w-5 h-5 mb-0.5', isActive && 'stroke-[2.5px] scale-105')} />
                <span className={cn('text-[10px] font-medium tracking-tight', isActive && 'font-semibold')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
