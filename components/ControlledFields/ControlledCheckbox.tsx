import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '../ui/field';
import { Checkbox } from '../ui/checkbox';
import type { TResumeForm, TResumeInfo } from '@/types';

export default function ControlledCheckbox<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  legend?: string;
  description?: string;
  options: { id: string; label: string }[];
}) {
  const form = useFormContext<TForm>();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          {props.legend && (
            <FieldLegend variant="label">{props.legend}</FieldLegend>
          )}
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          <FieldGroup data-slot="checkbox-group">
            {props.options.map((option) => (
              <Field
                key={option.id}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
              >
                <Checkbox
                  id={`${field.name}-${option.id}`}
                  name={field.name}
                  aria-invalid={fieldState.invalid}
                  checked={field.value?.includes(option.id) ?? false}
                  onCheckedChange={(checked) => {
                    const currentValue = field.value ?? [];
                    const newValue = checked
                      ? [...currentValue, option.id]
                      : currentValue.filter(
                          (value: string) => value !== option.id
                        );
                    field.onChange(newValue);
                  }}
                />
                <FieldLabel
                  htmlFor={`${field.name}-${option.id}`}
                  className="font-normal"
                >
                  {option.label}
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}

export const ResumeFormControlledCheckbox = ControlledCheckbox<TResumeForm>;
export const ResumeInfoControlledCheckbox = ControlledCheckbox<TResumeInfo>;
