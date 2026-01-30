import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';

import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '@/components/ui/card';
import type { TResumeForm } from '@/types';
import { experienceDefaultValues } from '@/types';
import SectionTitle from './SectionTitle';
import FieldRow from './FieldRow';
import {
  Company,
  Position,
  Location,
  StartDate,
  EndDate,
  Current,
  Description,
  Highlights
} from './ExperienceFields';

export default function Experience() {
  const { control } = useFormContext<TResumeForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Work Experience</SectionTitle>
        <Button type="button" onClick={() => append(experienceDefaultValues)}>
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
      {fields.map((field, index) => (
        <Card
          key={field.id}
          className="p-4 pb-8 space-y-4 shadow-none hover:shadow-none"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Experience {index + 1}</h4>
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
          <FieldRow cols="half">
            <Company index={index} />
            <Position index={index} />
          </FieldRow>
          <Location index={index} />
          <FieldRow cols="half">
            <StartDate index={index} />
            <EndDate index={index} />
          </FieldRow>
          <Current index={index} />
          <Description index={index} />
          <Highlights index={index} />
        </Card>
      ))}
    </div>
  );
}
