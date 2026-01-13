import React from 'react';
import { Document } from '@react-pdf/renderer';
import type {
  TResumeData,
  TPaletteId,
  TFontId,
  TDocumentStyleId
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

interface IResumeDocumentProps {
  data: TResumeData;
  palette?: TPaletteId;
  font?: TFontId;
  documentStyle?: TDocumentStyleId;
}

const ResumeDocument: React.FC<IResumeDocumentProps> = ({
  data,
  palette = 'ocean',
  font = 'inter',
  documentStyle = 'modern'
}) => {
  const styles = createStyles(palette, font);
  const colors = getColors(palette);
  const fontFamily = PDF_FONTS[font] || FONT_FAMILY.sans;

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
