import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import {
  customSectionValidator,
  documentStyleValidator,
  educationValidator,
  experienceValidator,
  personalInfoValidator,
  skillsValidator
} from './validators';

export default defineSchema({
  resumes: defineTable({
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
  }).index('by_user', ['userId']),

  /** Tracks per-user usage attempts for quota enforcement (AI daily, PDF monthly). */
  aiAttempts: defineTable({
    userId: v.string(),
    type: v.optional(v.string()),
    dateKey: v.string(),
    count: v.number()
  })
    .index('by_user_date', ['userId', 'dateKey'])
    .index('by_user_type_date', ['userId', 'type', 'dateKey']),

  /** Stored system prompts for AI generation. */
  systemPrompts: defineTable({
    type: v.string(),
    content: v.string()
  }).index('by_type', ['type']),

  /** Persistent AI improvement thread per resume. One active thread per resume. */
  aiThreads: defineTable({
    resumeId: v.id('resumes'),
    userId: v.string(),
    status: v.union(v.literal('active'), v.literal('completed'))
  }).index('by_resume_and_user', ['resumeId', 'userId']),

  /** Messages in an AI improvement thread. */
  aiThreadMessages: defineTable({
    threadId: v.id('aiThreads'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
    /** Structured payload from assistant (questions, resume patch). */
    structuredPayload: v.optional(
      v.object({
        questions: v.optional(v.array(v.union(v.string(), v.object({ question: v.string(), context: v.string() })))),
        resumePatch: v.optional(v.string()),
        isReadyToApply: v.optional(v.boolean())
      })
    )
  }).index('by_thread', ['threadId'])
});
