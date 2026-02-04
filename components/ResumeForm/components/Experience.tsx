import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { TResumeForm } from '@/types';
import { experienceDefaultValues } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
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
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Work Experience</SectionTitle>
        <Button type="button" onClick={() => append(experienceDefaultValues)}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>
      <div className="">
        <Accordion
          type="multiple"
          defaultValue={['experience-0']}
          className="rounded-none border-0 shadow-none"
        >
          {fields.map((field, index) => (
            <AccordionItem
              key={field.id}
              value={`experience-${index}`}
              className="mb-2 rounded-lg border border-slate-200 last:mb-0"
            >
              <AccordionTrigger className="items-center px-4 py-3 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:order-3 [&_[data-slot=accordion-trigger-icon]]:ml-0">
                <span className="order-1 flex-1 truncate text-left font-medium">
                  {experienceLabel(
                    experience?.[index]?.company,
                    experience?.[index]?.position,
                    index
                  )}
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
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
