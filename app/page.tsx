import { withAuth } from '@workos-inc/authkit-nextjs';
import Home from '@/components/Home';

/** @see withAuth returns featureFlags from the WorkOS session. */
export default async function Page() {
  const session = await withAuth();
  const isAdmin = session.role === 'admin';
  const aiEnabled = isAdmin || (session.featureFlags ?? []).includes('with-ai');
  return <Home aiEnabled={aiEnabled} />;
}
