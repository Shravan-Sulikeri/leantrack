import { type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from './cn';

export interface SheetProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Sheet({
  open,
  isOpen,
  onOpenChange,
  onClose,
  title,
  children,
  className,
}: SheetProps) {
  const isSheetOpen = open ?? isOpen ?? false;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen && onClose) onClose();
  };

  return (
    <Dialog.Root open={isSheetOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            'motion-reduce:transition-none'
          )}
        />

        {/* Content – slides up from bottom */}
        <Dialog.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-[24px] bg-[#171A1F] border-t border-[#343A43] shadow-xl focus:outline-none max-w-md mx-auto',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=open]:fade-in-0 data-[state=open]:duration-300',
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=closed]:fade-out-0 data-[state=closed]:duration-200',
            'motion-reduce:transition-none motion-reduce:animate-none',
            className
          )}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-[#343A43]" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3">
            {title ? (
              <Dialog.Title className="text-lg font-bold text-[#F6F7F9]">
                {title}
              </Dialog.Title>
            ) : (
              <span />
            )}
            <Dialog.Close
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full text-[#A5ADB8] hover:bg-[#22262C] hover:text-[#F6F7F9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A2F] cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
