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
  }).index('by_user_date', ['userId', 'dateKey'])
});
