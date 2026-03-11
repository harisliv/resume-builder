'use client';

import { type MouseEvent, useCallback, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/ui/sidebar';
import { MenuButton } from '../styles/sidebar-menu-button.styles';
import { DropdownContent } from '../styles/nav-selector.styles';
import type { NavSelectorProps } from '../types';
import { NAV_SELECTOR_VARIANTS } from '../constants';
import { NavSelectorTriggerContent } from './NavSelectorTriggerContent';
import { NavSelectorOptionContent } from './NavSelectorOptionContent';

export function NavSelector<T extends string = string>({
  name,
  value,
  displayValue,
  onChange,
  options,
  disabled = false,
  disabledTooltip,
  loading = false,
  labelSuffix,
  open: controlledOpen,
  onOpenChange,
  dropdownHeader,
  renderOptionContent
}: NavSelectorProps<T>) {
  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownOpen = controlledOpen ?? internalOpen;
  const setDropdownOpen = onOpenChange ?? setInternalOpen;
  const { isMobile, isCollapsed, setOpen } = useSidebar();
  const { label, tooltip, OptionIcon } = NAV_SELECTOR_VARIANTS[name];

  /** Stable callback to close the dropdown programmatically. */
  const closeDropdown = useCallback(() => setDropdownOpen(false), [setDropdownOpen]);

  const handleCollapsedClick = (e: MouseEvent) => {
    if (isCollapsed) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          {disabled && disabledTooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-full" tabIndex={0}>
                  <MenuButton
                    collapsed={isCollapsed}
                    tooltip={tooltip}
                    disabled={disabled}
                  >
                    <NavSelectorTriggerContent
                      label={label}
                      displayValue={
                        displayValue.charAt(0).toUpperCase() +
                        displayValue.slice(1)
                      }
                      disabled={disabled}
                      loading={loading}
                      navSelectorName={name}
                    />
                  </MenuButton>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">{disabledTooltip}</TooltipContent>
            </Tooltip>
          ) : (
            <DropdownMenuTrigger
              asChild
              disabled={disabled}
              onClick={handleCollapsedClick}
            >
              <MenuButton
                collapsed={isCollapsed}
                tooltip={tooltip}
                disabled={disabled}
              >
                <NavSelectorTriggerContent
                  label={label}
                  displayValue={
                    displayValue.charAt(0).toUpperCase() +
                    displayValue.slice(1)
                  }
                  disabled={disabled}
                  loading={loading}
                  navSelectorName={name}
                />
              </MenuButton>
            </DropdownMenuTrigger>
          )}
          <DropdownContent side={isMobile ? 'bottom' : 'right'}>
            {typeof dropdownHeader === 'function'
              ? dropdownHeader(closeDropdown)
              : dropdownHeader}
            <DropdownMenuLabel className="flex items-center justify-between">
              {label}
              {labelSuffix && (
                <span className="text-muted-foreground text-xs font-medium">
                  {labelSuffix}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={value}
              onValueChange={(v) => {
                onChange(v as T);
                setDropdownOpen(false);
              }}
            >
              {options.map((option) => {
                const defaultContent = (
                  <NavSelectorOptionContent option={option} Icon={OptionIcon} />
                );
                return (
                  <DropdownMenuRadioItem
                    key={option.id}
                    value={option.id}
                    className={
                      renderOptionContent
                        ? 'gap-3 pl-2.5 pr-2.5 cursor-pointer focus:bg-accent/40 data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold [&>[data-slot=dropdown-menu-radio-item-indicator]]:hidden'
                        : 'gap-3 cursor-pointer'
                    }
                    onSelect={
                      renderOptionContent
                        ? (e) => e.preventDefault()
                        : undefined
                    }
                  >
                    {renderOptionContent
                      ? renderOptionContent(option, defaultContent)
                      : defaultContent}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
