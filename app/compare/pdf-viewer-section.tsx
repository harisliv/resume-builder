'use client';

import { PDFViewer } from '@react-pdf/renderer';
import ResumeDocument from '@/lib/ResumePDF/ResumeDocument';
import type { TResumeData } from '@/types';

interface PDFViewerSectionProps {
  data: TResumeData;
}

export default function PDFViewerSection({ data }: PDFViewerSectionProps) {
  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <ResumeDocument data={data} />
    </PDFViewer>
  );
}
