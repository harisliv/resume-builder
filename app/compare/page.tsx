'use client';

import dynamic from 'next/dynamic';
import { ResumePreview } from '@/components/ResumePreview';
import { extendedMockResumeData } from '@/lib/ResumePDF/mockdata';
import type { TResumeData } from '@/types';
import { resumeInfoDefaultValues, resumeFormDefaultValues } from '@/types';

const PDFViewerSection = dynamic(
  () =>
    import('@/components/PdfViewer').then((m) => ({
      default: m.PdfViewerSection
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        Loading PDF...
      </div>
    )
  }
);

function splitResumeData(data: TResumeData) {
  const {
    id,
    userId,
    title,
    documentStyle,
    personalInfo,
    experience,
    education,
    skills
  } = data;
  return {
    formData: {
      personalInfo: personalInfo ?? resumeFormDefaultValues.personalInfo,
      experience: experience ?? resumeFormDefaultValues.experience,
      education: education ?? resumeFormDefaultValues.education,
      skills: skills ?? resumeFormDefaultValues.skills
    },
    infoData: {
      id,
      userId,
      title: title ?? resumeInfoDefaultValues.title,
      documentStyle: documentStyle ?? resumeInfoDefaultValues.documentStyle
    }
  };
}

export default function ComparePage() {
  const { formData, infoData } = splitResumeData(extendedMockResumeData);

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        PDF vs Preview Comparison
      </h1>
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-100px)]">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2 text-center">
            HTML Preview (ResumePreview)
          </h2>
          <div className="flex-1 overflow-auto bg-white rounded-lg shadow-lg">
            <ResumePreview formData={formData} infoData={infoData} />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2 text-center">
            PDF Preview (PDFViewer)
          </h2>
          <div className="flex-1 rounded-lg shadow-lg overflow-hidden">
            <PDFViewerSection formData={formData} infoData={infoData} />
          </div>
        </div>
      </div>
    </div>
  );
}
