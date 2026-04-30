'use client';

import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';
import { DialogContent } from '@/components/ui/dialog';

type TDivProps = ComponentPropsWithoutRef<'div'>;
type TButtonProps = ComponentPropsWithoutRef<'button'>;
type TDialogContentProps = ComponentPropsWithoutRef<typeof DialogContent>;

/** Styled dialog shell for the Improve Resume modal. */
export function ImproveDialogContent({
  className,
  ...props
}: TDialogContentProps) {
  return (
    <DialogContent
      showCloseButton={false}
      className={cn(
        'dark:bg-card flex !h-[70vh] !max-h-none !w-[50vw] !max-w-none flex-col !gap-0 overflow-hidden rounded-3xl border border-white/20 bg-white !p-0 shadow-[0_12px_40px_rgba(45,51,55,0.06)] backdrop-blur-xl',
        className
      )}
      {...props}
    />
  );
}

/** Styled header row for the Improve Resume modal. */
export function ImproveHeaderRow({ className, ...props }: TDivProps) {
  return (
    <div
      className={cn('flex items-start justify-between px-8 pt-8 pb-4', className)}
      {...props}
    />
  );
}

/** Styled badge for the Improve Resume header icon. */
export function ImproveHeaderBadge({ className, ...props }: TDivProps) {
  return (
    <div
      className={cn(
        'bg-primary flex h-7 w-7 items-center justify-center rounded-lg',
        className
      )}
      {...props}
    />
  );
}

/** Styled close button for the Improve Resume modal. */
export function ImproveCloseButton({
  className,
  type = 'button',
  ...props
}: TButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-2 transition-colors',
        className
      )}
      {...props}
    />
  );
}

/** Styled scrollable body area for the Improve Resume modal. */
export function ImproveBody({ className, ...props }: TDivProps) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto px-8 py-4', className)}
      {...props}
    />
  );
}

/** Styled centered loading/idle container. */
export function ImproveCenteredContent({ className, ...props }: TDivProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex h-full items-center justify-center gap-2 text-sm',
        className
      )}
      {...props}
    />
  );
}

/** Styled footer wrapper for Improve Resume actions. */
export function ImproveFooterContainer({ className, ...props }: TDivProps) {
  return (
    <div
      className={cn(
        'border-border/30 flex items-center justify-between border-t px-8 py-5',
        className
      )}
      {...props}
    />
  );
}

/** Styled primary gradient action button. */
export function ImprovePrimaryAction({
  className,
  type = 'button',
  ...props
}: TButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'from-primary to-primary/80 shadow-primary/20 flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-br px-8 py-3 font-bold text-white shadow-lg transition-colors hover:from-primary/90 hover:to-primary/70',
        className
      )}
      {...props}
    />
  );
}

/** Styled disabled action button. */
export function ImproveDisabledAction({
  className,
  type = 'button',
  ...props
}: TButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'bg-muted text-muted-foreground flex cursor-not-allowed items-center gap-2 rounded-xl px-8 py-3 font-bold shadow-none',
        className
      )}
      disabled
      {...props}
    />
  );
}

/** Styled cancel/secondary text button. */
export function ImproveCancelButton({
  className,
  type = 'button',
  ...props
}: TButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'text-muted-foreground hover:text-foreground cursor-pointer text-sm font-semibold transition-colors',
        className
      )}
      {...props}
    />
  );
}
