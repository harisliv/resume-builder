'use client';

import { upgradeToBasic } from '@/app/actions/upgradeRole';
import usePrivileges from '@/hooks/usePrivileges';
import {
  getBlockedActionInfo,
  type TBlockedAction,
  type TBlockedActionInput
} from '@/lib/blockedActionGate';
import { UPGRADE_SUCCESS_DIALOG } from '@/lib/upgradeSuccessDialog';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useCallback, useState } from 'react';

type TBlockedActionGateInput = Omit<
  TBlockedActionInput,
  'isLoggedIn' | 'role' | 'isMember' | 'isAdmin' | 'resumeLimit'
>;

/** Shows blocked-action modal copy or runs the requested action when allowed. */
export function useBlockedActionGate(input: TBlockedActionGateInput) {
  const confirm = useWarningDialog();
  const { refreshAuth } = useAuth();
  const { isLoggedIn, role, isMember, isAdmin, resumeLimit } = usePrivileges();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const runOrExplain = useCallback(
    async (action: TBlockedAction, onAllowed: () => void | Promise<void>) => {
      const blocker = getBlockedActionInfo(action, {
        ...input,
        isLoggedIn,
        role,
        isMember,
        isAdmin,
        resumeLimit
      });

      if (!blocker) {
        await onAllowed();
        return;
      }

      const confirmed = await confirm({
        title: blocker.title,
        description: blocker.description,
        confirmLabel: blocker.confirmLabel,
        variant: blocker.variant,
        hideCancel: !blocker.canUpgrade
      });

      if (!confirmed || !blocker.canUpgrade) return;

      setIsUpgrading(true);
      try {
        const result = await upgradeToBasic();
        if (result.error) {
          console.error(result.error);
          return;
        }
        await refreshAuth();
        await confirm(UPGRADE_SUCCESS_DIALOG);
      } finally {
        setIsUpgrading(false);
      }
    },
    [
      confirm,
      input,
      isAdmin,
      isLoggedIn,
      isMember,
      refreshAuth,
      resumeLimit,
      role
    ]
  );

  return { runOrExplain, isUpgrading };
}
