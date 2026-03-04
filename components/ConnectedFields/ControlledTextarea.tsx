import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldLabel } from '../ui/field';
import FieldError from './FieldError';
import { Textarea } from '../ui/textarea';
import { useId } from 'react';
import { sanitizeInput } from '@/lib/utils';

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
            onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={props.placeholder}
            className={props.className}
          />
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          <FieldError name={field.name} />
        </Field>
      )}
    />
  );
}
