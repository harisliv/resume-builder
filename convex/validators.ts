import { v } from 'convex/values';

export const personalInfoValidator = v.object({
  fullName: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  location: v.optional(v.string()),
  linkedIn: v.optional(v.string()),
  website: v.optional(v.string()),
  summary: v.optional(v.string())
});

export const experienceValidator = v.object({
  id: v.string(),
  company: v.optional(v.string()),
  position: v.optional(v.string()),
  projectName: v.optional(v.string()),
  location: v.optional(v.string()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  current: v.optional(v.boolean()),
  description: v.optional(v.string()),
  highlights: v.optional(
    v.array(v.object({ id: v.string(), value: v.string() }))
  )
});

export const educationValidator = v.object({
  id: v.string(),
  institution: v.optional(v.string()),
  degree: v.optional(v.string()),
  field: v.optional(v.string()),
  location: v.optional(v.string()),
  graduationDate: v.optional(v.string()),
  current: v.optional(v.boolean()),
  gpa: v.optional(v.string())
});

/** Validator for a skill category with named values. */
export const skillsValidator = v.object({
  id: v.string(),
  name: v.string(),
  values: v.array(v.object({ id: v.string(), value: v.string() }))
});

/** Validator for a single item in a custom section. */
export const customSectionItemValidator = v.object({
  id: v.string(),
  title: v.string(),
  subtitle: v.optional(v.string()),
  from: v.optional(v.string()),
  to: v.optional(v.string()),
  location: v.optional(v.string()),
  description: v.optional(v.string())
});

/** Validator for a custom resume section (e.g., Hobbies, Certifications). */
export const customSectionValidator = v.object({
  id: v.string(),
  sectionTitle: v.string(),
  items: v.array(customSectionItemValidator)
});

export const documentStyleValidator = v.object({
  palette: v.union(
    v.literal('aesthetic'),
    v.literal('ocean'),
    v.literal('forest'),
    v.literal('sunset'),
    v.literal('midnight'),
    v.literal('rose'),
    v.literal('monochrome')
  ),
  font: v.union(
    v.literal('inter'),
    v.literal('roboto'),
    v.literal('opensans'),
    v.literal('lato'),
    v.literal('playfair'),
    v.literal('merriweather')
  ),
  style: v.union(
    v.literal('classic'),
    v.literal('bold'),
    v.literal('executive')
  )
});
