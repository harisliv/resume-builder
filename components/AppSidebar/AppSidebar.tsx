'use client';

import * as React from 'react';
import { useState } from 'react';
import { NavUser } from './components/NavUser';
import { Sidebar, SidebarRail } from '@/ui/sidebar';
import { ResumeSelector } from './components/ResumeSelector';
import { ResumeActions } from './components/ResumeActions';
import { SidebarHeader } from './components/SidebarHeader';
import { SidebarBody } from './components/SidebarBody';
import { SidebarFooter } from './components/SidebarFooter';
import { ResumeInfoControlledNavSelector } from '@/components/ConnectedFields/ControlledNavSelector';
import { paletteNavOptions, fontNavOptions, styleNavOptions } from './constants';

export type TAppSidebarResumeProps = {
  onResumeSelect: (id: string) => void;
  onCreateNew: (title?: string) => void;
  onDelete: (id: string) => void;
  onImportPdf: () => void;
  isLoadingResume?: boolean;
  /** Currently selected resume ID — used for Match Job button. */
  selectedResumeId?: string;
  /** Whether the selected resume is AI-improved. */
  isAiImproved?: boolean;
  /** Opens the Match Job modal. */
  onMatchJob?: () => void;
  /** Opens the Improve Resume modal. */
  onImproveResume?: () => void;
};

export function AppSidebar({
  onResumeSelect,
  onCreateNew,
  onDelete,
  onImportPdf,
  isLoadingResume = false,
  selectedResumeId,
  isAiImproved = false,
  onMatchJob,
  onImproveResume,
  ...props
}: TAppSidebarResumeProps & React.ComponentProps<typeof Sidebar>) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ResumeSelector
          onResumeSelect={onResumeSelect}
          onCreateNew={onCreateNew}
          onDelete={onDelete}
          isCreating={isCreating}
          onCreatingChange={setIsCreating}
        />
        <ResumeActions
          onCreateNew={() => setIsCreating(true)}
          onImportPdf={onImportPdf}
          onImproveResume={onImproveResume ?? (() => {})}
          onMatchJob={onMatchJob ?? (() => {})}
          selectedResumeId={selectedResumeId}
          isAiImproved={isAiImproved}
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
