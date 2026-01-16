'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export type NavSelectorOption<T extends string = string> = {
  id: T;
  label: string;
  description?: string;
};

export type NavSelectorProps<T extends string = string> = {
  label: string;
  value: T;
  displayValue: string;
  onChange: (value: T) => void;
  options: NavSelectorOption<T>[];
  renderIcon: (value: T) => React.ReactNode;
  renderOptionIcon?: (option: NavSelectorOption<T>) => React.ReactNode;
  tooltip?: string;
  iconBgColor?: string;
};

export function NavSelector<T extends string = string>({
  label,
  value,
  displayValue,
  onChange,
  options,
  renderIcon,
  renderOptionIcon,
  tooltip,
  iconBgColor
}: NavSelectorProps<T>) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              type="button"
              tooltip={tooltip ?? label}
              className="bg-background/80 shadow-sm border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:border-0"
            >
              <div
                className={cn(
                  'flex aspect-square size-8 items-center justify-center rounded-full shrink-0',
                  iconBgColor
                )}
              >
                {renderIcon(value)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{label}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {displayValue}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={value}
              onValueChange={(v) => onChange(v as T)}
            >
              {options.map((option) => (
                <DropdownMenuRadioItem
                  key={option.id}
                  value={option.id}
                  className="gap-3"
                >
                  {renderOptionIcon && (
                    <div className="flex items-center justify-center">
                      {renderOptionIcon(option)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function GradientCircle({
  colors,
  className
}: {
  colors: [string, string, string];
  className?: string;
}) {
  return (
    <div
      className={className ?? 'size-8 rounded-full'}
      style={{
        background: `conic-gradient(${colors[0]} 0deg 120deg, ${colors[1]} 120deg 240deg, ${colors[2]} 240deg 360deg)`
      }}
    />
  );
}
