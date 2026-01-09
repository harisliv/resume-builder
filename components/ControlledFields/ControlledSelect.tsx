import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '../ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useId } from 'react';
import type { TResumeSectionsSchema } from '../../types/schema';

export default function ControlledSelect<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  description?: string;
  options: { value: string; label: string }[];
  orientation?: 'responsive' | 'horizontal' | 'vertical';
}) {
  const form = useFormContext<TForm>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          orientation={props.orientation}
          data-invalid={fieldState.invalid}
        >
          <FieldContent>
            <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
            {props.description && (
              <FieldDescription>{props.description}</FieldDescription>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={id} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={props.placeholder ?? 'Select'} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}

export const ResumeSectionsControlledSelect =
  ControlledSelect<TResumeSectionsSchema>;
