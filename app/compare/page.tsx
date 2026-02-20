'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import ResumePreview from '@/components/ResumePreview';
import { extendedMockResumeData } from '@/lib/ResumePDF/mockdata';
import type { TResumeData } from '@/types/schema';
import {
  resumeInfoDefaultValues,
  resumeFormDefaultValues
} from '@/types/schema';
import {
  COLOR_PALETTES,
  DOCUMENT_STYLES,
  FONT_OPTIONS,
  type TDocumentStyleId,
  type TFontId,
  type TPaletteId
} from '@/types/documentStyle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const PDFViewerSection = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      Loading PDF...
    </div>
  )
});

/** Splits full resume data into form + info shape expected by preview/PDF components. */
function splitResumeData(data: TResumeData) {
  const {
    id,
    userId,
    title,
    documentStyle,
    personalInfo,
    experience,
    education,
    skills
  } = data;
  return {
    formData: {
      personalInfo: personalInfo ?? resumeFormDefaultValues.personalInfo,
      experience: experience ?? resumeFormDefaultValues.experience,
      education: education ?? resumeFormDefaultValues.education,
      skills: skills ?? resumeFormDefaultValues.skills
    },
    infoData: {
      id,
      userId,
      title: title ?? resumeInfoDefaultValues.title,
      documentStyle: documentStyle ?? resumeInfoDefaultValues.documentStyle
    }
  };
}

const STYLE_IDS = Object.keys(DOCUMENT_STYLES) as TDocumentStyleId[];

/** Syncs style/palette/font into URL search params so they survive reload. */
function syncParams(
  style: TDocumentStyleId,
  palette: TPaletteId,
  font: TFontId
) {
  const url = new URL(window.location.href);
  url.searchParams.set('style', style);
  url.searchParams.set('palette', palette);
  url.searchParams.set('font', font);
  window.history.replaceState({}, '', url.toString());
}

/** Compare page content — uses useSearchParams, must be inside Suspense. */
function ComparePageContent() {
  const searchParams = useSearchParams();
  const [activeStyle, setActiveStyle] = useState<TDocumentStyleId>(
    () => (searchParams.get('style') as TDocumentStyleId) || 'modern'
  );
  const [activePalette, setActivePalette] = useState<TPaletteId>(
    () => (searchParams.get('palette') as TPaletteId) || 'ocean'
  );
  const [activeFont, setActiveFont] = useState<TFontId>(
    () => (searchParams.get('font') as TFontId) || 'inter'
  );
  const { formData, infoData } = splitResumeData(extendedMockResumeData);

  const styledInfoData = {
    ...infoData,
    documentStyle: {
      style: activeStyle,
      palette: activePalette,
      font: activeFont
    }
  };

  /** Palette education color used as accent on the active tab underline */
  const accentColor = COLOR_PALETTES[activePalette].education;

  /** Wrap setter + sync URL params in one call */
  const changeStyle = (s: TDocumentStyleId) => {
    setActiveStyle(s);
    syncParams(s, activePalette, activeFont);
  };
  const changePalette = (p: TPaletteId) => {
    setActivePalette(p);
    syncParams(activeStyle, p, activeFont);
  };
  const changeFont = (f: TFontId) => {
    setActiveFont(f);
    syncParams(activeStyle, activePalette, f);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">
        PDF vs Preview Comparison
      </h1>

      {/* Controls bar */}
      <div className="mb-4 flex items-center justify-center gap-6">
        {/* Style tabs */}
        <div className="flex gap-2">
          {STYLE_IDS.map((id) => (
            <button
              key={id}
              onClick={() => changeStyle(id)}
              className="rounded-t-md px-4 py-2 text-sm font-semibold transition-colors"
              style={
                activeStyle === id
                  ? {
                      borderBottom: `2px solid ${accentColor}`,
                      backgroundColor: '#fff',
                      color: accentColor
                    }
                  : { backgroundColor: '#e2e8f0', color: '#475569' }
              }
            >
              {DOCUMENT_STYLES[id].name}
            </button>
          ))}
        </div>

        {/* Palette dropdown */}
        <Select value={activePalette} onValueChange={(v) => changePalette(v as TPaletteId)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(COLOR_PALETTES).map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <span className="flex gap-0.5">
                    {[p.summary, p.experience, p.education, p.skills].map(
                      (color, i) => (
                        <span
                          key={i}
                          className="block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      )
                    )}
                  </span>
                  {p.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Font dropdown */}
        <Select value={activeFont} onValueChange={(v) => changeFont(v as TFontId)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(FONT_OPTIONS).map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name} ({f.category})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Refresh — full reload, URL params preserve selections */}
        <button
          onClick={() => window.location.reload()}
          className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          Refresh
        </button>
      </div>

      <div className="grid h-[calc(100vh-140px)] grid-cols-2 gap-4">
        <div className="flex flex-col">
          <h2 className="mb-2 text-center text-lg font-semibold">
            HTML Preview (ResumePreview)
          </h2>
          <div className="flex-1 overflow-auto rounded-lg bg-white shadow-lg">
            <ResumePreview formData={formData} infoData={styledInfoData} />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="mb-2 text-center text-lg font-semibold">
            PDF Preview (PDFViewer)
          </h2>
          <div className="flex-1 overflow-hidden rounded-lg shadow-lg">
            <PDFViewerSection formData={formData} infoData={styledInfoData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compare page — tabbed all-styles preview vs PDF side-by-side. */
export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          <p className="text-slate-600">Loading compare...</p>
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
