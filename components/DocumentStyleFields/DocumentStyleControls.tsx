'use client';

import { ResumeSectionsControlledSelect } from '../ControlledFields';
import { paletteOptions, fontOptions, styleOptions } from '@/types';

export default function DocumentStyleControls() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ResumeSectionsControlledSelect
        name="documentStyle.palette"
        label="Color Palette"
        placeholder="Select palette"
        options={paletteOptions}
      />
      <ResumeSectionsControlledSelect
        name="documentStyle.font"
        label="Font"
        placeholder="Select font"
        options={fontOptions}
      />
      <ResumeSectionsControlledSelect
        name="documentStyle.style"
        label="Document Style"
        placeholder="Select style"
        options={styleOptions}
      />
    </div>
  );
}
