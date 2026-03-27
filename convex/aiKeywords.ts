'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { getAuthenticatedUser, getUserRole } from './auth';
import { buildUserPrompt } from './formatResumePrompt';
import { buildMockKeywordExtraction, isMockAiEnabled } from './aiMocks';

/** Zod schema for keyword extraction AI output. */
const keywordSchema = z.object({
  title: z.string(),
  keywords: z.array(z.object({
    keyword: z.string(),
    canonicalName: z.string(),
    context: z.string()
  }))
});

/** Extracts missing keywords from JD as a flat list. */
export const extractKeywords = action({
  args: {
    resumeId: v.id('resumes'),
    jobDescription: v.string()
  },
  returns: v.object({
    title: v.string(),
    keywords: v.array(v.object({
      keyword: v.string(),
      canonicalName: v.string(),
      context: v.string()
    })),
    cost: v.optional(v.number())
  }),
  handler: async (ctx, args): Promise<{
    title: string;
    keywords: { keyword: string; canonicalName: string; context: string }[];
    cost?: number;
  }> => {
    const userId = await getAuthenticatedUser(ctx);
    const mockAiEnabled = isMockAiEnabled();

    // Attempt check — whole keyword flow = 1 attempt, consumed here
    const role = await getUserRole(ctx);
    const shouldConsumeAttempt = role !== 'admin' && !mockAiEnabled;
    if (shouldConsumeAttempt) {
      await ctx.runMutation(internal.aiAttempts.checkAttempt, { userId, type: 'ai' });
    }

    const resume = await ctx.runQuery(internal.resumes.getResumeInternal, {
      resumeId: args.resumeId, userId
    }) as { personalInfo?: { summary?: string }; experience?: { id: string; company?: string; position?: string; description?: string; highlights?: { id: string; value: string }[] }[]; skills?: { id: string; name: string; values: { id: string; value: string }[] }[] } | null;
    if (!resume) throw new Error('Resume not found');

    if (mockAiEnabled) {
      if (shouldConsumeAttempt) {
        await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
      }
      return buildMockKeywordExtraction(args.jobDescription);
    }

    const prompt = buildUserPrompt(
      {
        summary: resume.personalInfo?.summary,
        experience: resume.experience?.map((exp: { id: string; company?: string; position?: string; description?: string; highlights?: { id: string; value: string }[] }) => ({
          id: exp.id, company: exp.company, position: exp.position,
          description: exp.description, highlights: exp.highlights
        })),
        skills: resume.skills
      },
      args.jobDescription
    );

    const dbPrompt: { content: string } | null = await ctx.runQuery(
      internal.systemPrompts.getByTypeInternal,
      { type: 'jd-keyword-extract' }
    );
    if (!dbPrompt) throw new Error('System prompt "jd-keyword-extract" not found. Run v2 seed.');

    const modelId = process.env.AI_MODEL_ID;
    if (!modelId) throw new Error('AI_MODEL_ID env var not set');
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY not set');

    const anthropic = createAnthropic({ apiKey: key });
    const result = await generateText({
      model: anthropic(modelId),
      system: dbPrompt.content,
      prompt,
      output: Output.object({ schema: keywordSchema })
    });

    if (!result.output) throw new Error('AI returned no output');

    const pricing = {
      input: Number(process.env.AI_MODEL_PRICING_INPUT ?? 0),
      output: Number(process.env.AI_MODEL_PRICING_OUTPUT ?? 0)
    };
    const cost = (
      (result.usage.inputTokens ?? 0) * pricing.input +
      (result.usage.outputTokens ?? 0) * pricing.output
    ) / 1_000_000;

    console.log(`[extractKeywords] cost: $${cost.toFixed(6)}`);

    if (shouldConsumeAttempt) {
      await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
    }

    return {
      title: result.output.title,
      keywords: result.output.keywords,
      cost
    };
  }
});

/** Places a single keyword into the resume at user-selected targets. */
export const placeKeyword = action({
  args: {
    resumeId: v.id('resumes'),
    keyword: v.string(),
    targets: v.array(v.union(
      v.object({
        type: v.literal('skill'),
        categoryId: v.string()
      }),
      v.object({
        type: v.literal('highlight'),
        experienceId: v.string(),
        highlightId: v.string(),
        currentText: v.string()
      })
    ))
  },
  returns: v.object({
    updatedHighlights: v.array(v.object({
      experienceId: v.string(),
      highlightId: v.string(),
      newText: v.string(),
      oldText: v.string()
    })),
    addedSkills: v.array(v.object({
      categoryId: v.string(),
      value: v.string()
    })),
    cost: v.optional(v.number())
  }),
  handler: async (ctx, args): Promise<{
    updatedHighlights: { experienceId: string; highlightId: string; newText: string; oldText: string }[];
    addedSkills: { categoryId: string; value: string }[];
    cost?: number;
  }> => {
    await getAuthenticatedUser(ctx);

    const addedSkills: { categoryId: string; value: string }[] = [];
    const highlightTargets: { experienceId: string; highlightId: string; currentText: string }[] = [];

    for (const target of args.targets) {
      if (target.type === 'skill') {
        addedSkills.push({ categoryId: target.categoryId, value: args.keyword });
      } else {
        highlightTargets.push(target);
      }
    }

    if (highlightTargets.length === 0) {
      return { updatedHighlights: [], addedSkills };
    }

    if (isMockAiEnabled()) {
      const updatedHighlights = highlightTargets.map(t => ({
        experienceId: t.experienceId,
        highlightId: t.highlightId,
        newText: `${t.currentText} [${args.keyword}]`,
        oldText: t.currentText
      }));
      return { updatedHighlights, addedSkills, cost: 0 };
    }

    const dbPrompt: { content: string } | null = await ctx.runQuery(
      internal.systemPrompts.getByTypeInternal,
      { type: 'jd-keyword-place' }
    );
    if (!dbPrompt) throw new Error('System prompt "jd-keyword-place" not found');

    const modelId = process.env.AI_MODEL_ID;
    const key = process.env.ANTHROPIC_API_KEY;
    if (!modelId || !key) throw new Error('AI env vars not set');

    const anthropic = createAnthropic({ apiKey: key });

    const highlightLines = highlightTargets.map((t, i) =>
      `[${i}] (id:${t.highlightId}) "${t.currentText}"`
    ).join('\n');

    const userPrompt = `Keyword to integrate: "${args.keyword}"

Highlights to rewrite:
${highlightLines}

Return a JSON array with one entry per highlight:
[{ "index": 0, "newText": "rewritten text" }, ...]`;

    const { text, usage } = await generateText({
      model: anthropic(modelId),
      system: dbPrompt.content,
      prompt: userPrompt
    });

    const pricing = {
      input: Number(process.env.AI_MODEL_PRICING_INPUT ?? 0),
      output: Number(process.env.AI_MODEL_PRICING_OUTPUT ?? 0)
    };
    const cost = (
      (usage.inputTokens ?? 0) * pricing.input +
      (usage.outputTokens ?? 0) * pricing.output
    ) / 1_000_000;

    console.log(`[placeKeyword] keyword="${args.keyword}" cost: $${cost.toFixed(6)}`);

    let updatedHighlights: { experienceId: string; highlightId: string; newText: string; oldText: string }[] = [];
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as { index: number; newText: string }[];
      updatedHighlights = parsed.map(p => {
        const target = highlightTargets[p.index];
        return {
          experienceId: target.experienceId,
          highlightId: target.highlightId,
          newText: p.newText,
          oldText: target.currentText
        };
      });
    }

    return { updatedHighlights, addedSkills, cost };
  }
});
