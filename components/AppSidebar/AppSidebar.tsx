'use client';

import * as React from 'react';
import { NavUser } from './components/NavUser';
import { Sidebar, SidebarRail } from '@/ui/sidebar';
import { ResumeSelector } from './components/ResumeSelector';
import { SidebarHeader } from './components/SidebarHeader';
import { SidebarBody } from './components/SidebarBody';
import { SidebarFooter } from './components/SidebarFooter';
import { ResumeInfoControlledNavSelector } from '@/components/ControlledFields/ControlledNavSelector';
import { paletteNavOptions, fontNavOptions, styleNavOptions } from './constants';

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
        <ResumeSelector
          onResumeSelect={onResumeSelect}
          onCreateNew={onCreateNew}
        />
      </SidebarHeader>
      <SidebarBody>
        <ResumeInfoControlledNavSelector
          name="documentStyle.palette"
          options={paletteNavOptions}
          disabled={isLoadingResume}
        />
        <ResumeInfoControlledNavSelector
          name="documentStyle.font"
          options={fontNavOptions}
          disabled={isLoadingResume}
        />
        <ResumeInfoControlledNavSelector
          name="documentStyle.style"
          options={styleNavOptions}
          disabled={isLoadingResume}
        />
      </SidebarBody>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
