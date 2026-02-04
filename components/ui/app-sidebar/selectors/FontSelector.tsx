'use client';

import { TextFontIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { ResumeInfoControlledNavSelector } from '@/components/ControlledFields';
import { fontNavOptions, getFontById } from './constants';

export function FontSelector({ disabled }: { disabled?: boolean }) {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.font"
      label="Font"
      options={fontNavOptions}
      getDisplayValue={(id) => getFontById(id ?? '')?.name ?? 'Select font'}
      renderIcon={() => (
        <HugeiconsIcon
          icon={TextFontIcon}
          size={20}
          strokeWidth={1.5}
          color="white"
        />
      )}
      renderOptionIcon={(option) => {
        const font = getFontById(option.id);
        return font ? (
          <span
            className="text-sm w-6"
            style={{ fontFamily: `var(${font.cssVariable})` }}
          >
            Aa
          </span>
        ) : null;
      }}
      iconBgColor="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30"
      tooltip="Font"
      disabled={disabled}
    />
  );
}
