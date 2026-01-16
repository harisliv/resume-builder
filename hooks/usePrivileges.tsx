import { useAuth } from '@workos-inc/authkit-nextjs/components';

export default function usePrivileges() {
  const { user, role } = useAuth();
  const isLoggedIn = !!user?.id;
  const isMember = role === 'member';
  const isBasic = role === 'basic';
  return { isLoggedIn, isMember, isBasic };
}
