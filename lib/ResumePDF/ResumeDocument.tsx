import React from 'react';
import { Document } from '@react-pdf/renderer';
import type {
  TResumeData,
  TPaletteId,
  TFontId,
  TDocumentStyleId,
  TCombinedResumeData
} from '@/types';
import './fonts';
import { createStyles, getColors } from './ResumeStyles';
import { PDF_FONTS, FONT_FAMILY } from './fonts';
import {
  ModernDocument,
  ClassicDocument,
  MinimalDocument,
  BoldDocument
} from './documents';

const ResumeDocument: React.FC<TCombinedResumeData> = ({
  formData,
  infoData
}) => {
  const documentStyle = infoData.documentStyle?.style ?? 'modern';
  const styles = createStyles(
    infoData.documentStyle?.palette,
    infoData.documentStyle?.font
  );
  const colors = getColors(infoData.documentStyle?.palette);
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
      {documentStyle === 'minimal' && (
        <MinimalDocument data={data} colors={colors} fontFamily={fontFamily} />
      )}
      {documentStyle === 'bold' && (
        <BoldDocument data={data} colors={colors} fontFamily={fontFamily} />
      )}
      {documentStyle === 'modern' && (
        <ModernDocument data={data} styles={styles} colors={colors} />
      )}
    </Document>
  );
};

export default ResumeDocument;
