import { useCallback } from 'react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';

/** Returns auth state and a tooltip helper for gated buttons. */
export default function usePrivileges() {
  const { user, role } = useAuth();

  const isLoggedIn = !!user?.id;
  const isMember = !isLoggedIn || role === 'member';
  const isBasic = role === 'basic';
  const isAdmin = role === 'admin';

  /** Returns a disabled-reason tooltip, or `null` if the button should be enabled. */
  const getDisabledTooltip = useCallback(
    (hasSelectedResume: boolean): string | null => {
      if (!isLoggedIn) return 'Please log in to use the platform.';
      if (!hasSelectedResume) return 'You first need to select a resume.';
      if (isMember) return 'Upgrade.';
      return null;
    },
    [isLoggedIn, isMember]
  );

  return { isLoggedIn, isMember, isBasic, isAdmin, getDisabledTooltip };
}
