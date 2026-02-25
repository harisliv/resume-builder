/**
 * @file ControlledCombobox.tsx
 * @description Controlled combobox wrapper for react-hook-form.
 * Accepts a list of string options for autocomplete/dropdown.
 */
'use client';

import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../ui/combobox';
import { type ChangeEvent, useId, useMemo } from 'react';
import type { TResumeForm } from '@/types/schema';

interface ControlledComboboxProps<TForm extends FieldValues> {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  description?: string;
  /** Options to show in the dropdown */
  options: string[];
}

/**
 * Combobox field integrated with react-hook-form via Controller.
 * Allows free-text input or selection from provided options.
 * Free-text syncs on every keystroke; dropdown selection also updates.
 */
export default function ControlledCombobox<TForm extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  options
}: ControlledComboboxProps<TForm>) {
  const form = useFormContext<TForm>();
  const id = useId();

  /** Deduplicated, non-empty options */
  const filteredOptions = useMemo(() => {
    return [...new Set(options)].filter(Boolean);
  }, [options]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
          <Combobox
            value={(field.value as string) ?? ''}
            onValueChange={(val) => field.onChange(val)}
          >
            <ComboboxInput
              id={id}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              onBlur={field.onBlur}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                field.onChange(e.target.value)
              }
            />
            {filteredOptions.length > 0 && (
              <ComboboxContent>
                <ComboboxList>
                  {filteredOptions.map((option) => (
                    <ComboboxItem key={option} value={option}>
                      {option}
                    </ComboboxItem>
                  ))}
                  <ComboboxEmpty>No matches</ComboboxEmpty>
                </ComboboxList>
              </ComboboxContent>
            )}
          </Combobox>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

/** Pre-typed ControlledCombobox for resume form fields. */
export const ResumeFormControlledCombobox =
  ControlledCombobox<TResumeForm>;
