'use client';

import { SidebarTrigger } from '@/ui/sidebar';
import { cn } from '@/lib/utils';

type MobileHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * Mobile-only header with sidebar trigger. Used with FORM|PREVIEW tabs.
 * Renders only below md breakpoint (md:hidden).
 */
export function MobileHeader({ children, className }: MobileHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 sticky top-0 z-10 bg-background border-b px-4 py-3 shrink-0 md:hidden',
        className
      )}
    >
      <SidebarTrigger />
      {children}
    </div>
  );
}
