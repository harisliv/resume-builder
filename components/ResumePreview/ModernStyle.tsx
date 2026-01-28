'use client';

import { Linkedin02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import type { TEducation, TExperience } from '@/types';
import type { IStyleProps } from './types';

export function ModernStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;

  return (
    <div
      className="bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200"
      style={{ fontFamily }}
    >
      <div className="px-6 py-5 border-b border-slate-200">
        <h1 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-between text-[9px]">
          {personalInfo?.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-1 text-slate-600 hover:opacity-80 transition-opacity group"
            >
              <span className="p-1 rounded-md bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <Mail className="h-3 w-3" />
              </span>
              {personalInfo.email}
            </a>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center gap-1 text-slate-600">
              <span className="p-1 rounded-md bg-slate-100">
                <Phone className="h-3 w-3" />
              </span>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center gap-1 text-slate-600">
              <span className="p-1 rounded-md bg-slate-100">
                <MapPin className="h-3 w-3" />
              </span>
              {personalInfo.location}
            </span>
          )}
          {personalInfo?.linkedIn && (
            <a
              href={personalInfo.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-600 hover:opacity-80 transition-opacity group"
            >
              <span className="p-1 rounded-md bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <HugeiconsIcon icon={Linkedin02Icon} className="h-3 w-3" />
              </span>
              LinkedIn
            </a>
          )}
          {personalInfo?.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-600 hover:opacity-80 transition-opacity group"
            >
              <span className="p-1 rounded-md bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <Globe className="h-3 w-3" />
              </span>
              Portfolio
            </a>
          )}
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {personalInfo?.summary && (
          <div
            className="relative pl-3 border-l-2"
            style={{ borderColor: palette.summary }}
          >
            <p className="text-slate-600 leading-relaxed text-[10px]">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="p-1.5 rounded-lg shadow-sm"
                style={{ backgroundColor: palette.experience }}
              >
                <Briefcase className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">
                Experience
              </h2>
            </div>
            <div className="space-y-2.5 relative pl-1.5">
              {experience.map((exp: TExperience, index: number) => (
                <div key={index} className="relative pl-5">
                  <div
                    className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
                    style={{ borderColor: palette.experience }}
                  />
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-1">
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
                      <div className="text-right">
                        <p className="text-[8px] text-slate-500">
                          {exp.location}
                        </p>
                        <p className="text-[8px] text-slate-400 font-mono">
                          {exp.startDate} →{' '}
                          {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="p-1.5 rounded-lg shadow-sm"
                style={{ backgroundColor: palette.education }}
              >
                <GraduationCap className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">
                Education
              </h2>
            </div>
            <div className="space-y-2">
              {education.map((edu: TEducation, index: number) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                >
                  <div className="flex justify-between items-start flex-wrap gap-1">
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
                    <div className="text-right">
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

        {skills && skills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="p-1.5 rounded-lg shadow-sm"
                style={{ backgroundColor: palette.skills }}
              >
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">
                Skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="text-[9px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
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
