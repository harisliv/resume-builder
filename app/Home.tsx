'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import type { Id } from '@/convex/_generated/dataModel';
import {
  resumeFormSchema,
  resumeFormDefaultValues,
  resumeInfoSchema,
  resumeInfoDefaultValues,
  type TResumeForm,
  type TResumeData
} from '@/types';
import { useGetUserResumeTitles, useGetResumeById, useResumeSubmit } from '@/hooks';
import { ResumeSections } from '@/components/ResumeSections';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { FormProvider } from 'react-hook-form';
import ResumePreviewWrapper from '@/components/ResumeSections/ResumePreviewWrapper';

export default function Home() {
  const [selectedResumeId, setSelectedResumeId] = useState<
    Id<'resumes'> | undefined
  >(undefined);

  const { data: resumeTitles, isLoading: isLoadingTitles } =
    useGetUserResumeTitles();

  const { form: formValues, info: infoValues } =
    useGetResumeById(selectedResumeId);

  const formForm = useForm<z.infer<typeof resumeFormSchema>>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: resumeFormDefaultValues,
    values: formValues,
    mode: 'onChange'
  });

  const infoForm = useForm<z.infer<typeof resumeInfoSchema>>({
    resolver: zodResolver(resumeInfoSchema),
    defaultValues: resumeInfoDefaultValues,
    values: infoValues,
    mode: 'onChange'
  });

  const { mutate: submitResume, isPending, isError, error } = useResumeSubmit();

  const handleResumeSelect = (id: string) => {
    setSelectedResumeId(id as Id<'resumes'>);
  };

  const handleCreateNew = (title?: string) => {
    const newResumeData: TResumeData = {
      ...resumeInfoDefaultValues,
      ...resumeFormDefaultValues,
      title: title ?? 'Untitled Resume'
    };
    submitResume(newResumeData, {
      onSuccess: (data) => {
        infoForm.reset({
          ...resumeInfoDefaultValues,
          id: data.id,
          title: title ?? 'Untitled Resume'
        });
        formForm.reset(resumeFormDefaultValues);
        setSelectedResumeId(data.id);
      }
    });
  };

  const handleSubmit = (formData: TResumeForm) => {
    const infoData = infoForm.getValues();
    const combinedData: TResumeData = {
      ...infoData,
      ...formData
    };
    submitResume(combinedData, {
      onSuccess: (data) => {
        setSelectedResumeId(data.id);
      }
    });
  };

  return (
    <SidebarProvider>
      <FormProvider {...infoForm}>
        <AppSidebar
          resumeTitles={resumeTitles}
          selectedResumeId={selectedResumeId}
          onResumeSelect={handleResumeSelect}
          onCreateNew={handleCreateNew}
          isLoadingTitles={isLoadingTitles}
        />
      </FormProvider>
      <SidebarInset>
        <div className="w-full max-w-[2000px] mx-auto h-screen overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 w-full max-w-[2000px] mx-auto h-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
            <FormProvider {...formForm}>
              <ResumeSections
                onSubmit={handleSubmit}
                isPending={isPending}
                isError={isError}
                error={error}
              />
            </FormProvider>
            <ResumePreviewWrapper
              formData={formForm.watch()}
              infoData={infoForm.watch()}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
