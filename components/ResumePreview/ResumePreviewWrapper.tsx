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

export default function ResumePreviewWrapper({
  formData,
  infoData
}: TCombinedResumeData) {
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
          <Button type="button" onClick={handleDownload} variant="secondary">
            <HugeiconsIcon icon={Download} strokeWidth={2.5} />
            Download
          </Button>
        </SectionCardActions>
      </SectionCardHeader>
      <SectionCardContent>
        <ResumePreview formData={formData} infoData={infoData} />
      </SectionCardContent>
    </SectionCard>
  );
}
