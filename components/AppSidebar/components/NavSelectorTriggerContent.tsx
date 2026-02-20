'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { useSidebar } from '@/ui/sidebar';
import {
  TrailingIcon,
  TrailingSpinner
} from '../styles/sidebar-menu-button.styles';
import { LabelGroup, Label, Subtitle } from '../styles/nav-selector.styles';
import { IconBadge } from '@/styles/icon-badge.styles';
import type { NavSelectorName } from '../types';
import { ICON_BACKGROUND_CLASSES, NAV_SELECTOR_VARIANTS } from '../constants';

type Props = {
  label: string;
  displayValue: string;
  disabled?: boolean;
  loading?: boolean;
  navSelectorName: NavSelectorName;
};

export function NavSelectorTriggerContent({
  label,
  displayValue,
  disabled,
  loading,
  navSelectorName
}: Props) {
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

  const backgroundAndShadowClassName = ICON_BACKGROUND_CLASSES[navSelectorName];

  return (
    <>
      <IconBadge className={`size-10 ${backgroundAndShadowClassName}`}>
        <HugeiconsIcon
          icon={config.SidebarIcon}
          size={20}
          strokeWidth={config.iconStrokeWidth}
          className="text-white"
        />
      </IconBadge>
      <LabelGroup>
        <Label>{label}</Label>
        <Subtitle>{displayValue}</Subtitle>
      </LabelGroup>
      {loading ? <TrailingSpinner /> : !disabled && <TrailingIcon />}
    </>
  );
}
