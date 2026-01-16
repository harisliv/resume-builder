'use client';

import { createContext, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema, type TResumeData, resumeDefaultValues } from '@/types';
import { useResumeSubmit } from '@/hooks/useResumeSubmit';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import type { Id } from '@/convex/_generated/dataModel';
import type * as z from 'zod';
import { generateResumePDF } from '@/lib/ResumePDF/generateResumePDF';

type ResumeFormContextType = {
  selectedResumeId: Id<'resumes'> | undefined;
  setSelectedResumeId: (id: Id<'resumes'> | undefined) => void;
  resumeTitles: { id: string; title: string }[] | undefined;
  isLoadingTitles: boolean;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  handleResumeSelect: (value: string) => void;
  onSubmit: (data: TResumeData) => void;
  handleDownload: () => void;
  handleCreateNew: (title?: string) => void;
};

const ResumeFormContext = createContext<ResumeFormContextType | null>(null);

export function useResumeFormContext() {
  const context = useContext(ResumeFormContext);
  if (!context) {
    throw new Error(
      'useResumeFormContext must be used within a ResumeFormProvider'
    );
  }
  return context;
}

export function ResumeFormProvider({
  children
}: {
  children: React.ReactNode;
}) {
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

  const handleDownload = () => {
    const formData = form.getValues();
    generateResumePDF(formData, formData.documentStyle);
  };

  const handleCreateNew = (title?: string) => {
    const newResumeData: TResumeData = {
      ...resumeDefaultValues,
      userId: user?.id,
      title: title ?? 'Untitled Resume'
    };
    submitResume(newResumeData, {
      onSuccess: (data) => {
        form.reset({ ...newResumeData, id: data.id });
        setSelectedResumeId(data.id);
      }
    });
  };

  return (
    <ResumeFormContext.Provider
      value={{
        selectedResumeId,
        setSelectedResumeId,
        resumeTitles,
        isLoadingTitles,
        isPending,
        isError,
        error,
        handleResumeSelect,
        onSubmit,
        handleDownload,
        handleCreateNew
      }}
    >
      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="contents"
        >
          {children}
        </form>
      </FormProvider>
    </ResumeFormContext.Provider>
  );
}
