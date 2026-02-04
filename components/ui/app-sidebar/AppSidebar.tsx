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
          isCollapsed && 'flex flex-col items-center gap-3 p-3'
        )}
      >
        {!isCollapsed && (
          <div className="mb-2 flex items-center justify-between">
            <SidebarGroupLabel className="text-foreground text-sm font-bold">
              My Resumes
            </SidebarGroupLabel>
            <SidebarToggleButton />
          </div>
        )}
        {isCollapsed && (
          <div className="mb-1 flex w-full justify-center">
            <SidebarToggleButton />
          </div>
        )}
        {isCollapsed ? (
          <div className="bg-muted/40 border-border/50 flex w-full flex-col items-center rounded-xl border p-2.5 shadow-sm">
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
            'gap-5 rounded-2xl p-4',
            'group-data-[collapsible=icon]:bg-muted/40 group-data-[collapsible=icon]:rounded-xl',
            'group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:p-2.5',
            'group-data-[collapsible=icon]:border-border/50 group-data-[collapsible=icon]:gap-2.5',
            'group-data-[collapsible=icon]:shadow-sm'
          )}
        >
          <SidebarGroupLabel
            className={cn(
              'text-muted-foreground px-1 text-xs font-bold tracking-wider uppercase',
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
          <div className="bg-muted/40 border-border/50 flex w-full flex-col items-center rounded-xl border p-2.5 shadow-sm">
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
