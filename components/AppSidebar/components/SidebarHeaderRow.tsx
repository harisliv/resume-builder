'use client';

import { useSidebar } from '@/ui/sidebar';
import { CollapsedHeaderRow, ExpandedHeaderRow } from './ui/sidebar-header';
import { HeaderTitle } from './ui/sidebar-customize-group';
import { SidebarToggleButton } from './SidebarToggleButton';

export function SidebarHeaderRow() {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return (
      <CollapsedHeaderRow>
        <SidebarToggleButton />
      </CollapsedHeaderRow>
    );
  }

  return (
    <ExpandedHeaderRow>
      <HeaderTitle>My Resumes</HeaderTitle>
      <SidebarToggleButton />
    </ExpandedHeaderRow>
  );
}
