'use client';

import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  Calendar
} from 'lucide-react';
import type { TEducation, TExperience } from '@/types/schema';
import type { IStyleProps } from './types';

const AESTHETIC_NEUTRALS = {
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  cardBg: '#f8fafc'
};

/** Converts hex to rgba with alpha for subtle fills. */
const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const int = Number.parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Preview component matching AestheticDocument PDF layout */
export function AestheticStyle({ data, palette, fontFamily }: IStyleProps) {
  const { personalInfo, experience, education, skills } = data;
  const AESTHETIC = {
    ...AESTHETIC_NEUTRALS,
    primary: palette.summary,
    primaryLight: palette.skills,
    secondary: palette.experience,
    accent: palette.education,
    primaryTint: hexToRgba(palette.summary, 0.12),
    accentTint: hexToRgba(palette.education, 0.12)
  };

  return (
    <div className="bg-[#fafafa] text-slate-900" style={{ fontFamily }}>
      {/* Header with accent bar */}
      <div className="px-6 pt-5 pb-4">
        <div
          className="mb-6 rounded-sm"
          style={{ height: 4, backgroundColor: AESTHETIC.primary }}
        />
        <h1
          className="mb-1 text-[32px] leading-tight font-bold tracking-tight"
          style={{ color: AESTHETIC.textPrimary }}
        >
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <p
          className="text-[14px] font-medium"
          style={{ color: AESTHETIC.primary }}
        >
          Senior Software Engineer
        </p>

        {/* Contact pills with icons */}
        <div className="mt-2 flex flex-wrap gap-3">
          {personalInfo?.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 transition-opacity hover:opacity-80"
              style={{ borderWidth: 1, borderColor: AESTHETIC.border }}
            >
              <Mail size={10} color={AESTHETIC.primary} />
              <span className="text-[9px]" style={{ color: AESTHETIC.primary }}>
                {personalInfo.email}
              </span>
            </a>
          )}
          {personalInfo?.phone && (
            <span
              className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1"
              style={{ borderWidth: 1, borderColor: AESTHETIC.border }}
            >
              <Phone size={10} color={AESTHETIC.primary} />
              <span
                className="text-[9px]"
                style={{ color: AESTHETIC.textSecondary }}
              >
                {personalInfo.phone}
              </span>
            </span>
          )}
          {personalInfo?.location && (
            <span
              className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1"
              style={{ borderWidth: 1, borderColor: AESTHETIC.border }}
            >
              <MapPin size={10} color={AESTHETIC.primary} />
              <span
                className="text-[9px]"
                style={{ color: AESTHETIC.textSecondary }}
              >
                {personalInfo.location}
              </span>
            </span>
          )}
          {personalInfo?.linkedIn && (
            <a
              href={personalInfo.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 transition-opacity hover:opacity-80"
              style={{ borderWidth: 1, borderColor: AESTHETIC.border }}
            >
              <Linkedin size={10} color={AESTHETIC.primary} />
              <span className="text-[9px]" style={{ color: AESTHETIC.primary }}>
                LinkedIn
              </span>
            </a>
          )}
          {personalInfo?.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 transition-opacity hover:opacity-80"
              style={{ borderWidth: 1, borderColor: AESTHETIC.border }}
            >
              <Globe size={10} color={AESTHETIC.primary} />
              <span className="text-[9px]" style={{ color: AESTHETIC.primary }}>
                Portfolio
              </span>
            </a>
          )}
        </div>
      </div>

      <div className="space-y-5 px-6 pb-5">
        {/* Summary with accent border */}
        {personalInfo?.summary && (
          <div
            className="pl-4"
            style={{ borderLeft: `3px solid ${AESTHETIC.primary}` }}
          >
            <p
              className="text-[10px] leading-[1.7]"
              style={{ color: AESTHETIC.textSecondary }}
            >
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: AESTHETIC.primaryTint }}
              >
                <Briefcase size={14} color={AESTHETIC.primary} />
              </div>
              <h2
                className="text-[16px] font-semibold"
                style={{ color: AESTHETIC.textPrimary }}
              >
                Experience
              </h2>
            </div>
            <div className="space-y-2.5">
              {experience.map((exp: TExperience, index: number) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-3.5"
                  style={{ borderWidth: 1, borderColor: AESTHETIC.border }}
                >
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-1">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="h-2.5 w-[2.5px] shrink-0"
                          style={{ backgroundColor: AESTHETIC.primary }}
                        />
                        <h3
                          className="text-[12px] font-semibold"
                          style={{ color: AESTHETIC.textPrimary }}
                        >
                          {exp.position}
                        </h3>
                      </div>
                      <p
                        className="text-[10px] font-semibold"
                        style={{ color: AESTHETIC.secondary }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Calendar size={8} color={AESTHETIC.secondary} />
                        <p
                          className="text-[8px] font-bold"
                          style={{ color: AESTHETIC.accent }}
                        >
                          {exp.startDate}{' '}
                          <span style={{ color: AESTHETIC.secondary }}>→</span>{' '}
                          {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      <p
                        className="text-[8px]"
                        style={{ color: AESTHETIC.textMuted }}
                      >
                        {exp.location}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p
                      className="mt-2 text-[9px] leading-[1.6]"
                      style={{ color: AESTHETIC.textSecondary }}
                    >
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex gap-1.5 text-[9px] leading-[1.6]"
                          style={{ color: AESTHETIC.textSecondary }}
                        >
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

        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: AESTHETIC.primaryTint }}
              >
                <GraduationCap size={14} color={AESTHETIC.primary} />
              </div>
              <h2
                className="text-[16px] font-semibold"
                style={{ color: AESTHETIC.textPrimary }}
              >
                Education
              </h2>
            </div>
            <div className="space-y-2">
              {education.map((edu: TEducation, index: number) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-3"
                  style={{ borderWidth: 1, borderColor: AESTHETIC.border }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-1">
                    <div>
                      <h3
                        className="mb-0.5 text-[11px] font-semibold"
                        style={{ color: AESTHETIC.textPrimary }}
                      >
                        {edu.degree} in {edu.field}
                      </h3>
                      <p
                        className="text-[10px] font-semibold"
                        style={{ color: AESTHETIC.secondary }}
                      >
                        {edu.institution}
                      </p>
                      {edu.gpa && (
                        <span
                          className="mt-1 inline-block rounded px-1.5 py-0.5 text-[8px]"
                          style={{
                            color: AESTHETIC.accent,
                            backgroundColor: AESTHETIC.accentTint
                          }}
                        >
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Calendar size={8} color={AESTHETIC.secondary} />
                        <p
                          className="text-[8px] font-bold"
                          style={{ color: AESTHETIC.accent }}
                        >
                          {edu.graduationDate}
                        </p>
                      </div>
                      <p
                        className="text-[8px]"
                        style={{ color: AESTHETIC.textMuted }}
                      >
                        {edu.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: AESTHETIC.primaryTint }}
              >
                <Sparkles size={14} color={AESTHETIC.primary} />
              </div>
              <h2
                className="text-[16px] font-semibold"
                style={{ color: AESTHETIC.textPrimary }}
              >
                Skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="text-accent rounded-full px-3 py-1.5 text-[9px]"
                  style={{ backgroundColor: AESTHETIC.primaryLight }}
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
