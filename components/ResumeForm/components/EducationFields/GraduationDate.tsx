import { useId } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import type { TResumeForm } from '@/types/schema';

/** Graduation date input with "currently studying" checkbox. */
export default function GraduationDate({ index }: { index: number }) {
  const { control } = useFormContext<TResumeForm>();
  const currentId = useId();

  const currentCtrl = useController({
    name: `education.${index}.current`,
    control
  });

  const isCurrent = currentCtrl.field.value ?? false;

  return (
    <div className="space-y-2">
      <UncontrolledInput<TResumeForm>
        name={`education.${index}.graduationDate`}
        label="Graduation Date"
        placeholder={isCurrent ? 'Expected' : 'May 2019'}
        disabled={isCurrent}
      />
      <Field orientation="horizontal">
        <Checkbox
          id={currentId}
          checked={isCurrent}
          onCheckedChange={currentCtrl.field.onChange}
        />
        <FieldLabel htmlFor={currentId} className="font-normal">
          Currently studying here
        </FieldLabel>
      </Field>
    </div>
  );
}
