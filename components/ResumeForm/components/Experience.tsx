import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { TResumeForm } from '@/types/schema';
import { experienceDefaultValues } from '@/types/schema';
import SectionTitle from './styles/section-title';
import FieldRow from './styles/field-row';
import Company from './ExperienceFields/Company';
import Position from './ExperienceFields/Position';
import Location from './ExperienceFields/Location';
import { ResumeFormControlledDateRange } from '@/components/ConnectedFields/ControlledDateRange';
import Description from './ExperienceFields/Description';
import Highlights from './ExperienceFields/Highlights';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import {
  StyledAccordion,
  StyledAccordionItem,
  StyledAccordionTrigger,
  StyledAccordionContent
} from './styles/section-accordion';
import { parseDate } from '@/lib/parse-date';

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
  const confirm = useWarningDialog();
  const experience = watch('experience');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  /** Indices sorted by startDate descending (newest first). */
  const sortedIndices = useMemo(
    () =>
      fields
        .map((_, i) => i)
        .sort((a, b) => {
          const dateA = parseDate(experience?.[a]?.startDate);
          const dateB = parseDate(experience?.[b]?.startDate);
          return dateB - dateA;
        }),
    [fields, experience]
  );

  /** Confirms before deleting one experience entry. */
  const confirmRemoveExperience = async (index: number) => {
    const label = experienceLabel(
      experience?.[index]?.company,
      experience?.[index]?.position,
      index
    );
    const ok = await confirm({
      title: 'Delete experience?',
      description: `This will remove "${label}".`,
      confirmLabel: 'Delete experience',
      variant: 'destructive'
    });
    if (!ok) return;
    remove(index);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Work Experience</SectionTitle>
        <Button type="button" onClick={() => append(experienceDefaultValues)}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>
      <StyledAccordion defaultValue={['experience-0']}>
        {sortedIndices.map((index) => (
          <StyledAccordionItem
            key={fields[index].id}
            value={`experience-${index}`}
          >
            <StyledAccordionTrigger
              label={experienceLabel(
                experience?.[index]?.company,
                experience?.[index]?.position,
                index
              )}
              onDelete={() => confirmRemoveExperience(index)}
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
