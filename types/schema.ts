import type { Id } from '@/convex/_generated/dataModel';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as z from 'zod';
import { documentStyleSchema } from './documentStyle';

export const personalInfoSchema = z.object({
  fullName: z.string().optional().or(z.literal('')),
  email: z.email().optional().or(z.literal('')),
  phone: z
    .string()
    .refine((value) => isValidPhoneNumber(value), {
      message: 'Invalid phone number'
    })
    .optional()
    .or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  linkedIn: z.url().optional().or(z.literal('')),
  website: z.url().optional().or(z.literal('')),
  summary: z.string().optional().or(z.literal(''))
});

export const experienceSchema = z.object({
  company: z.string().optional().or(z.literal('')),
  position: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean().optional(),
  description: z.string().optional().or(z.literal('')),
  highlights: z.array(z.string()).optional()
});

export const educationSchema = z.object({
  institution: z.string().optional().or(z.literal('')),
  degree: z.string().optional().or(z.literal('')),
  field: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  graduationDate: z.string().optional().or(z.literal('')),
  gpa: z.string().optional().or(z.literal(''))
});

const resumeIdSchema = z.custom<Id<'resumes'>>(
  (value) => typeof value === 'string'
);

export const resumeInfoSchema = z.object({
  id: resumeIdSchema.optional(),
  userId: z.string().optional(),
  title: z.string().min(1, 'Resume title is required'),
  documentStyle: documentStyleSchema
});

export const resumeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string())
});

export const resumeSchema = resumeInfoSchema.merge(resumeFormSchema);

export const personalInfoDefaultValues = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedIn: '',
  website: '',
  summary: ''
};

export const experienceDefaultValues = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: []
};

export const educationDefaultValues = {
  institution: '',
  degree: '',
  field: '',
  location: '',
  graduationDate: '',
  gpa: ''
};

export const resumeInfoDefaultValues = {
  title: '',
  documentStyle: {
    palette: 'ocean' as const,
    font: 'inter' as const,
    style: 'modern' as const
  }
};

export const resumeFormDefaultValues = {
  personalInfo: personalInfoDefaultValues,
  experience: [experienceDefaultValues],
  education: [educationDefaultValues],
  skills: []
};

export const resumeDefaultValues = {
  ...resumeInfoDefaultValues,
  ...resumeFormDefaultValues
};

export type TResumeInfo = z.infer<typeof resumeInfoSchema>;
export type TResumeForm = z.infer<typeof resumeFormSchema>;
export type TResumeData = z.infer<typeof resumeSchema>;
export type TPersonalInfo = z.infer<typeof personalInfoSchema>;
export type TExperience = z.infer<typeof experienceSchema>;
export type TEducation = z.infer<typeof educationSchema>;

export type TCombinedResumeData = {
  formData: TResumeForm;
  infoData: TResumeInfo;
};
