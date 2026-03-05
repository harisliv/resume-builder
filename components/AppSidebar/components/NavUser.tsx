'use client';

import { useState } from 'react';
import { ArrowDownCircle, LogOut, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/ui/sidebar';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { handleSignOutAction } from '@/app/actions/signOut';
import { upgradeToBasic, downgradeToMember } from '@/app/actions/upgradeRole';
import usePrivileges from '@/hooks/usePrivileges';
import {
  MenuButton,
  TrailingIcon,
  TrailingSpinner
} from '../styles/sidebar-menu-button.styles';
import {
  CollapsedUserAvatar,
  ExpandedUserAvatar,
  DropdownContent,
  DropdownLabel,
  DropdownLabelContent,
  UserInfo
} from '../styles/nav-user.styles';
import { SignedOutView } from './SignedOutView';

function NavUserTriggerContent({
  src,
  name,
  email,
  initials,
  loading
}: {
  src?: string;
  name: string;
  email: string;
  initials: string;
  loading?: boolean;
}) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return (
      <CollapsedUserAvatar
        src={src}
        name={name}
        initials={initials}
        loading={loading}
      />
    );
  }

  return (
    <>
      <ExpandedUserAvatar
        src={src}
        name={name}
        initials={initials}
        loading={loading}
      />
      <UserInfo name={name} email={email} />
      {loading ? <TrailingSpinner /> : <TrailingIcon />}
    </>
  );
}

export function NavUser() {
  const { isMobile, isCollapsed } = useSidebar();
  const { user, loading, refreshAuth } = useAuth();
  const { isMember } = usePrivileges();
  const [upgrading, setUpgrading] = useState(false);
  const [downgrading, setDowngrading] = useState(false);
  const showTestingFeatures =
    process.env.NEXT_PUBLIC_TESTING_FEATURES === 'true';

  if (!user && !loading) return <SignedOutView />;

  /** Upgrades member → basic via server action, then refreshes client auth. */
  const handleUpgrade = async (e: Event) => {
    e.preventDefault();
    setUpgrading(true);
    try {
      const result = await upgradeToBasic();
      if (result.error) {
        console.error(result.error);
        return;
      }
      await refreshAuth();
    } finally {
      setUpgrading(false);
    }
  };

  /** Downgrades basic → member for testing. */
  const handleDowngrade = async (e: Event) => {
    e.preventDefault();
    setDowngrading(true);
    try {
      const result = await downgradeToMember();
      if (result.error) {
        console.error(result.error);
        return;
      }
      await refreshAuth();
    } finally {
      setDowngrading(false);
    }
  };

  const name = user ? `${user.firstName} ${user.lastName}` : 'Loading...';
  const email = user?.email ?? '';
  const initials = user
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={loading}>
            <MenuButton
              collapsed={isCollapsed}
              tooltip={name}
              disabled={loading}
              loading={loading}
            >
              <NavUserTriggerContent
                src={user?.profilePictureUrl ?? undefined}
                name={name}
                email={email}
                initials={initials}
                loading={!user}
              />
            </MenuButton>
          </DropdownMenuTrigger>
          <DropdownContent side={isMobile ? 'bottom' : 'right'}>
            <DropdownLabel>
              <DropdownLabelContent>
                <ExpandedUserAvatar
                  src={user?.profilePictureUrl ?? undefined}
                  name={name}
                  initials={initials}
                />
                <UserInfo name={name} email={email} />
              </DropdownLabelContent>
            </DropdownLabel>
            {isMember && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={handleUpgrade}
                    disabled={upgrading}
                  >
                    <Sparkles />
                    {upgrading ? 'Upgrading...' : 'Upgrade to Pro'}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
            {showTestingFeatures && !isMember && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={handleDowngrade}
                    disabled={downgrading}
                  >
                    <ArrowDownCircle />
                    {downgrading ? 'Downgrading...' : 'Downgrade to Member'}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleSignOutAction()}>
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
