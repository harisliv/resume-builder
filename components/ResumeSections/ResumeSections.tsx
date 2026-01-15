'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Download,
  FileText,
  MagicWand01Icon,
  PaintBrush01Icon,
  Save
} from '@hugeicons/core-free-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import ResumeSectionsTabs from './components/Tabs';
import { resumeSchema, type TResumeData, resumeDefaultValues } from '@/types';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResumePreview } from '../ResumePreview';
import { generateResumePDF } from '@/lib/ResumePDF/generateResumePDF';
import type * as z from 'zod';
import { DocumentStyleControls } from '../DocumentStyleFields';
import { useResumeSubmit } from '@/hooks/useResumeSubmit';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import type { Id } from '@/convex/_generated/dataModel';

export default function ResumeSections() {
  const { user } = useAuth();
  const [selectedResumeId, setSelectedResumeId] = useState<
    Id<'resumes'> | undefined
  >(undefined);

  const { data: resumeTitles, isLoading: isLoadingTitles } =
    useGetUserResumeTitles(user?.id);
  const { data: selectedResume } = useGetResumeById(selectedResumeId, user?.id);

  const form = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resumeDefaultValues,
    values: selectedResume ?? undefined,
    mode: 'onChange'
  });

  const { mutate: submitResume, isPending, isError, error } = useResumeSubmit();

  const onSubmit = (data: TResumeData) => {
    submitResume(data);
  };

  const handleResumeSelect = (value: string) => {
    setSelectedResumeId(value as Id<'resumes'>);
  };

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 max-w-[2000px] mx-auto">
          {/* Top Row - My Resumes & Styles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={MagicWand01Icon} strokeWidth={2} />
                  My Resumes
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
              <Select
                value={selectedResumeId}
                onValueChange={handleResumeSelect}
                disabled={isLoadingTitles}
              >
                <SelectTrigger id="resume-select" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingTitles ? 'Loading...' : 'Select a resume'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {resumeTitles?.map(
                    (resume: { id: string; title: string }) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.title}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={PaintBrush01Icon} strokeWidth={2} />
                  Styles
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
              <DocumentStyleControls />
            </Card>
          </div>

          {/* Bottom Row - Resume Form & Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={FileText} strokeWidth={2} />
                  Resume Form
                </h3>
              </div>
              <ResumeSectionsTabs />
            </Card>

            <Card className="p-6 lg:sticky lg:top-8 lg:self-start">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={FileText} strokeWidth={2} />
                  Preview
                </h3>
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
