'use server';

import { withAuth, refreshSession } from '@workos-inc/authkit-nextjs';
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

/** Upgrades the current user's org membership from member → basic. */
export async function upgradeToBasic() {
  const { user } = await withAuth({ ensureSignedIn: true });

  const { data: memberships } =
    await workos.userManagement.listOrganizationMemberships({
      userId: user.id
    });

  if (memberships.length === 0) {
    return { error: 'No organization membership found.' };
  }

  await workos.userManagement.updateOrganizationMembership(memberships[0].id, {
    roleSlug: 'basic'
  });

  await refreshSession();

  return { success: true };
}

/** Downgrades the current user's org membership back to member. Testing only. */
export async function downgradeToMember() {
  if (process.env.NEXT_PUBLIC_TESTING_FEATURES !== 'true') {
    return { error: 'Not available.' };
  }

  const { user } = await withAuth({ ensureSignedIn: true });

  const { data: memberships } =
    await workos.userManagement.listOrganizationMemberships({
      userId: user.id
    });

  if (memberships.length === 0) {
    return { error: 'No organization membership found.' };
  }

  await workos.userManagement.updateOrganizationMembership(memberships[0].id, {
    roleSlug: 'member'
  });

  await refreshSession();

  return { success: true };
}
