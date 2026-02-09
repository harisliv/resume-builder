'use client';

import * as React from 'react';
import { NavUser } from '@/components/AppSidebar/components/NavUser';
import { Sidebar, SidebarRail } from '@/ui/sidebar';
import { ResumeSelector } from './components/ResumeSelector';
import { SidebarHeader } from './components/SidebarHeader';
import { SidebarHeaderRow } from './components/SidebarHeaderRow';
import { SidebarBody } from './components/SidebarBody';
import { SidebarFooter } from './components/SidebarFooter';
import { FontSelector } from './components/FontSelector';
import { PaletteSelector } from './components/PaletteSelector';
import { StyleSelector } from './components/StyleSelector';

export type TAppSidebarResumeProps = {
  onResumeSelect: (id: string) => void;
  onCreateNew: (title?: string) => void;
  isLoadingResume?: boolean;
};

export function AppSidebar({
  onResumeSelect,
  onCreateNew,
  isLoadingResume = false,
  ...props
}: TAppSidebarResumeProps & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderRow />
        <ResumeSelector
          onResumeSelect={onResumeSelect}
          onCreateNew={onCreateNew}
        />
      </SidebarHeader>
      <SidebarBody>
        <PaletteSelector disabled={isLoadingResume} />
        <FontSelector disabled={isLoadingResume} />
        <StyleSelector disabled={isLoadingResume} />
      </SidebarBody>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
