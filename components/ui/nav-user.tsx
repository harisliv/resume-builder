'use client';

import { UserCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronsUpDown, LogOut, Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { Button } from './button';
import { handleSignOutAction } from '@/app/actions/signOut';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function NavUser() {
  const { isMobile, state } = useSidebar();
  const { user, loading } = useAuth();
  const isCollapsed = state === 'collapsed';

  if (!user && !loading) {
    if (isCollapsed) {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sign In"
              asChild
              className="border-0 bg-transparent p-0! shadow-none"
            >
              <a href="/login" className="flex items-center justify-center">
                <div className="from-primary to-primary/80 flex size-8 items-center justify-center rounded-lg bg-gradient-to-br">
                  <HugeiconsIcon
                    icon={UserCircle02Icon}
                    size={18}
                    strokeWidth={1.5}
                    color="white"
                  />
                </div>
              </a>
            </SidebarMenuButton>
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
            <SidebarMenuButton
              size="lg"
              tooltip={name}
              disabled={loading}
              className={cn(
                'bg-background border-border/60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-primary/30 hover:border-primary/20 border shadow-sm transition-all duration-200 hover:shadow-md',
                'group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:shadow-none',
                loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              )}
            >
              <Avatar className="h-10 w-10 shrink-0 rounded-xl group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:rounded-lg">
                {user && (
                  <>
                    <AvatarImage
                      src={user.profilePictureUrl ?? undefined}
                      alt={name}
                      className="rounded-xl group-data-[collapsible=icon]:rounded-lg"
                    />
                    <AvatarFallback className="from-primary to-primary/80 rounded-xl bg-gradient-to-br font-bold text-white group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:text-sm">
                      {initials}
                    </AvatarFallback>
                  </>
                )}
                {!user && (
                  <AvatarFallback className="from-primary to-primary/80 rounded-xl bg-gradient-to-br font-bold text-white group-data-[collapsible=icon]:rounded-lg">
                    <Spinner className="size-4 text-white" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold">{name}</span>
                {email && (
                  <span className="text-muted-foreground truncate text-xs font-medium">
                    {email}
                  </span>
                )}
              </div>
              {loading ? (
                <Spinner className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              ) : (
                <ChevronsUpDown className="text-muted-foreground ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarImage
                    src={user?.profilePictureUrl ?? undefined}
                    alt={name}
                  />
                  <AvatarFallback className="from-primary to-primary/80 rounded-xl bg-gradient-to-br font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">{name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                handleSignOutAction();
              }}
            >
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
