import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { TResumeForm } from '@/types/schema';
import { experienceDefaultValues } from '@/types/schema';
import SectionTitle from './SectionTitle';
import FieldRow from './FieldRow';
import Company from './ExperienceFields/Company';
import Position from './ExperienceFields/Position';
import Location from './ExperienceFields/Location';
import { ResumeFormControlledDateRange } from '@/components/ControlledFields/ControlledDateRange';
import Description from './ExperienceFields/Description';
import Highlights from './ExperienceFields/Highlights';
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

/** Parse "Jan 2020" into a sortable timestamp. Returns 0 for empty/invalid. */
function parseDate(str: string | undefined): number {
  if (!str) return 0;
  const parsed = Date.parse(str.trim());
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function Experience() {
  const { control, watch } = useFormContext<TResumeForm>();
  const experience = watch('experience');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  /** Indices sorted by startDate descending (newest first). */
  const sortedIndices = useMemo(() => {
    return fields
      .map((_, i) => i)
      .sort((a, b) => {
        const dateA = parseDate(experience?.[a]?.startDate);
        const dateB = parseDate(experience?.[b]?.startDate);
        return dateB - dateA;
      });
  }, [fields, experience]);

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
        {sortedIndices.map((index) => (
          <StyledAccordionItem key={fields[index].id} value={`experience-${index}`}>
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
              <ResumeFormControlledDateRange
                startName={`experience.${index}.startDate`}
                endName={`experience.${index}.endDate`}
                currentName={`experience.${index}.current`}
              />
              <Description index={index} />
              <Highlights index={index} />
            </StyledAccordionContent>
          </StyledAccordionItem>
        ))}
      </StyledAccordion>
    </div>
  );
}
