import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'bg-background/80 border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:bg-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 file:text-foreground placeholder:text-muted-foreground/70 hover:border-border h-10 w-full min-w-0 rounded-xl border px-3.5 py-2 text-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:shadow-[0_0_0_4px_oklch(0.55_0.26_280_/_0.08)] focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-[3px]',
        className
      )}
      {...props}
    />
  );
}

export { Input };
