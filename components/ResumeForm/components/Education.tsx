import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { TResumeForm } from '@/types/schema';
import { educationDefaultValues } from '@/types/schema';
import SectionTitle from './SectionTitle';
import FieldRow from './FieldRow';
import Institution from './EducationFields/Institution';
import Degree from './EducationFields/Degree';
import Field from './EducationFields/Field';
import Location from './EducationFields/Location';
import GraduationDate from './EducationFields/GraduationDate';
import GPA from './EducationFields/GPA';
import {
  StyledAccordion,
  StyledAccordionItem,
  StyledAccordionTrigger,
  StyledAccordionContent
} from './UI/education-accordion';

function educationLabel(institution: string | undefined, index: number) {
  const trimmed = institution?.trim();
  return trimmed ? trimmed : `Education ${index + 1}`;
}

export default function Education() {
  const { control, watch } = useFormContext<TResumeForm>();
  const education = watch('education');
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
      <StyledAccordion>
        {fields.map((field, index) => (
          <StyledAccordionItem key={field.id} value={`education-${index}`}>
            <StyledAccordionTrigger
              label={educationLabel(education?.[index]?.institution, index)}
              onDelete={() => remove(index)}
            />
            <StyledAccordionContent>
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
            </StyledAccordionContent>
          </StyledAccordionItem>
        ))}
      </StyledAccordion>
    </div>
  );
}
