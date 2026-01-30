import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';

import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '@/components/ui/card';
import type { TResumeForm } from '@/types';
import { educationDefaultValues } from '@/types';
import SectionTitle from './SectionTitle';
import FieldRow from './FieldRow';
import {
  Institution,
  Degree,
  Field,
  Location,
  GraduationDate,
  GPA
} from './EducationFields';

export default function Education() {
  const { control } = useFormContext<TResumeForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Education</SectionTitle>
        <Button type="button" onClick={() => append(educationDefaultValues)}>
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
      {fields.map((field, index) => (
        <Card
          key={field.id}
          className="p-4 pb-8 space-y-4 shadow-none hover:shadow-none "
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Education {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                className="h-4 w-4 text-destructive"
              />
            </Button>
          </div>
          <Institution index={index} />
          <FieldRow cols="half">
            <Degree index={index} />
            <Field index={index} />
          </FieldRow>
          <Location index={index} />
          <FieldRow cols="half">
            <GraduationDate index={index} />
            <GPA index={index} />
          </FieldRow>
        </Card>
      ))}
    </div>
  );
}
