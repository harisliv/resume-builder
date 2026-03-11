'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/ui/sidebar';
import {
  LayoutHeader,
  HeaderRow,
  ToggleButton
} from '../styles/sidebar-layout.styles';
import { UserStatus } from './UserStatus';
import type { ReactNode } from 'react';

export function SidebarHeader({ children }: { children: ReactNode }) {
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();

  return (
    <LayoutHeader collapsed={isCollapsed}>
      <HeaderRow collapsed={isCollapsed}>
        {!isCollapsed && <UserStatus />}
        {!isMobile && (
          <ToggleButton collapsed={isCollapsed} onClick={toggleSidebar}>
            {isCollapsed ? (
              <ChevronRight className="size-5 text-black" />
            ) : (
              <ChevronLeft className="size-5" />
            )}
          </ToggleButton>
        )}
      </HeaderRow>
      {children}
    </LayoutHeader>
  );
}
