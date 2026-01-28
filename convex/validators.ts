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
  company: v.optional(v.string()),
  position: v.optional(v.string()),
  location: v.optional(v.string()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  current: v.optional(v.boolean()),
  description: v.optional(v.string()),
  highlights: v.optional(v.array(v.string()))
});

export const educationValidator = v.object({
  institution: v.optional(v.string()),
  degree: v.optional(v.string()),
  field: v.optional(v.string()),
  location: v.optional(v.string()),
  graduationDate: v.optional(v.string()),
  gpa: v.optional(v.string())
});

export const documentStyleValidator = v.object({
  palette: v.union(
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
    v.literal('modern'),
    v.literal('classic'),
    v.literal('minimal'),
    v.literal('bold')
  )
});
