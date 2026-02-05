import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
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
import {
  StyledAccordion,
  StyledAccordionItem,
  StyledAccordionTrigger,
  StyledAccordionContent
} from './UI/experience-accordion';

function experienceLabel(
  company: string | undefined,
  position: string | undefined,
  index: number
) {
  const c = company?.trim();
  const p = position?.trim();
  if (c && p) return `${c} · ${p}`;
  if (c) return c;
  if (p) return p;
  return `Experience ${index + 1}`;
}

export default function Experience() {
  const { control, watch } = useFormContext<TResumeForm>();
  const experience = watch('experience');
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
      <StyledAccordion>
        {fields.map((field, index) => (
          <StyledAccordionItem key={field.id} value={`experience-${index}`}>
            <StyledAccordionTrigger
              label={experienceLabel(
                experience?.[index]?.company,
                experience?.[index]?.position,
                index
              )}
              onDelete={() => remove(index)}
            />
            <StyledAccordionContent>
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
            </StyledAccordionContent>
          </StyledAccordionItem>
        ))}
      </StyledAccordion>
    </div>
  );
}
