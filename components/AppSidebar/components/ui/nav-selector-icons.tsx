'use client';
import {
  COLOR_PALETTES,
  FONT_OPTIONS,
  type TFontId,
  type TPaletteId
} from '@/types/documentStyle';
import type { NavSelectorOption } from '../../types';

export function PaletteOptionIcon({ option }: { option: NavSelectorOption }) {
  const p = COLOR_PALETTES[option.id as TPaletteId];
  return (
    <div className="flex gap-1">
      <div
        className="size-3 rounded-full"
        style={{ backgroundColor: p.summary }}
      />
      <div
        className="size-3 rounded-full"
        style={{ backgroundColor: p.experience }}
      />
      <div
        className="size-3 rounded-full"
        style={{ backgroundColor: p.education }}
      />
    </div>
  );
}

export function FontOptionIcon({ option }: { option: NavSelectorOption }) {
  const font = FONT_OPTIONS[option.id as TFontId];
  return (
    <span
      className="w-6 text-sm"
      style={{ fontFamily: `var(${font.cssVariable})` }}
    >
      Aa
    </span>
  );
}

export function StyleOptionIcon({ option }: { option: NavSelectorOption }) {
  return (
    <div className="flex size-5 shrink-0 items-center justify-center rounded border text-[10px] font-bold">
      {option.label[0]}
    </div>
  );
}
