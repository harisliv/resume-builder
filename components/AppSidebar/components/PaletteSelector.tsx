'use client';

import { ResumeInfoControlledNavSelector } from '@/components/ControlledFields/ControlledNavSelector';
import { paletteNavOptions } from '../constants';

export function PaletteSelector({ disabled }: { disabled?: boolean }) {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.palette"
      options={paletteNavOptions}
      disabled={disabled}
    />
  );
}
