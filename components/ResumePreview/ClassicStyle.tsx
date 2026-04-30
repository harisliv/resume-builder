/**
 * @file ClassicStyle.tsx
 * @description HTML preview component for the Classic resume style.
 * Uses unified section header color (palette.summary), accent-colored position/degree titles,
 * pipe-separated contact info, and subtle bar prefixes on section headers.
 * Must stay visually in sync with lib/ResumePDF/documents/ClassicDocument.tsx.
 */
'use client';

import { Calendar } from 'lucide-react';
import type { TEducation, TExperience } from '@/types/schema';
import type { IStyleProps } from './types';
import { formatPosition } from './formatPosition';
import { groupExperience } from './groupExperience';
import { getSkillEntries } from '@/lib/skills';

/** Pipe separator between contact items */
const ContactSep = () => <span className="text-[8px] text-slate-300"> | </span>;

/** Experience tones for Classic metadata hierarchy. */
const CLASSIC_EXPERIENCE_TONES = {
  company: '#1e293b',
  location: '#64748b'
} as const;

export function ClassicStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;
  const skillEntries = getSkillEntries(skills);

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

        {skillEntries.length > 0 && (
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
            <div className="space-y-1.5 text-[9px] leading-relaxed text-slate-700">
              {skillEntries.map(([category, values]) => (
                <p key={category}>
                  <span className="font-bold">{category}:</span>{' '}
                  {values.join(', ')}
                </p>
              ))}
            </div>
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
              {groupExperience(experience).map((group, gi) => {
                const [firstEntry, ...restEntries] = group.entries;
                return (
                  <div key={gi}>
                    {/* Company header */}
                    <div className="flex items-baseline justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-[2.5px] shrink-0"
                            style={{ backgroundColor: palette.summary }}
                          />
                          <h3
                            className="text-[11px] font-bold"
                            style={{ color: CLASSIC_EXPERIENCE_TONES.company }}
                          >
                            {group.company}
                          </h3>
                        </div>
                        {firstEntry && (
                          <p
                            className="text-[10px] font-semibold"
                            style={{ color: palette.experience }}
                          >
                            {formatPosition(
                              firstEntry.position,
                              firstEntry.projectName
                            )}
                          </p>
                        )}
                      </div>
                      <div
                        className="shrink-0 text-right"
                        style={{ marginTop: -1 }}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <Calendar size={8} color={palette.experience} />
                          <p
                            className="text-[8px] font-bold"
                            style={{ color: palette.education }}
                          >
                            {group.startDate}{' '}
                            <span style={{ color: palette.experience }}>→</span>{' '}
                            {group.current ? 'Present' : group.endDate}
                          </p>
                        </div>
                        {group.location && (
                          <p
                            className="text-[8px] font-semibold"
                            style={{ color: CLASSIC_EXPERIENCE_TONES.location }}
                          >
                            {group.location}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Role entries */}
                    <div className="mt-1 space-y-2">
                      {firstEntry && (
                        <div>
                          {firstEntry.description && (
                            <p className="mt-0.5 text-[9px] leading-relaxed text-slate-600 italic">
                              {firstEntry.description}
                            </p>
                          )}
                          {firstEntry.highlights &&
                            firstEntry.highlights.length > 0 && (
                              <ul className="mt-0.5 space-y-0.5">
                                {firstEntry.highlights.map((h, i) => (
                                  <li
                                    key={i}
                                    className="flex gap-1.5 text-[9px] leading-relaxed text-slate-600"
                                  >
                                    <span>•</span>
                                    <span>{h.value}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                      )}
                      {restEntries.map((exp, ei) => (
                        <div key={`${gi}-${ei}`}>
                          <p
                            className="text-[10px] font-semibold"
                            style={{ color: palette.experience }}
                          >
                            {formatPosition(exp.position, exp.projectName)}
                          </p>
                          {exp.description && (
                            <p className="mt-0.5 text-[9px] leading-relaxed text-slate-600 italic">
                              {exp.description}
                            </p>
                          )}
                          {exp.highlights && exp.highlights.length > 0 && (
                            <ul className="mt-0.5 space-y-0.5">
                              {exp.highlights.map((h, i) => (
                                <li
                                  key={i}
                                  className="flex gap-1.5 text-[9px] leading-relaxed text-slate-600"
                                >
                                  <span>•</span>
                                  <span>{h.value}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
                <div
                  key={index}
                  className={index < education.length - 1 ? 'mb-4' : ''}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-[2.5px] shrink-0"
                          style={{ backgroundColor: palette.summary }}
                        />
                        <h3
                          className="text-[11px] font-bold"
                          style={{ color: CLASSIC_EXPERIENCE_TONES.company }}
                        >
                          {edu.degree} in {edu.field}
                        </h3>
                      </div>
                    </div>
                    {edu.gpa && (
                      <p
                        className="shrink-0 text-[8px] font-semibold"
                        style={{ color: palette.summary }}
                      >
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                  <div className="mt-1 flex items-start justify-between gap-2">
                    <p
                      className="text-[10px] font-semibold"
                      style={{ color: palette.experience }}
                    >
                      {edu.institution}
                    </p>
                    <div
                      className="shrink-0 text-right"
                      style={{ marginTop: -7 }}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <Calendar size={8} color={palette.experience} />
                        <p
                          className="text-[8px] font-bold"
                          style={{ color: palette.education }}
                        >
                          {edu.current
                            ? edu.graduationDate
                              ? `${edu.graduationDate} (Expected)`
                              : 'Currently studying'
                            : edu.graduationDate}
                        </p>
                      </div>
                      <p
                        className="text-[8px] font-semibold"
                        style={{
                          color: CLASSIC_EXPERIENCE_TONES.location,
                          lineHeight: 1.1
                        }}
                      >
                        {edu.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
