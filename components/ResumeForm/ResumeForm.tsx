'use client';

import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileText, PlusSignIcon, Save } from '@hugeicons/core-free-icons';
import ResumeFormTabs from './components/ResumeFormTabs';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import {
  createCustomSectionDefaults,
  type TResumeForm
} from '@/types/schema';
import type { Id } from '@/convex/_generated/dataModel';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  SectionCardActions,
  SectionCardContent
} from '@/components/ui/section-card';
import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import usePrivileges from '@/hooks/usePrivileges';
import { toast } from 'sonner';
import { getInvalidSubmitDescription } from './getInvalidSubmitDescription';

/** Returns the next unused default custom section title. */
function getNextCustomSectionTitle(sections: TResumeForm['customSections']) {
  let index = 1;
  const names = new Set(sections?.map((section) => section.sectionTitle));
  while (names.has(`Custom Section ${index}`)) index += 1;
  return `Custom Section ${index}`;
}

export default function ResumeForm({
  onSubmit,
  isPending,
  resumeId
}: {
  onSubmit: (data: TResumeForm) => void;
  isPending: boolean;
  resumeId?: Id<'resumes'>;
}) {
  const form = useFormContext<TResumeForm>();
  const [activeTab, setActiveTab] = useState('personal-info');
  const {
    formState: { isDirty }
  } = form;
  const {
    fields: customSectionFields,
    append: appendCustomSection,
    remove: removeCustomSection
  } = useFieldArray({
    control: form.control,
    name: 'customSections'
  });
  const { isMember, getDisabledTooltip } = usePrivileges();
  const saveTooltip = getDisabledTooltip(!!resumeId);

  /** Adds a top-level custom resume section as its own tab. */
  const handleAddCustomSection = () => {
    const currentSections = form.getValues('customSections') ?? [];
    appendCustomSection(
      createCustomSectionDefaults(getNextCustomSectionTitle(currentSections))
    );
    setActiveTab(`custom-section-${currentSections.length}`);
  };

  /** Removes a custom section and returns focus to a stable core tab. */
  const handleRemoveCustomSection = (index: number) => {
    removeCustomSection(index);
    setActiveTab('personal-info');
  };

  /** Surfaces invalid submit state instead of failing silently. */
  const handleSubmit = form.handleSubmit(onSubmit, (errors) => {
    toast.error('Fix form errors before saving', {
      description: getInvalidSubmitDescription(errors)
    });
  });

  return (
    <form noValidate onSubmit={handleSubmit}>
      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle icon={FileText}>Resume Form</SectionCardTitle>
          <SectionCardActions>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleAddCustomSection}
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              New Custom Section
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isPending || isMember || !resumeId || !isDirty}
                  >
                    {isPending ? (
                      <>
                        <Spinner className="size-4" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={Save} strokeWidth={2} />
                        Save
                      </>
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {saveTooltip && <TooltipContent>{saveTooltip}</TooltipContent>}
            </Tooltip>
          </SectionCardActions>
        </SectionCardHeader>
        <SectionCardContent>
          <ResumeFormTabs
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            customSectionFields={customSectionFields}
            onRemoveCustomSection={handleRemoveCustomSection}
          />
        </SectionCardContent>
      </SectionCard>
    </form>
  );
}
