import { Controller, useFormContext } from 'react-hook-form';
import { parsePhoneNumber } from 'react-phone-number-input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { PhoneInput } from '@/components/ui/phone-input';
import { useId } from 'react';
import type { TResumeForm } from '@/types/schema';

/** Normalizes phone to E.164 for PhoneInput so country parses correctly from backend. */
function toE164(value: string): string {
  if (!value) return '';
  return parsePhoneNumber(value)?.number ?? value;
}

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
            international={false}
            value={toE164(field.value ?? '') || undefined}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder="(555) 123-4567"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
