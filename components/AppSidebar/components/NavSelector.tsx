'use client';

import type { MouseEvent } from 'react';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  dropdownHeader
}: NavSelectorProps<T>) {
  const { isMobile, isCollapsed, setOpen } = useSidebar();
  const { label, tooltip, OptionIcon } = NAV_SELECTOR_VARIANTS[name];

  const handleCollapsedClick = (e: MouseEvent) => {
    if (isCollapsed) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
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
                  displayValue.charAt(0).toUpperCase() + displayValue.slice(1)
                }
                disabled={disabled}
                navSelectorName={name}
              />
            </MenuButton>
          </DropdownMenuTrigger>
          <DropdownContent side={isMobile ? 'bottom' : 'right'}>
            {dropdownHeader}
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
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
                  <NavSelectorOptionContent option={option} Icon={OptionIcon} />
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
