import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Checkbox } from '../ui/checkbox';
import { useId } from 'react';
import type { TResumeForm, TResumeInfo } from '@/types';

export default function ControlledSingleCheckbox<
  TForm extends FieldValues
>(props: { name: FieldPath<TForm>; label?: string; description?: string }) {
  const form = useFormContext<TForm>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <Checkbox
            id={id}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />
          <FieldLabel htmlFor={id} className="font-normal">
            {props.label}
          </FieldLabel>
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export const ResumeFormControlledSingleCheckbox =
  ControlledSingleCheckbox<TResumeForm>;
export const ResumeInfoControlledSingleCheckbox =
  ControlledSingleCheckbox<TResumeInfo>;
