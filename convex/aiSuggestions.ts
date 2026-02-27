'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { v } from 'convex/values';
import { suggestionsSchema } from '../types/aiSuggestions';
import { internal } from './_generated/api';
import { action } from './_generated/server';
import { getAuthenticatedUser } from './auth';
import { SYSTEM_PROMPT_1 } from './systemPropts';

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
  skills: v.optional(v.record(v.string(), v.array(v.string())))
});



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

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error(
        `GOOGLE_GENERATIVE_AI_API_KEY not found in process.env. Available env keys: ${Object.keys(process.env).filter((k) => k.startsWith('GOOGLE') || k.startsWith('CONVEX')).join(', ')}`
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });

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
      model: google('gemini-pro-latest'),
      system: SYSTEM_PROMPT_1,
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

/** Models to run in parallel for multi-model suggestions. */
const MODELS = [
  { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview', provider: 'google' as const },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', provider: 'anthropic' as const },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'openai' as const }
];

/**
 * Runs the resume suggestion prompt across all models in parallel.
 * Fulfilled results are returned; failed models are silently dropped.
 * Throws if all models fail.
 */
export const generateResumeSuggestionsMultiModel = action({
  args: {
    resumeId: v.id('resumes'),
    jobDescription: v.string()
  },
  returns: v.array(
    v.object({
      modelId: v.string(),
      label: v.string(),
      suggestions: v.optional(suggestionsValidator),
      error: v.optional(v.string())
    })
  ),
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

    const prompt = `Resume:\n${JSON.stringify(resumeContent, null, 2)}\n\nJob Description:\n${args.jobDescription}`;

    const results = await Promise.allSettled(
      MODELS.map(async (modelDef) => {
        let model;
        if (modelDef.provider === 'google') {
          const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
          if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not set');
          model = createGoogleGenerativeAI({ apiKey })(modelDef.id);
        } else if (modelDef.provider === 'anthropic') {
          const apiKey = process.env.ANTHROPIC_API_KEY;
          if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
          model = createAnthropic({ apiKey })(modelDef.id);
        } else {
          const apiKey = process.env.OPENAI_API_KEY;
          if (!apiKey) throw new Error('OPENAI_API_KEY not set');
          model = createOpenAI({ apiKey })(modelDef.id);
        }

        const { text } = await generateText({ model, system: SYSTEM_PROMPT_1, prompt });
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error(`Failed to parse response from ${modelDef.label}`);
        const suggestions = suggestionsSchema.parse(JSON.parse(jsonMatch[0]));
        return { modelId: modelDef.id, label: modelDef.label, suggestions };
      })
    );

    return results.map((r, i) => {
      if (r.status === 'fulfilled') {
        return r.value;
      }
      const reason = String(r.reason);
      console.error(`[multi-model] ${MODELS[i].label} failed:`, reason);
      return { modelId: MODELS[i].id, label: MODELS[i].label, error: reason };
    });
  }
});
