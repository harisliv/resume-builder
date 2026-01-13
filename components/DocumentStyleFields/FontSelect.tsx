'use client';

import { DocumentStyleControlledSelect } from '../ControlledFields';
import { fontOptions } from '@/types';

export default function FontSelect() {
  return (
    <DocumentStyleControlledSelect
      name="font"
      label="Font"
      placeholder="Select font"
      options={fontOptions}
    />
  );
}
