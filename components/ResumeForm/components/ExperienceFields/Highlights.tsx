import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { TResumeForm } from '@/types/schema';

export default function Highlights({ index }: { index: number }) {
  const { control } = useFormContext<TResumeForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `experience.${index}.highlights` as any
  });

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
                <Input
                  {...inputField}
                  value={inputField.value ?? ''}
                  id={`highlight-${index}-${highlightIndex}`}
                  placeholder="Enter a highlight"
                  className="flex-1"
                />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(highlightIndex)}
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                className="h-4 w-4 text-destructive"
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
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          Add Highlight
        </Button>
      </div>
    </Field>
  );
}
