import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';

/** Limit configs per attempt type. */
const LIMITS: Record<string, { max: number; dateKey: () => string }> = {
  ai: {
    max: 5,
    /** Daily key: YYYY-MM-DD. */
    dateKey: () => new Date().toISOString().slice(0, 10)
  },
  pdf: {
    max: 3,
    /** Monthly key: YYYY-MM. */
    dateKey: () => new Date().toISOString().slice(0, 7)
  }
};

/** Returns limit config for a type, throws on unknown type. */
function getLimit(type: string) {
  const config = LIMITS[type];
  if (!config) throw new Error(`Unknown attempt type: ${type}`);
  return config;
}

/** Returns remaining attempts for the authenticated user. */
export const getRemainingAttempts = query({
  args: { type: v.string() },
  returns: v.union(v.object({ remaining: v.number(), max: v.number() }), v.null()),
  handler: async (ctx, { type }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;
    const { max, dateKey } = getLimit(type);
    const key = dateKey();
    const existing = await ctx.db
      .query('aiAttempts')
      .withIndex('by_user_type_date', (q) =>
        q.eq('userId', userId).eq('type', type).eq('dateKey', key)
      )
      .unique();

    const used = existing?.count ?? 0;
    return { remaining: Math.max(0, max - used), max };
  }
});

/**
 * Checks if the user has remaining attempts for the given type.
 * Throws if limit exceeded.
 */
export const checkAttempt = internalMutation({
  args: { userId: v.string(), type: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId, type }) => {
    const { max, dateKey } = getLimit(type);
    const key = dateKey();
    const existing = await ctx.db
      .query('aiAttempts')
      .withIndex('by_user_type_date', (q) =>
        q.eq('userId', userId).eq('type', type).eq('dateKey', key)
      )
      .unique();

    if (existing && existing.count >= max) {
      const period = type === 'pdf' ? 'month' : 'day';
      throw new Error(
        `${type.toUpperCase()} limit reached (${max}/${period}). Try again later.`
      );
    }

    return null;
  }
});

/**
 * Atomically consumes one attempt for the given type.
 * Throws if limit exceeded.
 */
export const consumeAttempt = internalMutation({
  args: { userId: v.string(), type: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId, type }) => {
    const { max, dateKey } = getLimit(type);
    const key = dateKey();
    const existing = await ctx.db
      .query('aiAttempts')
      .withIndex('by_user_type_date', (q) =>
        q.eq('userId', userId).eq('type', type).eq('dateKey', key)
      )
      .unique();

    if (existing) {
      if (existing.count >= max) {
        const period = type === 'pdf' ? 'month' : 'day';
        throw new Error(
          `${type.toUpperCase()} limit reached (${max}/${period}). Try again later.`
        );
      }
      await ctx.db.patch(existing._id, { count: existing.count + 1 });
    } else {
      await ctx.db.insert('aiAttempts', { userId, type, dateKey: key, count: 1 });
    }

    return null;
  }
});
