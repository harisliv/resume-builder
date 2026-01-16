import { handleAuth, refreshSession } from '@workos-inc/authkit-nextjs';
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

const DEFAULT_ORG_ID = process.env.WORKOS_DEFAULT_ORG_ID!;

export const GET = handleAuth({
  onSuccess: async ({ user, organizationId }) => {
    if (organizationId) {
      return;
    }

    const { data: memberships } =
      await workos.userManagement.listOrganizationMemberships({
        userId: user.id
      });

    if (memberships.length > 0) {
      await refreshSession({ organizationId: memberships[0].organizationId });
      return;
    }

    await workos.userManagement.createOrganizationMembership({
      userId: user.id,
      organizationId: DEFAULT_ORG_ID,
      roleSlug: 'member'
    });

    await refreshSession({ organizationId: DEFAULT_ORG_ID });
  }
});
