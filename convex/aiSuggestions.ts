'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
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
    modelId: v.optional(v.string()),
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
  handler: async (ctx, args): Promise<{
    modelId: string;
    label: string;
    suggestions?: {
      title?: string;
      summary?: string;
      experience?: { description?: string; highlights?: string[] }[];
      skills?: { name: string; values: string[] }[];
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
    if (role !== 'admin' && !mockAiEnabled) {
      await ctx.runMutation(internal.aiAttempts.consumeDailyAttempt, { userId });
    }

    const resume = await ctx.runQuery(internal.resumes.getResumeInternal, {
      resumeId: args.resumeId,
      userId
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    /** Resolve model config from DB. */
    const allModels = await ctx.runQuery(internal.modelConfigs.listInternal);
    const resolvedModel = args.modelId
      ? allModels.find((m: { modelId: string }) => m.modelId === args.modelId)
      : allModels.find((m: { isDefault?: boolean }) => m.isDefault);
    if (!resolvedModel) throw new Error('No model config found');
    const modelConfig = {
      provider: resolvedModel.provider as string,
      modelId: resolvedModel.modelId as string,
      label: resolvedModel.label as string,
      pricing: resolvedModel.pricing as { input: number; output: number }
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
        assertSkillCategoriesMatchInput(inputSkillCategoryNames, suggestions);
        return {
          modelId: modelConfig.modelId,
          label: `${modelConfig.label} (mock)`,
          suggestions,
          cost: 0,
          durationMs,
          jdKeywords: suggestions.jdKeywords
        };
      }

      /** Resolve system prompt and rules from DB. */
      let basePrompt = args.systemPromptOverride;
      let rules = args.systemRuleOverride;
      if (!basePrompt) {
        const defaultPrompt = await ctx.runQuery(
          internal.systemPrompts.getDefaultInternal,
          { type: 'prompt' as const }
        );
        if (!defaultPrompt) throw new Error('No default system prompt found');
        basePrompt = defaultPrompt.content;
      }
      if (!rules) {
        const defaultRule = await ctx.runQuery(
          internal.systemPrompts.getDefaultInternal,
          { type: 'rule' as const }
        );
        if (!defaultRule) throw new Error('No default rule found');
        rules = defaultRule.content;
      }
      const systemPrompt = `${basePrompt}\n\n${rules}`;

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
