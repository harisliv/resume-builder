import { useMemo } from 'react';
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
} from './UI/section-accordion';

function educationLabel(institution: string | undefined, index: number) {
  const trimmed = institution?.trim();
  return trimmed ? trimmed : `Education ${index + 1}`;
}

/** Parse "Jan 2020" into a sortable timestamp. Returns 0 for empty/invalid. */
function parseDate(str: string | undefined): number {
  if (!str) return 0;
  const parsed = Date.parse(str.trim());
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function Education() {
  const { control, watch } = useFormContext<TResumeForm>();
  const education = watch('education');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  /** Indices sorted by graduationDate descending (newest first). */
  const sortedIndices = useMemo(() => {
    return fields
      .map((_, i) => i)
      .sort((a, b) => {
        const dateA = parseDate(education?.[a]?.graduationDate);
        const dateB = parseDate(education?.[b]?.graduationDate);
        return dateB - dateA;
      });
  }, [fields, education]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Education</SectionTitle>
        <Button type="button" onClick={() => append(educationDefaultValues)}>
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
      <StyledAccordion defaultValue={['education-0']}>
        {sortedIndices.map((index) => (
          <StyledAccordionItem key={fields[index].id} value={`education-${index}`}>
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
