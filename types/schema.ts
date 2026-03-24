import type { Id } from '@/convex/_generated/dataModel';
import { nanoid } from 'nanoid';
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
  id: z.string(),
  company: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  position: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  projectName: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
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
    .array(
      z.object({
        id: z.string(),
        value: z.string().max(500, 'Max 500 chars')
      })
    )
    .max(5)
    .optional()
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z
    .string()
    .max(100, 'Max 100 chars')
    .optional()
    .or(z.literal('')),
  degree: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  field: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  location: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  graduationDate: z.string().optional().or(z.literal('')),
  current: z.boolean().optional(),
  gpa: z.string().max(100, 'Max 100 chars').optional().or(z.literal(''))
});

const resumeIdSchema = z.custom<Id<'resumes'>>(
  (value) => typeof value === 'string'
);

export const resumeInfoSchema = z.object({
  id: resumeIdSchema.optional(),
  userId: z.string().optional(),
  title: z.string().min(1, 'Resume title is required').max(100, 'Max 100 chars'),
  documentStyle: documentStyleSchema,
  isAiImproved: z.boolean().optional()
});

export const skillsSchema = z.object({
  id: z.string(),
  name: z.string().max(50, 'Max 50 chars'),
  values: z
    .array(
      z.object({
        id: z.string(),
        value: z.string().max(150, 'Max 100 chars')
      })
    )
    .max(20, 'Max 20 skills')
});

/** Schema for a single item in a custom section. */
export const customSectionItemSchema = z.object({
  id: z.string(),
  title: z.string().max(100, 'Max 100 chars'),
  subtitle: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  from: z.string().optional().or(z.literal('')),
  to: z.string().optional().or(z.literal('')),
  location: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
  description: z.string().max(2000, 'Max 2000 chars').optional().or(z.literal(''))
});

/** Schema for a custom resume section (e.g., Hobbies, Certifications). */
export const customSectionSchema = z.object({
  id: z.string(),
  sectionTitle: z.string().min(1, 'Section title is required').max(50, 'Max 50 chars'),
  items: z.array(customSectionItemSchema).max(10)
});

export const resumeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).max(5),
  education: z.array(educationSchema).max(5),
  skills: z.array(skillsSchema).max(10),
  customSections: z.array(customSectionSchema).max(3).optional()
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

/** Creates fresh experience defaults with a unique ID. */
export const createExperienceDefaults = () => ({
  id: nanoid(),
  company: '',
  position: '',
  projectName: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: []
});

export const experienceDefaultValues = createExperienceDefaults();

/** Creates fresh education defaults with a unique ID. */
export const createEducationDefaults = () => ({
  id: nanoid(),
  institution: '',
  degree: '',
  field: '',
  location: '',
  graduationDate: '',
  current: false,
  gpa: ''
});

export const educationDefaultValues = createEducationDefaults();

export const resumeInfoDefaultValues = {
  title: '',
  documentStyle: {
    palette: 'aesthetic' as const,
    font: 'inter' as const,
    style: 'modern' as const
  },
  isAiImproved: false
};

/** Creates fresh skills defaults with a unique ID. */
export const createSkillsDefaults = () => ({
  id: nanoid(),
  name: '',
  values: []
});

export const skillsDefaultValues = createSkillsDefaults();

/** Creates fresh custom section item defaults with a unique ID. */
export const createCustomSectionItemDefaults = () => ({
  id: nanoid(),
  title: '',
  subtitle: '',
  from: '',
  to: '',
  location: '',
  description: ''
});

export const customSectionItemDefaultValues = createCustomSectionItemDefaults();

/** Creates fresh custom section defaults with a unique ID. */
export const createCustomSectionDefaults = () => ({
  id: nanoid(),
  sectionTitle: '',
  items: [createCustomSectionItemDefaults()]
});

export const customSectionDefaultValues = createCustomSectionDefaults();

/** Creates fresh resume form defaults with unique IDs on all items. */
export const createResumeFormDefaults = () => ({
  personalInfo: personalInfoDefaultValues,
  experience: [createExperienceDefaults()],
  education: [createEducationDefaults()],
  skills: [],
  customSections: []
});

export const resumeFormDefaultValues = createResumeFormDefaults();

/** Creates fresh resume defaults with unique IDs on all items. */
export const createResumeDefaults = () => ({
  ...resumeInfoDefaultValues,
  ...createResumeFormDefaults()
});

export const resumeDefaultValues = createResumeDefaults();

export type TResumeInfo = z.infer<typeof resumeInfoSchema>;
export type TResumeForm = z.infer<typeof resumeFormSchema>;
export type TResumeData = z.infer<typeof resumeSchema>;
export type TPersonalInfo = z.infer<typeof personalInfoSchema>;
export type TExperience = z.infer<typeof experienceSchema>;
export type TEducation = z.infer<typeof educationSchema>;
export type TCustomSectionItem = z.infer<typeof customSectionItemSchema>;
export type TCustomSection = z.infer<typeof customSectionSchema>;

export type TCombinedResumeData = {
  formData: TResumeForm;
  infoData: TResumeInfo;
};
