import type { ActionCtx, MutationCtx, QueryCtx } from './_generated/server';

/** Returns the authenticated user's subject (WorkOS user ID). Throws if unauthenticated. */
export async function getAuthenticatedUser(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthorized: User is not authenticated');
  }
  return identity.subject;
}

/** Returns the authenticated user's organization role from JWT claims. */
export async function getUserRole(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<string | undefined> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthorized: User is not authenticated');
  }
  return (identity as unknown as Record<string, unknown>).role as string | undefined;
}
