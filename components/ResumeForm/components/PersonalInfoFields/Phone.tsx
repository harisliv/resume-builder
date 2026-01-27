import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { PhoneInput } from '@/components/ui/phone-input';
import { useId } from 'react';
import type { TResumeForm } from '@/types';

export default function Phone() {
  const form = useFormContext<TResumeForm>();
  const id = useId();

  return (
    <Controller
      name="personalInfo.phone"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>Phone Number</FieldLabel>
          <PhoneInput
            {...field}
            defaultCountry="GR"
            value={field.value ?? ''}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder="Enter a phone number"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
