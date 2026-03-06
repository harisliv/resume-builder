import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Two-column grid: 33% left panel, 67% right panel. */
export function MultiModelLayout({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('grid h-full min-h-0 grid-cols-[1fr_2fr] gap-6', className)}
      {...props}
    />
  );
}

/** Vertical model tab sidebar within the right panel. */
export function MultiModelSidebar({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-1 border-r pr-3', className)}
      {...props}
    />
  );
}

/** Scrollable area for the active model's suggestion results. */
export function MultiModelScrollArea({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('min-h-0 flex-1 overflow-y-auto', className)}
      {...props}
    />
  );
}

/** Single model button in the sidebar. */
export function ModelButton({
  active,
  hasError,
  className,
  ...props
}: ComponentProps<'button'> & { active?: boolean; hasError?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left text-sm transition-colors',
        active ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground',
        hasError && 'text-destructive',
        className
      )}
      {...props}
    />
  );
}
