import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Delete02Icon,
  PlusSignIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { TResumeForm } from '@/types/schema';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { sanitizeInput } from '@/lib/utils';

export default function Highlights({ index }: { index: number }) {
  const { register } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const { fields, append, remove, swap } = useFieldArray<TResumeForm>({
    name: `experience.${index}.highlights`
  });

  /** Confirms before removing a highlight row. */
  const confirmRemoveHighlight = async (highlightIndex: number) => {
    const ok = await confirm({
      title: 'Delete highlight?',
      description: 'This highlight will be removed from this experience entry.',
      confirmLabel: 'Delete highlight',
      variant: 'destructive'
    });
    if (!ok) return;
    remove(highlightIndex);
  };

  /** Moves a highlight up or down within one experience entry. */
  const moveHighlight = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= fields.length || fromIndex === toIndex) return;
    swap(fromIndex, toIndex);
  };

  return (
    <Field>
      <FieldLabel>Highlights</FieldLabel>
      <div className="space-y-2">
        {fields.map((field, highlightIndex) => (
          <div key={field.id} className="flex items-center gap-2">
            <div
              className="bg-muted flex shrink-0 flex-col rounded-md p-0.5"
              role="group"
              aria-label="Reorder highlight"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Move highlight up"
                aria-disabled={highlightIndex === 0}
                className="text-muted-foreground hover:bg-background/80 hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40"
                onClick={() => moveHighlight(highlightIndex, highlightIndex - 1)}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Move highlight down"
                aria-disabled={highlightIndex === fields.length - 1}
                className="text-muted-foreground hover:bg-background/80 hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40"
                onClick={() => moveHighlight(highlightIndex, highlightIndex + 1)}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              {...register(
                `experience.${index}.highlights.${highlightIndex}.value`,
                {
                  onChange: (e) => {
                    e.target.value = sanitizeInput(e.target.value);
                  }
                }
              )}
              id={`highlight-${index}-${highlightIndex}`}
              placeholder="Enter a highlight"
              rows={1}
              className="flex-1 min-h-10! max-h-24 resize-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => confirmRemoveHighlight(highlightIndex)}
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                className="text-destructive h-4 w-4"
              />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: '' })}
          className="w-full"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Highlight
        </Button>
      </div>
    </Field>
  );
}
