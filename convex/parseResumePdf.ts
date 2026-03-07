'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import { v } from 'convex/values';
import { parsedResumeSchema } from '../types/pdfParse';
import { action } from './_generated/server';
import { getAuthenticatedUser } from './auth';

const PARSE_SYSTEM_PROMPT = `You are a resume parser. Extract structured data from the raw text of a PDF resume.

Rules:
- Extract ALL information faithfully. Do not invent or embellish.
- For dates, use formats like "Jan 2023", "2023", "Present", etc.
- Set "current" to true if the experience has no end date or says "Present".
- Group skills into logical categories (e.g., "Programming Languages", "Tools", "Soft Skills").
- If a field is not found in the text, return an empty string "" for it. Never return null.
- For highlights, extract bullet points or key achievements from each experience.
- Generate a short descriptive title from the person's name or most recent role.
- Parse phone numbers as-is from the document.`;

/**
 * Parses raw PDF text into structured resume data using AI.
 * Called after client-side text extraction.
 */
export const parseResumePdf = action({
  args: {
    rawText: v.string()
  },
  returns: v.object({
    title: v.string(),
    personalInfo: v.object({
      fullName: v.string(),
      email: v.string(),
      phone: v.string(),
      location: v.string(),
      linkedIn: v.string(),
      website: v.string(),
      summary: v.string()
    }),
    experience: v.array(
      v.object({
        company: v.string(),
        position: v.string(),
        location: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        current: v.boolean(),
        description: v.string(),
        highlights: v.array(v.string())
      })
    ),
    education: v.array(
      v.object({
        institution: v.string(),
        degree: v.string(),
        field: v.string(),
        location: v.string(),
        graduationDate: v.string(),
        gpa: v.string()
      })
    ),
    skills: v.array(
      v.object({
        name: v.string(),
        values: v.array(v.string())
      })
    )
  }),
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY not set');

    const model = createAnthropic({ apiKey: key })('claude-sonnet-4-6');

    const { output } = await generateText({
      model,
      system: PARSE_SYSTEM_PROMPT,
      prompt: `Parse the following resume text into structured JSON:\n\n${args.rawText}`,
      output: Output.object({ schema: parsedResumeSchema })
    });

    return output;
  }
});
