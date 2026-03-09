import { v } from 'convex/values';
import { internalQuery, query } from './_generated/server';

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

/** Internal query for model configs (used by actions). */
export const listInternal = internalQuery({
  args: {},
  returns: v.array(rowValidator),
  handler: async (ctx) => ctx.db.query('modelConfigs').collect()
});
