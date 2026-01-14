'use client';

import { ResumeSectionsControlledSelect } from '../ControlledFields';
import { paletteOptions } from '@/types';

export default function PaletteSelect() {
  return (
    <ResumeSectionsControlledSelect
      name="documentStyle.palette"
      label="Color Palette"
      placeholder="Select palette"
      options={paletteOptions}
    />
  );
}
