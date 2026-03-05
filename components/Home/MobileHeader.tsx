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
        'bg-background sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b px-4 py-3 md:hidden',
        className
      )}
    >
      <SidebarTrigger />
      {children}
    </div>
  );
}
