'use client';

import { ResumeSectionsControlledSelect } from '../ControlledFields';
import { fontOptions } from '@/types';

export default function FontSelect() {
  return (
    <ResumeSectionsControlledSelect
      name="documentStyle.font"
      label="Font"
      placeholder="Select font"
      options={fontOptions}
    />
  );
}
