'use client';

import { Button } from '@/components/ui/button';
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/ui/sidebar';
import { CollapsedSignInButton } from '../styles/nav-user.styles';

export function SignedOutView() {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <CollapsedSignInButton />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <Button asChild size="default">
      <a href="/login">Sign In</a>
    </Button>
  );
}
