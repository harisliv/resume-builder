import { useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldLabel } from '../ui/field';
import FieldError from './FieldError';
import { Textarea } from '../ui/textarea';
import { useId } from 'react';
import { sanitizeInput } from '@/lib/utils';

/** Native `<Textarea>` connected via `register` — use for plain text fields. */
export default function UncontrolledTextarea<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
}) {
  const { register, formState: { errors } } = useFormContext<TForm>();
  const id = useId();

  const fieldError = props.name
    .split('.')
    .reduce<unknown>((obj, key) => (obj as Record<string, unknown>)?.[key], errors);

  return (
    <Field data-invalid={!!fieldError}>
      <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
      <Textarea
        {...register(props.name, {
          onChange: (e) => {
            e.target.value = sanitizeInput(e.target.value);
          }
        })}
        id={id}
        aria-invalid={!!fieldError}
        placeholder={props.placeholder}
        className={props.className}
      />
      {props.description && (
        <FieldDescription>{props.description}</FieldDescription>
      )}
      <FieldError name={props.name} />
    </Field>
  );
}
