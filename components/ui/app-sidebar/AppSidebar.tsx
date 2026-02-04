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
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ResumeSelector } from './ResumeSelector';
import { SidebarToggleButton } from './SidebarToggleButton';
import { PaletteSelector, FontSelector, StyleSelector } from './selectors';

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
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={cn(
          'p-4',
          isCollapsed && 'p-3 flex flex-col items-center gap-3'
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-2">
            <SidebarGroupLabel className="text-sm font-bold text-foreground">
              My Resumes
            </SidebarGroupLabel>
            <SidebarToggleButton />
          </div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center mb-1">
            <SidebarToggleButton />
          </div>
        )}
        {isCollapsed ? (
          <div className="w-full flex flex-col items-center bg-muted/40 rounded-xl p-2.5 border border-border/50 shadow-sm">
            <ResumeSelector
              resumeTitles={resumeTitles}
              selectedResumeId={selectedResumeId}
              onResumeSelect={onResumeSelect}
              onCreateNew={onCreateNew}
              isLoadingTitles={isLoadingTitles}
            />
          </div>
        ) : (
          <ResumeSelector
            resumeTitles={resumeTitles}
            selectedResumeId={selectedResumeId}
            onResumeSelect={onResumeSelect}
            onCreateNew={onCreateNew}
            isLoadingTitles={isLoadingTitles}
          />
        )}
      </SidebarHeader>
      <SidebarContent className={cn(isCollapsed && 'px-3')}>
        <SidebarGroup
          className={cn(
            'bg-muted/30 rounded-2xl gap-5 p-4 border border-border/40',
            'group-data-[collapsible=icon]:bg-muted/40 group-data-[collapsible=icon]:rounded-xl',
            'group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:p-2.5',
            'group-data-[collapsible=icon]:gap-2.5 group-data-[collapsible=icon]:border-border/50',
            'group-data-[collapsible=icon]:shadow-sm'
          )}
        >
          <SidebarGroupLabel
            className={cn(
              'text-xs font-bold text-muted-foreground uppercase tracking-wider px-1',
              isCollapsed && 'hidden'
            )}
          >
            Customize
          </SidebarGroupLabel>
          <PaletteSelector disabled={isLoadingResume} />
          <FontSelector disabled={isLoadingResume} />
          <StyleSelector disabled={isLoadingResume} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={cn('p-4', isCollapsed && 'p-3')}>
        {isCollapsed ? (
          <div className="w-full flex flex-col items-center bg-muted/40 rounded-xl p-2.5 border border-border/50 shadow-sm">
            <NavUser />
          </div>
        ) : (
          <NavUser />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
