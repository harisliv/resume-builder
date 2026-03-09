import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';

const typeValidator = v.union(v.literal('prompt'), v.literal('rule'));

const rowValidator = v.object({
  _id: v.id('systemPrompts'),
  _creationTime: v.number(),
  name: v.string(),
  content: v.string(),
  type: typeValidator,
  isDefault: v.optional(v.boolean())
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
  handler: async (ctx, args) => ctx.db.insert('systemPrompts', args)
});

/** Updates an existing system prompt or rule. */
export const update = mutation({
  args: { id: v.id('systemPrompts'), name: v.string(), content: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name, content: args.content });
  }
});

/** Sets a prompt/rule as default, clearing isDefault on others of the same type. */
export const setDefault = mutation({
  args: { id: v.id('systemPrompts') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.id);
    if (!target) throw new Error('Prompt not found');
    const type = target.type ?? 'prompt';
    const all = await ctx.db.query('systemPrompts').collect();
    for (const row of all) {
      if ((row.type ?? 'prompt') === type && row.isDefault) {
        await ctx.db.patch(row._id, { isDefault: false });
      }
    }
    await ctx.db.patch(args.id, { isDefault: true });
    return null;
  }
});

/** Returns the default prompt or rule for a given type. */
export const getDefault = query({
  args: { type: typeValidator },
  returns: v.union(rowValidator, v.null()),
  handler: async (ctx, args) => {
    const all = await ctx.db.query('systemPrompts').collect();
    const normalized = all.map((r) => ({ ...r, type: r.type ?? ('prompt' as const) }));
    return normalized.find((r) => r.type === args.type && r.isDefault) ?? null;
  }
});

/** Creates a new prompt/rule from an admin edit. Never sets isDefault. */
export const createFromEdit = mutation({
  args: { name: v.string(), content: v.string(), type: typeValidator },
  returns: v.id('systemPrompts'),
  handler: async (ctx, args) => ctx.db.insert('systemPrompts', { ...args, isDefault: false })
});

/** Internal query for default prompt/rule (used by actions). */
export const getDefaultInternal = internalQuery({
  args: { type: typeValidator },
  returns: v.union(rowValidator, v.null()),
  handler: async (ctx, args) => {
    const all = await ctx.db.query('systemPrompts').collect();
    const normalized = all.map((r) => ({ ...r, type: r.type ?? ('prompt' as const) }));
    return normalized.find((r) => r.type === args.type && r.isDefault) ?? null;
  }
});
