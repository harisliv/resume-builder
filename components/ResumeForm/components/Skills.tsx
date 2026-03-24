import { nanoid } from 'nanoid';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { TResumeForm } from '@/types/schema';
import SectionTitle from './styles/section-title';
import { Button } from '@/components/ui/button';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { StyledAccordion } from './styles/section-accordion';
import SkillCategoryItem from './SkillCategoryItem';

/** Returns next available default category label. */
function getNextCategoryName(skills: TResumeForm['skills']) {
  let i = 1;
  const names = new Set(skills.map((category) => category.name));
  while (names.has(`New Category ${i}`)) i += 1;
  return `New Category ${i}`;
}

export default function Skills() {
  const { getValues, setValue } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const { fields, append, remove, swap } = useFieldArray<TResumeForm, 'skills'>({
    name: 'skills'
  });

  /** Confirms before deleting an entire category block. */
  const confirmRemoveCategory = async (
    categoryName: string,
    categoryIndex: number
  ) => {
    const ok = await confirm({
      title: 'Delete category?',
      description: `This will remove "${categoryName}" and all skills in it.`,
      confirmLabel: 'Delete category',
      variant: 'destructive'
    });
    if (!ok) return;
    remove(categoryIndex);
  };

  /** Moves a category up/down. */
  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= fields.length || fromIndex === toIndex)
      return;
    swap(fromIndex, toIndex);
  };

  /** Renames category; merges if target name already exists. */
  const renameCategory = (categoryIndex: number, nextCategory: string) => {
    const trimmed = nextCategory.trim();
    const categories = getValues('skills') ?? [];
    const previous = categories[categoryIndex];
    if (!previous || !trimmed || trimmed === previous.name) return;

    const existingTargetIndex = categories.findIndex(
      (category, index) => index !== categoryIndex && category.name === trimmed
    );
    const next = [...categories];

    if (existingTargetIndex >= 0) {
      const existing = next[existingTargetIndex];
      if (!existing) return;
      next[existingTargetIndex] = {
        ...existing,
        values: [...existing.values, ...previous.values]
      };
      next.splice(categoryIndex, 1);
    } else {
      next[categoryIndex] = { ...previous, name: trimmed };
    }

    setValue('skills', next, { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Skills</SectionTitle>
        <Button
          type="button"
          onClick={() =>
            append({
              id: nanoid(),
              name: getNextCategoryName(getValues('skills') ?? []),
              values: [{ id: nanoid(), value: '' }]
            })
          }
        >
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Add a category like Languages, AI Tools, or Soft Skills.
        </p>
      ) : (
        <StyledAccordion
          defaultValue={fields.length ? ['skill-category-0'] : []}
        >
          {fields.map((field, index) => (
            <SkillCategoryItem
              key={field.id}
              index={index}
              categoryName={field.name ?? ''}
              totalCategories={fields.length}
              onDelete={() =>
                confirmRemoveCategory(field.name ?? '', index)
              }
              onMoveUp={() => moveCategory(index, index - 1)}
              onMoveDown={() => moveCategory(index, index + 1)}
              onRename={(newName) => renameCategory(index, newName)}
            />
          ))}
        </StyledAccordion>
      )}
    </div>
  );
}
