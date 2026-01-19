import { isValidPhoneNumber } from 'react-phone-number-input';
import * as z from 'zod';
import { documentStyleSchema } from './documentStyle';

export const personalInfoSchema = z.object({
  fullName: z.string().optional().or(z.literal('')),
  email: z.email().optional().or(z.literal('')),
  phone: z.string().refine((value) => isValidPhoneNumber(value), {
    message: 'Invalid phone number'
  }).optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  linkedIn: z.string().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  summary: z.string().optional().or(z.literal(''))
});

export const experienceSchema = z.object({
  company: z.string().optional().or(z.literal('')),
  position: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean().optional(),
  description: z.string().optional().or(z.literal(''))
});

export const educationSchema = z.object({
  institution: z.string().optional().or(z.literal('')),
  degree: z.string().optional().or(z.literal('')),
  field: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  graduationDate: z.string().optional().or(z.literal('')),
  gpa: z.string().optional().or(z.literal(''))
});

export const resumeSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  title: z.string().min(1, 'Resume title is required'),
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  documentStyle: documentStyleSchema
});

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
  description: ''
};

export const educationDefaultValues = {
  institution: '',
  degree: '',
  field: '',
  location: '',
  graduationDate: '',
  gpa: ''
};

export const resumeDefaultValues = {
  title: '',
  personalInfo: personalInfoDefaultValues,
  experience: [],
  education: [],
  skills: [],
  documentStyle: {
    palette: 'ocean' as const,
    font: 'inter' as const,
    style: 'modern' as const
  }
};

export type TResumeData = z.infer<typeof resumeSchema>;
export type TPersonalInfo = z.infer<typeof personalInfoSchema>;
export type TExperience = z.infer<typeof experienceSchema>;
export type TEducation = z.infer<typeof educationSchema>;
