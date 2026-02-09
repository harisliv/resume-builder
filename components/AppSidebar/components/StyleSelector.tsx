'use client';

import { ResumeInfoControlledNavSelector } from '@/components/ControlledFields/ControlledNavSelector';
import { styleNavOptions } from '../constants';

export function StyleSelector({ disabled }: { disabled?: boolean }) {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.style"
      options={styleNavOptions}
      disabled={disabled}
    />
  );
}
