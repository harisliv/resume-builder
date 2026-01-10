'use client';

import type { TResumeData } from '@/types';
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

export default function ResumePreview({ data }: { data: TResumeData }) {
  const { personalInfo, experience, education, skills } = data;

  const hasContent =
    personalInfo?.fullName ||
    (experience && experience.length > 0) ||
    (education && education.length > 0) ||
    (skills && skills.length > 0);

  if (!hasContent) {
    return (
      <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200 min-h-[600px] flex items-center justify-center">
        <div className="text-center p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl text-slate-600 font-light">
            Your resume preview will appear here
          </p>
          <p className="text-sm mt-3 text-slate-400">
            Start filling out the form to see your resume come to life
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900 rounded-xl overflow-auto max-h-[800px] shadow-lg border border-slate-200">
      <div className="px-6 py-5 border-b border-slate-200">
        <h1 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-between text-[9px]">
          {personalInfo?.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-1 text-slate-600 hover:text-cyan-600 transition-colors group"
            >
              <span className="p-1 rounded-md bg-slate-100 group-hover:bg-cyan-100 transition-colors">
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
              className="flex items-center gap-1 text-slate-600 hover:text-cyan-600 transition-colors group"
            >
              <span className="p-1 rounded-md bg-slate-100 group-hover:bg-cyan-100 transition-colors">
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
              className="flex items-center gap-1 text-slate-600 hover:text-cyan-600 transition-colors group"
            >
              <span className="p-1 rounded-md bg-slate-100 group-hover:bg-cyan-100 transition-colors">
                <Globe className="h-3 w-3" />
              </span>
              Portfolio
            </a>
          )}
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {personalInfo?.summary && (
          <div className="relative pl-3 border-l-2 border-cyan-500">
            <p className="text-slate-600 leading-relaxed text-[10px]">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-sm">
                <Briefcase className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">
                Experience
              </h2>
            </div>
            <div className="space-y-2.5 relative pl-1.5">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-5">
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-cyan-500 shadow-sm" />
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 hover:border-cyan-300 transition-colors">
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-1">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-[11px]">
                          {exp.position}
                        </h3>
                        <p className="text-cyan-600 text-[10px] font-semibold">
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
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 shadow-sm">
                <GraduationCap className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">
                Education
              </h2>
            </div>
            <div className="space-y-2">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-lg p-3 border border-slate-200 hover:border-violet-300 transition-colors"
                >
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-[11px]">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-violet-600 text-[10px] font-semibold">
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
                        <p className="text-[8px] text-fuchsia-500 mt-0.5 font-medium">
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
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">
                Skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-[9px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hover:border-cyan-400 hover:text-cyan-600 transition-all cursor-default"
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
