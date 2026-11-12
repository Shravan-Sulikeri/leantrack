import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from './cn';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  asChild?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FF7A2F] text-white hover:bg-[#E86D28] active:bg-[#D0622E] disabled:bg-[#FF7A2F]/40',
  secondary:
    'bg-[#22262C] text-[#F6F7F9] hover:bg-[#2A2F36] active:bg-[#343A43] border border-[#343A43] disabled:opacity-40',
  ghost:
    'bg-transparent text-[#F6F7F9] hover:bg-[#22262C] active:bg-[#343A43] disabled:opacity-40',
  danger:
    'bg-[#EF7272] text-white hover:bg-[#D96464] active:bg-[#C45858] disabled:bg-[#EF7272]/40',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-[36px] min-h-[44px] px-3 text-sm',
  md: 'h-[44px] min-h-[44px] px-4 text-sm',
  lg: 'h-[56px] min-h-[44px] px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      asChild = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A2F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D10] disabled:pointer-events-none select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && (
          <Spinner size="sm" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
          {children}
        </span>
      </Comp>
    );
  },
);

Button.displayName = 'Button';
