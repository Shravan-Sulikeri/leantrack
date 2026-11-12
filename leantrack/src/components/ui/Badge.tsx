import { type ReactNode } from 'react';
import { cn } from './cn';

type BadgeVariant = 'default' | 'orange' | 'blue' | 'success' | 'warning';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#22262C] text-[#A5ADB8]',
  orange: 'bg-[#3B251D] text-[#FF7A2F]',
  blue: 'bg-[#172D50] text-[#347FEF]',
  success: 'bg-[#1A3329] text-[#50C48B]',
  warning: 'bg-[#3B3220] text-[#F0B35A]',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
