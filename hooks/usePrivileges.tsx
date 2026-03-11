import { useCallback } from 'react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';

/** Max resumes per role. */
const RESUME_LIMITS: Record<string, number> = {
  member: 1,
  basic: 20,
  admin: Infinity
};

/** Returns auth state and a tooltip helper for gated buttons. */
export default function usePrivileges() {
  const { user, role } = useAuth();

  const isLoggedIn = !!user?.id;
  const isMember = !isLoggedIn || role === 'member';
  const isBasic = role === 'basic';
  const isAdmin = role === 'admin';
  const resumeLimit = RESUME_LIMITS[role ?? 'member'] ?? 1;

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

  return { isLoggedIn, isMember, isBasic, isAdmin, resumeLimit, getDisabledTooltip };
}
