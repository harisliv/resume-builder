import { v } from 'convex/values';
import { internalMutation } from './_generated/server';
import {
  SYSTEM_PROMPT_1,
  SYSTEM_PROMPT_2,
  SYSTEM_PROMPT_3,
  SYSTEM_PROMPT_4,
  SYSTEM_PROMPT_5,
  SYSTEM_SCHEMA_RULES
} from './systemPropts';

/** Seeds the systemPrompts table with hardcoded prompts and rules. Skips if table already has data. */
export const seed = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query('systemPrompts').first();
    if (existing) return null;

    const entries: { name: string; content: string; type: 'prompt' | 'rule' }[] = [
      { name: 'Prompt 1 – Expert Resume Writer', content: SYSTEM_PROMPT_1, type: 'prompt' },
      { name: 'Prompt 2 – Roast-First Hiring Manager', content: SYSTEM_PROMPT_2, type: 'prompt' },
      { name: 'Prompt 3 – Executive Career Coach', content: SYSTEM_PROMPT_3, type: 'prompt' },
      { name: 'Prompt 4 – Executive Coach (Lite)', content: SYSTEM_PROMPT_4, type: 'prompt' },
      { name: 'Prompt 5 – Precision JD Optimizer', content: SYSTEM_PROMPT_5, type: 'prompt' },
      { name: 'Schema Rules + One-Shot Example', content: SYSTEM_SCHEMA_RULES, type: 'rule' }
    ];

    for (const e of entries) {
      await ctx.db.insert('systemPrompts', e);
    }
    return null;
  }
});

/** Backfills type='prompt' on rows missing it, and inserts the rules entry if absent. */
export const migrate = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const all = await ctx.db.query('systemPrompts').collect();

    // Backfill missing type
    for (const row of all) {
      if (!row.type) {
        await ctx.db.patch(row._id, { type: 'prompt' });
      }
    }

    // Insert rules entry if none exists
    const hasRule = all.some((r) => r.type === 'rule');
    if (!hasRule) {
      await ctx.db.insert('systemPrompts', {
        name: 'Schema Rules + One-Shot Example',
        content: SYSTEM_SCHEMA_RULES,
        type: 'rule'
      });
    }

    return null;
  }
});
