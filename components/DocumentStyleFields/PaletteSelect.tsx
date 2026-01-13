'use client';

import { DocumentStyleControlledSelect } from '../ControlledFields';
import { paletteOptions } from '@/types';

export default function PaletteSelect() {
  return (
    <DocumentStyleControlledSelect
      name="palette"
      label="Color Palette"
      placeholder="Select palette"
      options={paletteOptions}
    />
  );
}
