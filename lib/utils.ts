import type { Doc } from '@/convex/_generated/dataModel';
import {
  resumeFormDefaultValues,
  resumeInfoDefaultValues,
  type TResumeData
} from '@/types/schema';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Bullet and symbol characters to strip from user input */
const UNWANTED_CHARS = /[•◦▪▸▹►▻★☆✦✧✓✗✘⁃‣⦿⦾●○◆◇■□–—·]/g;

/**
 * Sanitizes input by stripping bullet/symbol characters.
 * Applied on every keystroke. Trim on submit if needed — trim on keystroke blocks typing spaces.
 */
export function sanitizeInput(value: string): string {
  return value.replace(UNWANTED_CHARS, '');
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
    documentStyle,
    isAiImproved
  } = data;
  return {
    id: _id,
    userId,
    title: title ?? resumeInfoDefaultValues.title,
    documentStyle: documentStyle ?? resumeInfoDefaultValues.documentStyle,
    isAiImproved: isAiImproved ?? false,
    personalInfo: personalInfo ?? resumeFormDefaultValues.personalInfo,
    experience: experience ?? resumeFormDefaultValues.experience,
    education: education ?? resumeFormDefaultValues.education,
    skills: skills ?? resumeFormDefaultValues.skills
  };
};
