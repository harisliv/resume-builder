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
} from '@/ui/sidebar';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { Button } from './button';
import { handleSignOutAction } from '@/app/actions/signOut';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function NavUser() {
  const { isMobile, isCollapsed } = useSidebar();
  const { user, loading } = useAuth();

  if (!user && !loading) {
    if (isCollapsed) {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sign In"
              asChild
              className="p-0 bg-transparent shadow-none border-0 h-auto hover:bg-transparent"
            >
              <a href="/login" className="flex items-center justify-center">
                <HugeiconsIcon
                  icon={UserCircle02Icon}
                  size={24}
                  strokeWidth={1.5}
                  className="text-foreground"
                />
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
                !isCollapsed && 'bg-background shadow-sm border border-border/60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-primary/30 hover:border-primary/20 hover:shadow-md transition-all duration-200',
                isCollapsed && 'p-0 bg-transparent shadow-none border-0 h-auto hover:bg-transparent',
                loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              )}
            >
              {isCollapsed ? (
                <Avatar className="h-8 w-8 rounded-full shrink-0">
                  {user && (
                    <>
                      <AvatarImage
                        src={user.profilePictureUrl ?? undefined}
                        alt={name}
                        className="rounded-full"
                      />
                      <AvatarFallback className="rounded-full bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-sm">
                        {initials}
                      </AvatarFallback>
                    </>
                  )}
                  {!user && (
                    <AvatarFallback className="rounded-full bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                      <Spinner className="size-4 text-white" />
                    </AvatarFallback>
                  )}
                </Avatar>
              ) : (
                <>
                  <Avatar className="h-10 w-10 rounded-xl shrink-0">
                    {user && (
                      <>
                        <AvatarImage
                          src={user.profilePictureUrl ?? undefined}
                          alt={name}
                          className="rounded-xl"
                        />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                          {initials}
                        </AvatarFallback>
                      </>
                    )}
                    {!user && (
                      <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                        <Spinner className="size-4 text-white" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold">{name}</span>
                    {email && (
                      <span className="truncate text-xs text-muted-foreground font-medium">
                        {email}
                      </span>
                    )}
                  </div>
                  {loading ? (
                    <Spinner className="ml-auto size-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  )}
                </>
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
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
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
