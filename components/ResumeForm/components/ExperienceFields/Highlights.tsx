import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { TResumeForm } from '@/types/schema';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { sanitizeInput } from '@/lib/utils';

export default function Highlights({ index }: { index: number }) {
  const { control } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `experience.${index}.highlights` as any
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

  return (
    <Field>
      <FieldLabel>Highlights</FieldLabel>
      <div className="space-y-2">
        {fields.map((field, highlightIndex) => (
          <div key={field.id} className="flex items-center gap-2">
            <span className="text-muted-foreground">•</span>
            <Controller
              name={`experience.${index}.highlights.${highlightIndex}` as any}
              control={control}
              render={({ field: inputField }) => (
                <Textarea
                  {...inputField}
                  value={inputField.value ?? ''}
                  onChange={(e) =>
                    inputField.onChange(sanitizeInput(e.target.value))
                  }
                  id={`highlight-${index}-${highlightIndex}`}
                  placeholder="Enter a highlight"
                  rows={1}
                  className="flex-1 min-h-10! max-h-24 resize-none"
                />
              )}
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
          onClick={() => append('')}
          className="w-full"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Highlight
        </Button>
      </div>
    </Field>
  );
}
