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
} from '@/types/schema';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import { useResumeSubmit } from '@/hooks/useResumeSubmit';
import { AppSidebar } from '@/components/AppSidebar';
import ResumeForm from '@/components/ResumeForm';
import { ResumePreviewWrapper } from '@/components/ResumePreview';
import { SidebarInset, SidebarProvider } from '@/ui/sidebar';
import { FormProvider } from 'react-hook-form';
import { HomeLayout } from './home-layout';

export default function Home() {
  const [selectedResumeId, setSelectedResumeId] = useState<
    Id<'resumes'> | undefined
  >(undefined);

  const {
    form: formValues,
    info: infoValues,
    isLoading: isLoadingResume
  } = useGetResumeById(selectedResumeId);

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
          onResumeSelect={handleResumeSelect}
          onCreateNew={handleCreateNew}
          isLoadingResume={isLoadingResume}
        />
      </FormProvider>
      <SidebarInset>
        <HomeLayout>
          <FormProvider {...formForm}>
            <ResumeForm
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
        </HomeLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
