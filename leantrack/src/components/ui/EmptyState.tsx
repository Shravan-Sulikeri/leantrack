import React from 'react';
import { cn } from './cn';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 rounded-[24px] bg-[#171A1F] border border-[#2B3038]',
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-[#22262C] flex items-center justify-center text-[#FF7A2F] mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#F6F7F9] mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-[#A5ADB8] max-w-[280px] leading-relaxed mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
