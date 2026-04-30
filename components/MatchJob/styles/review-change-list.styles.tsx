'use client';

import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

type TDivProps = ComponentPropsWithoutRef<'div'>;
type TLabelProps = ComponentPropsWithoutRef<'label'>;

/** Styled review list wrapper. */
export function ReviewChangeListContainer({ className, ...props }: TDivProps) {
  return <div className={cn('flex flex-col gap-4', className)} {...props} />;
}

/** Styled review label row for highlight diffs. */
export function ReviewHighlightRow({ className, ...props }: TLabelProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-lg border p-3 hover:bg-muted/50',
        className
      )}
      {...props}
    />
  );
}

/** Styled review label row for added skills. */
export function ReviewSkillRow({ className, ...props }: TLabelProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50',
        className
      )}
      {...props}
    />
  );
}
