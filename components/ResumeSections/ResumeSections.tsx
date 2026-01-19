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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 w-full max-w-[2000px] mx-auto h-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="p-7 flex flex-col max-h-full overflow-hidden">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-3 tracking-tight">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25">
              <HugeiconsIcon icon={FileText} strokeWidth={2.5} className="size-5" />
            </div>
            Resume Form
          </h3>
          <div className="flex items-center gap-3">
            {isError && (
              <p className="text-sm text-destructive font-medium">
                Error: {error?.message}
              </p>
            )}
            <Button type="submit" disabled={isPending}>
              <HugeiconsIcon icon={Save} strokeWidth={2.5} />
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto min-h-0">
          <ResumeSectionsTabs />
        </div>
      </Card>

      <Card className="p-7 flex flex-col max-h-full overflow-hidden">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-3 tracking-tight">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
              <HugeiconsIcon icon={FileText} strokeWidth={2.5} className="size-5" />
            </div>
            Preview
          </h3>
          <Button type="button" onClick={handleDownload} variant="secondary">
            <HugeiconsIcon icon={Download} strokeWidth={2.5} />
            Download
          </Button>
        </div>
        <div className="flex-1 overflow-auto min-h-0">
          <ResumePreview
            data={form.watch()}
            style={form.watch('documentStyle')}
          />
        </div>
      </Card>
    </div>
  );
}
