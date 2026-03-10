import { v } from 'convex/values';
import { internalMutation, internalQuery, mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './auth';

const structuredPayloadValidator = v.optional(
  v.object({
    roastItems: v.optional(v.array(v.string())),
    questions: v.optional(v.array(v.union(v.string(), v.object({ question: v.string(), context: v.string() })))),
    resumePatch: v.optional(v.string()),
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

/** Lists messages for a thread, ordered by creation time. */
export const listThreadMessages = query({
  args: { threadId: v.id('aiThreads') },
  returns: v.array(
    v.object({
      _id: v.id('aiThreadMessages'),
      _creationTime: v.number(),
      threadId: v.id('aiThreads'),
      role: v.union(v.literal('user'), v.literal('assistant')),
      content: v.string(),
      structuredPayload: structuredPayloadValidator
    })
  ),
  handler: async (ctx, { threadId }) => {
    const userId = await getAuthenticatedUser(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== userId) {
      throw new Error('Thread not found or unauthorized');
    }
    return await ctx.db
      .query('aiThreadMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .collect();
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

/** Creates a new AI-improved resume clone from the original + patch. */
export const applyImprovements = mutation({
  args: {
    threadId: v.id('aiThreads'),
    resumePatch: v.string(),
    title: v.string()
  },
  returns: v.id('resumes'),
  handler: async (ctx, { threadId, resumePatch, title }) => {
    const userId = await getAuthenticatedUser(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== userId) {
      throw new Error('Thread not found or unauthorized');
    }
    const resume = await ctx.db.get(thread.resumeId);
    if (!resume || resume.userId !== userId) {
      throw new Error('Resume not found or unauthorized');
    }

    const patch = JSON.parse(resumePatch);

    /** Clone base fields from original resume. */
    const personalInfo = resume.personalInfo
      ? { ...resume.personalInfo, ...(patch.summary && { summary: patch.summary }) }
      : resume.personalInfo;

    const experience = patch.experience && resume.experience
      ? resume.experience.map(
          (exp: Record<string, unknown>, idx: number) => {
            const patchExp = patch.experience?.[idx];
            if (!patchExp) return exp;
            return {
              ...exp,
              ...(patchExp.description && { description: patchExp.description }),
              ...(patchExp.highlights && {
                highlights: patchExp.highlights.map((h: string) => ({
                  value: h
                }))
              })
            };
          }
        )
      : resume.experience;

    const skills = patch.skills
      ? patch.skills.map(
          (cat: { name: string; values: string[] }) => ({
            name: cat.name,
            values: cat.values.map((val: string) => ({ value: val }))
          })
        )
      : resume.skills;

    const newResumeId = await ctx.db.insert('resumes', {
      userId,
      title,
      personalInfo,
      experience,
      education: resume.education,
      skills,
      documentStyle: resume.documentStyle,
      isAiImproved: true
    });

    await ctx.db.patch(threadId, { status: 'completed' });
    return newResumeId;
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
