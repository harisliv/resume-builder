'use client';

import type { TEducation, TExperience } from '@/types';
import type { IStyleProps } from './types';

export function MinimalStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div
      className="bg-white text-slate-900 shadow-sm border border-slate-100"
      style={{ fontFamily }}
    >
      <div className="px-8 py-6">
        <h1 className="text-xl font-light text-slate-800 tracking-tight">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[9px] text-slate-500">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      <div className="px-8 pb-6 space-y-5">
        {personalInfo?.summary && (
          <p className="text-[10px] text-slate-600 leading-relaxed">
            {personalInfo.summary}
          </p>
        )}

        <div className="border-t border-slate-100" />

        {experience && experience.length > 0 && (
          <div>
            <h2
              className="text-[10px] font-medium uppercase tracking-wider mb-3"
              style={{ color: palette.experience }}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp: TExperience, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-medium text-slate-800">
                      {exp.position}
                    </span>
                    <span className="text-[8px] text-slate-400">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500">
                    {exp.company}, {exp.location}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <h2
              className="text-[10px] font-medium uppercase tracking-wider mb-3"
              style={{ color: palette.education }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu: TEducation, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-baseline"
                >
                  <div>
                    <span className="text-[10px] font-medium text-slate-800">
                      {edu.degree} in {edu.field}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {' '}
                      — {edu.institution}
                    </span>
                  </div>
                  <span className="text-[8px] text-slate-400">
                    {edu.graduationDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div>
            <h2
              className="text-[10px] font-medium uppercase tracking-wider mb-2"
              style={{ color: palette.skills }}
            >
              Skills
            </h2>
            <p className="text-[9px] text-slate-600">{skills.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
