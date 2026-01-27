'use client';

import { PDFViewer } from '@react-pdf/renderer';
import ResumeDocument from '@/lib/ResumePDF/ResumeDocument';
import type { TCombinedResumeData } from '@/types';

export default function PDFViewerSection({
  formData,
  infoData
}: TCombinedResumeData) {
  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <ResumeDocument formData={formData} infoData={infoData} />
    </PDFViewer>
  );
}
