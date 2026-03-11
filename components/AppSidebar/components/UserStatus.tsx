'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { CrownIcon, UserIcon } from '@hugeicons/core-free-icons';
import usePrivileges from '@/hooks/usePrivileges';
import { cn } from '@/lib/utils';
import type { IconSvgElement } from '@hugeicons/react';

const ROLE_CONFIG: Record<
  string,
  { label: string; icon: IconSvgElement; className: string }
> = {
  free: {
    label: 'FREE',
    icon: UserIcon,
    className: 'bg-muted text-muted-foreground'
  },
  pro: {
    label: 'PRO',
    icon: CrownIcon,
    className:
      'bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white shadow-sm shadow-fuchsia-500/25'
  },
  admin: {
    label: 'ADMIN',
    icon: CrownIcon,
    className:
      'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm shadow-amber-500/25'
  }
};

/** Displays user role badge with icon in the sidebar header. Hidden when not logged in. */
export function UserStatus() {
  const { isLoggedIn, isMember, isAdmin } = usePrivileges();

  if (!isLoggedIn) return null;

  const roleKey = isAdmin ? 'admin' : isMember ? 'free' : 'pro';
  const role = ROLE_CONFIG[roleKey];

  return (
    <span
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-extrabold tracking-wider',
        role.className
      )}
    >
      <HugeiconsIcon icon={role.icon} size={14} strokeWidth={2} />
      {role.label}
    </span>
  );
}
