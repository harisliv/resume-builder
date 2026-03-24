'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import { v } from 'convex/values';
import { normalizeSuggestionsOutput, suggestionsOutputSchema } from '../types/aiSuggestions';
import { internal } from './_generated/api';
import { action } from './_generated/server';
import { buildMockResumeSuggestions, isMockAiEnabled } from './aiMocks';
import { getAuthenticatedUser, getUserRole } from './auth';
import { buildUserPrompt } from './formatResumePrompt';

const suggestionsValidator = v.object({
  title: v.optional(v.string()),
  summary: v.optional(v.string()),
  experience: v.optional(
    v.array(
      v.object({
        description: v.optional(v.string()),
        highlights: v.optional(v.array(v.object({ id: v.string(), value: v.string() })))
      })
    )
  ),
  skills: v.optional(
    v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        values: v.array(v.object({ id: v.string(), value: v.string() }))
      })
    )
  ),
  jdKeywords: v.optional(v.array(v.string()))
});


/** Reads model config from env vars. Defaults to Claude Sonnet 4.6. */
function getModelConfig() {
  const modelId = process.env.AI_MODEL_ID;
  if (!modelId) throw new Error('AI_MODEL_ID env var not set');
  return {
    modelId,
    pricing: {
      input: Number(process.env.AI_MODEL_PRICING_INPUT ?? 0),
      output: Number(process.env.AI_MODEL_PRICING_OUTPUT ?? 0)
    }
  };
}

/**
 * Generates resume suggestions using Claude Sonnet with structured output.
 */
export const generateResumeSuggestions = action({
  args: {
    resumeId: v.id('resumes'),
    jobDescription: v.string()
  },
  returns: v.object({
    modelId: v.string(),
    label: v.string(),
    suggestions: v.optional(suggestionsValidator),
    error: v.optional(v.string()),
    cost: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    jdKeywords: v.optional(v.array(v.string()))
  }),
  handler: async (ctx, args): Promise<{
    modelId: string;
    label: string;
    suggestions?: {
      title?: string;
      summary?: string;
      experience?: { description?: string; highlights?: { id: string; value: string }[] }[];
      skills?: { id: string; name: string; values: { id: string; value: string }[] }[];
      jdKeywords?: string[];
    };
    error?: string;
    cost?: number;
    durationMs?: number;
    jdKeywords?: string[];
  }> => {
    const userId = await getAuthenticatedUser(ctx);
    const mockAiEnabled = isMockAiEnabled();

    const role = await getUserRole(ctx);
    const shouldConsumeAttempt = role !== 'admin' && !mockAiEnabled;
    if (shouldConsumeAttempt) {
      await ctx.runMutation(internal.aiAttempts.checkAttempt, { userId, type: 'ai' });
    }

    const resume = await ctx.runQuery(internal.resumes.getResumeInternal, {
      resumeId: args.resumeId,
      userId
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    const inputSkillCategoryNames = (resume.skills ?? []).map((category) =>
      category.name.trim()
    );

    const prompt = buildUserPrompt(
      {
        summary: resume.personalInfo?.summary,
        experience: resume.experience?.map((exp) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          description: exp.description,
          highlights: exp.highlights
        })),
        skills: resume.skills
      },
      args.jobDescription
    );

    const start = Date.now();
    try {
      if (mockAiEnabled) {
        const suggestions = buildMockResumeSuggestions({
          resume: {
            personalInfo: resume.personalInfo,
            experience: resume.experience,
            skills: resume.skills
          },
          jobDescription: args.jobDescription
        });
        const durationMs = Date.now() - start;
        if (shouldConsumeAttempt) {
          await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
        }
        const { modelId } = getModelConfig();
        return {
          modelId,
          label: modelId,
          suggestions,
          cost: 0,
          durationMs,
          jdKeywords: suggestions.jdKeywords
        };
      }

      const dbPrompt = await ctx.runQuery(
        internal.systemPrompts.getByTypeInternal,
        { type: 'jd-optimizer' }
      );
      if (!dbPrompt) throw new Error('No jd-optimizer system prompt found');
      const systemPrompt = dbPrompt.content;

      const { modelId, pricing } = getModelConfig();
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error('ANTHROPIC_API_KEY not set');
      const aiModel = createAnthropic({ apiKey: key })(modelId);
      const { output, usage } = await generateText({
        model: aiModel,
        system: systemPrompt,
        prompt,
        output: Output.object({ schema: suggestionsOutputSchema })
      });
      const durationMs = Date.now() - start;
      const suggestions = normalizeSuggestionsOutput(output);

      const cost = (
        (usage.inputTokens ?? 0) * pricing.input +
        (usage.outputTokens ?? 0) * pricing.output
      ) / 1_000_000;

      if (shouldConsumeAttempt) {
        await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
      }
      return { modelId, label: modelId, suggestions, cost, durationMs, jdKeywords: suggestions.jdKeywords };
    } catch (e) {
      const { modelId } = getModelConfig();
      const durationMs = Date.now() - start;
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error('[generateResumeSuggestions] failed:', errorMsg);
      return { modelId, label: modelId, error: errorMsg, durationMs };
    }
  }
});
