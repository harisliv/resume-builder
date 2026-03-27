'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import { v } from 'convex/values';
import { type TParsedResume, parsedResumeSchema } from '../types/pdfParse';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { getAuthenticatedUser, getUserRole } from './auth';

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
        projectName: v.string(),
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
        current: v.boolean(),
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
  handler: async (ctx, args): Promise<TParsedResume> => {
    const userId = await getAuthenticatedUser(ctx);
    const role = await getUserRole(ctx);

    if (role !== 'admin') {
      await ctx.runMutation(internal.aiAttempts.checkAttempt, { userId, type: 'pdf' });
    }

    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY not set');
    const modelId = process.env.AI_MODEL_ID;
    if (!modelId) throw new Error('AI_MODEL_ID env var not set');

    const model = createAnthropic({ apiKey: key })(modelId);

    /** Fetch parse prompt from DB. */
    const dbPrompt: { content: string } | null = await ctx.runQuery(
      internal.systemPrompts.getByTypeInternal,
      { type: 'pdf-parser' }
    );
    if (!dbPrompt) throw new Error('System prompt "pdf-parser" not found. Run seed.');

    const { output }: { output: TParsedResume } = await generateText({
      model,
      system: dbPrompt.content,
      prompt: `Parse the following resume text into structured JSON:\n\n${args.rawText}`,
      output: Output.object({ schema: parsedResumeSchema })
    });

    if (role !== 'admin') {
      await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'pdf' });
    }

    return output;
  }
});
