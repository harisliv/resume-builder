'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { getAuthenticatedUser } from './auth';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { suggestionsSchema } from '../types/aiSuggestions';

const suggestionsValidator = v.object({
  summary: v.optional(v.string()),
  experience: v.optional(
    v.array(
      v.object({
        description: v.optional(v.string()),
        highlights: v.optional(v.array(v.string()))
      })
    )
  ),
  skills: v.optional(v.array(v.string()))
});

const SYSTEM_PROMPT = `You are a resume tailoring assistant. Given a resume and a job description, suggest targeted improvements.

Rules:
- Only suggest changes for: summary, experience[].description, experience[].highlights, and skills
- Never touch education, company names, position titles, dates, or personal info
- For experience, refine descriptions and highlights to better align with the job description. Do not fabricate experience.
- For skills, add relevant skills from the job description or refine existing ones
- For summary, tailor it to the target role
- Return ONLY valid JSON matching this schema:
{
  "summary": "string (optional)",
  "experience": [{ "description": "string (optional)", "highlights": ["string"] }] (optional),
  "skills": ["string"] (optional)
}
- The experience array must match the same order and length as the input resume's experience array
- Omit fields you have no suggestions for`;

export const generateResumeSuggestions = action({
  args: {
    resumeId: v.id('resumes'),
    jobDescription: v.string()
  },
  returns: suggestionsValidator,
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);

    const resume = await ctx.runQuery(internal.resumes.getResumeInternal, {
      resumeId: args.resumeId,
      userId
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    const resumeContent = {
      summary: resume.personalInfo?.summary,
      experience: resume.experience?.map((exp) => ({
        company: exp.company,
        position: exp.position,
        description: exp.description,
        highlights: exp.highlights
      })),
      skills: resume.skills
    };

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: SYSTEM_PROMPT,
      prompt: `Resume:\n${JSON.stringify(resumeContent, null, 2)}\n\nJob Description:\n${args.jobDescription}`
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const parsed = suggestionsSchema.parse(JSON.parse(jsonMatch[0]));
    return parsed;
  }
});
