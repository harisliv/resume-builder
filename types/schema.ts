import type { Id } from '@/convex/_generated/dataModel';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as z from 'zod';
import { documentStyleSchema } from './documentStyle';

export const personalInfoSchema = z.object({
  fullName: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  email: z.email().optional().or(z.literal('')),
  phone: z
    .string()
    .refine((value) => isValidPhoneNumber(value), {
      message: 'Invalid phone number'
    })
    .optional()
    .or(z.literal('')),
  location: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  linkedIn: z.url().max(500, 'Max 500 chars').optional().or(z.literal('')),
  website: z.url().max(500, 'Max 500 chars').optional().or(z.literal('')),
  summary: z.string().max(2000, 'Max 2000 chars').optional().or(z.literal(''))
});

export const experienceSchema = z.object({
  company: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  position: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  location: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean().optional(),
  description: z
    .string()
    .max(2000, 'Max 2000 chars')
    .optional()
    .or(z.literal('')),
  highlights: z
    .array(z.object({ value: z.string().max(500, 'Max 500 chars') }))
    .max(5)
    .optional()
});

export const educationSchema = z.object({
  institution: z
    .string()
    .max(100, 'Max 100 chars')
    .optional()
    .or(z.literal('')),
  degree: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  field: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  location: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  graduationDate: z.string().optional().or(z.literal('')),
  gpa: z.string().max(100, 'Max 100 chars').optional().or(z.literal(''))
});

const resumeIdSchema = z.custom<Id<'resumes'>>(
  (value) => typeof value === 'string'
);

export const resumeInfoSchema = z.object({
  id: resumeIdSchema.optional(),
  userId: z.string().optional(),
  title: z.string().min(1, 'Resume title is required').max(100, 'Max 100 chars'),
  documentStyle: documentStyleSchema
});

export const skillsSchema = z.object({
  name: z.string().max(50, 'Max 50 chars'),
  values: z.array(z.object({ value: z.string().max(50, 'Max 50 chars') })).max(10)
});

export const resumeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).max(5),
  education: z.array(educationSchema).max(5),
  skills: z.array(skillsSchema).max(5)
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
    palette: 'aesthetic' as const,
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
