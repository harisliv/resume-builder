import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

/** Sets isDefault=true on Prompt 5 (prompt) and Schema Rules (rule). Clears others. */
export const migrateIsDefault = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const all = await ctx.db.query('systemPrompts').collect();
    for (const row of all) {
      const shouldBeDefault =
        (row.name === 'Prompt 5 – Precision JD Optimizer' && (row.type ?? 'prompt') === 'prompt') ||
        (row.name === 'Schema Rules + One-Shot Example' && row.type === 'rule');
      await ctx.db.patch(row._id, { isDefault: shouldBeDefault });
    }
    return null;
  }
});
