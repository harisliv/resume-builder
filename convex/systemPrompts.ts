import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const typeValidator = v.union(v.literal('prompt'), v.literal('rule'));

const rowValidator = v.object({
  _id: v.id('systemPrompts'),
  _creationTime: v.number(),
  name: v.string(),
  content: v.string(),
  type: typeValidator
});

/** Lists system prompts/rules filtered by type. Rows without type default to 'prompt'. */
export const list = query({
  args: { type: v.optional(typeValidator) },
  returns: v.array(rowValidator),
  handler: async (ctx, args) => {
    const all = await ctx.db.query('systemPrompts').collect();
    const normalized = all.map((r) => ({ ...r, type: r.type ?? ('prompt' as const) }));
    if (!args.type) return normalized;
    return normalized.filter((r) => r.type === args.type);
  }
});

/** Creates a new system prompt or rule. */
export const create = mutation({
  args: { name: v.string(), content: v.string(), type: typeValidator },
  returns: v.id('systemPrompts'),
  handler: async (ctx, args) => {
    return ctx.db.insert('systemPrompts', args);
  }
});

/** Updates an existing system prompt or rule. */
export const update = mutation({
  args: { id: v.id('systemPrompts'), name: v.string(), content: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name, content: args.content });
  }
});
