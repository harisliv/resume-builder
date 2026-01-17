'use client';

import type { IStyleProps } from './types';

export function ClassicStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div
      className="bg-white text-slate-900 shadow-lg border border-slate-200"
      style={{ fontFamily }}
    >
      <div className="px-8 pt-6 pb-4 text-center border-b-2 border-slate-300">
        <h1 className="text-2xl font-bold text-slate-900 tracking-wide uppercase">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[9px] text-slate-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.location && <span>• {personalInfo.location}</span>}
          {personalInfo?.linkedIn && <span>• LinkedIn</span>}
          {personalInfo?.website && <span>• Portfolio</span>}
        </div>
      </div>

      <div className="px-8 py-5 space-y-4">
        {personalInfo?.summary && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ borderColor: palette.summary, color: palette.summary }}
            >
              Professional Summary
            </h2>
            <p className="text-[10px] text-slate-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b"
              style={{
                borderColor: palette.experience,
                color: palette.experience
              }}
            >
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-[11px]">
                      {exp.position}
                    </h3>
                    <span className="text-[8px] text-slate-500 font-mono">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-[10px] text-slate-600 italic">
                      {exp.company}
                    </p>
                    <p className="text-[8px] text-slate-500">{exp.location}</p>
                  </div>
                  <p className="text-[9px] text-slate-600 mt-1 leading-relaxed">
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
              className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b"
              style={{
                borderColor: palette.education,
                color: palette.education
              }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-[11px]">
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-[8px] text-slate-500 font-mono">
                      {edu.graduationDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
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
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ borderColor: palette.skills, color: palette.skills }}
            >
              Skills
            </h2>
            <p className="text-[9px] text-slate-700 leading-relaxed">
              {skills.join(' • ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
