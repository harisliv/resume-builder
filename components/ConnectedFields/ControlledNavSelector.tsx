import { Controller, useFormContext } from 'react-hook-form';
import type { TResumeInfo } from '@/types/schema';
import type {
  TDocumentStyleId,
  TFontId,
  TPaletteId
} from '@/types/documentStyle';
import type { NavSelectorOption } from '../AppSidebar/types';
import { NavSelector } from '../AppSidebar/components/NavSelector';

const FORM_NAME_TO_NAV_NAME = {
  'documentStyle.palette': 'palette',
  'documentStyle.font': 'font',
  'documentStyle.style': 'style'
} as const;

type ControlledNavSelectorProps =
  | {
      name: 'documentStyle.palette';
      options: NavSelectorOption<TPaletteId>[];
      disabled?: boolean;
    }
  | {
      name: 'documentStyle.font';
      options: NavSelectorOption<TFontId>[];
      disabled?: boolean;
    }
  | {
      name: 'documentStyle.style';
      options: NavSelectorOption<TDocumentStyleId>[];
      disabled?: boolean;
    };

export default function ControlledNavSelector(
  props: ControlledNavSelectorProps
) {
  const form = useFormContext<TResumeInfo>();
  const navName = FORM_NAME_TO_NAV_NAME[props.name];

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field }) => (
        <NavSelector
          name={navName}
          value={field.value}
          displayValue={field.value}
          onChange={field.onChange}
          options={props.options}
          disabled={props.disabled}
          loading={props.disabled}
        />
      )}
    />
  );
}

export const ResumeInfoControlledNavSelector = ControlledNavSelector;
