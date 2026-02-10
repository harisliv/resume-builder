'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/ui/sidebar';
import {
  LayoutHeader,
  HeaderRow,
  HeaderTitle,
  ToggleButton
} from '../styles/sidebar-layout.styles';
import type { ReactNode } from 'react';

export function SidebarHeader({ children }: { children: ReactNode }) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <LayoutHeader collapsed={isCollapsed}>
      <HeaderRow collapsed={isCollapsed}>
        {!isCollapsed && <HeaderTitle>My Resumes</HeaderTitle>}
        <ToggleButton collapsed={isCollapsed} onClick={toggleSidebar}>
          {isCollapsed ? (
            <ChevronRight className="size-5 text-black" />
          ) : (
            <ChevronLeft className="size-5" />
          )}
        </ToggleButton>
      </HeaderRow>
      {children}
    </LayoutHeader>
  );
}
