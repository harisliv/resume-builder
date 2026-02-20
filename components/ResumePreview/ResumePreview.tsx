'use client';

import type { TResumeForm, TResumeInfo } from '@/types/schema';
import {
  COLOR_PALETTES,
  FONT_OPTIONS,
  resolvePaletteForStyle
} from '@/types/documentStyle';
import { ClassicStyle } from './ClassicStyle';
import { BoldStyle } from './BoldStyle';
import { ExecutiveStyle } from './ExecutiveStyle';
import { AestheticStyle } from './AestheticStyle';
import { getPreviewData } from './utils';

interface IResumePreviewProps {
  formData: TResumeForm;
  infoData: TResumeInfo;
}

/** Returns the HTML preview component aligned with PDF style routing. */
function getPreviewComponent({ formData, infoData }: IResumePreviewProps) {
  const previewData = getPreviewData(formData);
  const { documentStyle } = infoData;
  const rawStyle = documentStyle?.style ?? 'modern';
  const style = ['modern', 'classic', 'bold', 'executive'].includes(rawStyle)
    ? rawStyle
    : 'modern';
  const paletteId = resolvePaletteForStyle(style, documentStyle?.palette);
  const palette = COLOR_PALETTES[paletteId];
  const font = FONT_OPTIONS[documentStyle?.font ?? 'inter'];
  const fontFamily = `var(${font.cssVariable}), sans-serif`;
  if (style === 'classic') {
    return (
      <ClassicStyle
        data={previewData}
        palette={palette}
        fontFamily={fontFamily}
      />
    );
  }

  if (style === 'bold') {
    return (
      <BoldStyle data={previewData} palette={palette} fontFamily={fontFamily} />
    );
  }

  if (style === 'executive') {
    return (
      <ExecutiveStyle
        data={previewData}
        palette={palette}
        fontFamily={fontFamily}
      />
    );
  }

  if (style === 'modern') {
    return (
      <AestheticStyle
        data={previewData}
        palette={palette}
        fontFamily={fontFamily}
      />
    );
  }

  return (
    <AestheticStyle data={previewData} palette={palette} fontFamily={fontFamily} />
  );
}

export default function ResumePreview({
  formData,
  infoData
}: IResumePreviewProps) {
  const previewComponent = getPreviewComponent({ formData, infoData });

  return <div className="h-full min-h-0 overflow-auto">{previewComponent}</div>;
}
