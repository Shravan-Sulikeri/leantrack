import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  message: string;
}

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

export interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 3500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = 'default') => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const variant = options.type || 'default';
    toast(options.message, variant as ToastVariant);
  }, [toast]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      <div className="fixed top-4 left-4 right-4 z-50 flex flex-col items-center gap-2 pointer-events-none max-w-md mx-auto">
        {toasts.map((t) => (
          <ToastItemComponent key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItemComponent({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  const variantStyles: Record<ToastVariant, string> = {
    default: 'bg-[#22262C] border-[#343A43] text-[#F6F7F9]',
    success: 'bg-[#15241C] border-[#50C48B]/50 text-[#F6F7F9]',
    error: 'bg-[#2C1818] border-[#EF7272]/50 text-[#F6F7F9]',
    warning: 'bg-[#292014] border-[#F0B35A]/50 text-[#F6F7F9]',
    info: 'bg-[#152338] border-[#347FEF]/50 text-[#F6F7F9]',
  };

  const icons: Record<ToastVariant, React.ReactNode> = {
    default: <Info className="w-4 h-4 text-[#A5ADB8]" />,
    success: <CheckCircle className="w-4 h-4 text-[#50C48B]" />,
    error: <AlertCircle className="w-4 h-4 text-[#EF7272]" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#F0B35A]" />,
    info: <Info className="w-4 h-4 text-[#347FEF]" />,
  };

  return (
    <div
      className={`pointer-events-auto flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 shadow-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 ${variantStyles[item.variant]}`}
      role="alert"
    >
      {icons[item.variant]}
      <span className="flex-1">{item.message}</span>
      <button
        onClick={() => onDismiss(item.id)}
        className="text-[#A5ADB8] hover:text-[#F6F7F9] p-1 cursor-pointer"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
