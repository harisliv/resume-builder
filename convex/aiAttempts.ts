import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

/** Max AI generations per day for non-admin users. */
const DAILY_LIMIT = 0;

/** Returns current UTC date as YYYY-MM-DD. */
function getDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Atomically consumes one daily AI attempt for the given user.
 * Throws if the daily limit is exceeded.
 */
export const consumeDailyAttempt = internalMutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const dateKey = getDateKey();
    const existing = await ctx.db
      .query('aiAttempts')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('dateKey', dateKey))
      .unique();

    if (existing) {
      if (existing.count >= DAILY_LIMIT) {
        throw new Error(
          `Daily AI suggestion limit reached (${DAILY_LIMIT}/day). Try again tomorrow.`
        );
      }
      await ctx.db.patch(existing._id, { count: existing.count + 1 });
    } else {
      await ctx.db.insert('aiAttempts', { userId, dateKey, count: 1 });
    }

    return null;
  }
});
