'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/ui/sidebar';
import {
  CollapsedToggleButton,
  ExpandedToggleButton
} from './ui/sidebar-toggle-button';

export function SidebarToggleButton() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  if (isCollapsed) {
    return (
      <CollapsedToggleButton onClick={toggleSidebar}>
        <ChevronRight className="size-5 text-black" />
      </CollapsedToggleButton>
    );
  }

  return (
    <ExpandedToggleButton onClick={toggleSidebar}>
      <ChevronLeft className="size-5" />
    </ExpandedToggleButton>
  );
}
