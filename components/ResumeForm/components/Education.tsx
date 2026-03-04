import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { TResumeForm } from '@/types/schema';
import { educationDefaultValues } from '@/types/schema';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import SectionTitle from './styles/section-title';
import FieldRow from './styles/field-row';
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
} from './styles/section-accordion';
import { parseDate } from '@/lib/parse-date';

function educationLabel(institution: string | undefined, index: number) {
  const trimmed = institution?.trim();
  return trimmed ? trimmed : `Education ${index + 1}`;
}

export default function Education() {
  const { control, watch } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const education = watch('education');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  /** Indices sorted by graduationDate descending (newest first). */
  const sortedIndices = useMemo(
    () =>
      fields
        .map((_, i) => i)
        .sort((a, b) => {
          const dateA = parseDate(education?.[a]?.graduationDate);
          const dateB = parseDate(education?.[b]?.graduationDate);
          return dateB - dateA;
        }),
    [fields, education]
  );

  /** Confirms before deleting one education entry. */
  const confirmRemoveEducation = async (index: number) => {
    const label = educationLabel(education?.[index]?.institution, index);
    const ok = await confirm({
      title: 'Delete education?',
      description: `This will remove "${label}".`,
      confirmLabel: 'Delete education',
      variant: 'destructive'
    });
    if (!ok) return;
    remove(index);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Education</SectionTitle>
        <Button type="button" onClick={() => append(educationDefaultValues)}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>
      <StyledAccordion defaultValue={['education-0']}>
        {sortedIndices.map((index) => (
          <StyledAccordionItem
            key={fields[index].id}
            value={`education-${index}`}
          >
            <StyledAccordionTrigger
              label={educationLabel(education?.[index]?.institution, index)}
              onDelete={() => confirmRemoveEducation(index)}
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
