import { v } from 'convex/values';
import { internalQuery } from './_generated/server';

const rowValidator = v.object({
  _id: v.id('systemPrompts'),
  _creationTime: v.number(),
  type: v.string(),
  content: v.string()
});

/** Internal query to fetch a prompt by type. */
export const getByTypeInternal = internalQuery({
  args: { type: v.string() },
  returns: v.union(rowValidator, v.null()),
  handler: async (ctx, args) => await ctx.db
    .query('systemPrompts')
    .withIndex('by_type', (q) => q.eq('type', args.type))
    .unique()
});
