import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel
} from '@/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export function LayoutHeader({
  collapsed,
  className,
  ...props
}: ComponentProps<typeof SidebarHeader> & { collapsed?: boolean }) {
  return (
    <SidebarHeader
      className={cn(
        collapsed ? 'flex flex-col items-center gap-3 p-3' : 'p-4',
        className
      )}
      {...props}
    />
  );
}

export function LayoutContent({
  collapsed,
  className,
  ...props
}: ComponentProps<typeof SidebarContent> & { collapsed?: boolean }) {
  return (
    <SidebarContent
      className={cn(
        collapsed && 'flex flex-col items-center gap-3 px-3 py-2',
        className
      )}
      {...props}
    />
  );
}

export function LayoutFooter({
  collapsed,
  className,
  ...props
}: ComponentProps<typeof SidebarFooter> & { collapsed?: boolean }) {
  return (
    <SidebarFooter
      className={cn(collapsed ? 'p-2' : 'p-4', className)}
      {...props}
    />
  );
}

export function HeaderRow({
  collapsed,
  className,
  ...props
}: ComponentProps<'div'> & { collapsed?: boolean }) {
  return (
    <div
      className={cn(
        collapsed
          ? 'flex w-full items-center justify-center'
          : 'mb-2 flex items-center justify-between',
        className
      )}
      {...props}
    />
  );
}

export function ToggleButton({
  collapsed,
  className,
  ...props
}: ComponentProps<typeof Button> & { collapsed?: boolean }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle Sidebar"
      className={cn(
        !collapsed &&
          'hover:bg-accent hover:border-primary/50 animate-pulse-subtle rounded-xl border-2 shadow-lg transition-all duration-200 hover:shadow-xl',
        className
      )}
      {...props}
    />
  );
}

export function CustomizeGroup(props: ComponentProps<typeof SidebarGroup>) {
  return <SidebarGroup className="gap-5 rounded-2xl p-4" {...props} />;
}

export function CustomizeGroupLabel(
  props: ComponentProps<typeof SidebarGroupLabel>
) {
  return (
    <SidebarGroupLabel
      className="text-muted-foreground px-1 text-xs font-bold tracking-wider uppercase"
      {...props}
    />
  );
}

export function HeaderTitle(props: ComponentProps<typeof SidebarGroupLabel>) {
  return (
    <SidebarGroupLabel
      className="text-foreground text-sm font-bold"
      {...props}
    />
  );
}
