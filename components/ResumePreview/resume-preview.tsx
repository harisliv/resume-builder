'use client';

import type { TResumeData, TDocumentStyle } from '@/types';
import { COLOR_PALETTES, FONT_OPTIONS } from '@/types';
import { Sparkles } from 'lucide-react';
import { ModernStyle } from './ModernStyle';
import { ClassicStyle } from './ClassicStyle';
import { MinimalStyle } from './MinimalStyle';
import { BoldStyle } from './BoldStyle';

interface IResumePreviewProps {
  data: TResumeData;
  style?: TDocumentStyle;
}

export default function ResumePreview({ data, style }: IResumePreviewProps) {
  const { personalInfo, experience, education, skills } = data;
  const palette = COLOR_PALETTES[style?.palette ?? 'ocean'];
  const font = FONT_OPTIONS[style?.font ?? 'inter'];
  const documentStyle = style?.style ?? 'modern';
  const fontFamily = `var(${font.cssVariable}), sans-serif`;

  const hasContent =
    personalInfo?.fullName ||
    (experience && experience.length > 0) ||
    (education && education.length > 0) ||
    (skills && skills.length > 0);

  if (!hasContent) {
    return (
      <div
        className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200 min-h-[600px] flex items-center justify-center"
        style={{ fontFamily }}
      >
        <div className="text-center p-12">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(to bottom right, ${palette.summary}, ${palette.experience})`
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl text-slate-600 font-light">
            Your resume preview will appear here
          </p>
          <p className="text-sm mt-3 text-slate-400">
            Start filling out the form to see your resume come to life
          </p>
        </div>
      </div>
    );
  }

  if (documentStyle === 'classic') {
    return (
      <ClassicStyle data={data} palette={palette} fontFamily={fontFamily} />
    );
  }

  if (documentStyle === 'minimal') {
    return (
      <MinimalStyle data={data} palette={palette} fontFamily={fontFamily} />
    );
  }

  if (documentStyle === 'bold') {
    return <BoldStyle data={data} palette={palette} fontFamily={fontFamily} />;
  }

  return <ModernStyle data={data} palette={palette} fontFamily={fontFamily} />;
}
