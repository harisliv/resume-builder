'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { PdfUploadDialog } from '@/components/PdfUpload/PdfUploadDialog';
import { MatchJobModal } from '@/components/MatchJob/MatchJobModal';
import { ImproveResumeModal } from '@/components/ImproveResume/ImproveResumeModal';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import { useResumeSubmit } from '@/hooks/useResumeSubmit';
import { useDeleteResume } from '@/hooks/useDeleteResume';
import { useQueryClient } from '@tanstack/react-query';
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
  isPending
}: {
  mobileTab: 'form' | 'preview';
  setMobileTab: (v: 'form' | 'preview') => void;
  formForm: ReturnType<typeof useForm<z.infer<typeof resumeFormSchema>>>;
  infoForm: ReturnType<typeof useForm<z.infer<typeof resumeInfoSchema>>>;
  selectedResumeId: Id<'resumes'> | undefined;
  handleSubmit: (data: z.infer<typeof resumeFormSchema>) => void;
  isPending: boolean;
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
            <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4">
              <TabsContent value="form" className="mt-0 h-full min-w-0">
                <FormProvider {...formForm}>
                  <ResumeForm
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    resumeId={selectedResumeId}
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
  const [matchJobOpen, setMatchJobOpen] = useState(false);
  const [improveOpen, setImproveOpen] = useState(false);

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
  const queryClient = useQueryClient();

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

  /** Select newly created resume (Match Job) and refresh. */
  const handleNewVersionCreated = (newResumeId: Id<'resumes'>) => {
    setSelectedResumeId(newResumeId);
    void queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
    void queryClient.invalidateQueries({ queryKey: ['resume'] });
  };

  /** Refresh data after AI edits applied in-place (Improve). */
  const handleImproveApplied = () => {
    void queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
    void queryClient.invalidateQueries({ queryKey: ['resume'] });
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
          selectedResumeId={selectedResumeId}
          isAiImproved={infoForm.watch('isAiImproved') ?? false}
          onMatchJob={() => setMatchJobOpen(true)}
          onImproveResume={() => setImproveOpen(true)}
        />
      </FormProvider>
      <PdfUploadDialog
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        onParsed={handlePdfParsed}
      />
      {matchJobOpen && selectedResumeId && (
        <MatchJobModal
          open={matchJobOpen}
          onOpenChange={setMatchJobOpen}
          resumeId={selectedResumeId}
          onDone={handleNewVersionCreated}
        />
      )}
      {improveOpen && selectedResumeId && (
        <ImproveResumeModal
          open={improveOpen}
          onOpenChange={setImproveOpen}
          resumeId={selectedResumeId}
          onDone={handleImproveApplied}
        />
      )}
      <SidebarInset>
        <HomeContent
          mobileTab={mobileTab}
          setMobileTab={setMobileTab}
          formForm={formForm}
          infoForm={infoForm}
          selectedResumeId={selectedResumeId}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
