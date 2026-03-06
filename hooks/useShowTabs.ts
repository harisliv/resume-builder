'use client';

import * as React from 'react';
import { useSidebar } from '@/ui/sidebar';

const MAIN_CONTENT_MIN = 1050;
const SIDEBAR_WIDTH_OPEN = 350;
const SIDEBAR_WIDTH_CLOSED = 50;

/** Computes tab mode from viewport + sidebar state. */
function shouldShowTabs(viewport: number, isMobile: boolean, open: boolean): boolean {
  const sidebarWidth = isMobile
    ? 0
    : open
      ? SIDEBAR_WIDTH_OPEN
      : SIDEBAR_WIDTH_CLOSED;
  const mainContentWidth = viewport - sidebarWidth;
  return mainContentWidth < MAIN_CONTENT_MIN;
}

/**
 * Returns true when Form|Preview tabs should show (main content < 1050px).
 * mainContent = viewport - sidebarWidth; sidebar 350px open, 50px closed.
 */
export function useShowTabs(): boolean {
  const { isMobile, open } = useSidebar();
  const [showTabs, setShowTabs] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return shouldShowTabs(window.innerWidth, isMobile, open);
  });

  React.useEffect(() => {
    const update = () => {
      setShowTabs(shouldShowTabs(window.innerWidth, isMobile, open));
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isMobile, open]);

  return showTabs;
}
