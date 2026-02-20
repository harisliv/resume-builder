import React from 'react';
import { Document } from '@react-pdf/renderer';
import type { TResumeData, TCombinedResumeData } from '@/types/schema';
import './fonts';
import { getColors } from './ResumeStyles';
import { PDF_FONTS, FONT_FAMILY } from './fonts';
import { resolvePaletteForStyle } from '@/types/documentStyle';
import { AestheticDocument } from './documents/AestheticDocument';
import { ClassicDocument } from './documents/ClassicDocument';
import { BoldDocument } from './documents/BoldDocument';
import { ExecutiveDocument } from './documents/ExecutiveDocument';

const ResumeDocument: React.FC<TCombinedResumeData> = ({
  formData,
  infoData
}) => {
  const rawStyle = infoData.documentStyle?.style ?? 'modern';
  const documentStyle = ['modern', 'classic', 'bold', 'executive'].includes(
    rawStyle
  )
    ? rawStyle
    : 'modern';
  const paletteId = resolvePaletteForStyle(
    documentStyle,
    infoData.documentStyle?.palette
  );
  const colors = getColors(paletteId);
  const fontFamily =
    PDF_FONTS[infoData.documentStyle?.font] || FONT_FAMILY.sans;

  const data: TResumeData = {
    ...infoData,
    ...formData
  };

  return (
    <Document>
      {documentStyle === 'classic' && (
        <ClassicDocument data={data} colors={colors} fontFamily={fontFamily} />
      )}
      {documentStyle === 'bold' && (
        <BoldDocument data={data} colors={colors} fontFamily={fontFamily} />
      )}
      {documentStyle === 'modern' && (
        <AestheticDocument data={data} colors={colors} />
      )}
      {documentStyle === 'executive' && (
        <ExecutiveDocument
          data={data}
          colors={colors}
          fontFamily={fontFamily}
        />
      )}
    </Document>
  );
};

export default ResumeDocument;
