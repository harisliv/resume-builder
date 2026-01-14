import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const personalInfoValidator = v.object({
  fullName: v.string(),
  email: v.string(),
  phone: v.string(),
  location: v.string(),
  linkedIn: v.optional(v.string()),
  website: v.optional(v.string()),
  summary: v.string()
});

const experienceValidator = v.object({
  company: v.string(),
  position: v.string(),
  location: v.string(),
  startDate: v.string(),
  endDate: v.optional(v.string()),
  current: v.optional(v.boolean()),
  description: v.string()
});

const educationValidator = v.object({
  institution: v.string(),
  degree: v.string(),
  field: v.string(),
  location: v.string(),
  graduationDate: v.string(),
  gpa: v.optional(v.string())
});

const documentStyleValidator = v.object({
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

const resumeValidator = v.object({
  _id: v.id('resumes'),
  _creationTime: v.number(),
  userId: v.optional(v.string()),
  title: v.string(),
  personalInfo: personalInfoValidator,
  experience: v.array(experienceValidator),
  education: v.array(educationValidator),
  skills: v.array(v.string()),
  documentStyle: documentStyleValidator
});

export const createResume = mutation({
  args: {
    userId: v.optional(v.string()),
    title: v.string(),
    personalInfo: personalInfoValidator,
    experience: v.array(experienceValidator),
    education: v.array(educationValidator),
    skills: v.array(v.string()),
    documentStyle: documentStyleValidator
  },
  returns: v.id('resumes'),
  handler: async (ctx, args) => {
    const resumeId = await ctx.db.insert('resumes', {
      userId: args.userId,
      title: args.title,
      personalInfo: args.personalInfo,
      experience: args.experience,
      education: args.education,
      skills: args.skills,
      documentStyle: args.documentStyle
    });
    return resumeId;
  }
});

export const updateResume = mutation({
  args: {
    id: v.id('resumes'),
    userId: v.optional(v.string()),
    title: v.string(),
    personalInfo: personalInfoValidator,
    experience: v.array(experienceValidator),
    education: v.array(educationValidator),
    skills: v.array(v.string()),
    documentStyle: documentStyleValidator
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.replace(id, updates);
    return null;
  }
});

export const deleteResume = mutation({
  args: {
    id: v.id('resumes')
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  }
});

export const getResume = query({
  args: {
    id: v.id('resumes')
  },
  returns: v.union(resumeValidator, v.null()),
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    return resume;
  }
});

export const listResumes = query({
  args: {
    userId: v.optional(v.string())
  },
  returns: v.array(resumeValidator),
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query('resumes')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .collect();
    }
    return await ctx.db.query('resumes').collect();
  }
});

export const getAllResumes = query({
  args: {},
  returns: v.array(resumeValidator),
  handler: async (ctx) => await ctx.db.query('resumes').order('desc').collect()
});
