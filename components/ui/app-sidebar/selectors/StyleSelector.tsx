'use client';

import { Layout01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { ResumeInfoControlledNavSelector } from '@/components/ControlledFields';
import { styleNavOptions, getStyleById } from './constants';

export function StyleSelector({ disabled }: { disabled?: boolean }) {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.style"
      label="Style"
      options={styleNavOptions}
      getDisplayValue={(id) => getStyleById(id ?? '')?.name ?? 'Select style'}
      renderIcon={() => (
        <HugeiconsIcon
          icon={Layout01Icon}
          size={20}
          strokeWidth={1.5}
          color="white"
        />
      )}
      renderOptionIcon={(option) => {
        const style = getStyleById(option.id);
        return style ? (
          <div className="flex size-5 shrink-0 items-center justify-center rounded border text-[10px] font-bold">
            {style.name[0]}
          </div>
        ) : null;
      }}
      iconBgColor="bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30"
      tooltip="Style"
      disabled={disabled}
    />
  );
}
