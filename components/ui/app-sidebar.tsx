'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileText, PaintBrush01Icon } from '@hugeicons/core-free-icons';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { PaletteSelector, FontSelector, DocStyleSelector } from './nav-styles';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FileText} strokeWidth={2} className="h-5 w-5" />
          <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">
            Resume Builder
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <HugeiconsIcon
              icon={PaintBrush01Icon}
              strokeWidth={2}
              className="h-4 w-4 mr-2"
            />
            Styles
          </SidebarGroupLabel>
          <SidebarGroupContent className="group-data-[collapsible=icon]:hidden">
            <PaletteSelector />
            <FontSelector />
            <DocStyleSelector />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
