import type React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import type { ComponentProps } from 'react';

export function CollapsedNavSelectorButton(
  props: ComponentProps<typeof SidebarMenuButton>
) {
  return (
    <SidebarMenuButton
      size="lg"
      type="button"
      className="h-auto border-0 bg-transparent p-0 shadow-none hover:bg-transparent"
      {...props}
    />
  );
}

export function ExpandedNavSelectorButton(
  props: ComponentProps<typeof SidebarMenuButton>
) {
  return (
    <SidebarMenuButton
      size="lg"
      type="button"
      className="bg-background border-border/60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-primary/30 hover:border-primary/20 border shadow-sm transition-all duration-200 hover:shadow-md"
      {...props}
    />
  );
}

export function NavSelectorIconWrapper({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${className ?? ''}`}
      {...props}
    />
  );
}

export function NavSelectorLabelGroup(props: ComponentProps<'div'>) {
  return (
    <div className="grid flex-1 text-left text-base leading-tight" {...props} />
  );
}

export function NavSelectorDropdownContent(
  props: ComponentProps<typeof DropdownMenuContent> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  }
) {
  return (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      align="start"
      sideOffset={4}
      {...props}
    />
  );
}

export function NavSelectorOptionIconWrapper(props: ComponentProps<'div'>) {
  return <div className="flex items-center justify-center" {...props} />;
}

export function NavSelectorSubtitle(props: ComponentProps<'span'>) {
  return (
    <span
      className="text-muted-foreground truncate text-sm font-medium"
      {...props}
    />
  );
}

export function NavSelectorLabel(props: ComponentProps<'span'>) {
  return <span className="truncate font-bold" {...props} />;
}

export function NavSelectorTrailingIcon(
  props: ComponentProps<typeof ChevronsUpDown>
) {
  return (
    <ChevronsUpDown
      className="text-muted-foreground ml-auto size-4"
      {...props}
    />
  );
}

export function NavSelectorTrailingSpinner(
  props: ComponentProps<typeof Spinner>
) {
  return <Spinner className="ml-auto size-4" {...props} />;
}

export function NavSelectorOptionDetail(props: ComponentProps<'div'>) {
  return <div className="flex flex-col" {...props} />;
}

export function NavSelectorOptionDescription(props: ComponentProps<'span'>) {
  return <span className="text-muted-foreground text-xs" {...props} />;
}
