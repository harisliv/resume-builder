import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import {
  documentStyleValidator,
  educationValidator,
  experienceValidator,
  personalInfoValidator
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
    skills: v.optional(
      v.array(
        v.object({
          name: v.string(),
          values: v.array(v.object({ value: v.string() }))
        })
      )
    ),
    documentStyle: documentStyleValidator
  }).index('by_user', ['userId']),

  /** Tracks per-user per-day AI generation attempts for quota enforcement. */
  aiAttempts: defineTable({
    userId: v.string(),
    dateKey: v.string(),
    count: v.number()
  }).index('by_user_date', ['userId', 'dateKey']),

  /** Stored system prompts and rules for AI generation. */
  systemPrompts: defineTable({
    name: v.string(),
    content: v.string(),
    type: v.optional(v.union(v.literal('prompt'), v.literal('rule'))),
    isDefault: v.optional(v.boolean())
  }).index('by_type_and_default', ['type', 'isDefault']),

  /** Model configurations for AI generation. */
  modelConfigs: defineTable({
    provider: v.union(v.literal('anthropic'), v.literal('google'), v.literal('openai')),
    modelId: v.string(),
    label: v.string(),
    pricing: v.object({ input: v.number(), output: v.number() }),
    isDefault: v.optional(v.boolean())
  }).index('by_default', ['isDefault'])
});
