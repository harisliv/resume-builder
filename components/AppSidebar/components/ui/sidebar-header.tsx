import { SidebarContent, SidebarFooter, SidebarHeader } from '@/ui/sidebar';
import type { ComponentProps } from 'react';

export function CollapsedSidebarHeader(
  props: ComponentProps<typeof SidebarHeader>
) {
  return (
    <SidebarHeader
      className="flex flex-col items-center gap-3 p-3"
      {...props}
    />
  );
}

export function ExpandedSidebarHeader(
  props: ComponentProps<typeof SidebarHeader>
) {
  return <SidebarHeader className="p-4" {...props} />;
}

export function CollapsedSidebarContent(
  props: ComponentProps<typeof SidebarContent>
) {
  return (
    <SidebarContent
      className="flex flex-col items-center gap-3 px-3 py-2"
      {...props}
    />
  );
}

export function ExpandedSidebarContent(
  props: ComponentProps<typeof SidebarContent>
) {
  return <SidebarContent {...props} />;
}

export function CollapsedSidebarFooter(
  props: ComponentProps<typeof SidebarFooter>
) {
  return <SidebarFooter className="p-2" {...props} />;
}

export function ExpandedSidebarFooter(
  props: ComponentProps<typeof SidebarFooter>
) {
  return <SidebarFooter className="p-4" {...props} />;
}

export function CollapsedHeaderRow(props: ComponentProps<'div'>) {
  return <div className="flex w-full items-center justify-center" {...props} />;
}

export function ExpandedHeaderRow(props: ComponentProps<'div'>) {
  return <div className="mb-2 flex items-center justify-between" {...props} />;
}
