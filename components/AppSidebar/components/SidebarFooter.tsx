'use client';

import { useSidebar } from '@/ui/sidebar';
import { LayoutFooter } from '../styles/sidebar-layout.styles';
import type { ReactNode } from 'react';

export function SidebarFooter({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();

  return <LayoutFooter collapsed={isCollapsed}>{children}</LayoutFooter>;
}
