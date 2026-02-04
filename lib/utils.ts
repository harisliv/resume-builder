import type { Doc } from '@/convex/_generated/dataModel';
import {
  resumeFormDefaultValues,
  resumeInfoDefaultValues,
  type TResumeData
} from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertConvexIdToId = (
  data: Doc<'resumes'> | null
): TResumeData | null => {
  if (!data) return null;
  const {
    _id,
    userId,
    title,
    personalInfo,
    experience,
    education,
    skills,
    documentStyle
  } = data;
  return {
    id: _id,
    userId,
    title: title ?? resumeInfoDefaultValues.title,
    documentStyle: documentStyle ?? resumeInfoDefaultValues.documentStyle,
    personalInfo: personalInfo ?? resumeFormDefaultValues.personalInfo,
    experience: experience ?? resumeFormDefaultValues.experience,
    education: education ?? resumeFormDefaultValues.education,
    skills: skills ?? resumeFormDefaultValues.skills
  };
};
