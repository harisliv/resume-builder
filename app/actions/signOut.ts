'use server';

import { signOut } from '@workos-inc/authkit-nextjs';

const returnTo = process.env.VERCEL_ENV === 'preview'
  ? `https://${process.env.VERCEL_URL}`
  : process.env.VERCEL_ENV === 'production'
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '/';

export const handleSignOutAction = async () => {
  console.log("🚀 ~ handleSignOutAction ~ returnTo:", returnTo)
  await signOut({ returnTo });
};
