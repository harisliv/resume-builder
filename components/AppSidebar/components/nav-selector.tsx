'use client';

import type { MouseEvent } from 'react';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CollapsedNavSelectorButton,
  ExpandedNavSelectorButton,
  NavSelectorIconWrapper,
  NavSelectorLabelGroup,
  NavSelectorLabel,
  NavSelectorSubtitle,
  NavSelectorTrailingIcon,
  NavSelectorTrailingSpinner,
  NavSelectorDropdownContent,
  NavSelectorOptionIconWrapper,
  NavSelectorOptionDetail,
  NavSelectorOptionDescription
} from '@/components/AppSidebar/components/ui/nav-selector-button';
import type {
  NavSelectorName,
  NavSelectorOption,
  NavSelectorProps
} from '../types';
import { NAV_SELECTOR_VARIANTS } from '../constants';
import { constructIconBackgroundAndShadowClassName } from '../utils';

function NavSelectorTriggerContent({
  label,
  displayValue,
  disabled,
  navSelectorName
}: {
  label: string;
  displayValue: string;
  disabled?: boolean;
  navSelectorName: NavSelectorName;
}) {
  const { isCollapsed } = useSidebar();

  const config = NAV_SELECTOR_VARIANTS[navSelectorName];

  if (isCollapsed) {
    return (
      <HugeiconsIcon
        icon={config.SidebarIcon}
        size={20}
        strokeWidth={config.iconStrokeWidth}
      />
    );
  }

  const backgroundAndShadowClassName =
    constructIconBackgroundAndShadowClassName(navSelectorName);

  return (
    <>
      <NavSelectorIconWrapper className={backgroundAndShadowClassName}>
        <HugeiconsIcon
          icon={config.SidebarIcon}
          size={20}
          strokeWidth={config.iconStrokeWidth}
          className="text-white"
        />
      </NavSelectorIconWrapper>
      <NavSelectorLabelGroup>
        <NavSelectorLabel>{label}</NavSelectorLabel>
        <NavSelectorSubtitle>{displayValue}</NavSelectorSubtitle>
      </NavSelectorLabelGroup>
      {disabled ? <NavSelectorTrailingSpinner /> : <NavSelectorTrailingIcon />}
    </>
  );
}

function NavSelectorDropdownHeader({
  label,
  dropdownHeader
}: {
  label: string;
  dropdownHeader?: React.ReactNode;
}) {
  if (dropdownHeader) {
    return (
      <>
        {dropdownHeader}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
      </>
    );
  }

  return (
    <>
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
    </>
  );
}

function NavSelectorOptionContent<T extends string>({
  option,
  OptionIcon
}: {
  option: NavSelectorOption<T>;
  OptionIcon?: React.ComponentType<{ option: NavSelectorOption }>;
}) {
  return (
    <>
      {OptionIcon ? (
        <NavSelectorOptionIconWrapper>
          <OptionIcon option={option} />
        </NavSelectorOptionIconWrapper>
      ) : null}
      <NavSelectorOptionDetail>
        <span>{option.label}</span>
        {option.description ? (
          <NavSelectorOptionDescription>
            {option.description}
          </NavSelectorOptionDescription>
        ) : null}
      </NavSelectorOptionDetail>
    </>
  );
}

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
  const config = NAV_SELECTOR_VARIANTS[name];
  const selectedOption = options.find((o) => o.id === value);
  const resolvedDisplayValue =
    displayValue ?? selectedOption?.label ?? config.label;

  const handleCollapsedClick = (e: MouseEvent) => {
    if (isCollapsed) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const NavButton = isCollapsed
    ? CollapsedNavSelectorButton
    : ExpandedNavSelectorButton;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            disabled={disabled}
            onClick={handleCollapsedClick}
          >
            <NavButton tooltip={config.tooltip} disabled={disabled}>
              <NavSelectorTriggerContent
                label={config.label}
                displayValue={resolvedDisplayValue}
                disabled={disabled}
                navSelectorName={name}
              />
            </NavButton>
          </DropdownMenuTrigger>
          <NavSelectorDropdownContent side={isMobile ? 'bottom' : 'right'}>
            <NavSelectorDropdownHeader
              label={config.label}
              dropdownHeader={dropdownHeader}
            />
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
                  <NavSelectorOptionContent
                    option={option}
                    OptionIcon={config.OptionIcon}
                  />
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </NavSelectorDropdownContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
