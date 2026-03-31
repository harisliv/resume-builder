import { withAuth } from '@workos-inc/authkit-nextjs';
import Home from '@/components/Home';

/** @see withAuth returns featureFlags from the WorkOS session. */
export default async function Page() {
  await withAuth();
  return <Home />;
}
