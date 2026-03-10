'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { getAuthenticatedUser, getUserRole } from './auth';
import { formatResumePrompt } from './formatResumePrompt';
import { SYSTEM_PROMPT_ROAST, SYSTEM_PROMPT_APPLY } from './systemPrompts';

const structuredPayloadValidator = v.optional(
  v.object({
    roastItems: v.optional(v.array(v.string())),
    questions: v.optional(v.array(v.object({ question: v.string(), context: v.string() }))),
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
    const role = await getUserRole(ctx);
    if (role !== 'admin') {
      await ctx.runMutation(internal.aiAttempts.consumeDailyAttempt, {
        userId
      });
    }

    const context = await ctx.runQuery(
      internal.aiImprove.getThreadContext,
      { threadId, userId }
    ) as {
      thread: { _id: string; resumeId: string; userId: string; status: string };
      messages: { role: string; content: string }[];
      resume: {
        personalInfo?: { summary?: string };
        experience?: { company?: string; position?: string; description?: string; highlights?: { value: string }[] }[];
        skills?: { name: string; values: string[] | { value: string }[] }[];
      };
    } | null;
    if (!context) throw new Error('Thread not found or unauthorized');

    const { resume, messages } = context;
    const resumeText = formatResumePrompt({
      summary: resume.personalInfo?.summary,
      experience: resume.experience?.map(
        (exp: {
          company?: string;
          position?: string;
          description?: string;
          highlights?: { value: string }[];
        }) => ({
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
    const basePrompt = isFirstTurn ? SYSTEM_PROMPT_ROAST : SYSTEM_PROMPT_APPLY;
    const systemPrompt = `${basePrompt}\n\nCurrent resume:\n${resumeText}`;

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!
    });
    /** For apply turn, only send the last user message (answers) — no history needed. */
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const aiMessages = isFirstTurn
      ? [{ role: 'user' as const, content: 'Roast my resume.' }]
      : [{ role: 'user' as const, content: lastUserMessage?.content ?? '' }];

    const { text, usage } = await generateText({
      model: anthropic('claude-sonnet-4-6'),
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
          roastItems?: string[];
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
          roastItems: Array.isArray(parsed.roastItems) ? parsed.roastItems : undefined,
          questions: Array.isArray(parsed.questions)
            ? parsed.questions.map((q: { question: string; context: string } | string) =>
                typeof q === 'string' ? { question: q, context: '' } : q
              )
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

    await ctx.runMutation(internal.aiImprove.saveAssistantMessage, {
      threadId,
      content: text,
      structuredPayload
    });

    return { content: text, structuredPayload, cost };
  }
});
