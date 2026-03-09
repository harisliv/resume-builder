import type { FieldErrors } from 'react-hook-form';
import type { TResumeForm } from '@/types/schema';

const formSections: Array<keyof TResumeForm> = [
  'personalInfo',
  'experience',
  'education',
  'skills'
];

const sectionLabels: Record<keyof TResumeForm, string> = {
  personalInfo: 'Personal Information',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills'
};

/** Returns the first invalid top-level form section. */
function getInvalidSection(errors: FieldErrors<TResumeForm>) {
  for (const section of formSections) {
    if (errors[section]) return sectionLabels[section];
  }
  return undefined;
}

/** Returns the first nested RHF error message found in the error tree. */
function getFirstErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;

  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  if (Array.isArray(error)) {
    for (const item of error) {
      const message = getFirstErrorMessage(item);
      if (message) return message;
    }
    return undefined;
  }

  for (const value of Object.values(error)) {
    const message = getFirstErrorMessage(value);
    if (message) return message;
  }

  return undefined;
}

/** Builds the invalid-submit toast description from RHF errors. */
export function getInvalidSubmitDescription(errors: FieldErrors<TResumeForm>) {
  const invalidSection = getInvalidSection(errors);
  const firstErrorMessage = getFirstErrorMessage(errors);

  if (invalidSection && firstErrorMessage) {
    return `${invalidSection}: ${firstErrorMessage}`;
  }

  if (invalidSection) {
    return `Check ${invalidSection}.`;
  }

  return firstErrorMessage ?? 'Review highlighted fields and try again.';
}
