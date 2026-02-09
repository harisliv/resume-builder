'use client';

import { ResumeInfoControlledNavSelector } from '@/components/ControlledFields/ControlledNavSelector';
import { fontNavOptions } from '../constants';

export function FontSelector({ disabled }: { disabled?: boolean }) {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.font"
      options={fontNavOptions}
      disabled={disabled}
    />
  );
}
