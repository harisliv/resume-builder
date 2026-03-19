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

/** Internal query to fetch a prompt by exact name. */
export const getByNameInternal = internalQuery({
  args: { name: v.string() },
  returns: v.union(rowValidator, v.null()),
  handler: async (ctx, args) => {
    const all = await ctx.db.query('systemPrompts').collect();
    const match = all.find((r) => r.name === args.name);
    if (!match) return null;
    return { ...match, type: match.type ?? ('prompt' as const) };
  }
});
