/**
 * @file ControlledCombobox.tsx
 * @description Generic controlled combobox for react-hook-form.
 * Supports both string options and structured item objects with custom rendering.
 */
'use client';

import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldLabel } from '../ui/field';
import FieldError from './FieldError';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor
} from '../ui/combobox';
import { type ChangeEvent, type ReactNode, useId, useMemo } from 'react';
import type { TResumeForm } from '@/types/schema';

interface ControlledComboboxProps<TForm extends FieldValues, T> {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  description?: string;
  /** Item objects for the dropdown */
  items: T[];
  /** Extracts the string value stored in the form from an item */
  itemToStringValue: (item: T) => string;
  /** Custom render function for each dropdown item */
  renderItem: (item: T) => ReactNode;
  /** Optional custom filter used by Combobox list matching. */
  filter?: (
    item: T,
    query: string,
    itemToString?: (item: T) => string
  ) => boolean;
}

/**
 * Generic combobox integrated with react-hook-form.
 * Allows free-text input or selection from structured items.
 */
export default function ControlledCombobox<TForm extends FieldValues, T>({
  name,
  label,
  placeholder,
  description,
  items,
  itemToStringValue,
  renderItem,
  filter
}: ControlledComboboxProps<TForm, T>) {
  const form = useFormContext<TForm>();
  const id = useId();
  const anchorRef = useComboboxAnchor();

  /** Map from string value → item for quick lookup */
  const valueToItem = useMemo(() => {
    const map = new Map<string, T>();
    for (const item of items) {
      map.set(itemToStringValue(item), item);
    }
    return map;
  }, [items, itemToStringValue]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const matched = valueToItem.get((field.value as string) ?? '') ?? null;
        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
            <Combobox
              value={matched}
              onValueChange={(val) =>
                field.onChange(val ? itemToStringValue(val) : '')
              }
              items={items}
              itemToStringValue={itemToStringValue}
              itemToStringLabel={itemToStringValue}
              filter={filter}
            >
              <ComboboxInput
                id={id}
                inputGroupRef={anchorRef}
                placeholder={placeholder}
                aria-invalid={fieldState.invalid}
                onBlur={field.onBlur}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.value)
                }
              />
              {items.length > 0 && (
                <ComboboxContent anchor={anchorRef}>
                  <ComboboxList>
                    {(item: T) => (
                      <ComboboxItem key={itemToStringValue(item)} value={item}>
                        {renderItem(item)}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                  <ComboboxEmpty>No matches</ComboboxEmpty>
                </ComboboxContent>
              )}
            </Combobox>
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError name={field.name} />
          </Field>
        );
      }}
    />
  );
}

/** Pre-typed ControlledCombobox for resume form fields. */
export function ResumeFormControlledCombobox<T>(
  props: Omit<ControlledComboboxProps<TResumeForm, T>, never>
) {
  return <ControlledCombobox<TResumeForm, T> {...props} />;
}
