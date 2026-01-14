'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Download,
  FileText,
  MagicWand01Icon,
  PaintBrush01Icon,
  Save
} from '@hugeicons/core-free-icons';
import ResumeSectionsTabs from './components/Tabs';
import { resumeSchema, type TResumeData, resumeDefaultValues } from '@/types';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResumePreview } from '../ResumePreview';
import { generateResumePDF } from '@/lib/ResumePDF/generateResumePDF';
import type * as z from 'zod';
import { DocumentStyleControls } from '../DocumentStyleFields';
import { useResumeSubmit } from '@/hooks/useResumeSubmit';

export default function ResumeSections() {
  const form = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resumeDefaultValues,
    mode: 'onChange'
  });

  const { mutate: submitResume, isPending, isError, error } = useResumeSubmit();

  const onSubmit = (data: TResumeData) => {
    submitResume(data, {
      onSuccess: () => {
        alert('Resume saved successfully!');
      },
      onError: (error) => {
        alert(`Failed to save resume: ${error.message}`);
      }
    });
  };

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={MagicWand01Icon} strokeWidth={2} />
                  Resume Builder
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
              <div className="mb-6">
                <Label htmlFor="title">Resume Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Software Engineer Resume"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <ResumeSectionsTabs />
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={PaintBrush01Icon} strokeWidth={2} />
                  Style
                </h3>
              </div>
              <DocumentStyleControls />
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={FileText} strokeWidth={2} />
                  Preview
                </h3>
                <Button
                  className="gap-2"
                  type="button"
                  onClick={() => {
                    const formData = form.getValues();
                    generateResumePDF(formData, formData.documentStyle);
                  }}
                >
                  <HugeiconsIcon icon={Download} strokeWidth={2} />
                  Download
                </Button>
              </div>
              <ResumePreview
                data={form.watch()}
                style={form.watch('documentStyle')}
              />
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
