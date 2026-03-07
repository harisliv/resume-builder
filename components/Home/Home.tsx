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
import { PdfUploadDialog } from '@/components/PdfUpload/PdfUploadDialog';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import { useResumeSubmit } from '@/hooks/useResumeSubmit';
import { useDeleteResume } from '@/hooks/useDeleteResume';
import { AppSidebar } from '@/components/AppSidebar';
import ResumeForm from '@/components/ResumeForm';
import { ResumePreviewWrapper } from '@/components/ResumePreview';
import { SidebarInset, SidebarProvider } from '@/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormProvider } from 'react-hook-form';
import { HomeLayout } from './home-layout';
import { MobileHeader } from './MobileHeader';
import { useShowTabs } from '@/hooks/useShowTabs';

/** Inner content that uses useShowTabs (must be inside SidebarProvider). */
function HomeContent({
  mobileTab,
  setMobileTab,
  formForm,
  infoForm,
  selectedResumeId,
  handleSubmit,
  isPending,
  handleApplySuggestions,
  handleCreateNewVersion
}: {
  mobileTab: 'form' | 'preview';
  setMobileTab: (v: 'form' | 'preview') => void;
  formForm: ReturnType<typeof useForm<z.infer<typeof resumeFormSchema>>>;
  infoForm: ReturnType<typeof useForm<z.infer<typeof resumeInfoSchema>>>;
  selectedResumeId: Id<'resumes'> | undefined;
  handleSubmit: (data: z.infer<typeof resumeFormSchema>) => void;
  isPending: boolean;
  handleApplySuggestions: (suggestions: TAiSuggestions) => void;
  handleCreateNewVersion: (suggestions: TAiSuggestions) => void;
}) {
  const showTabs = useShowTabs();

  return (
    <>
      {showTabs && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Tabs
            value={mobileTab}
            onValueChange={(v) => setMobileTab(v as 'form' | 'preview')}
            className="flex min-h-0 min-w-0 flex-1 flex-col"
          >
            <MobileHeader>
              <TabsList className="ml-auto grid min-w-0 flex-1 grid-cols-2">
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </MobileHeader>
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4">
              <TabsContent value="form" className="mt-0 h-full min-w-0">
                <FormProvider {...formForm}>
                  <ResumeForm
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    resumeId={selectedResumeId}
                    onApplySuggestions={handleApplySuggestions}
                    onCreateNewVersion={handleCreateNewVersion}
                  />
                </FormProvider>
              </TabsContent>
              <TabsContent value="preview" className="mt-0 h-full min-w-0">
                <ResumePreviewWrapper
                  formControl={formForm.control}
                  infoControl={infoForm.control}
                  hasSelectedResume={!!selectedResumeId}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
      {!showTabs && (
        <div className="min-h-0 min-w-0 flex-1">
          <HomeLayout>
            <FormProvider {...formForm}>
              <ResumeForm
                onSubmit={handleSubmit}
                isPending={isPending}
                resumeId={selectedResumeId}
                onApplySuggestions={handleApplySuggestions}
                onCreateNewVersion={handleCreateNewVersion}
              />
            </FormProvider>
            <ResumePreviewWrapper
              formControl={formForm.control}
              infoControl={infoForm.control}
              hasSelectedResume={!!selectedResumeId}
            />
          </HomeLayout>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const [selectedResumeId, setSelectedResumeId] = useState<
    Id<'resumes'> | undefined
  >(undefined);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);

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

  const { mutate: submitResume, isPending } = useResumeSubmit();
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

  /** Creates a new resume from parsed PDF data. */
  const handlePdfParsed = (title: string, formData: TResumeForm) => {
    const newResumeData: TResumeData = {
      ...resumeInfoDefaultValues,
      ...formData,
      title
    };
    submitResume(newResumeData, {
      onSuccess: (data) => {
        infoForm.reset({
          ...resumeInfoDefaultValues,
          id: data.id,
          title
        });
        formForm.reset(formData);
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
          highlights: suggestions.experience[idx].highlights.map((h) => ({
            value: h
          }))
        })
      })),
      skills: suggestions.skills
        ? suggestions.skills.map((cat) => ({
            name: cat.name,
            values: cat.values.map((v) => ({ value: v }))
          }))
        : currentForm.skills
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
          onImportPdf={() => setPdfDialogOpen(true)}
          isLoadingResume={isLoadingResume}
        />
      </FormProvider>
      <PdfUploadDialog
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        onParsed={handlePdfParsed}
      />
      <SidebarInset>
        <HomeContent
          mobileTab={mobileTab}
          setMobileTab={setMobileTab}
          formForm={formForm}
          infoForm={infoForm}
          selectedResumeId={selectedResumeId}
          handleSubmit={handleSubmit}
          isPending={isPending}
          handleApplySuggestions={handleApplySuggestions}
          handleCreateNewVersion={handleCreateNewVersion}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
