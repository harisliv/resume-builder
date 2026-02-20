import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Rounded icon container with gradient background and shadow. */
export function IconBadge({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl',
        className
      )}
      {...props}
    />
  );
}
