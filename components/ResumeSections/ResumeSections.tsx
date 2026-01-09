'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Download,
  FileText,
  MagicWand01Icon,
  Save
} from '@hugeicons/core-free-icons';
import ResumeSectionsTabs from './components/Tabs';
import { resumeDefaultValues, resumeSchema } from '@/types';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResumePreview } from '../ResumePreview';
import { generateResumePDF } from '@/lib/ResumePDF/generateResumePDF';
import type * as z from 'zod';
import { mockResumeData } from '@/lib/ResumePDF/mockdata';

export default function ResumeSections() {
  const form = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: mockResumeData,
    mode: 'onChange'
  });

  console.log(form.watch());
  return (
    <FormProvider {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HugeiconsIcon icon={MagicWand01Icon} strokeWidth={2} />
                Resume Builder
              </h3>
              <Button className="gap-2" type="submit">
                <HugeiconsIcon icon={Save} strokeWidth={2} />
                Save
              </Button>
            </div>
            <ResumeSectionsTabs />
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HugeiconsIcon icon={FileText} strokeWidth={2} />
                Preview
              </h3>
              <Button
                className="gap-2"
                onClick={() => generateResumePDF(form.watch())}
              >
                <HugeiconsIcon icon={Download} strokeWidth={2} />
                Download
              </Button>
            </div>
            <ResumePreview data={form.watch()} />
          </Card>
        </div>
      </div>
    </FormProvider>
  );
}
