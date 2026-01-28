import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './auth';
import {
  documentStyleValidator,
  educationValidator,
  experienceValidator,
  personalInfoValidator
} from './validators';

const resumeValidator = v.object({
  _id: v.id('resumes'),
  _creationTime: v.number(),
  userId: v.optional(v.string()),
  title: v.string(),
  personalInfo: v.optional(personalInfoValidator),
  experience: v.optional(v.array(experienceValidator)),
  education: v.optional(v.array(educationValidator)),
  skills: v.optional(v.array(v.string())),
  documentStyle: documentStyleValidator
});

export const createResume = mutation({
  args: {
    title: v.string(),
    personalInfo: v.optional(personalInfoValidator),
    experience: v.optional(v.array(experienceValidator)),
    education: v.optional(v.array(educationValidator)),
    skills: v.optional(v.array(v.string())),
    documentStyle: documentStyleValidator
  },
  returns: v.id('resumes'),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const resumeId = await ctx.db.insert('resumes', {
      userId,
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
    title: v.string(),
    personalInfo: v.optional(personalInfoValidator),
    experience: v.optional(v.array(experienceValidator)),
    education: v.optional(v.array(educationValidator)),
    skills: v.optional(v.array(v.string())),
    documentStyle: documentStyleValidator
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== userId) {
      throw new Error('Unauthorized: Resume does not belong to user');
    }
    const { id, ...updates } = args;
    await ctx.db.replace(id, { userId, ...updates });
    return null;
  }
});

export const deleteResume = mutation({
  args: {
    id: v.id('resumes')
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== userId) {
      throw new Error('Unauthorized: Resume does not belong to user');
    }
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
  args: {},
  returns: v.array(resumeValidator),
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    return await ctx.db
      .query('resumes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
  }
});

export const getAllResumes = query({
  args: {},
  returns: v.array(resumeValidator),
  handler: async (ctx) => {
    await getAuthenticatedUser(ctx);
    return await ctx.db.query('resumes').order('desc').collect();
  }
});

export const listResumeTitles = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('resumes'),
      title: v.string()
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    const resumes = await ctx.db
      .query('resumes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    return resumes.map((resume) => ({
      _id: resume._id,
      title: resume.title
    }));
  }
});

export const getResumeById = query({
  args: {
    id: v.id('resumes')
  },
  returns: v.union(resumeValidator, v.null()),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== userId) {
      return null;
    }
    return resume;
  }
});
