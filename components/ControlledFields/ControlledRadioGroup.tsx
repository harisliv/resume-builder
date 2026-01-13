import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from '../ui/field';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import type { TResumeData } from '@/types';

export default function ControlledRadioGroup<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  legend?: string;
  description?: string;
  options: { id: string; title: string; description?: string }[];
}) {
  const form = useFormContext<TForm>();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          {props.legend && <FieldLegend>{props.legend}</FieldLegend>}
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            {props.options.map((option) => (
              <FieldLabel
                key={option.id}
                htmlFor={`${field.name}-${option.id}`}
              >
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldTitle>{option.title}</FieldTitle>
                    {option.description && (
                      <FieldDescription>{option.description}</FieldDescription>
                    )}
                  </FieldContent>
                  <RadioGroupItem
                    value={option.id}
                    id={`${field.name}-${option.id}`}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}

export const ResumeSectionsControlledRadioGroup =
  ControlledRadioGroup<TResumeData>;
