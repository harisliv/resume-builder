'use client';

import { useSidebar } from '@/ui/sidebar';
import {
  LayoutContent,
  CustomizeGroup,
  CustomizeGroupLabel
} from '../styles/sidebar-layout.styles';

export function SidebarBody({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return <LayoutContent collapsed>{children}</LayoutContent>;
  }

  return (
    <LayoutContent>
      <CustomizeGroup>
        <CustomizeGroupLabel>Customize</CustomizeGroupLabel>
        {children}
      </CustomizeGroup>
    </LayoutContent>
  );
}
