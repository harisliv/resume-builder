'use client';

import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { DialogContent } from '@/components/ui/dialog';

type TDivProps = ComponentPropsWithoutRef<'div'>;
type TButtonProps = ComponentPropsWithoutRef<'button'>;
type TDialogContentProps = ComponentPropsWithoutRef<typeof DialogContent>;

/** Styled dialog shell for the Match Job modal. */
export function MatchJobDialogContent({
  className,
  ...props
}: TDialogContentProps) {
  return (
    <DialogContent
      showCloseButton={false}
      className={cn(
        'dark:bg-card flex !h-[70vh] !max-h-none !w-[70vw] !max-w-none flex-col !gap-0 overflow-hidden rounded-3xl border border-white/20 bg-white !p-0 shadow-[0_12px_40px_rgba(45,51,55,0.06)]',
        className
      )}
      {...props}
    />
  );
}

/** Styled shell wrapper for the Match Job modal header area. */
export function MatchJobHeaderSection({ className, ...props }: TDivProps) {
  return <div className={cn('border-border flex flex-col border-b', className)} {...props} />;
}

/** Styled body wrapper for the Match Job modal. */
export function MatchJobBody({ className, ...props }: TDivProps) {
  return <div className={cn('flex min-h-0 flex-1 overflow-hidden', className)} {...props} />;
}

/** Styled side panel wrapper used by left and right Match Job columns. */
export function MatchJobPanel({ className, ...props }: TDivProps) {
  return <div className={cn('flex min-h-0 flex-col', className)} {...props} />;
}

/** Styled main content wrapper for the review phase. */
export function MatchJobReviewPanel({ className, ...props }: TDivProps) {
  return <div className={cn('min-h-0 flex-1 overflow-y-auto px-8 py-6', className)} {...props} />;
}

/** Styled layout row for the Match Job header. */
export function MatchJobHeaderRow({ className, ...props }: TDivProps) {
  return <div className={cn('flex items-center justify-between px-8 py-5', className)} {...props} />;
}

/** Styled badge for the Match Job header icon. */
export function MatchJobHeaderBadge({
  className,
  children,
  ...props
}: TDivProps & { children: ReactNode }) {
  return (
    <div
      className={cn(
        'bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Styled close button for the Match Job modal. */
export function MatchJobCloseButton({ className, type = 'button', ...props }: TButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'text-muted-foreground hover:bg-accent hover:text-foreground rounded-full border border-border p-2 transition-colors cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

/** Styled hint bar shared by matching and review phases. */
export function MatchJobHintBarContainer({ className, ...props }: TDivProps) {
  return (
    <div
      className={cn(
        'border-primary/10 bg-primary/5 flex items-center gap-2 border-t px-8 py-2',
        className
      )}
      {...props}
    />
  );
}

/** Styled footer wrapper for Match Job actions. */
export function MatchJobFooterContainer({ className, ...props }: TDivProps) {
  return (
    <div
      className={cn(
        'border-border bg-muted/20 flex items-center justify-end gap-4 border-t px-8 py-5',
        className
      )}
      {...props}
    />
  );
}

/** Styled secondary footer action button. */
export function MatchJobSecondaryAction({
  className,
  type = 'button',
  ...props
}: TButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-bold text-muted-foreground transition-colors cursor-pointer hover:bg-accent hover:text-foreground dark:bg-card',
        className
      )}
      {...props}
    />
  );
}

/** Styled primary gradient footer action button. */
export function MatchJobPrimaryAction({
  className,
  type = 'button',
  ...props
}: TButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'from-primary to-primary/80 shadow-primary/20 flex items-center gap-2 rounded-full bg-gradient-to-br px-8 py-3 text-sm font-bold text-white shadow-lg transition-all cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  );
}
