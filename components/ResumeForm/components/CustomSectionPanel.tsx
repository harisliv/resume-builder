import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import { createCustomSectionItemDefaults, type TResumeForm } from '@/types/schema';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import {
  StyledAccordion,
  StyledAccordionContent,
  StyledAccordionItem,
  StyledAccordionTrigger
} from './styles/section-accordion';
import CustomSectionItem from './CustomSectionItem';

/** Builds an item accordion label from the visible item content. */
function customItemLabel(
  title: string | undefined,
  subtitle: string | undefined,
  index: number
) {
  const trimmedTitle = title?.trim();
  const trimmedSubtitle = subtitle?.trim();
  if (trimmedTitle && trimmedSubtitle) return `${trimmedTitle} · ${trimmedSubtitle}`;
  if (trimmedTitle) return trimmedTitle;
  if (trimmedSubtitle) return trimmedSubtitle;
  return `Item ${index + 1}`;
}

/** Editable panel for one dynamic custom resume section tab. */
export default function CustomSectionPanel({
  sectionIndex,
  onDeleteSection
}: {
  sectionIndex: number;
  onDeleteSection: () => void;
}) {
  const { control } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const section = useWatch({
    control,
    name: `customSections.${sectionIndex}`
  });
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: `customSections.${sectionIndex}.items`
  });

  /** Confirms before deleting the whole custom section. */
  const confirmDeleteSection = async () => {
    const label = section?.sectionTitle?.trim() || `Custom Section ${sectionIndex + 1}`;
    const ok = await confirm({
      title: 'Delete custom section?',
      description: `This will remove "${label}" and all of its items.`,
      confirmLabel: 'Delete section',
      variant: 'destructive'
    });
    if (!ok) return;
    onDeleteSection();
  };

  /** Confirms before deleting one custom section item. */
  const confirmRemoveItem = async (itemIndex: number) => {
    const label = customItemLabel(
      section?.items?.[itemIndex]?.title,
      section?.items?.[itemIndex]?.subtitle,
      itemIndex
    );
    const ok = await confirm({
      title: 'Delete item?',
      description: `This will remove "${label}" from this custom section.`,
      confirmLabel: 'Delete item',
      variant: 'destructive'
    });
    if (!ok) return;
    remove(itemIndex);
  };

  /** Swaps two custom section items for manual ordering. */
  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= fields.length || fromIndex === toIndex) return;
    swap(fromIndex, toIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <UncontrolledInput<TResumeForm>
            name={`customSections.${sectionIndex}.sectionTitle`}
            label="Section Title"
            placeholder="e.g. Awards"
          />
        </div>
        <Button type="button" variant="outline" onClick={confirmDeleteSection}>
          Delete Section
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Add awards, recommendations, certifications, publications, or other
          resume items.
        </p>
      ) : (
        <StyledAccordion defaultValue={fields.length ? ['custom-item-0'] : []}>
          {fields.map((field, itemIndex) => (
            <StyledAccordionItem
              key={field.id}
              value={`custom-item-${itemIndex}`}
            >
              <StyledAccordionTrigger
                label={customItemLabel(
                  section?.items?.[itemIndex]?.title,
                  section?.items?.[itemIndex]?.subtitle,
                  itemIndex
                )}
                onDelete={() => confirmRemoveItem(itemIndex)}
                onMoveUp={() => moveItem(itemIndex, itemIndex - 1)}
                onMoveDown={() => moveItem(itemIndex, itemIndex + 1)}
                disableMoveUp={itemIndex === 0}
                disableMoveDown={itemIndex === fields.length - 1}
              />
              <StyledAccordionContent>
                <CustomSectionItem
                  sectionIndex={sectionIndex}
                  itemIndex={itemIndex}
                />
              </StyledAccordionContent>
            </StyledAccordionItem>
          ))}
        </StyledAccordion>
      )}

      <Button
        type="button"
        variant="secondary"
        onClick={() => append(createCustomSectionItemDefaults())}
      >
        <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}
