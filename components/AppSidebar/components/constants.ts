import {
  COLOR_PALETTES,
  FONT_OPTIONS,
  DOCUMENT_STYLES,
  type TPaletteId,
  type TFontId,
  type TDocumentStyleId
} from '@/types/documentStyle';
import type { NavSelectorOption } from '@/components/ui/nav-selector';

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

export function getPaletteById(id: string) {
  return Object.values(COLOR_PALETTES).find((p) => p.id === id);
}

export function getFontById(id: string) {
  return Object.values(FONT_OPTIONS).find((f) => f.id === id);
}

export function getStyleById(id: string) {
  return Object.values(DOCUMENT_STYLES).find((s) => s.id === id);
}
