import type { Doc } from '@/convex/_generated/dataModel';
import { resumeDefaultValues } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertConvexIdToId = (data: Doc<'resumes'> | null) => {
  if (!data) return resumeDefaultValues;
  return {
    id: data._id,
    ...data
  };
};
