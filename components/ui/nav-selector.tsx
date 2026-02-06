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
} from '@/ui/sidebar';
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
  renderIcon: (value: T, isCollapsed?: boolean) => React.ReactNode;
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
  const { isMobile, isCollapsed, setOpen } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            disabled={disabled}
            onClick={(e) => {
              if (isCollapsed) {
                e.preventDefault();
                setOpen(true);
              }
            }}
          >
            <SidebarMenuButton
              size="lg"
              type="button"
              tooltip={tooltip ?? label}
              disabled={disabled}
              className={cn(
                !isCollapsed && 'bg-background shadow-sm border border-border/60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-primary/30 hover:border-primary/20 hover:shadow-md transition-all duration-200',
                isCollapsed && 'p-0 bg-transparent shadow-none border-0 h-auto hover:bg-transparent',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              )}
            >
              {isCollapsed ? (
                renderIcon(value, true)
              ) : (
                <>
                  <div className={cn('flex aspect-square size-10 items-center justify-center rounded-xl shrink-0', iconBgColor)}>
                    {renderIcon(value, false)}
                  </div>
                  <div className="grid flex-1 text-left text-base leading-tight">
                    <span className="truncate font-bold">{label}</span>
                    <span className="truncate text-sm text-muted-foreground font-medium">
                      {displayValue}
                    </span>
                  </div>
                  {disabled ? (
                    <Spinner className="ml-auto size-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  )}
                </>
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
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return (
      <HugeiconsIcon
        icon={PaintBoardIcon}
        size={24}
        strokeWidth={1.5}
        style={{
          background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 30%, ${colors[2]} 80%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        'size-10 rounded-xl items-center justify-center flex shadow-lg',
        className
      )}
      style={{
        background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 30%, ${colors[2]} 80%)`
      }}
    >
      <HugeiconsIcon
        icon={PaintBoardIcon}
        size={24}
        strokeWidth={1.5}
        color="white"
      />
    </div>
  );
}
