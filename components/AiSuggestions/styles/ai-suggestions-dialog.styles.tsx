import type { ComponentProps } from 'react';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function DialogContentWrapper({
  className,
  ...props
}: ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn('sm:max-w-5xl max-h-[90vh] flex flex-col overflow-hidden', className)}
      {...props}
    />
  );
}

export function DialogTitleRow({
  className,
  ...props
}: ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

/** Scrollable container for the input phase (textarea + button + error). */
export function InputContainer({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('-mx-4 flex max-h-[50vh] flex-col gap-3 overflow-y-auto p-4', className)}
      {...props}
    />
  );
}

/** Outer container for the results phase. */
export function ResultsContainer({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-3', className)} {...props} />;
}

/** Scrollable area wrapping the suggestions view in results phase. */
export function ResultsScrollArea({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('-mx-4 max-h-[50vh] overflow-y-auto px-4', className)}
      {...props}
    />
  );
}

/** Narrow left sidebar listing model options in the results phase. */
export function ModelSidebar({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-36 shrink-0 flex-col gap-1 border-r px-2 py-1', className)}
      {...props}
    />
  );
}

/** Row layout wrapping ModelSidebar + suggestions view. */
export function ModelLayout({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-row gap-3 -mx-4 max-h-[50vh] overflow-hidden', className)}
      {...props}
    />
  );
}

/** Scrollable right panel for suggestions content in multi-model layout. */
export function ModelScrollArea({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto pr-4 pl-2', className)}
      {...props}
    />
  );
}
