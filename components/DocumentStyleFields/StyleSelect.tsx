'use client';

import { DocumentStyleControlledSelect } from '../ControlledFields';
import { styleOptions } from '@/types';

export default function StyleSelect() {
  return (
    <DocumentStyleControlledSelect
      name="style"
      label="Document Style"
      placeholder="Select style"
      options={styleOptions}
    />
  );
}
