import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  createContext,
  useContext,
} from 'react';
import { cn } from './cn';

/* ── Card variants ────────────────────────────────────────────────── */

type CardVariant = 'default' | 'raised' | 'orange' | 'blue';

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-[#171A1F] border-transparent',
  raised: 'bg-[#22262C] border-transparent',
  orange: 'bg-[#3B251D] border-[#FF7A2F]/30',
  blue: 'bg-[#172D50] border-[#347FEF]/30',
};

/* ── Card context (shares variant with children) ──────────────────── */

const CardContext = createContext<CardVariant>('default');

/* ── Card ─────────────────────────────────────────────────────────── */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, onClick, ...props }, ref) => {
    return (
      <CardContext.Provider value={variant}>
        <div
          ref={ref}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          onClick={onClick}
          onKeyDown={
            onClick
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                  }
                }
              : undefined
          }
          className={cn(
            'rounded-[24px] border p-4 transition-colors',
            variantStyles[variant],
            onClick && 'cursor-pointer hover:brightness-110 active:brightness-95',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </CardContext.Provider>
    );
  },
);

Card.displayName = 'Card';

/* ── CardHeader ───────────────────────────────────────────────────── */

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {children}
    </div>
  );
}

/* ── CardTitle ────────────────────────────────────────────────────── */

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  const variant = useContext(CardContext);
  return (
    <h3
      className={cn(
        'text-sm font-semibold',
        variant === 'orange'
          ? 'text-[#FF7A2F]'
          : variant === 'blue'
            ? 'text-[#347FEF]'
            : 'text-[#F6F7F9]',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

/* ── CardContent ──────────────────────────────────────────────────── */

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('mt-2', className)} {...props}>
      {children}
    </div>
  );
}
