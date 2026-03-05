'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import { v } from 'convex/values';
import { normalizeSuggestionsOutput, suggestionsOutputSchema } from '../types/aiSuggestions';
import { internal } from './_generated/api';
import { action } from './_generated/server';
import { getAuthenticatedUser, getUserRole } from './auth';
import { SYSTEM_PROMPT_5, SYSTEM_SCHEMA_RULES } from './systemPropts';

const suggestionsValidator = v.object({
  title: v.optional(v.string()),
  summary: v.optional(v.string()),
  experience: v.optional(
    v.array(
      v.object({
        description: v.optional(v.string()),
        highlights: v.optional(v.array(v.string()))
      })
    )
  ),
  skills: v.optional(
    v.array(
      v.object({
        name: v.string(),
        values: v.array(v.string())
      })
    )
  )
});

/** Ensures model does not rename/add/remove skill categories. */
function assertSkillCategoriesMatchInput(
  inputCategoryNames: string[],
  parsed: { skills?: { name: string; values: string[] }[] }
) {
  if (!parsed.skills) return;
  const suggestedCategoryNames = parsed.skills.map((category) => category.name.trim());
  if (inputCategoryNames.length !== suggestedCategoryNames.length) {
    throw new Error('Invalid skills categories: category count must match input.');
  }
  for (let i = 0; i < inputCategoryNames.length; i += 1) {
    if (inputCategoryNames[i] !== suggestedCategoryNames[i]) {
      throw new Error(
        'Invalid skills categories: category names/order must match input exactly.'
      );
    }
  }
}

/** Per-model pricing in USD per 1M tokens. */
const SONNET_PRICING = { input: 3.0, output: 15.0 };

/** Calculates cost in USD from token usage. */
function calculateCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens * SONNET_PRICING.input + outputTokens * SONNET_PRICING.output) / 1_000_000;
}

/**
 * Generates resume suggestions using Claude Sonnet with extended thinking
 * and structured output.
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
    durationMs: v.optional(v.number())
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);

    // Enforce daily quota for non-admin users
    const role = await getUserRole(ctx);
    if (role !== 'admin') {
      await ctx.runMutation(internal.aiAttempts.consumeDailyAttempt, { userId });
    }

    const resume = await ctx.runQuery(internal.resumes.getResumeInternal, {
      resumeId: args.resumeId,
      userId
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set');
    }

    const anthropic = createAnthropic({ apiKey });

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
    const inputSkillCategoryNames = (resume.skills ?? []).map((category) =>
      category.name.trim()
    );

    const prompt = `Resume:\n${JSON.stringify(resumeContent, null, 2)}\n\nJob Description:\n${args.jobDescription}`;

    const start = Date.now();
    try {
      const { output, usage } = await generateText({
        model: anthropic('claude-sonnet-4-6'),
        system: `${SYSTEM_PROMPT_5}\n\n${SYSTEM_SCHEMA_RULES}`,
        prompt,
        output: Output.object({ schema: suggestionsOutputSchema })
      });
      const durationMs = Date.now() - start;
      const suggestions = normalizeSuggestionsOutput(output);
      assertSkillCategoriesMatchInput(inputSkillCategoryNames, suggestions);
      const cost = calculateCost(usage.inputTokens ?? 0, usage.outputTokens ?? 0);

      return { modelId: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', suggestions, cost, durationMs };
    } catch (e) {
      const durationMs = Date.now() - start;
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error('[generateResumeSuggestions] failed:', errorMsg);
      return { modelId: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', error: errorMsg, durationMs };
    }
  }
});
