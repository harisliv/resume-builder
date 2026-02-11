import type { ActionCtx, MutationCtx, QueryCtx } from './_generated/server';

export async function getAuthenticatedUser(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthorized: User is not authenticated');
  }
  return identity.subject;
}
