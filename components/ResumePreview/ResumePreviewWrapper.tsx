'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { FileSearchIcon, Download } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import ResumePreview from './ResumePreview';
import type { TCombinedResumeData } from '@/types/schema';
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

export default function ResumePreviewWrapper({
  formData,
  infoData
}: TCombinedResumeData) {
  const { isBasic } = usePrivileges();

  const handleDownload = () => {
    generateResumePDF({ formData, infoData });
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
                  disabled={!isBasic}
                >
                  <HugeiconsIcon icon={Download} strokeWidth={2.5} />
                  Download
                </Button>
              </span>
            </TooltipTrigger>
            {!isBasic && (
              <TooltipContent>Upgrade to download resumes</TooltipContent>
            )}
          </Tooltip>
        </SectionCardActions>
      </SectionCardHeader>
      <SectionCardContent>
        <ResumePreview formData={formData} infoData={infoData} />
      </SectionCardContent>
    </SectionCard>
  );
}
