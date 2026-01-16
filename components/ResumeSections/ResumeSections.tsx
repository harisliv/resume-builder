'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, Save } from '@hugeicons/core-free-icons';
import ResumeSectionsTabs from './components/Tabs';
import { useFormContext } from 'react-hook-form';
import { ResumePreview } from '../ResumePreview';
import type { TResumeData } from '@/types';
import { useResumeFormContext } from '@/components/providers/ResumeFormProvider';

export default function ResumeSections() {
  const { isPending, isError, error, handleDownload } = useResumeFormContext();
  const form = useFormContext<TResumeData>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 w-full max-w-[2000px] mx-auto h-full">
      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <HugeiconsIcon icon={FileText} strokeWidth={2} />
            Resume Form
          </h3>
          <div className="flex items-center gap-2">
            {isError && (
              <p className="text-sm text-destructive">
                Error: {error?.message}
              </p>
            )}
            <Button className="gap-2" type="submit" disabled={isPending}>
              <HugeiconsIcon icon={Save} strokeWidth={2} />
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <ResumeSectionsTabs />
        </div>
      </Card>

      <Card className="p-6 flex flex-col lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <HugeiconsIcon icon={FileText} strokeWidth={2} />
            Preview
          </h3>
          <Button className="gap-2" type="button" onClick={handleDownload}>
            <HugeiconsIcon icon={Download} strokeWidth={2} />
            Download
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <ResumePreview
            data={form.watch()}
            style={form.watch('documentStyle')}
          />
        </div>
      </Card>
    </div>
  );
}
