'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import type { TEducation, TExperience } from '@/types';
import type { IStyleProps } from './types';

export function BoldStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div
      className="border-0 bg-white text-slate-900 shadow-xl"
      style={{ fontFamily }}
    >
      <div className="px-6 py-6" style={{ backgroundColor: palette.summary }}>
        <h1 className="text-3xl font-black tracking-tight text-white">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/90">
          {personalInfo?.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-5 px-6 py-5">
        {personalInfo?.summary && (
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: `${palette.summary}15` }}
          >
            <p className="text-[10px] leading-relaxed font-medium text-slate-700">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <h2
              className="mb-3 flex items-center gap-2 text-base font-black tracking-wide uppercase"
              style={{ color: palette.experience }}
            >
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: palette.experience }}
              />
              Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp: TExperience, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border-l-4 p-3"
                  style={{
                    borderColor: palette.experience,
                    backgroundColor: `${palette.experience}08`
                  }}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <h3 className="text-[12px] font-bold text-slate-900">
                        {exp.position}
                      </h3>
                      <p
                        className="text-[11px] font-bold"
                        style={{ color: palette.experience }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-medium text-slate-500">
                        {exp.location}
                      </p>
                      <p className="font-mono text-[8px] font-bold text-slate-400">
                        {exp.startDate} →{' '}
                        {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                  </div>
                  <p className="text-[9px] leading-relaxed text-slate-600">
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
              className="mb-3 flex items-center gap-2 text-base font-black tracking-wide uppercase"
              style={{ color: palette.education }}
            >
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: palette.education }}
              />
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu: TEducation, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border-l-4 p-3"
                  style={{
                    borderColor: palette.education,
                    backgroundColor: `${palette.education}08`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-900">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p
                        className="text-[10px] font-bold"
                        style={{ color: palette.education }}
                      >
                        {edu.institution}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-slate-500">
                        {edu.location}
                      </p>
                      <p className="font-mono text-[8px] font-bold text-slate-400">
                        {edu.graduationDate}
                      </p>
                      {edu.gpa && (
                        <p
                          className="mt-0.5 text-[9px] font-bold"
                          style={{ color: palette.skills }}
                        >
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div>
            <h2
              className="mb-3 flex items-center gap-2 text-base font-black tracking-wide uppercase"
              style={{ color: palette.skills }}
            >
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: palette.skills }}
              />
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="rounded-full px-3 py-1.5 text-[9px] font-semibold text-white"
                  style={{ backgroundColor: palette.skills }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
