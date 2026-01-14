'use client';

import { ResumeSectionsControlledSelect } from '../ControlledFields';
import { styleOptions } from '@/types';

export default function StyleSelect() {
  return (
    <ResumeSectionsControlledSelect
      name="documentStyle.style"
      label="Document Style"
      placeholder="Select style"
      options={styleOptions}
    />
  );
}
