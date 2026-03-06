'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';
import { v } from 'convex/values';
import { normalizeSuggestionsOutput, suggestionsOutputSchema } from '../types/aiSuggestions';
import { internal } from './_generated/api';
import { action } from './_generated/server';
import { getAuthenticatedUser, getUserRole } from './auth';
import { buildUserPrompt } from './formatResumePrompt';
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
  ),
  jdKeywords: v.optional(v.array(v.string()))
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

/** Creates a provider-specific model instance. */
function createModel(provider: string, modelId: string) {
  switch (provider) {
    case 'google': {
      const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!key) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not set');
      return createGoogleGenerativeAI({ apiKey: key })(modelId);
    }
    case 'anthropic': {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error('ANTHROPIC_API_KEY not set');
      return createAnthropic({ apiKey: key })(modelId);
    }
    case 'openai': {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error('OPENAI_API_KEY not set');
      return createOpenAI({ apiKey: key })(modelId);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Generates resume suggestions using Claude Sonnet with extended thinking
 * and structured output.
 */
export const generateResumeSuggestions = action({
  args: {
    resumeId: v.id('resumes'),
    jobDescription: v.string(),
    model: v.optional(
      v.object({
        provider: v.union(v.literal('anthropic'), v.literal('google'), v.literal('openai')),
        modelId: v.string(),
        label: v.string(),
        pricing: v.object({ input: v.number(), output: v.number() })
      })
    ),
    systemPromptOverride: v.optional(v.string()),
    systemRuleOverride: v.optional(v.string())
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
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);

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

    const modelConfig = args.model ?? {
      provider: 'anthropic' as const,
      modelId: 'claude-sonnet-4-6',
      label: 'Claude Sonnet 4.6',
      pricing: { input: 3.0, output: 15.0 }
    };

    const inputSkillCategoryNames = (resume.skills ?? []).map((category) =>
      category.name.trim()
    );

    const prompt = buildUserPrompt(
      {
        summary: resume.personalInfo?.summary,
        experience: resume.experience?.map((exp) => ({
          company: exp.company,
          position: exp.position,
          description: exp.description,
          highlights: exp.highlights
        })),
        skills: resume.skills
      },
      args.jobDescription
    );

    const basePrompt = args.systemPromptOverride ?? SYSTEM_PROMPT_5;
    const rules = args.systemRuleOverride ?? SYSTEM_SCHEMA_RULES;
    const systemPrompt = `${basePrompt}\n\n${rules}`;

    const start = Date.now();
    try {
      const aiModel = createModel(modelConfig.provider, modelConfig.modelId);
      const { output, usage } = await generateText({
        model: aiModel,
        system: systemPrompt,
        prompt,
        output: Output.object({ schema: suggestionsOutputSchema })
      });
      const durationMs = Date.now() - start;
      const suggestions = normalizeSuggestionsOutput(output);
      assertSkillCategoriesMatchInput(inputSkillCategoryNames, suggestions);
      const cost = (
        (usage.inputTokens ?? 0) * modelConfig.pricing.input +
        (usage.outputTokens ?? 0) * modelConfig.pricing.output
      ) / 1_000_000;

      return { modelId: modelConfig.modelId, label: modelConfig.label, suggestions, cost, durationMs, jdKeywords: suggestions.jdKeywords };
    } catch (e) {
      const durationMs = Date.now() - start;
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error('[generateResumeSuggestions] failed:', errorMsg);
      return { modelId: modelConfig.modelId, label: modelConfig.label, error: errorMsg, durationMs };
    }
  }
});
