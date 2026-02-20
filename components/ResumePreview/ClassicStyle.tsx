/**
 * @file ClassicStyle.tsx
 * @description HTML preview component for the Classic resume style.
 * Uses unified section header color (palette.summary), accent-colored position/degree titles,
 * pipe-separated contact info, and subtle bar prefixes on section headers.
 * Must stay visually in sync with lib/ResumePDF/documents/ClassicDocument.tsx.
 */
'use client';

import type { TEducation, TExperience } from '@/types/schema';
import type { IStyleProps } from './types';

/** Pipe separator between contact items */
const ContactSep = () => <span className="text-[8px] text-slate-300"> | </span>;

export function ClassicStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div
      className="border border-slate-200 bg-white text-slate-900 shadow-lg"
      style={{ fontFamily }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-5 text-center">
        <h1 className="text-2xl font-bold tracking-wide text-slate-900 uppercase">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        {/* Name accent line */}
        <div
          className="mx-auto mt-2 rounded-sm"
          style={{ width: 48, height: 2, backgroundColor: palette.summary }}
        />
        <div className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1 text-[9px] text-slate-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && (
            <>
              <ContactSep />
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo?.location && (
            <>
              <ContactSep />
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo?.linkedIn && (
            <>
              <ContactSep />
              <span>LinkedIn</span>
            </>
          )}
          {personalInfo?.website && (
            <>
              <ContactSep />
              <span>Portfolio</span>
            </>
          )}
        </div>
        {/* Double-line divider */}
        <div className="mt-3 flex flex-col gap-[2px]">
          <div className="h-px" style={{ backgroundColor: palette.summary }} />
          <div className="h-px bg-slate-200" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 px-8 py-6">
        {personalInfo?.summary && (
          <div>
            <div
              className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase"
              style={{ color: palette.summary }}
            >
              <div
                className="rounded-sm"
                style={{
                  width: 4,
                  height: 14,
                  backgroundColor: palette.summary
                }}
              />
              Professional Summary
            </div>
            <div className="mb-2 flex flex-col gap-[2px]">
              <div
                className="h-px"
                style={{ backgroundColor: palette.summary }}
              />
              <div className="h-px bg-slate-200" />
            </div>
            <p className="text-[10px] leading-relaxed text-slate-700">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <div
              className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase"
              style={{ color: palette.summary }}
            >
              <div
                className="rounded-sm"
                style={{
                  width: 4,
                  height: 14,
                  backgroundColor: palette.summary
                }}
              />
              Professional Experience
            </div>
            <div className="mb-3 flex flex-col gap-[2px]">
              <div
                className="h-px"
                style={{ backgroundColor: palette.summary }}
              />
              <div className="h-px bg-slate-200" />
            </div>
            <div className="space-y-3">
              {experience.map((exp: TExperience, index: number) => (
                <div key={index}>
                  <div className="flex items-baseline justify-between">
                    <h3
                      className="text-[11px] font-bold"
                      style={{ color: palette.education }}
                    >
                      {exp.position}
                    </h3>
                    <span className="font-mono text-[8px] text-slate-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[10px] text-slate-600 italic">
                      {exp.company}
                    </p>
                    <p className="text-[8px] text-slate-500">{exp.location}</p>
                  </div>
                  <p className="mt-1 text-[9px] leading-relaxed text-slate-600">
                    {exp.description}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex gap-1.5 text-[9px] leading-relaxed text-slate-600"
                        >
                          <span>•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <div
              className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase"
              style={{ color: palette.summary }}
            >
              <div
                className="rounded-sm"
                style={{
                  width: 4,
                  height: 14,
                  backgroundColor: palette.summary
                }}
              />
              Education
            </div>
            <div className="mb-3 flex flex-col gap-[2px]">
              <div
                className="h-px"
                style={{ backgroundColor: palette.summary }}
              />
              <div className="h-px bg-slate-200" />
            </div>
            <div className="space-y-2">
              {education.map((edu: TEducation, index: number) => (
                <div key={index}>
                  <div className="flex items-baseline justify-between">
                    <h3
                      className="text-[11px] font-bold"
                      style={{ color: palette.education }}
                    >
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="font-mono text-[8px] text-slate-500">
                      {edu.graduationDate}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[10px] text-slate-600 italic">
                      {edu.institution}
                    </p>
                    <p className="text-[8px] text-slate-500">{edu.location}</p>
                  </div>
                  {edu.gpa && (
                    <p className="text-[8px] text-slate-600">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div>
            <div
              className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase"
              style={{ color: palette.summary }}
            >
              <div
                className="rounded-sm"
                style={{
                  width: 4,
                  height: 14,
                  backgroundColor: palette.summary
                }}
              />
              Skills
            </div>
            <div className="mb-2 flex flex-col gap-[2px]">
              <div
                className="h-px"
                style={{ backgroundColor: palette.summary }}
              />
              <div className="h-px bg-slate-200" />
            </div>
            <p className="text-[9px] leading-relaxed text-slate-700">
              {skills.join('  |  ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
