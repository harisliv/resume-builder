import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';
import { getAuthenticatedUser, getUserRole } from './auth';
import {
  customSectionValidator,
  documentStyleValidator,
  educationValidator,
  experienceValidator,
  personalInfoValidator,
  skillsValidator
} from './validators';

const resumeValidator = v.object({
  _id: v.id('resumes'),
  _creationTime: v.number(),
  userId: v.optional(v.string()),
  title: v.string(),
  personalInfo: v.optional(personalInfoValidator),
  experience: v.optional(v.array(experienceValidator)),
  education: v.optional(v.array(educationValidator)),
  isDefault: v.optional(v.boolean()),
  isAiImproved: v.optional(v.boolean()),
  skills: v.optional(v.array(skillsValidator)),
  customSections: v.optional(v.array(customSectionValidator)),
  documentStyle: documentStyleValidator
});

export const createResume = mutation({
  args: {
    title: v.string(),
    personalInfo: v.optional(personalInfoValidator),
    experience: v.optional(v.array(experienceValidator)),
    education: v.optional(v.array(educationValidator)),
    skills: v.optional(v.array(skillsValidator)),
    customSections: v.optional(v.array(customSectionValidator)),
    documentStyle: documentStyleValidator,
    isAiImproved: v.optional(v.boolean())
  },
  returns: v.id('resumes'),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);

    /** Enforce resume limit based on role. */
    const role = await getUserRole(ctx);
    const RESUME_LIMITS: Record<string, number> = {
      member: 1,
      basic: 20,
      admin: Infinity
    };
    const maxResumes = RESUME_LIMITS[role ?? 'member'] ?? 1;
    if (maxResumes !== Infinity) {
      const existing = await ctx.db
        .query('resumes')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .collect();
      if (existing.length >= maxResumes) {
        throw new Error(`Resume limit reached (${maxResumes}). Delete one or upgrade.`);
      }
    }

    const resumeId = await ctx.db.insert('resumes', {
      userId,
      title: args.title,
      personalInfo: args.personalInfo,
      experience: args.experience,
      education: args.education,
      skills: args.skills,
      customSections: args.customSections,
      documentStyle: args.documentStyle,
      isAiImproved: args.isAiImproved
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
    skills: v.optional(v.array(skillsValidator)),
    customSections: v.optional(v.array(customSectionValidator)),
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
    await ctx.db.replace(id, {
      userId,
      ...updates,
      isAiImproved: resume.isAiImproved,
      isDefault: resume.isDefault
    });
    return null;
  }
});

/** Rename a resume without requiring all fields. */
export const renameResume = mutation({
  args: {
    id: v.id('resumes'),
    title: v.string()
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== userId) {
      throw new Error('Unauthorized: Resume does not belong to user');
    }
    await ctx.db.patch(args.id, { title: args.title });
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

/** Set a resume as the user's default. Unsets any previous default. */
export const setDefaultResume = mutation({
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

    /** Unset previous default. */
    const userResumes = await ctx.db
      .query('resumes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    for (const r of userResumes) {
      if (r.isDefault) {
        await ctx.db.patch(r._id, { isDefault: false });
      }
    }

    await ctx.db.patch(args.id, { isDefault: true });
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
      title: v.string(),
      isDefault: v.optional(v.boolean()),
      isAiImproved: v.optional(v.boolean())
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
      title: resume.title,
      isDefault: resume.isDefault,
      isAiImproved: resume.isAiImproved
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

export const getResumeInternal = internalQuery({
  args: { resumeId: v.id('resumes'), userId: v.string() },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== args.userId) return null;
    return resume;
  }
});
