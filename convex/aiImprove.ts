import { nanoid } from 'nanoid';
import { v } from 'convex/values';
import { internalMutation, internalQuery, mutation } from './_generated/server';
import { getAuthenticatedUser } from './auth';

const structuredPayloadValidator = v.optional(
  v.object({
    questions: v.optional(v.array(v.union(v.string(), v.object({
      question: v.string(),
      context: v.string(),
      targetType: v.union(v.literal('highlight'), v.literal('description'), v.literal('summary')),
      experienceId: v.optional(v.string()),
      highlightId: v.optional(v.string())
    })))),
    resumePatch: v.optional(v.string()),
    toolCallEdits: v.optional(v.string()),
    isReadyToApply: v.optional(v.boolean())
  })
);

/** Creates a new AI improvement thread for a resume. Completes any prior active threads. */
export const createThread = mutation({
  args: { resumeId: v.id('resumes') },
  returns: v.id('aiThreads'),
  handler: async (ctx, { resumeId }) => {
    const userId = await getAuthenticatedUser(ctx);
    const resume = await ctx.db.get(resumeId);
    if (!resume || resume.userId !== userId) {
      throw new Error('Resume not found or unauthorized');
    }
    /** Complete any prior active threads for this resume. */
    const existing = await ctx.db
      .query('aiThreads')
      .withIndex('by_resume_and_user', (q) =>
        q.eq('resumeId', resumeId).eq('userId', userId)
      )
      .collect();
    for (const thread of existing) {
      if (thread.status === 'active') {
        await ctx.db.patch(thread._id, { status: 'completed' });
      }
    }
    return await ctx.db.insert('aiThreads', {
      resumeId,
      userId,
      status: 'active'
    });
  }
});

/** Appends a user message to the thread. */
export const sendUserMessage = mutation({
  args: {
    threadId: v.id('aiThreads'),
    content: v.string()
  },
  returns: v.id('aiThreadMessages'),
  handler: async (ctx, { threadId, content }) => {
    const userId = await getAuthenticatedUser(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== userId) {
      throw new Error('Thread not found or unauthorized');
    }
    return await ctx.db.insert('aiThreadMessages', {
      threadId,
      role: 'user',
      content
    });
  }
});

/** Applies accepted AI edits to the current resume in-place. */
export const applyImproveEdits = mutation({
  args: {
    threadId: v.id('aiThreads'),
    edits: v.string()
  },
  returns: v.null(),
  handler: async (ctx, { threadId, edits: editsJson }) => {
    const userId = await getAuthenticatedUser(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== userId) {
      throw new Error('Thread not found or unauthorized');
    }
    const resume = await ctx.db.get(thread.resumeId);
    if (!resume || resume.userId !== userId) {
      throw new Error('Resume not found or unauthorized');
    }

    const edits = JSON.parse(editsJson) as {
      type: string;
      experienceId?: string;
      highlightId?: string;
      categoryId?: string;
      newValue?: string;
      value?: string;
      newValues?: string[];
    }[];

    let personalInfo = resume.personalInfo;
    let experience = resume.experience;

    for (const edit of edits) {
      switch (edit.type) {
        case 'updateSummary':
          personalInfo = personalInfo
            ? { ...personalInfo, summary: edit.newValue ?? '' }
            : personalInfo;
          break;
        case 'updateHighlight':
          experience = experience?.map((exp: { id: string; highlights?: { id: string; value: string }[]; [k: string]: unknown }) => {
            if (exp.id !== edit.experienceId) return exp;
            return {
              ...exp,
              highlights: exp.highlights?.map((h: { id: string; value: string }) =>
                h.id === edit.highlightId ? { ...h, value: edit.newValue ?? '' } : h
              )
            };
          });
          break;
        case 'updateDescription':
          experience = experience?.map((exp: { id: string; [k: string]: unknown }) => {
            if (exp.id !== edit.experienceId) return exp;
            return { ...exp, description: edit.newValue ?? '' };
          });
          break;
      }
    }

    await ctx.db.patch(thread.resumeId, { personalInfo, experience, isAiImproved: true });
    await ctx.db.patch(threadId, { status: 'completed' });
    return null;
  }
});

/** Internal: get thread with messages for action use. */
export const getThreadContext = internalQuery({
  args: { threadId: v.id('aiThreads'), userId: v.string() },
  returns: v.union(
    v.object({
      thread: v.object({
        _id: v.id('aiThreads'),
        resumeId: v.id('resumes'),
        userId: v.string(),
        status: v.union(v.literal('active'), v.literal('completed'))
      }),
      messages: v.array(
        v.object({
          role: v.union(v.literal('user'), v.literal('assistant')),
          content: v.string()
        })
      ),
      resume: v.any()
    }),
    v.null()
  ),
  handler: async (ctx, { threadId, userId }) => {
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== userId) return null;
    const resume = await ctx.db.get(thread.resumeId);
    if (!resume || resume.userId !== userId) return null;
    const messages = await ctx.db
      .query('aiThreadMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .collect();
    return {
      thread: {
        _id: thread._id,
        resumeId: thread.resumeId,
        userId: thread.userId,
        status: thread.status
      },
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      resume
    };
  }
});

/** Creates a new resume version with accumulated keyword edits applied. */
export const applyKeywordEdits = mutation({
  args: {
    resumeId: v.id('resumes'),
    title: v.string(),
    highlightEdits: v.array(v.object({
      experienceId: v.string(),
      highlightId: v.string(),
      newText: v.string()
    })),
    skillAdditions: v.array(v.object({
      categoryId: v.string(),
      categoryName: v.string(),
      value: v.string()
    }))
  },
  returns: v.id('resumes'),
  handler: async (ctx, { resumeId, title, highlightEdits, skillAdditions }) => {
    const userId = await getAuthenticatedUser(ctx);
    const resume = await ctx.db.get(resumeId);
    if (!resume || resume.userId !== userId) throw new Error('Resume not found');

    const experience = resume.experience?.map((exp: { id: string; highlights?: { id: string; value: string }[]; [key: string]: unknown }) => {
      const editsForExp = highlightEdits.filter(e => e.experienceId === exp.id);
      if (!editsForExp.length) return exp;
      return {
        ...exp,
        highlights: exp.highlights?.map((h: { id: string; value: string }) => {
          const edit = editsForExp.find(e => e.highlightId === h.id);
          return edit ? { ...h, value: edit.newText } : h;
        })
      };
    });

    const skills = resume.skills?.map((cat: { id: string; name: string; values: { id: string; value: string }[] }) => {
      const additions = skillAdditions.filter(a => a.categoryId === cat.id);
      if (!additions.length) return cat;
      return {
        ...cat,
        values: [
          ...cat.values,
          ...additions.map(a => ({ id: nanoid(), value: a.value }))
        ]
      };
    });

    const existingCategoryIds = new Set((resume.skills ?? []).map((cat: { id: string }) => cat.id));
    const newCategories = skillAdditions
      .filter(addition => !existingCategoryIds.has(addition.categoryId))
      .reduce<{ id: string; name: string; values: { id: string; value: string }[] }[]>(
        (categories, addition) => {
          const existing = categories.find((category) => category.id === addition.categoryId);
          if (existing) {
            existing.values.push({ id: nanoid(), value: addition.value });
            return categories;
          }

          categories.push({
            id: addition.categoryId,
            name: addition.categoryName,
            values: [{ id: nanoid(), value: addition.value }]
          });
          return categories;
        },
        []
      );

    return await ctx.db.insert('resumes', {
      userId,
      title,
      personalInfo: resume.personalInfo,
      experience,
      education: resume.education,
      skills: [...(skills ?? []), ...newCategories],
      customSections: resume.customSections,
      documentStyle: resume.documentStyle,
      isAiImproved: true
    });
  }
});

/** Internal: save assistant message to thread. */
export const saveAssistantMessage = internalMutation({
  args: {
    threadId: v.id('aiThreads'),
    content: v.string(),
    structuredPayload: structuredPayloadValidator
  },
  returns: v.null(),
  handler: async (ctx, { threadId, content, structuredPayload }) => {
    await ctx.db.insert('aiThreadMessages', {
      threadId,
      role: 'assistant',
      content,
      structuredPayload
    });
    return null;
  }
});
