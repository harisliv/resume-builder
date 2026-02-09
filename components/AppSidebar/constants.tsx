import type { NavSelectorName, NavSelectorVariantConfig } from './types';
import {
  Layout01Icon,
  LeftToRightListBulletIcon,
  PaintBoardIcon,
  TextFontIcon
} from '@hugeicons/core-free-icons';
import {
  COLOR_PALETTES,
  DOCUMENT_STYLES,
  FONT_OPTIONS,
  type TDocumentStyleId,
  type TFontId,
  type TPaletteId
} from '@/types/documentStyle';
import type { NavSelectorOption } from './types';
import {
  FontOptionIcon,
  PaletteOptionIcon,
  StyleOptionIcon
} from './components/ui/nav-selector-icons';

export const paletteNavOptions: NavSelectorOption<TPaletteId>[] = Object.values(
  COLOR_PALETTES
).map((p) => ({
  id: p.id,
  label: p.name
}));

export const fontNavOptions: NavSelectorOption<TFontId>[] = Object.values(
  FONT_OPTIONS
).map((f) => ({
  id: f.id,
  label: f.name,
  description: f.category
}));

export const styleNavOptions: NavSelectorOption<TDocumentStyleId>[] =
  Object.values(DOCUMENT_STYLES).map((s) => ({
    id: s.id,
    label: s.name,
    description: s.description
  }));

export function getFontById(id: string) {
  return Object.values(FONT_OPTIONS).find((f) => f.id === id);
}

export const NAV_SELECTOR_VARIANTS: Record<
  NavSelectorName,
  NavSelectorVariantConfig
> = {
  palette: {
    label: 'Palette',
    tooltip: 'Palette',
    SidebarIcon: PaintBoardIcon,
    iconStrokeWidth: 1.5,
    OptionIcon: PaletteOptionIcon
  },
  font: {
    label: 'Font',
    tooltip: 'Font',
    SidebarIcon: TextFontIcon,
    iconStrokeWidth: 2,
    OptionIcon: FontOptionIcon
  },
  style: {
    label: 'Style',
    tooltip: 'Style',
    SidebarIcon: Layout01Icon,
    iconStrokeWidth: 2,
    OptionIcon: StyleOptionIcon
  },
  resume: {
    label: 'My Resumes',
    tooltip: 'My Resumes',
    SidebarIcon: LeftToRightListBulletIcon,
    iconStrokeWidth: 2
  }
};
