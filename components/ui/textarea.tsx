import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'bg-background/80 border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:bg-background focus-visible:shadow-[0_0_0_4px_oklch(0.55_0.26_280_/_0.08)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 resize-none rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200 focus-visible:ring-[3px] aria-invalid:ring-[2px] placeholder:text-muted-foreground/70 flex field-sizing-content min-h-20 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:border-border',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
