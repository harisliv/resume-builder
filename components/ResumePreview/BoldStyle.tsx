'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import type { TEducation, TExperience } from '@/types';
import type { IStyleProps } from './types';

export function BoldStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div
      className="bg-white text-slate-900 shadow-xl border-0"
      style={{ fontFamily }}
    >
      <div className="px-6 py-6" style={{ backgroundColor: palette.summary }}>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-white/90">
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

      <div className="px-6 py-5 space-y-5">
        {personalInfo?.summary && (
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: `${palette.summary}15` }}
          >
            <p className="text-[10px] text-slate-700 leading-relaxed font-medium">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <h2
              className="text-base font-black uppercase tracking-wide mb-3 flex items-center gap-2"
              style={{ color: palette.experience }}
            >
              <div
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: palette.experience }}
              />
              Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp: TExperience, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border-l-4"
                  style={{
                    borderColor: palette.experience,
                    backgroundColor: `${palette.experience}08`
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-slate-900 text-[12px]">
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
                      <p className="text-[8px] text-slate-500 font-medium">
                        {exp.location}
                      </p>
                      <p className="text-[8px] text-slate-400 font-mono font-bold">
                        {exp.startDate} →{' '}
                        {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-600 leading-relaxed">
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
              className="text-base font-black uppercase tracking-wide mb-3 flex items-center gap-2"
              style={{ color: palette.education }}
            >
              <div
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: palette.education }}
              />
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu: TEducation, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border-l-4"
                  style={{
                    borderColor: palette.education,
                    backgroundColor: `${palette.education}08`
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-[11px]">
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
                      <p className="text-[8px] text-slate-400 font-mono font-bold">
                        {edu.graduationDate}
                      </p>
                      {edu.gpa && (
                        <p
                          className="text-[9px] mt-0.5 font-bold"
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
              className="text-base font-black uppercase tracking-wide mb-3 flex items-center gap-2"
              style={{ color: palette.skills }}
            >
              <div
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: palette.skills }}
              />
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="text-[9px] px-3 py-1.5 rounded-full text-white font-semibold"
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
