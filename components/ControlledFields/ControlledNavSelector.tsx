import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import {
  NavSelector,
  type NavSelectorOption
} from '@/components/ui/nav-selector';
import type { TResumeInfo } from '@/types/schema';

export default function ControlledNavSelector<
  TForm extends FieldValues,
  TValue extends string = string
>(props: {
  name: FieldPath<TForm>;
  label: string;
  options: NavSelectorOption<TValue>[];
  getDisplayValue: (v: TValue | undefined) => string;
  renderIcon: (v: TValue | undefined) => React.ReactNode;
  renderOptionIcon?: (option: NavSelectorOption<TValue>) => React.ReactNode;
  tooltip?: string;
  iconBgColor?: string;
  disabled?: boolean;
}) {
  const form = useFormContext<TForm>();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field }) => (
        <NavSelector<TValue>
          label={props.label}
          value={field.value ?? props.options[0]?.id}
          displayValue={props.getDisplayValue(field.value)}
          onChange={field.onChange}
          options={props.options}
          renderIcon={props.renderIcon}
          renderOptionIcon={props.renderOptionIcon}
          tooltip={props.tooltip}
          iconBgColor={props.iconBgColor}
          disabled={props.disabled}
        />
      )}
    />
  );
}

export const ResumeInfoControlledNavSelector = ControlledNavSelector<
  TResumeInfo,
  string
>;
