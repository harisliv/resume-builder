'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import type { AnthropicMessagesModelId } from '@ai-sdk/anthropic/internal';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { GoogleGenerativeAIModelId } from '@ai-sdk/google/internal';
import { createOpenAI } from '@ai-sdk/openai';
import type { OpenAIChatModelId } from '@ai-sdk/openai/internal';
import { generateText, Output } from 'ai';
import { v } from 'convex/values';
import { normalizeSuggestionsOutput, suggestionsOutputSchema } from '../types/aiSuggestions';
import { internal } from './_generated/api';
import { action } from './_generated/server';
import { getAuthenticatedUser } from './auth';
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

/** Discriminated union of model configs by provider. Uses SDK types for id autocomplete. */
type TModelConfig =
  | {
    id: GoogleGenerativeAIModelId;
    label: string;
    provider: 'google';
    pricing: { input: number; output: number };
  }
  | {
    id: AnthropicMessagesModelId;
    label: string;
    provider: 'anthropic';
    pricing: { input: number; output: number };
  }
  | {
    id: OpenAIChatModelId;
    label: string;
    provider: 'openai';
    pricing: { input: number; output: number };
  };

/** Model ID union for autocomplete. */
export type TModelId = TModelConfig['id'];

/**
 * Model definitions with pricing ($/1M tokens). Hardcoded from official docs (Mar 2025).
 * @see https://ai.google.dev/gemini-api/docs/pricing
 * @see https://docs.anthropic.com/en/docs/about-claude/pricing
 * @see https://openai.com/api/pricing/
 */
const MODELS: readonly TModelConfig[] = [
  {
    id: 'gemini-pro-latest',
    label: 'Gemini Pro Latest',
    provider: 'google',
    pricing: { input: 1.25, output: 10.0 }
  },
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    provider: 'anthropic',
    pricing: { input: 3.0, output: 15.0 }
  },
  {
    provider: 'anthropic',
    id: 'claude-opus-4-6',
    label: 'Claude Opus 4.6',
    pricing: { input: 5.0, output: 25.0 }
  },
  {
    id: 'gpt-5.2-chat-latest',
    label: 'GPT 5.2 Chat Latest',
    provider: 'openai',
    pricing: { input: 1.75, output: 14.0 }
  },
  {
    id: 'gpt-5.2',
    label: 'GPT 5.2',
    provider: 'openai',
    pricing: { input: 1.75, output: 14.0 }
  }
];

/** Calculates cost for a model by its pricing. */
function calculateModelCost(
  pricing: { input: number; output: number },
  inputTokens: number,
  outputTokens: number
): number {
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
}

const multiModelResultValidator = v.object({
  modelId: v.string(),
  label: v.string(),
  suggestions: v.optional(suggestionsValidator),
  error: v.optional(v.string()),
  cost: v.optional(v.number()),
  durationMs: v.optional(v.number()),
  jdKeywords: v.optional(v.array(v.string()))
});

/**
 * Generates resume suggestions from multiple AI models in parallel.
 * Uses Promise.allSettled so one failure doesn't block others.
 */
export const generateResumeSuggestionsMultiModel = action({
  args: {
    resumeId: v.id('resumes'),
    jobDescription: v.string(),
    systemPromptOverride: v.optional(v.string()),
    systemRuleOverride: v.optional(v.string())
  },
  returns: v.array(multiModelResultValidator),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);

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
          company: exp.company,
          position: exp.position,
          description: exp.description,
          highlights: exp.highlights
        })),
        skills: resume.skills
      },
      args.jobDescription
    );
    console.log("🚀 ~ handler: ~ prompt:", prompt)
    const basePrompt = args.systemPromptOverride ?? SYSTEM_PROMPT_5;
    const rules = args.systemRuleOverride ?? SYSTEM_SCHEMA_RULES;
    const systemPrompt = `${basePrompt}\n\n${rules}`;

    /** Creates a provider model instance by provider type. */
    function createModel(model: TModelConfig) {
      switch (model.provider) {
        case 'google': {
          const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
          if (!key) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not set');
          return createGoogleGenerativeAI({ apiKey: key })(model.id);
        }
        case 'anthropic': {
          const key = process.env.ANTHROPIC_API_KEY;
          if (!key) throw new Error('ANTHROPIC_API_KEY not set');
          return createAnthropic({ apiKey: key })(model.id);
        }
        case 'openai': {
          const key = process.env.OPENAI_API_KEY;
          if (!key) throw new Error('OPENAI_API_KEY not set');
          return createOpenAI({ apiKey: key })(model.id);
        }
      }
    }

    const settled = await Promise.allSettled(
      MODELS.map(async (model) => {
        const start = Date.now();
        try {
          const { output, usage } = await generateText({
            model: createModel(model),
            system: systemPrompt,
            prompt,
            output: Output.object({ schema: suggestionsOutputSchema })
          });
          const durationMs = Date.now() - start;
          const suggestions = normalizeSuggestionsOutput(output);
          assertSkillCategoriesMatchInput(inputSkillCategoryNames, suggestions);
          const cost = calculateModelCost(model.pricing, usage.inputTokens ?? 0, usage.outputTokens ?? 0);
          return { modelId: model.id, label: model.label, suggestions, cost, durationMs, jdKeywords: suggestions.jdKeywords };
        } catch (e) {
          const durationMs = Date.now() - start;
          const errorMsg = e instanceof Error ? e.message : String(e);
          return { modelId: model.id, label: model.label, error: errorMsg, durationMs };
        }
      })
    );

    return settled.map((result, i) => {
      if (result.status === 'fulfilled') return result.value;
      return {
        modelId: MODELS[i].id,
        label: MODELS[i].label,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason)
      };
    });
  }
});
