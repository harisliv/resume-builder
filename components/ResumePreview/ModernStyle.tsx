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
      className="rounded-xl border border-slate-200 bg-white text-slate-900"
      style={{ fontFamily }}
    >
      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-between text-[9px]">
          {personalInfo?.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="group flex items-center gap-1 text-slate-600 transition-opacity hover:opacity-80"
            >
              <span className="rounded-md bg-slate-100 p-1 transition-colors group-hover:bg-slate-200">
                <Mail className="h-3 w-3" />
              </span>
              {personalInfo.email}
            </a>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center gap-1 text-slate-600">
              <span className="rounded-md bg-slate-100 p-1">
                <Phone className="h-3 w-3" />
              </span>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center gap-1 text-slate-600">
              <span className="rounded-md bg-slate-100 p-1">
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
              className="group flex items-center gap-1 text-slate-600 transition-opacity hover:opacity-80"
            >
              <span className="rounded-md bg-slate-100 p-1 transition-colors group-hover:bg-slate-200">
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
              className="group flex items-center gap-1 text-slate-600 transition-opacity hover:opacity-80"
            >
              <span className="rounded-md bg-slate-100 p-1 transition-colors group-hover:bg-slate-200">
                <Globe className="h-3 w-3" />
              </span>
              Portfolio
            </a>
          )}
        </div>
      </div>

      <div className="space-y-5 px-6 py-5">
        {personalInfo?.summary && (
          <div
            className="relative border-l-2 pl-3"
            style={{ borderColor: palette.summary }}
          >
            <p className="text-[10px] leading-relaxed text-slate-600">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div
                className="rounded-lg p-1.5 shadow-sm"
                style={{ backgroundColor: palette.experience }}
              >
                <Briefcase className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">
                Experience
              </h2>
            </div>
            <div className="relative space-y-2.5 pl-1.5">
              {experience.map((exp: TExperience, index: number) => (
                <div key={index} className="relative pl-5">
                  <div
                    className="absolute top-1.5 left-0 h-3 w-3 rounded-full border-2 bg-white shadow-sm"
                    style={{ borderColor: palette.experience }}
                  />
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-1">
                      <div>
                        <h3 className="text-[11px] font-semibold text-slate-900">
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
                        <p className="font-mono text-[8px] text-slate-400">
                          {exp.startDate} →{' '}
                          {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] leading-relaxed text-slate-500">
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
            <div className="mb-3 flex items-center gap-2">
              <div
                className="rounded-lg p-1.5 shadow-sm"
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
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-1">
                    <div>
                      <h3 className="text-[11px] font-semibold text-slate-900">
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
                      <p className="font-mono text-[8px] text-slate-400">
                        {edu.graduationDate}
                      </p>
                      {edu.gpa && (
                        <p
                          className="mt-0.5 text-[8px] font-medium"
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
            <div className="mb-3 flex items-center gap-2">
              <div
                className="rounded-lg p-1.5 shadow-sm"
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
                  className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[9px] text-slate-600"
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
