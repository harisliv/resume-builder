'use client';

import { LogOut, Sparkles } from 'lucide-react';
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
  const { user, loading } = useAuth();

  if (!user && !loading) return <SignedOutView />;

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
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
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
