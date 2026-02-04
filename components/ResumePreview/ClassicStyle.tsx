'use client';

import type { TEducation, TExperience } from '@/types';
import type { IStyleProps } from './types';

export function ClassicStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div
      className="border border-slate-200 bg-white text-slate-900 shadow-lg"
      style={{ fontFamily }}
    >
      <div className="border-b-2 border-slate-300 px-8 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold tracking-wide text-slate-900 uppercase">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9px] text-slate-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.location && <span>• {personalInfo.location}</span>}
          {personalInfo?.linkedIn && <span>• LinkedIn</span>}
          {personalInfo?.website && <span>• Portfolio</span>}
        </div>
      </div>

      <div className="space-y-4 px-8 py-5">
        {personalInfo?.summary && (
          <div>
            <h2
              className="mb-2 border-b pb-1 text-xs font-bold tracking-widest uppercase"
              style={{ borderColor: palette.summary, color: palette.summary }}
            >
              Professional Summary
            </h2>
            <p className="text-[10px] leading-relaxed text-slate-700">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <h2
              className="mb-3 border-b pb-1 text-xs font-bold tracking-widest uppercase"
              style={{
                borderColor: palette.experience,
                color: palette.experience
              }}
            >
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp: TExperience, index: number) => (
                <div key={index}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[11px] font-bold text-slate-900">
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
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <h2
              className="mb-3 border-b pb-1 text-xs font-bold tracking-widest uppercase"
              style={{
                borderColor: palette.education,
                color: palette.education
              }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu: TEducation, index: number) => (
                <div key={index}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[11px] font-bold text-slate-900">
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
            <h2
              className="mb-2 border-b pb-1 text-xs font-bold tracking-widest uppercase"
              style={{ borderColor: palette.skills, color: palette.skills }}
            >
              Skills
            </h2>
            <p className="text-[9px] leading-relaxed text-slate-700">
              {skills.join(' • ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
