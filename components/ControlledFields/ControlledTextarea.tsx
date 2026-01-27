import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Textarea } from '../ui/textarea';
import { useId } from 'react';
import type { TResumeForm } from '@/types';

export default function ControlledTextarea<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
}) {
  const form = useFormContext<TForm>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
          <Textarea
            {...field}
            value={field.value ?? ''}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={props.placeholder}
            className={props.className}
          />
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export const ResumeSectionsControlledTextarea = ControlledTextarea<TResumeForm>;
