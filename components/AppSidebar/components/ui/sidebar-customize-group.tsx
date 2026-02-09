import { SidebarGroup, SidebarGroupLabel } from '@/ui/sidebar';
import type { ComponentProps } from 'react';

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
