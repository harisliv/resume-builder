import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  resumes: defineTable({
    userId: v.optional(v.string()),
    title: v.string(),
    personalInfo: v.object({
      fullName: v.string(),
      email: v.string(),
      phone: v.string(),
      location: v.string(),
      linkedIn: v.optional(v.string()),
      website: v.optional(v.string()),
      summary: v.string()
    }),
    experience: v.array(
      v.object({
        company: v.string(),
        position: v.string(),
        location: v.string(),
        startDate: v.string(),
        endDate: v.optional(v.string()),
        current: v.optional(v.boolean()),
        description: v.string()
      })
    ),
    education: v.array(
      v.object({
        institution: v.string(),
        degree: v.string(),
        field: v.string(),
        location: v.string(),
        graduationDate: v.string(),
        gpa: v.optional(v.string())
      })
    ),
    skills: v.array(v.string()),
    documentStyle: v.object({
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
    })
  }).index('by_user', ['userId'])
});
