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
import { Spinner } from '@/components/ui/spinner';
import { HugeiconsIcon } from '@hugeicons/react';
import { PaintBoardIcon } from '@hugeicons/core-free-icons';

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
  disabled?: boolean;
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
  iconBgColor,
  disabled = false
}: NavSelectorProps<T>) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <SidebarMenuButton
              size="lg"
              type="button"
              tooltip={tooltip ?? label}
              disabled={disabled}
              className={cn(
                'bg-background border-border/60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-primary/30 hover:border-primary/20 border shadow-sm transition-all duration-200 hover:shadow-md',
                'group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:shadow-none',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              )}
            >
              <div
                className={cn(
                  'flex aspect-square size-10 shrink-0 items-center justify-center rounded-xl',
                  'group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg',
                  iconBgColor
                )}
              >
                {renderIcon(value)}
              </div>
              <div className="grid flex-1 text-left text-base leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold">{label}</span>
                <span className="text-muted-foreground truncate text-sm font-medium">
                  {displayValue}
                </span>
              </div>
              {disabled ? (
                <Spinner className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              ) : (
                <ChevronsUpDown className="text-muted-foreground ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              )}
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
                      <span className="text-muted-foreground text-xs">
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
      className={cn(
        'flex size-10 items-center justify-center rounded-xl shadow-lg group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg',
        className
      )}
      style={{
        background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 30%, ${colors[2]} 80%)`
      }}
    >
      <HugeiconsIcon
        icon={PaintBoardIcon}
        size={24}
        color="white"
        strokeWidth={1.5}
      />
    </div>
  );
}
