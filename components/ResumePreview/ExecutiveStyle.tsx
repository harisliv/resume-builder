'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import type { TEducation, TExperience } from '@/types/schema';
import type { IStyleProps } from './types';
import { formatPosition } from './formatPosition';
import { groupExperience } from './groupExperience';
import { getSkillEntries } from '@/lib/skills';

export function ExecutiveStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;
  const skillEntries = getSkillEntries(skills);

  return (
    <div
      className="flex min-h-full bg-white text-slate-900"
      style={{ fontFamily }}
    >
      <div
        className="w-[30%] px-5 py-6 shrink-0"
        style={{ backgroundColor: palette.summary }}
      >
        <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
          {personalInfo?.fullName || 'Your Name'}
        </h1>

        <div className="mt-5 space-y-2">
          {personalInfo?.email && (
            <div className="flex items-center gap-2 text-[9px] text-white/90">
              <Mail className="h-3 w-3 text-white/70 shrink-0" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center gap-2 text-[9px] text-white/90">
              <Phone className="h-3 w-3 text-white/70 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center gap-2 text-[9px] text-white/90">
              <MapPin className="h-3 w-3 text-white/70 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>

        {skillEntries.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-3">
              Skills
            </h2>
            <div className="space-y-2">
              {skillEntries.map(([category, values]) => (
                <div key={category}>
                  <p className="mb-1 text-[8px] font-semibold uppercase tracking-wider text-white/70">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {values.map((skill: string, index: number) => (
                      <span
                        key={`${category}-${index}`}
                        className="text-[8px] px-2.5 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
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
              {groupExperience(experience).map((group, gi) => (
                <div
                  key={gi}
                  className="border-l-2 pl-3"
                  style={{ borderColor: palette.experience }}
                >
                  {/* Company header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-[11px]">
                        {group.company}
                      </h3>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-[8px] text-slate-400 font-mono">
                        {group.startDate} —{' '}
                        {group.current ? 'Present' : group.endDate}
                      </p>
                      {group.location && (
                        <p className="text-[8px] text-slate-500">
                          {group.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Role entries */}
                  <div className="mt-1.5 space-y-2">
                    {group.entries.map((exp, ei) => (
                      <div key={ei}>
                        <p
                          className="font-semibold text-[10px]"
                          style={{ color: palette.experience }}
                        >
                          {formatPosition(exp.position, exp.projectName)}
                        </p>
                        {exp.description && (
                          <p className="text-[9px] text-slate-600 leading-relaxed mt-0.5">
                            {exp.description}
                          </p>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="mt-0.5 space-y-0.5">
                            {exp.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="text-[9px] text-slate-600 leading-relaxed flex gap-1.5"
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
                    <div className="text-right shrink-0 ml-2">
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
