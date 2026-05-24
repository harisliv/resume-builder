import { getWorkosDefaultOrganizationId } from '@/lib/workosDefaultOrganization';
import { handleAuth, refreshSession } from '@workos-inc/authkit-nextjs';
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export const GET = handleAuth({
  onSuccess: async ({ user, organizationId }) => {
    if (organizationId) {
      return;
    }

    const defaultOrgId = getWorkosDefaultOrganizationId();

    if (!defaultOrgId) {
      throw new Error(
        'WORKOS_DEFAULT_ORG_ID must be set when onboarding users without organization memberships'
      );
    }

    await workos.userManagement.createOrganizationMembership({
      userId: user.id,
      organizationId: defaultOrgId,
      roleSlug: 'member'
    });

    await refreshSession({ organizationId: defaultOrgId });
  }
});
