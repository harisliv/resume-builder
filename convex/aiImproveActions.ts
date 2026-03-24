'use node';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { buildMockImproveTurn, isMockAiEnabled } from './aiMocks';
import { getAuthenticatedUser, getUserRole } from './auth';
import { formatResumePrompt } from './formatResumePrompt';

const structuredPayloadValidator = v.optional(
  v.object({
    questions: v.optional(v.array(v.union(v.string(), v.object({ question: v.string(), context: v.string() })))),
    resumePatch: v.optional(v.string()),
    isReadyToApply: v.optional(v.boolean())
  })
);

/** Generates the next assistant turn in the improvement thread. */
export const generateAssistantTurn = action({
  args: { threadId: v.id('aiThreads') },
  returns: v.object({
    content: v.string(),
    structuredPayload: structuredPayloadValidator,
    cost: v.optional(v.number())
  }),
  handler: async (ctx, { threadId }) => {
    const userId = await getAuthenticatedUser(ctx);
    const mockAiEnabled = isMockAiEnabled();
    const role = await getUserRole(ctx);
    const shouldConsumeAttempt = role !== 'admin' && !mockAiEnabled;
    if (shouldConsumeAttempt) {
      await ctx.runMutation(internal.aiAttempts.checkAttempt, { userId, type: 'ai' });
    }

    const context = await ctx.runQuery(
      internal.aiImprove.getThreadContext,
      { threadId, userId }
    ) as {
      thread: { _id: string; resumeId: string; userId: string; status: string };
      messages: { role: string; content: string }[];
      resume: {
        personalInfo?: { summary?: string };
        experience?: { id: string; company?: string; position?: string; description?: string; highlights?: { id: string; value: string }[] }[];
        skills?: { id: string; name: string; values: { id: string; value: string }[] }[];
      };
    } | null;
    if (!context) throw new Error('Thread not found or unauthorized');

    const { resume, messages } = context;
    const resumeText = formatResumePrompt({
      summary: resume.personalInfo?.summary,
      experience: resume.experience?.map(
        (exp: {
          id: string;
          company?: string;
          position?: string;
          description?: string;
          highlights?: { id: string; value: string }[];
        }) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          description: exp.description,
          highlights: exp.highlights
        })
      ),
      skills: resume.skills
    });

    /** Use roast prompt on first turn, apply prompt when user has answered questions. */
    const isFirstTurn = messages.length === 0;

    if (mockAiEnabled) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
      const result = buildMockImproveTurn({
        resume,
        isFirstTurn,
        answersText: lastUserMessage?.content ?? ''
      });
      if (shouldConsumeAttempt) {
        await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
      }
      await ctx.runMutation(internal.aiImprove.saveAssistantMessage, {
        threadId,
        content: result.content,
        structuredPayload: result.structuredPayload
      });
      return {
        content: result.content,
        structuredPayload: result.structuredPayload,
        cost: 0
      };
    }

    /** Fetch the appropriate prompt from DB by type. */
    const promptType = isFirstTurn ? 'improve-questions' : 'improve-apply';
    const dbPrompt: { content: string } | null = await ctx.runQuery(
      internal.systemPrompts.getByTypeInternal, { type: promptType }
    );
    if (!dbPrompt) throw new Error(`System prompt "${promptType}" not found. Run seed.`);
    const systemPrompt: string = `${dbPrompt.content}\n\nCurrent resume:\n${resumeText}`;

    const modelId = process.env.AI_MODEL_ID;
    if (!modelId) throw new Error('AI_MODEL_ID env var not set');
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY env var not set');
    const anthropic = createAnthropic({ apiKey: key });
    /** For apply turn, only send the last user message (answers) — no history needed. */
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const aiMessages = isFirstTurn
      ? [{ role: 'user' as const, content: 'Analyze my resume and ask me targeted questions.' }]
      : [{ role: 'user' as const, content: lastUserMessage?.content ?? '' }];

    const { text, usage } = await generateText({
      model: anthropic(modelId),
      system: systemPrompt,
      messages: aiMessages
    });

    /** Sonnet pricing: $3/M input, $15/M output. */
    const cost = (
      (usage.inputTokens ?? 0) * 3 +
      (usage.outputTokens ?? 0) * 15
    ) / 1_000_000;

    let structuredPayload:
      | {
        questions?: { question: string; context: string }[];
        resumePatch?: string;
        isReadyToApply?: boolean;
      }
      | undefined;

    try {
      /** Try ```json fenced block first, then raw JSON object. */
      const jsonMatch = text.match(/```json\s*([\s\S]*?)```/)
        ?? text.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        structuredPayload = {
          questions: Array.isArray(parsed.questions)
            ? parsed.questions.map((q: Record<string, string> | string) => {
              if (typeof q === 'string') return { question: q, context: '' };
              return {
                question: q.question ?? q.text ?? q.q ?? '',
                context: q.context ?? q.resume_line ?? q.c ?? ''
              };
            })
            : undefined,
          resumePatch: parsed.resumePatch
            ? (typeof parsed.resumePatch === 'string' ? parsed.resumePatch : JSON.stringify(parsed.resumePatch))
            : undefined,
          isReadyToApply: parsed.isReadyToApply ?? false
        };
      }
    } catch {
      // No structured payload found, just chat text
    }

    if (shouldConsumeAttempt) {
      await ctx.runMutation(internal.aiAttempts.consumeAttempt, { userId, type: 'ai' });
    }
    await ctx.runMutation(internal.aiImprove.saveAssistantMessage, {
      threadId,
      content: text,
      structuredPayload
    });

    return { content: text, structuredPayload, cost };
  }
});
