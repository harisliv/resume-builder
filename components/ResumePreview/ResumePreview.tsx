'use client';

import type { TResumeForm, TResumeInfo } from '@/types';
import { COLOR_PALETTES, FONT_OPTIONS } from '@/types';
import { Sparkles } from 'lucide-react';
import { ModernStyle } from './ModernStyle';
import { ClassicStyle } from './ClassicStyle';
import { MinimalStyle } from './MinimalStyle';
import { BoldStyle } from './BoldStyle';

interface IResumePreviewProps {
  formData: TResumeForm;
  infoData: TResumeInfo;
}

export default function ResumePreview({
  formData,
  infoData
}: IResumePreviewProps) {
  const { personalInfo, experience, education, skills } = formData;
  const { documentStyle } = infoData;
  const palette = COLOR_PALETTES[documentStyle?.palette ?? 'ocean'];
  const font = FONT_OPTIONS[documentStyle?.font ?? 'inter'];
  const style = documentStyle?.style ?? 'modern';
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
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

  if (style === 'classic') {
    return (
      <ClassicStyle data={formData} palette={palette} fontFamily={fontFamily} />
    );
  }

  if (style === 'minimal') {
    return (
      <MinimalStyle data={formData} palette={palette} fontFamily={fontFamily} />
    );
  }

  if (style === 'bold') {
    return (
      <BoldStyle data={formData} palette={palette} fontFamily={fontFamily} />
    );
  }

  return (
    <ModernStyle data={formData} palette={palette} fontFamily={fontFamily} />
  );
}
