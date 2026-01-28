'use server';

import { signOut } from '@workos-inc/authkit-nextjs';
import { headers } from 'next/headers';

async function getReturnTo(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';

  if (host) {
    return `${protocol}://${host}`;
  }

  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return '/';
}

export const handleSignOutAction = async () => {
  const returnTo = await getReturnTo();
  console.log("🚀 ~ handleSignOutAction ~ returnTo:", returnTo);
  await signOut({ returnTo });
};
