import * as z from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().min(1, 'Location is required'),
  linkedIn: z.url('Invalid URL').optional().or(z.literal('')),
  website: z.url('Invalid URL').optional().or(z.literal('')),
  summary: z.string().min(50, 'Summary should be at least 50 characters')
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z
    .string()
    .min(20, 'Description should be at least 20 characters')
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  location: z.string().min(1, 'Location is required'),
  graduationDate: z.string().min(1, 'Graduation date is required'),
  gpa: z.string().optional()
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z
    .array(experienceSchema)
    .min(1, 'At least one experience is required'),
  education: z
    .array(educationSchema)
    .min(1, 'At least one education entry is required'),
  skills: z.array(z.string()).min(3, 'At least 3 skills are required')
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
  personalInfo: personalInfoDefaultValues,
  experience: [],
  education: [],
  skills: []
};

export type TResumeData = z.infer<typeof resumeSchema>;
export type TPersonalInfo = z.infer<typeof personalInfoSchema>;
export type TExperience = z.infer<typeof experienceSchema>;
export type TEducation = z.infer<typeof educationSchema>;
