import type { NavSelectorName } from "./types";

export const ICON_BACKGROUND_AND_SHADOW_CLASSES: Record<NavSelectorName, string> = {
    palette: 'amber',
    font: 'emerald',
    style: 'violet',
    resume: 'blue'
};

export const constructIconBackgroundAndShadowClassName = (navSelectorName: NavSelectorName): string => `bg-gradient-to-br from-${ICON_BACKGROUND_AND_SHADOW_CLASSES[navSelectorName]}-500 to-${ICON_BACKGROUND_AND_SHADOW_CLASSES[navSelectorName]}-600 shadow-lg shadow-${ICON_BACKGROUND_AND_SHADOW_CLASSES[navSelectorName]}-500/30`;