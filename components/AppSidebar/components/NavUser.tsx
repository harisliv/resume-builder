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
  NavSelectorTrailingIcon,
  NavSelectorTrailingSpinner
} from './ui/nav-selector-button';
import {
  CollapsedNavUserButton,
  CollapsedUserAvatar,
  ExpandedNavUserButton,
  ExpandedUserAvatar,
  NavUserDropdownContent,
  NavUserDropdownLabel,
  NavUserDropdownLabelContent,
  NavUserInfo
} from './ui/nav-user';
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
      <NavUserInfo name={name} email={email} />
      {loading ? <NavSelectorTrailingSpinner /> : <NavSelectorTrailingIcon />}
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

  const NavButton = isCollapsed
    ? CollapsedNavUserButton
    : ExpandedNavUserButton;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={loading}>
            <NavButton tooltip={name} disabled={loading} loading={loading}>
              <NavUserTriggerContent
                src={user?.profilePictureUrl ?? undefined}
                name={name}
                email={email}
                initials={initials}
                loading={!user}
              />
            </NavButton>
          </DropdownMenuTrigger>
          <NavUserDropdownContent side={isMobile ? 'bottom' : 'right'}>
            <NavUserDropdownLabel>
              <NavUserDropdownLabelContent>
                <ExpandedUserAvatar
                  src={user?.profilePictureUrl ?? undefined}
                  name={name}
                  initials={initials}
                />
                <NavUserInfo name={name} email={email} />
              </NavUserDropdownLabelContent>
            </NavUserDropdownLabel>
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
          </NavUserDropdownContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
