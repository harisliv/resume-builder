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

/** Returns display label for an education accordion item. */
function educationLabel(institution: string | undefined, index: number) {
  const trimmed = institution?.trim();
  return trimmed ? trimmed : `Education ${index + 1}`;
}

export default function Education() {
  const { control, watch } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const education = watch('education');
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'education'
  });

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

  /** Swaps two education entries for manual reordering. */
  const moveEducation = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= fields.length || fromIndex === toIndex)
      return;
    swap(fromIndex, toIndex);
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
        {fields.map((field, index) => (
          <StyledAccordionItem
            key={field.id}
            value={`education-${index}`}
          >
            <StyledAccordionTrigger
              label={educationLabel(education?.[index]?.institution, index)}
              onDelete={() => confirmRemoveEducation(index)}
              onMoveUp={() => moveEducation(index, index - 1)}
              onMoveDown={() => moveEducation(index, index + 1)}
              disableMoveUp={index === 0}
              disableMoveDown={index === fields.length - 1}
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
