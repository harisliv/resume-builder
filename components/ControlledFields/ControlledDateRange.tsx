import { useController, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { format, parse, isValid } from 'date-fns';
import { useId } from 'react';
import { Field, FieldLabel } from '../ui/field';
import { Checkbox } from '../ui/checkbox';
import { MonthYearPicker } from '../ui/month-year-picker';
import type { TResumeForm } from '@/types/schema';

const DATE_FORMAT = 'MMM yyyy';

/**
 * Parse a "Jan 2020" string into a Date, or return null if invalid/empty.
 */
function parseDate(str: string | undefined): Date | null {
  if (!str) return null;
  const date = parse(str, DATE_FORMAT, new Date());
  return isValid(date) ? date : null;
}

/**
 * Format a Date into "Jan 2020" string.
 */
function formatDate(date: Date): string {
  return format(date, DATE_FORMAT);
}

interface ControlledDateRangeProps<TForm extends FieldValues> {
  /** Field path for the start date string */
  startName: FieldPath<TForm>;
  /** Field path for the end date string */
  endName: FieldPath<TForm>;
  /** Field path for the "current" boolean */
  currentName: FieldPath<TForm>;
  /** Optional label for the field group */
  label?: string;
}

/**
 * Controlled date range picker that manages startDate, endDate, and current
 * fields as a single unit. Stores dates as "MMM yyyy" strings.
 */
export default function ControlledDateRange<TForm extends FieldValues>({
  startName,
  endName,
  currentName,
  label
}: ControlledDateRangeProps<TForm>) {
  const form = useFormContext<TForm>();
  const startId = useId();
  const endId = useId();
  const currentId = useId();

  const startCtrl = useController({ name: startName, control: form.control });
  const endCtrl = useController({ name: endName, control: form.control });
  const currentCtrl = useController({
    name: currentName,
    control: form.control
  });

  const isCurrent = currentCtrl.field.value ?? false;

  return (
    <div className="space-y-2">
      {label && (
        <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor={startId}>Start Date</FieldLabel>
          <MonthYearPicker
            id={startId}
            value={parseDate(startCtrl.field.value)}
            onChange={(date) => startCtrl.field.onChange(formatDate(date))}
            placeholder="Start date"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={endId}>End Date</FieldLabel>
          <MonthYearPicker
            id={endId}
            value={isCurrent ? null : parseDate(endCtrl.field.value)}
            onChange={(date) => endCtrl.field.onChange(formatDate(date))}
            placeholder={isCurrent ? 'Present' : 'End date'}
            disabled={isCurrent}
          />
        </Field>
      </div>
      <Field orientation="horizontal">
        <Checkbox
          id={currentId}
          checked={isCurrent}
          onCheckedChange={currentCtrl.field.onChange}
        />
        <FieldLabel htmlFor={currentId} className="font-normal">
          I currently work here
        </FieldLabel>
      </Field>
    </div>
  );
}

/** Pre-typed variant for the resume form */
export const ResumeFormControlledDateRange =
  ControlledDateRange<TResumeForm>;
