import { Card } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileText, Download } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import ResumePreview from './ResumePreview';
import type { TCombinedResumeData } from '@/types';
import { generateResumePDF } from '@/lib/ResumePDF/generateResumePDF';

export default function ResumePreviewWrapper({
  formData,
  infoData
}: TCombinedResumeData) {
  const handleDownload = () => {
    generateResumePDF({ formData, infoData });
  };
  return (
    <Card className="p-7 flex flex-col max-h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-xl font-bold flex items-center gap-3 tracking-tight">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
            <HugeiconsIcon
              icon={FileText}
              strokeWidth={2.5}
              className="size-5"
            />
          </div>
          Preview
        </h3>
        <Button type="button" onClick={handleDownload} variant="secondary">
          <HugeiconsIcon icon={Download} strokeWidth={2.5} />
          Download
        </Button>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <ResumePreview formData={formData} infoData={infoData} />
      </div>
    </Card>
  );
}
