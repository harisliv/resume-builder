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
import type { TAiSuggestions } from '@/types/aiSuggestions';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import { useResumeSubmit } from '@/hooks/useResumeSubmit';
import { useDeleteResume } from '@/hooks/useDeleteResume';
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
  const { mutate: deleteResume } = useDeleteResume();

  const handleResumeSelect = (id: string) => {
    setSelectedResumeId(id as Id<'resumes'>);
  };

  const handleDeleteResume = (id: string) => {
    deleteResume(id as Id<'resumes'>, {
      onSuccess: () => {
        if (id === selectedResumeId) {
          setSelectedResumeId(undefined);
          infoForm.reset(resumeInfoDefaultValues);
          formForm.reset(resumeFormDefaultValues);
        }
      }
    });
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

  const mergeSuggestions = (suggestions: TAiSuggestions): TResumeForm => {
    const currentForm = formForm.getValues();
    return {
      ...currentForm,
      personalInfo: {
        ...currentForm.personalInfo,
        ...(suggestions.summary && { summary: suggestions.summary })
      },
      experience: currentForm.experience.map((exp, idx) => ({
        ...exp,
        ...(suggestions.experience?.[idx]?.description && {
          description: suggestions.experience[idx].description
        }),
        ...(suggestions.experience?.[idx]?.highlights && {
          highlights: suggestions.experience[idx].highlights
        })
      })),
      skills: suggestions.skills ?? currentForm.skills
    };
  };

  const handleApplySuggestions = (suggestions: TAiSuggestions) => {
    const infoData = infoForm.getValues();
    const mergedForm = mergeSuggestions(suggestions);
    submitResume(
      { ...infoData, ...mergedForm },
      {
        onSuccess: (data) => {
          setSelectedResumeId(data.id);
        }
      }
    );
  };

  const handleCreateNewVersion = (suggestions: TAiSuggestions) => {
    const infoData = infoForm.getValues();
    const mergedForm = mergeSuggestions(suggestions);
    submitResume(
      {
        ...infoData,
        ...mergedForm,
        id: undefined,
        title: suggestions.title ?? `${infoData.title} (AI Tailored)`
      },
      {
        onSuccess: (data) => {
          setSelectedResumeId(data.id);
        }
      }
    );
  };

  return (
    <SidebarProvider>
      <FormProvider {...infoForm}>
        <AppSidebar
          onResumeSelect={handleResumeSelect}
          onCreateNew={handleCreateNew}
          onDelete={handleDeleteResume}
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
              resumeId={selectedResumeId}
              onApplySuggestions={handleApplySuggestions}
              onCreateNewVersion={handleCreateNewVersion}
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
