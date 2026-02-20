'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import type { TEducation, TExperience } from '@/types/schema';
import type { IStyleProps } from './types';

export function ExecutiveStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div
      className="flex min-h-full bg-white text-slate-900"
      style={{ fontFamily }}
    >
      <div
        className="w-[30%] px-5 py-6 flex-shrink-0"
        style={{ backgroundColor: palette.summary }}
      >
        <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
          {personalInfo?.fullName || 'Your Name'}
        </h1>

        <div className="mt-5 space-y-2">
          {personalInfo?.email && (
            <div className="flex items-center gap-2 text-[9px] text-white/90">
              <Mail className="h-3 w-3 text-white/70 flex-shrink-0" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center gap-2 text-[9px] text-white/90">
              <Phone className="h-3 w-3 text-white/70 flex-shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center gap-2 text-[9px] text-white/90">
              <MapPin className="h-3 w-3 text-white/70 flex-shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>

        {skills && skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="text-[8px] px-2.5 py-1 rounded-full text-white font-medium"
                  style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-[70%] px-6 py-6 space-y-5">
        {personalInfo?.summary && (
          <div>
            <h2
              className="text-[11px] font-bold uppercase tracking-widest mb-2"
              style={{ color: palette.summary }}
            >
              Summary
            </h2>
            <p className="text-[9px] text-slate-600 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <h2
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: palette.experience }}
            >
              Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp: TExperience, index: number) => (
                <div
                  key={index}
                  className="border-l-2 pl-3"
                  style={{ borderColor: palette.experience }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-[11px]">
                        {exp.position}
                      </h3>
                      <p
                        className="text-[10px] font-semibold"
                        style={{ color: palette.experience }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-[8px] text-slate-500">
                        {exp.location}
                      </p>
                      <p className="text-[8px] text-slate-400 font-mono">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-600 leading-relaxed mt-1">
                    {exp.description}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-[9px] text-slate-600 leading-relaxed flex gap-1.5">
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
            <h2
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: palette.education }}
            >
              Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu: TEducation, index: number) => (
                <div
                  key={index}
                  className="border-l-2 pl-3"
                  style={{ borderColor: palette.education }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-[11px]">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p
                        className="text-[10px] font-semibold"
                        style={{ color: palette.education }}
                      >
                        {edu.institution}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-[8px] text-slate-500">
                        {edu.location}
                      </p>
                      <p className="text-[8px] text-slate-400 font-mono">
                        {edu.graduationDate}
                      </p>
                      {edu.gpa && (
                        <p
                          className="text-[8px] mt-0.5 font-medium"
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
      </div>
    </div>
  );
}
