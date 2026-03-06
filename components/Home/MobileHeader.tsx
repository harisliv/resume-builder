'use client';

import { SidebarTrigger, useSidebar } from '@/ui/sidebar';
import { cn } from '@/lib/utils';

type MobileHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * Header for FORM|PREVIEW tabs. Sidebar trigger only when isMobile (Sheet mode);
 * at tablet/desktop with tabs, sidebar is inline with its own toggle.
 */
export function MobileHeader({ children, className }: MobileHeaderProps) {
  const { isMobile } = useSidebar();

  return (
    <div
      className={cn(
        'flex items-center gap-3 sticky top-0 z-10 bg-background border-b px-4 py-3 shrink-0',
        className
      )}
    >
      {isMobile && <SidebarTrigger />}
      {children}
    </div>
  );
}
