'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import { v } from 'convex/values';
import { z } from 'zod';
import { internal } from './_generated/api';
import { action } from './_generated/server';
import { buildMockKeywordExtraction, isMockAiEnabled } from './aiMocks';
import { getAuthenticatedUser, getUserRole } from './auth';
import { buildUserPrompt } from './formatResumePrompt';
import { JD_KEYWORD_EXTRACT_PROMPT, JD_KEYWORD_PLACE_PROMPT } from './promptContent';

/** Zod schema for keyword extraction AI output. */
const keywordSchema = z.object({
  title: z.string(),
  keywords: z.array(z.object({
    keyword: z.string(),
    canonicalName: z.string(),
    context: z.string()
  }))
});

type TKeywordOutput = z.infer<typeof keywordSchema>['keywords'][number];

/** Normalizes spacing and trims punctuation around extracted keyword text. */
function cleanKeywordText(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/^[\s,;:()[\]{}"'.!-]+/, '')
    .replace(/[\s,;:()[\]{}"'.!-]+$/, '')
    .trim();
}

/** Removes parenthetical qualifier tails from a keyword when the leading term stands alone. */
function stripParentheticalTail(value: string) {
  return value.replace(/\s*\((?:[^)(]+|\([^)(]*\))*\)\s*$/u, '').trim();
}

/** True when the model returned a bundled keyword list instead of one concept. */
function isBundledKeyword(value: string) {
  const normalized = value.toLowerCase();
  return /[,;]/.test(value)
    || /\b(or similar|and\/or)\b/.test(normalized)
    || /\b(?:or|vs\.?)\b/.test(normalized);
}

/** Splits obvious bundled keyword lists into single-concept entries. */
function splitKeywordParts(value: string) {
  return value
    .split(/,|;|\bor\b/gi)
    .map((part) => cleanKeywordText(part))
    .filter((part) => part.length >= 2 && !/^(?:similar|etc\.?)$/i.test(part));
}

/** Escapes user/model text before building a targeted context regex. */
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Pulls concrete examples from "keyword (Tool or similar)" context spans. */
function getParentheticalContextCandidates(keyword: string, context: string) {
  const match = context.match(new RegExp(`${escapeRegExp(keyword)}\\s*\\(([^)]*)\\)`, 'i'));
  if (!match) return [];
  return splitKeywordParts(match[1]);
}

/** Cleans and dedupes model keyword output before it reaches the UI. */
function sanitizeKeywords(keywords: TKeywordOutput[]) {
  const sanitized: TKeywordOutput[] = [];
  const seen = new Set<string>();

  for (const keyword of keywords) {
    const baseKeyword = cleanKeywordText(stripParentheticalTail(keyword.keyword));
    const baseCanonicalName = cleanKeywordText(stripParentheticalTail(keyword.canonicalName));
    const context = keyword.context.trim();
    const parts = isBundledKeyword(baseKeyword)
      ? splitKeywordParts(baseKeyword)
      : [baseKeyword];
    const contextParts = getParentheticalContextCandidates(baseKeyword, context);
    const keywordParts = [
      ...parts.map((part) => ({ value: part, fromContext: false })),
      ...contextParts.map((part) => ({ value: part, fromContext: true }))
    ];

    for (const part of keywordParts) {
      const normalizedPart = cleanKeywordText(part.value);
      if (!normalizedPart) continue;

      const nextKeyword = {
        keyword: normalizedPart,
        canonicalName: parts.length === 1 && !part.fromContext
          ? (baseCanonicalName || normalizedPart)
          : normalizedPart,
        context
      };

      const dedupeKey = nextKeyword.canonicalName.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      sanitized.push(nextKeyword);
    }
  }

  return sanitized.slice(0, 12);
}

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
    });
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

    const modelId = process.env.AI_MODEL_ID;
    if (!modelId) throw new Error('AI_MODEL_ID env var not set');
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY not set');

    const anthropic = createAnthropic({ apiKey: key });
    const result = await generateText({
      model: anthropic(modelId),
      system: JD_KEYWORD_EXTRACT_PROMPT,
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

    if (role === 'admin') {
      console.log(`[extractKeywords] cost: $${cost.toFixed(6)}`);
    }

    if (shouldConsumeAttempt) {
      await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
    }

    return {
      title: result.output.title,
      keywords: sanitizeKeywords(result.output.keywords),
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
        categoryId: v.string(),
        categoryName: v.string()
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
      categoryName: v.string(),
      value: v.string()
    })),
    cost: v.optional(v.number())
  }),
  handler: async (ctx, args): Promise<{
    updatedHighlights: { experienceId: string; highlightId: string; newText: string; oldText: string }[];
    addedSkills: { categoryId: string; categoryName: string; value: string }[];
    cost?: number;
  }> => {
    await getAuthenticatedUser(ctx);
    const role = await getUserRole(ctx);

    const addedSkills: {
      categoryId: string;
      categoryName: string;
      value: string;
    }[] = [];
    const highlightTargets: { experienceId: string; highlightId: string; currentText: string }[] = [];

    for (const target of args.targets) {
      if (target.type === 'skill') {
        addedSkills.push({
          categoryId: target.categoryId,
          categoryName: target.categoryName,
          value: args.keyword
        });
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
      system: JD_KEYWORD_PLACE_PROMPT,
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

    if (role === 'admin') {
      console.log(`[placeKeyword] keyword="${args.keyword}" cost: $${cost.toFixed(6)}`);
    }

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
