'use client';

import { Document, PDFViewer } from '@react-pdf/renderer';
import { AestheticDocument } from '@/lib/ResumePDF/documents/AestheticDocument';
import type { TResumeData } from '@/types/schema';

interface AestheticPDFViewerProps {
  data: TResumeData;
}

export default function AestheticPDFViewer({ data }: AestheticPDFViewerProps) {
  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <Document>
        <AestheticDocument data={data} />
      </Document>
    </PDFViewer>
  );
}
