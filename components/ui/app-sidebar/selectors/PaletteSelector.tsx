'use client';

import { ResumeInfoControlledNavSelector } from '@/components/ControlledFields';
import { GradientCircle } from '@/components/ui/nav-selector';
import { COLOR_PALETTES } from '@/types';
import {
  paletteNavOptions,
  getPaletteById
} from './constants';

export function PaletteSelector({ disabled }: { disabled?: boolean }) {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.palette"
      label="Palette"
      options={paletteNavOptions}
      getDisplayValue={(id) =>
        getPaletteById(id ?? '')?.name ?? 'Select palette'
      }
      renderIcon={(paletteId) => {
        const palette = getPaletteById(paletteId ?? '') ?? COLOR_PALETTES.ocean;
        return (
          <GradientCircle
            colors={[palette.summary, palette.experience, palette.education]}
          />
        );
      }}
      renderOptionIcon={(option) => {
        const palette = getPaletteById(option.id);
        return palette ? (
          <GradientCircle
            colors={[palette.summary, palette.experience, palette.education]}
            className="size-5 rounded-md"
          />
        ) : null;
      }}
      tooltip="Palette"
      disabled={disabled}
    />
  );
}
