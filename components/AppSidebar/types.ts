import type { IconSvgElement } from '@hugeicons/react';
import type { ComponentType, ReactNode } from 'react';

export type NavSelectorOption<T extends string = string> = {
    id: T;
    label: string;
    description?: string;
    isDefault?: boolean;
    isAiImproved?: boolean;
};

export type NavSelectorName = 'palette' | 'font' | 'style' | 'resume';

export type NavSelectorVariantConfig = {
    label: string;
    tooltip: string;
    SidebarIcon: IconSvgElement;
    iconStrokeWidth: number;
    OptionIcon?: ComponentType<{ option: NavSelectorOption }>;
};

export type NavSelectorProps<T extends string = string> = {
    name: NavSelectorName;
    value: T;
    onChange: (value: T) => void;
    options: NavSelectorOption<T>[];
    displayValue: string;
    disabled?: boolean;
    /** Tooltip shown when disabled, explaining why interaction is blocked. */
    disabledTooltip?: string;
    loading?: boolean;
    /** Optional text shown next to the label (e.g. "2/20"). */
    labelSuffix?: string;
    /** Controlled open state for the dropdown. */
    open?: boolean;
    /** Callback when the dropdown open state changes. */
    onOpenChange?: (open: boolean) => void;
    /** Static node or render function receiving a close callback. */
    dropdownHeader?: React.ReactNode | ((close: () => void) => React.ReactNode);
    /** Wraps or replaces the default option content per option. */
    renderOptionContent?: (option: NavSelectorOption<T>, defaultContent: ReactNode) => ReactNode;
};