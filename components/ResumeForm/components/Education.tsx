import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { TResumeForm } from '@/types';
import { educationDefaultValues } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
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
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Education</SectionTitle>
        <Button type="button" onClick={() => append(educationDefaultValues)}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={['education-0']}
        className="rounded-none border-0 shadow-none"
      >
        {fields.map((field, index) => (
          <AccordionItem
            key={field.id}
            value={`education-${index}`}
            className="mb-2 rounded-lg border border-slate-200 last:mb-0"
          >
            <AccordionTrigger className="items-center px-4 py-3 text-sm hover:bg-slate-50/50 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:order-3 [&_[data-slot=accordion-trigger-icon]]:ml-0">
              <span className="order-1 flex-1 truncate text-left font-medium">
                {educationLabel(education?.[index]?.institution, index)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="order-2 h-7 w-7 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(index);
                }}
              >
                <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
              </Button>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
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
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
