import { getWorkosDefaultOrganizationId } from '@/lib/workosDefaultOrganization';
import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export const GET = async () => {
  const organizationId = getWorkosDefaultOrganizationId();
  const signInUrl = await getSignInUrl(organizationId ? { organizationId } : {});
  return redirect(signInUrl);
};
