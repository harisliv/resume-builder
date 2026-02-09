'use client';

import { useSidebar } from '@/ui/sidebar';
import {
  CollapsedSidebarHeader,
  ExpandedSidebarHeader
} from './ui/sidebar-header';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function SidebarHeader({ children }: Props) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return <CollapsedSidebarHeader>{children}</CollapsedSidebarHeader>;
  }

  return <ExpandedSidebarHeader>{children}</ExpandedSidebarHeader>;
}
