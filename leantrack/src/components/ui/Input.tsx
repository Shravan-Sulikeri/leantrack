import React, { forwardRef } from 'react';
import { cn } from './cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  prefix?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, suffix, prefix, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#A5ADB8]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3.5 text-sm text-[#A5ADB8] pointer-events-none select-none">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full min-h-[48px] px-3.5 py-2.5 rounded-[14px]',
              'bg-[#1E232B] text-[#F6F7F9] placeholder:text-[#687383]',
              'border border-[#343A43] focus:border-[#FF7A2F] focus:outline-none focus:ring-1 focus:ring-[#FF7A2F]',
              'text-base transition-colors duration-150',
              prefix && 'pl-9',
              suffix && 'pr-12',
              error && 'border-[#EF7272] focus:border-[#EF7272] focus:ring-[#EF7272]',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3.5 text-xs font-semibold text-[#A5ADB8] pointer-events-none select-none uppercase tracking-wider">
              {suffix}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-[#EF7272]">{error}</span>}
        {hint && !error && <span className="text-xs text-[#687383]">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
