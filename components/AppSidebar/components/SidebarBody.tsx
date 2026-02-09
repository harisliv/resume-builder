'use client';

import { useSidebar } from '@/ui/sidebar';
import {
  CollapsedSidebarContent,
  ExpandedSidebarContent
} from './ui/sidebar-header';
import {
  CustomizeGroup,
  CustomizeGroupLabel
} from './ui/sidebar-customize-group';

export function SidebarBody({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return <CollapsedSidebarContent>{children}</CollapsedSidebarContent>;
  }

  return (
    <ExpandedSidebarContent>
      <CustomizeGroup>
        <CustomizeGroupLabel>Customize</CustomizeGroupLabel>
        {children}
      </CustomizeGroup>
    </ExpandedSidebarContent>
  );
}
