import type { ComponentProps } from 'react';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function DialogContentWrapper({
  className,
  ...props
}: ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn('sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden', className)}
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
