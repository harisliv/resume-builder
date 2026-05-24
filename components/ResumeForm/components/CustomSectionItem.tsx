import { format, isValid, parse } from 'date-fns';
import { useId } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { ResumeFormControlledCombobox } from '@/components/ConnectedFields/ControlledCombobox';
import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import UncontrolledTextarea from '@/components/ConnectedFields/UncontrolledTextarea';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { Field, FieldLabel } from '@/components/ui/field';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import FieldRow from './styles/field-row';
import { filterCountryByPrefix } from '@/lib/filter-country';
import { useFetchCountries, type CountryOption } from '@/hooks/useFetchCountries';
import type { TResumeForm } from '@/types/schema';

const DATE_FORMAT = 'MMM yyyy';

/** Parses a stored month-year string for the custom section date picker. */
function parseMonthYear(value: string | undefined) {
  if (!value) return null;
  const date = parse(value, DATE_FORMAT, new Date());
  return isValid(date) ? date : null;
}

/** Month-year picker connected to one custom section item date field. */
function CustomSectionDateField({
  name,
  label,
  placeholder
}: {
  name: FieldPath<TResumeForm>;
  label: string;
  placeholder: string;
}) {
  const { control } = useFormContext<TResumeForm>();
  const id = useId();
  const ctrl = useController({ control, name });
  const value =
    typeof ctrl.field.value === 'string' ? ctrl.field.value : undefined;

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <MonthYearPicker
        id={id}
        value={parseMonthYear(value)}
        onChange={(date) => ctrl.field.onChange(format(date, DATE_FORMAT))}
        placeholder={placeholder}
      />
    </Field>
  );
}

/** Location combobox for custom section items, matching core resume sections. */
function CustomSectionLocationField({ name }: { name: FieldPath<TResumeForm> }) {
  const { data: countries = [] } = useFetchCountries();

  return (
    <ResumeFormControlledCombobox<CountryOption>
      name={name}
      label="Location"
      placeholder="Athens, Greece"
      items={countries}
      itemToStringValue={(country) => country.value}
      filter={filterCountryByPrefix}
      renderItem={(country) => (
        <Item>
          <ItemContent>
            <ItemTitle>{country.capital}</ItemTitle>
            <ItemDescription>{country.country}</ItemDescription>
          </ItemContent>
        </Item>
      )}
    />
  );
}

/** Form fields for one generic custom section item. */
export default function CustomSectionItem({
  sectionIndex,
  itemIndex
}: {
  sectionIndex: number;
  itemIndex: number;
}) {
  const base = `customSections.${sectionIndex}.items.${itemIndex}` as const;

  return (
    <div className="space-y-4">
      <FieldRow cols="half">
        <UncontrolledInput<TResumeForm>
          name={`${base}.title`}
          label="Title"
          placeholder="e.g. Best Engineer Award"
        />
        <CustomSectionLocationField name={`${base}.location`} />
      </FieldRow>
      <FieldRow cols="half">
        <UncontrolledInput<TResumeForm>
          name={`${base}.subtitle`}
          label="Subtitle"
          placeholder="e.g. NTT DATA"
        />
        <UncontrolledInput<TResumeForm>
          name={`${base}.url`}
          label="URL"
          placeholder="https://example.com"
        />
      </FieldRow>
      <FieldRow cols="half">
        <CustomSectionDateField
          name={`${base}.startDate`}
          label="Start Date"
          placeholder="Start date"
        />
        <CustomSectionDateField
          name={`${base}.endDate`}
          label="End Date"
          placeholder="End date"
        />
      </FieldRow>
      <UncontrolledTextarea<TResumeForm>
        name={`${base}.description`}
        label="Description"
        placeholder="Add context, outcome, recommender quote, or other details."
      />
    </div>
  );
}
