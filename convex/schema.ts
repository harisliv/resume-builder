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
    skills: v.optional(v.array(v.string())),
    documentStyle: documentStyleValidator
  }).index('by_user', ['userId'])
});
