import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';

const providerValidator = v.union(v.literal('anthropic'), v.literal('google'), v.literal('openai'));

const rowValidator = v.object({
  _id: v.id('modelConfigs'),
  _creationTime: v.number(),
  provider: providerValidator,
  modelId: v.string(),
  label: v.string(),
  pricing: v.object({ input: v.number(), output: v.number() }),
  isDefault: v.optional(v.boolean())
});

/** Lists all model configs. */
export const list = query({
  args: {},
  returns: v.array(rowValidator),
  handler: async (ctx) => ctx.db.query('modelConfigs').collect()
});

/** Returns the default model config. */
export const getDefault = query({
  args: {},
  returns: v.union(rowValidator, v.null()),
  handler: async (ctx) => {
    const all = await ctx.db.query('modelConfigs').collect();
    return all.find((m) => m.isDefault) ?? null;
  }
});

/** Sets a model as default, clearing isDefault on others. */
export const setDefault = mutation({
  args: { id: v.id('modelConfigs') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const all = await ctx.db.query('modelConfigs').collect();
    for (const row of all) {
      if (row.isDefault) await ctx.db.patch(row._id, { isDefault: false });
    }
    await ctx.db.patch(args.id, { isDefault: true });
    return null;
  }
});

/** Internal query for model configs (used by actions). */
export const listInternal = internalQuery({
  args: {},
  returns: v.array(rowValidator),
  handler: async (ctx) => ctx.db.query('modelConfigs').collect()
});
