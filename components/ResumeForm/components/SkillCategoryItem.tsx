import { useFieldArray, useFormContext } from 'react-hook-form';
import type { TResumeForm } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { PlusSignIcon, Delete01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  StyledAccordionItem,
  StyledAccordionTrigger,
  StyledAccordionContent
} from './styles/section-accordion';

/** Single skill category with nested useFieldArray for skill items. */
export default function SkillCategoryItem({
  index,
  categoryName,
  totalCategories,
  onDelete,
  onMoveUp,
  onMoveDown,
  onRename
}: {
  index: number;
  categoryName: string;
  totalCategories: number;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRename: (newName: string) => void;
}) {
  const { register } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const { fields, append, remove } = useFieldArray<TResumeForm>({
    name: `skills.${index}.skills`
  });

  /** Confirms before deleting a single skill row. */
  const confirmRemoveSkill = async (skillIndex: number) => {
    const ok = await confirm({
      title: 'Delete skill?',
      description: `This will remove this skill from "${categoryName}".`,
      confirmLabel: 'Delete skill',
      variant: 'destructive'
    });
    if (!ok) return;
    remove(skillIndex);
  };

  return (
    <StyledAccordionItem value={`skill-category-${index}`}>
      <StyledAccordionTrigger
        label={categoryName || `Category ${index + 1}`}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        disableMoveUp={index === 0}
        disableMoveDown={index === totalCategories - 1}
      />
      <StyledAccordionContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Category
            </p>
            <Input
              className="h-11 border-dashed text-base font-semibold"
              defaultValue={categoryName}
              onBlur={(e) => onRename(e.target.value)}
              placeholder="e.g. Programming Languages"
            />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Skills
            </p>
            {fields.map((field, skillIndex) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  className="h-11 border-dashed text-base"
                  {...register(`skills.${index}.skills.${skillIndex}.value`)}
                  placeholder="e.g. React"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => confirmRemoveSkill(skillIndex)}
                >
                  <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ value: '' })}
          >
            <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </StyledAccordionContent>
    </StyledAccordionItem>
  );
}
