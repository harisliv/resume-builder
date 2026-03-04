'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { FileSearchIcon, Download } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import ResumePreview from './ResumePreview';
import type { TResumeForm, TResumeInfo } from '@/types/schema';
import { generateResumePDF } from '@/lib/ResumePDF/generateResumePDF';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  SectionCardActions,
  SectionCardContent
} from '@/components/ui/section-card';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import usePrivileges from '@/hooks/usePrivileges';
import { useWatch, type Control } from 'react-hook-form';

type TResumePreviewWrapperProps = {
  formControl: Control<TResumeForm>;
  infoControl: Control<TResumeInfo>;
  hasSelectedResume: boolean;
};

/** Subscribes to form changes via useWatch to isolate re-renders from parent. */
export default function ResumePreviewWrapper({
  formControl,
  infoControl,
  hasSelectedResume
}: TResumePreviewWrapperProps) {
  const formData = useWatch({ control: formControl });
  const infoData = useWatch({ control: infoControl });
  const { isBasic, getDisabledTooltip } = usePrivileges();
  const downloadTooltip = getDisabledTooltip(hasSelectedResume);

  const handleDownload = () => {
    generateResumePDF({
      formData: formData as TResumeForm,
      infoData: infoData as TResumeInfo
    });
  };
  return (
    <SectionCard>
      <SectionCardHeader>
        <SectionCardTitle icon={FileSearchIcon} iconVariant="emerald">
          Preview
        </SectionCardTitle>
        <SectionCardActions>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  type="button"
                  onClick={handleDownload}
                  variant="secondary"
                  disabled={!isBasic || !hasSelectedResume}
                >
                  <HugeiconsIcon icon={Download} strokeWidth={2.5} />
                  Download
                </Button>
              </span>
            </TooltipTrigger>
            {downloadTooltip && (
              <TooltipContent>{downloadTooltip}</TooltipContent>
            )}
          </Tooltip>
        </SectionCardActions>
      </SectionCardHeader>
      <SectionCardContent>
        <ResumePreview
          formData={formData as TResumeForm}
          infoData={infoData as TResumeInfo}
        />
      </SectionCardContent>
    </SectionCard>
  );
}
