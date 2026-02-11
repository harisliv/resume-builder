import type { ComponentProps } from 'react';
import { UserCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenuContent,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';

function CollapsedAvatarFallback(
  props: ComponentProps<typeof AvatarFallback>
) {
  return (
    <AvatarFallback
      className="from-primary to-primary/80 rounded-full bg-gradient-to-br text-sm font-bold text-white"
      {...props}
    />
  );
}

function ExpandedAvatarFallback(
  props: ComponentProps<typeof AvatarFallback>
) {
  return (
    <AvatarFallback
      className="from-primary to-primary/80 rounded-xl bg-gradient-to-br font-bold text-white"
      {...props}
    />
  );
}

interface IUserAvatarProps {
  src?: string;
  name: string;
  initials: string;
  loading?: boolean;
}

export function CollapsedUserAvatar({
  src,
  name,
  initials,
  loading
}: IUserAvatarProps) {
  return (
    <Avatar className="h-8 w-8 shrink-0 rounded-full">
      {loading ? (
        <CollapsedAvatarFallback>
          <Spinner className="size-4 text-white" />
        </CollapsedAvatarFallback>
      ) : (
        <>
          <AvatarImage src={src} alt={name} className="rounded-full" />
          <CollapsedAvatarFallback>{initials}</CollapsedAvatarFallback>
        </>
      )}
    </Avatar>
  );
}

export function ExpandedUserAvatar({
  src,
  name,
  initials,
  loading
}: IUserAvatarProps) {
  return (
    <Avatar className="h-10 w-10 shrink-0 rounded-xl">
      {loading ? (
        <ExpandedAvatarFallback>
          <Spinner className="size-4 text-white" />
        </ExpandedAvatarFallback>
      ) : (
        <>
          <AvatarImage src={src} alt={name} className="rounded-xl" />
          <ExpandedAvatarFallback>{initials}</ExpandedAvatarFallback>
        </>
      )}
    </Avatar>
  );
}

export function UserInfo({
  name,
  email
}: {
  name: string;
  email?: string;
}) {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-bold">{name}</span>
      {email && (
        <span className="text-muted-foreground truncate text-xs">{email}</span>
      )}
    </div>
  );
}

export function CollapsedSignInButton() {
  return (
    <SidebarMenuButton
      size="lg"
      tooltip="Sign In"
      asChild
      className="h-auto border-0 bg-transparent p-0 shadow-none hover:bg-transparent"
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
  );
}

export function DropdownContent(
  props: ComponentProps<typeof DropdownMenuContent>
) {
  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="end"
      sideOffset={4}
      {...props}
    />
  );
}

export function DropdownLabel(
  props: ComponentProps<typeof DropdownMenuLabel>
) {
  return <DropdownMenuLabel className="p-0 font-normal" {...props} />;
}

export function DropdownLabelContent(props: ComponentProps<'div'>) {
  return (
    <div
      className="flex items-center gap-3 px-2 py-2 text-left text-sm"
      {...props}
    />
  );
}
