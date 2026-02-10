import {
  COLOR_PALETTES,
  DOCUMENT_STYLES,
  FONT_OPTIONS,
  type TDocumentStyleId,
  type TFontId,
  type TPaletteId
} from '@/types/documentStyle';
import {
  Layout01Icon,
  LeftToRightListBulletIcon,
  PaintBoardIcon,
  TextFontIcon
} from '@hugeicons/core-free-icons';
import {
  FontOptionIcon,
  PaletteOptionIcon,
  StyleOptionIcon
} from './components/NavSelectorIcons';
import type { NavSelectorName, NavSelectorOption, NavSelectorVariantConfig } from './types';

export const ICON_BACKGROUND_CLASSES: Record<NavSelectorName, string> = {
  palette: 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30',
  font: 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30',
  style: 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30',
  resume: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30',
};

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
