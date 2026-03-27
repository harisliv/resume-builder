'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import { v } from 'convex/values';
import { z } from 'zod';
import type { TAnsweredQuestion, TImproveEdit, TImproveQuestion } from '../types/aiImprove';
import { internal } from './_generated/api';
import { action } from './_generated/server';
import {
  buildMockImproveEdits,
  buildMockImproveQuestions,
  isMockAiEnabled
} from './aiMocks';
import { getAuthenticatedUser, getUserRole } from './auth';
import { formatResumePrompt } from './formatResumePrompt';

/** Zod schema for structured question output. */
const questionsSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      context: z.string(),
      targetType: z.enum(['highlight', 'description', 'summary']),
      experienceId: z.string().optional(),
      highlightId: z.string().optional()
    })
  )
});

/** Helper: create Anthropic client from env. */
function getAnthropicClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');
  const modelId = process.env.AI_MODEL_ID;
  if (!modelId) throw new Error('AI_MODEL_ID not set');
  return { client: createAnthropic({ apiKey: key }), modelId };
}

/** Helper: compute cost from token usage. */
function computeCost(usage: { inputTokens?: number; outputTokens?: number }) {
  const pricing = {
    input: Number(process.env.AI_MODEL_PRICING_INPUT ?? 0),
    output: Number(process.env.AI_MODEL_PRICING_OUTPUT ?? 0)
  };
  return (
    ((usage.inputTokens ?? 0) * pricing.input +
      (usage.outputTokens ?? 0) * pricing.output) /
    1_000_000
  );
}

type ResumeData = {
  personalInfo?: { summary?: string };
  experience?: {
    id: string;
    company?: string;
    position?: string;
    description?: string;
    highlights?: { id: string; value: string }[];
  }[];
  skills?: { id: string; name: string; values: { id: string; value: string }[] }[];
};

/** Generates targeted questions about weak resume bullets (Turn 1). Consumes 1 AI attempt. */
export const generateQuestions = action({
  args: { threadId: v.id('aiThreads') },
  returns: v.object({
    questions: v.array(v.object({
      question: v.string(),
      context: v.string(),
      targetType: v.union(v.literal('highlight'), v.literal('description'), v.literal('summary')),
      experienceId: v.optional(v.string()),
      highlightId: v.optional(v.string())
    })),
    cost: v.optional(v.number())
  }),
  handler: async (ctx, { threadId }): Promise<{
    questions: TImproveQuestion[];
    cost?: number;
  }> => {
    const userId = await getAuthenticatedUser(ctx);
    const mockAiEnabled = isMockAiEnabled();
    const role = await getUserRole(ctx);
    const shouldConsumeAttempt = role !== 'admin' && !mockAiEnabled;

    if (shouldConsumeAttempt) {
      await ctx.runMutation(internal.aiAttempts.checkAttempt, { userId, type: 'ai' });
    }

    const context = await ctx.runQuery(internal.aiImprove.getThreadContext, {
      threadId,
      userId
    }) as { thread: { resumeId: string }; messages: { role: string; content: string }[]; resume: ResumeData } | null;
    if (!context) throw new Error('Thread not found or unauthorized');

    const { resume } = context;

    if (mockAiEnabled) {
      const questions = buildMockImproveQuestions(resume);
      if (shouldConsumeAttempt) {
        await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
      }
      await ctx.runMutation(internal.aiImprove.saveAssistantMessage, {
        threadId,
        content: 'Questions generated.',
        structuredPayload: { questions, isReadyToApply: false }
      });
      return { questions, cost: 0 };
    }

    const resumeText = formatResumePrompt({
      summary: resume.personalInfo?.summary,
      experience: resume.experience?.map((exp) => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        description: exp.description,
        highlights: exp.highlights
      })),
      skills: resume.skills
    });

    const dbPrompt: { content: string } | null = await ctx.runQuery(
      internal.systemPrompts.getByTypeInternal,
      { type: 'improve-questions' }
    );
    if (!dbPrompt) throw new Error('System prompt "improve-questions" not found. Run seed.');

    const { client, modelId } = getAnthropicClient();
    const systemPrompt = `${dbPrompt.content}\n\nCurrent resume:\n${resumeText}`;

    const result = await generateText({
      model: client(modelId),
      system: systemPrompt,
      prompt: 'Begin',
      output: Output.object({ schema: questionsSchema })
    });

    if (!result.output) throw new Error('AI returned no output');
    const cost = computeCost(result.usage);

    console.log("🚀 ~ generateQuestions: ~ result.output.questions:", result.output.questions)
    console.log("🚀 ~ handler: ~ cost:", cost)

    if (shouldConsumeAttempt) {
      await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
    }

    const questions = result.output.questions;
    await ctx.runMutation(internal.aiImprove.saveAssistantMessage, {
      threadId,
      content: 'Questions generated.',
      structuredPayload: { questions, isReadyToApply: false }
    });

    return { questions, cost };
  }
});

/** Zod schema for a single rewritten value. */
const rewriteSchema = z.object({ value: z.string() });

/** Looks up the current text for a question's target from the resume. */
function lookupCurrentValue(q: TAnsweredQuestion, resume: ResumeData): string | null {
  switch (q.targetType) {
    case 'highlight': {
      const exp = resume.experience?.find((e) => e.id === q.experienceId);
      return exp?.highlights?.find((h) => h.id === q.highlightId)?.value ?? null;
    }
    case 'description': {
      const exp = resume.experience?.find((e) => e.id === q.experienceId);
      return exp?.description ?? null;
    }
    case 'summary':
      return resume.personalInfo?.summary ?? null;
  }
}

/** Builds a TImproveEdit from a question and AI-rewritten value. */
function buildEdit(q: TAnsweredQuestion, oldValue: string, newValue: string): TImproveEdit {
  switch (q.targetType) {
    case 'highlight':
      return { type: 'updateHighlight', experienceId: q.experienceId!, highlightId: q.highlightId!, oldValue, newValue };
    case 'description':
      return { type: 'updateDescription', experienceId: q.experienceId!, oldValue, newValue };
    case 'summary':
      return { type: 'updateSummary', oldValue, newValue };
  }
}

/** Generates per-answer structured edits (Turn 2). System prompt cached across calls. */
export const generateEdits = action({
  args: {
    threadId: v.id('aiThreads'),
    answeredQuestions: v.array(v.object({
      question: v.string(),
      context: v.string(),
      targetType: v.union(v.literal('highlight'), v.literal('description'), v.literal('summary')),
      experienceId: v.optional(v.string()),
      highlightId: v.optional(v.string()),
      answer: v.string()
    }))
  },
  returns: v.object({
    edits: v.array(v.any()),
    cost: v.optional(v.number())
  }),
  handler: async (ctx, { threadId, answeredQuestions }): Promise<{
    edits: TImproveEdit[];
    cost?: number;
  }> => {
    console.log("🚀 ~ handler: ~ answeredQuestions:", answeredQuestions)
    const userId = await getAuthenticatedUser(ctx);

    const context = await ctx.runQuery(internal.aiImprove.getThreadContext, {
      threadId,
      userId
    }) as { thread: { resumeId: string }; messages: { role: string; content: string }[]; resume: ResumeData } | null;
    if (!context) throw new Error('Thread not found or unauthorized');

    const { resume } = context;

    if (isMockAiEnabled()) {
      const edits = buildMockImproveEdits(resume);
      await ctx.runMutation(internal.aiImprove.saveAssistantMessage, {
        threadId,
        content: 'Edits generated.',
        structuredPayload: { toolCallEdits: JSON.stringify(edits), isReadyToApply: true }
      });
      return { edits, cost: 0 };
    }

    const resumeText = formatResumePrompt({
      summary: resume.personalInfo?.summary,
      experience: resume.experience?.map((exp) => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        description: exp.description,
        highlights: exp.highlights
      })),
      skills: resume.skills
    });

    const dbPrompt: { content: string } | null = await ctx.runQuery(
      internal.systemPrompts.getByTypeInternal,
      { type: 'improve-apply' }
    );
    if (!dbPrompt) throw new Error('System prompt "improve-apply" not found. Run seed.');

    /** Resume appended to system prompt — cached on calls 2–N by Anthropic. */
    const systemPrompt = `${dbPrompt.content}\n\nFull resume:\n${resumeText}`;
    const { client, modelId } = getAnthropicClient();

    /** Filter out questions whose targets no longer exist in the resume. */
    const actionable = answeredQuestions.filter((q) =>
      lookupCurrentValue(q, resume) !== null
    );

    /** One structured-output call per answer. System message marked for Anthropic prompt caching. */
    const results = await Promise.all(
      actionable.map(async (q, i) => {
        const currentValue = lookupCurrentValue(q as TAnsweredQuestion, resume)!;
        const userPrompt = `Text: "${currentValue}"\n\nFeedback: "${q.answer}"`;
        const result = await generateText({
          model: client(modelId),
          messages: [
            {
              role: 'system',
              content: systemPrompt,
              providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' } } }
            },
            { role: 'user', content: userPrompt }
          ],
          output: Output.object({ schema: rewriteSchema })
        });
        const callCost = computeCost(result.usage);
        console.log(`[generateEdits] call ${i + 1}/${actionable.length}`, JSON.stringify({
          targetType: q.targetType,
          input: currentValue,
          output: result.output?.value,
          cost: `$${callCost.toFixed(6)}`
        }));
        return { q: q as TAnsweredQuestion, currentValue, result };
      })
    );

    let totalInput = 0;
    let totalOutput = 0;
    const edits: TImproveEdit[] = [];

    for (const { q, currentValue, result } of results) {
      totalInput += result.usage.inputTokens ?? 0;
      totalOutput += result.usage.outputTokens ?? 0;
      if (result.output?.value) {
        edits.push(buildEdit(q, currentValue, result.output.value));
      }
    }

    const cost = computeCost({ inputTokens: totalInput, outputTokens: totalOutput });
    console.log('[generateEdits] OUTPUT', JSON.stringify({
      cost: `$${cost.toFixed(6)}`,
      edits
    }, null, 2));

    await ctx.runMutation(internal.aiImprove.saveAssistantMessage, {
      threadId,
      content: 'Edits generated.',
      structuredPayload: { toolCallEdits: JSON.stringify(edits), isReadyToApply: true }
    });

    return { edits, cost };
  }
});
