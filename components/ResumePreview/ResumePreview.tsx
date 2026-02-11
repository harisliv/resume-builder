'use client';

import type { TResumeForm, TResumeInfo } from '@/types/schema';
import { COLOR_PALETTES, FONT_OPTIONS } from '@/types/documentStyle';
import { ModernStyle } from './ModernStyle';
import { ClassicStyle } from './ClassicStyle';
import { MinimalStyle } from './MinimalStyle';
import { BoldStyle } from './BoldStyle';
import { getPreviewData } from './utils';

interface IResumePreviewProps {
  formData: TResumeForm;
  infoData: TResumeInfo;
}

function getPreviewComponent({ formData, infoData }: IResumePreviewProps) {
  const previewData = getPreviewData(formData);
  const { documentStyle } = infoData;
  const palette = COLOR_PALETTES[documentStyle?.palette ?? 'ocean'];
  const font = FONT_OPTIONS[documentStyle?.font ?? 'inter'];
  const style = documentStyle?.style ?? 'modern';
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

  if (style === 'minimal') {
    return (
      <MinimalStyle
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

  return (
    <ModernStyle data={previewData} palette={palette} fontFamily={fontFamily} />
  );
}

export default function ResumePreview({
  formData,
  infoData
}: IResumePreviewProps) {
  const previewComponent = getPreviewComponent({ formData, infoData });

  return <div className="h-full min-h-0 overflow-auto">{previewComponent}</div>;
}
