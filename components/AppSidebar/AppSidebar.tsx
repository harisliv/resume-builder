'use client';

import * as React from 'react';
import { NavUser } from '@/components/ui/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from '@/ui/sidebar';
import { cn } from '@/lib/utils';
import { ResumeSelector } from './components/ResumeSelector';
import { SidebarToggleButton } from './components/SidebarToggleButton';
import { PaletteSelector } from './components/PaletteSelector';
import { FontSelector } from './components/FontSelector';
import { StyleSelector } from './components/StyleSelector';

export type TAppSidebarResumeProps = {
  resumeTitles: { id: string; title: string }[] | undefined;
  selectedResumeId: string | undefined;
  onResumeSelect: (id: string) => void;
  onCreateNew: (title?: string) => void;
  isLoadingTitles: boolean;
  isLoadingResume?: boolean;
};

export function AppSidebar({
  resumeTitles,
  selectedResumeId,
  onResumeSelect,
  onCreateNew,
  isLoadingTitles,
  isLoadingResume = false,
  ...props
}: TAppSidebarResumeProps & React.ComponentProps<typeof Sidebar>) {
  const { isCollapsed } = useSidebar();

  const selectors = (
    <>
      <PaletteSelector disabled={isLoadingResume} />
      <FontSelector disabled={isLoadingResume} />
      <StyleSelector disabled={isLoadingResume} />
    </>
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={cn(
          isCollapsed ? 'flex flex-col items-center gap-3 p-3' : 'p-4'
        )}
      >
        <div
          className={cn(
            'flex items-center',
            isCollapsed ? 'w-full justify-center' : 'mb-2 justify-between'
          )}
        >
          {!isCollapsed && (
            <SidebarGroupLabel className="text-foreground text-sm font-bold">
              My Resumes
            </SidebarGroupLabel>
          )}
          <SidebarToggleButton />
        </div>
        <ResumeSelector
          resumeTitles={resumeTitles}
          selectedResumeId={selectedResumeId}
          onResumeSelect={onResumeSelect}
          onCreateNew={onCreateNew}
          isLoadingTitles={isLoadingTitles}
        />
      </SidebarHeader>
      <SidebarContent
        className={cn(
          isCollapsed && 'flex flex-col items-center gap-3 px-3 py-2'
        )}
      >
        {isCollapsed ? (
          selectors
        ) : (
          <SidebarGroup className="bg-muted/30 border-border/40 gap-5 rounded-2xl border p-4">
            <SidebarGroupLabel className="text-muted-foreground px-1 text-xs font-bold tracking-wider uppercase">
              Customize
            </SidebarGroupLabel>
            {selectors}
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter
        className={cn(
          isCollapsed ? 'flex items-center justify-center p-3' : 'p-4'
        )}
      >
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
