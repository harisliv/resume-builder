'use client';

import { useSidebar } from '@/ui/sidebar';
import {
  CollapsedSidebarFooter,
  ExpandedSidebarFooter
} from './ui/sidebar-header';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function SidebarFooter({ children }: Props) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return <CollapsedSidebarFooter>{children}</CollapsedSidebarFooter>;
  }

  return <ExpandedSidebarFooter>{children}</ExpandedSidebarFooter>;
}
