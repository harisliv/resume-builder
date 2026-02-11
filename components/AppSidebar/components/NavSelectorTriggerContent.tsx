'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { useSidebar } from '@/ui/sidebar';
import { TrailingIcon, TrailingSpinner } from '../styles/sidebar-menu-button.styles';
import { IconWrapper, LabelGroup, Label, Subtitle } from '../styles/nav-selector.styles';
import type { NavSelectorName } from '../types';
import { ICON_BACKGROUND_CLASSES, NAV_SELECTOR_VARIANTS } from '../constants';

type Props = {
  label: string;
  displayValue: string;
  disabled?: boolean;
  navSelectorName: NavSelectorName;
};

export function NavSelectorTriggerContent({
  label,
  displayValue,
  disabled,
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
      <IconWrapper className={backgroundAndShadowClassName}>
        <HugeiconsIcon
          icon={config.SidebarIcon}
          size={20}
          strokeWidth={config.iconStrokeWidth}
          className="text-white"
        />
      </IconWrapper>
      <LabelGroup>
        <Label>{label}</Label>
        <Subtitle>{displayValue}</Subtitle>
      </LabelGroup>
      {disabled ? <TrailingSpinner /> : <TrailingIcon />}
    </>
  );
}
