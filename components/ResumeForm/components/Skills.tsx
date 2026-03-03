import { useFormContext } from 'react-hook-form';
import type { TResumeForm } from '@/types/schema';
import SectionTitle from './SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { PlusSignIcon, Delete01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  StyledAccordion,
  StyledAccordionItem,
  StyledAccordionTrigger,
  StyledAccordionContent
} from './UI/section-accordion';

/** Returns next available default category label. */
function getNextCategoryName(skills: TResumeForm['skills']) {
  let i = 1;
  const names = new Set(skills.map((category) => category.name));
  while (names.has(`New Category ${i}`)) i += 1;
  return `New Category ${i}`;
}

/** Returns category with trimmed values and empty skills removed. */
function sanitizeCategory(skills: string[]) {
  return skills.map((skill) => skill.trim()).filter(Boolean);
}

export default function Skills() {
  const { watch, setValue } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const categories = watch('skills') ?? [];

  const updateSkills = (next: TResumeForm['skills']) => {
    setValue('skills', next, { shouldDirty: true, shouldTouch: true });
  };

  const addCategory = () => {
    updateSkills([
      ...categories,
      { name: getNextCategoryName(categories), values: [''] }
    ]);
  };

  const removeCategory = (categoryIndex: number) => {
    const next = categories.filter((_, index) => index !== categoryIndex);
    updateSkills(next);
  };

  const renameCategory = (categoryIndex: number, nextCategory: string) => {
    const trimmed = nextCategory.trim();
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

    updateSkills(next);
  };

  const addSkill = (categoryIndex: number) => {
    const next = [...categories];
    const category = next[categoryIndex];
    if (!category) return;
    next[categoryIndex] = { ...category, values: [...category.values, ''] };
    updateSkills(next);
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, value: string) => {
    const next = [...categories];
    const category = next[categoryIndex];
    if (!category) return;
    const nextCategoryValues = [...category.values];
    nextCategoryValues[skillIndex] = value;
    next[categoryIndex] = { ...category, values: nextCategoryValues };
    updateSkills(next);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const next = [...categories];
    const category = next[categoryIndex];
    if (!category) return;
    const nextCategory = category.values.filter((_, i) => i !== skillIndex);
    const sanitized = sanitizeCategory(nextCategory);
    if (sanitized.length === 0) {
      next.splice(categoryIndex, 1);
    } else {
      next[categoryIndex] = { ...category, values: sanitized };
    }
    updateSkills(next);
  };

  /** Moves a category up/down while preserving current category-skill mapping. */
  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= categories.length || fromIndex === toIndex) return;
    const next = [...categories];
    const [moved] = next.splice(fromIndex, 1);
    if (!moved) return;
    next.splice(toIndex, 0, moved);
    updateSkills(next);
  };

  /** Confirms before deleting an entire category block. */
  const confirmRemoveCategory = async (categoryName: string, categoryIndex: number) => {
    const ok = await confirm({
      title: 'Delete category?',
      description: `This will remove "${categoryName}" and all skills in it.`,
      confirmLabel: 'Delete category',
      variant: 'destructive'
    });
    if (!ok) return;
    removeCategory(categoryIndex);
  };

  /** Confirms before deleting a single skill row. */
  const confirmRemoveSkill = async (
    categoryName: string,
    categoryIndex: number,
    skillIndex: number
  ) => {
    const skillLabel = (categories[categoryIndex]?.values?.[skillIndex] ?? '').trim();
    const ok = await confirm({
      title: 'Delete skill?',
      description: skillLabel
        ? `This will remove "${skillLabel}" from "${categoryName}".`
        : `This will remove this skill from "${categoryName}".`,
      confirmLabel: 'Delete skill',
      variant: 'destructive'
    });
    if (!ok) return;
    removeSkill(categoryIndex, skillIndex);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Skills</SectionTitle>
        <Button type="button" onClick={addCategory}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Add a category like Languages, AI Tools, or Soft Skills.
        </p>
      ) : (
        <StyledAccordion
          defaultValue={categories.length ? ['skill-category-0'] : []}
        >
          {categories.map((category, index) => (
            <StyledAccordionItem
              key={`${category.name}-${index}`}
              value={`skill-category-${index}`}
            >
              <StyledAccordionTrigger
                label={category.name || `Category ${index + 1}`}
                onDelete={() => confirmRemoveCategory(category.name, index)}
                onMoveUp={() => moveCategory(index, index - 1)}
                onMoveDown={() => moveCategory(index, index + 1)}
                disableMoveUp={index === 0}
                disableMoveDown={index === categories.length - 1}
              />
              <StyledAccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Category
                    </p>
                    <Input
                      className="h-11 border-dashed text-base font-semibold"
                      defaultValue={category.name}
                      onBlur={(e) => renameCategory(index, e.target.value)}
                      placeholder="e.g. Programming Languages"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Skills
                    </p>
                    {category.values.map((skill, skillIndex) => (
                      <div
                        key={`${category.name}-${skillIndex}`}
                        className="flex items-center gap-2"
                      >
                        <Input
                          className="h-11 border-dashed text-base"
                          value={skill}
                          onChange={(e) =>
                            updateSkill(index, skillIndex, e.target.value)
                          }
                          placeholder="e.g. React"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            confirmRemoveSkill(category.name, index, skillIndex)
                          }
                        >
                          <HugeiconsIcon
                            icon={Delete01Icon}
                            className="h-4 w-4"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addSkill(index)}
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </div>
              </StyledAccordionContent>
            </StyledAccordionItem>
          ))}
        </StyledAccordion>
      )}
    </div>
  );
}
