'use client';

import { PDFViewer } from '@react-pdf/renderer';
import ResumeDocument from '@/lib/ResumePDF/ResumeDocument';
import ResumePreview from '@/components/ResumePreview/resume-preview';
import { extendedMockResumeData } from '@/lib/ResumePDF/mockdata';

export default function ComparePage() {
  const data = extendedMockResumeData;

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
            <ResumePreview data={data} />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2 text-center">
            PDF Preview (PDFViewer)
          </h2>
          <div className="flex-1 rounded-lg shadow-lg overflow-hidden">
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              <ResumeDocument data={data} />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
}
